import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import TrophyIcon from '../components/TrophyIcon';
import TeamsPanel from '../components/TeamsPanel';
import MatchesPanel from '../components/MatchesPanel';

const API_URL = 'http://localhost:3000/api/auth';

const TABS = [
  { key: 'summary', label: '📊 Resumen' },
  { key: 'users', label: '👥 Usuarios' },
  { key: 'teams', label: '⚽ Equipos' },
  { key: 'matches', label: '📅 Partidos' },
  { key: 'audit', label: '📋 Auditoría' },
];

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchAuditLog();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { setError('No hay sesión activa'); setLoading(false); return; }
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLog = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/auth/audit', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuditLogs(res.data.data?.logs || []);
    } catch (err) {
      console.error('Error fetching audit log:', err);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };
  const formatDate = (date) => new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const handleViewUser = (u) => { setSelectedUser(u); setShowUserModal(true); };
  const closeUserModal = () => { setShowUserModal(false); setSelectedUser(null); };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a' }}>
      <header
        className="px-8 py-6"
        style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', borderBottom: '1px solid #334155' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <TrophyIcon />
            <div>
              <h1 className="font-bold text-3xl mb-1" style={{ color: '#fbbf24' }}>FIFA World Cup 2026</h1>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Administrador</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/live" className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-red-500/10" style={{ border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5' }}>
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block mr-1 animate-pulse" />Live
            </Link>
            <Link to="/groups" className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-slate-800" style={{ border: '1px solid #334155', color: '#cbd5e1' }}>Grupos</Link>
            <Link to="/dashboard" className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-slate-800" style={{ border: '1px solid #334155', color: '#cbd5e1' }}>Dashboard</Link>
            <span className="text-sm" style={{ color: '#94a3b8' }}>{user?.name}</span>
            <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-red-500/20" style={{ border: '1px solid #334155', color: '#fca5a5' }}>Cerrar sesión</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); if (tab.key === 'audit') fetchAuditLog(); }}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap"
              style={{
                backgroundColor: activeTab === tab.key ? '#fbbf24' : '#1e293b',
                color: activeTab === tab.key ? '#0f172a' : '#94a3b8',
                border: activeTab === tab.key ? 'none' : '1px solid #334155',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Resumen */}
        {activeTab === 'summary' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard icon="users" value={users.length} label="Usuarios Totales" />
              <StatCard icon="user" value={users.filter(u => u.role === 'USER').length} label="Regulares" />
              <StatCard icon="shield" value={users.filter(u => u.role === 'ADMIN').length} label="Administradores" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickCard icon="stats" title="Estadísticas" desc="Ver análisis del predictor" onClick={() => setActiveTab('audit')} />
              <QuickCard icon="match" title="Gestionar Partidos" desc="Crear y configurar partidos" onClick={() => setActiveTab('matches')} />
              <QuickCard icon="team" title="Gestionar Equipos" desc="Administrar equipos" onClick={() => setActiveTab('teams')} />
              <QuickCard icon="settings" title="Predicciones" desc="Generar predicciones IA" onClick={() => {}} />
            </div>
          </>
        )}

        {/* Tab: Usuarios */}
        {activeTab === 'users' && (
          <div className="rounded-xl p-6" style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #334155' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Usuarios registrados</h3>
              <span className="text-sm text-slate-400">{users.length} usuarios</span>
            </div>
            {error && <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
            {loading ? (
              <div className="text-center py-10 text-slate-400">Cargando...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-3 px-4 border-b border-slate-700 text-xs font-semibold uppercase text-slate-400">Nombre</th>
                      <th className="text-left py-3 px-4 border-b border-slate-700 text-xs font-semibold uppercase text-slate-400">Email</th>
                      <th className="text-left py-3 px-4 border-b border-slate-700 text-xs font-semibold uppercase text-slate-400">Rol</th>
                      <th className="text-left py-3 px-4 border-b border-slate-700 text-xs font-semibold uppercase text-slate-400">Registro</th>
                      <th className="text-left py-3 px-4 border-b border-slate-700 text-xs font-semibold uppercase text-slate-400"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-slate-700/30 hover:bg-slate-800/30">
                        <td className="py-3 px-4"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xs font-bold">{u.name.charAt(0)}</div><span className="text-white text-sm">{u.name}</span></div></td>
                        <td className="py-3 px-4 text-slate-300 text-sm">{u.email}</td>
                        <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: u.role === 'ADMIN' ? '#fbbf24' : '#334155', color: u.role === 'ADMIN' ? '#0f172a' : '#fff' }}>{u.role}</span></td>
                        <td className="py-3 px-4 text-slate-500 text-xs">{formatDate(u.created_at)}</td>
                        <td className="py-3 px-4"><button onClick={() => handleViewUser(u)} className="px-2 py-1 rounded text-xs bg-slate-700 text-white hover:bg-slate-600">Ver</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab: Equipos */}
        {activeTab === 'teams' && <TeamsPanel />}

        {/* Tab: Partidos */}
        {activeTab === 'matches' && <MatchesPanel />}

        {/* Tab: Auditoría */}
        {activeTab === 'audit' && (
          <div className="rounded-xl p-6" style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #334155' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Registro de auditoría ({auditLogs.length})</h3>
              <button onClick={fetchAuditLog} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-slate-800" style={{ border: '1px solid #334155', color: '#94a3b8' }}>🔄 Refrescar</button>
            </div>
            {auditLogs.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">Sin registros de auditoría</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ backgroundColor: '#0f172a' }}>
                    <tr>
                      <th className="text-left py-2 px-3 text-slate-400 font-medium">Fecha</th>
                      <th className="text-left py-2 px-3 text-slate-400 font-medium">Acción</th>
                      <th className="text-left py-2 px-3 text-slate-400 font-medium">Entidad</th>
                      <th className="text-left py-2 px-3 text-slate-400 font-medium">Ruta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} style={{ borderTop: '1px solid #1e293b' }}>
                        <td className="py-2 px-3 text-slate-400 text-xs whitespace-nowrap">{new Date(log.created_at).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="py-2 px-3"><span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: log.action === 'CREATE' ? '#065f4620' : log.action === 'DELETE' ? '#7f1d1d20' : '#fbbf2420', color: log.action === 'CREATE' ? '#6ee7b7' : log.action === 'DELETE' ? '#fca5a5' : '#fbbf24' }}>{log.action}</span></td>
                        <td className="py-2 px-3 text-white text-xs">{log.entity_type} #{log.entity_id}</td>
                        <td className="py-2 px-3 text-slate-500 text-xs">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* User Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={closeUserModal}>
          <div className="rounded-2xl p-8 w-full max-w-md" style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-xl text-white mb-4">Detalle de Usuario</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Nombre</span><span className="text-white">{selectedUser.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Email</span><span className="text-white">{selectedUser.email}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Rol</span><span className="text-white">{selectedUser.role}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Registro</span><span className="text-white">{formatDate(selectedUser.created_at)}</span></div>
            </div>
            <button onClick={closeUserModal} className="w-full mt-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors" style={{ border: '1px solid #334155' }}>Cerrar</button>
          </div>
        </div>
      )}

      <footer className="text-center py-6 text-slate-500 text-xs border-t border-slate-800 mt-8">
        <p>© 2026 FIFA Official Predictor - Panel de Administración</p>
      </footer>
    </div>
  );
}

function StatCard({ value, label, icon }) {
  const icons = {
    users: <svg className="w-6 h-6" fill="none" stroke="#fbbf24" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
    user: <svg className="w-6 h-6" fill="none" stroke="#fbbf24" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
    shield: <svg className="w-6 h-6" fill="none" stroke="#fbbf24" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04c0 4.833 1.89 9.131 5.006 12.318a11.923 11.923 0 005.612 3.12 11.923 11.923 0 005.612-3.12c3.116-3.187 5.006-7.485 5.006-12.318z"/></svg>,
  };
  return (
    <div className="rounded-xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #334155' }}>
      <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(251,191,36,0.2)' }}>{icons[icon]}</div>
      <div><div className="text-3xl font-bold" style={{ color: '#fbbf24' }}>{value}</div><div className="text-sm text-slate-400">{label}</div></div>
    </div>
  );
}

function QuickCard({ icon, title, desc, onClick }) {
  const icons = {
    stats: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>,
    match: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>,
    team: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>,
    settings: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></>,
  };
  return (
    <div onClick={onClick} className="rounded-xl p-6 cursor-pointer transition-all hover:scale-[1.02] hover:border-amber-400/50" style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #334155' }}>
      <div className="p-3 rounded-lg w-fit mb-4" style={{ backgroundColor: 'rgba(251,191,36,0.2)' }}>
        <svg className="w-6 h-6" fill="none" stroke="#fbbf24" viewBox="0 0 24 24">{icons[icon]}</svg>
      </div>
      <h4 className="text-base font-semibold text-white mb-2">{title}</h4>
      <p className="text-sm text-slate-400">{desc}</p>
    </div>
  );
}
