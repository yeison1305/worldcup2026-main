import { useMemo } from 'react';

/**
 * StandingsTable — Tabla de posiciones de un grupo
 * Muestra: Pos, Equipo, PJ, PG, PE, PP, GF, GC, DIF, PTS
 * Los top 2 se destacan en verde (clasificados)
 */
export default function StandingsTable({ standings = [], group = '' }) {
  const sortedStandings = useMemo(() => {
    return [...standings].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
  }, [standings]);

  if (sortedStandings.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        No hay datos de posiciones para este grupo
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid #334155',
        animation: 'fadeIn 0.5s ease-out',
      }}
    >
      {/* Header del grupo */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{ borderBottom: '1px solid #334155' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
          style={{ backgroundColor: '#fbbf24', color: '#0f172a' }}
        >
          {group}
        </div>
        <h3 className="text-white font-semibold text-base">Grupo {group}</h3>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase text-slate-500" style={{ borderBottom: '1px solid #334155' }}>#</th>
              <th className="text-left py-3 px-3 text-xs font-semibold uppercase text-slate-500" style={{ borderBottom: '1px solid #334155' }}>Equipo</th>
              <th className="text-center py-3 px-2 text-xs font-semibold uppercase text-slate-500" style={{ borderBottom: '1px solid #334155' }}>PJ</th>
              <th className="text-center py-3 px-2 text-xs font-semibold uppercase text-slate-500" style={{ borderBottom: '1px solid #334155' }}>PG</th>
              <th className="text-center py-3 px-2 text-xs font-semibold uppercase text-slate-500" style={{ borderBottom: '1px solid #334155' }}>PE</th>
              <th className="text-center py-3 px-2 text-xs font-semibold uppercase text-slate-500" style={{ borderBottom: '1px solid #334155' }}>PP</th>
              <th className="text-center py-3 px-2 text-xs font-semibold uppercase text-slate-500" style={{ borderBottom: '1px solid #334155' }}>GF</th>
              <th className="text-center py-3 px-2 text-xs font-semibold uppercase text-slate-500" style={{ borderBottom: '1px solid #334155' }}>GC</th>
              <th className="text-center py-3 px-2 text-xs font-semibold uppercase text-slate-500" style={{ borderBottom: '1px solid #334155' }}>DIF</th>
              <th className="text-center py-3 px-2 text-xs font-semibold uppercase text-slate-500" style={{ borderBottom: '1px solid #334155' }}>PTS</th>
            </tr>
          </thead>
          <tbody>
            {sortedStandings.map((team, index) => {
              const position = index + 1;
              const isQualified = position <= 2;
              const rowDelay = 0.1 + index * 0.08;

              return (
                <tr
                  key={team.teamId}
                  className="transition-colors hover:bg-slate-800/40"
                  style={{
                    borderBottom: '1px solid rgba(51, 65, 85, 0.5)',
                    animation: `fadeIn 0.4s ease-out ${rowDelay}s forwards`,
                    opacity: 0,
                  }}
                >
                  {/* Posición con indicador de clasificación */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-1 h-6 rounded-full"
                        style={{
                          backgroundColor: isQualified ? '#22c55e' : 'transparent',
                        }}
                      />
                      <span
                        className="font-bold text-sm"
                        style={{ color: isQualified ? '#22c55e' : '#94a3b8' }}
                      >
                        {position}
                      </span>
                    </div>
                  </td>

                  {/* Equipo con bandera */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      {team.teamFlagUrl ? (
                        <img
                          src={team.teamFlagUrl}
                          alt={team.teamName}
                          className="w-7 h-5 object-cover rounded-sm shadow-sm"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-7 h-5 rounded-sm bg-slate-700 flex items-center justify-center text-xs text-slate-400">
                          🏳️
                        </div>
                      )}
                      <span className="text-white font-medium text-sm">{team.teamName}</span>
                    </div>
                  </td>

                  <td className="text-center py-3 px-2 text-slate-300 font-medium">{team.played}</td>
                  <td className="text-center py-3 px-2 text-slate-300">{team.won}</td>
                  <td className="text-center py-3 px-2 text-slate-300">{team.drawn}</td>
                  <td className="text-center py-3 px-2 text-slate-300">{team.lost}</td>
                  <td className="text-center py-3 px-2 text-slate-300">{team.goalsFor}</td>
                  <td className="text-center py-3 px-2 text-slate-300">{team.goalsAgainst}</td>

                  {/* Diferencia de goles con color */}
                  <td className="text-center py-3 px-2 font-semibold" style={{
                    color: team.goalDifference > 0 ? '#22c55e' : team.goalDifference < 0 ? '#ef4444' : '#94a3b8'
                  }}>
                    {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                  </td>

                  {/* Puntos destacados */}
                  <td className="text-center py-3 px-2">
                    <span
                      className="inline-block min-w-[28px] py-0.5 rounded-md font-bold text-sm"
                      style={{
                        backgroundColor: isQualified ? 'rgba(251, 191, 36, 0.2)' : 'transparent',
                        color: isQualified ? '#fbbf24' : '#fff',
                      }}
                    >
                      {team.points}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Leyenda */}
      <div className="px-5 py-2 flex items-center gap-4 text-xs text-slate-500" style={{ borderTop: '1px solid #334155' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e' }} />
          <span>Clasifica a octavos</span>
        </div>
      </div>
    </div>
  );
}
