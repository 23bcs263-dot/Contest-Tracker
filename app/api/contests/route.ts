import { NextResponse } from "next/server";
import { getLeetCodeContests } from "@/lib/leetcode";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const username = new URL(request.url).searchParams.get("username")?.trim() ?? "";
  const requestedPage = Number(new URL(request.url).searchParams.get("page") ?? "1");
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  if (!/^[A-Za-z0-9_-]{1,30}$/.test(username)) {
    return NextResponse.json({ error: "Enter a valid LeetCode username." }, { status: 400 });
  }

  try {
    const result = await getLeetCodeContests(username, page, 8);
    return NextResponse.json({ username, ...result, page, pageSize: 8 });
  } catch {
    return NextResponse.json({ error: "Could not load this LeetCode profile." }, { status: 502 });
  }
}