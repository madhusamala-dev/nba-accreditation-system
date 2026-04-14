import InstituteLayout from '@/components/InstituteLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getTemplates, downloadTemplate, getFileIcon, formatFileSize, TemplateFile } from '@/lib/templates';
import { useState } from 'react';

export default function SARTemplates() {
  const [templates] = useState<TemplateFile[]>(getTemplates());

  return (
    <InstituteLayout title="SAR Templates">
      <div className="space-y-6">
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Available Templates</h3>
            <p className="text-sm text-gray-500 mt-1">
              Download the template files provided by the administrator to help you prepare your SAR application.
            </p>
          </div>

          {templates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg
                className="mx-auto h-16 w-16 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <p className="text-base font-medium">No templates available</p>
              <p className="text-sm mt-1">Templates will appear here once the administrator uploads them.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl flex-shrink-0">{getFileIcon(template.fileName)}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{template.label}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {template.fileName.split('.').pop()?.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-gray-500">{formatFileSize(template.fileSize)}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          Uploaded {new Date(template.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0 ml-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => downloadTemplate(template)}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </InstituteLayout>
  );
}