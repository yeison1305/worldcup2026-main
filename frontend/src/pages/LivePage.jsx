import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import matchService from '../services/match.service';
import predictionService from '../services/prediction.service';
import axios from 'axios';
import TrophyIcon from '../components/TrophyIcon';

const REFRESH_INTERVAL = 5000;

export default function LivePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [notifPermission, setNotifPermission] = useState('default');
  const intervalRef = useRef(null);
  const prevIdsRef = useRef(new Set());
  const prevGoalsRef = useRef({});

  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Tu navegador no soporta notificaciones');
      return;
    }
    try {
      const p = await Notification.requestPermission();
      setNotifPermission(p);
      if (p === 'granted') {
        new Notification('✅ Funciona', { body: 'Notificaciones activadas correctamente' });
      } else {
        alert('Permiso denegado. Activalo manualmente en la configuración del navegador.');
      }
    } catch (err) {
      alert('Error al pedir permiso: ' + err.message);
    }
  };

  const checkAndNotify = useCallback((newLive) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    if (newLive.length === 0) return;

    const prevIds = prevIdsRef.current;
    const prevGoals = prevGoalsRef.current;
    const currentIds = new Set();
    const currentGoals = {};

    for (const m of newLive) {
      currentIds.add(m.id);
      const goals = (m.events || []).filter(e => e.event_type === 'GOAL').length;
      currentGoals[m.id] = goals;

      if (!prevIds.has(m.id)) {
        new Notification('🔥 ¡Partido en vivo!', {
          body: `${m.home_team?.name || 'Local'} vs ${m.away_team?.name || 'Visitante'}`,
        });
      } else if (goals > (prevGoals[m.id] || 0)) {
        new Notification('⚽ ¡GOL!', {
          body: `${m.home_score}-${m.away_score} · Min ${m._minute || '?'}`,
        });
      }
    }

    for (const id of prevIds) {
      if (!currentIds.has(id)) {
        new Notification('🏁 Partido finalizado', { body: 'El partido ha terminado' });
      }
    }

    prevIdsRef.current = currentIds;
    prevGoalsRef.current = currentGoals;
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await matchService.getAll();
      const all = res.data.matches || [];

      let liveStatus = {};
      try {
        const statusRes = await axios.get('http://localhost:3000/api/matches/live/status');
        for (const s of statusRes.data.data?.active || []) {
          liveStatus[s.matchId] = s;
        }
      } catch (e) { /* ignore */ }

      const live = [];
      for (const m of all.filter(m => m.status === 'LIVE')) {
        try {
          const eventsRes = await axios.get(`http://localhost:3000/api/matches/${m.id}/events`);
          live.push({
            ...m,
            events: eventsRes.data.data?.events || [],
            prediction: null,
            _minute: liveStatus[m.id]?.minute || 0,
          });
        } catch (e) {
          live.push({ ...m, events: [], prediction: null, _minute: liveStatus[m.id]?.minute || 0 });
        }
      }

      const upcoming = all
        .filter(m => m.status === 'SCHEDULED')
        .sort((a, b) => new Date(a.match_date) - new Date(b.match_date))
        .slice(0, 10);

      for (const m of upcoming) {
        try {
          const predRes = await predictionService.getByMatch(m.id);
          m.prediction = predRes.data?.prediction || null;
        } catch (e) { /* no prediction */ }
      }

      checkAndNotify(live);
      setLiveMatches(live);
      setUpcomingMatches(upcoming);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Live error:', err);
    } finally {
      setLoading(false);
    }
  }, [checkAndNotify]);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchData]);

  const handleSimulate = async (matchId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:3000/api/matches/${matchId}/simulate/start`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      console.error('Simulate error:', err);
    }
  };

  const countdown = (dateStr) => {
    const now = new Date();
    const diff = new Date(dateStr) - now;
    if (diff <= 0) return 'Ya';
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `${days}d ${hours}h`;
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#0f172a' }}>
        <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-red-500 animate-spin mb-4" />
        <p className="text-slate-400">Conectando al live mode...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a' }}>
      <header
        className="px-8 py-6"
        style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', borderBottom: '1px solid #334155' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <TrophyIcon />
              {liveMatches.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-pulse" />}
            </div>
            <div>
              <h1 className="font-bold text-3xl mb-1" style={{ color: '#fbbf24' }}>Live Mode</h1>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Actualizando cada {REFRESH_INTERVAL / 1000}s · {lastUpdate.toLocaleTimeString('es-ES')}
                {notifPermission === 'granted' && <span className="text-green-400 ml-1">🔔 ON</span>}
                {notifPermission === 'denied' && <span className="text-red-400 ml-1">🔕 OFF</span>}
                {notifPermission === 'default' && (
                  <button onClick={requestPermission} className="text-amber-400 hover:underline ml-1">🔔 Activar notificaciones</button>
                )}
              </div>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')} className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800"
            style={{ border: '1px solid #334155', color: '#cbd5e1' }}>Dashboard</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {liveMatches.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400">EN VIVO</span>
              <span className="text-sm text-slate-500 font-normal ml-2">{liveMatches.length} partido(s)</span>
            </h2>
            <div className="space-y-4">
              {liveMatches.map((match) => (
                <LiveMatchCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold text-white mb-6">📅 Próximos partidos</h2>
          {upcomingMatches.length === 0 && liveMatches.length === 0 ? (
            <p className="text-slate-400 text-center py-12 border border-slate-700 rounded-xl border-dashed">No hay partidos próximos</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {upcomingMatches.map((m) => (
                <UpcomingCard key={m.id} match={m} countdown={countdown(m.match_date)} isAdmin={user?.role === 'ADMIN'} onSimulate={handleSimulate} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function LiveMatchCard({ match }) {
  const [eventsExpanded, setEventsExpanded] = useState(false);

  const eventIcon = {
    GOAL: '⚽', YELLOW_CARD: '🟨', RED_CARD: '🟥', SUBSTITUTION: '🔄', PENALTY: '⚠️', HALFTIME: '⏸️', FULLTIME: '🏁',
  };

  return (
    <div className="rounded-xl p-5" style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)', border: '1px solid rgba(239,68,68,0.4)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-bold text-red-400 uppercase">Min {match._minute ?? '0'}</span>
        </div>
        <span className="text-xs text-slate-500">{match.group_letter ? `Grupo ${match.group_letter}` : ''}</span>
      </div>

      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          {match.home_team?.flag_url && <img src={match.home_team.flag_url} alt="" className="w-8 h-5 rounded-sm" />}
          <span className="text-lg font-bold text-white">{match.home_team?.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold text-white">{match.home_score ?? 0}</span>
          <span className="text-2xl text-slate-500">-</span>
          <span className="text-4xl font-bold text-white">{match.away_score ?? 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">{match.away_team?.name}</span>
          {match.away_team?.flag_url && <img src={match.away_team.flag_url} alt="" className="w-8 h-5 rounded-sm" />}
        </div>
      </div>

      {match.prediction && (
        <div className="mb-3 text-xs" style={{ color: '#fbbf24' }}>
          🔮 {match.prediction.predicted_winner} ({Number(match.prediction.confidence).toFixed(0)}%)
        </div>
      )}

      {match.events && match.events.length > 0 && (
        <div>
          <button onClick={() => setEventsExpanded(!eventsExpanded)} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            {eventsExpanded ? 'Ocultar' : 'Ver'} {match.events.length} eventos
          </button>
          {eventsExpanded && (
            <div className="mt-2 max-h-48 overflow-y-auto space-y-1.5 p-2 rounded-lg" style={{ backgroundColor: '#0f172a' }}>
              {match.events.map((ev, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="text-slate-600 w-8">{ev.minute}'</span>
                  <span>{eventIcon[ev.event_type] || '•'}</span>
                  <span className="text-slate-300 flex-1">{ev.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UpcomingCard({ match, countdown, isAdmin, onSimulate }) {
  return (
    <div className="rounded-xl p-4 transition-all hover:scale-[1.02] cursor-pointer"
      style={{ background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #334155' }}
      onClick={() => window.location.href = `/matches/${match.id}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500">Grupo {match.group_letter}</span>
        <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: '#fbbf2420', color: '#fbbf24' }}>{countdown}</span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-center flex-1">
          {match.home_team?.flag_url && <img src={match.home_team.flag_url} alt="" className="w-5 h-3.5 rounded-sm mx-auto mb-1" />}
          <span className="text-xs font-semibold text-white">{match.home_team?.name}</span>
        </div>
        <span className="text-lg font-bold text-slate-500 mx-2">vs</span>
        <div className="text-center flex-1">
          {match.away_team?.flag_url && <img src={match.away_team.flag_url} alt="" className="w-5 h-3.5 rounded-sm mx-auto mb-1" />}
          <span className="text-xs font-semibold text-white">{match.away_team?.name}</span>
        </div>
      </div>
      <div className="text-xs text-slate-600 mb-2">
        {new Date(match.match_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        {match.stadium && ` · ${match.stadium.split(' ').pop()}`}
      </div>
      {match.prediction ? (
        <div className="text-xs" style={{ color: '#a78bfa' }}>🔮 {match.prediction.predicted_winner} {Number(match.prediction.confidence).toFixed(0)}%</div>
      ) : <div className="text-xs text-slate-600">Sin predicción</div>}
      {isAdmin && (
        <button onClick={(e) => { e.stopPropagation(); onSimulate(match.id); }}
          className="mt-2 w-full py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80"
          style={{ backgroundColor: '#ef444420', color: '#fca5a5', border: '1px solid #ef444440' }}>
          ▶ Simular en vivo
        </button>
      )}
    </div>
  );
}
