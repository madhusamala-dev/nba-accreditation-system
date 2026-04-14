export interface TemplateFile {
  id: string;
  label: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  data: string; // base64 encoded
  uploadedAt: string;
  uploadedBy: string;
}

const TEMPLATES_KEY = 'compliedu_templates';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
];

const ALLOWED_EXTENSIONS = ['.doc', '.docx', '.pdf', '.csv', '.xls', '.xlsx', '.jpeg', '.jpg', '.png'];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function getTemplates(): TemplateFile[] {
  try {
    const stored = localStorage.getItem(TEMPLATES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveTemplates(templates: TemplateFile[]): void {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

export function addTemplate(template: TemplateFile): void {
  const templates = getTemplates();
  templates.push(template);
  saveTemplates(templates);
}

export function deleteTemplate(id: string): void {
  const templates = getTemplates().filter((t) => t.id !== id);
  saveTemplates(templates);
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }
  if (!ALLOWED_TYPES.includes(file.type) && file.type !== '') {
    // Some browsers may not set type for .doc files, so also check extension
    const extCheck = ALLOWED_EXTENSIONS.includes(ext);
    if (!extCheck) {
      return {
        valid: false,
        error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
      };
    }
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 50MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
    };
  }
  return { valid: true };
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function downloadTemplate(template: TemplateFile): void {
  const link = document.createElement('a');
  link.href = template.data;
  link.download = template.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getFileIcon(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'pdf':
      return '📄';
    case 'doc':
    case 'docx':
      return '📝';
    case 'csv':
      return '📊';
    case 'xls':
    case 'xlsx':
      return '📈';
    case 'jpeg':
    case 'jpg':
    case 'png':
      return '🖼️';
    default:
      return '📎';
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}