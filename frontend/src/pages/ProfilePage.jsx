import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import predictionService from '../services/prediction.service';
import TrophyIcon from '../components/TrophyIcon';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await predictionService.getStats();
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword.length < 6) {
      setError('La contraseña debe tener mínimo 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      await authService.changePassword(currentPassword, newPassword);
      setMessage('Contraseña actualizada correctamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a' }}>
      <header
        className="px-8 py-6 mb-8"
        style={{
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          borderBottom: '1px solid #334155',
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <TrophyIcon size={7} />
            <div>
              <h1 className="font-bold text-3xl mb-1" style={{ color: '#fbbf24' }}>FIFA World Cup 2026</h1>
              <p className="text-xs text-slate-400 uppercase tracking-wider">👤 Perfil</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800"
              style={{ border: '1px solid #334155', color: '#cbd5e1' }}
            >
              Volver
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-red-500/20"
              style={{ border: '1px solid #334155', color: '#fca5a5' }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 pt-0 space-y-6">
        {/* Profile Card */}
        <div className="rounded-xl p-6" style={{
          background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid #334155',
        }}>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-amber-400">📋</span> Información personal
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400 text-sm">Nombre</span>
              <span className="text-white font-medium">{user?.name}</span>
            </div>
            <div className="flex items-center justify-between py-2" style={{ borderTop: '1px solid #1e293b' }}>
              <span className="text-slate-400 text-sm">Email</span>
              <span className="text-white font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2" style={{ borderTop: '1px solid #1e293b' }}>
              <span className="text-slate-400 text-sm">Rol</span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{
                backgroundColor: user?.role === 'ADMIN' ? 'rgba(251,191,36,0.2)' : 'rgba(100,116,139,0.2)',
                color: user?.role === 'ADMIN' ? '#fbbf24' : '#94a3b8',
              }}>
                {user?.role}
              </span>
            </div>
            <div className="flex items-center justify-between py-2" style={{ borderTop: '1px solid #1e293b' }}>
              <span className="text-slate-400 text-sm">Miembro desde</span>
              <span className="text-white font-medium">{formatDate(user?.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="rounded-xl p-6" style={{
          background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid #334155',
        }}>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-amber-400">🔐</span> Cambiar contraseña
          </h2>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#7f1d1d20', border: '1px solid #7f1d1d40', color: '#fca5a5' }}>
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#065f4620', border: '1px solid #065f4640', color: '#6ee7b7' }}>
                {message}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Contraseña actual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-lg px-3 py-2 text-sm text-white"
                style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Nueva contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full rounded-lg px-3 py-2 text-sm text-white"
                style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Confirmar nueva contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-lg px-3 py-2 text-sm text-white"
                style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
                placeholder="Repetí la contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#0f172a' }}
            >
              {loading ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>
        </div>

        {/* Stats Card */}
        <div className="rounded-xl p-6" style={{
          background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid #334155',
        }}>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-amber-400">📊</span> Estadísticas del modelo
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg p-4 text-center" style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
              <div className="text-2xl font-bold" style={{ color: '#fbbf24' }}>{stats?.totalMatches || 0}</div>
              <div className="text-xs text-slate-400 mt-1">Partidos totales</div>
            </div>
            <div className="rounded-lg p-4 text-center" style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
              <div className="text-2xl font-bold" style={{ color: '#fbbf24' }}>{stats?.scheduledMatches || 0}</div>
              <div className="text-xs text-slate-400 mt-1">Programados</div>
            </div>
            <div className="rounded-lg p-4 text-center" style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
              <div className="text-2xl font-bold" style={{ color: '#fbbf24' }}>{stats?.finishedMatches || 0}</div>
              <div className="text-xs text-slate-400 mt-1">Finalizados</div>
            </div>
            <div className="rounded-lg p-4 text-center" style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
              <div className="text-2xl font-bold" style={{ color: '#fbbf24' }}>{stats?.totalPredictions || 0}</div>
              <div className="text-xs text-slate-400 mt-1">Predicciones</div>
            </div>
          </div>

          {/* Accuracy Section */}
          {stats?.accuracy && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
                <div className="text-xl font-bold" style={{ color: '#4ade80' }}>{stats.accuracy.accuracy}%</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Precisión</div>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
                <div className="text-xl font-bold" style={{ color: '#4ade80' }}>{stats.accuracy.correct}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Aciertos ✅</div>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
                <div className="text-xl font-bold" style={{ color: '#fca5a5' }}>{stats.accuracy.incorrect}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Fallos ❌</div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
