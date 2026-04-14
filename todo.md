# Templates Feature - Development Plan

## Files to Create/Modify
1. **src/lib/templates.ts** - Template storage utilities (localStorage-based CRUD for template files)
2. **src/pages/admin/AdminTemplates.tsx** - Admin page to upload templates with label, drag & drop, file type/size validation
3. **src/pages/institute/SARTemplates.tsx** - Institute page to view and download templates
4. **src/components/AdminLayout.tsx** - Add "Templates" menu item to admin sidebar
5. **src/App.tsx** - Add routes for both admin and institute template pages

## Features
- Admin: Upload files with a label, drag & drop or click to browse
- Accepted file types: .doc, .docx, .pdf, .csv, .xls, .xlsx, .jpeg, .jpg, .png
- Max file size: 50MB
- Files stored as base64 in localStorage
- Institute users can view and download all uploaded templates from SAR -> Templates