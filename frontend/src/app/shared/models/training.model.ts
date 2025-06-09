export type ModeType = 'online' | 'office' | 'hybrid';

export interface ModeDetails {
  duration: string;
  fee: string;
  content: string;
  permonth?: string;
  batchSize?: number;
  highlights: string[];
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  preferredFor?: string;
  content?: string;
  duration?: string;
  eligibility?: string;
  weekPlan?: string;
  modes: Record<ModeType, ModeDetails>;
}
