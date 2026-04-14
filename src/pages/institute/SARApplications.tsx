import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, ExternalLink, Plus, X, CheckCircle, AlertCircle, Lock, Download } from 'lucide-react';
import InstituteLayout from '@/components/InstituteLayout';
import InstituteInformationForm from './InstituteInformationForm';
import SARCriteriaForm from '@/components/SARCriteriaForm';
import { useAuth } from '@/lib/auth';
import { getSARApplicationsByInstitution, updateSARApplication } from '@/lib/data';
import { isPreQualifierSubmitted } from '@/lib/prequalifier';
import { exportSARInstituteInfoPDF, exportSARCriteriaPDF } from '@/lib/pdfExport';
import type { SARApplication } from '@/lib/types';

export default function SARApplications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCriteriaFormOpen, setIsCriteriaFormOpen] = useState(false);
  const [showDepartmentSelection, setShowDepartmentSelection] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [sarApplications, setSarApplications] = useState<SARApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<SARApplication | null>(null);
  const [pqSubmitted, setPqSubmitted] = useState(false);

  useEffect(() => {
    if (user?.institutionId) {
      setPqSubmitted(isPreQualifierSubmitted(user.institutionId));
    }
  }, [user]);

  useEffect(() => {
    if (user?.institutionId) {
      const apps = getSARApplicationsByInstitution(user.institutionId);
      setSarApplications(apps);
    }
  }, [user]);

  useEffect(() => {
    const appId = searchParams.get('app');
    if (appId && sarApplications.length > 0) {
      const application = sarApplications.find(app => app.id === appId);
      if (application) {
        handleFillForm(application);
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, sarApplications]);

  const handleProgressUpdate = (applicationId: string, progress: number) => {
    setSarApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { 
              ...app, 
              completionPercentage: progress,
              status: progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'draft',
              lastModified: new Date().toISOString()
            }
          : app
      )
    );
  };

  const handleFillForm = (application: SARApplication) => {
    if (application.departmentName === 'Institute Information') {
      setSelectedApplicationId(application.id);
      setIsFormOpen(true);
    } else {
      setSelectedApplication(application);
      setIsCriteriaFormOpen(true);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedApplicationId('');
  };

  const handleCloseCriteriaForm = () => {
    setIsCriteriaFormOpen(false);
    setSelectedApplication(null);
  };

  const handleUpdateApplication = (applicationId: string, updates: Partial<SARApplication>) => {
    setSarApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, ...updates }
          : app
      )
    );
    updateSARApplication(applicationId, updates);
    if (selectedApplication?.id === applicationId) {
      setSelectedApplication(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleExportInstituteInfoPDF = (application: SARApplication) => {
    const fileName = `${application.applicationId}-institution-information.pdf`;
    exportSARInstituteInfoPDF(application.applicationId, {}, fileName);
  };

  const handleExportDeptAllCriteria = (application: SARApplication) => {
    for (const criteria of application.criteria) {
      const fileName = `${application.applicationId}-criteria${criteria.criteriaNumber}.pdf`;
      exportSARCriteriaPDF(application, criteria, fileName);
    }
  };

  const handleStartNewApplication = () => {
    setShowDepartmentSelection(true);
    setSelectedDepartments([]);
  };

  const handleCloseDepartmentSelection = () => {
    setShowDepartmentSelection(false);
    setSelectedDepartments([]);
  };

  const handleDepartmentToggle = (departmentCode: string, checked: boolean) => {
    if (checked) {
      setSelectedDepartments(prev => [...prev, departmentCode]);
    } else {
      setSelectedDepartments(prev => prev.filter(code => code !== departmentCode));
    }
  };

  const handleCreateApplications = () => {
    if (selectedDepartments.length === 0) {
      alert('Please select at least one department to create SAR applications.');
      return;
    }

    const currentDate = new Date();
    const dateString = currentDate.toISOString().slice(0, 10).replace(/-/g, '');

    const newApplications: SARApplication[] = selectedDepartments.map(deptCode => {
      const department = departments.find(d => d.code === deptCode);
      const newApplicationId = `SAR-RGUKT-${deptCode}-${dateString}`;

      return {
        id: `${Date.now()}-${deptCode}`,
        applicationId: newApplicationId,
        institutionId: user?.institutionId || '1',
        departmentName: department?.name || '',
        applicationStartDate: currentDate.toISOString(),
        applicationEndDate: new Date(currentDate.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'draft',
        completionPercentage: 0,
        criteria: [],
        overallMarks: 0,
        maxOverallMarks: 700,
        lastModified: currentDate.toISOString()
      };
    });

    setSarApplications(prev => [...prev, ...newApplications]);
    setShowDepartmentSelection(false);
    setSelectedDepartments([]);
    
    const applicationIds = newApplications.map(app => app.applicationId).join(', ');
    alert(`${newApplications.length} SAR Application(s) created successfully!\nApplication IDs: ${applicationIds}`);
  };

  const departments = [
    { name: 'Computer Science and Engineering', code: 'CSE', icon: '💻' },
    { name: 'Electronics and Communication Engineering', code: 'ECE', icon: '📡' },
    { name: 'Electrical and Electronics Engineering', code: 'EEE', icon: '⚡' },
    { name: 'Mechanical Engineering', code: 'MECH', icon: '⚙️' },
    { name: 'Civil Engineering', code: 'CIVIL', icon: '🏗️' },
    { name: 'Chemical Engineering', code: 'CHEM', icon: '🧪' },
    { name: 'Information Technology', code: 'IT', icon: '🌐' },
    { name: 'Biotechnology', code: 'BT', icon: '🧬' },
    { name: 'Metallurgical Engineering', code: 'MET', icon: '🔩' },
    { name: 'Aerospace Engineering', code: 'AERO', icon: '✈️' }
  ];

  const departmentApplications = sarApplications.filter(app => app.departmentName !== 'Institute Information');
  const availableDepartments = departments.filter(dept => 
    !departmentApplications.some(app => app.departmentName === dept.name)
  );

  const getProgressBarColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-300';
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-orange-500';
    if (progress < 75) return 'bg-yellow-500';
    if (progress < 100) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const instituteInfoApp = sarApplications.find(app => app.departmentName === 'Institute Information');

  // Gate: If pre-qualifier not submitted, show locked state
  if (!pqSubmitted) {
    return (
      <InstituteLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SAR Applications</h1>
            <p className="text-gray-600 mt-2">
              Manage your Self Assessment Report applications for NBA accreditation
            </p>
          </div>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Lock className="w-10 h-10 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Pre-Qualifier Required</h2>
              <p className="text-gray-600 max-w-md mb-2">
                You must submit the Pre-Qualifier application before you can access SAR Applications. 
                The Pre-Qualifier verifies that your institution meets the basic eligibility criteria for NBA accreditation.
              </p>
              <div className="flex items-center gap-2 mt-2 mb-6">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-700 font-medium">All 6 pre-visit qualifiers must be complied with</span>
              </div>
              <Button
                size="lg"
                onClick={() => navigate('/institute/pre-qualifiers')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Go to Pre-Qualifiers
              </Button>
            </CardContent>
          </Card>
        </div>
      </InstituteLayout>
    );
  }

  if (showDepartmentSelection) {
    return (
      <InstituteLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New SAR Applications</h1>
              <p className="text-gray-600 mt-2">
                Select departments to create Self Assessment Report applications
              </p>
            </div>
            <Button variant="outline" onClick={handleCloseDepartmentSelection} className="flex items-center gap-2">
              <X className="w-4 h-4" /> Cancel
            </Button>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900">Available Departments</h3>
                <div className="text-sm text-gray-600">
                  {selectedDepartments.length} of {availableDepartments.length} selected
                </div>
              </div>

              {availableDepartments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableDepartments.map((department) => (
                    <div key={department.code} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox
                        id={department.code}
                        checked={selectedDepartments.includes(department.code)}
                        onCheckedChange={(checked) => handleDepartmentToggle(department.code, checked as boolean)}
                      />
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-2xl">{department.icon}</span>
                        <div>
                          <Label htmlFor={department.code} className="text-sm font-medium text-gray-900 cursor-pointer">
                            {department.name}
                          </Label>
                          <p className="text-xs text-gray-500">Code: {department.code}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">All Departments Covered!</h3>
                  <p className="text-gray-600">SAR applications have been created for all available departments.</p>
                </div>
              )}
            </div>

            {availableDepartments.length > 0 && (
              <div className="flex justify-between items-center pt-6 border-t mt-6">
                <div className="text-sm text-gray-600">
                  {selectedDepartments.length > 0 && (<>Selected: {selectedDepartments.join(', ')}</>)}
                </div>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setSelectedDepartments(availableDepartments.map(d => d.code))}>Select All</Button>
                  <Button variant="outline" onClick={() => setSelectedDepartments([])}>Clear All</Button>
                  <Button onClick={handleCreateApplications} disabled={selectedDepartments.length === 0} className="bg-blue-600 hover:bg-blue-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Create {selectedDepartments.length} Application{selectedDepartments.length !== 1 ? 's' : ''}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </InstituteLayout>
    );
  }

  return (
    <InstituteLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SAR Applications</h1>
          <p className="text-gray-600 mt-2">
            Manage your Self Assessment Report applications for NBA accreditation
          </p>
        </div>

        {/* Pre-qualifier success banner */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="flex items-center gap-3 py-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800">Pre-Qualifier submitted successfully. You can now fill SAR applications.</p>
          </CardContent>
        </Card>

        {/* Institute Information Section */}
        {instituteInfoApp && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center">
                <span className="text-sm font-medium">📋</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Institute Information</h2>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="grid grid-cols-8 gap-4 px-6 py-3 bg-gray-50 border-b text-sm font-medium text-gray-700">
                <div>Application ID</div><div>Department</div><div>Status</div><div>Progress</div>
                <div>Start Date</div><div>Last Modified</div><div>Modified By</div><div>Actions</div>
              </div>
              <div className="grid grid-cols-8 gap-4 px-6 py-4 items-center border-b last:border-b-0">
                <div className="text-sm font-medium text-gray-900">{instituteInfoApp.applicationId}</div>
                <div className="text-sm text-gray-600">{instituteInfoApp.departmentName}</div>
                <div>
                  <Badge variant="outline" className={getStatusBadgeColor(instituteInfoApp.status)}>
                    {instituteInfoApp.status === 'completed' ? 'Completed' : instituteInfoApp.status === 'in-progress' ? 'In Progress' : 'Draft'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(instituteInfoApp.completionPercentage)}`} style={{ width: `${instituteInfoApp.completionPercentage}%` }}></div>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{instituteInfoApp.completionPercentage}%</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {new Date(instituteInfoApp.applicationStartDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {new Date(instituteInfoApp.lastModified).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <User className="w-4 h-4" />{user?.email || 'Unknown'}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => handleFillForm(instituteInfoApp)} className="flex items-center gap-1">
                    <ExternalLink className="w-4 h-4" />
                    {instituteInfoApp.completionPercentage === 100 ? 'View' : 'Fill'}
                  </Button>
                  {instituteInfoApp.completionPercentage > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => handleExportInstituteInfoPDF(instituteInfoApp)} title="Export PDF">
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Department SAR Applications Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Department SAR Applications</h2>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white" onClick={handleStartNewApplication}>
              <Plus className="w-4 h-4 mr-2" /> Start New Application
            </Button>
          </div>

          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="grid grid-cols-8 gap-4 px-6 py-3 bg-gray-50 border-b text-sm font-medium text-gray-700">
              <div>Application ID</div><div>Department</div><div>Status</div><div>Progress</div>
              <div>Start Date</div><div>Last Modified</div><div>Modified By</div><div>Actions</div>
            </div>

            {departmentApplications.length > 0 ? (
              departmentApplications.map((application) => (
                <div key={application.id} className="grid grid-cols-8 gap-4 px-6 py-4 items-center border-b last:border-b-0">
                  <div className="text-sm font-medium text-gray-900">{application.applicationId}</div>
                  <div className="text-sm text-gray-600">{application.departmentName}</div>
                  <div>
                    <Badge variant="outline" className={getStatusBadgeColor(application.status)}>
                      {application.status === 'completed' ? 'Completed' : application.status === 'in-progress' ? 'In Progress' : 'Draft'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(application.completionPercentage)}`} style={{ width: `${application.completionPercentage}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{application.completionPercentage}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(application.applicationStartDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(application.lastModified).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <User className="w-4 h-4" />{user?.email || 'Unknown'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" onClick={() => handleFillForm(application)} className="flex items-center gap-1">
                      <ExternalLink className="w-4 h-4" />
                      {application.completionPercentage === 100 ? 'View' : 'Fill'}
                    </Button>
                    {application.criteria.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={() => handleExportDeptAllCriteria(application)} title="Export All Criteria PDFs">
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Department Applications</h3>
                <p className="text-gray-600 mb-4">Create SAR applications for your departments to get started.</p>
                <Button onClick={handleStartNewApplication}>
                  <Plus className="w-4 h-4 mr-2" /> Create First Application
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <InstituteInformationForm isOpen={isFormOpen} onClose={handleCloseForm} applicationId={selectedApplicationId} onProgressUpdate={handleProgressUpdate} />
      <SARCriteriaForm isOpen={isCriteriaFormOpen} onClose={handleCloseCriteriaForm} application={selectedApplication} onUpdate={handleUpdateApplication} />
    </InstituteLayout>
  );
}