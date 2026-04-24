import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/teams';
const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export default function TeamsPanel() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({ name: '', flagUrl: '', groupLetter: '' });

  const fetchTeams = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(response.data.data.teams);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar equipos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingTeam) {
        await axios.put(`${API_URL}/${editingTeam.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchTeams();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar equipo');
    }
  }, [editingTeam, formData, fetchTeams]);

  const toggleActive = useCallback(async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTeams();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar estado');
    }
  }, [fetchTeams]);

  const deleteTeam = useCallback(async (id) => {
    if (!confirm('¿Estás seguro de eliminar este equipo?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTeams();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar equipo');
    }
  }, [fetchTeams]);

  const handleToggleActive = useCallback((id) => () => toggleActive(id), [toggleActive]);
  const handleEditTeam = useCallback((team) => () => openModal(team), []);
  const handleDeleteTeam = useCallback((id) => () => deleteTeam(id), [deleteTeam]);

  const openModal = useCallback((team = null) => {
    if (team) {
      setEditingTeam(team);
      setFormData({ name: team.name, flagUrl: team.flag_url || '', groupLetter: team.group_letter });
    } else {
      setEditingTeam(null);
      setFormData({ name: '', flagUrl: '', groupLetter: '' });
    }
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingTeam(null);
    setFormData({ name: '', flagUrl: '', groupLetter: '' });
  }, []);

  const handleFormChange = useCallback((field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const groups = useMemo(() => GROUPS, []);

  return (
    <div 
      className="rounded-xl p-6"
      style={{ 
        background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid #334155',
        animation: 'fadeIn 0.7s ease-out'
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Gestión de Equipos</h3>
        <button 
          onClick={() => openModal()}
          className="px-4 py-2 rounded-lg text-sm font-bold"
          style={{ backgroundColor: '#fbbf24', color: '#0f172a' }}
        >
          + Agregar Equipo
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-slate-400">Cargando equipos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div 
              key={team.id}
              className="rounded-xl p-4 border transition-all hover:scale-[1.02]"
              style={{ 
                backgroundColor: team.is_active ? 'rgba(15, 23, 42, 0.5)' : 'rgba(15, 23, 42, 0.3)',
                border: team.is_active ? '1px solid #fbbf24' : '1px solid #334155',
                opacity: team.is_active ? 1 : 0.6
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-semibold">{team.name}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
                    backgroundColor: '#fbbf24', 
                    color: '#0f172a' 
                  }}>
                    Grupo {team.group_letter}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleToggleActive(team.id)}
                    className="p-2 rounded-lg text-xs"
                    style={{ 
                      backgroundColor: team.is_active ? '#22c55e' : '#ef4444', 
                      color: '#fff' 
                    }}
                    title={team.is_active ? 'Eliminar de la Copa' : 'Restaurar'}
                    aria-label={team.is_active ? 'Eliminar de la Copa' : 'Restaurar'}
                  >
                    {team.is_active ? '🏆' : '❌'}
                  </button>
                  <button 
                    onClick={handleEditTeam(team)}
                    className="p-2 rounded-lg bg-slate-700 text-white text-xs hover:bg-slate-600"
                    aria-label="Editar equipo"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={handleDeleteTeam(team.id)}
                    className="p-2 rounded-lg bg-red-900/50 text-red-400 text-xs hover:bg-red-800"
                    aria-label="Eliminar equipo"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              {team.flag_url && (
                <img 
                  src={team.flag_url} 
                  alt={team.name} 
                  className="w-12 h-8 object-contain"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            animation: 'modalBackdrop 0.2s ease-out forwards'
          }}
          onClick={closeModal}
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
            <h2 
              className="font-bold text-xl text-white text-center mb-4"
              style={{ animation: 'fadeIn 0.3s ease-out 0.1s forwards', opacity: 0 }}
            >
              {editingTeam ? '✏️ Editar Equipo' : '+ Agregar Equipo'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div style={{ animation: 'fadeIn 0.3s ease-out 0.15s forwards', opacity: 0 }}>
                <label className="block text-sm font-bold text-slate-400 mb-1.5">Nombre del Equipo</label>
                <input
                  type="text"
                  placeholder="ej. Colombia"
                  value={formData.name}
                  onChange={handleFormChange('name')}
                  required
                  className="w-full rounded-xl py-3 px-4 text-white outline-none"
                  style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
                />
              </div>

              <div style={{ animation: 'fadeIn 0.3s ease-out 0.2s forwards', opacity: 0 }}>
                <label className="block text-sm font-bold text-slate-400 mb-1.5">Grupo</label>
                <select
                  value={formData.groupLetter}
                  onChange={handleFormChange('groupLetter')}
                  required
                  className="w-full rounded-xl py-3 px-4 text-white outline-none"
                  style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
                >
                  <option value="">Seleccionar grupo</option>
                  {groups.map(g => (
                    <option key={g} value={g}>Grupo {g}</option>
                  ))}
                </select>
              </div>

              <div style={{ animation: 'fadeIn 0.3s ease-out 0.25s forwards', opacity: 0 }}>
                <label className="block text-sm font-bold text-slate-400 mb-1.5">URL de la Bandera (opcional)</label>
                <input
                  type="url"
                  placeholder="https://ejemplo.com/bandera.png"
                  value={formData.flagUrl}
                  onChange={handleFormChange('flagUrl')}
                  className="w-full rounded-xl py-3 px-4 text-white outline-none"
                  style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 rounded-xl font-bold"
                style={{ 
                  backgroundColor: '#fbbf24', 
                  color: '#0f172a',
                  animation: 'fadeIn 0.3s ease-out 0.3s forwards',
                  opacity: 0
                }}
              >
                {editingTeam ? 'Guardar Cambios' : 'Agregar Equipo'}
              </button>
              
              <button 
                type="button" 
                onClick={closeModal}
                className="w-full py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors"
                style={{ 
                  animation: 'fadeIn 0.3s ease-out 0.35s forwards',
                  opacity: 0
                }}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}