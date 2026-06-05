import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import matchService from '../services/match.service';
import axios from 'axios';
import PageHeader from '../components/PageHeader';

const PHASE_LABEL = {
  ROUND_32: '16avos de final',
  ROUND_16: 'Octavos de final',
  QUARTER: 'Cuartos de final',
  SEMI: 'Semifinal',
  THIRD_PLACE: '3er Puesto',
  FINAL: '🏆 Final',
};

const PHASE_ORDER = ['ROUND_32', 'ROUND_16', 'QUARTER', 'SEMI', 'FINAL'];

export default function BracketPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [phases, setPhases] = useState({});
  const [loading, setLoading] = useState(false);
  const isAdmin = user?.role === 'ADMIN';

  const fetchMatches = async () => {
    try {
      const res = await matchService.getAll();
      const all = res.data.matches || [];
      const grouped = {};
      for (const m of all) {
        if (m.phase === 'GROUP') continue;
        if (!grouped[m.phase]) grouped[m.phase] = [];
        grouped[m.phase].push(m);
      }
      Object.values(grouped).forEach(arr => arr.sort((a,b) => new Date(a.match_date) - new Date(b.match_date)));
      setPhases(grouped);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchMatches(); }, []);

  const callApi = async (url, body) => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      await axios.post(url, body, { headers: { Authorization: `Bearer ${token}` } });
      await fetchMatches();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const hasKnockout = Object.keys(phases).length > 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a' }}>
      <PageHeader subtitle="Eliminatoria" backTo="/dashboard" />
      <main className="max-w-6xl mx-auto p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">🏆</span> Bracket — Fase Eliminatoria
            </h2>
            <p className="text-slate-400 text-sm mt-1">32 equipos · 16 partidos · 1 campeón</p>
          </div>
          {isAdmin && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => callApi('http://localhost:3000/api/bracket/simulate-groups', {})}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-80 disabled:opacity-50"
                style={{ backgroundColor: '#22c55e20', color: '#4ade80', border: '1px solid #22c55e40' }}
              >
                {loading ? '...' : '🎲 Simular fase de grupos'}
              </button>
              <button
                onClick={() => callApi('http://localhost:3000/api/predictions/generate-all', {})}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-80 disabled:opacity-50"
                style={{ backgroundColor: '#8b5cf620', color: '#a78bfa', border: '1px solid #8b5cf640' }}
              >
                {loading ? '...' : '🔮 Predecir fase de grupos'}
              </button>
              <button
                onClick={() => callApi('http://localhost:3000/api/bracket/generate', {})}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-80 disabled:opacity-50"
                style={{ backgroundColor: '#fbbf24', color: '#0f172a' }}
              >
                {loading ? '...' : '🎲 Generar bracket'}
              </button>
            </div>
          )}
        </div>

        {!hasKnockout ? (
          <div className="text-center py-20 text-slate-400 border border-slate-700 rounded-xl border-dashed">
            <div className="text-4xl mb-4">🏆</div>
            <p className="text-lg font-semibold text-white mb-2">Aún no hay partidos de eliminatoria</p>
            <p className="text-sm">
              {isAdmin ? 'Clickeá "Generar bracket" cuando la fase de grupos esté terminada.' : 'Esperá a que el admin genere el bracket.'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {PHASE_ORDER.map((phase, pi) => {
              const matches = phases[phase] || [];
              const pairs = [];
              for (let i = 0; i < matches.length; i += 2) {
                pairs.push([matches[i], matches[i + 1] || null]);
              }
              if (pairs.length === 0) return null;

              const isLast = pi === PHASE_ORDER.length - 1;
              const allFinished = matches.every(m => m.status === 'FINISHED');
              const canSimulate = isAdmin && matches.some(m => m.status === 'SCHEDULED' && m.home_team_id && m.away_team_id);
              const needsPredictions = isAdmin && matches.some(m => m.status === 'SCHEDULED' && m.home_team_id && m.away_team_id);

              return (
                <section key={phase}>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-lg font-bold text-white">{PHASE_LABEL[phase]}</h3>
                    {canSimulate && (
                      <button
                        onClick={() => callApi('http://localhost:3000/api/bracket/simulate', { phase })}
                        disabled={loading}
                        className="px-3 py-1 rounded-lg text-xs font-bold transition-all hover:opacity-80 disabled:opacity-50"
                        style={{ backgroundColor: '#22c55e20', color: '#4ade80', border: '1px solid #22c55e40' }}
                      >
                        {loading ? '...' : '🎲 Simular resultados'}
                      </button>
                    )}
                    {needsPredictions && (
                      <button
                        onClick={() => callApi('http://localhost:3000/api/bracket/predict', { phase })}
                        disabled={loading}
                        className="px-3 py-1 rounded-lg text-xs font-bold transition-all hover:opacity-80 disabled:opacity-50"
                        style={{ backgroundColor: '#8b5cf620', color: '#a78bfa', border: '1px solid #8b5cf640' }}
                      >
                        {loading ? '...' : '🔮 Generar predicciones'}
                      </button>
                    )}
                    {allFinished && !isLast && isAdmin && (
                      <button
                        onClick={() => callApi('http://localhost:3000/api/bracket/advance', { phase })}
                        disabled={loading}
                        className="px-3 py-1 rounded-lg text-xs font-bold transition-all hover:opacity-80 disabled:opacity-50"
                        style={{ backgroundColor: '#fbbf2420', color: '#fbbf24', border: '1px solid #fbbf2440' }}
                      >
                        {loading ? '...' : '➡️ Avanzar a siguiente ronda'}
                      </button>
                    )}
                    {allFinished && matches.length === 1 && (
                      <span className="text-sm font-bold text-amber-400 ml-2">
                        ¡Hay campeón! 🏆
                      </span>
                    )}
                  </div>

                  <div className={`grid gap-4 ${
                    pairs.length <= 2 ? 'grid-cols-1 md:grid-cols-2 max-w-2xl' :
                    pairs.length <= 4 ? 'grid-cols-1 md:grid-cols-2' :
                    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  }`}>
                    {pairs.map(([m1, m2], pairIdx) => (
                      <div key={pairIdx} className="rounded-xl p-4" style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #334155' }}>
                        <div className="text-center mb-3">
                          <span className="inline-block px-3 py-1 rounded-lg text-[10px] font-bold uppercase" style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#64748b' }}>
                            Llave {pairIdx + 1}
                          </span>
                        </div>
                        <MatchRow match={m1} onClick={() => m1?.home_team_id && navigate(`/matches/${m1.id}`)} />
                        {m2 && (
                          <>
                            <div className="flex items-center gap-2 my-2 px-2">
                              <div className="flex-1 h-px" style={{ backgroundColor: '#334155' }} />
                              <span className="text-[10px] text-slate-600 font-medium">vs en próxima ronda</span>
                              <div className="flex-1 h-px" style={{ backgroundColor: '#334155' }} />
                            </div>
                            <MatchRow match={m2} onClick={() => m2?.home_team_id && navigate(`/matches/${m2.id}`)} />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Third place */}
            {phases['THIRD_PLACE'] && (
              <section>
                <h3 className="text-lg font-bold text-white mb-4">3er Puesto</h3>
                <div className="max-w-sm">
                  <MatchRow match={phases['THIRD_PLACE'][0]} onClick={() => {}} />
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function MatchRow({ match, onClick }) {
  if (!match) return null;
  const finished = match.status === 'FINISHED';
  const winner = finished && match.home_score > match.away_score ? 'home' :
                 finished && match.away_score > match.home_score ? 'away' : null;

  return (
    <div
      onClick={onClick}
      className="rounded-lg p-3 transition-all hover:bg-slate-800/50"
      style={{ backgroundColor: '#0f172a40', cursor: match.home_team_id ? 'pointer' : 'default' }}
    >
      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5">
        <span>{match.match_date ? new Date(match.match_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : ''}</span>
        <span className="truncate ml-2">{match.stadium?.split(' ').pop() || ''}</span>
      </div>
      <div className="flex items-center justify-between py-0.5">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {match.home_team?.flag_url ? (
            <img src={match.home_team.flag_url} alt="" className="w-4 h-3 object-cover rounded-sm flex-shrink-0" />
          ) : <span className="w-4 h-3 flex-shrink-0" />}
          <span className={`text-xs truncate ${match.home_team?.name ? 'text-white font-semibold' : 'text-slate-600'} ${winner === 'home' ? 'font-bold' : ''}`}>
            {match.home_team?.name || 'Por definir'} {winner === 'home' ? '✅' : ''}
          </span>
        </div>
        {match.home_score != null && (
          <span className={`text-sm font-bold ml-2 ${winner === 'home' ? 'text-amber-400' : 'text-white'}`}>{match.home_score}</span>
        )}
      </div>
      <div className="flex items-center justify-between py-0.5">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {match.away_team?.flag_url ? (
            <img src={match.away_team.flag_url} alt="" className="w-4 h-3 object-cover rounded-sm flex-shrink-0" />
          ) : <span className="w-4 h-3 flex-shrink-0" />}
          <span className={`text-xs truncate ${match.away_team?.name ? 'text-white font-semibold' : 'text-slate-600'} ${winner === 'away' ? 'font-bold' : ''}`}>
            {match.away_team?.name || 'Por definir'} {winner === 'away' ? '✅' : ''}
          </span>
        </div>
        {match.away_score != null && (
          <span className={`text-sm font-bold ml-2 ${winner === 'away' ? 'text-amber-400' : 'text-white'}`}>{match.away_score}</span>
        )}
      </div>
    </div>
  );
}
