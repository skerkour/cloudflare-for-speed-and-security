

export type User = {
  id: string;
  created_at: Date;
  updated_at: Date;

  email: string;
  password_hash: string;
  is_admin: boolean;
};
