export interface CertificateReport {
  id: number | string;
  deviceModel?: string | null;
  deviceImei?: string | null;
  serialNumber?: string | null;
  grade?: string | null;
  createdAt?: string;
  [key: string]: any;
}
