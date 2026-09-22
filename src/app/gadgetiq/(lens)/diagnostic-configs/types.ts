export interface DiagnosticTestItemConfig {
  id?: string | number;
  key?: string;
  testKey?: string;
  keys?: string[];
  label: string;
  deviceType?: string;
  passScore?: number;
  failScore?: number;
  naScore?: number;
  maxScore?: number;
  isActive?: boolean;
  companyId?: string | number | null;
  createdAt?: string;
  updatedAt?: string;
  sortOrder?: number;
}

export interface FunctionalGradeThreshold {
  id?: string | number;
  grade: string;
  label?: string;
  description?: string;
  minScore: number;
  maxScore: number;
  isActive?: boolean;
  companyId?: string | number | null;
}

export interface CosmeticGradeRule {
  id?: string | number;
  grade: string;
  label?: string;
  description?: string;
  minScore: number;
  maxScore: number;
  isActive?: boolean;
  companyId?: string | number | null;
}

export interface CosmeticConfigPayload {
  weightage: {
    bodyWeightage: number;
    screenWeightage: number;
  };
  gradeRules: CosmeticGradeRule[];
}
