import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import matchService from '../services/match.service';
import predictionService from '../services/prediction.service';
import TrophyIcon from '../components/TrophyIcon';

export default function MatchDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [matchRes, predRes] = await Promise.all([
          matchService.getById(id),
          predictionService.getByMatch(id),
        ]);
        setMatch(matchRes.data.match);
        setPrediction(predRes.data.prediction);

        if (!predRes.data.prediction && matchRes.data.match) {
          const homeName = matchRes.data.match.home_team?.name;
          const awayName = matchRes.data.match.away_team?.name;
          if (homeName && awayName) {
            const newPred = await predictionService.predict(homeName, awayName);
            setPrediction(newPred.data.prediction);
          }
        }
      } catch (err) {
        setError('Error al cargar el partido');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Por definir';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusLabel = {
    SCHEDULED: 'Programado',
    LIVE: '🔴 EN VIVO',
    FINISHED: 'Finalizado',
  };

  if (error && !match) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f172a' }}>
        <div className="text-center">
          <div className="text-4xl mb-4">⚽</div>
          <h2 className="text-xl text-white mb-2">Partido no encontrado</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ border: '1px solid #334155', color: '#cbd5e1' }}
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

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
              <h1 className="font-bold text-2xl" style={{ color: '#fbbf24' }}>FIFA World Cup 2026</h1>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Detalle del Partido</p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800"
            style={{ border: '1px solid #334155', color: '#cbd5e1' }}
          >
            Volver
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 pt-0">
        {match && (
          <>
            {/* Match Header */}
            <div
              className="rounded-xl p-8 mb-8 text-center"
              style={{
                background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                border: '1px solid #334155',
              }}
            >
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
                style={{
                  backgroundColor: match.status === 'FINISHED' ? 'rgba(34,197,94,0.2)' : match.status === 'LIVE' ? 'rgba(239,68,68,0.2)' : 'rgba(100,116,139,0.2)',
                  color: match.status === 'FINISHED' ? '#22c55e' : match.status === 'LIVE' ? '#ef4444' : '#64748b',
                }}
              >
                {statusLabel[match.status] || match.status}
              </span>

              <div className="flex items-center justify-center gap-4 md:gap-8">
                <div className="flex flex-col items-center gap-2">
                  {match.home_team?.flag_url ? (
                    <img src={match.home_team.flag_url} alt={match.home_team.name} className="w-14 h-10 object-cover rounded" />
                  ) : (
                    <div className="w-14 h-10 rounded bg-slate-700 flex items-center justify-center text-lg">🏳️</div>
                  )}
                  <span className="text-lg font-bold text-white">{match.home_team?.name}</span>
                </div>

                <div className="text-center">
                  {match.status === 'SCHEDULED' ? (
                    <span className="text-4xl font-light text-slate-500">vs</span>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-4xl font-bold text-white">{match.home_score}</span>
                      <span className="text-2xl text-slate-500">-</span>
                      <span className="text-4xl font-bold text-white">{match.away_score}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-2">
                  {match.away_team?.flag_url ? (
                    <img src={match.away_team.flag_url} alt={match.away_team.name} className="w-14 h-10 object-cover rounded" />
                  ) : (
                    <div className="w-14 h-10 rounded bg-slate-700 flex items-center justify-center text-lg">🏳️</div>
                  )}
                  <span className="text-lg font-bold text-white">{match.away_team?.name}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-4 text-sm text-slate-400">
                <span>📅 {formatDate(match.match_date)}</span>
                {match.stadium && <span>🏟️ {match.stadium}</span>}
                {match.group_letter && <span>Grupo {match.group_letter}</span>}
              </div>
            </div>

            {/* Prediction Section */}
            <div
              className="rounded-xl p-8"
              style={{
                background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                border: '1px solid #334155',
              }}
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🔮</span> Predicción IA
              </h2>

              {loading ? (
                <div className="flex flex-col items-center py-8">
                  <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-purple-500 animate-spin mb-4"></div>
                  <p className="text-slate-400">Analizando pronóstico...</p>
                </div>
              ) : prediction ? (
                <>
                  {/* Probabilities */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center flex-1">
                      <div className="text-3xl font-bold text-white">{Number(prediction.home_win_probability).toFixed(1)}%</div>
                      <div className="text-sm text-slate-400 mt-1">{match.home_team?.name}</div>
                    </div>
                    <div className="text-center px-4">
                      <div className="text-xs text-slate-400 mb-1">Ganador</div>
                      <div className="text-xl font-bold" style={{ color: '#fbbf24' }}>{prediction.predicted_winner}</div>
                      <div className="text-xs text-slate-400 mt-1">Confianza {Number(prediction.confidence).toFixed(1)}%</div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-3xl font-bold text-white">{Number(prediction.away_win_probability).toFixed(1)}%</div>
                      <div className="text-sm text-slate-400 mt-1">{match.away_team?.name}</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 rounded-full mb-3" style={{ backgroundColor: '#0f172a' }}>
                    <div
                      className="h-3 rounded-l-full"
                      style={{
                        width: `${prediction.home_win_probability}%`,
                        background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)',
                      }}
                    />
                  </div>

                  <div className="text-xs text-slate-500 text-center mb-6">
                    Empate: {Number(prediction.draw_probability).toFixed(1)}%
                  </div>

                  {/* Result comparison if match finished */}
                  {match.status === 'FINISHED' && (
                    <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#0f172a40', border: '1px solid #334155' }}>
                      <div className="text-xs text-slate-500 mb-2">📊 Resultado real</div>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-lg font-bold text-white">{match.home_score}</span>
                        <span className="text-slate-500">-</span>
                        <span className="text-lg font-bold text-white">{match.away_score}</span>
                      </div>
                      <div className="mt-2 text-center">
                        {match.home_score > match.away_score && prediction.predicted_winner === match.home_team?.name ? (
                          <span className="text-xs" style={{ color: '#4ade80' }}>✅ La predicción acertó</span>
                        ) : match.away_score > match.home_score && prediction.predicted_winner === match.away_team?.name ? (
                          <span className="text-xs" style={{ color: '#4ade80' }}>✅ La predicción acertó</span>
                        ) : match.home_score === match.away_score ? (
                          <span className="text-xs" style={{ color: '#fbbf24' }}>🤝 Empate</span>
                        ) : (
                          <span className="text-xs" style={{ color: '#fca5a5' }}>❌ La predicción falló</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Reasoning */}
                  {prediction.reasoning && (
                    <div className="pt-6" style={{ borderTop: '1px solid #334155' }}>
                      <div className="text-xs text-slate-500 mb-2">🧠 Razonamiento IA</div>
                      <p className="text-sm text-slate-300 leading-relaxed">{prediction.reasoning}</p>
                    </div>
                  )}

                  <div className="mt-4 text-right">
                    <span className="text-xs text-slate-600">Modelo: {prediction.model_version}</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400">No hay predicción disponible para este partido.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
