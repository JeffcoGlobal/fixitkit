# TaskFlow - Full-Stack Task Management Application

A modern, production-ready task management application built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### 🔐 Authentication
- Secure email/password authentication
- User registration and login
- Protected routes and user sessions
- Profile management

### ✅ Task Management
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Set task priorities (Low, Medium, High)
- Add due dates and descriptions
- Real-time updates across sessions

### 🎨 Modern UI/UX
- Clean, responsive design
- Smooth animations and transitions
- Mobile-first approach
- Intuitive user interface
- Loading states and error handling

### 🔍 Advanced Features
- Search and filter tasks
- Sort by date, priority, or status
- Real-time notifications
- Optimistic UI updates
- Keyboard shortcuts

### 🚀 Production Ready
- TypeScript for type safety
- Comprehensive error handling
- Performance optimizations
- Security best practices
- Database migrations

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React Hooks
- **UI Components**: Headless UI, Lucide Icons
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Copy your project URL and anon key
   - Create a `.env` file based on `.env.example`
   - Run the database migration in your Supabase SQL editor

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Database Setup

The application includes a comprehensive database migration that sets up:

- **Profiles table**: User profile information
- **Tasks table**: Task data with relationships
- **Row Level Security**: Secure data access
- **Real-time subscriptions**: Live updates
- **Indexes**: Optimized query performance

Run the migration file `supabase/migrations/create_initial_schema.sql` in your Supabase SQL editor.

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   ├── tasks/          # Task-related components
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
└── types/              # TypeScript type definitions
```

## Key Features Explained

### Authentication System
- Secure user registration and login
- Automatic profile creation
- Session management
- Protected routes

### Task Management
- Full CRUD operations
- Real-time updates using Supabase subscriptions
- Optimistic UI updates for better UX
- Advanced filtering and sorting

### Real-time Features
- Live task updates across multiple sessions
- Instant notifications for task changes
- Collaborative task management

### Performance Optimizations
- Lazy loading of components
- Optimized database queries
- Efficient state management
- Minimal re-renders

## Deployment

### Frontend Deployment
The application can be deployed to any static hosting service:

```bash
npm run build
```

### Database
Supabase handles the database hosting and provides:
- Automatic backups
- SSL connections
- Global CDN
- Real-time capabilities

## Security Features

- Row Level Security (RLS) policies
- Authenticated-only access
- SQL injection prevention
- XSS protection
- CSRF protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ using modern web technologies