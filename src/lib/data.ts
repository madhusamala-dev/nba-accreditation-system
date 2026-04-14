import { Institution, SARApplication, Application, Criteria, SectionData } from './types';

// Mock institutions data
export const institutions: Institution[] = [
  {
    id: '1',
    name: 'RGUKT Basar',
    address: 'Basar, Nirmal District, Telangana',
    contactEmail: 'admin@rguktbasar.ac.in',
    contactPhone: '+91-8734-123456',
    establishedYear: 2008,
    accreditationStatus: 'pending',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'VIT University',
    address: 'Vellore, Tamil Nadu',
    contactEmail: 'admin@vit.ac.in',
    contactPhone: '+91-416-220-2020',
    establishedYear: 1984,
    accreditationStatus: 'accredited',
    createdAt: '2024-01-20T14:15:00Z'
  },
  {
    id: '3',
    name: 'IIT Hyderabad',
    address: 'Kandi, Sangareddy, Telangana',
    contactEmail: 'admin@iith.ac.in',
    contactPhone: '+91-40-2301-6000',
    establishedYear: 2008,
    accreditationStatus: 'accredited',
    createdAt: '2024-02-01T09:00:00Z'
  }
];

// NBA Criteria 1 Template - Exact NBA structure
const createCriteria1Template = (): Criteria => ({
  id: 'criteria-1',
  criteriaNumber: 1,
  title: 'Vision, Mission and Program Educational Objectives',
  description: 'Assessment of institutional vision, mission, and program educational objectives',
  maxMarks: 60,
  sections: [
    {
      id: 'section-1-1',
      sectionNumber: '1.1',
      title: 'Vision and Mission',
      maxMarks: 5,
      instituteMarks: 0,
      content: '',
      attachments: [],
      isCompleted: false,
      lastModified: new Date().toISOString(),
      subsections: [
        {
          id: 'sub-1-1-vision-inst',
          subSectionNumber: '1.1',
          title: 'Vision of Institute',
          maxMarks: 1.25,
          instituteMarks: 0,
          content: '',
          attachments: [],
          isCompleted: false,
          lastModified: new Date().toISOString()
        },
        {
          id: 'sub-1-1-mission-inst',
          subSectionNumber: '1.1',
          title: 'Mission of Institute',
          maxMarks: 1.25,
          instituteMarks: 0,
          content: '',
          attachments: [],
          isCompleted: false,
          lastModified: new Date().toISOString()
        },
        {
          id: 'sub-1-1-vision-dept',
          subSectionNumber: '1.1',
          title: 'Vision of Department',
          maxMarks: 1.25,
          instituteMarks: 0,
          content: '',
          attachments: [],
          isCompleted: false,
          lastModified: new Date().toISOString()
        },
        {
          id: 'sub-1-1-mission-dept',
          subSectionNumber: '1.1',
          title: 'Mission of Department',
          maxMarks: 1.25,
          instituteMarks: 0,
          content: '',
          attachments: [],
          isCompleted: false,
          lastModified: new Date().toISOString()
        }
      ]
    },
    {
      id: 'section-1-2',
      sectionNumber: '1.2',
      title: 'Program Educational Objectives (PEOs)',
      maxMarks: 5,
      instituteMarks: 0,
      content: '',
      attachments: [],
      isCompleted: false,
      lastModified: new Date().toISOString(),
      subsections: [
        {
          id: 'sub-1-2-peo',
          subSectionNumber: '1.2',
          title: 'PEO Statements',
          maxMarks: 5,
          instituteMarks: 0,
          content: '',
          attachments: [],
          isCompleted: false,
          lastModified: new Date().toISOString()
        }
      ]
    },
    {
      id: 'section-1-3',
      sectionNumber: '1.3',
      title: 'Publication and Dissemination',
      maxMarks: 10,
      instituteMarks: 0,
      content: '',
      attachments: [],
      isCompleted: false,
      lastModified: new Date().toISOString(),
      subsections: [
        {
          id: 'sub-1-3-a',
          subSectionNumber: '1.3(A)',
          title: 'Adequacy in Publication',
          maxMarks: 2,
          instituteMarks: 0,
          content: '',
          attachments: [],
          isCompleted: false,
          lastModified: new Date().toISOString()
        },
        {
          id: 'sub-1-3-b',
          subSectionNumber: '1.3(B)',
          title: 'Process of Dissemination',
          maxMarks: 2,
          instituteMarks: 0,
          content: '',
          attachments: [],
          isCompleted: false,
          lastModified: new Date().toISOString(),
          tables: []
        },
        {
          id: 'sub-1-3-c',
          subSectionNumber: '1.3(C)',
          title: 'Awareness Among Stakeholders',
          maxMarks: 6,
          instituteMarks: 0,
          content: '',
          attachments: [],
          isCompleted: false,
          lastModified: new Date().toISOString(),
          tables: []
        }
      ]
    },
    {
      id: 'section-1-4',
      sectionNumber: '1.4',
      title: 'Process for Defining Vision, Mission & PEOs',
      maxMarks: 25,
      instituteMarks: 0,
      content: '',
      attachments: [],
      isCompleted: false,
      lastModified: new Date().toISOString(),
      subsections: [
        {
          id: 'sub-1-4-a',
          subSectionNumber: '1.4(A)',
          title: 'Vision & Mission Definition Process',
          maxMarks: 10,
          instituteMarks: 0,
          content: '',
          attachments: [],
          isCompleted: false,
          lastModified: new Date().toISOString(),
          images: []
        },
        {
          id: 'sub-1-4-b',
          subSectionNumber: '1.4(B)',
          title: 'PEO & PSO Definition Process',
          maxMarks: 15,
          instituteMarks: 0,
          content: '',
          attachments: [],
          isCompleted: false,
          lastModified: new Date().toISOString(),
          images: []
        }
      ]
    },
    {
      id: 'section-1-5',
      sectionNumber: '1.5',
      title: 'Consistency of PEOs with Mission',
      maxMarks: 15,
      instituteMarks: 0,
      content: '',
      attachments: [],
      isCompleted: false,
      lastModified: new Date().toISOString(),
      subsections: [
        {
          id: 'sub-1-5-a',
          subSectionNumber: '1.5(A)',
          title: 'Justification of Mapping',
          maxMarks: 10,
          instituteMarks: 0,
          content: '',
          attachments: [],
          isCompleted: false,
          lastModified: new Date().toISOString(),
          tables: []
        },
        {
          id: 'sub-1-5-b',
          subSectionNumber: '1.5(B)',
          title: 'Mapping Matrix',
          maxMarks: 5,
          instituteMarks: 0,
          content: '',
          attachments: [],
          isCompleted: false,
          lastModified: new Date().toISOString(),
          tables: []
        }
      ]
    }
  ],
  completedSections: 0,
  totalMarks: 60,
  obtainedMarks: 0
});

// NBA Criteria Template for Criteria 2-7
const createOtherCriteriaTemplates = (): Criteria[] => [
  {
    id: 'criteria-2',
    criteriaNumber: 2,
    title: 'Program Outcomes and Assessment',
    description: 'Assessment of program outcomes and their evaluation methods',
    maxMarks: 100,
    sections: [
      {
        id: 'section-2-1',
        sectionNumber: '2.1',
        title: 'Program Outcomes (POs)',
        maxMarks: 30,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      },
      {
        id: 'section-2-2',
        sectionNumber: '2.2',
        title: 'Program Specific Outcomes (PSOs)',
        maxMarks: 30,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      },
      {
        id: 'section-2-3',
        sectionNumber: '2.3',
        title: 'Assessment of Program Outcomes',
        maxMarks: 40,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      }
    ],
    completedSections: 0,
    totalMarks: 100,
    obtainedMarks: 0
  },
  {
    id: 'criteria-3',
    criteriaNumber: 3,
    title: 'Curriculum Design and Development',
    description: 'Assessment of curriculum design, development and implementation',
    maxMarks: 100,
    sections: [
      {
        id: 'section-3-1',
        sectionNumber: '3.1',
        title: 'Curriculum Design Process',
        maxMarks: 25,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      },
      {
        id: 'section-3-2',
        sectionNumber: '3.2',
        title: 'Course Structure and Syllabus',
        maxMarks: 25,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      },
      {
        id: 'section-3-3',
        sectionNumber: '3.3',
        title: 'Curriculum Implementation',
        maxMarks: 25,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      },
      {
        id: 'section-3-4',
        sectionNumber: '3.4',
        title: 'Curriculum Review and Update',
        maxMarks: 25,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      }
    ],
    completedSections: 0,
    totalMarks: 100,
    obtainedMarks: 0
  },
  {
    id: 'criteria-4',
    criteriaNumber: 4,
    title: 'Students Performance and Assessment',
    description: 'Assessment of student performance evaluation methods and outcomes',
    maxMarks: 100,
    sections: [
      {
        id: 'section-4-1',
        sectionNumber: '4.1',
        title: 'Student Admission Process',
        maxMarks: 20,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      },
      {
        id: 'section-4-2',
        sectionNumber: '4.2',
        title: 'Assessment Methods',
        maxMarks: 30,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      },
      {
        id: 'section-4-3',
        sectionNumber: '4.3',
        title: 'Student Performance Analysis',
        maxMarks: 30,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      },
      {
        id: 'section-4-4',
        sectionNumber: '4.4',
        title: 'Student Support Services',
        maxMarks: 20,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      }
    ],
    completedSections: 0,
    totalMarks: 100,
    obtainedMarks: 0
  },
  {
    id: 'criteria-5',
    criteriaNumber: 5,
    title: 'Faculty Information and Contributions',
    description: 'Assessment of faculty qualifications, contributions and development',
    maxMarks: 100,
    sections: [
      {
        id: 'section-5-1',
        sectionNumber: '5.1',
        title: 'Faculty Profile and Qualifications',
        maxMarks: 30,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      },
      {
        id: 'section-5-2',
        sectionNumber: '5.2',
        title: 'Faculty Development Programs',
        maxMarks: 25,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      },
      {
        id: 'section-5-3',
        sectionNumber: '5.3',
        title: 'Research and Publications',
        maxMarks: 25,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      },
      {
        id: 'section-5-4',
        sectionNumber: '5.4',
        title: 'Industry Interaction',
        maxMarks: 20,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      }
    ],
    completedSections: 0,
    totalMarks: 100,
    obtainedMarks: 0
  },
  {
    id: 'criteria-6',
    criteriaNumber: 6,
    title: 'Facilities and Technical Support',
    description: 'Assessment of infrastructure, facilities and technical support',
    maxMarks: 100,
    sections: [
      {
        id: 'section-6-1',
        sectionNumber: '6.1',
        title: 'Infrastructure and Facilities',
        maxMarks: 30,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      },
      {
        id: 'section-6-2',
        sectionNumber: '6.2',
        title: 'Laboratory Facilities',
        maxMarks: 25,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      },
      {
        id: 'section-6-3',
        sectionNumber: '6.3',
        title: 'Library and Information Resources',
        maxMarks: 25,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      },
      {
        id: 'section-6-4',
        sectionNumber: '6.4',
        title: 'Computing and IT Support',
        maxMarks: 20,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      }
    ],
    completedSections: 0,
    totalMarks: 100,
    obtainedMarks: 0
  },
  {
    id: 'criteria-7',
    criteriaNumber: 7,
    title: 'Continuous Improvement',
    description: 'Assessment of continuous improvement processes and outcomes',
    maxMarks: 100,
    sections: [
      {
        id: 'section-7-1',
        sectionNumber: '7.1',
        title: 'Quality Assurance System',
        maxMarks: 25,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      },
      {
        id: 'section-7-2',
        sectionNumber: '7.2',
        title: 'Feedback Mechanism',
        maxMarks: 25,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      },
      {
        id: 'section-7-3',
        sectionNumber: '7.3',
        title: 'Action Taken Reports',
        maxMarks: 25,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      },
      {
        id: 'section-7-4',
        sectionNumber: '7.4',
        title: 'Best Practices and Innovations',
        maxMarks: 25,
        instituteMarks: 0,
        content: '',
        attachments: [],
        isCompleted: false,
        lastModified: new Date().toISOString()
      }
    ],
    completedSections: 0,
    totalMarks: 100,
    obtainedMarks: 0
  }
];

// Combined criteria template
const createCriteriaTemplate = (): Criteria[] => [
  createCriteria1Template(),
  ...createOtherCriteriaTemplates()
];

// Mock SAR applications data with enhanced structure
export const sarApplications: SARApplication[] = [
  {
    id: 'sar-1',
    applicationId: 'SAR-RGUKT-INST-2024-001',
    institutionId: '1',
    departmentName: 'Institute Information',
    applicationStartDate: '2024-01-15T00:00:00Z',
    applicationEndDate: '2024-04-15T23:59:59Z',
    status: 'completed',
    completionPercentage: 100,
    criteria: [], // Institute Information doesn't use criteria structure
    overallMarks: 0,
    maxOverallMarks: 0,
    lastModified: '2024-03-10T15:30:00Z'
  },
  {
    id: 'sar-2',
    applicationId: 'SAR-RGUKT-CSE-2024-001',
    institutionId: '1',
    departmentName: 'Computer Science and Engineering',
    applicationStartDate: '2024-01-15T00:00:00Z',
    applicationEndDate: '2024-04-15T23:59:59Z',
    status: 'in-progress',
    completionPercentage: 15,
    criteria: createCriteriaTemplate(),
    overallMarks: 0,
    maxOverallMarks: 700,
    lastModified: '2024-03-10T10:15:00Z'
  },
  {
    id: 'sar-3',
    applicationId: 'SAR-RGUKT-ECE-2024-001',
    institutionId: '1',
    departmentName: 'Electronics and Communication Engineering',
    applicationStartDate: '2024-01-15T00:00:00Z',
    applicationEndDate: '2024-04-15T23:59:59Z',
    status: 'draft',
    completionPercentage: 0,
    criteria: createCriteriaTemplate(),
    overallMarks: 0,
    maxOverallMarks: 700,
    lastModified: '2024-01-15T00:00:00Z'
  }
];

// Mock applications data
export const applications: Application[] = [
  {
    id: '1',
    institutionId: '1',
    type: 'initial',
    status: 'under-review',
    submittedAt: '2024-01-20T10:30:00Z',
    reviewedAt: '2024-01-25T14:15:00Z'
  },
  {
    id: '2',
    institutionId: '2',
    type: 'renewal',
    status: 'approved',
    submittedAt: '2024-01-10T09:00:00Z',
    reviewedAt: '2024-01-15T11:30:00Z',
    approvedAt: '2024-01-18T16:45:00Z'
  }
];

// Helper functions
export const getInstitutionById = (id: string): Institution | undefined => {
  return institutions.find(institution => institution.id === id);
};

export const getSARApplicationsByInstitution = (institutionId: string): SARApplication[] => {
  return sarApplications.filter(app => app.institutionId === institutionId);
};

export const getSARApplicationById = (id: string): SARApplication | undefined => {
  return sarApplications.find(app => app.id === id);
};

export const updateSARApplication = (id: string, updates: Partial<SARApplication>): boolean => {
  const index = sarApplications.findIndex(app => app.id === id);
  if (index !== -1) {
    sarApplications[index] = { ...sarApplications[index], ...updates, lastModified: new Date().toISOString() };
    return true;
  }
  return false;
};

export const updateSectionData = (applicationId: string, criteriaId: string, sectionId: string, updates: Partial<SectionData>): boolean => {
  const application = getSARApplicationById(applicationId);
  if (!application) return false;

  const criteria = application.criteria.find(c => c.id === criteriaId);
  if (!criteria) return false;

  const section = criteria.sections.find(s => s.id === sectionId);
  if (!section) return false;

  Object.assign(section, updates, { lastModified: new Date().toISOString() });

  // Update completion status
  const completedSections = criteria.sections.filter(s => s.isCompleted).length;
  criteria.completedSections = completedSections;

  // Update application completion percentage
  const totalSections = application.criteria.reduce((sum, c) => sum + c.sections.length, 0);
  const totalCompletedSections = application.criteria.reduce((sum, c) => sum + c.completedSections, 0);
  application.completionPercentage = totalSections > 0 ? Math.round((totalCompletedSections / totalSections) * 100) : 0;

  return updateSARApplication(applicationId, application);
};

export const getApplicationsByInstitution = (institutionId: string): Application[] => {
  return applications.filter(app => app.institutionId === institutionId);
};