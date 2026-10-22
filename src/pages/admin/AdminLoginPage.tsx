import React, { useState } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { useSEO } from '../../hooks/useSEO';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  Lock,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Mail,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

// Sanitize admin return path to prevent open redirect vulnerabilities
function getSafeAdminReturnPath(rawPath: unknown): string {
  if (
    typeof rawPath === 'string' &&
    rawPath.startsWith('/admin') &&
    !rawPath.startsWith('//') &&
    !rawPath.includes('\\') &&
    !rawPath.includes(':')
  ) {
    return rawPath;
  }
  return '/admin';
}

export const AdminLoginPage: React.FC = () => {
  useSEO({
    title: 'Admin Authentication | BiodataCraft',
    description: 'Firebase administrator authentication portal for BiodataCraft.'
  });

  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to target or overview with strict validation
  const returnPath = getSafeAdminReturnPath((location.state as any)?.from);
  if (isAuthenticated) {
    return <Navigate to={returnPath} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        toast.success('Admin session verified successfully.', 'Access Granted');
        navigate(returnPath, { replace: true });
      } else {
        setError(res.error || 'Invalid administrator email or password.');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication service error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Site</span>
        </Link>

        <Card variant="elevated" className="border-stone-300 shadow-xl bg-white">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Header Icon & Title */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-amber-100 text-amber-900 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Lock className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold text-stone-900 font-cinzel">
                Admin Authentication
              </h1>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Authorized administrators only. Secured via Firebase Authentication.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* ================= LOGIN FORM ================= */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Admin Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@biodatacraft.internal"
                    className="w-full text-xs border border-stone-300 rounded-xl px-3.5 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter administrator password"
                    className="w-full text-xs border border-stone-300 rounded-xl px-3.5 py-2.5 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
                  />
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full font-bold shadow-sm"
                isLoading={isLoading}
              >
                Sign In to Dashboard
              </Button>
            </form>

            {/* Privacy & Security Footnote */}
            <div className="pt-4 border-t border-stone-100 text-center space-y-1">
              <span className="text-[11px] text-stone-400 font-medium flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Customer Data Accessible</span>
              </span>
              <p className="text-[10px] text-stone-400">
                Customer biodatas are 100% client-side and never saved to administrative databases.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
