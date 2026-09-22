/**
 * Gadget Evaluate (XC-QC) Auth & Session Types
 */

export interface EvaluateAuthUser {
  id: number;
  username: string;
  fullName?: string | null;
  email?: string | null;
  mobile?: string | null;
  role?: string | null;
  companyId?: string | null;
  storeId?: number | null;
  storeType?: string | null;
  webUserId?: number | null;
}

export interface SalePartner {
  MstRegID: number;
  PartnerCode: string;
  PartnerName?: string;
  Company_Name?: string;
  Contact_person_name?: string;
  Registration_ID?: string;
  StoreName?: string;
  Mobile?: string;
  Mobile_no?: string;
  Email?: string;
  Email_ID?: string;
  Address?: string;
  IsActive?: boolean;
}

export interface EvaluateApiResponse<T = any> {
  success?: boolean;
  code?: number;
  message?: string;
  DATA?: T;
  data?: T;
  status?: string;
}
