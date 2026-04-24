import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleButton from '../components/GoogleButton';
import authService from '../services/auth.service';

export default function RegisterPage() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { register } = useAuth();
  const navigate     = useNavigate();

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (googleToken) => {
    setError('');
    setGoogleLoading(true);
    try {
      const res = await authService.googleLogin(googleToken);
      
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Error con Google Sign-In');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = (errorMsg) => {
    setError(errorMsg);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#0f172a' }}>
      <main 
        className="w-full max-w-md rounded-3xl shadow-2xl p-8 md:p-10 transition-all duration-300 ease-out"
        style={{ 
          background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid #334155',
          transform: isAnimating ? 'scale(0.98)' : 'scale(1)',
          opacity: isAnimating ? 0.8 : 1,
          boxShadow: isAnimating ? '0 0 40px rgba(251, 191, 36, 0.3)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
        <header className="flex flex-col items-center mb-8">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-amber-400 p-2.5 rounded-lg shadow-lg transition-transform duration-300 hover:scale-110">
              <svg className="w-8 h-8" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(0,512) scale(0.1,-0.1)" fill="#0f172a">
                  <path d="M2435 4790c-225 -35 -436 -159 -569 -333 -173 -227 -227 -504 -150 -773l26 -95 -31 -68c-17 -37 -31 -74 -31 -83 0 -19 96 -179 118 -195 25 -20 79 -16 102 7 29 29 25 80 -10 140 -34 58 -34 60 -18 95 11 25 13 25 118 25 164 0 305 43 413 125 53 40 48 47 71 -90 70 -407 32 -913 -104 -1400 -68 -244 -64 -242 -78 -56 -21 274 -72 521 -159 775 -48 141 -72 176 -123 176 -28 0 -80 -47 -80 -72 0 -6 22 -75 49 -153 62 -178 103 -347 133 -535 19 -127 22 -183 22 -445 -1 -258 -4 -320 -23 -445 -53 -348 -150 -636 -296 -876 -53 -88 -58 -131 -20 -169l24 -25 743 0c817 0 779 -3 793 60 6 25 -3 47 -49 128 -219 384 -317 785 -320 1302l-1 225 27 41c113 175 248 526 317 824 83 365 133 924 102 1138 -62 425 -409 739 -836 757 -55 2 -127 0 -160 -5z"/>
                  <path d="M2669 4629c210 -34 404 -165 509 -344 60 -103 102 -246 102 -352 0 -29 -4 -33 -39 -43 -45 -12 -123 -26 -194 -34 -48 -6 -48 -6 -64 32 -10 23 -19 85 -23 163 -13 216 -41 254 -315 423 -151 93 -215 137 -215 147 0 18 148 23 239 8z"/>
                  <path d="M2306 4508c29 -29 92 -77 141 -107 229 -141 260 -162 289 -193 49 -51 55 -72 64 -204 4 -67 11 -128 15 -133 13 -22 -149 0 -286 39 -64 18 -91 8 -135 -51 -20 -28 -60 -69 -87 -91 -68 -54 -75 -40 -48 95 12 56 21 127 21 157 -1 136 -99 220 -259 220 -97 0 -102 7 -58 74 51 76 142 164 218 209 35 20 65 37 68 37 2 0 28 -24 57 -52z"/>
                  <path d="M2088 4064c39 -16 40 -24 11 -165 -14 -68 -20 -123 -16 -160l5 -57 -51 -6c27 -4 -74 -4 -103 0l-52 6 -18 72c-19 75 -25 232 -11 298l8 36 97 -5c53 -3 112 -12 130 -19z"/>
                  <path d="M3275 3623c-16 -265 -56 -551 -106 -748 -127 -496 -373 -927 -688 -1202 -151 -132 -146 -134 -84 30 135 357 222 711 258 1051 30 284 15 660 -34 884l-18 84 26 -5c162 -32 431 -34 571 -3 36 7 69 14 73 15 5 0 5 -47 2 -106z"/>
                  <path d="M2840 1490c6 -69 21 -180 34 -247l22 -123 -336 0 -337 0 13 63c7 34 15 78 18 97 6 33 17 43 129 117 136 90 293 226 377 326l55 66 7 -87c4 -48 12 -143 18 -212z"/>
                  <path d="M3093 565c20 -42 37 -78 37 -80 0 -3 -258 -5 -573 -5l-573 0 40 80 39 80 496 0 497 0 37 -75z"/>
                </g>
              </svg>
            </div>
            <div className="text-center">
              <h1 className="font-bold text-2xl text-white">FIFA World Cup 2026</h1>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">AI-Powered Predictor & Live Tracker</p>
            </div>
          </div>
        </header>

        <form key="register-form" onSubmit={handleSubmit} className="space-y-6" style={{ animation: 'fadeIn 0.4s ease-out' }}>
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-400 mb-1.5">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <input
                className="block w-full pl-11 rounded-xl text-white placeholder-slate-600 py-3"
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid #334155' }}
                type="text"
                placeholder="Miguel Torres"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-400 mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <input
                className="block w-full pl-11 rounded-xl text-white placeholder-slate-600 py-3"
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid #334155' }}
                type="email"
                placeholder="miguel@worldcup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <input
                className="block w-full pl-11 pr-11 rounded-xl text-white placeholder-slate-600 py-3"
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid #334155' }}
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? (
                  <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13.875 18.825A10.95 10.95 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button 
            className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-lg text-sm font-black text-slate-900 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              backgroundColor: '#fbbf24', 
              boxShadow: '0 10px 15px -3px rgba(251, 191, 36, 0.2)',
              animation: 'pulse-glow 2s infinite'
            }}
            type="submit"
            disabled={loading || googleLoading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: '#334155' }}></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="px-2" style={{ backgroundColor: '#1e293b', color: '#64748b' }}>Or sign up with</span>
            </div>
          </div>
          <div className="mt-6">
            {googleLoading ? (
              <button className="w-full inline-flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white" disabled style={{ backgroundColor: 'rgba(30, 41, 59, 0.4)', border: '1px solid #334155' }}>
                <span className="mr-3">⏳</span> Connecting to Google...
              </button>
            ) : (
              <GoogleButton 
                onSuccess={handleGoogleSuccess} 
                onError={handleGoogleError} 
              />
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: '#64748b' }}>
            Already have an account?{' '}
            <Link className="font-bold text-amber-400 hover:text-amber-300 transition-colors ml-1" to="/login">
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-8 flex justify-center items-center space-x-2 text-slate-600 text-[10px] uppercase font-bold tracking-wider">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04c0 4.833 1.89 9.131 5.006 12.318a11.923 11.923 0 005.612 3.12 11.923 11.923 0 005.612-3.12c3.116-3.187 5.006-7.485 5.006-12.318z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
          <span>Protected by 256-bit Encryption</span>
        </div>
      </main>

      <footer className="mt-8 text-slate-500 text-xs font-medium">
        © 2026 FIFA Official Predictor - V.4.2.0-stable
      </footer>
    </div>
  );
}
