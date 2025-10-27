# Document Management System - Deployment Guide

## Sri Lanka Government - Ministry of Public Services, Provincial Councils and Local Government
### Home Affairs Section – IT Branch (2025)

---

## 📋 System Overview

This is a complete, production-ready Document Management System built for internal government use with:
- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Lovable Cloud (Supabase)
- **Database**: PostgreSQL with Row Level Security
- **Storage**: Secure file storage with encryption

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ installed
- npm or bun package manager
- Modern web browser

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd document-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Setup**
   
   The `.env` file is already configured with Lovable Cloud credentials. No changes needed.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. **Access the application**
   
   Open your browser and navigate to: `http://localhost:8080`

---

## 👥 Default User Setup

### Creating Admin User

1. Sign up through the auth page (`/auth`)
2. A database administrator needs to grant admin role:
   ```sql
   -- Connect to your Supabase project
   -- Update the user_roles table
   UPDATE user_roles 
   SET role = 'admin' 
   WHERE user_id = '<user-id-from-signup>';
   ```

### User Roles

- **Admin**: Full system access
  - Manage all documents
  - View all user activity
  - Access user management
  - View system reports
  
- **Officer**: Standard user access
  - Upload/download own documents
  - Create folders
  - Search documents
  - View own activity logs

---

## 🗄️ Database Schema

### Tables Created

1. **profiles** - User profile information
2. **user_roles** - User role assignments (admin/officer)
3. **departments** - Government departments
4. **documents** - Document metadata
5. **folders** - Folder structure
6. **activity_logs** - System activity tracking

### Pre-populated Departments

- Home Affairs (HA)
- IT Branch (IT)
- Human Resources (HR)
- Finance (FIN)
- Legal (LEG)
- Administration (ADM)

---

## 🔐 Security Features

- **Row Level Security (RLS)**: Enforced on all tables
- **Authentication**: Supabase Auth with email/password
- **Encrypted Storage**: Documents stored securely
- **Activity Logging**: All document operations tracked
- **Role-based Access**: Granular permission control

---

## 📦 Production Deployment

### Deploy to Lovable

1. Click the **Publish** button in the Lovable editor
2. Your app will be deployed to `yourapp.lovable.app`
3. Custom domain can be configured in Project Settings

### Environment Variables

All environment variables are managed automatically by Lovable Cloud:
- `VITE_SUPABASE_URL` - Backend API URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Public API key
- `VITE_SUPABASE_PROJECT_ID` - Project identifier

---

## 🎨 Customization

### Branding

Update these files to customize branding:
- `src/components/layout/OfficialHeader.tsx` - Header content
- `src/components/layout/OfficialFooter.tsx` - Footer text
- `src/assets/sri-lanka-logo.png` - Government logo

### Design Theme

The official government colors are defined in:
- `src/index.css` - Design system (Navy #001F3F, Gold #FFD700)

---

## 📊 Features

### Document Management
- Upload documents (PDF, DOC, XLS, Images)
- Metadata: Title, Department, Reference Number, Date Received, Remarks
- Download and delete documents
- Folder organization

### Search & Filter
- Full-text search by title
- Filter by department, date, reference number
- Real-time results

### Activity Tracking
- Every upload, download, and delete logged
- User attribution for all actions
- Export activity reports to CSV

### Admin Features
- User management dashboard
- System-wide document access
- Activity reports and analytics
- User role management

---

## 🔧 Maintenance

### Database Backups

Lovable Cloud automatically backs up your database. To manually export:

<lov-actions>
  <lov-open-backend>Access Backend Dashboard</lov-open-backend>
</lov-actions>

### Monitoring

- Check console logs for errors
- Monitor storage usage in backend dashboard
- Review activity logs regularly

### Updates

To update the system:
1. Make changes in Lovable editor
2. Test in preview
3. Click Publish to deploy

---

## 📞 Support

For technical support or questions:
- **IT Branch**: Ministry of Public Services
- **Email**: it.branch@homeaffairs.gov.lk (example)
- **Documentation**: https://docs.lovable.dev

---

## 📄 License

**Government of Sri Lanka**  
Ministry of Public Services, Provincial Councils and Local Government  
Home Affairs Section – IT Branch (2025)  
For internal government use only.

---

**Version**: 1.0.0  
**Last Updated**: 2025  
**Developed by**: IT Branch – Home Affairs Section
