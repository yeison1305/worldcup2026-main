import { useState, useEffect, useCallback, useMemo } from 'react';
import standingsService from '../services/standings.service';
import matchService from '../services/match.service';
import StandingsTable from '../components/StandingsTable';
import MatchCard from '../components/MatchCard';

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export default function GroupStagePage() {
  const [activeGroup, setActiveGroup] = useState('A');
  const [standings, setStandings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async (groupLetter) => {
    setLoading(true);
    try {
      const [standingsRes, matchesRes] = await Promise.all([
        standingsService.getByGroup(groupLetter),
        matchService.getByGroup(groupLetter)
      ]);
      setStandings(standingsRes.data.standings);
      setMatches(matchesRes.data.matches);
      setError('');
    } catch (err) {
      console.error('Error fetching group data:', err);
      setError('Error al cargar datos del grupo');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(activeGroup);
  }, [activeGroup, fetchData]);

  const handleGroupChange = (group) => {
    if (group !== activeGroup) {
      setActiveGroup(group);
    }
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
            <h1 className="font-bold text-3xl mb-2" style={{ color: '#fbbf24' }}>Fase de Grupos</h1>
            <p className="text-slate-400">Tabla de posiciones y resultados oficiales</p>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800"
            style={{ border: '1px solid #334155', color: '#cbd5e1' }}
          >
            Volver
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 pt-0">
        {/* Group Selector Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
          {GROUPS.map((group) => (
            <button
              key={group}
              onClick={() => handleGroupChange(group)}
              className="px-6 py-3 rounded-full font-bold text-base transition-all whitespace-nowrap"
              style={{
                backgroundColor: activeGroup === group ? '#fbbf24' : '#1e293b',
                color: activeGroup === group ? '#0f172a' : '#94a3b8',
                border: activeGroup === group ? 'none' : '1px solid #334155',
                transform: activeGroup === group ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              Grupo {group}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-amber-400 animate-spin mb-4"></div>
            <p className="text-slate-400">Cargando datos del Grupo {activeGroup}...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tabla de posiciones - Ocupa 2/3 en desktop */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-amber-400">📊</span> Posiciones
              </h2>
              <StandingsTable standings={standings} group={activeGroup} />
            </div>

            {/* Partidos - Ocupa 1/3 en desktop */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-amber-400">⚽</span> Partidos
              </h2>
              
              {matches.length === 0 ? (
                <div className="text-center py-8 text-slate-400 border border-slate-700 rounded-xl border-dashed">
                  No hay partidos programados
                </div>
              ) : (
                <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-thin">
                  {matches.map((match, index) => (
                    <MatchCard 
                      key={match.id} 
                      match={match} 
                      animationDelay={0.1 + (index * 0.1)} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
