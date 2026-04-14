import { useState, useRef, useCallback } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  TemplateFile,
  getTemplates,
  addTemplate,
  deleteTemplate,
  validateFile,
  fileToBase64,
  getFileIcon,
  formatFileSize,
} from '@/lib/templates';
import { getCurrentUser } from '@/lib/auth';

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<TemplateFile[]>(getTemplates());
  const [label, setLabel] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      setSelectedFile(null);
      return;
    }
    setError('');
    setSelectedFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleUpload = async () => {
    if (!label.trim()) {
      setError('Please enter a label for the file');
      return;
    }
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      const base64Data = await fileToBase64(selectedFile);
      const currentUser = getCurrentUser();
      const template: TemplateFile = {
        id: crypto.randomUUID(),
        label: label.trim(),
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        data: base64Data,
        uploadedAt: new Date().toISOString(),
        uploadedBy: currentUser?.email || 'admin',
      };

      addTemplate(template);
      setTemplates(getTemplates());
      setLabel('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setSuccess('Template uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to upload file. The file may be too large for browser storage.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteTemplate(id);
    setTemplates(getTemplates());
  };

  return (
    <AdminLayout title="Templates">
      <div className="space-y-6">
        {/* Upload Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Template</h3>
          <p className="text-sm text-gray-500 mb-4">
            Upload template files that will be available for download by institutions. Accepted formats: DOC, DOCX, PDF,
            CSV, XLS, XLSX, JPEG, PNG. Max size: 50MB.
          </p>

          <div className="space-y-4">
            {/* Label Input */}
            <div>
              <Label htmlFor="template-label" className="text-sm font-medium text-gray-700">
                File Label <span className="text-red-500">*</span>
              </Label>
              <Input
                id="template-label"
                placeholder="e.g., SAR Criteria 1 Template, Faculty Data Format..."
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Drag & Drop Zone */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                File <span className="text-red-500">*</span>
              </Label>
              <div
                className={`mt-1 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50'
                    : selectedFile
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".doc,.docx,.pdf,.csv,.xls,.xlsx,.jpeg,.jpg,.png"
                  onChange={handleInputChange}
                />
                {selectedFile ? (
                  <div className="space-y-2">
                    <span className="text-3xl">{getFileIcon(selectedFile.name)}</span>
                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    <p className="text-xs text-green-600">Click or drag to replace</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg
                      className="mx-auto h-10 w-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">DOC, DOCX, PDF, CSV, XLS, XLSX, JPEG, PNG (max 50MB)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Error / Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Upload Button */}
            <Button onClick={handleUpload} disabled={isUploading || !label.trim() || !selectedFile} className="w-full">
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Uploading...
                </span>
              ) : (
                'Upload Template'
              )}
            </Button>
          </div>
        </Card>

        {/* Uploaded Templates List */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Uploaded Templates
            {templates.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {templates.length}
              </Badge>
            )}
          </h3>

          {templates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm">No templates uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl flex-shrink-0">{getFileIcon(template.fileName)}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{template.label}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {template.fileName} • {formatFileSize(template.fileSize)} • Uploaded{' '}
                        {new Date(template.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0 ml-3"
                    onClick={() => handleDelete(template.id)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}