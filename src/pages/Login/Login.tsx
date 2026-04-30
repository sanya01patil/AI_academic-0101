import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/auth';

export const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState<'faculty' | 'student'>('faculty');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Domain detection or explicit mode
    const isFacultyDomain = email.toLowerCase().endsWith('@university.ac.in');
    const role = isFacultyDomain || mode === 'faculty' ? 'FACULTY_ADMIN' : 'STUDENT';

    setTimeout(() => {
      const mockUser = {
        id: role === 'FACULTY_ADMIN' ? 'FAC-001' : 'ST-999',
        name: role === 'FACULTY_ADMIN' ? 'Prof. Anirudh Iyer' : 'Student User',
        email,
        role: role as any,
      };
      login(mockUser, 'mock_jwt_token');
      setLoading(false);
      navigate(role === 'STUDENT' ? '/student-portal' : '/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full glass-panel p-10 relative overflow-hidden">
        {/* Subtle decorative glow based on mode */}
        <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700 ${mode === 'faculty' ? 'bg-brand' : 'bg-risk-low'}`} />

        <div className="flex flex-col items-center mb-10 text-center relative z-10">
          <div className="w-14 h-14 bg-brand rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-brand/20">
            <Shield size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">IntegriGuard</h1>
          <p className="text-sm text-text-muted mt-2">
            {mode === 'faculty' ? 'Institutional forensic access node' : 'Student submission portal'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              {mode === 'faculty' ? 'Institutional email' : 'Student email'}
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={mode === 'faculty' ? "e.g. professor@university.ac.in" : "e.g. student@university.edu"}
              className="input bg-surface border-0.5 border-border focus:border-brand/50 focus:ring-1 focus:ring-brand/20" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Access key</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input bg-surface border-0.5 border-border focus:border-brand/50 focus:ring-1 focus:ring-brand/20" 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3 flex items-center justify-center gap-2 rounded-lg font-bold text-sm transition-all duration-200 text-white shadow-md ${
              mode === 'faculty' 
                ? 'bg-brand hover:bg-brand/90 hover:shadow-brand/20' 
                : 'bg-risk-low hover:bg-risk-low/90 hover:shadow-risk-low/20'
            }`}
          >
            {loading ? 'Authenticating...' : `Sign in as ${mode}`}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t-0.5 border-border flex flex-col items-center gap-5 relative z-10">
          <button 
            onClick={() => setMode(mode === 'faculty' ? 'student' : 'faculty')}
            className="text-sm font-bold text-text-secondary hover:text-text-primary transition-colors hover:underline underline-offset-4"
          >
            {mode === 'faculty' ? 'Student? Sign in here' : 'Faculty? Sign in here'}
          </button>
          
          <div className="flex items-center gap-4 text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em]">
            <span>System: Active</span>
            <div className={`w-1.5 h-1.5 rounded-full ${mode === 'faculty' ? 'bg-risk-low' : 'bg-brand'}`} />
            <span>Auth: SSL-256</span>
          </div>
        </div>
      </div>
    </div>
  );
};
