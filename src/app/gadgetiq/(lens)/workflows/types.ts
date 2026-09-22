export interface WorkflowOption {
  id: number;
  label: string;
  score: number;
  orderIdx?: number;
}

export interface WorkflowQuestion {
  id: number;
  title: string;
  multiSelect?: boolean;
  orderIdx?: number;
  options: WorkflowOption[];
}

export interface WorkflowSection {
  id: number;
  title: string;
  orderIdx?: number;
  questions: WorkflowQuestion[];
}

export interface DiagnosticWorkflow {
  id: number;
  name: string;
  osType: string;
  isDefault?: boolean;
  sections?: WorkflowSection[];
  createdAt?: string;
}

// Aliases
export type OptionItem = WorkflowOption;
export type QuestionItem = WorkflowQuestion;
export type SectionItem = WorkflowSection;
export type WorkflowItem = DiagnosticWorkflow;
