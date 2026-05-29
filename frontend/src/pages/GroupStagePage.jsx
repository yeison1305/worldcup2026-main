import { useState, useEffect, useCallback, useMemo } from 'react';
import standingsService from '../services/standings.service';
import matchService from '../services/match.service';
import StandingsTable from '../components/StandingsTable';
import MatchCard from '../components/MatchCard';
import TrophyIcon from '../components/TrophyIcon';

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export default function GroupStagePage() {
  const [activeGroup, setActiveGroup] = useState('A');
  const [standings, setStandings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const fetchAllTeams = useCallback(async () => {
    try {
      const promises = GROUPS.map(g => standingsService.getByGroup(g));
      const results = await Promise.all(promises);
      const teams = [];
      results.forEach((res, i) => {
        const group = GROUPS[i];
        (res.data.standings || []).forEach(team => {
          teams.push({ ...team, group });
        });
      });
      setAllTeams(teams);
    } catch (err) {
      console.error('Error loading all teams:', err);
    }
  }, []);

  useEffect(() => {
    fetchAllTeams();
  }, [fetchAllTeams]);

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
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setShowSearch(true);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const q = query.toLowerCase();
    const results = allTeams.filter(team =>
      team.teamName.toLowerCase().includes(q)
    );

    setSearchResults(results);
  };

  const upcomingMatches = useMemo(() => {
    return matches
      .filter((m) => m.status === 'SCHEDULED')
      .sort((a, b) => new Date(a.match_date) - new Date(b.match_date));
  }, [matches]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a' }}>
      {/* Header */}
      <header 
        className="px-8 py-6"
        style={{ 
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          borderBottom: '1px solid #334155'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <TrophyIcon />
              <div>
                <h1 className="font-bold text-3xl mb-1" style={{ color: '#fbbf24' }}>FIFA World Cup 2026</h1>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Fase de Grupos</p>
              </div>
            </div>
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800"
              style={{ border: '1px solid #334155', color: '#cbd5e1' }}
            >
              Volver
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar equipo..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowSearch(true)}
              className="block w-full pl-10 pr-10 py-2 rounded-lg text-sm text-white placeholder-slate-500"
              style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSearchResults([]); setShowSearch(false); }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            )}

            {/* Search Results Overlay */}
            {showSearch && searchQuery.length >= 2 && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSearch(false)} />
                <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-xl border p-2"
                  style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                >
                  {searchResults.length === 0 ? (
                    <p className="text-slate-500 text-sm px-3 py-4 text-center">No se encontraron equipos</p>
                  ) : (
                    searchResults.map((team) => (
                      <button
                        key={team.teamId}
                        onClick={() => {
                          handleGroupChange(team.group);
                          setSearchQuery('');
                          setSearchResults([]);
                          setShowSearch(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all hover:bg-slate-800"
                      >
                        {team.teamFlagUrl && (
                          <img src={team.teamFlagUrl} alt="" className="w-6 h-4 object-cover rounded-sm" />
                        )}
                        <span className="text-sm text-white flex-1">{team.teamName}</span>
                        <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: '#fbbf2420', color: '#fbbf24' }}>
                          Grupo {team.group}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 pt-6">
        {/* Group Selector - 2 rows of 6 */}
        <div className="mb-8">
          <div className="grid grid-cols-6 gap-2">
            {GROUPS.slice(0, 6).map((group) => (
              <button
                key={group}
                onClick={() => handleGroupChange(group)}
                className="py-2.5 rounded-xl font-bold text-sm transition-all"
                style={{
                  backgroundColor: activeGroup === group ? '#fbbf24' : '#1e293b',
                  color: activeGroup === group ? '#0f172a' : '#94a3b8',
                  border: activeGroup === group ? '2px solid #fbbf24' : '1px solid #334155',
                  transform: activeGroup === group ? 'scale(1.03)' : 'scale(1)',
                }}
              >
                <span className="text-xs text-slate-500 block">Grupo</span>
                {group}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-2 mt-2">
            {GROUPS.slice(6, 12).map((group) => (
              <button
                key={group}
                onClick={() => handleGroupChange(group)}
                className="py-2.5 rounded-xl font-bold text-sm transition-all"
                style={{
                  backgroundColor: activeGroup === group ? '#fbbf24' : '#1e293b',
                  color: activeGroup === group ? '#0f172a' : '#94a3b8',
                  border: activeGroup === group ? '2px solid #fbbf24' : '1px solid #334155',
                  transform: activeGroup === group ? 'scale(1.03)' : 'scale(1)',
                }}
              >
                <span className="text-xs text-slate-500 block">Grupo</span>
                {group}
              </button>
            ))}
          </div>
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
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Tabla de posiciones - Ocupa 2/3 en desktop */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-amber-400">📊</span> Posiciones — Grupo {activeGroup}
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

            {/* Upcoming matches for the selected group */}
            {upcomingMatches.length > 0 && (
              <section className="mt-10">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-amber-400">📅</span> Próximos partidos — Grupo {activeGroup}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingMatches.map((match) => (
                    <div
                      key={match.id}
                      className="rounded-xl p-4 transition-all hover:scale-[1.02] cursor-pointer"
                      style={{
                        background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                        border: '1px solid #334155',
                      }}
                      onClick={() => window.location.href = `/matches/${match.id}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">
                          {new Date(match.match_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {match.round_number && (
                          <span className="text-xs text-slate-600">Jornada {match.round_number}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {match.home_team?.flag_url ? (
                            <img src={match.home_team.flag_url} alt="" className="w-5 h-3.5 object-cover rounded-sm" />
                          ) : (
                            <span className="text-xs">🏳️</span>
                          )}
                          <span className="text-sm font-semibold text-white">{match.home_team?.name}</span>
                        </div>
                        <span className="text-sm text-slate-500 mx-2">vs</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{match.away_team?.name}</span>
                          {match.away_team?.flag_url ? (
                            <img src={match.away_team.flag_url} alt="" className="w-5 h-3.5 object-cover rounded-sm" />
                          ) : (
                            <span className="text-xs">🏳️</span>
                          )}
                        </div>
                      </div>
                      {match.stadium && (
                        <div className="mt-2 pt-2 text-xs text-slate-600" style={{ borderTop: '1px solid rgba(51,65,85,0.3)' }}>
                          🏟️ {match.stadium}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
