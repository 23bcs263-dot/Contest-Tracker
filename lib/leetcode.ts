import type { Contest, ContestQuestion, ContestType } from "@/types/contest";

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql/";

interface ContestNode {
  title: string;
  titleSlug: string;
  startTime: number;
}

interface ContestHistoryNode {
  attended: boolean;
  problemsSolved: number;
  contest: ContestNode;
}

interface QuestionNode {
  questionId: string;
  title: string;
  titleSlug: string;
}

interface AcceptedSubmission {
  titleSlug: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

async function queryLeetCode<T>(query: string, variables?: Record<string, string | number>): Promise<T> {
  const response = await fetch(LEETCODE_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`LeetCode returned HTTP ${response.status}`);
  const result = (await response.json()) as GraphQLResponse<T>;
  if (result.errors?.length || !result.data) throw new Error(result.errors?.[0]?.message ?? "LeetCode returned no data");
  return result.data;
}

async function getSolvedSlugs(username: string): Promise<Set<string>> {
  const data = await queryLeetCode<{ recentAcSubmissionList: AcceptedSubmission[] }>(
    "query recentAccepted($username: String!, $limit: Int!) { recentAcSubmissionList(username: $username, limit: $limit) { titleSlug } }",
    { username, limit: 1000 },
  );
  return new Set(data.recentAcSubmissionList.map((submission) => submission.titleSlug));
}

async function getContestQuestions(contestSlug: string, solvedSlugs: Set<string>): Promise<ContestQuestion[]> {
  const data = await queryLeetCode<{ contestQuestionList: QuestionNode[] }>(
    "query contestQuestionList($contestSlug: String!) { contestQuestionList(contestSlug: $contestSlug) { questionId title titleSlug } }",
    { contestSlug },
  );

  return data.contestQuestionList.slice(0, 4).map((question, index) => ({
    number: index + 1,
    title: question.title,
    slug: question.titleSlug,
    difficulty: "Unknown",
    solved: solvedSlugs.has(question.titleSlug),
  }));
}

export async function getLeetCodeContests(username: string, page = 1, pageSize = 8): Promise<{ contests: Contest[]; totalContests: number; totalQuestions: number; solvedQuestions: number; completedContests: number }> {
  const solvedSlugs = await getSolvedSlugs(username);
  const [contestData, historyData] = await Promise.all([
    queryLeetCode<{ allContests: ContestNode[] }>("query { allContests { title titleSlug startTime } }"),
    queryLeetCode<{ userContestRankingHistory: ContestHistoryNode[] }>(
      "query contestHistory($username: String!) { userContestRankingHistory(username: $username) { attended problemsSolved contest { title titleSlug startTime } } }",
      { username },
    ),
  ]);
  const history = new Map(historyData.userContestRankingHistory.filter((entry) => entry.attended).map((entry) => [entry.contest.titleSlug, entry]));
  const contestNodes = contestData.allContests.filter((contest) =>
    contest.startTime <= Math.floor(Date.now() / 1000) &&
    (contest.title.startsWith("Weekly Contest") || contest.title.startsWith("Biweekly Contest")),
  ).sort((left, right) => right.startTime - left.startTime);
  const attendedEntries = [...history.values()];
  const totalQuestions = contestNodes.length * 4;
  const solvedQuestions = attendedEntries.reduce((total, entry) => total + entry.problemsSolved, 0);
  const completedContests = attendedEntries.filter((entry) => entry.problemsSolved >= 4).length;
  const startIndex = Math.max(0, (page - 1) * pageSize);
    const pageNodes = contestNodes.slice(startIndex, startIndex + pageSize);
      const pageContests = await Promise.all(pageNodes.map(async (contest, pageIndex) => {
        const historyEntry = history.get(contest.titleSlug);
      const questions = await getContestQuestions(contest.titleSlug, solvedSlugs);
      const type: ContestType = contest.title.startsWith("Weekly") ? "WEEKLY" : "BIWEEKLY";
      const contestNumber = Number(contest.title.match(/\d+$/)?.[0] ?? startIndex + pageIndex + 1);

      return {
        id: contestNumber,
        contestNumber,
        name: contest.title,
        type,
        date: new Date(contest.startTime * 1000).toISOString().slice(0, 10),
        questions,
        solvedCount: historyEntry?.problemsSolved ?? 0,
      } satisfies Contest;
    }));

  return { contests: pageContests, totalContests: contestNodes.length, totalQuestions, solvedQuestions, completedContests };
}