import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra;

export const DEV_UNLOCK_PRO = extra?.devUnlockPro === true;
