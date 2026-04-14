import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { PreQualifierData } from './prequalifier';
import type { SARApplication, Criteria, SectionData } from './types';

// ─── Helpers ───────────────────────────────────────────────────────────────────

const MARGIN = 14;
const PAGE_WIDTH = 210; // A4
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

/** Strip HTML tags and decode entities for plain-text rendering */
function stripHtml(html: string): string {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || '').trim();
}

/** Add a centered title block */
function addTitle(doc: jsPDF, title: string, subtitle: string, y: number): number {
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, PAGE_WIDTH / 2, y, { align: 'center' });
  y += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitle, PAGE_WIDTH / 2, y, { align: 'center' });
  y += 6;
  doc.setDrawColor(0, 102, 204);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  return y + 8;
}

/** Add a section heading */
function addHeading(doc: jsPDF, text: string, y: number, level: 1 | 2 | 3 = 2): number {
  if (y > 270) { doc.addPage(); y = 20; }
  const sizes = { 1: 14, 2: 12, 3: 10 };
  doc.setFontSize(sizes[level]);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text(text, MARGIN, y);
  doc.setTextColor(0, 0, 0);
  return y + (level === 1 ? 10 : level === 2 ? 8 : 6);
}

/** Add wrapped body text */
function addText(doc: jsPDF, text: string, y: number, fontSize: number = 10): number {
  if (!text) return y;
  doc.setFontSize(fontSize);
  doc.setFont('helvetica', 'normal');
  const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
  for (const line of lines) {
    if (y > 280) { doc.addPage(); y = 20; }
    doc.text(line, MARGIN, y);
    y += 5;
  }
  return y + 2;
}

/** Add a labeled field */
function addField(doc: jsPDF, label: string, value: string, y: number): number {
  if (y > 275) { doc.addPage(); y = 20; }
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`${label}:`, MARGIN, y);
  doc.setFont('helvetica', 'normal');
  const labelWidth = doc.getTextWidth(`${label}: `);
  const valueLines = doc.splitTextToSize(value || '—', CONTENT_WIDTH - labelWidth - 2);
  doc.text(valueLines, MARGIN + labelWidth + 2, y);
  return y + (valueLines.length * 5) + 2;
}

/** Add footer to all pages */
function addFooter(doc: jsPDF, docTitle: string) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    doc.text(`${docTitle}`, MARGIN, 290);
    doc.text(`Page ${i} of ${pageCount}`, PAGE_WIDTH - MARGIN, 290, { align: 'right' });
    doc.text(`Generated on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`, PAGE_WIDTH / 2, 290, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  }
}

// ─── Pre-Qualifier PDF Export ──────────────────────────────────────────────────

export function exportPreQualifierPDF(data: PreQualifierData, institutionName: string): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  let y = 20;

  // Title
  y = addTitle(doc, 'NBA Pre-Qualifier Application', `${institutionName} — ${data.programAppliedFor || 'N/A'}`, y);

  // Status
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text(`Status: ${data.status.toUpperCase()} | Submitted: ${data.submittedAt ? new Date(data.submittedAt).toLocaleDateString('en-GB') : 'Not submitted'}`, MARGIN, y);
  y += 10;

  // Part A - Institute Profile
  y = addHeading(doc, 'Part A — Profile of the Institute', y, 1);

  y = addField(doc, 'Program Applied For', data.programAppliedFor, y);
  y += 2;

  y = addHeading(doc, 'A1. Name of the Institute', y, 2);
  y = addField(doc, 'Institute Name', data.instituteName, y);
  y = addField(doc, 'Year of Establishment', data.yearOfEstablishment, y);
  y = addField(doc, 'Location', data.location, y);
  y += 2;

  y = addHeading(doc, 'A2. Institute Address', y, 2);
  y = addField(doc, 'City', data.city, y);
  y = addField(doc, 'State', data.state, y);
  y = addField(doc, 'Pin Code', data.pinCode, y);
  y = addField(doc, 'Website', data.website, y);
  y = addField(doc, 'Email', data.email, y);
  y = addField(doc, 'Phone', data.phone, y);
  y += 2;

  y = addHeading(doc, 'A3. Head of the Institution', y, 2);
  y = addField(doc, 'Name', data.headName, y);
  y = addField(doc, 'Designation', data.headDesignation, y);
  y = addField(doc, 'Status of Appointment', data.headAppointmentStatus, y);
  y += 2;

  y = addHeading(doc, 'A4. Contact Details of Head', y, 2);
  y = addField(doc, 'Mobile', data.headMobile, y);
  y = addField(doc, 'Telephone', data.headTelephone, y);
  y = addField(doc, 'Email', data.headEmail, y);
  y += 2;

  y = addHeading(doc, 'A5. Affiliating University', y, 2);
  y = addField(doc, 'University Name', data.universityName, y);
  y = addField(doc, 'City', data.universityCity, y);
  y = addField(doc, 'State', data.universityState, y);
  y = addField(doc, 'Pin Code', data.universityPinCode, y);
  y += 2;

  y = addHeading(doc, 'A6. Type of Institution', y, 2);
  y = addField(doc, 'Type', data.institutionType + (data.institutionTypeOther ? ` (${data.institutionTypeOther})` : ''), y);
  y += 2;

  y = addHeading(doc, 'A7. Ownership Status', y, 2);
  y = addField(doc, 'Ownership', data.ownershipStatus + (data.ownershipStatusOther ? ` (${data.ownershipStatusOther})` : ''), y);
  y += 4;

  // A8 - Programs Offered
  if (y > 240) { doc.addPage(); y = 20; }
  y = addHeading(doc, 'A8. Programs Offered', y, 1);
  y = addField(doc, 'No. of UG Programs', data.numUGPrograms, y);
  y = addField(doc, 'No. of PG Programs', data.numPGPrograms, y);
  y += 2;

  if (data.programsOffered.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['S.N.', 'Level', 'Program Name', 'Year of Start', 'Year of Close', 'Department']],
      body: data.programsOffered.map((p, i) => [
        String(i + 1), p.level, p.name, p.yearOfStart, p.yearOfClose, p.department
      ]),
      margin: { left: MARGIN, right: MARGIN },
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [0, 102, 204], textColor: 255 },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;
  }

  // A9 - Programs for Accreditation
  if (y > 250) { doc.addPage(); y = 20; }
  y = addHeading(doc, 'A9. Programs for Accreditation', y, 2);

  if (data.programsForAccreditation.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['S.N.', 'Department', 'Program']],
      body: data.programsForAccreditation.map((p, i) => [String(i + 1), p.department, p.program]),
      margin: { left: MARGIN, right: MARGIN },
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [0, 102, 204], textColor: 255 },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;
  }

  // Allied Departments
  if (data.alliedDepartments.length > 0) {
    if (y > 250) { doc.addPage(); y = 20; }
    y = addHeading(doc, 'A9.2 Allied Departments', y, 3);
    autoTable(doc, {
      startY: y,
      head: [['S.N.', 'Department', 'Allied Department']],
      body: data.alliedDepartments.map((d, i) => [String(i + 1), d.department, d.alliedDepartment]),
      margin: { left: MARGIN, right: MARGIN },
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [0, 102, 204], textColor: 255 },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;
  }

  // Part B
  doc.addPage();
  y = 20;
  y = addHeading(doc, 'Part B — Program Information', y, 1);

  // B1 - Program Details
  y = addHeading(doc, 'B1. Program Details', y, 2);
  if (data.programDetails.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['S.N.', 'Program', 'Year Start', 'Intake', 'Change', 'Year Change', 'AICTE', 'Accreditation', 'Times']],
      body: data.programDetails.map((p, i) => [
        String(i + 1), p.programName, p.yearOfStart, p.sanctionedIntake,
        p.intakeChange, p.yearOfChange, p.aicteApproval, p.accreditationStatus, p.timesAccredited
      ]),
      margin: { left: MARGIN, right: MARGIN },
      styles: { fontSize: 7, cellPadding: 1.5 },
      headStyles: { fillColor: [0, 102, 204], textColor: 255, fontSize: 7 },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;
  }

  // B2.1 Faculty Cadre
  if (y > 240) { doc.addPage(); y = 20; }
  y = addHeading(doc, 'B2.1 Faculty Cadre', y, 2);
  y = addField(doc, 'Department', data.facultyDepartmentName, y);
  y = addField(doc, 'Allied Departments', data.numAlliedDepartments, y);
  y = addField(doc, 'UG Programs', data.numUGEnggPrograms, y);
  y = addField(doc, 'PG Programs', data.numPGEnggPrograms, y);
  y += 2;

  if (data.facultyCadre.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['S.N.', 'Designation', 'CAY Regular', 'CAY Contract', 'CAYm1 Regular', 'CAYm1 Contract']],
      body: data.facultyCadre.map((f, i) => [
        String(i + 1), f.designation, f.cayRegular, f.cayContract, f.caym1Regular, f.caym1Contract
      ]),
      margin: { left: MARGIN, right: MARGIN },
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [0, 102, 204], textColor: 255 },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;
  }

  // B2.2 HoD
  if (y > 260) { doc.addPage(); y = 20; }
  y = addHeading(doc, 'B2.2 Head of Department', y, 2);
  y = addField(doc, 'Name', data.hodName, y);
  y = addField(doc, 'Appointment', data.hodAppointment, y);
  y = addField(doc, 'Qualification', data.hodQualification + (data.hodQualificationOther ? ` (${data.hodQualificationOther})` : ''), y);
  y += 4;

  // B3 - SFR
  if (y > 240) { doc.addPage(); y = 20; }
  y = addHeading(doc, 'B3. Student Faculty Ratio (SFR)', y, 2);

  const sfrRows = [
    ['Total Students (DS)', data.sfrData.cayDS, data.sfrData.caym1DS, data.sfrData.caym2DS],
    ['Allied Students (AS)', data.sfrData.cayAS, data.sfrData.caym1AS, data.sfrData.caym2AS],
    ['Dept Faculty (DF)', data.sfrData.cayDF, data.sfrData.caym1DF, data.sfrData.caym2DF],
    ['Allied Faculty (AF)', data.sfrData.cayAF, data.sfrData.caym1AF, data.sfrData.caym2AF],
    ['First-Year Faculty (FF)', data.sfrData.cayFF, data.sfrData.caym1FF, data.sfrData.caym2FF],
  ];

  autoTable(doc, {
    startY: y,
    head: [['Parameter', 'CAY', 'CAYm1', 'CAYm2']],
    body: sfrRows,
    margin: { left: MARGIN, right: MARGIN },
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [0, 102, 204], textColor: 255 },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  // Compliance Status
  if (y > 200) { doc.addPage(); y = 20; }
  y = addHeading(doc, 'Compliance Status to Pre-Visit Qualifiers', y, 1);

  autoTable(doc, {
    startY: y,
    head: [['S.N.', 'Pre-Visit Qualifier', 'Current Status', 'Compliance']],
    body: data.complianceStatus.map((c, i) => [
      String(i + 1), c.qualifier, c.currentStatus || '—', c.complianceStatus || '—'
    ]),
    margin: { left: MARGIN, right: MARGIN },
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [0, 102, 204], textColor: 255, fontSize: 7 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 100 },
      2: { cellWidth: 35 },
      3: { cellWidth: 25 },
    },
  });

  addFooter(doc, 'NBA Pre-Qualifier Application');

  // Generate filename
  const instCode = institutionName.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 20);
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  doc.save(`PQ-${instCode}-${dateStr}.pdf`);
}

// ─── SAR PDF Export — Single Criteria ──────────────────────────────────────────

export function exportSARCriteriaPDF(
  application: SARApplication,
  criteria: Criteria,
  fileName: string
): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  let y = 20;

  // Title
  y = addTitle(
    doc,
    `Self Assessment Report — Criteria ${criteria.criteriaNumber}`,
    `${application.departmentName} | ${application.applicationId}`,
    y
  );

  // Criteria header info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Criteria: ${criteria.title}`, MARGIN, y);
  y += 5;
  doc.text(`Description: ${criteria.description}`, MARGIN, y);
  y += 5;
  doc.text(`Max Marks: ${criteria.maxMarks} | Obtained Marks: ${criteria.obtainedMarks} | Completed: ${criteria.completedSections}/${criteria.sections.length} sections`, MARGIN, y);
  y += 10;

  // Sections
  for (const section of criteria.sections) {
    if (y > 250) { doc.addPage(); y = 20; }

    y = addHeading(doc, `${section.sectionNumber} ${section.title}`, y, 2);

    // Marks info
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(`Max Marks: ${section.maxMarks} | Institute Marks: ${section.instituteMarks} | Status: ${section.isCompleted ? 'Completed' : 'Pending'}`, MARGIN, y);
    doc.setTextColor(0, 0, 0);
    y += 6;

    if (section.subsections && section.subsections.length > 0) {
      for (const sub of section.subsections) {
        if (y > 260) { doc.addPage(); y = 20; }

        y = addHeading(doc, `${sub.subSectionNumber} ${sub.title}`, y, 3);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        doc.text(`Max: ${sub.maxMarks} | Institute: ${sub.instituteMarks ?? 0} | ${sub.isCompleted ? '✓ Completed' : '○ Pending'}`, MARGIN, y);
        doc.setTextColor(0, 0, 0);
        y += 5;

        const content = stripHtml(sub.content);
        if (content) {
          y = addText(doc, content, y, 9);
        } else {
          doc.setFontSize(9);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(180, 180, 180);
          doc.text('No content provided', MARGIN, y);
          doc.setTextColor(0, 0, 0);
          y += 5;
        }

        if (sub.attachments && sub.attachments.length > 0) {
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.text('Attachments:', MARGIN, y);
          y += 4;
          doc.setFont('helvetica', 'normal');
          for (const att of sub.attachments) {
            doc.text(`• ${att}`, MARGIN + 4, y);
            y += 4;
          }
        }
        y += 3;
      }
    } else {
      const content = stripHtml(section.content);
      if (content) {
        y = addText(doc, content, y, 9);
      } else {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(180, 180, 180);
        doc.text('No content provided', MARGIN, y);
        doc.setTextColor(0, 0, 0);
        y += 5;
      }

      if (section.attachments && section.attachments.length > 0) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('Attachments:', MARGIN, y);
        y += 4;
        doc.setFont('helvetica', 'normal');
        for (const att of section.attachments) {
          doc.text(`• ${att}`, MARGIN + 4, y);
          y += 4;
        }
      }
    }
    y += 4;
  }

  // Summary table
  if (y > 230) { doc.addPage(); y = 20; }
  y = addHeading(doc, 'Marks Summary', y, 2);

  const summaryRows: string[][] = [];
  for (const section of criteria.sections) {
    if (section.subsections && section.subsections.length > 0) {
      for (const sub of section.subsections) {
        summaryRows.push([
          sub.subSectionNumber,
          sub.title,
          String(sub.maxMarks),
          String(sub.instituteMarks ?? 0),
          sub.isCompleted ? 'Yes' : 'No',
        ]);
      }
    } else {
      summaryRows.push([
        section.sectionNumber,
        section.title,
        String(section.maxMarks),
        String(section.instituteMarks),
        section.isCompleted ? 'Yes' : 'No',
      ]);
    }
  }
  summaryRows.push(['', 'TOTAL', String(criteria.maxMarks), String(criteria.obtainedMarks), '']);

  autoTable(doc, {
    startY: y,
    head: [['Section', 'Title', 'Max Marks', 'Institute Marks', 'Completed']],
    body: summaryRows,
    margin: { left: MARGIN, right: MARGIN },
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [0, 102, 204], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 80 },
      2: { cellWidth: 22, halign: 'center' },
      3: { cellWidth: 28, halign: 'center' },
      4: { cellWidth: 22, halign: 'center' },
    },
  });

  addFooter(doc, `SAR - Criteria ${criteria.criteriaNumber} - ${application.applicationId}`);
  doc.save(fileName);
}

// ─── SAR PDF Export — Institute Information ────────────────────────────────────

export function exportSARInstituteInfoPDF(
  applicationId: string,
  formData: Record<string, unknown>,
  fileName: string
): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  let y = 20;

  y = addTitle(doc, 'Self Assessment Report — Institute Information', applicationId, y);

  // Try to load saved form data from localStorage
  const savedKey = Object.keys(localStorage).find(k => k.startsWith('institute_form_'));
  let savedData: Record<string, unknown> | null = null;
  if (savedKey) {
    try {
      savedData = JSON.parse(localStorage.getItem(savedKey) || '{}');
    } catch { /* ignore */ }
  }

  if (savedData) {
    const part1 = (savedData as { part1?: Record<string, unknown> }).part1 || {};
    y = addHeading(doc, 'Part 1: Basic Information', y, 1);
    y = addField(doc, 'Name & Address of Institution', String(part1.nameAndAddressOfInstitution || ''), y);
    y = addField(doc, 'Affiliating University', String(part1.nameAndAddressOfAffiliatingUniversity || ''), y);
    y = addField(doc, 'Year of Establishment', String(part1.yearOfEstablishment || ''), y);
    y = addField(doc, 'Type of Institution', Array.isArray(part1.typeOfInstitution) ? (part1.typeOfInstitution as string[]).join(', ') : '', y);
    y = addField(doc, 'Ownership Status', Array.isArray(part1.ownershipStatus) ? (part1.ownershipStatus as string[]).join(', ') : '', y);
  } else {
    y = addText(doc, 'No institute information data found. Please fill the Institute Information form first.', y);
  }

  addFooter(doc, `SAR Institute Information - ${applicationId}`);
  doc.save(fileName);
}

// ─── SAR PDF Export — All Criteria for an Application ──────────────────────────

export function exportAllSARCriteriaPDF(application: SARApplication): void {
  for (const criteria of application.criteria) {
    const deptCode = application.applicationId.split('-')[2] || 'DEPT';
    const fileName = `SAR-${application.applicationId.split('-')[1] || 'INST'}-${deptCode}-criteria${criteria.criteriaNumber}.pdf`;
    exportSARCriteriaPDF(application, criteria, fileName);
  }
}