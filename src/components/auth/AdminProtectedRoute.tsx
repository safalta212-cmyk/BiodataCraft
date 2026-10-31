import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminPermission, AdminRole } from '../../types/auth';
import { useSEO } from '../../hooks/useSEO';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: AdminPermission;
  requiredRole?: AdminRole;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole
}) => {
  useSEO({
    title: 'Admin Console | BiodataCraft',
    noindex: true
  });

  const { isAuthenticated, isLoading, currentUser, hasPermission } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-stone-300 tracking-wide font-cinzel">
            Verifying Administrator Authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    // Redirect unauthenticated requests to /admin/login preserving intended path
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  // Role / Permission validation
  if (requiredRole && currentUser.role !== requiredRole && currentUser.role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-stone-200 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-stone-900 font-cinzel">Restricted Access</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Your administrator role ({currentUser.role}) does not have clearance for this protected area.
          </p>
          <div className="pt-2">
            <Link
              to="/admin"
              className="inline-flex items-center justify-center font-semibold rounded-xl transition-all cursor-pointer select-none text-xs px-3 py-1.5 gap-1.5 h-8 bg-amber-800 text-white hover:bg-amber-900 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Overview</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission) && currentUser.role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-stone-200 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-stone-900 font-cinzel">Permission Required</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Your administrator account lacks the <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-800">{requiredPermission}</code> capability.
          </p>
          <div className="pt-2">
            <Link
              to="/admin"
              className="inline-flex items-center justify-center font-semibold rounded-xl transition-all cursor-pointer select-none text-xs px-3 py-1.5 gap-1.5 h-8 bg-amber-800 text-white hover:bg-amber-900 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Overview</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
