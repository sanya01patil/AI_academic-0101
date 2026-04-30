import { ShapFactor } from './Submission';

export interface SHAPExplanation {
  submissionId: string;
  summaryText: string;
  signals: ShapFactor[];
  baseValue: number;
  modelOutput: number;
}

export interface SHAPGlobalImportance {
  feature: string;
  importance: number;
}
