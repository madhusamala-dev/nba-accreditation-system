import { useState } from 'react';
import InstituteLayout from '@/components/InstituteLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CriteriaGuideline {
  id: number;
  title: string;
  maxMarks: number;
  overview: string;
  keyAreas: string[];
  dos: string[];
  donts: string[];
  tips: string[];
  commonMistakes: string[];
  scoringStrategy: string;
}

const criteriaGuidelines: CriteriaGuideline[] = [
  {
    id: 1,
    title: 'Vision, Mission and Program Educational Objectives',
    maxMarks: 60,
    overview:
      'This criterion evaluates how well the department/program has defined its Vision, Mission, and Program Educational Objectives (PEOs). It assesses the process of formulation, dissemination among stakeholders, and the consistency of PEOs with the institutional mission. Evaluators look for a well-documented, stakeholder-driven process with clear evidence of awareness and alignment.',
    keyAreas: [
      'Clear articulation of Vision and Mission statements',
      'Well-defined Program Educational Objectives (PEOs) — typically 3 to 5',
      'Evidence of stakeholder involvement (industry, alumni, parents, faculty, students)',
      'Adequate publication and dissemination through website, brochures, display boards, orientation programs',
      'Mapping of PEOs with Mission statements with proper justification',
      'Periodic review and revision process for Vision, Mission, and PEOs',
    ],
    dos: [
      'Clearly differentiate between Vision, Mission, PEOs, and POs — each serves a distinct purpose',
      'Involve all stakeholders (industry experts, alumni, parents, faculty, students) in the PEO formulation process and document minutes of meetings',
      'Provide a well-structured mapping matrix showing PEO-Mission alignment with written justification for each mapping',
      'Include evidence of dissemination — screenshots of website, photos of display boards, copies of brochures, orientation session records',
      'Show the periodic review cycle with dates, participants, and outcomes of each review',
      'Use action verbs (Bloom\'s taxonomy) while framing PEOs to make them measurable',
      'Keep PEOs concise, specific, and achievable — ideally 3 to 5 PEOs',
    ],
    donts: [
      'Don\'t copy Vision/Mission statements from other institutions — they must reflect your unique identity',
      'Don\'t frame too many PEOs (more than 5) — it dilutes focus and makes assessment difficult',
      'Don\'t confuse PEOs with POs — PEOs describe what graduates achieve 3-5 years after graduation',
      'Don\'t leave the mapping matrix without justification — a simple tick mark is insufficient',
      'Don\'t skip documenting the stakeholder consultation process — verbal claims without evidence score zero',
      'Don\'t use vague or generic language like "produce quality engineers" without specifics',
    ],
    tips: [
      '💡 Frame PEOs using the SMART framework — Specific, Measurable, Achievable, Relevant, Time-bound',
      '💡 Create a visual flowchart showing the entire process of Vision/Mission/PEO formulation and review',
      '💡 Conduct a formal survey of alumni and employers to validate PEOs — include survey instruments and analysis',
      '💡 Display Vision/Mission prominently in every lab, classroom, and department notice board — take dated photographs',
      '💡 Include PEOs in the student handbook, department brochure, and admission counseling material',
      '💡 Show revision history — if PEOs were revised based on feedback, document the before and after versions',
      '💡 Use tables to show stakeholder feedback and how it influenced PEO modifications',
    ],
    commonMistakes: [
      'Mixing up PEOs and POs in the documentation',
      'Not providing evidence of stakeholder meetings (no minutes, no attendance sheets)',
      'Generic Vision/Mission that could apply to any institution',
      'Mapping matrix without written justification for each PEO-Mission link',
      'No evidence of periodic review — appears as a one-time exercise',
    ],
    scoringStrategy:
      'Focus on documentation quality. Evaluators award marks based on evidence, not claims. A well-documented process with meeting minutes, survey data, photographs of display boards, and a clear revision history can score 80-90% of maximum marks. The mapping matrix with justification is a high-scoring section — invest time here.',
  },
  {
    id: 2,
    title: 'Program Outcomes and Assessment',
    maxMarks: 100,
    overview:
      'This criterion evaluates the Program Outcomes (POs) and Program Specific Outcomes (PSOs), their mapping with PEOs, and the assessment methods used to measure attainment. Evaluators look for a robust, data-driven assessment process with direct and indirect methods of measurement.',
    keyAreas: [
      'Adoption of NBA-defined 12 Program Outcomes (POs)',
      'Definition of Program Specific Outcomes (PSOs) — typically 2 to 3',
      'CO-PO mapping with appropriate correlation levels (1, 2, 3)',
      'Direct assessment methods (exams, assignments, projects, labs)',
      'Indirect assessment methods (surveys, exit interviews, employer feedback)',
      'PO attainment calculation methodology with threshold/target values',
      'Continuous improvement actions based on attainment gaps',
    ],
    dos: [
      'Use the exact 12 POs as defined by NBA — do not modify or paraphrase them',
      'Define 2-3 PSOs that are specific to your program and distinguish it from others',
      'Create a detailed CO-PO mapping for every course with correlation levels (1=Low, 2=Medium, 3=High)',
      'Use both direct (exam scores, rubrics, project evaluations) and indirect (surveys, exit interviews) assessment tools',
      'Define clear attainment targets and thresholds for each PO with justification',
      'Show the complete calculation methodology with sample calculations for at least 2-3 POs',
      'Document the continuous improvement loop — identify gaps, plan actions, implement, and measure again',
    ],
    donts: [
      'Don\'t modify the 12 NBA POs — use them verbatim',
      'Don\'t rely solely on exam marks for PO assessment — use multiple assessment tools',
      'Don\'t map every CO to every PO — only map where genuine correlation exists',
      'Don\'t set unrealistically high or low attainment targets',
      'Don\'t skip indirect assessment methods — they carry significant weightage',
      'Don\'t present PO attainment data without explaining the calculation methodology',
      'Don\'t ignore attainment gaps — show what corrective actions were taken',
    ],
    tips: [
      '💡 Use rubrics for project and lab assessments — they provide objective, measurable data for PO attainment',
      '💡 Create a comprehensive CO-PO-PSO mapping matrix and get it approved by the Board of Studies',
      '💡 Conduct alumni surveys (3-5 years after graduation) and employer surveys annually — use structured questionnaires',
      '💡 Show trend analysis of PO attainment over 2-3 batches to demonstrate continuous improvement',
      '💡 Use software tools (Excel dashboards or OBE software) for systematic PO attainment calculation',
      '💡 Include sample question papers showing how questions map to specific COs and POs',
      '💡 Document at least one complete cycle of "Assess → Identify Gap → Action → Re-assess" for each PO',
    ],
    commonMistakes: [
      'Modifying NBA\'s 12 POs instead of using them as-is',
      'Over-mapping COs to POs (every CO mapped to 8-10 POs)',
      'No indirect assessment data or poorly designed surveys',
      'Attainment calculation methodology not clearly explained',
      'No evidence of actions taken based on attainment gaps',
    ],
    scoringStrategy:
      'The CO-PO mapping and attainment calculation are the backbone of this criterion. Invest significant effort in creating accurate mappings, collecting robust data from multiple assessment tools, and showing a clear continuous improvement cycle. Trend data across batches is highly valued by evaluators.',
  },
  {
    id: 3,
    title: 'Curriculum Design and Development',
    maxMarks: 100,
    overview:
      'This criterion assesses the curriculum structure, its alignment with POs and PEOs, the involvement of stakeholders in curriculum design, and the process of periodic review and updating. Evaluators look for a well-balanced curriculum that meets industry needs and academic standards.',
    keyAreas: [
      'Curriculum structure — theory, practical, project, elective balance',
      'Credit distribution across semesters and course categories',
      'Industry-relevant courses, emerging technology courses, and interdisciplinary electives',
      'Stakeholder involvement in curriculum design (Industry Advisory Board, Alumni, Employers)',
      'Curriculum review and revision process with documented changes',
      'Compliance with AICTE/University norms and NBA requirements',
    ],
    dos: [
      'Present a clear semester-wise curriculum structure with credit distribution table',
      'Show the balance between theory, practical, project work, and electives with percentage breakdowns',
      'Include minutes of Board of Studies (BoS) meetings showing curriculum discussions and approvals',
      'Highlight industry-relevant courses, MOOCs, value-added courses, and skill development programs',
      'Document the curriculum revision history — what changed, why, and based on whose feedback',
      'Show how curriculum maps to POs through a Curriculum-PO matrix',
      'Include syllabi of key courses with CO statements clearly defined',
    ],
    donts: [
      'Don\'t present a curriculum without showing the design rationale and stakeholder input',
      'Don\'t have an imbalanced curriculum — too much theory with insufficient practicals is a red flag',
      'Don\'t skip documenting BoS meetings and Industry Advisory Board recommendations',
      'Don\'t present outdated syllabi — ensure courses reflect current industry trends',
      'Don\'t ignore elective choices — show variety and relevance to emerging technologies',
      'Don\'t forget to show how gaps identified in PO attainment led to curriculum modifications',
    ],
    tips: [
      '💡 Create a visual curriculum map showing how courses across semesters progressively build PO attainment',
      '💡 Include a comparison with peer institutions or top-ranked programs to show curriculum competitiveness',
      '💡 Highlight unique courses or specializations that differentiate your program',
      '💡 Show industry expert involvement — guest lectures, co-designed courses, industry projects',
      '💡 Document value-added courses, certifications, and workshops offered beyond the regular curriculum',
      '💡 Present a gap analysis between industry requirements and curriculum, with actions taken to bridge gaps',
      '💡 Include student feedback on curriculum and how it influenced changes',
    ],
    commonMistakes: [
      'No documented process for curriculum design — appears ad-hoc',
      'BoS meetings not conducted regularly or minutes not maintained',
      'No industry input in curriculum design',
      'Curriculum not updated for 3+ years',
      'No mapping between curriculum and POs/PEOs',
    ],
    scoringStrategy:
      'Evaluators value a systematic, well-documented curriculum design process with strong industry linkage. Show that your curriculum is not static — demonstrate a cycle of feedback collection, gap analysis, revision, and implementation. A curriculum map showing progressive PO attainment across semesters is a powerful visual tool.',
  },
  {
    id: 4,
    title: 'Students Performance and Assessment',
    maxMarks: 100,
    overview:
      'This criterion evaluates student admission quality, academic performance, assessment methods, progression, and support services. Evaluators look for fair admission processes, diverse assessment methods, strong pass rates, and robust student support mechanisms.',
    keyAreas: [
      'Student admission process and quality metrics (entrance exam ranks, cut-off scores)',
      'Student strength and enrollment trends over 3-5 years',
      'Assessment methods — continuous internal evaluation, end-semester exams, practicals, projects',
      'Academic performance analysis — pass percentage, distinction/first class percentage, university ranks',
      'Student progression — higher education, placements, entrepreneurship',
      'Student support services — mentoring, remedial classes, counseling, scholarships',
    ],
    dos: [
      'Present admission data for the last 3-5 years showing student quality metrics',
      'Show diverse assessment methods — not just exams, but assignments, quizzes, mini-projects, presentations, peer assessments',
      'Provide year-wise academic performance data with analysis (pass %, distinction %, university ranks)',
      'Include student progression data — higher studies admissions, placement statistics, entrepreneurship ventures',
      'Document mentoring system with mentor-mentee allocation, meeting records, and outcomes',
      'Show remedial measures for academically weak students with evidence of improvement',
      'Include student satisfaction survey results and actions taken',
    ],
    donts: [
      'Don\'t present data without analysis — raw numbers without interpretation score poorly',
      'Don\'t rely only on university exams for assessment — show continuous evaluation methods',
      'Don\'t hide poor performance data — instead show what corrective measures were taken',
      'Don\'t claim mentoring without evidence — maintain mentoring logs and records',
      'Don\'t ignore slow learners — show specific interventions designed for them',
      'Don\'t present placement data without verification — evaluators may cross-check',
    ],
    tips: [
      '💡 Use graphs and charts to present performance trends — visual data is more impactful than tables alone',
      '💡 Show the correlation between admission quality and academic performance',
      '💡 Highlight university rank holders and their achievements prominently',
      '💡 Document bridge courses and remedial programs with before/after performance comparison',
      '💡 Include placement data with company names, packages, and year-wise trends',
      '💡 Show higher education data — students admitted to IITs, IIMs, foreign universities',
      '💡 Present a comprehensive student support ecosystem diagram showing all available services',
      '💡 Include testimonials or success stories of students who benefited from support services',
    ],
    commonMistakes: [
      'No trend analysis — only current year data presented',
      'Assessment limited to exams only — no continuous evaluation evidence',
      'Mentoring system exists on paper but no actual records',
      'Placement data not segregated by core vs. non-core companies',
      'No evidence of remedial measures for weak students',
    ],
    scoringStrategy:
      'Present data-rich, well-analyzed content. Evaluators appreciate trend analysis over multiple years, diverse assessment methods with rubrics, and a strong student support system with documented evidence. Placement and higher education data are high-impact areas — present them with detailed breakdowns.',
  },
  {
    id: 5,
    title: 'Faculty Information and Contributions',
    maxMarks: 100,
    overview:
      'This criterion assesses faculty qualifications, experience, student-faculty ratio, faculty development activities, research contributions, and industry interactions. Evaluators look for a well-qualified, research-active faculty with adequate numbers and continuous professional development.',
    keyAreas: [
      'Faculty qualifications — PhD holders, M.Tech holders, industry experience',
      'Student-Faculty Ratio (SFR) compliance with AICTE norms',
      'Faculty retention and recruitment data',
      'Research publications — journals (SCI/Scopus indexed), conferences, patents, books',
      'Faculty Development Programs (FDPs) — attended and organized',
      'Industry interaction — consultancy, sponsored projects, MoUs, guest lectures',
      'Awards, recognitions, and professional memberships',
    ],
    dos: [
      'Provide detailed faculty profiles with qualifications, experience, specialization, and research areas',
      'Show compliance with AICTE student-faculty ratio norms (ideally 15:1 or better)',
      'Present research output data — number of SCI/Scopus publications, h-index, citations, patents filed/granted',
      'Document FDPs attended and organized with dates, topics, and organizing bodies',
      'Show industry interaction evidence — MoU copies, consultancy project details, revenue generated',
      'Include faculty awards, recognitions, editorial board memberships, and professional society memberships',
      'Present faculty workload distribution showing teaching, research, and administrative responsibilities',
    ],
    donts: [
      'Don\'t include faculty who are not actually teaching in the program',
      'Don\'t inflate publication counts with predatory journal publications — quality matters over quantity',
      'Don\'t show faculty without any research or development activity — encourage at least FDP participation',
      'Don\'t ignore the student-faculty ratio — it\'s a critical metric that evaluators check first',
      'Don\'t present consultancy/industry data without proper documentation (MoUs, project reports)',
      'Don\'t list conferences attended without specifying whether papers were presented',
    ],
    tips: [
      '💡 Highlight faculty with PhD qualifications prominently — the percentage of PhD holders is a key metric',
      '💡 Show research publication trends over 3-5 years with quality indicators (impact factor, indexing)',
      '💡 Document at least 2-3 significant consultancy or sponsored research projects with outcomes',
      '💡 Encourage faculty to file patents — even filed (not granted) patents demonstrate innovation culture',
      '💡 Show faculty participation in curriculum design of other institutions, AICTE/UGC committees, etc.',
      '💡 Present a faculty development plan showing how the department invests in faculty growth',
      '💡 Include evidence of faculty-industry collaboration — joint projects, adjunct faculty from industry',
      '💡 Maintain a faculty achievement tracker updated regularly',
    ],
    commonMistakes: [
      'Student-faculty ratio not meeting AICTE norms',
      'Publications in predatory/non-indexed journals presented as research output',
      'No evidence of faculty development activities',
      'Industry interaction limited to guest lectures — no substantial collaboration',
      'Faculty profiles incomplete or not updated',
    ],
    scoringStrategy:
      'Faculty quality is one of the most scrutinized criteria. Ensure PhD percentage is high, SFR is compliant, and research output is in quality journals. A few high-impact publications are worth more than many low-quality ones. Industry interaction through funded projects and consultancy adds significant value.',
  },
  {
    id: 6,
    title: 'Facilities and Technical Support',
    maxMarks: 100,
    overview:
      'This criterion evaluates the infrastructure, laboratory facilities, computing resources, library, and technical support available for the program. Evaluators physically inspect facilities during the visit, so the actual state must match the documentation.',
    keyAreas: [
      'Classrooms — capacity, ICT enablement (projectors, smart boards, Wi-Fi)',
      'Laboratories — equipment list, utilization, maintenance, beyond-curriculum experiments',
      'Computing facilities — hardware, software licenses, internet bandwidth, student access',
      'Library — books, journals (national/international), e-resources, digital library access',
      'Support staff — lab technicians, system administrators, their qualifications',
      'Safety measures — fire extinguishers, first aid, electrical safety, lab safety protocols',
    ],
    dos: [
      'Provide a detailed list of all labs with equipment, specifications, quantities, and working condition',
      'Show lab utilization data — timetable, number of students per batch, experiments conducted',
      'Document computing facilities with hardware specs, licensed software list, and internet bandwidth',
      'Present library data — total books, titles per student, journal subscriptions, e-resource access (NPTEL, Swayam, IEEE, etc.)',
      'Include photographs of labs, classrooms, library, and computing facilities',
      'Show maintenance records and annual procurement/upgrade plans',
      'Document safety measures with photographs and compliance certificates',
    ],
    donts: [
      'Don\'t list equipment that is non-functional or obsolete without mentioning replacement plans',
      'Don\'t exaggerate facility data — evaluators will physically verify during the visit',
      'Don\'t ignore software licenses — using pirated software is a serious negative finding',
      'Don\'t present library data without showing actual utilization (issue/return records, e-resource access logs)',
      'Don\'t skip safety documentation — it\'s increasingly important in NBA evaluations',
      'Don\'t forget to mention facilities shared with other departments — clarify exclusive vs. shared resources',
    ],
    tips: [
      '💡 Ensure all labs are clean, organized, and fully functional before the evaluation visit',
      '💡 Display experiment lists, safety instructions, and lab rules prominently in each lab',
      '💡 Show beyond-curriculum experiments and research projects conducted in labs',
      '💡 Highlight any industry-sponsored labs or centers of excellence',
      '💡 Present a 3-year procurement plan showing planned upgrades and new acquisitions',
      '💡 Ensure library has adequate titles per student (NBA recommends specific ratios)',
      '💡 Show Wi-Fi coverage map and internet bandwidth allocation',
      '💡 Document any virtual labs, simulation software, or remote access facilities',
    ],
    commonMistakes: [
      'Equipment listed but not functional during evaluator visit',
      'Software licenses expired or pirated software in use',
      'Library books outdated — no recent publications',
      'Labs not maintained — dusty equipment, broken furniture',
      'No safety measures visible in labs',
    ],
    scoringStrategy:
      'This criterion is verified physically. Ensure every piece of equipment listed is functional and accessible. Clean, well-organized labs with beyond-curriculum experiments score highest. Library with good e-resource subscriptions and computing facilities with licensed software are essential. Safety compliance is non-negotiable.',
  },
  {
    id: 7,
    title: 'Continuous Improvement',
    maxMarks: 100,
    overview:
      'This criterion evaluates the quality assurance mechanisms, feedback systems, and continuous improvement processes in place. Evaluators look for a systematic approach to collecting feedback, analyzing data, identifying gaps, implementing improvements, and measuring the impact of those improvements.',
    keyAreas: [
      'Quality assurance system — internal quality assurance cell (IQAC), ISO certification',
      'Feedback mechanisms — student, alumni, employer, parent feedback collection and analysis',
      'Action taken reports based on feedback and assessment data',
      'Improvement in PO attainment over successive batches',
      'Best practices and innovations adopted by the department',
      'Benchmarking with peer institutions and national/international standards',
    ],
    dos: [
      'Document the complete feedback collection cycle — instruments used, frequency, sample size, analysis method',
      'Present Action Taken Reports (ATRs) with specific actions, responsible persons, timelines, and outcomes',
      'Show improvement trends in PO attainment, academic performance, and placement over 2-3 batches',
      'Highlight best practices unique to your department with evidence of impact',
      'Document quality audit reports (internal and external) with compliance status',
      'Show benchmarking data — compare your metrics with top institutions in your region/category',
      'Present a continuous improvement model/framework adopted by the department',
    ],
    donts: [
      'Don\'t present feedback data without analysis and action — collecting feedback alone scores zero',
      'Don\'t show ATRs without evidence of implementation and impact measurement',
      'Don\'t claim improvements without data to support them — every claim needs evidence',
      'Don\'t ignore negative feedback — show how you addressed concerns raised by stakeholders',
      'Don\'t present best practices that are common across all institutions — highlight what\'s unique to you',
      'Don\'t skip the "closing the loop" aspect — feedback → action → result → re-feedback',
    ],
    tips: [
      '💡 Create a visual "Plan-Do-Check-Act" (PDCA) cycle diagram specific to your department',
      '💡 Show at least 3-5 concrete examples of improvements made based on feedback with before/after data',
      '💡 Document innovative teaching-learning methods adopted and their impact on student performance',
      '💡 Present a dashboard or summary showing key quality indicators and their trends',
      '💡 Highlight any awards, recognitions, or rankings received as evidence of quality',
      '💡 Show how industry feedback led to curriculum changes or new course introductions',
      '💡 Document MoU outcomes — not just signed MoUs, but actual activities conducted under them',
      '💡 Include student-driven innovations, hackathon wins, startup incubation as evidence of quality culture',
    ],
    commonMistakes: [
      'Feedback collected but no analysis or action taken',
      'ATRs generic — not specific to identified issues',
      'No trend data — only single-year data presented',
      'Best practices section is weak or generic',
      'No evidence of closing the feedback loop',
    ],
    scoringStrategy:
      'This criterion ties everything together. Show a clear, systematic process: Collect Data → Analyze → Identify Gaps → Plan Actions → Implement → Measure Impact → Repeat. Trend data showing improvement over batches is the strongest evidence. Unique best practices with measurable impact can significantly boost your score.',
  },
];

export default function SARGuidelines() {
  const [expandedCriteria, setExpandedCriteria] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<string>('overview');

  const toggleCriteria = (id: number) => {
    setExpandedCriteria(expandedCriteria === id ? null : id);
    setActiveTab('overview');
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'dos', label: "Do's" },
    { id: 'donts', label: "Don'ts" },
    { id: 'tips', label: 'Tips & Tricks' },
    { id: 'mistakes', label: 'Common Mistakes' },
  ];

  return (
    <InstituteLayout title="SAR Guidelines">
      <div className="space-y-6">
        {/* Introduction Card */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">NBA SAR Preparation Guidelines</h3>
              <p className="text-sm text-blue-700 mt-1">
                This guide provides comprehensive guidelines for preparing your Self-Assessment Report (SAR) for NBA
                accreditation. Each criterion includes detailed do's and don'ts, tips and tricks for scoring well, and
                common mistakes to avoid. Click on any criterion below to view its detailed guidelines.
              </p>
              <div className="flex items-center gap-4 mt-3">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">7 Criteria</Badge>
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">660 Total Marks</Badge>
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Tier-I Engineering Programs</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Navigation */}
        <Card className="p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Navigation</h4>
          <div className="flex flex-wrap gap-2">
            {criteriaGuidelines.map((c) => (
              <Button
                key={c.id}
                variant={expandedCriteria === c.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleCriteria(c.id)}
                className="text-xs"
              >
                Criterion {c.id}
              </Button>
            ))}
          </div>
        </Card>

        {/* Criteria Accordion */}
        <div className="space-y-3">
          {criteriaGuidelines.map((criteria) => (
            <Card key={criteria.id} className="overflow-hidden">
              {/* Criteria Header */}
              <div
                className={cn(
                  'p-4 cursor-pointer transition-colors flex items-center justify-between',
                  expandedCriteria === criteria.id
                    ? 'bg-blue-50 border-b border-blue-200'
                    : 'hover:bg-gray-50'
                )}
                onClick={() => toggleCriteria(criteria.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg',
                      expandedCriteria === criteria.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {criteria.id}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{criteria.title}</h3>
                    <p className="text-xs text-gray-500">Maximum Marks: {criteria.maxMarks}</p>
                  </div>
                </div>
                <svg
                  className={cn(
                    'w-5 h-5 text-gray-400 transition-transform',
                    expandedCriteria === criteria.id && 'rotate-180'
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Criteria Content */}
              {expandedCriteria === criteria.id && (
                <div className="p-4">
                  {/* Tabs */}
                  <div className="flex flex-wrap gap-1 mb-4 border-b border-gray-200 pb-3">
                    {tabs.map((tab) => (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? 'default' : 'ghost'}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab(tab.id);
                        }}
                        className="text-xs"
                      >
                        {tab.label}
                      </Button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-[200px]">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Overview</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">{criteria.overview}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Key Areas to Address</h4>
                          <ul className="space-y-2">
                            {criteria.keyAreas.map((area, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-blue-500 mt-0.5 flex-shrink-0">●</span>
                                {area}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <h4 className="font-semibold text-amber-900 mb-1 text-sm">📊 Scoring Strategy</h4>
                          <p className="text-sm text-amber-800 leading-relaxed">{criteria.scoringStrategy}</p>
                        </div>
                      </div>
                    )}

                    {/* Do's Tab */}
                    {activeTab === 'dos' && (
                      <div>
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                          <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">
                            ✓
                          </span>
                          Do's — Best Practices
                        </h4>
                        <ul className="space-y-3">
                          {criteria.dos.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100"
                            >
                              <span className="text-green-600 font-bold text-sm mt-0.5 flex-shrink-0">
                                {idx + 1}.
                              </span>
                              <span className="text-sm text-gray-800">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Don'ts Tab */}
                    {activeTab === 'donts' && (
                      <div>
                        <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                          <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-sm">
                            ✗
                          </span>
                          Don'ts — Common Pitfalls to Avoid
                        </h4>
                        <ul className="space-y-3">
                          {criteria.donts.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100"
                            >
                              <span className="text-red-600 font-bold text-sm mt-0.5 flex-shrink-0">
                                {idx + 1}.
                              </span>
                              <span className="text-sm text-gray-800">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tips & Tricks Tab */}
                    {activeTab === 'tips' && (
                      <div>
                        <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                          <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm">
                            ★
                          </span>
                          Tips & Tricks for High Scores
                        </h4>
                        <ul className="space-y-3">
                          {criteria.tips.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100"
                            >
                              <span className="text-sm text-gray-800">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Common Mistakes Tab */}
                    {activeTab === 'mistakes' && (
                      <div>
                        <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                          <span className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-sm">
                            ⚠
                          </span>
                          Common Mistakes to Avoid
                        </h4>
                        <ul className="space-y-3">
                          {criteria.commonMistakes.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100"
                            >
                              <span className="text-orange-600 font-bold text-sm mt-0.5 flex-shrink-0">
                                ⚠
                              </span>
                              <span className="text-sm text-gray-800">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* General Tips Card */}
        <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <h3 className="text-lg font-semibold text-emerald-900 mb-4">📋 General SAR Preparation Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">1.</span>
                <p className="text-sm text-gray-800">
                  <strong>Start early</strong> — SAR preparation takes 3-6 months. Don't rush it in the last few weeks.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">2.</span>
                <p className="text-sm text-gray-800">
                  <strong>Maintain evidence</strong> — Every claim must be backed by documentary evidence. No evidence = no marks.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">3.</span>
                <p className="text-sm text-gray-800">
                  <strong>Use data and trends</strong> — Present 3-5 years of data with trend analysis. Single-year data is insufficient.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">4.</span>
                <p className="text-sm text-gray-800">
                  <strong>Be honest</strong> — Don't fabricate data. Evaluators are experienced and can identify inconsistencies.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">5.</span>
                <p className="text-sm text-gray-800">
                  <strong>Cross-reference criteria</strong> — Data in one criterion should be consistent with others. Contradictions are red flags.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">6.</span>
                <p className="text-sm text-gray-800">
                  <strong>Prepare for the visit</strong> — Ensure physical facilities match documentation. Brief faculty and students.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">7.</span>
                <p className="text-sm text-gray-800">
                  <strong>Review by peers</strong> — Have colleagues from other departments or NBA-experienced faculty review your SAR before submission.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">8.</span>
                <p className="text-sm text-gray-800">
                  <strong>Use visuals</strong> — Charts, graphs, flowcharts, and photographs make the SAR more readable and impactful.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </InstituteLayout>
  );
}