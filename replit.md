# Detetive Financeiro - Personal Finance Management App

## Overview

Detetive Financeiro is a comprehensive personal finance management application built with React, TypeScript, and Express. The app provides users with tools to track accounts, transactions, credit cards, and credit card bills. It features a modern dashboard with charts and visualizations, transaction management with support for income, expenses, transfers, and credit card transactions, and account management with different account types (checking, savings, investment, cash).

The application is currently using a mock data system for development but has PostgreSQL database configured and ready for migration. The UI is built with shadcn/ui components and Tailwind CSS, providing a polished dark-themed financial interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Updates (January 2025)

### Fixed Competence Filter State Management
- **Issue**: useCompetenceFilter hook was returning empty object causing "Cannot read properties of undefined (reading 'month')" errors
- **Solution**: Implemented complete state management in useCompetenceFilter hook with month, year, and date properties
- **Impact**: Fixed monthly planning features across Dashboard, Transactions, and Budgets pages

### Database Configuration
- **Added**: PostgreSQL database connection configured with environment variables
- **Status**: Database ready for migration from mock data system

## Pending Implementation

### Authentication System with Replit Auth
- **Goal**: Implement production-ready authentication using Replit's built-in OpenID Connect provider
- **Requirements**:
  1. Replace mock authentication with Replit Auth
  2. Migrate from in-memory storage to PostgreSQL database
  3. Create proper user sessions and authentication middleware
  4. Update all protected routes to use real authentication
- **Benefits**:
  - Secure user authentication without managing passwords
  - Seamless integration with Replit platform
  - Production-ready authentication flow
  - Support for user profiles and personalized data

### Implementation Steps for Replit Auth

1. **Database Schema Updates** (shared/schema.ts):
   - Create users table with Replit user ID as primary key
   - Add sessions table for authentication sessions
   - Update all existing tables to include user_id foreign key
   - Add proper relations between tables

2. **Backend Authentication** (server/replitAuth.ts):
   - Configure OpenID Connect with Replit provider
   - Set up Passport.js with Replit strategy
   - Implement session management with PostgreSQL store
   - Add authentication middleware for protected routes

3. **Storage Migration** (server/storage.ts):
   - Replace MemStorage with DatabaseStorage
   - Implement all IStorage interface methods with Drizzle ORM
   - Add user-scoped data queries
   - Ensure data isolation between users

4. **Frontend Updates**:
   - Update useAuth hook to fetch real user data
   - Replace mock login/logout with Replit Auth endpoints
   - Update ProtectedRoute component for real authentication
   - Handle unauthorized errors with proper redirects

5. **Data Migration**:
   - Run database migrations with `npm run db:push`
   - Update all API endpoints to filter by authenticated user
   - Ensure all CRUD operations are user-scoped

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