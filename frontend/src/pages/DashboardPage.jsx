import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import predictionService from '../services/prediction.service';
import TrophyIcon from '../components/TrophyIcon';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [upcomingMatches, setUpcomingMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await predictionService.getUpcoming();
        setUpcomingMatches(res.data.matches || []);
      } catch (err) {
        console.error('Error fetching matches:', err);
      }
    };
    fetchMatches();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
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
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <TrophyIcon />
            <div>
              <h1 className="font-bold text-3xl mb-1" style={{ color: '#fbbf24' }}>FIFA World Cup 2026</h1>
              <p className="text-xs text-slate-400 uppercase tracking-wider">AI-Powered Predictor & Live Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800"
              style={{ border: '1px solid #334155', color: '#cbd5e1' }}
            >
              👤 Perfil
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

      <main className="max-w-6xl mx-auto p-4 md:p-8 pt-0">
        {/* Próximos partidos */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">⚽</span> Próximos partidos
            </h2>
            <Link
              to="/groups"
              className="text-sm font-medium transition-all hover:underline"
              style={{ color: '#fbbf24' }}
            >
              Ver todos →
            </Link>
          </div>

          {upcomingMatches.length === 0 ? (
            <div
              className="rounded-xl p-8 text-center"
              style={{
                background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                border: '1px solid #334155',
              }}
            >
              <div className="text-3xl mb-3">📅</div>
              <p className="text-slate-400">No hay partidos programados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingMatches.map((match) => (
                <Link
                  key={match.id}
                  to={`/matches/${match.id}`}
                  className="block rounded-xl p-5 transition-all hover:scale-[1.02] group"
                  style={{
                    background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                    border: '1px solid #334155',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-slate-500">
                      {match.group_letter ? `Grupo ${match.group_letter}` : ''}
                    </span>
                    <span className="text-xs text-slate-600">{formatDate(match.match_date)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      {match.home_team?.flag_url ? (
                        <img src={match.home_team.flag_url} alt="" className="w-6 h-4 object-cover rounded-sm" />
                      ) : (
                        <span>🏳️</span>
                      )}
                      <span className="text-sm font-semibold text-white truncate">{match.home_team?.name}</span>
                    </div>
                    <span className="text-lg font-bold text-slate-500 mx-3">vs</span>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="text-sm font-semibold text-white truncate">{match.away_team?.name}</span>
                      {match.away_team?.flag_url ? (
                        <img src={match.away_team.flag_url} alt="" className="w-6 h-4 object-cover rounded-sm" />
                      ) : (
                        <span>🏳️</span>
                      )}
                    </div>
                  </div>

                  {/* Prediction mini-bar */}
                  {match.prediction ? (
                    <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(51,65,85,0.5)' }}>
                      <div className="flex items-end justify-between text-xs mb-1">
                        <span style={{ color: '#a78bfa' }}>{Number(match.prediction.home_win_probability).toFixed(1)}%</span>
                        <span className="text-slate-500">{Number(match.prediction.draw_probability).toFixed(1)}%</span>
                        <span style={{ color: '#60a5fa' }}>{Number(match.prediction.away_win_probability).toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: '#0f172a' }}>
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${match.prediction.home_win_probability}%`,
                            background: `linear-gradient(90deg, #8b5cf6 ${match.prediction.home_win_probability}%, #60a5fa ${match.prediction.home_win_probability}%)`,
                          }}
                        />
                      </div>
                      <div className="mt-1 text-xs" style={{ color: '#fbbf24' }}>
                        🔮 {match.prediction.predicted_winner} · {Number(match.prediction.confidence).toFixed(1)}% confianza
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(51,65,85,0.5)' }}>
                      <span className="text-xs text-slate-500">Sin predicción aún</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Fase de Grupos */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-amber-400">📊</span> Fase de Grupos
          </h2>

          <Link
            to="/groups"
            className="block rounded-xl p-8 transition-all hover:scale-[1.02] group"
            style={{
              background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid #334155',
            }}
          >
            <div className="bg-amber-400/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-3xl transition-transform group-hover:scale-110">
              📊
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Tabla de posiciones</h2>
            <p className="text-slate-400 mb-6">
              Revisa los resultados, posiciones y predicciones de cada grupo.
            </p>
            <span className="inline-flex items-center gap-2 font-bold" style={{ color: '#fbbf24' }}>
              Ver fase de grupos <span>→</span>
            </span>
          </Link>
        </section>
      </main>
    </div>
  );
}
