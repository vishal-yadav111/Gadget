export interface ContactInquiry {
  id: number | string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  device?: string | null;
  volume?: string | null;
  message?: string | null;
  createdAt?: string;
}

export interface DemoRequestFilter {
  limit?: number;
  offset?: number;
}

// Aliases
export type ContactEntryItem = ContactInquiry;
