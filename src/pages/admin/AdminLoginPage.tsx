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

  const { login, loginWithGoogle, isAuthenticated } = useAdminAuth();
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

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        toast.success('Admin session verified successfully via Google Auth.', 'Access Granted');
        navigate(returnPath, { replace: true });
      } else {
        setError(res.error || 'Google Sign-In was cancelled or failed.');
      }
    } catch (err: any) {
      setError(err?.message || 'Google authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

            {/* Google Authentication (Direct Firebase Auth) */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-stone-300 rounded-xl bg-white text-stone-700 text-xs font-bold hover:bg-stone-50 hover:border-stone-400 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.4 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.6 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>Sign In with Google</span>
            </button>

            <div className="relative flex items-center justify-center my-1">
              <div className="border-t border-stone-200 w-full" />
              <span className="bg-white px-2.5 text-[10px] uppercase tracking-wider text-stone-400 font-bold absolute">
                or use admin credentials
              </span>
            </div>

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
