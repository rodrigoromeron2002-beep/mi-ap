const appJson = require("./app.json");

module.exports = ({ config }) => {
  const expoConfig = appJson.expo;

  return {
    ...config,
    ...expoConfig,
    extra: {
      ...config.extra,
      ...expoConfig.extra,
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? expoConfig.extra.apiBaseUrl,
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? expoConfig.extra.supabaseUrl,
      supabaseAnonKey:
        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? expoConfig.extra.supabaseAnonKey,
      devUnlockPro:
        process.env.EXPO_PUBLIC_DEV_UNLOCK_PRO === "true" || expoConfig.extra.devUnlockPro,
    },
  };
};
