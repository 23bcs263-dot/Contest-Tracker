import { NextResponse } from "next/server";
import { getLeetCodeContests, getLeetCodeUsername } from "@/lib/leetcode";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestedPage = Number(new URL(request.url).searchParams.get("page") ?? "1");
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  try {
    const username = await getLeetCodeUsername();
    const result = await getLeetCodeContests(username, page, 8);
    return NextResponse.json({ username, ...result, page, pageSize: 8 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load this LeetCode profile.";
    console.error("LeetCode profile request failed:", message);
    return NextResponse.json({ error: "Could not load the LeetCode account from the server credentials. Check that .env.local is configured and restart the server." }, { status: 502 });
  }
}