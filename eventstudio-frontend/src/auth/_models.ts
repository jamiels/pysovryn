//TODO: Checked
export interface AuthModel {
  user: UserModel;
  accessToken: string;
  refreshToken: string;
}

export interface UserModel {
  userId: number;
  name: string;
  email: string;
  role: string;
  profileImageURL: string;
  spaceId: number;
  updated_at: string;
  created_at: string;
}
