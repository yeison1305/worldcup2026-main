import { useState, useEffect, useCallback, useMemo } from 'react';
import matchService from '../services/match.service';
import axios from 'axios';

const GROUPS = ['A', 'B', 'C', 'D'];

/**
 * MatchesPanel — Panel de administración CRUD para partidos
 * Permite crear, editar, registrar resultados y eliminar partidos
 */
export default function MatchesPanel() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [resultMatch, setResultMatch] = useState(null);
  const [formData, setFormData] = useState({
    homeTeamId: '',
    awayTeamId: '',
    groupLetter: '',
    roundNumber: '',
    matchDate: '',
    stadium: '',
    location: '',
  });
  const [resultData, setResultData] = useState({ homeScore: 0, awayScore: 0 });

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const [matchesRes, teamsRes] = await Promise.all([
        matchService.getAll(),
        axios.get('http://localhost:3000/api/teams', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setMatches(matchesRes.data.matches);
      setTeams(teamsRes.data.data.teams);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openModal = useCallback((match = null) => {
    if (match) {
      setEditingMatch(match);
      setFormData({
        homeTeamId: match.home_team_id || '',
        awayTeamId: match.away_team_id || '',
        groupLetter: match.group_letter?.trim() || '',
        roundNumber: match.round_number || '',
        matchDate: match.match_date ? match.match_date.slice(0, 16) : '',
        stadium: match.stadium || '',
        location: match.location || '',
      });
    } else {
      setEditingMatch(null);
      setFormData({
        homeTeamId: '',
        awayTeamId: '',
        groupLetter: '',
        roundNumber: '',
        matchDate: '',
        stadium: '',
        location: '',
      });
    }
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingMatch(null);
  }, []);

  const openResultModal = useCallback((match) => {
    setResultMatch(match);
    setResultData({
      homeScore: match.home_score || 0,
      awayScore: match.away_score || 0,
    });
    setShowResultModal(true);
  }, []);

  const closeResultModal = useCallback(() => {
    setShowResultModal(false);
    setResultMatch(null);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      if (editingMatch) {
        await matchService.update(editingMatch.id, formData);
      } else {
        await matchService.create(formData);
      }
      fetchData();
      closeModal();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar partido');
    }
  }, [editingMatch, formData, fetchData, closeModal]);

  const handleResultSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      await matchService.updateResult(
        resultMatch.id,
        parseInt(resultData.homeScore),
        parseInt(resultData.awayScore)
      );
      fetchData();
      closeResultModal();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar resultado');
    }
  }, [resultMatch, resultData, fetchData, closeResultModal]);

  const handleDelete = useCallback(async (id) => {
    if (!confirm('¿Estás seguro de eliminar este partido?')) return;
    try {
      await matchService.deleteMatch(id);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar');
    }
  }, [fetchData]);

  const handleFormChange = useCallback((field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleResultChange = useCallback((field) => (e) => {
    setResultData((prev) => ({ ...prev, [field]: e.target.value }));
  }, []);

  const getTeamName = useCallback((id) => {
    const team = teams.find((t) => t.id === id);
    return team ? team.name : `Team #${id}`;
  }, [teams]);

  const formatDate = useMemo(() => (date) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const statusBadge = useCallback((status) => {
    const configs = {
      SCHEDULED: { label: 'Programado', bg: '#334155', color: '#94a3b8' },
      LIVE: { label: 'EN VIVO', bg: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5' },
      FINISHED: { label: 'Finalizado', bg: 'rgba(34, 197, 94, 0.3)', color: '#86efac' },
    };
    const config = configs[status] || configs.SCHEDULED;
    return (
      <span
        className="px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        {config.label}
      </span>
    );
  }, []);

  const inputStyle = {
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    color: '#fff',
  };

  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid #334155',
        animation: 'fadeIn 0.7s ease-out',
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Gestión de Partidos</h3>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 rounded-lg text-sm font-bold"
          style={{ backgroundColor: '#fbbf24', color: '#0f172a' }}
        >
          + Nuevo Partido
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
          <button onClick={() => setError('')} className="float-right text-red-400 hover:text-red-200">✕</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-slate-400">Cargando partidos...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-3 px-3 border-b text-xs font-semibold uppercase text-slate-400" style={{ borderColor: '#334155' }}>Grupo</th>
                <th className="text-left py-3 px-3 border-b text-xs font-semibold uppercase text-slate-400" style={{ borderColor: '#334155' }}>Partido</th>
                <th className="text-center py-3 px-3 border-b text-xs font-semibold uppercase text-slate-400" style={{ borderColor: '#334155' }}>Marcador</th>
                <th className="text-left py-3 px-3 border-b text-xs font-semibold uppercase text-slate-400" style={{ borderColor: '#334155' }}>Fecha</th>
                <th className="text-center py-3 px-3 border-b text-xs font-semibold uppercase text-slate-400" style={{ borderColor: '#334155' }}>Estado</th>
                <th className="text-center py-3 px-3 border-b text-xs font-semibold uppercase text-slate-400" style={{ borderColor: '#334155' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m) => (
                <tr key={m.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: '#fbbf24', color: '#0f172a' }}>
                      {m.group_letter?.trim()}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-white">
                    {m.home_team?.name || getTeamName(m.home_team_id)} vs {m.away_team?.name || getTeamName(m.away_team_id)}
                  </td>
                  <td className="py-3 px-3 text-center text-white font-bold">
                    {m.status === 'SCHEDULED' ? '- : -' : `${m.home_score} : ${m.away_score}`}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-xs">{formatDate(m.match_date)}</td>
                  <td className="py-3 px-3 text-center">{statusBadge(m.status)}</td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => openResultModal(m)}
                        className="p-1.5 rounded-lg text-xs bg-green-900/50 text-green-400 hover:bg-green-800 transition-colors"
                        title="Registrar resultado"
                        aria-label="Registrar resultado"
                      >
                        ⚽
                      </button>
                      <button
                        onClick={() => openModal(m)}
                        className="p-1.5 rounded-lg text-xs bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                        title="Editar"
                        aria-label="Editar partido"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-1.5 rounded-lg text-xs bg-red-900/50 text-red-400 hover:bg-red-800 transition-colors"
                        title="Eliminar"
                        aria-label="Eliminar partido"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Crear/Editar Partido */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', animation: 'modalBackdrop 0.2s ease-out forwards' }}
          onClick={closeModal}
        >
          <div
            className="rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: '#1e293b', border: '1px solid #334155', animation: 'modalSlideIn 0.3s ease-out forwards' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-xl text-white text-center mb-4">
              {editingMatch ? '✏️ Editar Partido' : '+ Nuevo Partido'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1.5">Equipo Local</label>
                  <select value={formData.homeTeamId} onChange={handleFormChange('homeTeamId')} required className="w-full rounded-xl py-3 px-4 outline-none" style={inputStyle}>
                    <option value="">Seleccionar</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} (Grupo {t.group_letter?.trim()})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1.5">Equipo Visitante</label>
                  <select value={formData.awayTeamId} onChange={handleFormChange('awayTeamId')} required className="w-full rounded-xl py-3 px-4 outline-none" style={inputStyle}>
                    <option value="">Seleccionar</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} (Grupo {t.group_letter?.trim()})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1.5">Grupo</label>
                  <select value={formData.groupLetter} onChange={handleFormChange('groupLetter')} required className="w-full rounded-xl py-3 px-4 outline-none" style={inputStyle}>
                    <option value="">Seleccionar</option>
                    {GROUPS.map((g) => (
                      <option key={g} value={g}>Grupo {g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1.5">Jornada</label>
                  <select value={formData.roundNumber} onChange={handleFormChange('roundNumber')} className="w-full rounded-xl py-3 px-4 outline-none" style={inputStyle}>
                    <option value="">Seleccionar</option>
                    {[1, 2, 3].map((r) => (
                      <option key={r} value={r}>Jornada {r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-1.5">Fecha y Hora</label>
                <input type="datetime-local" value={formData.matchDate} onChange={handleFormChange('matchDate')} className="w-full rounded-xl py-3 px-4 outline-none" style={inputStyle} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1.5">Estadio</label>
                  <input type="text" placeholder="ej. MetLife Stadium" value={formData.stadium} onChange={handleFormChange('stadium')} className="w-full rounded-xl py-3 px-4 outline-none" style={inputStyle} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1.5">Ciudad</label>
                  <input type="text" placeholder="ej. Nueva Jersey" value={formData.location} onChange={handleFormChange('location')} className="w-full rounded-xl py-3 px-4 outline-none" style={inputStyle} />
                </div>
              </div>

              <button type="submit" className="w-full py-3 rounded-xl font-bold" style={{ backgroundColor: '#fbbf24', color: '#0f172a' }}>
                {editingMatch ? 'Guardar Cambios' : 'Crear Partido'}
              </button>
              <button type="button" onClick={closeModal} className="w-full py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors">
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registrar Resultado */}
      {showResultModal && resultMatch && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', animation: 'modalBackdrop 0.2s ease-out forwards' }}
          onClick={closeResultModal}
        >
          <div
            className="rounded-2xl p-8 w-full max-w-md"
            style={{ backgroundColor: '#1e293b', border: '1px solid #334155', animation: 'modalSlideIn 0.3s ease-out forwards' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-xl text-white text-center mb-6">⚽ Registrar Resultado</h2>

            <div className="text-center mb-6">
              <span className="text-white font-semibold">
                {resultMatch.home_team?.name || getTeamName(resultMatch.home_team_id)}
              </span>
              <span className="text-slate-400 mx-3">vs</span>
              <span className="text-white font-semibold">
                {resultMatch.away_team?.name || getTeamName(resultMatch.away_team_id)}
              </span>
            </div>

            <form onSubmit={handleResultSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <label className="block text-sm font-bold text-slate-400 mb-2">
                    {resultMatch.home_team?.name || 'Local'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={resultData.homeScore}
                    onChange={handleResultChange('homeScore')}
                    className="w-full rounded-xl py-4 px-4 text-center text-3xl font-bold outline-none"
                    style={inputStyle}
                  />
                </div>
                <div className="text-center">
                  <label className="block text-sm font-bold text-slate-400 mb-2">
                    {resultMatch.away_team?.name || 'Visitante'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={resultData.awayScore}
                    onChange={handleResultChange('awayScore')}
                    className="w-full rounded-xl py-4 px-4 text-center text-3xl font-bold outline-none"
                    style={inputStyle}
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-3 rounded-xl font-bold" style={{ backgroundColor: '#22c55e', color: '#fff' }}>
                Registrar Resultado
              </button>
              <button type="button" onClick={closeResultModal} className="w-full py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors">
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
