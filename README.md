# Altheia Healthcare Management System

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
</div>

## 🏥 About Altheia

Altheia is a comprehensive healthcare management system designed to streamline clinic operations and improve patient care. Built with modern web technologies, it provides an intuitive interface for healthcare professionals to manage patients, appointments, staff, and clinic operations efficiently.

### ✨ Key Features

- **👥 Staff Management**: Complete personnel management for physicians, receptionists, lab technicians, and patients
- **📅 Appointment Scheduling**: Advanced appointment booking and management system
- **🏥 Patient Records**: Comprehensive patient information and medical history tracking
- **📊 Analytics Dashboard**: Real-time insights and reporting for clinic performance
- **🔐 Role-Based Access Control**: Secure access management with different permission levels
- **🌙 Dark Mode Support**: Full dark/light theme support for better user experience
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🔄 Real-time Updates**: Live data synchronization across all users

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with HeroUI integration
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend Integration
- **API Client**: Custom fetch wrapper with authentication
- **Authentication**: JWT-based authentication system
- **Data Fetching**: Server-side rendering with client-side hydration

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/kahyberth/altheia-frontend.git
   cd altheia-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=your_backend_api_url
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
altheia-frontend/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard pages
│   │   ├── analytics/     # Analytics and reports
│   │   ├── appointments/  # Appointment management
│   │   ├── patients/      # Patient management
│   │   ├── profile/       # User profile
│   │   └── staff-management/ # Staff management
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── not-found.tsx      # 404 page
│   └── page.tsx           # Landing page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── auth-modal.tsx    # Authentication modal
│   ├── dashboard-sidebar.tsx # Navigation sidebar
│   └── ...               # Other components
├── context/              # React Context providers
│   ├── AuthContext.tsx   # Authentication context
│   └── ThemeContext.tsx  # Theme management
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── services/             # API service functions
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 👤 User Roles & Permissions

### 🏥 Clinic Owner
- Full system access
- Staff management (hire/fire)
- Clinic configuration
- Analytics and reporting
- Financial management

### 👨‍⚕️ Physician
- Patient management
- Appointment scheduling
- Medical records access
- Prescription management
- Lab order creation

### 📞 Receptionist
- Appointment booking
- Patient registration
- Basic patient information
- Schedule management

### 🔬 Lab Technician
- Lab order management
- Test result entry
- Equipment tracking
- Quality control

### 🏥 Patient
- Personal profile management
- Appointment booking
- Medical history viewing
- Prescription tracking

## 🎨 Features Overview

### Dashboard
- **Overview Cards**: Quick stats and metrics
- **Recent Activity**: Latest system activities
- **Quick Actions**: Fast access to common tasks
- **Analytics Charts**: Visual data representation

### Staff Management
- **Personnel Directory**: Complete staff listing
- **Role Assignment**: Flexible role management
- **Performance Tracking**: Staff activity monitoring
- **Scheduling**: Work schedule management

### Patient Management
- **Patient Registry**: Comprehensive patient database
- **Medical History**: Complete health records
- **Insurance Management**: EPS and insurance tracking
- **Communication**: Patient messaging system

### Appointment System
- **Calendar View**: Visual appointment scheduling
- **Conflict Detection**: Automatic scheduling conflicts
- **Reminders**: Automated appointment reminders
- **Rescheduling**: Easy appointment modifications

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

