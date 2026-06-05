import { useNavigate } from 'react-router-dom';
import TrophyIcon from './TrophyIcon';

export default function PageHeader({ title, subtitle, backTo }) {
  const navigate = useNavigate();
  return (
    <header
      className="px-8 py-6"
      style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', borderBottom: '1px solid #334155' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <TrophyIcon />
          <div>
            <h1 className="font-bold text-3xl mb-1" style={{ color: '#fbbf24' }}>FIFA World Cup 2026</h1>
            <p className="text-xs text-slate-400 uppercase tracking-wider">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {title}
          {backTo && (
            <button
              onClick={() => navigate(backTo)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800"
              style={{ border: '1px solid #334155', color: '#cbd5e1' }}
            >
              Volver
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
