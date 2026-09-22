export interface LensUserRecord {
  id: number | string;
  name?: string | null;
  username: string;
  email?: string | null;
  role: string;
  companyId?: number | string | null;
  companyName?: string | null;
  reportCount?: number | null;
  company?: {
    id: number | string;
    name: string;
    code: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserPayload {
  name: string;
  username: string;
  email: string;
  password?: string;
  role: string;
  companyId?: number | string | null;
}

export interface UpdateUserPayload {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  companyId?: number | string | null;
}

// Aliases
export type UserItem = LensUserRecord;
