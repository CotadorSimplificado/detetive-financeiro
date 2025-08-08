# Detetive Financeiro - Personal Finance Management App

## Overview

Detetive Financeiro is a comprehensive personal finance management application built with React, TypeScript, and Express. The app provides users with tools to track accounts, transactions, credit cards, and credit card bills. It features a modern dashboard with charts and visualizations, transaction management with support for income, expenses, transfers, and credit card transactions, and account management with different account types (checking, savings, investment, cash).

The application is currently using a mock data system for development but has PostgreSQL database configured and ready for migration. The UI is built with shadcn/ui components and Tailwind CSS, providing a polished dark-themed financial interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Updates (January 2025)

### Phase 1 Backend Implementation - COMPLETED (January 10, 2025)
- **Database Schema**: Complete PostgreSQL schema created with all entities (users, accounts, transactions, categories, credit cards, monthly plans)
- **Database Migration**: Successfully applied schema to database using `npm run db:push`
- **Seed Data**: Created and executed seed script with 19 default categories (6 income, 13 expense types)
- **Storage Layer**: Implemented complete DatabaseStorage class with full CRUD operations for all entities
- **API Routes**: Created REST API endpoints for categories, accounts, transactions, and credit cards with validation
- **Status**: ✅ Backend infrastructure ready for frontend integration

### Phase 2 Frontend Migration - COMPLETED (January 10, 2025)
- **Complete Real API Hooks**: Created useRealAccounts, useRealTransactions, useRealCreditCards with React Query
- **Feature Flags System**: Implemented gradual migration with debug panel for testing
- **Backward Compatibility**: All hooks maintain same interface as mock system
- **Migration Strategy**: Parallel mock/real systems with toggle capability for safe transition
- **Status**: All main entities (categories, accounts, transactions, credit cards) now use PostgreSQL

### Fixed Competence Filter State Management
- **Issue**: useCompetenceFilter hook was returning empty object causing "Cannot read properties of undefined (reading 'month')" errors
- **Solution**: Implemented complete state management in useCompetenceFilter hook with month, year, and date properties
- **Impact**: Fixed monthly planning features across Dashboard, Transactions, and Budgets pages

### Database Configuration
- **Added**: PostgreSQL database connection configured with environment variables
- **Status**: Database ready for migration from mock data system

## Backend Migration Progress

### ✅ Phase 1 Complete (January 10, 2025)
- Database schema with all tables and relations
- Storage layer with complete CRUD operations
- API routes with validation and error handling
- Seed data with default categories
- Health check endpoint for monitoring

### ✅ Phase 2 Complete - Frontend Integration (January 10, 2025)
Successfully migrated all main entities to real database:
1. **Categories** - Real API with 19 seeded categories ✅
2. **Accounts** - Complete CRUD operations with real database ✅
3. **Transactions** - Full transaction management with filters ✅
4. **Credit Cards** - Credit card system with real backend ✅
5. **Feature Flags** - Gradual migration system implemented ✅

### ✅ Phase 3 Complete - API Routes Implementation (January 10, 2025)
Comprehensive REST API implementation with full CRUD operations:
1. **Account Routes** - Complete CRUD with authentication middleware ✅
2. **Transaction Routes** - Full lifecycle with advanced filtering ✅  
3. **Category Routes** - Read operations with custom category support ✅
4. **Credit Card Routes** - Complete management system ✅
5. **Monthly Plans Routes** - Budget planning endpoints ✅
6. **Summary Routes** - Financial calculations and reports ✅
7. **Health Check** - Database connectivity monitoring ✅
8. **Authentication Middleware** - Mock auth ready for Replit Auth migration ✅

### ✅ Phase 4 Complete - Replit Authentication Implementation (January 10, 2025)
Complete migration from mock to real Replit Authentication system:
1. **Replit Auth Setup** - OpenID Connect integration with Passport.js ✅
2. **Session Management** - PostgreSQL session store for security ✅
3. **Authentication Middleware** - Real auth replacing mock system ✅
4. **Frontend Integration** - Landing/Home pages with auth flow ✅
5. **Feature Flags** - Gradual auth migration system ✅
6. **User Management** - Database user storage with upsert logic ✅
7. **Protected Routes** - All API endpoints secured with real auth ✅
8. **Auth Flow** - Login (/api/login) and logout (/api/logout) routes ✅

### ✅ Authentication System with Replit Auth - COMPLETED
Production-ready authentication using Replit's built-in OpenID Connect provider:
- ✅ Secure user authentication without managing passwords
- ✅ Seamless integration with Replit platform  
- ✅ Production-ready authentication flow
- ✅ Support for user profiles and personalized data

### ✅ Implementation Completed

1. **Database Schema Updates** (shared/schema.ts): ✅
   - ✅ Users table with Replit user ID as primary key
   - ✅ Sessions table for authentication sessions
   - ✅ All existing tables include user_id foreign key
   - ✅ Proper relations between tables

2. **Backend Authentication** (server/replitAuth.ts): ✅
   - ✅ OpenID Connect with Replit provider configured
   - ✅ Passport.js with Replit strategy implemented
   - ✅ Session management with PostgreSQL store
   - ✅ Authentication middleware for protected routes

3. **Storage Migration** (server/storage.ts): ✅
   - ✅ DatabaseStorage with full IStorage interface
   - ✅ User-scoped data queries implemented
   - ✅ Data isolation between users ensured

4. **Frontend Updates**: ✅
   - ✅ useAuth hook with real user data fetching
   - ✅ Landing/Home pages with auth flow
   - ✅ Feature flag system for gradual migration
   - ✅ Unauthorized error handling implemented

5. **Data Migration**: ✅
   - ✅ Database migrations applied
   - ✅ All API endpoints filter by authenticated user
   - ✅ All CRUD operations are user-scoped

### Database Tables to Migrate

- **users**: Replit user profiles and preferences
- **sessions**: Authentication session storage
- **accounts**: User bank accounts and balances
- **transactions**: Financial transactions with categories
- **categories**: Transaction categories
- **credit_cards**: Credit card information
- **credit_card_bills**: Monthly credit card bills
- **budgets**: Monthly budget planning by category
- **family_groups**: Shared family financial management
- **notifications**: User notification preferences

## System Architecture

### Frontend Architecture
The frontend is built as a Single Page Application (SPA) using React 18 with TypeScript. The application follows a component-based architecture with:

- **Routing**: React Router for client-side routing with protected routes
- **State Management**: React Context API combined with custom hooks for data management
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Forms**: React Hook Form with Zod validation schemas
- **Charts**: Recharts library for data visualization

The application structure separates concerns into:
- Pages for route-level components
- Components organized by feature (accounts, transactions, cards, etc.)
- Shared UI components in the ui directory
- Custom hooks for data fetching and business logic
- Utility functions for formatting and validation

### Backend Architecture
The backend uses Express.js with TypeScript in a minimal setup that serves the React application and provides API endpoints. Currently configured with:

- **Server Framework**: Express.js with middleware for JSON parsing and logging
- **Development Setup**: Vite integration for hot module replacement
- **Storage Interface**: Abstract storage interface with in-memory implementation
- **Route Structure**: Centralized route registration system

### Data Management
The application currently uses a sophisticated mock data system that simulates real backend behavior:

- **Mock Store**: Centralized state management using React Context
- **Type-Safe Operations**: Full TypeScript support with proper interfaces
- **CRUD Operations**: Complete create, read, update, delete functionality
- **Data Relationships**: Proper handling of relationships between users, accounts, transactions, categories, and credit cards
- **Validation**: Zod schemas for all data operations

The mock system includes:
- User authentication simulation
- Account management with different types and balances
- Transaction tracking with categories and competence filtering
- Credit card management with bill generation
- Financial calculations and summaries

### Database Design
While currently using mock data, the application is designed with Drizzle ORM for PostgreSQL:

- **Schema Definition**: Shared schema file defining database structure
- **Migration Support**: Drizzle Kit for database migrations
- **Connection**: Configured for PostgreSQL with environment-based connection strings

### Authentication and Authorization
The application includes a complete authentication system:

- **Protected Routes**: Route-level protection requiring authentication
- **User Context**: Global user state management
- **Mock Authentication**: Simulated sign-in/sign-up with persistence

### Form Handling and Validation
Robust form management throughout the application:

- **React Hook Form**: For form state management and performance
- **Zod Validation**: Type-safe schema validation for all forms
- **Custom Hooks**: Specialized hooks for currency input, date handling, and form submission
- **Error Handling**: Comprehensive error states and user feedback

### UI/UX Design System
Modern, accessible design system with:

- **Dark Theme**: Financial-focused dark theme with vibrant accents
- **Responsive Design**: Mobile-first responsive layouts
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Loading States**: Skeleton loaders and transition states
- **Toast Notifications**: User feedback for actions and errors

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with modern hooks and concurrent features
- **React Router**: Client-side routing with nested routes and protection
- **TypeScript**: Static typing for enhanced development experience
- **Vite**: Build tool and development server with HMR

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Radix UI**: Accessible component primitives for complex UI elements
- **Lucide React**: Icon library with consistent design
- **next-themes**: Theme management for dark/light mode switching

### Form and Validation
- **React Hook Form**: Performance-focused form library
- **Zod**: TypeScript schema validation
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Data Visualization
- **Recharts**: React charts library for financial data visualization
- **date-fns**: Date manipulation and formatting with Portuguese locale support

### Development and Build
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution for development server
- **PostCSS**: CSS processing with Tailwind

### Backend Dependencies
- **Express.js**: Web server framework
- **Drizzle ORM**: Type-safe database ORM for PostgreSQL
- **@neondatabase/serverless**: PostgreSQL driver for serverless environments

### Query and State Management
- **TanStack React Query**: Server state management and caching
- **React Context**: Built-in state management for global application state

The application is structured to easily transition from mock data to real backend services, with clear separation between data access patterns and UI components. All external dependencies are carefully chosen to support the financial application's requirements for security, performance, and user experience.