interface User {
  id: string;
  email: string;
  user_name: string;
  user_image: string;
  role: string;
  is_active: boolean;
  is_blocked: boolean;
  created_date: Date;
  updated_date: Date;
  updated_token: string;
}

interface Token {
  accessToken: string
  refreshToken: string
}

interface UserState {
  user: User | null;
  token: Token | null;
  isLoggedIn: boolean;
}

export type { User, Token, UserState};
