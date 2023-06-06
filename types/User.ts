export interface User {
  bio: string | null;
  id: string;
  email: string;
  emailVerification?: any;
  avatarUrl: string | null;
  username: string;
  role: string;
  isBanned: boolean;
  createdAt: any;
  updatedAt: any;
}
