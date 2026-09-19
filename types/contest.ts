export type ContestType = "WEEKLY" | "BIWEEKLY";

export interface ContestQuestion {
  number: number;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Unknown";
  solved: boolean;
}

export interface Contest {
  id: number;
  contestNumber: number;
  name: string;
  type: ContestType;
  date: string;
  questions: ContestQuestion[];
  solvedCount?: number;
}