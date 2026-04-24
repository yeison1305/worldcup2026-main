import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import TeamsPanel from '../components/TeamsPanel';
import MatchesPanel from '../components/MatchesPanel';

const API_URL = 'http://localhost:3000/api/auth';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    const timer = setTimeout(() => setIsAnimating(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No hay sesión activa. Por favor, iniciá sesión.');
        setLoading(false);
        return;
      }
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
      const message = err.response?.data?.message || err.message || 'Error al cargar usuarios';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewUser = (userData) => {
    setSelectedUser(userData);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a' }}>
      {/* Header */}
      <header 
        className="flex justify-between items-center px-8 py-4"
        style={{ 
          backgroundColor: '#1e293b', 
          borderBottom: '1px solid #334155',
          transform: isAnimating ? 'scale(0.98)' : 'scale(1)',
          opacity: isAnimating ? 0.8 : 1,
          transition: 'all 0.3s ease-out'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-amber-400 p-2 rounded-lg shadow-lg">
            <svg className="w-6 h-6" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <h1 className="font-bold text-xl" style={{ color: '#fbbf24' }}>FIFA World Cup 2026</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#fbbf24', color: '#0f172a' }}>
            ADMIN
          </span>
          <Link 
            to="/groups" 
            className="px-4 py-2 rounded-lg text-sm font-bold bg-slate-800 text-white hover:bg-slate-700 transition"
          >
            Fase de Grupos
          </Link>
          <span className="text-sm" style={{ color: '#94a3b8' }}>{user?.name}</span>
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-red-500/20"
            style={{ border: '1px solid #334155', color: '#fca5a5' }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-8">
        {/* Welcome */}
        <div className="mb-8" style={{ animation: 'fadeIn 0.4s ease-out' }}>
          <h2 className="text-3xl font-bold text-white mb-2">Panel de Administración</h2>
          <p className="text-slate-400">
            Bienvenido, {user?.name}. Desde aquí podés gestionar usuarios y contenido.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div 
            className="rounded-xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02]"
            style={{ 
              background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid #334155',
              animation: 'fadeIn 0.4s ease-out'
            }}
          >
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)' }}>
              <svg className="w-6 h-6" fill="none" stroke="#fbbf24" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: '#fbbf24' }}>{users.length}</div>
              <div className="text-sm text-slate-400">Usuarios Totales</div>
            </div>
          </div>

          <div 
            className="rounded-xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02]"
            style={{ 
              background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid #334155',
              animation: 'fadeIn 0.5s ease-out'
            }}
          >
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)' }}>
              <svg className="w-6 h-6" fill="none" stroke="#fbbf24" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: '#fbbf24' }}>
                {users.filter(u => u.role === 'USER').length}
              </div>
              <div className="text-sm text-slate-400">Usuarios Regulares</div>
            </div>
          </div>

          <div 
            className="rounded-xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02]"
            style={{ 
              background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid #334155',
              animation: 'fadeIn 0.6s ease-out'
            }}
          >
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)' }}>
              <svg className="w-6 h-6" fill="none" stroke="#fbbf24" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04c0 4.833 1.89 9.131 5.006 12.318a11.923 11.923 0 005.612 3.12 11.923 11.923 0 005.612-3.12c3.116-3.187 5.006-7.485 5.006-12.318z"></path>
              </svg>
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: '#fbbf24' }}>
                {users.filter(u => u.role === 'ADMIN').length}
              </div>
              <div className="text-sm text-slate-400">Administradores</div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div 
          className="rounded-xl p-6 mb-8"
          style={{ 
            background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid #334155',
            animation: 'fadeIn 0.7s ease-out'
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Gestión de Usuarios</h3>
          
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-10 text-slate-400">Cargando usuarios...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-4 border-b text-xs font-semibold uppercase text-slate-400">Nombre</th>
                    <th className="text-left py-3 px-4 border-b text-xs font-semibold uppercase text-slate-400">Email</th>
                    <th className="text-left py-3 px-4 border-b text-xs font-semibold uppercase text-slate-400">Rol</th>
                    <th className="text-left py-3 px-4 border-b text-xs font-semibold uppercase text-slate-400">Fecha de Registro</th>
                    <th className="text-left py-3 px-4 border-b text-xs font-semibold uppercase text-slate-400">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-sm font-bold">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{u.email}</td>
                      <td className="py-4 px-4">
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ 
                            backgroundColor: u.role === 'ADMIN' ? '#fbbf24' : '#334155',
                            color: u.role === 'ADMIN' ? '#0f172a' : '#fff'
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-400 text-sm">{formatDate(u.created_at)}</td>
                      <td className="py-4 px-4">
                        <button 
                          onClick={() => handleViewUser(u)}
                          className="px-3 py-1 rounded-lg text-xs bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            className="rounded-xl p-6 cursor-pointer transition-all hover:scale-[1.02] hover:border-amber-400/50"
            style={{ 
              background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid #334155',
              animation: 'fadeIn 0.8s ease-out'
            }}
          >
            <div className="p-3 rounded-lg w-fit mb-4" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)' }}>
              <svg className="w-6 h-6" fill="none" stroke="#fbbf24" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h4 className="text-base font-semibold text-white mb-2">Estadísticas</h4>
            <p className="text-sm text-slate-400">Ver análisis y métricas del predictor</p>
          </div>

          <div 
            className="rounded-xl p-6 cursor-pointer transition-all hover:scale-[1.02] hover:border-amber-400/50"
            style={{ 
              background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid #334155',
              animation: 'fadeIn 0.9s ease-out'
            }}
          >
            <div className="p-3 rounded-lg w-fit mb-4" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)' }}>
              <svg className="w-6 h-6" fill="none" stroke="#fbbf24" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
              </svg>
            </div>
            <h4 className="text-base font-semibold text-white mb-2">Gestionar Partidos</h4>
            <p className="text-sm text-slate-400">Configurar partidos y predicciones</p>
          </div>

          <div 
            className="rounded-xl p-6 cursor-pointer transition-all hover:scale-[1.02] hover:border-amber-400/50"
            style={{ 
              background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid #334155',
              animation: 'fadeIn 1s ease-out'
            }}
          >
            <div className="p-3 rounded-lg w-fit mb-4" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)' }}>
              <svg className="w-6 h-6" fill="none" stroke="#fbbf24" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h4 className="text-base font-semibold text-white mb-2">Notificaciones</h4>
            <p className="text-sm text-slate-400">Enviar anuncios a usuarios</p>
          </div>

          <div 
            className="rounded-xl p-6 cursor-pointer transition-all hover:scale-[1.02] hover:border-amber-400/50"
            style={{ 
              background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid #334155',
              animation: 'fadeIn 1.1s ease-out'
            }}
          >
            <div className="p-3 rounded-lg w-fit mb-4" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)' }}>
              <svg className="w-6 h-6" fill="none" stroke="#fbbf24" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h4 className="text-base font-semibold text-white mb-2">Configuración</h4>
            <p className="text-sm text-slate-400">Ajustes generales del sistema</p>
          </div>
        </div>

        {/* Panels */}
        <div className="mt-8 space-y-8">
          <MatchesPanel />
          <TeamsPanel />
        </div>
      </main>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            animation: 'modalBackdrop 0.2s ease-out forwards'
          }}
          onClick={closeUserModal}
        >
          <div 
            className="rounded-2xl p-8 w-full max-w-md"
            style={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #334155',
              animation: 'modalSlideIn 0.3s ease-out forwards'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-xl text-white">Detalles del Usuario</h2>
              <button 
                onClick={closeUserModal}
                className="text-slate-400 hover:text-white text-2xl transition-colors"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Avatar y nombre */}
              <div 
                className="flex items-center gap-4 mb-6"
                style={{ animation: 'fadeIn 0.3s ease-out 0.1s forwards', opacity: 0 }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedUser.name}</h3>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ 
                      backgroundColor: selectedUser.role === 'ADMIN' ? '#fbbf24' : '#334155',
                      color: selectedUser.role === 'ADMIN' ? '#0f172a' : '#fff'
                    }}
                  >
                    {selectedUser.role}
                  </span>
                </div>
              </div>

              {/* Info campos */}
              <div className="space-y-3">
                <div 
                  className="flex justify-between items-center py-2 border-b border-slate-700"
                  style={{ animation: 'fadeIn 0.3s ease-out 0.2s forwards', opacity: 0 }}
                >
                  <span className="text-slate-400">Email</span>
                  <span className="text-white font-medium">{selectedUser.email}</span>
                </div>
                <div 
                  className="flex justify-between items-center py-2 border-b border-slate-700"
                  style={{ animation: 'fadeIn 0.3s ease-out 0.3s forwards', opacity: 0 }}
                >
                  <span className="text-slate-400">Fecha de Registro</span>
                  <span className="text-white font-medium">{formatDate(selectedUser.created_at)}</span>
                </div>
                {selectedUser.updated_at && (
                  <div 
                    className="flex justify-between items-center py-2 border-b border-slate-700"
                    style={{ animation: 'fadeIn 0.3s ease-out 0.4s forwards', opacity: 0 }}
                  >
                    <span className="text-slate-400">Última Actualización</span>
                    <span className="text-white font-medium">{formatDate(selectedUser.updated_at)}</span>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={closeUserModal}
              className="w-full mt-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors"
              style={{ 
                border: '1px solid #334155',
                animation: 'fadeIn 0.3s ease-out 0.5s forwards',
                opacity: 0
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-6 text-slate-500 text-xs border-t border-slate-800 mt-8">
        <p>© 2026 FIFA Official Predictor - Panel de Administración</p>
      </footer>
    </div>
  );
}
