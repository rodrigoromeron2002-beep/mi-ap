export type Language = "es" | "de" | "it" | "pt" | "zh" | "fr" | "en";

export type PlanForm = {
  goal: string;
  level: string;
  days: string;
  place: string;
  time: string;
  language: Language;
};

export type Plan = PlanForm & {
  id: string;
  createdAt: string;
  updatedAt?: string;
  favorite?: boolean;
  tags?: string[];
  routine: string;
  nutrition: string;
  mindset: string;
};

export type PlanEditableFields = Pick<Plan, "routine" | "nutrition" | "mindset" | "tags">;

export type HistorySortMode = "recent" | "favorites" | "goal";

export type CoachMessage = {
  id: string;
  role: "user" | "coach";
  text: string;
  createdAt: string;
};

export type LanguageOption = {
  label: string;
  name: string;
  value: Language;
};
