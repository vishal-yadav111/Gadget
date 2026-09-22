export interface LensAuthUser {
  id: string | number;
  fullName?: string | null;
  name?: string | null;
  username: string;
  email?: string | null;
  mobile?: string | null;
  role?: string | null;
  companyId?: string | number | null;
  storeId?: number | null;
  storeType?: string | null;
  webUserId?: number | null;
  createdAt?: string;
}

export interface ProjectScopeItem {
  projectId: number;
  projectCode: string;
  projectName: string;
  description: string;
}

export interface ProjectAccessScope {
  hasMultipleProjects: boolean;
  activeProject: string;
  totalProjects: number;
  allowedProjects: ProjectScopeItem[];
}

export interface LensLoginResult {
  token: string;
  user: LensAuthUser;
  projectAccess: ProjectAccessScope;
}
