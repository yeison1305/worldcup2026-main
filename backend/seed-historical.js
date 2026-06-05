const JAVA_API = process.env.JAVA_API_URL || 'http://localhost:8080/api';

const TEAM_TIERS = {
  'Argentina': 1, 'Brazil': 1, 'France': 1, 'Spain': 1, 'España': 1, 'England': 1,
  'Germany': 1, 'Alemania': 1, 'Netherlands': 1, 'Portugal': 1,
  'Belgium': 2, 'Croatia': 2, 'Croacia': 2, 'Uruguay': 2, 'Colombia': 2, 'Mexico': 2, 'México': 2,
  'Japan': 2, 'Japón': 2, 'South Korea': 2, 'Corea del Sur': 2, 'Morocco': 2, 'Marruecos': 2, 'Senegal': 2,
  'United States': 3, 'Estados Unidos': 3, 'Ecuador': 3, 'Australia': 3, 'Iran': 3, 'Irán': 3,
  'Saudi Arabia': 3, 'Tunisia': 3, 'Sweden': 3, 'Ghana': 3,
  'Norway': 3, 'Austria': 3, 'Ivory Coast': 3, 'Switzerland': 3,
  'Canada': 4, 'Canadá': 4, 'Qatar': 4, 'South Africa': 4,
  'Czech Republic': 4, 'Bosnia and Herzegovina': 4, 'Haiti': 4, 'Scotland': 4, 'Paraguay': 4,
  'Turkey': 4, 'Curacao': 4, 'New Zealand': 4, 'Cape Verde': 4,
  'Iraq': 4, 'Algeria': 4, 'Jordan': 4, 'DR Congo': 4,
  'Uzbekistan': 4, 'Panama': 4, 'Egypt': 3, 'Peru': 3, 'Venezuela': 4, 'Perú': 3,
};

function normalize(name) {
  return (name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getTier(name) {
  const norm = normalize(name);
  for (const [key, val] of Object.entries(TEAM_TIERS)) {
    if (normalize(key) === norm) return val;
  }
  return null;
}

function scoreFromTiers(homeTier, awayTier) {
  const stdScores = {
    1: [2, 3, 1, 0, 0, 4, 2, 1, 3, 0],
    2: [1, 2, 0, 3, 1, 2, 0, 2, 1, 0],
    3: [1, 0, 2, 1, 1, 0, 2, 1, 0, 1],
    4: [0, 1, 0, 1, 1, 0, 0, 1, 0, 0],
  };

  const baseHome = [3, 2, 1, 0][homeTier - 1] || 1;
  const baseAway = [2, 1, 0, 0][awayTier - 1] || 0;

  // Más variabilidad: a veces el equipo débil gana
  const homeBonus = Math.floor(Math.random() * 4);
  const awayBonus = Math.floor(Math.random() * 3);

  const h = Math.max(0, baseHome + homeBonus - Math.floor(Math.random() * 2));
  const a = Math.max(0, baseAway + awayBonus - Math.floor(Math.random() * 2));

  return [h, a];
}

async function main() {
  console.log('Fetching teams from Java API...');
  const teamsRes = await fetch(`${JAVA_API}/teams`);
  const teamsBody = await teamsRes.json();
  const teams = teamsBody.data || [];
  
  if (teams.length === 0) {
    console.log('No teams in Java DB. Sync first.');
    return;
  }

  console.log(`Found ${teams.length} teams`);

  const teamNames = teams.map(t => ({ id: t.id, name: t.name }));
  let count = 0;

  for (const team of teamNames) {
    const tier = getTier(team.name);
    if (!tier) { console.log(`Skip: ${team.name}`); continue; }

    const opponents = teamNames.filter(t => t.id !== team.id);
    const shuffled = opponents.sort(() => Math.random() - 0.5).slice(0, 25);

    for (const opponent of shuffled) {
      const oppTier = getTier(opponent.name);
      if (!oppTier) continue;

      const isHome = Math.random() > 0.5;
      const [hs, as] = isHome ? scoreFromTiers(tier, oppTier) : scoreFromTiers(oppTier, tier);

      try {
        await fetch(`${JAVA_API}/matches`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            homeTeamId: isHome ? team.id : opponent.id,
            awayTeamId: isHome ? opponent.id : team.id,
            homeScore: isHome ? hs : as,
            awayScore: isHome ? as : hs,
            matchDate: new Date(2020, Math.floor(Math.random() * 5), Math.floor(Math.random() * 28) + 1).toISOString(),
          }),
        });
        count++;
      } catch (err) { /* skip duplicates */ }
    }
  }

  console.log(`Inserted ${count} historical matches`);

  console.log('Generating statistics...');
  for (const team of teamNames) {
    try { await fetch(`${JAVA_API}/statistics/${team.id}`); } catch (e) {}
  }

  console.log('Done!');
}

main().catch(console.error);
