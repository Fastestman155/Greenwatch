import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'citizen' | 'authority'>('citizen');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
    if (role === 'citizen') {
      navigate('/dashboard');
    } else {
      navigate('/authority/dashboard');
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
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-mono font-bold mb-2">
                LOGIN AS
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black text-white p-4 font-mono font-bold hover:bg-gray-800 transition-colors"
            >
              {isLogin ? 'LOGIN' : 'REGISTER'}
            </button>
          </form>

          {/* Toggle Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
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
