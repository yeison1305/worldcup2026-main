import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a' }}>
      {/* Header */}
      <header 
        className="px-8 py-6 mb-8"
        style={{ 
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          borderBottom: '1px solid #334155'
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl mb-2" style={{ color: '#fbbf24' }}>🏆 FIFA World Cup 2026</h1>
            <p className="text-slate-400">Bienvenido, {user?.name}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-red-500/20"
            style={{ border: '1px solid #334155', color: '#fca5a5' }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card: Fase de Grupos */}
          <Link 
            to="/groups"
            className="block rounded-xl p-8 transition-all hover:scale-[1.02] group"
            style={{ 
              background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid #334155'
            }}
          >
            <div className="bg-amber-400/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-3xl transition-transform group-hover:scale-110">
              📊
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Fase de Grupos</h2>
            <p className="text-slate-400 mb-6">
              Revisa la tabla de posiciones, los resultados de los partidos y el estado de cada equipo.
            </p>
            <span className="inline-flex items-center gap-2 font-bold" style={{ color: '#fbbf24' }}>
              Ver detalles <span>→</span>
            </span>
          </Link>

          {/* Card: Predicciones */}
          <div 
            className="block rounded-xl p-8 opacity-75"
            style={{ 
              background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid #334155'
            }}
          >
            <div className="bg-slate-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-3xl">
              🔮
            </div>
            <h2 className="text-2xl font-bold text-slate-300 mb-2">Tus Predicciones</h2>
            <p className="text-slate-500 mb-6">
              Próximamente podrás hacer predicciones de los partidos con ayuda de IA.
            </p>
            <span className="inline-flex items-center gap-2 font-bold text-slate-500 uppercase text-xs tracking-wider">
              Pronto
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}