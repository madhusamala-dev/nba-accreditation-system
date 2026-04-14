// Pre-Qualifier data management using localStorage

export interface PreQualifierData {
  id: string;
  institutionId: string;
  status: 'draft' | 'in-progress' | 'submitted';
  completionPercentage: number;
  lastModified: string;
  submittedAt?: string;

  // Part A - Institute Profile
  programAppliedFor: string;
  // A1
  instituteName: string;
  yearOfEstablishment: string;
  location: string;
  // A2
  city: string;
  state: string;
  pinCode: string;
  website: string;
  email: string;
  phone: string;
  // A3
  headName: string;
  headDesignation: string;
  headAppointmentStatus: string;
  // A4
  headMobile: string;
  headTelephone: string;
  headEmail: string;
  // A5
  universityName: string;
  universityCity: string;
  universityState: string;
  universityPinCode: string;
  // A6
  institutionType: string;
  institutionTypeOther: string;
  // A7
  ownershipStatus: string;
  ownershipStatusOther: string;
  // A8
  numUGPrograms: string;
  numPGPrograms: string;
  programsOffered: ProgramOffered[];
  // A9
  programsForAccreditation: ProgramForAccreditation[];
  alliedDepartments: AlliedDepartment[];

  // Part B - Program Information
  programDetails: ProgramDetail[];
  // B2
  facultyDetails: FacultyRow[];
  // B2.1
  facultyDepartmentName: string;
  numAlliedDepartments: string;
  numUGEnggPrograms: string;
  numPGEnggPrograms: string;
  facultyCadre: FacultyCadreRow[];
  // B2.2
  hodName: string;
  hodAppointment: string;
  hodQualification: string;
  hodQualificationOther: string;
  // B3
  sfrData: SFRData;

  // Compliance Status
  complianceStatus: ComplianceRow[];
}

export interface ProgramOffered {
  id: string;
  level: string;
  name: string;
  yearOfStart: string;
  yearOfClose: string;
  department: string;
}

export interface ProgramForAccreditation {
  id: string;
  department: string;
  program: string;
}

export interface AlliedDepartment {
  id: string;
  department: string;
  alliedDepartment: string;
}

export interface ProgramDetail {
  id: string;
  programName: string;
  yearOfStart: string;
  sanctionedIntake: string;
  intakeChange: string;
  yearOfChange: string;
  aicteApproval: string;
  accreditationStatus: string;
  timesAccredited: string;
}

export interface FacultyRow {
  id: string;
  name: string;
  panNo: string;
  apaarId: string;
  highestDegree: string;
  university: string;
  specialization: string;
  dateOfJoining: string;
  designationAtJoining: string;
  dateOfJoiningDept: string;
  presentDesignation: string;
  dateDesignated: string;
  associationNature: string;
  contractType: string;
  currentlyAssociated: string;
  dateOfLeaving: string;
  experience: string;
}

export interface FacultyCadreRow {
  id: string;
  designation: string;
  cayRegular: string;
  cayContract: string;
  caym1Regular: string;
  caym1Contract: string;
}

export interface SFRData {
  ugPrograms: SFRProgramRow[];
  pgPrograms: SFRProgramRow[];
  cayDS: string;
  caym1DS: string;
  caym2DS: string;
  cayAS: string;
  caym1AS: string;
  caym2AS: string;
  cayDF: string;
  caym1DF: string;
  caym2DF: string;
  cayAF: string;
  caym1AF: string;
  caym2AF: string;
  cayFF: string;
  caym1FF: string;
  caym2FF: string;
}

export interface SFRProgramRow {
  id: string;
  programName: string;
  cayB: string;
  cayC: string;
  cayD: string;
  caym1B: string;
  caym1C: string;
  caym1D: string;
  caym2B: string;
  caym2C: string;
  caym2D: string;
}

export interface ComplianceRow {
  id: string;
  qualifier: string;
  currentStatus: string;
  complianceStatus: string;
}

const PQ_STORAGE_KEY = 'compliedu_prequalifier';

export function getDefaultComplianceRows(): ComplianceRow[] {
  return [
    {
      id: '1',
      qualifier: 'Whether approval of the competent authority (Approval of AICTE/UGC/BoG of Universities/Deemed Universities etc.) for the program under consideration has been obtained for the previous five years, starting from the current academic year',
      currentStatus: '',
      complianceStatus: '',
    },
    {
      id: '2',
      qualifier: 'Whether the Student Faculty Ratio (SFR) in the Department and allied Departments is less than or equal to 25:1, averaged over three academic years: Current Academic Year (CAY), Current Academic Year Minus One (CAYm1), and Current Academic Year Minus Two (CAYm2)',
      currentStatus: '',
      complianceStatus: '',
    },
    {
      id: '3',
      qualifier: 'Whether the program under consideration needs either 2 Professors or 1 Professor and 1 Associate Professor on a regular basis with Ph.D. degree in the current academic year (CAY) and the previous academic year (CAYm1)',
      currentStatus: '',
      complianceStatus: '',
    },
    {
      id: '4',
      qualifier: 'Whether the number of faculty having Ph.D degree available in the Department & allied Departments is greater than or equal to 20% of the required number of faculty averaged over two academic years i.e. Current Academic Year (CAY) and Current Academic Year Minus One (CAYm1)',
      currentStatus: '',
      complianceStatus: '',
    },
    {
      id: '5',
      qualifier: 'Whether two batches have passed out in the program under consideration',
      currentStatus: '',
      complianceStatus: '',
    },
    {
      id: '6',
      qualifier: 'Whether the HOD of the department in which the program under consideration is running is appointed on regular basis and possesses PhD degree in the Current Academic Year (CAY)',
      currentStatus: '',
      complianceStatus: '',
    },
  ];
}

export function createDefaultPreQualifier(institutionId: string): PreQualifierData {
  return {
    id: `pq-${institutionId}-${Date.now()}`,
    institutionId,
    status: 'draft',
    completionPercentage: 0,
    lastModified: new Date().toISOString(),
    programAppliedFor: '',
    instituteName: '',
    yearOfEstablishment: '',
    location: '',
    city: '',
    state: '',
    pinCode: '',
    website: '',
    email: '',
    phone: '',
    headName: '',
    headDesignation: '',
    headAppointmentStatus: '',
    headMobile: '',
    headTelephone: '',
    headEmail: '',
    universityName: '',
    universityCity: '',
    universityState: '',
    universityPinCode: '',
    institutionType: '',
    institutionTypeOther: '',
    ownershipStatus: '',
    ownershipStatusOther: '',
    numUGPrograms: '',
    numPGPrograms: '',
    programsOffered: [{ id: '1', level: '', name: '', yearOfStart: '', yearOfClose: '', department: '' }],
    programsForAccreditation: [{ id: '1', department: '', program: '' }],
    alliedDepartments: [{ id: '1', department: '', alliedDepartment: '' }],
    programDetails: [{
      id: '1', programName: '', yearOfStart: '', sanctionedIntake: '',
      intakeChange: '', yearOfChange: '', aicteApproval: '', accreditationStatus: '', timesAccredited: ''
    }],
    facultyDetails: [],
    facultyDepartmentName: '',
    numAlliedDepartments: '',
    numUGEnggPrograms: '',
    numPGEnggPrograms: '',
    facultyCadre: [
      { id: '1', designation: 'No. of Professors with Ph.D. Degree', cayRegular: '', cayContract: '', caym1Regular: '', caym1Contract: '' },
      { id: '2', designation: 'No. of Associate Professors with Ph.D. Degree', cayRegular: '', cayContract: '', caym1Regular: '', caym1Contract: '' },
      { id: '3', designation: 'No. of Assistant Professors', cayRegular: '', cayContract: '', caym1Regular: '', caym1Contract: '' },
      { id: '4', designation: 'Total no. of faculty members with Ph.D. degree (as per AICTE norms)', cayRegular: '', cayContract: '', caym1Regular: '', caym1Contract: '' },
    ],
    hodName: '',
    hodAppointment: '',
    hodQualification: '',
    hodQualificationOther: '',
    sfrData: {
      ugPrograms: [],
      pgPrograms: [],
      cayDS: '', caym1DS: '', caym2DS: '',
      cayAS: '', caym1AS: '', caym2AS: '',
      cayDF: '', caym1DF: '', caym2DF: '',
      cayAF: '', caym1AF: '', caym2AF: '',
      cayFF: '', caym1FF: '', caym2FF: '',
    },
    complianceStatus: getDefaultComplianceRows(),
  };
}

export function savePreQualifier(data: PreQualifierData): void {
  const allData = getAllPreQualifiers();
  const index = allData.findIndex(pq => pq.id === data.id);
  if (index >= 0) {
    allData[index] = { ...data, lastModified: new Date().toISOString() };
  } else {
    allData.push({ ...data, lastModified: new Date().toISOString() });
  }
  localStorage.setItem(PQ_STORAGE_KEY, JSON.stringify(allData));
}

export function getAllPreQualifiers(): PreQualifierData[] {
  try {
    const stored = localStorage.getItem(PQ_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getPreQualifiersByInstitution(institutionId: string): PreQualifierData[] {
  return getAllPreQualifiers().filter(pq => pq.institutionId === institutionId);
}

export function getPreQualifierById(id: string): PreQualifierData | undefined {
  return getAllPreQualifiers().find(pq => pq.id === id);
}

export function isPreQualifierSubmitted(institutionId: string): boolean {
  const pqs = getPreQualifiersByInstitution(institutionId);
  return pqs.some(pq => pq.status === 'submitted');
}

export function calculatePQProgress(data: PreQualifierData): number {
  let filled = 0;
  const total = 20;

  if (data.programAppliedFor) filled++;
  if (data.instituteName) filled++;
  if (data.yearOfEstablishment) filled++;
  if (data.city && data.state) filled++;
  if (data.email || data.phone) filled++;
  if (data.headName) filled++;
  if (data.headMobile || data.headEmail) filled++;
  if (data.universityName) filled++;
  if (data.institutionType) filled++;
  if (data.ownershipStatus) filled++;
  if (data.programsOffered.some(p => p.name)) filled++;
  if (data.programsForAccreditation.some(p => p.program)) filled++;
  if (data.programDetails.some(p => p.programName)) filled++;
  if (data.facultyCadre.some(f => f.cayRegular || f.cayContract)) filled++;
  if (data.hodName) filled++;
  if (data.hodQualification) filled++;
  if (data.sfrData.cayDS || data.sfrData.cayDF) filled++;
  if (data.complianceStatus.some(c => c.complianceStatus)) filled++;
  if (data.complianceStatus.filter(c => c.complianceStatus).length >= 3) filled++;
  if (data.complianceStatus.filter(c => c.complianceStatus).length >= 6) filled++;

  return Math.round((filled / total) * 100);
}