import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Login } from '../pages/Login/Login';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { SubmissionsRegistry as Submissions } from '../pages/Dashboard/SubmissionsRegistry';
import { SubmissionDetail } from '../pages/Submission/SubmissionDetail';
import { StudentProfile } from '../pages/Student/StudentProfile';
import { StudentPortal } from '../pages/StudentPortal/StudentPortal';
import { SplashScreen } from '../pages/Splash/SplashScreen';
import { useAuthStore } from '../store/auth';

const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    if (user?.role === 'STUDENT') return <Navigate to="/student-portal" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  
  // @ts-ignore
  return <Outlet /> as any;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SplashScreen />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard-home',
        element: <Navigate to="/dashboard" replace />,
      },
      // Faculty-Admin Routes
      {
        element: <ProtectedRoute allowedRoles={['FACULTY_ADMIN']} />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/submissions', element: <Submissions /> },
          { path: '/submission/:id', element: <SubmissionDetail /> },
          { path: '/student/:id', element: <StudentProfile /> },
          { path: '/students', element: <div className="p-8"><h1 className="text-2xl font-bold">Students Registry</h1><p className="text-text-muted mt-2 tracking-widest font-black uppercase text-[10px]">Authorized access node</p></div> },
          { path: '/settings', element: <div className="p-8"><h1 className="text-2xl font-bold">Settings</h1><p className="text-text-muted mt-2 tracking-widest font-black uppercase text-[10px]">Institutional config</p></div> },
        ]
      },
      // Student Routes
      {
        element: <ProtectedRoute allowedRoles={['STUDENT']} />,
        children: [
          { path: '/student-portal', element: <StudentPortal /> },
        ]
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
