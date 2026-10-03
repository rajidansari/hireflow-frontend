# HireFlow — Client

Frontend client for **HireFlow**, a full-stack job board platform built with React and Vite.

HireFlow provides separate experiences for candidates and employers, including job discovery, applications, profiles, job management, applicant management, and notifications.

## Tech Stack

- React
- Vite
- React Router
- Zustand
- Axios
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui
- Lucide React
- Sonner
- JWT

## Features

### Candidate

- Browse available jobs
- View job details
- Apply for jobs
- Track submitted applications
- Withdraw applications
- Track application status
- Manage candidate profile
- Upload/update CV
- View notifications
- Mark notifications as read
- Delete notifications

### Employer

- Manage employer profile
- Create job listings
- Edit job listings
- View and manage posted jobs
- View applicants for individual jobs
- Filter applicants by application status
- Update application status
- Receive application-related notifications

### Authentication

- User registration
- Email OTP verification
- Login
- JWT-based authentication
- Automatic access-token refresh
- Role-based navigation
- Candidate and employer access flows
- Protected routes

## Project Structure

```text
src/
├── api/            # API request functions
├── components/     # Reusable UI components
├── pages/          # Application pages
├── hooks/          # Custom React hooks
├── store/          # Zustand stores
├── lib/            # Utilities and configuration
├── schemas/        # Zod validation schemas
├── App.jsx
└── main.jsx
```
