export interface TenantCompany {
  id: number | string;
  name: string;
  code: string;
  description?: string | null;
  isActive?: boolean;
  createdAt?: string;
}

export interface CreateCompanyPayload {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateCompanyPayload {
  name: string;
  code: string;
  description?: string;
  isActive?: boolean;
}

// Aliases
export type CompanyItem = TenantCompany;
