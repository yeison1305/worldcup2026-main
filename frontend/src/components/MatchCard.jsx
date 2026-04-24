import { useMemo } from 'react';

/**
 * MatchCard — Tarjeta visual de un partido
 * Muestra equipo local vs visitante, marcador, fecha, estadio y estado
 */
export default function MatchCard({ match, animationDelay = 0 }) {
  const formattedDate = useMemo(() => {
    if (!match.match_date) return 'Por definir';
    return new Date(match.match_date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [match.match_date]);

  const statusConfig = useMemo(() => {
    const configs = {
      SCHEDULED: { label: 'Programado', color: '#64748b', bg: 'rgba(100, 116, 139, 0.2)' },
      LIVE: { label: '🔴 EN VIVO', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)', animated: true },
      FINISHED: { label: 'Finalizado', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.2)' },
    };
    return configs[match.status] || configs.SCHEDULED;
  }, [match.status]);

  const homeTeam = match.home_team || {};
  const awayTeam = match.away_team || {};

  return (
    <div
      className="rounded-xl p-5 transition-all hover:scale-[1.02]"
      style={{
        background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
        border: match.status === 'LIVE' ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid #334155',
        animation: statusConfig.animated
          ? 'pulse-glow 2s ease-in-out infinite'
          : `fadeIn 0.4s ease-out ${animationDelay}s forwards`,
        opacity: statusConfig.animated ? 1 : 0,
      }}
    >
      {/* Header: estado + jornada */}
      <div className="flex justify-between items-center mb-4">
        <span
          className="px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}
        >
          {statusConfig.label}
        </span>
        {match.round_number && (
          <span className="text-xs text-slate-500">Jornada {match.round_number}</span>
        )}
      </div>

      {/* Equipos y marcador */}
      <div className="flex items-center justify-between gap-3">
        {/* Equipo Local */}
        <div className="flex-1 text-center">
          <div className="flex flex-col items-center gap-2">
            {homeTeam.flag_url ? (
              <img
                src={homeTeam.flag_url}
                alt={homeTeam.name}
                className="w-10 h-7 object-cover rounded-sm shadow-md"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-10 h-7 rounded-sm bg-slate-700 flex items-center justify-center text-xs">🏳️</div>
            )}
            <span className="text-white font-semibold text-sm leading-tight">{homeTeam.name || 'Local'}</span>
          </div>
        </div>

        {/* Marcador */}
        <div className="flex items-center gap-2">
          <span
            className="text-2xl font-bold min-w-[32px] text-center"
            style={{ color: match.status === 'FINISHED' || match.status === 'LIVE' ? '#fff' : '#475569' }}
          >
            {match.status === 'SCHEDULED' ? '-' : match.home_score}
          </span>
          <span className="text-slate-500 text-lg font-light">:</span>
          <span
            className="text-2xl font-bold min-w-[32px] text-center"
            style={{ color: match.status === 'FINISHED' || match.status === 'LIVE' ? '#fff' : '#475569' }}
          >
            {match.status === 'SCHEDULED' ? '-' : match.away_score}
          </span>
        </div>

        {/* Equipo Visitante */}
        <div className="flex-1 text-center">
          <div className="flex flex-col items-center gap-2">
            {awayTeam.flag_url ? (
              <img
                src={awayTeam.flag_url}
                alt={awayTeam.name}
                className="w-10 h-7 object-cover rounded-sm shadow-md"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-10 h-7 rounded-sm bg-slate-700 flex items-center justify-center text-xs">🏳️</div>
            )}
            <span className="text-white font-semibold text-sm leading-tight">{awayTeam.name || 'Visitante'}</span>
          </div>
        </div>
      </div>

      {/* Footer: fecha y estadio */}
      <div className="mt-4 pt-3 flex flex-col gap-1" style={{ borderTop: '1px solid rgba(51, 65, 85, 0.5)' }}>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formattedDate}</span>
        </div>
        {match.stadium && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{match.stadium}{match.location ? `, ${match.location}` : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}
