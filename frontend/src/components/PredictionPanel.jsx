import { useState } from 'react';
import predictionService from '../services/prediction.service';

export default function PredictionPanel({ teams }) {
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePredict = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!homeTeam || !awayTeam) {
      setError('Seleccioná ambos equipos');
      return;
    }

    if (homeTeam === awayTeam) {
      setError('No se puede predecir un partido del mismo equipo');
      return;
    }

    setLoading(true);

    try {
      const response = await predictionService.predict(homeTeam, awayTeam);
      setResult(response.data.prediction);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error al generar la predicción';
      setError(msg + '. ¿Ya sincronizaste los datos?');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setLoading(true);
    setError(null);
    try {
      await predictionService.sync();
      setResult({ message: 'Datos sincronizados correctamente. Ya podés hacer predicciones.' });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error desconocido';
      setError('Error al sincronizar: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl p-6" style={{
      background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
      border: '1px solid #334155',
    }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
            🔮
          </div>
          <h2 className="text-xl font-bold text-white">Predicción IA</h2>
        </div>
        <button
          onClick={handleSync}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 disabled:opacity-50"
          style={{ border: '1px solid #475569', color: '#94a3b8' }}
        >
          Sincronizar datos
        </button>
      </div>

      <form onSubmit={handlePredict} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Equipo local</label>
            <select
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                color: '#e2e8f0',
              }}
            >
              <option value="">Seleccionar...</option>
              {teams.map((team) => (
                <option key={team.name} value={team.name}>{team.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Equipo visitante</label>
            <select
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                color: '#e2e8f0',
              }}
            >
              <option value="">Seleccionar...</option>
              {teams.map((team) => (
                <option key={team.name} value={team.name}>{team.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: '#fff',
          }}
        >
          {loading ? 'Analizando...' : 'Predecir resultado'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 rounded-lg text-sm" style={{ backgroundColor: '#7f1d1d20', border: '1px solid #7f1d1d40', color: '#fca5a5' }}>
          {error}
        </div>
      )}

      {result && !result.message && (
        <div className="mt-6 p-4 rounded-xl" style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          border: '1px solid #475569',
        }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">{result.homeWinProbability}%</span>
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">Ganador predicho</div>
              <div className="text-lg font-bold" style={{ color: '#fbbf24' }}>{result.predictedWinner}</div>
              <div className="text-xs text-slate-400 mt-1">Confianza: {result.confidence}%</div>
            </div>
            <span className="text-2xl">{result.awayWinProbability}%</span>
          </div>

          <div className="w-full h-2 rounded-full mb-2" style={{ backgroundColor: '#0f172a' }}>
            <div className="h-2 rounded-l-full transition-all" style={{
              width: `${result.homeWinProbability}%`,
              background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)',
            }} />
          </div>

          <div className="text-xs text-slate-500 text-center">
            Empate: {result.drawProbability}%
          </div>

          {result.reasoning && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid #334155' }}>
              <div className="text-xs text-slate-500 mb-1">Razonamiento IA</div>
              <p className="text-sm text-slate-300 leading-relaxed">{result.reasoning}</p>
            </div>
          )}

          <div className="mt-3 text-right">
            <span className="text-xs text-slate-600">Modelo: {result.modelVersion}</span>
          </div>
        </div>
      )}

      {result?.message && (
        <div className="mt-4 p-3 rounded-lg text-sm" style={{ backgroundColor: '#065f4620', border: '1px solid #065f4640', color: '#6ee7b7' }}>
          {result.message}
        </div>
      )}
    </div>
  );
}
