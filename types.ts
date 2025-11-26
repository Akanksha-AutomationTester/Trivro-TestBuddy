

export enum AppMode {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  TEST_CASE_GEN = 'TEST_CASE_GEN',
  BUG_REPORT_GEN = 'BUG_REPORT_GEN',
  PRICING = 'PRICING',
  ADMIN_PANEL = 'ADMIN_PANEL',
  AUTH = 'AUTH',
}

export interface GenerationResult {
  content: string;
  timestamp: Date;
  type: 'test-case' | 'bug-report' | 'screen-analysis';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface User {
  email: string;
  name: string;
}