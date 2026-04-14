import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import RichTextEditor from './RichTextEditor';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  X,
  Plus,
  ChevronDown,
  ChevronRight,
  Award
} from 'lucide-react';
import type { SARApplication, Criteria, SectionData } from '@/lib/types';

interface SARCriteriaFormProps {
  isOpen: boolean;
  onClose: () => void;
  application: SARApplication | null;
  onUpdate: (applicationId: string, updates: Partial<SARApplication>) => void;
}

type ActiveItem = {
  type: 'section';
  sectionId: string;
} | {
  type: 'subsection';
  sectionId: string;
  subSectionId: string;
} | null;

/** Build a unique key string from the active item so we can force re-mount the editor */
const activeItemKey = (item: ActiveItem): string => {
  if (!item) return '';
  if (item.type === 'section') return `section-${item.sectionId}`;
  return `subsection-${item.sectionId}-${item.subSectionId}`;
};

const SARCriteriaForm: React.FC<SARCriteriaFormProps> = ({
  isOpen,
  onClose,
  application,
  onUpdate
}) => {
  const [selectedCriteria, setSelectedCriteria] = useState<Criteria | null>(null);
  const [activeItem, setActiveItem] = useState<ActiveItem>(null);
  const [editorContent, setEditorContent] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [newAttachment, setNewAttachment] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [instituteMarks, setInstituteMarks] = useState<number>(0);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedCriteria(null);
      setActiveItem(null);
      setEditorContent('');
      setAttachments([]);
      setExpandedSections({});
      setInstituteMarks(0);
    }
  }, [isOpen]);

  // Load content when active item changes
  useEffect(() => {
    if (!activeItem || !selectedCriteria) {
      setEditorContent('');
      setAttachments([]);
      setInstituteMarks(0);
      return;
    }

    if (activeItem.type === 'section') {
      const section = selectedCriteria.sections.find(s => s.id === activeItem.sectionId);
      if (section) {
        setEditorContent(section.content);
        setAttachments([...section.attachments]);
        setInstituteMarks(section.instituteMarks ?? 0);
      }
    } else if (activeItem.type === 'subsection') {
      const section = selectedCriteria.sections.find(s => s.id === activeItem.sectionId);
      const sub = section?.subsections?.find(ss => ss.id === activeItem.subSectionId);
      if (sub) {
        setEditorContent(sub.content);
        setAttachments([...sub.attachments]);
        setInstituteMarks(sub.instituteMarks ?? 0);
      }
    }
  }, [activeItem, selectedCriteria]);

  if (!application) return null;

  const handleCriteriaSelect = (criteria: Criteria) => {
    setSelectedCriteria(criteria);
    setActiveItem(null);
    const expanded: Record<string, boolean> = {};
    criteria.sections.forEach(s => { expanded[s.id] = true; });
    setExpandedSections(expanded);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const handleSelectSection = (sectionId: string) => {
    const section = selectedCriteria?.sections.find(s => s.id === sectionId);
    if (section && (!section.subsections || section.subsections.length === 0)) {
      setActiveItem({ type: 'section', sectionId });
    }
  };

  const handleSelectSubSection = (sectionId: string, subSectionId: string) => {
    setActiveItem({ type: 'subsection', sectionId, subSectionId });
  };

  const getActiveTitle = (): string => {
    if (!activeItem || !selectedCriteria) return '';
    if (activeItem.type === 'section') {
      const section = selectedCriteria.sections.find(s => s.id === activeItem.sectionId);
      return section ? `${section.sectionNumber} ${section.title}` : '';
    }
    const section = selectedCriteria.sections.find(s => s.id === activeItem.sectionId);
    const sub = section?.subsections?.find(ss => ss.id === activeItem.subSectionId);
    return sub ? `${sub.subSectionNumber} ${sub.title}` : '';
  };

  const getActiveMaxMarks = (): number => {
    if (!activeItem || !selectedCriteria) return 0;
    if (activeItem.type === 'section') {
      const section = selectedCriteria.sections.find(s => s.id === activeItem.sectionId);
      return section?.maxMarks || 0;
    }
    const section = selectedCriteria.sections.find(s => s.id === activeItem.sectionId);
    const sub = section?.subsections?.find(ss => ss.id === activeItem.subSectionId);
    return sub?.maxMarks || 0;
  };

  const calculateCriteriaObtainedMarks = (criteria: Criteria): number => {
    let total = 0;
    criteria.sections.forEach(s => {
      if (s.subsections && s.subsections.length > 0) {
        s.subsections.forEach(ss => {
          total += ss.instituteMarks ?? 0;
        });
      } else {
        total += s.instituteMarks ?? 0;
      }
    });
    return total;
  };

  const getSectionInstituteMarks = (section: SectionData): number => {
    if (section.subsections && section.subsections.length > 0) {
      return section.subsections.reduce((sum, ss) => sum + (ss.instituteMarks ?? 0), 0);
    }
    return section.instituteMarks ?? 0;
  };

  const handleSave = () => {
    if (!activeItem || !selectedCriteria || !application) return;

    const maxMarks = getActiveMaxMarks();
    const clampedMarks = Math.min(Math.max(0, instituteMarks), maxMarks);

    let updatedCriteria: Criteria;

    if (activeItem.type === 'section') {
      updatedCriteria = {
        ...selectedCriteria,
        sections: selectedCriteria.sections.map(s =>
          s.id === activeItem.sectionId
            ? {
                ...s,
                content: editorContent,
                attachments: [...attachments],
                instituteMarks: clampedMarks,
                isCompleted: editorContent.trim().length > 0,
                lastModified: new Date().toISOString()
              }
            : s
        )
      };
    } else {
      updatedCriteria = {
        ...selectedCriteria,
        sections: selectedCriteria.sections.map(s => {
          if (s.id !== activeItem.sectionId) return s;
          const updatedSubs = s.subsections?.map(ss =>
            ss.id === activeItem.subSectionId
              ? {
                  ...ss,
                  content: editorContent,
                  attachments: [...attachments],
                  instituteMarks: clampedMarks,
                  isCompleted: editorContent.trim().length > 0,
                  lastModified: new Date().toISOString()
                }
              : ss
          );
          const allSubsCompleted = updatedSubs?.every(ss => ss.isCompleted) ?? false;
          const sectionInstituteMarks = updatedSubs?.reduce((sum, ss) => sum + (ss.instituteMarks ?? 0), 0) ?? 0;
          return {
            ...s,
            subsections: updatedSubs,
            instituteMarks: sectionInstituteMarks,
            isCompleted: allSubsCompleted,
            lastModified: new Date().toISOString()
          };
        })
      };
    }

    updatedCriteria.completedSections = updatedCriteria.sections.filter(s => s.isCompleted).length;
    updatedCriteria.obtainedMarks = calculateCriteriaObtainedMarks(updatedCriteria);

    const updatedApplication: SARApplication = {
      ...application,
      criteria: application.criteria.map(c =>
        c.id === selectedCriteria.id ? updatedCriteria : c
      ),
      lastModified: new Date().toISOString()
    };

    let totalLeafs = 0;
    let completedLeafs = 0;
    updatedApplication.criteria.forEach(c => {
      c.sections.forEach(s => {
        if (s.subsections && s.subsections.length > 0) {
          totalLeafs += s.subsections.length;
          completedLeafs += s.subsections.filter(ss => ss.isCompleted).length;
        } else {
          totalLeafs += 1;
          if (s.isCompleted) completedLeafs += 1;
        }
      });
    });
    updatedApplication.completionPercentage = totalLeafs > 0 ? Math.round((completedLeafs / totalLeafs) * 100) : 0;

    updatedApplication.overallMarks = updatedApplication.criteria.reduce(
      (sum, c) => sum + calculateCriteriaObtainedMarks(c), 0
    );

    if (updatedApplication.completionPercentage === 100) {
      updatedApplication.status = 'completed';
    } else if (updatedApplication.completionPercentage > 0) {
      updatedApplication.status = 'in-progress';
    }

    onUpdate(application.id, updatedApplication);
    setSelectedCriteria(updatedCriteria);
  };

  const handleAddAttachment = () => {
    if (newAttachment.trim()) {
      setAttachments([...attachments, newAttachment.trim()]);
      setNewAttachment('');
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const getStatusIcon = (isCompleted: boolean) => {
    return isCompleted
      ? <CheckCircle className="w-4 h-4 text-green-600" />
      : <Clock className="w-4 h-4 text-gray-400" />;
  };

  const getCriteriaProgress = (criteria: Criteria) => {
    return criteria.sections.length > 0
      ? Math.round((criteria.completedSections / criteria.sections.length) * 100)
      : 0;
  };

  const getSectionCompletionCount = (section: SectionData): string => {
    if (!section.subsections || section.subsections.length === 0) {
      return section.isCompleted ? '1/1' : '0/1';
    }
    const completed = section.subsections.filter(ss => ss.isCompleted).length;
    return `${completed}/${section.subsections.length}`;
  };

  const isSectionFullyCompleted = (section: SectionData): boolean => {
    if (!section.subsections || section.subsections.length === 0) {
      return section.isCompleted;
    }
    return section.subsections.every(ss => ss.isCompleted);
  };

  const handleInstituteMarksChange = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setInstituteMarks(0);
    } else {
      const maxMarks = getActiveMaxMarks();
      setInstituteMarks(Math.min(Math.max(0, num), maxMarks));
    }
  };

  // ===================== CRITERIA SELECTION VIEW =====================
  if (!selectedCriteria) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5" />
            <h2 className="text-xl font-bold">{application.departmentName} - SAR Criteria</h2>
          </div>

          <div className="space-y-6">
            {/* Application Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-blue-900">{application.applicationId}</h3>
                  <p className="text-blue-700 text-sm">Overall Progress: {application.completionPercentage}%</p>
                  <p className="text-blue-600 text-sm mt-1">
                    Institute Marks: {application.overallMarks} / {application.maxOverallMarks}
                  </p>
                </div>
                <Progress value={application.completionPercentage} className="w-32" />
              </div>
            </div>

            {/* Criteria Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {application.criteria.map((criteria) => {
                const progress = getCriteriaProgress(criteria);
                const obtainedMarks = calculateCriteriaObtainedMarks(criteria);
                return (
                  <Card
                    key={criteria.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleCriteriaSelect(criteria)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            Criteria {criteria.criteriaNumber}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            {criteria.title}
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-2 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {criteria.maxMarks} marks
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-700">
                          {criteria.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {criteria.completedSections} of {criteria.sections.length} sections
                          </span>
                          <span className="text-sm font-medium">{progress}%</span>
                        </div>

                        <Progress value={progress} className="h-2" />

                        {/* Institute Marks Display */}
                        <div className="bg-gray-50 rounded-md p-2 flex items-center justify-between">
                          <span className="text-sm text-gray-600">Institute Marks:</span>
                          <span className="text-sm font-bold text-blue-700">
                            {obtainedMarks} / {criteria.maxMarks}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          {progress === 100 ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-green-600">Completed</span>
                            </>
                          ) : progress > 0 ? (
                            <>
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span className="text-blue-600">In Progress</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500">Not Started</span>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ===================== CRITERIA DETAIL VIEW (Split Pane) =====================
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-[1400px] max-h-[92vh] overflow-hidden p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setSelectedCriteria(null); setActiveItem(null); }}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Criteria {selectedCriteria.criteriaNumber}: {selectedCriteria.title}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedCriteria.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right mr-2">
              <div className="text-xs text-gray-500">Institute Marks</div>
              <div className="text-sm font-bold text-blue-700">
                {calculateCriteriaObtainedMarks(selectedCriteria)} / {selectedCriteria.maxMarks}
              </div>
            </div>
            <Badge variant="outline" className="text-sm flex items-center gap-1">
              <Award className="w-3 h-3" />
              Total: {selectedCriteria.maxMarks} Marks
            </Badge>
            <Progress
              value={getCriteriaProgress(selectedCriteria)}
              className="w-24"
            />
            <span className="text-sm font-medium text-gray-600">
              {getCriteriaProgress(selectedCriteria)}%
            </span>
          </div>
        </div>

        {/* Split Pane Layout */}
        <div className="flex h-[calc(92vh-80px)]">
          {/* LEFT: Section Navigation */}
          <div className="w-[340px] border-r bg-gray-50 overflow-y-auto flex-shrink-0">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Sections
              </h3>
              <div className="space-y-1">
                {selectedCriteria.sections.map((section) => {
                  const hasSubsections = section.subsections && section.subsections.length > 0;
                  const isExpanded = expandedSections[section.id] ?? true;
                  const isFullyCompleted = isSectionFullyCompleted(section);
                  const sectionMarks = getSectionInstituteMarks(section);

                  return (
                    <div key={section.id}>
                      {/* Section Header */}
                      <Collapsible open={isExpanded} onOpenChange={() => toggleSection(section.id)}>
                        <CollapsibleTrigger asChild>
                          <button
                            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-colors ${
                              activeItem?.type === 'section' && activeItem.sectionId === section.id
                                ? 'bg-blue-100 border border-blue-300'
                                : 'hover:bg-gray-100'
                            }`}
                            onClick={(e) => {
                              if (!hasSubsections) {
                                e.preventDefault();
                                handleSelectSection(section.id);
                              }
                            }}
                          >
                            {hasSubsections ? (
                              isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                              )
                            ) : (
                              <div className="w-4 flex-shrink-0" />
                            )}
                            {isFullyCompleted ? (
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-900 truncate">
                                  {section.sectionNumber} {section.title}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-0.5">
                                <span className="text-xs text-gray-500">
                                  {getSectionCompletionCount(section)}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-medium text-blue-600">
                                    {sectionMarks}/{section.maxMarks}
                                  </span>
                                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                    {section.maxMarks} Marks
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </button>
                        </CollapsibleTrigger>

                        {/* Subsections */}
                        {hasSubsections && (
                          <CollapsibleContent>
                            <div className="ml-6 pl-2 border-l-2 border-gray-200 space-y-0.5 mt-0.5 mb-1">
                              {section.subsections!.map((sub) => {
                                const isActive =
                                  activeItem?.type === 'subsection' &&
                                  activeItem.sectionId === section.id &&
                                  activeItem.subSectionId === sub.id;

                                return (
                                  <button
                                    key={sub.id}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors ${
                                      isActive
                                        ? 'bg-blue-100 border border-blue-300'
                                        : 'hover:bg-gray-100'
                                    }`}
                                    onClick={() => handleSelectSubSection(section.id, sub.id)}
                                  >
                                    {getStatusIcon(sub.isCompleted)}
                                    <div className="flex-1 min-w-0">
                                      <span className="text-sm text-gray-800 block truncate">
                                        {sub.subSectionNumber} {sub.title}
                                      </span>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-xs font-medium text-blue-600">
                                          {sub.instituteMarks ?? 0}/{sub.maxMarks}
                                        </span>
                                        <Badge variant="outline" className="text-xs px-1.5 py-0">
                                          {sub.maxMarks} Marks
                                        </Badge>
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </CollapsibleContent>
                        )}
                      </Collapsible>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Content Editor */}
          <div className="flex-1 overflow-y-auto">
            {!activeItem ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Select a Section
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    Choose a section or subsection from the left panel to start editing its content.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Active Section Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {getActiveTitle()}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Provide detailed information for this section
                      </p>
                    </div>
                    <Badge className="bg-blue-600 text-white text-sm px-3 py-1">
                      {getActiveMaxMarks()} Marks
                    </Badge>
                  </div>
                </div>

                {/* Tabs: Content + Attachments */}
                <Tabs defaultValue="content" className="w-full">
                  <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="attachments">
                      Attachments {attachments.length > 0 && `(${attachments.length})`}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4 mt-4">
                    <div>
                      <Label className="text-base font-medium">Section Content</Label>
                      <p className="text-sm text-gray-600 mb-3">
                        Use the rich text editor to format your content. Tables and images are supported.
                      </p>
                      {/* key forces re-mount when switching sections so editor gets fresh content */}
                      <RichTextEditor
                        key={activeItemKey(activeItem)}
                        content={editorContent}
                        onChange={setEditorContent}
                        placeholder="Enter section content..."
                      />
                    </div>

                    {/* Marks Section */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-amber-900 mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Section Marks
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Total Marks (Read-only) */}
                        <div>
                          <Label className="text-sm text-gray-600 mb-1 block">Total Marks</Label>
                          <div className="h-10 flex items-center px-3 bg-gray-100 border border-gray-200 rounded-md text-sm font-semibold text-gray-700">
                            {getActiveMaxMarks()}
                          </div>
                        </div>
                        {/* Institute Marks (Editable) */}
                        <div>
                          <Label className="text-sm text-gray-600 mb-1 block">Institute Marks</Label>
                          <Input
                            type="number"
                            min={0}
                            max={getActiveMaxMarks()}
                            step="any"
                            value={instituteMarks}
                            onChange={(e) => handleInstituteMarksChange(e.target.value)}
                            className="h-10 font-semibold text-blue-700 border-blue-300 focus:border-blue-500"
                            placeholder="Enter marks"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Max: {getActiveMaxMarks()} marks
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="attachments" className="space-y-4 mt-4">
                    <div>
                      <Label className="text-base font-medium">Attachments</Label>
                      <p className="text-sm text-gray-600 mb-3">
                        Add supporting documents, images, or other files for this section.
                      </p>

                      {/* Add Attachment */}
                      <div className="flex gap-2 mb-4">
                        <Input
                          placeholder="Enter file name or URL"
                          value={newAttachment}
                          onChange={(e) => setNewAttachment(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddAttachment()}
                        />
                        <Button onClick={handleAddAttachment} disabled={!newAttachment.trim()}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      </div>

                      {/* Attachments List */}
                      <div className="space-y-2">
                        {attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                          >
                            <div className="flex items-center gap-2">
                              <Upload className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">{attachment}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAttachment(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        {attachments.length === 0 && (
                          <p className="text-gray-500 text-center py-8">
                            No attachments added yet
                          </p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Save Button */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setActiveItem(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Section
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SARCriteriaForm;