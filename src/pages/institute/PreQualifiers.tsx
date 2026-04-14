import { useState, useEffect } from 'react';
import InstituteLayout from '@/components/InstituteLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/lib/auth';
import { getInstitutionById } from '@/lib/data';
import {
  type PreQualifierData,
  createDefaultPreQualifier,
  savePreQualifier,
  getPreQualifiersByInstitution,
  calculatePQProgress,
} from '@/lib/prequalifier';
import { exportPreQualifierPDF } from '@/lib/pdfExport';
import {
  Save, Send, Plus, Trash2, ChevronLeft, ChevronRight,
  CheckCircle, AlertCircle, ClipboardList, Building2, Users, BarChart3, ShieldCheck, Download
} from 'lucide-react';

const STEPS = [
  { id: 'partA1', label: 'Institute Profile', icon: Building2, description: 'A1-A7' },
  { id: 'partA2', label: 'Programs', icon: ClipboardList, description: 'A8-A9' },
  { id: 'partB1', label: 'Program Info', icon: BarChart3, description: 'B1-B2' },
  { id: 'partB2', label: 'Faculty & SFR', icon: Users, description: 'B2.1-B3' },
  { id: 'compliance', label: 'Compliance', icon: ShieldCheck, description: 'Pre-Visit Qualifiers' },
];

export default function PreQualifiers() {
  const { user } = useAuth();
  const [pqData, setPqData] = useState<PreQualifierData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [institution, setInstitution] = useState<ReturnType<typeof getInstitutionById>>(undefined);

  useEffect(() => {
    if (user?.institutionId) {
      const inst = getInstitutionById(user.institutionId);
      setInstitution(inst);
      const existing = getPreQualifiersByInstitution(user.institutionId);
      if (existing.length > 0) {
        setPqData(existing[0]);
      } else {
        const newPQ = createDefaultPreQualifier(user.institutionId);
        setPqData(newPQ);
      }
    }
  }, [user]);

  const updateField = (field: keyof PreQualifierData, value: unknown) => {
    if (!pqData) return;
    setPqData({ ...pqData, [field]: value } as PreQualifierData);
  };

  const handleSave = () => {
    if (!pqData) return;
    setSaving(true);
    const progress = calculatePQProgress(pqData);
    const updated = {
      ...pqData,
      completionPercentage: progress,
      status: (progress > 0 ? 'in-progress' : 'draft') as PreQualifierData['status'],
    };
    savePreQualifier(updated);
    setPqData(updated);
    setTimeout(() => setSaving(false), 500);
  };

  const handleSubmit = () => {
    if (!pqData) return;
    const allComplied = pqData.complianceStatus.every(c => c.complianceStatus === 'Complied');
    if (!allComplied) {
      alert('All 6 pre-visit qualifiers must be marked as "Complied" before submission.');
      return;
    }
    const progress = calculatePQProgress(pqData);
    if (progress < 50) {
      alert('Please fill at least 50% of the form before submitting.');
      return;
    }
    const updated: PreQualifierData = {
      ...pqData,
      status: 'submitted',
      completionPercentage: 100,
      submittedAt: new Date().toISOString(),
    };
    savePreQualifier(updated);
    setPqData(updated);
    alert('Pre-Qualifier submitted successfully! You can now access SAR Applications.');
  };

  const handleExportPDF = () => {
    if (!pqData) return;
    exportPreQualifierPDF(pqData, institution?.name || 'Institution');
  };

  // Table row helpers
  const addRow = <T extends { id: string }>(field: keyof PreQualifierData, current: T[], template: Omit<T, 'id'>) => {
    const newRow = { ...template, id: String(current.length + 1) } as T;
    updateField(field, [...current, newRow]);
  };

  const removeRow = <T extends { id: string }>(field: keyof PreQualifierData, current: T[], id: string) => {
    if (current.length <= 1) return;
    updateField(field, current.filter(r => r.id !== id));
  };

  const updateRow = <T extends { id: string }>(field: keyof PreQualifierData, current: T[], id: string, key: string, value: string) => {
    updateField(field, current.map(r => r.id === id ? { ...r, [key]: value } : r));
  };

  if (!pqData) {
    return (
      <InstituteLayout title="Pre-Qualifiers">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </InstituteLayout>
    );
  }

  const isSubmitted = pqData.status === 'submitted';
  const progress = calculatePQProgress(pqData);

  return (
    <InstituteLayout title="Pre-Qualifiers">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pre-Qualifier Application</h1>
            <p className="text-sm text-gray-600 mt-1">
              NBA TIER-I UG (Engineering) Institute Programs — {institution?.name || ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isSubmitted && (
              <Button variant="outline" onClick={handleExportPDF} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
            )}
            <Badge variant="outline" className={
              isSubmitted ? 'bg-green-100 text-green-800 border-green-300' :
              progress > 0 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
              'bg-gray-100 text-gray-700'
            }>
              {isSubmitted ? '✓ Submitted' : progress > 0 ? 'In Progress' : 'Draft'}
            </Badge>
            <Badge variant="secondary">{progress}% Complete</Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${isSubmitted ? 'bg-green-500' : 'bg-blue-500'}`}
            style={{ width: `${isSubmitted ? 100 : progress}%` }}
          />
        </div>

        {/* Submitted Banner */}
        {isSubmitted && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">Pre-Qualifier Submitted Successfully</p>
                  <p className="text-sm text-green-700">
                    Submitted on {new Date(pqData.submittedAt || '').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}. You can now access SAR Applications.
                  </p>
                </div>
              </div>
              <Button onClick={handleExportPDF} variant="outline" size="sm" className="border-green-300 text-green-800 hover:bg-green-100">
                <Download className="w-4 h-4 mr-1" /> Download PDF
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <Button
                key={step.id}
                variant={currentStep === idx ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentStep(idx)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{step.label}</span>
                <span className="text-xs opacity-70">({step.description})</span>
              </Button>
            );
          })}
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="pt-6">
            {/* STEP 0: Part A - Institute Profile (A1-A7) */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <CardTitle className="text-lg">Part A — Profile of the Institute (A1-A7)</CardTitle>

                <div className="space-y-2">
                  <Label>Name of the Program Applied for</Label>
                  <Input value={pqData.programAppliedFor} onChange={e => updateField('programAppliedFor', e.target.value)} placeholder="e.g., B.Tech Computer Science and Engineering" disabled={isSubmitted} />
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">A1. Name of the Institute</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3"><Label>Institute Name</Label><Input value={pqData.instituteName} onChange={e => updateField('instituteName', e.target.value)} disabled={isSubmitted} /></div>
                    <div><Label>Year of Establishment</Label><Input value={pqData.yearOfEstablishment} onChange={e => updateField('yearOfEstablishment', e.target.value)} disabled={isSubmitted} /></div>
                    <div className="md:col-span-2"><Label>Location of the Institute</Label><Input value={pqData.location} onChange={e => updateField('location', e.target.value)} disabled={isSubmitted} /></div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">A2. Institute Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><Label>City</Label><Input value={pqData.city} onChange={e => updateField('city', e.target.value)} disabled={isSubmitted} /></div>
                    <div><Label>State</Label><Input value={pqData.state} onChange={e => updateField('state', e.target.value)} disabled={isSubmitted} /></div>
                    <div><Label>Pin Code</Label><Input value={pqData.pinCode} onChange={e => updateField('pinCode', e.target.value)} disabled={isSubmitted} /></div>
                    <div><Label>Website</Label><Input value={pqData.website} onChange={e => updateField('website', e.target.value)} disabled={isSubmitted} /></div>
                    <div><Label>E-mail</Label><Input value={pqData.email} onChange={e => updateField('email', e.target.value)} disabled={isSubmitted} /></div>
                    <div><Label>Phone No (with STD Code)</Label><Input value={pqData.phone} onChange={e => updateField('phone', e.target.value)} disabled={isSubmitted} /></div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">A3. Head of the Institution</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><Label>Name</Label><Input value={pqData.headName} onChange={e => updateField('headName', e.target.value)} disabled={isSubmitted} /></div>
                    <div><Label>Designation</Label><Input value={pqData.headDesignation} onChange={e => updateField('headDesignation', e.target.value)} disabled={isSubmitted} /></div>
                    <div><Label>Status of Appointment</Label>
                      <Select value={pqData.headAppointmentStatus} onValueChange={v => updateField('headAppointmentStatus', v)} disabled={isSubmitted}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Regular">Regular</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Ad hoc">Ad hoc</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">A4. Contact Details of Head of Institution</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><Label>Mobile No.</Label><Input value={pqData.headMobile} onChange={e => updateField('headMobile', e.target.value)} disabled={isSubmitted} /></div>
                    <div><Label>Telephone No. (With STD Code)</Label><Input value={pqData.headTelephone} onChange={e => updateField('headTelephone', e.target.value)} disabled={isSubmitted} /></div>
                    <div><Label>E-mail</Label><Input value={pqData.headEmail} onChange={e => updateField('headEmail', e.target.value)} disabled={isSubmitted} /></div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">A5. Name and Address of the Affiliating University</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Name of the University</Label><Input value={pqData.universityName} onChange={e => updateField('universityName', e.target.value)} disabled={isSubmitted} /></div>
                    <div><Label>City</Label><Input value={pqData.universityCity} onChange={e => updateField('universityCity', e.target.value)} disabled={isSubmitted} /></div>
                    <div><Label>State</Label><Input value={pqData.universityState} onChange={e => updateField('universityState', e.target.value)} disabled={isSubmitted} /></div>
                    <div><Label>Pin Code</Label><Input value={pqData.universityPinCode} onChange={e => updateField('universityPinCode', e.target.value)} disabled={isSubmitted} /></div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">A6. Type of the Institution</h3>
                  <Select value={pqData.institutionType} onValueChange={v => updateField('institutionType', v)} disabled={isSubmitted}>
                    <SelectTrigger className="w-full md:w-96"><SelectValue placeholder="Select institution type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Institute of National Importance">Institute of National Importance</SelectItem>
                      <SelectItem value="Deemed University">Deemed University</SelectItem>
                      <SelectItem value="University">University</SelectItem>
                      <SelectItem value="Autonomous">Autonomous</SelectItem>
                      <SelectItem value="Non-Autonomous (Affiliated)">Non-Autonomous (Affiliated)</SelectItem>
                      <SelectItem value="Any other">Any other</SelectItem>
                    </SelectContent>
                  </Select>
                  {pqData.institutionType === 'Any other' && (
                    <Input className="mt-2 w-full md:w-96" value={pqData.institutionTypeOther} onChange={e => updateField('institutionTypeOther', e.target.value)} placeholder="Please specify" disabled={isSubmitted} />
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">A7. Ownership Status</h3>
                  <Select value={pqData.ownershipStatus} onValueChange={v => updateField('ownershipStatus', v)} disabled={isSubmitted}>
                    <SelectTrigger className="w-full md:w-96"><SelectValue placeholder="Select ownership status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Central Government">Central Government</SelectItem>
                      <SelectItem value="State Government">State Government</SelectItem>
                      <SelectItem value="Government Aided">Government Aided</SelectItem>
                      <SelectItem value="Self-financing">Self-financing</SelectItem>
                      <SelectItem value="Any Other">Any Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {pqData.ownershipStatus === 'Any Other' && (
                    <Input className="mt-2 w-full md:w-96" value={pqData.ownershipStatusOther} onChange={e => updateField('ownershipStatusOther', e.target.value)} placeholder="Please specify" disabled={isSubmitted} />
                  )}
                </div>
              </div>
            )}

            {/* STEP 1: Part A - Programs (A8-A9) */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <CardTitle className="text-lg">Part A — Programs (A8-A9)</CardTitle>

                <div>
                  <h3 className="font-semibold mb-3">A8. Details of all Programs being Offered</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><Label>No. of UG programs</Label><Input value={pqData.numUGPrograms} onChange={e => updateField('numUGPrograms', e.target.value)} disabled={isSubmitted} /></div>
                    <div><Label>No. of PG programs</Label><Input value={pqData.numPGPrograms} onChange={e => updateField('numPGPrograms', e.target.value)} disabled={isSubmitted} /></div>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium">Table A8.1: List of all programs offered</p>
                    {!isSubmitted && (
                      <Button size="sm" variant="outline" onClick={() => addRow('programsOffered', pqData.programsOffered, { level: '', name: '', yearOfStart: '', yearOfClose: '', department: '' })}>
                        <Plus className="w-3 h-3 mr-1" /> Add Row
                      </Button>
                    )}
                  </div>
                  <div className="border rounded-lg overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">S.N.</TableHead>
                          <TableHead>Level (UG/PG)</TableHead>
                          <TableHead>Name of Program</TableHead>
                          <TableHead>Year of Start</TableHead>
                          <TableHead>Year of Close</TableHead>
                          <TableHead>Department</TableHead>
                          {!isSubmitted && <TableHead className="w-16">Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pqData.programsOffered.map((row, idx) => (
                          <TableRow key={row.id}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell><Select value={row.level} onValueChange={v => updateRow('programsOffered', pqData.programsOffered, row.id, 'level', v)} disabled={isSubmitted}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="UG">UG</SelectItem><SelectItem value="PG">PG</SelectItem></SelectContent></Select></TableCell>
                            <TableCell><Input value={row.name} onChange={e => updateRow('programsOffered', pqData.programsOffered, row.id, 'name', e.target.value)} disabled={isSubmitted} /></TableCell>
                            <TableCell><Input value={row.yearOfStart} onChange={e => updateRow('programsOffered', pqData.programsOffered, row.id, 'yearOfStart', e.target.value)} disabled={isSubmitted} /></TableCell>
                            <TableCell><Input value={row.yearOfClose} onChange={e => updateRow('programsOffered', pqData.programsOffered, row.id, 'yearOfClose', e.target.value)} disabled={isSubmitted} /></TableCell>
                            <TableCell><Input value={row.department} onChange={e => updateRow('programsOffered', pqData.programsOffered, row.id, 'department', e.target.value)} disabled={isSubmitted} /></TableCell>
                            {!isSubmitted && <TableCell><Button size="sm" variant="ghost" onClick={() => removeRow('programsOffered', pqData.programsOffered, row.id)} disabled={pqData.programsOffered.length <= 1}><Trash2 className="w-3 h-3" /></Button></TableCell>}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">A9. Programs to be Considered for Accreditation</h3>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium">Table A9.1: Programs for accreditation</p>
                    {!isSubmitted && (
                      <Button size="sm" variant="outline" onClick={() => addRow('programsForAccreditation', pqData.programsForAccreditation, { department: '', program: '' })}>
                        <Plus className="w-3 h-3 mr-1" /> Add Row
                      </Button>
                    )}
                  </div>
                  <div className="border rounded-lg overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">S.N.</TableHead>
                          <TableHead>Name of the Department</TableHead>
                          <TableHead>Name of the Program</TableHead>
                          {!isSubmitted && <TableHead className="w-16">Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pqData.programsForAccreditation.map((row, idx) => (
                          <TableRow key={row.id}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell><Input value={row.department} onChange={e => updateRow('programsForAccreditation', pqData.programsForAccreditation, row.id, 'department', e.target.value)} disabled={isSubmitted} /></TableCell>
                            <TableCell><Input value={row.program} onChange={e => updateRow('programsForAccreditation', pqData.programsForAccreditation, row.id, 'program', e.target.value)} disabled={isSubmitted} /></TableCell>
                            {!isSubmitted && <TableCell><Button size="sm" variant="ghost" onClick={() => removeRow('programsForAccreditation', pqData.programsForAccreditation, row.id)} disabled={pqData.programsForAccreditation.length <= 1}><Trash2 className="w-3 h-3" /></Button></TableCell>}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium">Table A9.2: Allied Departments</p>
                    {!isSubmitted && (
                      <Button size="sm" variant="outline" onClick={() => addRow('alliedDepartments', pqData.alliedDepartments, { department: '', alliedDepartment: '' })}>
                        <Plus className="w-3 h-3 mr-1" /> Add Row
                      </Button>
                    )}
                  </div>
                  <div className="border rounded-lg overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">S.N.</TableHead>
                          <TableHead>Name of the Department (in A9.1)</TableHead>
                          <TableHead>Name of Allied Departments/Cluster</TableHead>
                          {!isSubmitted && <TableHead className="w-16">Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pqData.alliedDepartments.map((row, idx) => (
                          <TableRow key={row.id}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell><Input value={row.department} onChange={e => updateRow('alliedDepartments', pqData.alliedDepartments, row.id, 'department', e.target.value)} disabled={isSubmitted} /></TableCell>
                            <TableCell><Input value={row.alliedDepartment} onChange={e => updateRow('alliedDepartments', pqData.alliedDepartments, row.id, 'alliedDepartment', e.target.value)} disabled={isSubmitted} /></TableCell>
                            {!isSubmitted && <TableCell><Button size="sm" variant="ghost" onClick={() => removeRow('alliedDepartments', pqData.alliedDepartments, row.id)} disabled={pqData.alliedDepartments.length <= 1}><Trash2 className="w-3 h-3" /></Button></TableCell>}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Part B - Program Information (B1-B2) */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <CardTitle className="text-lg">Part B — Program Information (B1-B2)</CardTitle>

                <div>
                  <h3 className="font-semibold mb-3">B1. Program Details</h3>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium">Table B1: Program details</p>
                    {!isSubmitted && (
                      <Button size="sm" variant="outline" onClick={() => addRow('programDetails', pqData.programDetails, { programName: '', yearOfStart: '', sanctionedIntake: '', intakeChange: '', yearOfChange: '', aicteApproval: '', accreditationStatus: '', timesAccredited: '' })}>
                        <Plus className="w-3 h-3 mr-1" /> Add Row
                      </Button>
                    )}
                  </div>
                  <div className="border rounded-lg overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10">S.N.</TableHead>
                          <TableHead className="min-w-[150px]">Program Name</TableHead>
                          <TableHead>Year of Start</TableHead>
                          <TableHead>Sanctioned Intake</TableHead>
                          <TableHead>Intake Change</TableHead>
                          <TableHead>Year of Change</TableHead>
                          <TableHead>AICTE Approval</TableHead>
                          <TableHead>Accreditation Status</TableHead>
                          <TableHead>Times Accredited</TableHead>
                          {!isSubmitted && <TableHead className="w-14">Del</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pqData.programDetails.map((row, idx) => (
                          <TableRow key={row.id}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell><Input value={row.programName} onChange={e => updateRow('programDetails', pqData.programDetails, row.id, 'programName', e.target.value)} disabled={isSubmitted} /></TableCell>
                            <TableCell><Input value={row.yearOfStart} onChange={e => updateRow('programDetails', pqData.programDetails, row.id, 'yearOfStart', e.target.value)} disabled={isSubmitted} /></TableCell>
                            <TableCell><Input value={row.sanctionedIntake} onChange={e => updateRow('programDetails', pqData.programDetails, row.id, 'sanctionedIntake', e.target.value)} disabled={isSubmitted} /></TableCell>
                            <TableCell><Input value={row.intakeChange} onChange={e => updateRow('programDetails', pqData.programDetails, row.id, 'intakeChange', e.target.value)} disabled={isSubmitted} /></TableCell>
                            <TableCell><Input value={row.yearOfChange} onChange={e => updateRow('programDetails', pqData.programDetails, row.id, 'yearOfChange', e.target.value)} disabled={isSubmitted} /></TableCell>
                            <TableCell><Input value={row.aicteApproval} onChange={e => updateRow('programDetails', pqData.programDetails, row.id, 'aicteApproval', e.target.value)} disabled={isSubmitted} /></TableCell>
                            <TableCell>
                              <Select value={row.accreditationStatus} onValueChange={v => updateRow('programDetails', pqData.programDetails, row.id, 'accreditationStatus', v)} disabled={isSubmitted}>
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Applying first time">Applying first time</SelectItem>
                                  <SelectItem value="Accredited 2/3 years">Accredited 2/3 years</SelectItem>
                                  <SelectItem value="Accredited 5/6 years">Accredited 5/6 years</SelectItem>
                                  <SelectItem value="Not accredited">Not accredited</SelectItem>
                                  <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                                  <SelectItem value="Not eligible">Not eligible</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell><Input value={row.timesAccredited} onChange={e => updateRow('programDetails', pqData.programDetails, row.id, 'timesAccredited', e.target.value)} disabled={isSubmitted} /></TableCell>
                            {!isSubmitted && <TableCell><Button size="sm" variant="ghost" onClick={() => removeRow('programDetails', pqData.programDetails, row.id)} disabled={pqData.programDetails.length <= 1}><Trash2 className="w-3 h-3" /></Button></TableCell>}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">B2.2. Detail of Head of the Department</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>A. Name of the HoD</Label><Input value={pqData.hodName} onChange={e => updateField('hodName', e.target.value)} disabled={isSubmitted} /></div>
                    <div><Label>B. Nature of Appointment</Label>
                      <Select value={pqData.hodAppointment} onValueChange={v => updateField('hodAppointment', v)} disabled={isSubmitted}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Regular">Regular</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Ad hoc">Ad hoc</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>C. Qualification</Label>
                      <Select value={pqData.hodQualification} onValueChange={v => updateField('hodQualification', v)} disabled={isSubmitted}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ph.D.">Ph.D.</SelectItem>
                          <SelectItem value="ME/M.Tech">ME/M.Tech</SelectItem>
                          <SelectItem value="Any other">Any other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {pqData.hodQualification === 'Any other' && (
                      <div><Label>Please specify</Label><Input value={pqData.hodQualificationOther} onChange={e => updateField('hodQualificationOther', e.target.value)} disabled={isSubmitted} /></div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Part B - Faculty Cadre & SFR (B2.1-B3) */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <CardTitle className="text-lg">Part B — Faculty Cadre & Student Faculty Ratio (B2.1-B3)</CardTitle>

                <div>
                  <h3 className="font-semibold mb-3">B2.1. Faculty Cadre in the Department and Allied Departments</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div><Label>Name of the Department</Label><Input value={pqData.facultyDepartmentName} onChange={e => updateField('facultyDepartmentName', e.target.value)} disabled={isSubmitted} /></div>
                    <div><Label>No. of Allied Departments</Label><Input value={pqData.numAlliedDepartments} onChange={e => updateField('numAlliedDepartments', e.target.value)} disabled={isSubmitted} /></div>
                    <div><Label>No. of UG (Engineering) programs</Label><Input value={pqData.numUGEnggPrograms} onChange={e => updateField('numUGEnggPrograms', e.target.value)} disabled={isSubmitted} /></div>
                    <div><Label>No. of PG (Engineering) programs</Label><Input value={pqData.numPGEnggPrograms} onChange={e => updateField('numPGEnggPrograms', e.target.value)} disabled={isSubmitted} /></div>
                  </div>

                  <p className="text-sm font-medium mb-2">Table B2.1.1: Faculty Cadre</p>
                  <div className="border rounded-lg overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10">S.N.</TableHead>
                          <TableHead className="min-w-[250px]">Designation</TableHead>
                          <TableHead colSpan={2} className="text-center">CAY</TableHead>
                          <TableHead colSpan={2} className="text-center">CAYm1</TableHead>
                        </TableRow>
                        <TableRow>
                          <TableHead></TableHead>
                          <TableHead></TableHead>
                          <TableHead>Regular</TableHead>
                          <TableHead>Contract/Ad hoc</TableHead>
                          <TableHead>Regular</TableHead>
                          <TableHead>Contract/Ad hoc</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pqData.facultyCadre.map((row, idx) => (
                          <TableRow key={row.id}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell className="text-sm">{row.designation}</TableCell>
                            <TableCell><Input value={row.cayRegular} onChange={e => updateRow('facultyCadre', pqData.facultyCadre, row.id, 'cayRegular', e.target.value)} disabled={isSubmitted} className="w-20" /></TableCell>
                            <TableCell><Input value={row.cayContract} onChange={e => updateRow('facultyCadre', pqData.facultyCadre, row.id, 'cayContract', e.target.value)} disabled={isSubmitted} className="w-20" /></TableCell>
                            <TableCell><Input value={row.caym1Regular} onChange={e => updateRow('facultyCadre', pqData.facultyCadre, row.id, 'caym1Regular', e.target.value)} disabled={isSubmitted} className="w-20" /></TableCell>
                            <TableCell><Input value={row.caym1Contract} onChange={e => updateRow('facultyCadre', pqData.facultyCadre, row.id, 'caym1Contract', e.target.value)} disabled={isSubmitted} className="w-20" /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">B3. Student Faculty Ratio (Summary)</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    SFR = S/TF where S = Total students, TF = Total faculty minus first-year-only faculty. Average SFR must be ≤ 25:1 over 3 years.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <h4 className="font-medium text-sm mb-3">CAY (Current Academic Year)</h4>
                      <div className="space-y-2">
                        <div><Label className="text-xs">Total Students (DS)</Label><Input value={pqData.sfrData.cayDS} onChange={e => { const s = { ...pqData.sfrData, cayDS: e.target.value }; updateField('sfrData', s); }} disabled={isSubmitted} /></div>
                        <div><Label className="text-xs">Allied Students (AS)</Label><Input value={pqData.sfrData.cayAS} onChange={e => { const s = { ...pqData.sfrData, cayAS: e.target.value }; updateField('sfrData', s); }} disabled={isSubmitted} /></div>
                        <div><Label className="text-xs">Dept Faculty (DF)</Label><Input value={pqData.sfrData.cayDF} onChange={e => { const s = { ...pqData.sfrData, cayDF: e.target.value }; updateField('sfrData', s); }} disabled={isSubmitted} /></div>
                        <div><Label className="text-xs">Allied Faculty (AF)</Label><Input value={pqData.sfrData.cayAF} onChange={e => { const s = { ...pqData.sfrData, cayAF: e.target.value }; updateField('sfrData', s); }} disabled={isSubmitted} /></div>
                        <div><Label className="text-xs">First-Year Faculty (FF)</Label><Input value={pqData.sfrData.cayFF} onChange={e => { const s = { ...pqData.sfrData, cayFF: e.target.value }; updateField('sfrData', s); }} disabled={isSubmitted} /></div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-medium text-sm mb-3">CAYm1 (Previous Year)</h4>
                      <div className="space-y-2">
                        <div><Label className="text-xs">Total Students (DS)</Label><Input value={pqData.sfrData.caym1DS} onChange={e => { const s = { ...pqData.sfrData, caym1DS: e.target.value }; updateField('sfrData', s); }} disabled={isSubmitted} /></div>
                        <div><Label className="text-xs">Allied Students (AS)</Label><Input value={pqData.sfrData.caym1AS} onChange={e => { const s = { ...pqData.sfrData, caym1AS: e.target.value }; updateField('sfrData', s); }} disabled={isSubmitted} /></div>
                        <div><Label className="text-xs">Dept Faculty (DF)</Label><Input value={pqData.sfrData.caym1DF} onChange={e => { const s = { ...pqData.sfrData, caym1DF: e.target.value }; updateField('sfrData', s); }} disabled={isSubmitted} /></div>
                        <div><Label className="text-xs">Allied Faculty (AF)</Label><Input value={pqData.sfrData.caym1AF} onChange={e => { const s = { ...pqData.sfrData, caym1AF: e.target.value }; updateField('sfrData', s); }} disabled={isSubmitted} /></div>
                        <div><Label className="text-xs">First-Year Faculty (FF)</Label><Input value={pqData.sfrData.caym1FF} onChange={e => { const s = { ...pqData.sfrData, caym1FF: e.target.value }; updateField('sfrData', s); }} disabled={isSubmitted} /></div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-medium text-sm mb-3">CAYm2 (Two Years Ago)</h4>
                      <div className="space-y-2">
                        <div><Label className="text-xs">Total Students (DS)</Label><Input value={pqData.sfrData.caym2DS} onChange={e => { const s = { ...pqData.sfrData, caym2DS: e.target.value }; updateField('sfrData', s); }} disabled={isSubmitted} /></div>
                        <div><Label className="text-xs">Allied Students (AS)</Label><Input value={pqData.sfrData.caym2AS} onChange={e => { const s = { ...pqData.sfrData, caym2AS: e.target.value }; updateField('sfrData', s); }} disabled={isSubmitted} /></div>
                        <div><Label className="text-xs">Dept Faculty (DF)</Label><Input value={pqData.sfrData.caym2DF} onChange={e => { const s = { ...pqData.sfrData, caym2DF: e.target.value }; updateField('sfrData', s); }} disabled={isSubmitted} /></div>
                        <div><Label className="text-xs">Allied Faculty (AF)</Label><Input value={pqData.sfrData.caym2AF} onChange={e => { const s = { ...pqData.sfrData, caym2AF: e.target.value }; updateField('sfrData', s); }} disabled={isSubmitted} /></div>
                        <div><Label className="text-xs">First-Year Faculty (FF)</Label><Input value={pqData.sfrData.caym2FF} onChange={e => { const s = { ...pqData.sfrData, caym2FF: e.target.value }; updateField('sfrData', s); }} disabled={isSubmitted} /></div>
                      </div>
                    </Card>
                  </div>

                  {/* Auto-calculated SFR */}
                  {(() => {
                    const calc = (ds: string, as_: string, df: string, af: string, ff: string) => {
                      const s = (Number(ds) || 0) + (Number(as_) || 0);
                      const f = (Number(df) || 0) + (Number(af) || 0);
                      const tf = f - (Number(ff) || 0);
                      return tf > 0 ? (s / tf).toFixed(2) : '—';
                    };
                    const sfr1 = calc(pqData.sfrData.cayDS, pqData.sfrData.cayAS, pqData.sfrData.cayDF, pqData.sfrData.cayAF, pqData.sfrData.cayFF);
                    const sfr2 = calc(pqData.sfrData.caym1DS, pqData.sfrData.caym1AS, pqData.sfrData.caym1DF, pqData.sfrData.caym1AF, pqData.sfrData.caym1FF);
                    const sfr3 = calc(pqData.sfrData.caym2DS, pqData.sfrData.caym2AS, pqData.sfrData.caym2DF, pqData.sfrData.caym2AF, pqData.sfrData.caym2FF);
                    const avg = sfr1 !== '—' && sfr2 !== '—' && sfr3 !== '—'
                      ? ((Number(sfr1) + Number(sfr2) + Number(sfr3)) / 3).toFixed(2) : '—';
                    return (
                      <Card className="mt-4 p-4 bg-blue-50 border-blue-200">
                        <h4 className="font-medium text-sm mb-2">Calculated SFR</h4>
                        <div className="grid grid-cols-4 gap-4 text-center text-sm">
                          <div><p className="text-gray-600">CAY</p><p className="font-bold text-lg">{sfr1}:1</p></div>
                          <div><p className="text-gray-600">CAYm1</p><p className="font-bold text-lg">{sfr2}:1</p></div>
                          <div><p className="text-gray-600">CAYm2</p><p className="font-bold text-lg">{sfr3}:1</p></div>
                          <div><p className="text-gray-600">Average</p><p className={`font-bold text-lg ${avg !== '—' && Number(avg) <= 25 ? 'text-green-600' : 'text-red-600'}`}>{avg}:1</p></div>
                        </div>
                        {avg !== '—' && Number(avg) <= 25 && <p className="text-green-700 text-xs mt-2 text-center">✓ SFR is within the acceptable limit (≤ 25:1)</p>}
                        {avg !== '—' && Number(avg) > 25 && <p className="text-red-700 text-xs mt-2 text-center">✗ SFR exceeds the acceptable limit (≤ 25:1)</p>}
                      </Card>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* STEP 4: Compliance Status */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <CardTitle className="text-lg">Compliance Status to Pre-Visit Qualifiers</CardTitle>
                <p className="text-sm text-gray-600">
                  All 6 pre-visit qualifiers must be marked as "Complied" before the pre-qualifier can be submitted.
                </p>

                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">S.N.</TableHead>
                        <TableHead className="min-w-[400px]">Pre-Visit Qualifiers</TableHead>
                        <TableHead className="min-w-[150px]">Current Status</TableHead>
                        <TableHead className="min-w-[180px]">Compliance Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pqData.complianceStatus.map((row, idx) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">{idx + 1}</TableCell>
                          <TableCell className="text-sm">{row.qualifier}</TableCell>
                          <TableCell>
                            <Input
                              value={row.currentStatus}
                              onChange={e => updateRow('complianceStatus', pqData.complianceStatus, row.id, 'currentStatus', e.target.value)}
                              placeholder="Enter current status"
                              disabled={isSubmitted}
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={row.complianceStatus}
                              onValueChange={v => updateRow('complianceStatus', pqData.complianceStatus, row.id, 'complianceStatus', v)}
                              disabled={isSubmitted}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Complied">Complied</SelectItem>
                                <SelectItem value="Not Complied">Not Complied</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Compliance Summary */}
                <Card className={`p-4 ${pqData.complianceStatus.every(c => c.complianceStatus === 'Complied') ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                  <div className="flex items-center gap-3">
                    {pqData.complianceStatus.every(c => c.complianceStatus === 'Complied') ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-800">All Pre-Visit Qualifiers Complied</p>
                          <p className="text-sm text-green-700">You are eligible to submit the pre-qualifier application.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-6 h-6 text-orange-600" />
                        <div>
                          <p className="font-semibold text-orange-800">
                            {pqData.complianceStatus.filter(c => c.complianceStatus === 'Complied').length} of 6 Qualifiers Complied
                          </p>
                          <p className="text-sm text-orange-700">All 6 qualifiers must be "Complied" to submit.</p>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation & Actions */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>

          <div className="flex gap-2">
            {isSubmitted && (
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="w-4 h-4 mr-1" /> Export PDF
              </Button>
            )}
            {!isSubmitted && (
              <Button variant="outline" onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-1" /> {saving ? 'Saving...' : 'Save Draft'}
              </Button>
            )}
            {currentStep < STEPS.length - 1 ? (
              <Button onClick={() => { handleSave(); setCurrentStep(currentStep + 1); }}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : !isSubmitted ? (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                <Send className="w-4 h-4 mr-1" /> Submit Pre-Qualifier
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </InstituteLayout>
  );
}