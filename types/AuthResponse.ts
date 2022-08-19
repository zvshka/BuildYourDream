import { User } from './User';

export interface AuthResponse {
  user: User;
  accessToken: string;
}
