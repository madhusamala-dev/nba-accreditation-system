import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, FileText, TrendingUp, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import InstituteLayout from '@/components/InstituteLayout';
import { getSARApplicationsByInstitution, getInstitutionById } from '@/lib/data';
import { useAuth } from '@/lib/auth';
import type { SARApplication, Institution } from '@/lib/types';

export default function InstituteDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sarApplications, setSarApplications] = useState<SARApplication[]>([]);
  const [institution, setInstitution] = useState<Institution | null>(null);

  useEffect(() => {
    if (user?.institutionId) {
      console.log('Loading data for institution:', user.institutionId);
      
      // Get institution details
      const inst = getInstitutionById(user.institutionId);
      console.log('Institution found:', inst);
      setInstitution(inst || null);
      
      // Get SAR applications
      const apps = getSARApplicationsByInstitution(user.institutionId);
      console.log('SAR applications found:', apps);
      
      // Update Institute Information to 100% progress if it exists
      const updatedApps = apps.map(app => {
        if (app.departmentName === 'Institute Information') {
          return {
            ...app,
            completionPercentage: 100,
            status: 'completed' as const
          };
        }
        return app;
      });
      
      setSarApplications(updatedApps);
    }
  }, [user]);

  // Navigate to SAR Applications page with the selected application
  const handleApplicationClick = (application: SARApplication) => {
    navigate(`/institute/sar?app=${application.id}`);
  };

  // Function to get progress bar color based on progress percentage
  const getProgressBarColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-300';
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-orange-500';
    if (progress < 75) return 'bg-yellow-500';
    if (progress < 100) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // Function to get status badge color and icon
  const getStatusInfo = (status: string, progress: number) => {
    const normalizedStatus = status.toLowerCase();
    if (progress === 100 || normalizedStatus === 'completed') {
      return {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="w-3 h-3" />,
        text: 'Completed'
      };
    }
    if (progress > 0 || normalizedStatus === 'in-progress') {
      return {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Clock className="w-3 h-3" />,
        text: 'In Progress'
      };
    }
    return {
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: <AlertCircle className="w-3 h-3" />,
      text: 'Draft'
    };
  };

  // Calculate overall progress
  const totalApplications = sarApplications.length;
  const overallProgress = totalApplications > 0 
    ? Math.round(sarApplications.reduce((sum, app) => sum + app.completionPercentage, 0) / totalApplications)
    : 0;

  // SAR Application dates
  const applicationStartDate = sarApplications.length > 0 
    ? new Date(sarApplications[0].applicationStartDate)
    : new Date();
  
  const applicationEndDate = new Date(applicationStartDate);
  applicationEndDate.setDate(applicationStartDate.getDate() + 90); // 90 days completion window

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Sort applications to show Institute Information first
  const sortedApplications = [...sarApplications].sort((a, b) => {
    if (a.departmentName === 'Institute Information') return -1;
    if (b.departmentName === 'Institute Information') return 1;
    return a.departmentName.localeCompare(b.departmentName);
  });

  if (!institution) {
    return (
      <InstituteLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </InstituteLayout>
    );
  }

  return (
    <InstituteLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Institute Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome to {institution.name} - NBA Accreditation Management System
          </p>
        </div>

        {/* SAR Application Stage */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">SAR Application Stage</h2>
          </div>

          {/* Timeline and Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Application Start Date</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatDate(applicationStartDate)}
                </div>
                <p className="text-xs text-muted-foreground">
                  SAR application period began
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Application End Date</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {formatDate(applicationEndDate)}
                </div>
                <p className="text-xs text-muted-foreground">
                  90-day completion window
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {totalApplications}
                </div>
                <p className="text-xs text-muted-foreground">
                  SAR applications in progress
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {overallProgress}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(overallProgress)}`}
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SAR Applications List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                SAR Applications
              </CardTitle>
              <CardDescription>
                Click on any application to fill or view its data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedApplications.map((application) => {
                  const statusInfo = getStatusInfo(application.status, application.completionPercentage);
                  const isInstituteInfo = application.departmentName === 'Institute Information';
                  
                  return (
                    <div 
                      key={application.id} 
                      className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer group ${
                        isInstituteInfo ? 'bg-blue-50 border-blue-200 hover:border-blue-400' : 'bg-white border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => handleApplicationClick(application)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isInstituteInfo ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <span className="text-lg">
                              {isInstituteInfo ? '🏛️' : '🎓'}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                              {application.departmentName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {application.applicationId}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <Badge variant="outline" className={statusInfo.color}>
                              <div className="flex items-center gap-1">
                                {statusInfo.icon}
                                {statusInfo.text}
                              </div>
                            </Badge>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(application.completionPercentage)}`}
                                  style={{ width: `${application.completionPercentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                {application.completionPercentage}%
                              </span>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </InstituteLayout>
  );
}