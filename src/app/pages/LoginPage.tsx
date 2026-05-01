import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'citizen' | 'authority'>('citizen');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register, userRole } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Handle login
        const result = await login(email, password);
        if (result.success) {
          // Get user role from auth context after login
          // Small delay to allow state to update
          setTimeout(() => {
            const session = localStorage.getItem('greenwatch_session');
            if (session) {
              const { role } = JSON.parse(session);
              if (role === 'citizen') {
                navigate('/dashboard');
              } else {
                navigate('/authority/dashboard');
              }
            }
          }, 100);
        } else {
          setError(result.message);
        }
      } else {
        // Handle registration
        const result = await register(email, password, role);
        if (result.success) {
          setError('');
          setIsLogin(true);
          setEmail('');
          setPassword('');
          // Show success message briefly
          setError('Account created! Please login.');
          setTimeout(() => setError(''), 3000);
        } else {
          setError(result.message);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 border-4 border-black mx-auto mb-4"></div>
          <h1 className="text-3xl font-mono font-bold">GreenWatch</h1>
          <p className="text-gray-600 font-mono text-sm mt-2">Environmental Monitoring Platform</p>
        </div>

        {/* Form Container */}
        <div className="border-4 border-black p-8 bg-gray-50">
          <h2 className="text-xl font-mono font-bold mb-6 text-center">
            {isLogin ? 'LOGIN' : 'REGISTER'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className={`border-2 p-3 font-mono text-sm ${
                error.includes('created')
                  ? 'border-green-600 bg-green-50 text-green-800'
                  : 'border-red-600 bg-red-50 text-red-800'
              }`}>
                {error}
              </div>
            )}

            {/* Demo Accounts Info */}
            {isLogin && (
              <div className="border-2 border-gray-400 bg-gray-100 p-3">
                <p className="font-mono text-xs font-bold mb-2">DEMO ACCOUNTS:</p>
                <p className="font-mono text-xs">Citizen: citizen@demo.com / citizen123</p>
                <p className="font-mono text-xs">Authority: authority@demo.com / authority123</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-mono font-bold mb-2">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-black p-3 font-mono bg-white"
                placeholder="user@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-mono font-bold mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-black p-3 font-mono bg-white"
                placeholder="••••••••"
                required
              />
              {!isLogin && (
                <p className="text-xs font-mono text-gray-600 mt-1">
                  Minimum 6 characters
                </p>
              )}
            </div>

            {/* Role Selection - Only show during registration */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-mono font-bold mb-2">
                  REGISTER AS
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="citizen"
                      checked={role === 'citizen'}
                      onChange={() => setRole('citizen')}
                      className="w-4 h-4"
                    />
                    <span className="font-mono text-sm">Citizen</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="authority"
                      checked={role === 'authority'}
                      onChange={() => setRole('authority')}
                      className="w-4 h-4"
                    />
                    <span className="font-mono text-sm">Authority</span>
                  </label>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white p-4 font-mono font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'PLEASE WAIT...' : (isLogin ? 'LOGIN' : 'REGISTER')}
            </button>
          </form>

          {/* Toggle Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm font-mono underline hover:no-underline"
            >
              {isLogin
                ? "Don't have an account? Register"
                : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
