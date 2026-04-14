export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'institute';
  institutionId?: string;
}

export interface Institution {
  id: string;
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  establishedYear: number;
  accreditationStatus: 'pending' | 'accredited' | 'not-accredited';
  createdAt: string;
}

export interface SectionData {
  id: string;
  sectionNumber: string;
  title: string;
  maxMarks: number;
  instituteMarks: number;
  content: string; // Rich text content
  attachments: string[]; // File paths/URLs
  isCompleted: boolean;
  lastModified: string;
  subsections?: SubSectionData[];
}

export interface SubSectionData {
  id: string;
  subSectionNumber: string;
  title: string;
  maxMarks: number;
  instituteMarks: number;
  content: string;
  attachments: string[];
  isCompleted: boolean;
  lastModified: string;
  tables?: string[];
  images?: string[];
}

export interface Criteria {
  id: string;
  criteriaNumber: number;
  title: string;
  description: string;
  maxMarks: number;
  sections: SectionData[];
  completedSections: number;
  totalMarks: number;
  obtainedMarks: number;
}

export interface SARApplication {
  id: string;
  applicationId: string;
  institutionId: string;
  departmentName: string;
  applicationStartDate: string;
  applicationEndDate: string;
  status: 'draft' | 'in-progress' | 'completed' | 'submitted' | 'under-review' | 'approved' | 'rejected';
  completionPercentage: number;
  criteria: Criteria[];
  overallMarks: number;
  maxOverallMarks: number;
  lastModified: string;
  submittedAt?: string;
  reviewedAt?: string;
  approvedAt?: string;
}

export interface Application {
  id: string;
  institutionId: string;
  type: 'initial' | 'renewal';
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected';
  submittedAt?: string;
  reviewedAt?: string;
  approvedAt?: string;
}