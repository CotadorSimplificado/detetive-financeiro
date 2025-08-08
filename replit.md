# Detetive Financeiro - Personal Finance Management App

## Overview

Detetive Financeiro is a comprehensive personal finance management application built with React, TypeScript, and Express. The app provides users with tools to track accounts, transactions, credit cards, and credit card bills. It features a modern dashboard with charts and visualizations, transaction management with support for income, expenses, transfers, and credit card transactions, and account management with different account types (checking, savings, investment, cash).

The application uses a mock data system for development and demonstration purposes, with a well-structured data layer that can easily be replaced with real backend integration. The UI is built with shadcn/ui components and Tailwind CSS, providing a polished dark-themed financial interface.

## User Preferences

Preferred communication style: Simple, everyday language.

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