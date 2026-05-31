export type ProgressEntry = {
  id: string;
  planId?: string;
  planGoal?: string;
  minutes: number;
  note?: string;
  completedAt: string;
};

export type ProgressStats = {
  totalSessions: number;
  weeklySessions: number;
  totalMinutes: number;
  currentStreak: number;
  lastCompletedAt?: string;
};
