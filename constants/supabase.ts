import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra;

export const SUPABASE_URL =
  typeof extra?.supabaseUrl === "string" ? extra.supabaseUrl.replace(/\/$/, "") : "";

export const SUPABASE_ANON_KEY =
  typeof extra?.supabaseAnonKey === "string" ? extra.supabaseAnonKey : "";

export const SUPABASE_CONFIGURED =
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
