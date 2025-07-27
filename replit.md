# CV Gratis Builder - Replit Development Guide

## Overview

CV Gratis Builder is a full-stack web application for creating professional resumes online. The application provides both free and premium templates, with features including PDF export, email sending, print functionality, and AI-powered content generation. Built with React, Express, PostgreSQL, and modern web technologies.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

### Migration from Lovable to Replit (January 27, 2025)
- **Routing System**: Successfully migrated from React Router DOM to Wouter for Replit compatibility
- **Navigation**: Fixed all navigation function calls across components and hooks
- **Dependencies**: Installed missing packages (react-router-dom, sonner, html2canvas, jspdf, @stripe/stripe-js)
- **Toast System**: Converted toast system to use sonner instead of custom useToast hook

### AI Service Enhancement (January 27, 2025)
- **Context-Aware Generation**: Implemented sector-specific AI text generation (healthcare, technology, management)
- **Authentic Descriptions**: Removed fabricated percentages and generic corporate language
- **Healthcare Focus**: Added specialized functions for nursing and healthcare professional descriptions
- **Keyword Integration**: Improved natural integration of user-provided keywords into experience descriptions
- **Prompt Optimization**: Enhanced OpenAI prompts to generate more authentic and contextual content

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: Multiple React Context providers for different data domains
- **Routing**: Wouter for lightweight client-side routing
- **Code Splitting**: React.lazy() for page-level code splitting with Suspense boundaries

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based (connect-pg-simple for session storage)
- **API Design**: RESTful API with Express routes under `/api` prefix
- **File Processing**: Server-side PDF generation and email handling

### Database Design
- **ORM**: Drizzle with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for type sharing between frontend and backend
- **Migrations**: Automated with drizzle-kit
- **Connection**: Neon serverless PostgreSQL via `@neondatabase/serverless`

## Key Components

### Context Management System
- **CombinedProvider**: Wraps all context providers for the resume builder
- **PersonalInfoContext**: Manages user personal information
- **EducationContext**: Handles education entries with CRUD operations
- **ExperienceContext**: Manages work experience data
- **SkillsContext**: Handles skills, languages, and professional objectives
- **ExtrasContext**: Manages courses, projects, and achievements
- **TemplateContext**: Controls template selection and premium status

### Resume Builder Components
- **CurriculumBuilder**: Main builder interface with step-by-step workflow
- **TemplateRenderer**: Renders selected templates with live preview
- **TemplateSelector**: Template gallery with free/premium categorization
- **PremiumEditor**: Advanced editing features for premium templates

### Service Layer
- **EmailService**: Email sending via Resend API with MCP integration
- **PDFExportService**: High-quality PDF generation using jsPDF and html2canvas
- **PrintService**: Browser printing with custom styling
- **AIService**: OpenAI integration for content generation
- **StripeService**: Payment processing for premium features
- **UserDataService**: User data collection and analytics

### Template System
- **Template Types**: Free and premium templates with different styles
- **Template Config**: Flexible configuration for layout, typography, and colors
- **Responsive Design**: Mobile-optimized templates with print-friendly layouts

## Data Flow

### Resume Creation Flow
1. User selects template or starts building
2. Step-by-step data collection through context providers
3. Real-time preview updates as data changes
4. Template selection with free/premium options
5. Export options (PDF, print, email) with user data collection

### Payment Flow (Premium)
1. User selects premium template
2. Stripe payment processing
3. Premium status unlock
4. Access to advanced features and templates

### Data Persistence
- **Client-side**: localStorage for draft data and user preferences
- **Server-side**: PostgreSQL for user accounts and premium status
- **Session Management**: Express sessions with PostgreSQL storage

## External Dependencies

### Payment Processing
- **Stripe**: Credit card processing for premium templates
- **Configuration**: Environment variables for API keys
- **Webhooks**: Server-side webhook handling for payment confirmation

### Email Services
- **Resend**: Primary email service via MCP integration
- **Configuration**: API keys and domain configuration
- **Templates**: HTML email templates for curriculum sending

### AI Services
- **OpenAI**: GPT models for content generation and improvement
- **Use Cases**: Professional objective writing, experience descriptions
- **Rate Limiting**: Built-in request management

### Database Service
- **Neon**: Serverless PostgreSQL hosting
- **Connection**: Environment-based configuration
- **Migrations**: Automated schema management

### Development Tools
- **Replit Integration**: Special handling for Replit environment
- **Hot Reload**: Vite development server with HMR
- **Error Handling**: Runtime error overlays for development

## Deployment Strategy

### Build Process
1. Frontend build with Vite (outputs to `dist/public`)
2. Backend build with esbuild (outputs to `dist`)
3. Static file serving in production
4. Environment variable configuration

### Environment Configuration
- **Database**: `DATABASE_URL` for PostgreSQL connection
- **Stripe**: `VITE_STRIPE_PUBLISHABLE_KEY` for payments
- **Email**: Resend API configuration
- **OpenAI**: API key for AI features

### Production Setup
- **Server**: Express.js serving static files and API routes
- **Database**: PostgreSQL with connection pooling
- **File Storage**: Local file system for temporary files
- **Monitoring**: Error tracking and performance monitoring

### Development Workflow
- **Local Development**: `npm run dev` for hot reload
- **Database Operations**: `npm run db:push` for schema changes
- **Type Checking**: `npm run check` for TypeScript validation
- **Build Process**: `npm run build` for production build

The application follows a modular architecture with clear separation of concerns, making it easy to maintain and extend. The context-based state management provides excellent data flow control, while the service layer abstracts external integrations for better testability and maintenance.