import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import predictionService from '../services/prediction.service';
import PageHeader from '../components/PageHeader';
import { formatDate, renderReasoning } from '../utils/format';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [champion, setChampion] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await predictionService.getUpcoming();
        setUpcomingMatches(res.data.matches || []);
      } catch (err) {
        console.error('Error fetching matches:', err);
      }
    };
    const fetchChampion = async () => {
      try {
        const res = await predictionService.getChampion();
        setChampion(res.data);
      } catch (err) {
        console.error('Error fetching champion:', err);
      }
    };
    fetchMatches();
    fetchChampion();
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a' }}>
      <PageHeader
        subtitle="AI-Powered Predictor & Live Tracker"
        title={(
          <button onClick={handleLogout} className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-red-500/20"
            style={{ border: '1px solid #334155', color: '#fca5a5' }}>Cerrar sesión</button>
        )}
      />

      <main className="max-w-6xl mx-auto p-4 md:p-8 pt-0">
        {/* Navigation Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Link to="/live" className="block rounded-xl p-5 transition-all hover:scale-[1.02] group"
            style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-xl" style={{ backgroundColor: 'rgba(239,68,68,0.15)' }}>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Live Mode</h3>
            <p className="text-xs text-slate-400">Partidos en vivo</p>
          </Link>
          <Link to="/groups" className="block rounded-xl p-5 transition-all hover:scale-[1.02] group"
            style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #334155' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-xl" style={{ backgroundColor: 'rgba(251,191,36,0.15)' }}>📊</div>
            <h3 className="text-base font-bold text-white mb-1">Fase de Grupos</h3>
            <p className="text-xs text-slate-400">Tabla y partidos</p>
          </Link>
          <Link to="/bracket" className="block rounded-xl p-5 transition-all hover:scale-[1.02] group"
            style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #334155' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-xl" style={{ backgroundColor: 'rgba(34,197,94,0.15)' }}>🏆</div>
            <h3 className="text-base font-bold text-white mb-1">Eliminatoria</h3>
            <p className="text-xs text-slate-400">Bracket completo</p>
          </Link>
          <Link to="/profile" className="block rounded-xl p-5 transition-all hover:scale-[1.02] group"
            style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #334155' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-xl" style={{ backgroundColor: 'rgba(139,92,246,0.15)' }}>👤</div>
            <h3 className="text-base font-bold text-white mb-1">Perfil</h3>
            <p className="text-xs text-slate-400">Tu cuenta y stats</p>
          </Link>
        </div>

        {/* Próximos partidos */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">⚽</span> Próximos partidos
            </h2>
          </div>
          {upcomingMatches.length === 0 ? (
            <div className="rounded-xl p-8 text-center" style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #334155' }}>
              <div className="text-3xl mb-3">📅</div>
              <p className="text-slate-400">No hay partidos programados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingMatches.map((match) => (
                <Link key={match.id} to={`/matches/${match.id}`} className="block rounded-xl p-5 transition-all hover:scale-[1.02] group"
                  style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #334155' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-slate-500">{match.group_letter ? `Grupo ${match.group_letter}` : ''}</span>
                    <span className="text-xs text-slate-600">{formatDate(match.match_date)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      {match.home_team?.flag_url ? <img src={match.home_team.flag_url} alt="" className="w-6 h-4 object-cover rounded-sm" /> : <span>🏳️</span>}
                      <span className="text-sm font-semibold text-white truncate">{match.home_team?.name}</span>
                    </div>
                    <span className="text-lg font-bold text-slate-500 mx-3">vs</span>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="text-sm font-semibold text-white truncate">{match.away_team?.name}</span>
                      {match.away_team?.flag_url ? <img src={match.away_team.flag_url} alt="" className="w-6 h-4 object-cover rounded-sm" /> : <span>🏳️</span>}
                    </div>
                  </div>
                  {match.prediction ? (
                    <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(51,65,85,0.5)' }}>
                      <div className="flex items-end justify-between text-xs mb-1">
                        <span style={{ color: '#a78bfa' }}>{Number(match.prediction.home_win_probability).toFixed(1)}%</span>
                        <span className="text-slate-500">{Number(match.prediction.draw_probability).toFixed(1)}%</span>
                        <span style={{ color: '#60a5fa' }}>{Number(match.prediction.away_win_probability).toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: '#0f172a' }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${match.prediction.home_win_probability}%`, background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)' }} />
                      </div>
                      <div className="mt-1 text-xs" style={{ color: '#fbbf24' }}>
                        🔮 {match.prediction.predicted_winner} · {Number(match.prediction.confidence).toFixed(1)}% confianza
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 pt-3 text-xs text-slate-500" style={{ borderTop: '1px solid rgba(51,65,85,0.5)' }}>Sin predicción aún</div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Champion Prediction */}
        {champion && (
          <section className="mb-10">
            <div className="rounded-xl p-6" style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #334155' }}>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-amber-400">🏆</span> Predicción del campeón
              </h2>
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 text-center">
                  <div className="text-4xl mb-2">🏆</div>
                  <div className="text-lg font-bold" style={{ color: '#fbbf24' }}>{champion.champion?.name}</div>
                  <div className="text-xs text-slate-400">Grupo {champion.champion?.group}</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-500 mb-2">Top 4 proyectado</div>
                  <div className="grid grid-cols-2 gap-2">
                    {(champion.top4 || []).map((t, i) => (
                      <div key={t.name} className="flex items-center gap-2 text-sm">
                        <span className="text-xs text-slate-500">{i + 1}.</span>
                        <span className="text-white">{t.name}</span>
                        <span className="text-xs text-slate-600">Grupo {t.group}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {champion.reasoning && <p className="mt-4 text-xs text-slate-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderReasoning(champion.reasoning) }} />}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
