# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server (runs on localhost:8080)
- `npm run build` - Build for production
- `npm run build:dev` - Build for development mode
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build

### Installation
- `npm i` - Install dependencies

## Project Architecture

### Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: React Context + useReducer pattern
- **PDF Generation**: jsPDF, html2canvas, html2pdf.js
- **Email Services**: Multiple providers (EmailJS, Resend, Supabase)
- **AI Integration**: GROK AI for content generation
- **Backend Integration**: Supabase for database and authentication

### Core Architecture Patterns

**Context-Based State Management**:
- Multiple specialized contexts located in `src/contexts/`
- `CurriculumContext` - Main resume data management with localStorage persistence
- `TemplateContext` - Template selection and configuration
- `CombinedProvider` - Wraps multiple contexts for the resume builder
- Each context uses useReducer pattern for complex state updates

**Step-Based Resume Builder**:
- Multi-step form with progress tracking via `CurriculumBuilder.tsx`
- Each step is a separate component in `src/components/resume-builder/steps/`
- Steps: personal-info → objective → experience → education → skills → languages → courses → projects-achievements

**Template System**:
- Template components in `src/components/templates/templates/`
- Templates: Classic, Creative, Executive, Formal, Minimal, Modern, Pastel, Professional, Tech
- Each template is a standalone React component receiving curriculum data as props

**Service Layer Architecture**:
- Email services: Multiple providers with fallback mechanisms
- AI services: GROK integration for experience descriptions and objectives
- PDF export: Multiple export strategies for different use cases

### Important File Locations

**Main Application**:
- `src/App.tsx` - Route configuration with code splitting
- `src/main.tsx` - Application entry point with Supabase initialization
- `src/pages/CreateResume.tsx` - Main resume creation page

**Data Types**:
- `src/types/curriculum.ts` - TypeScript interfaces for all resume data structures

**Key Components**:
- `src/components/resume-builder/CurriculumBuilder.tsx` - Main builder orchestrator
- `src/components/resume-builder/ProgressIndicator.tsx` - Step progress visualization
- `src/contexts/CurriculumContext.tsx` - Primary state management

**Services**:
- `src/services/` - Contains all external service integrations (email, AI, PDF, etc.)

### Development Notes

**State Persistence**:
- Resume data is automatically saved to localStorage on every change
- Data is restored when returning to the application
- Special handling for finalized resumes via 'cvgratis-curriculum-finalized' key

**API Integration**:
- Vite proxy configured for `/api` routes targeting localhost:3001
- Multiple email service providers with intelligent fallback
- GROK AI integration for content enhancement

**Code Splitting**:
- All pages are lazy-loaded for performance
- Global loading spinner provided for route transitions

**Template System**:
- Templates receive standardized `CurriculumData` interface
- Each template handles its own styling and layout
- PDF export works across all templates

### Environment Configuration

The project uses Vite with custom proxy configuration in `vite.config.ts`:
- Development server runs on port 8080
- API proxy routes to localhost:3001 for backend services
- Component tagger enabled in development mode

### Code Quality

ESLint configuration in `eslint.config.js`:
- TypeScript ESLint rules
- React hooks and refresh plugins
- Unused variables warnings disabled for development flexibility

## IMPORTANT: Project Guidelines and Workflow

### Project Status
**This project is COMPLETED and in maintenance mode.**
- The codebase is considered FROZEN
- Only perform adjustments and bug fixes explicitly requested
- Do NOT make improvements, refactoring, or optimizations unless specifically asked
- Do NOT add new features or functionality without explicit approval

### Approval Requirements
**When to request approval:**
- ONLY when making actual code changes to the project
- When modifying existing functionality
- When the request is ambiguous and could be interpreted in multiple ways

**When approval is NOT required:**
- Bug fixes and corrections that restore intended functionality
- Adjustments explicitly requested by the user
- Following direct instructions with clear requirements

### Execution Philosophy
**CRITICAL RULES:**
1. **Execute ONLY what is requested** - Do not add extra improvements or optimizations
2. **Keep the version frozen** - Make only the minimum necessary changes
3. **No proactive changes** - Never modify code that wasn't explicitly mentioned
4. **No refactoring** - Keep existing code structure even if it could be "improved"
5. **No code cleanup** - Don't fix formatting, comments, or unused imports unless requested
6. **Strict scope** - If asked to fix X, only fix X. Don't also fix Y, Z, and add feature W.

### Examples of What NOT to Do
❌ "I noticed this code could be improved, so I also..."
❌ "While fixing X, I took the opportunity to refactor Y..."
❌ "I added error handling for edge cases..."
❌ "I updated the types to be more strict..."
❌ "I cleaned up the imports and formatting..."

### Examples of What TO Do
✅ Read the exact request
✅ Make only the changes explicitly requested
✅ Test that the specific issue is fixed
✅ Commit only the modified files
✅ Move on

**Remember: This is a production application. Every change must be intentional, minimal, and explicitly requested.**