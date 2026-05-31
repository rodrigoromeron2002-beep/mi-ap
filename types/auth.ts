export type AuthUser = {
  id: string;
  email?: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  user: AuthUser;
};
