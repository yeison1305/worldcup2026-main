import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function useNotifications() {
  const [permission, setPermission] = useState('default');
  const prevRef = useRef({ matchIds: new Set(), scores: {} });

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) return 'unsupported';
    const p = await Notification.requestPermission();
    setPermission(p);
    return p;
  };

  const notify = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try { new Notification(title, { body }); } catch (e) {}
    }
  };

  useEffect(() => {
    if (permission !== 'granted') return;

    const check = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/matches/live/status');
        const active = res.data?.data?.active || [];
        const prev = prevRef.current;
        const curIds = new Set();

        if (active.length === 0) {
          const finishedIds = [...prev.matchIds].filter(id => !curIds.has(id));
          for (const id of finishedIds) {
            notify('🏁 Partido finalizado', 'El partido ha terminado');
          }
          prevRef.current = { matchIds: new Set(), scores: {} };
          return;
        }

          for (const m of active) {
          curIds.add(m.matchId);

          if (!prev.matchIds.has(m.matchId)) {
            notify('🔥 ¡Partido en vivo!', `${m.homeName} vs ${m.awayName}`);
            prev.scores[m.matchId] = `${m.homeScore}-${m.awayScore}`;
          } else {
            const prevScore = prev.scores[m.matchId] || '0-0';
            const curScore = `${m.homeScore}-${m.awayScore}`;
            if (prevScore !== curScore) {
              notify('⚽ ¡GOL!', `${m.homeName} ${m.homeScore}-${m.awayScore} ${m.awayName} · Min ${m.minute}`);
              prev.scores[m.matchId] = curScore;
            }
          }
        }

        for (const id of prev.matchIds) {
          if (!curIds.has(id)) {
            notify('🏁 Partido finalizado', 'El partido ha terminado');
          }
        }

        prevRef.current = { ...prevRef.current, matchIds: curIds };
      } catch (e) {}
    };

    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, [permission]);

  return { permission, requestPermission };
}
