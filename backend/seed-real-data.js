const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zrpmibwlmvsyfavbqdxd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpycG1pYndsbXZzeWZhdmJxZHhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE4MTkyMiwiZXhwIjoyMDkwNzU3OTIyfQ.PzLA-uEd0vFIkBJgrZxhrFM-lR5lN-eXUf7FzreYb9M';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TEAMS = {
  A: ['Mexico', 'South Africa', 'South Korea', 'Czech Republic'],
  B: ['Canada', 'Bosnia and Herzegovina', 'Qatar', 'Switzerland'],
  C: ['Brazil', 'Morocco', 'Haiti', 'Scotland'],
  D: ['United States', 'Paraguay', 'Australia', 'Turkey'],
  E: ['Germany', 'Curacao', 'Ivory Coast', 'Ecuador'],
  F: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'],
  G: ['Belgium', 'Egypt', 'Iran', 'New Zealand'],
  H: ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'],
  I: ['France', 'Senegal', 'Iraq', 'Norway'],
  J: ['Argentina', 'Algeria', 'Austria', 'Jordan'],
  K: ['Portugal', 'DR Congo', 'Uzbekistan', 'Colombia'],
  L: ['England', 'Croatia', 'Ghana', 'Panama'],
};

const FLAGS = {
  'Mexico': '🇲🇽', 'South Africa': '🇿🇦', 'South Korea': '🇰🇷', 'Czech Republic': '🇨🇿',
  'Canada': '🇨🇦', 'Bosnia and Herzegovina': '🇧🇦', 'Qatar': '🇶🇦', 'Switzerland': '🇨🇭',
  'Brazil': '🇧🇷', 'Morocco': '🇲🇦', 'Haiti': '🇭🇹', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'United States': '🇺🇸', 'Paraguay': '🇵🇾', 'Australia': '🇦🇺', 'Turkey': '🇹🇷',
  'Germany': '🇩🇪', 'Curacao': '🇨🇼', 'Ivory Coast': '🇨🇮', 'Ecuador': '🇪🇨',
  'Netherlands': '🇳🇱', 'Japan': '🇯🇵', 'Sweden': '🇸🇪', 'Tunisia': '🇹🇳',
  'Belgium': '🇧🇪', 'Egypt': '🇪🇬', 'Iran': '🇮🇷', 'New Zealand': '🇳🇿',
  'Spain': '🇪🇸', 'Cape Verde': '🇨🇻', 'Saudi Arabia': '🇸🇦', 'Uruguay': '🇺🇾',
  'France': '🇫🇷', 'Senegal': '🇸🇳', 'Iraq': '🇮🇶', 'Norway': '🇳🇴',
  'Argentina': '🇦🇷', 'Algeria': '🇩🇿', 'Austria': '🇦🇹', 'Jordan': '🇯🇴',
  'Portugal': '🇵🇹', 'DR Congo': '🇨🇩', 'Uzbekistan': '🇺🇿', 'Colombia': '🇨🇴',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Croatia': '🇭🇷', 'Ghana': '🇬🇭', 'Panama': '🇵🇦',
};

const MATCHES = [
  // Matchday 1
  ['2026-06-11T20:00:00', 'Mexico', 'South Africa', 'Estadio Azteca', 'Mexico City', 'A'],
  ['2026-06-11T22:00:00', 'South Korea', 'Czech Republic', 'Estadio Akron', 'Zapopan', 'A'],
  ['2026-06-12T20:00:00', 'Canada', 'Bosnia and Herzegovina', 'BMO Field', 'Toronto', 'B'],
  ['2026-06-13T16:00:00', 'Qatar', 'Switzerland', "Levi's Stadium", 'Santa Clara', 'B'],
  ['2026-06-13T20:00:00', 'Brazil', 'Morocco', 'MetLife Stadium', 'East Rutherford', 'C'],
  ['2026-06-13T22:00:00', 'Haiti', 'Scotland', 'Gillette Stadium', 'Foxborough', 'C'],
  ['2026-06-12T22:00:00', 'United States', 'Paraguay', 'SoFi Stadium', 'Inglewood', 'D'],
  ['2026-06-13T18:00:00', 'Australia', 'Turkey', 'BC Place', 'Vancouver', 'D'],
  ['2026-06-14T16:00:00', 'Germany', 'Curacao', 'NRG Stadium', 'Houston', 'E'],
  ['2026-06-14T18:00:00', 'Ivory Coast', 'Ecuador', 'Lincoln Financial Field', 'Philadelphia', 'E'],
  ['2026-06-14T20:00:00', 'Netherlands', 'Japan', 'AT&T Stadium', 'Arlington', 'F'],
  ['2026-06-14T22:00:00', 'Sweden', 'Tunisia', 'Estadio BBVA', 'Guadalupe', 'F'],
  ['2026-06-15T16:00:00', 'Belgium', 'Egypt', 'Lumen Field', 'Seattle', 'G'],
  ['2026-06-15T18:00:00', 'Iran', 'New Zealand', 'SoFi Stadium', 'Inglewood', 'G'],
  ['2026-06-15T20:00:00', 'Spain', 'Cape Verde', 'Mercedes-Benz Stadium', 'Atlanta', 'H'],
  ['2026-06-15T22:00:00', 'Saudi Arabia', 'Uruguay', 'Hard Rock Stadium', 'Miami Gardens', 'H'],
  ['2026-06-16T20:00:00', 'France', 'Senegal', 'MetLife Stadium', 'East Rutherford', 'I'],
  ['2026-06-16T22:00:00', 'Iraq', 'Norway', 'Gillette Stadium', 'Foxborough', 'I'],
  ['2026-06-16T18:00:00', 'Argentina', 'Algeria', 'Arrowhead Stadium', 'Kansas City', 'J'],
  ['2026-06-16T16:00:00', 'Austria', 'Jordan', "Levi's Stadium", 'Santa Clara', 'J'],
  ['2026-06-17T20:00:00', 'Portugal', 'DR Congo', 'NRG Stadium', 'Houston', 'K'],
  ['2026-06-17T22:00:00', 'Uzbekistan', 'Colombia', 'Estadio Azteca', 'Mexico City', 'K'],
  ['2026-06-17T18:00:00', 'England', 'Croatia', 'AT&T Stadium', 'Arlington', 'L'],
  ['2026-06-17T16:00:00', 'Ghana', 'Panama', 'BMO Field', 'Toronto', 'L'],
  // Matchday 2
  ['2026-06-18T20:00:00', 'Czech Republic', 'South Africa', 'Mercedes-Benz Stadium', 'Atlanta', 'A'],
  ['2026-06-18T22:00:00', 'Mexico', 'South Korea', 'Estadio Akron', 'Zapopan', 'A'],
  ['2026-06-18T18:00:00', 'Switzerland', 'Bosnia and Herzegovina', 'SoFi Stadium', 'Inglewood', 'B'],
  ['2026-06-18T16:00:00', 'Canada', 'Qatar', 'BC Place', 'Vancouver', 'B'],
  ['2026-06-19T18:00:00', 'Scotland', 'Morocco', 'Gillette Stadium', 'Foxborough', 'C'],
  ['2026-06-19T20:00:00', 'Brazil', 'Haiti', 'Lincoln Financial Field', 'Philadelphia', 'C'],
  ['2026-06-19T22:00:00', 'United States', 'Australia', 'Lumen Field', 'Seattle', 'D'],
  ['2026-06-19T16:00:00', 'Turkey', 'Paraguay', "Levi's Stadium", 'Santa Clara', 'D'],
  ['2026-06-20T18:00:00', 'Germany', 'Ivory Coast', 'BMO Field', 'Toronto', 'E'],
  ['2026-06-20T20:00:00', 'Ecuador', 'Curacao', 'Arrowhead Stadium', 'Kansas City', 'E'],
  ['2026-06-20T16:00:00', 'Netherlands', 'Sweden', 'NRG Stadium', 'Houston', 'F'],
  ['2026-06-20T22:00:00', 'Tunisia', 'Japan', 'Estadio BBVA', 'Guadalupe', 'F'],
  ['2026-06-21T16:00:00', 'Belgium', 'Iran', 'SoFi Stadium', 'Inglewood', 'G'],
  ['2026-06-21T18:00:00', 'New Zealand', 'Egypt', 'BC Place', 'Vancouver', 'G'],
  ['2026-06-21T20:00:00', 'Spain', 'Saudi Arabia', 'Mercedes-Benz Stadium', 'Atlanta', 'H'],
  ['2026-06-21T22:00:00', 'Uruguay', 'Cape Verde', 'Hard Rock Stadium', 'Miami Gardens', 'H'],
  ['2026-06-22T20:00:00', 'France', 'Iraq', 'Lincoln Financial Field', 'Philadelphia', 'I'],
  ['2026-06-22T22:00:00', 'Norway', 'Senegal', 'MetLife Stadium', 'East Rutherford', 'I'],
  ['2026-06-22T18:00:00', 'Argentina', 'Austria', 'AT&T Stadium', 'Arlington', 'J'],
  ['2026-06-22T16:00:00', 'Jordan', 'Algeria', "Levi's Stadium", 'Santa Clara', 'J'],
  ['2026-06-23T20:00:00', 'Portugal', 'Uzbekistan', 'NRG Stadium', 'Houston', 'K'],
  ['2026-06-23T22:00:00', 'Colombia', 'DR Congo', 'Estadio Akron', 'Zapopan', 'K'],
  ['2026-06-23T18:00:00', 'England', 'Ghana', 'Gillette Stadium', 'Foxborough', 'L'],
  ['2026-06-23T16:00:00', 'Panama', 'Croatia', 'BMO Field', 'Toronto', 'L'],
  // Matchday 3
  ['2026-06-24T16:00:00', 'Czech Republic', 'Mexico', 'Estadio Azteca', 'Mexico City', 'A'],
  ['2026-06-24T16:00:00', 'South Africa', 'South Korea', 'Estadio BBVA', 'Guadalupe', 'A'],
  ['2026-06-24T20:00:00', 'Switzerland', 'Canada', 'BC Place', 'Vancouver', 'B'],
  ['2026-06-24T20:00:00', 'Bosnia and Herzegovina', 'Qatar', 'Lumen Field', 'Seattle', 'B'],
  ['2026-06-24T22:00:00', 'Scotland', 'Brazil', 'Hard Rock Stadium', 'Miami Gardens', 'C'],
  ['2026-06-24T22:00:00', 'Morocco', 'Haiti', 'Mercedes-Benz Stadium', 'Atlanta', 'C'],
  ['2026-06-25T16:00:00', 'Turkey', 'United States', 'SoFi Stadium', 'Inglewood', 'D'],
  ['2026-06-25T16:00:00', 'Paraguay', 'Australia', "Levi's Stadium", 'Santa Clara', 'D'],
  ['2026-06-25T20:00:00', 'Curacao', 'Ivory Coast', 'Lincoln Financial Field', 'Philadelphia', 'E'],
  ['2026-06-25T20:00:00', 'Ecuador', 'Germany', 'MetLife Stadium', 'East Rutherford', 'E'],
  ['2026-06-25T22:00:00', 'Japan', 'Sweden', 'AT&T Stadium', 'Arlington', 'F'],
  ['2026-06-25T22:00:00', 'Tunisia', 'Netherlands', 'Arrowhead Stadium', 'Kansas City', 'F'],
  ['2026-06-26T16:00:00', 'Egypt', 'Iran', 'Lumen Field', 'Seattle', 'G'],
  ['2026-06-26T16:00:00', 'New Zealand', 'Belgium', 'BC Place', 'Vancouver', 'G'],
  ['2026-06-26T20:00:00', 'Cape Verde', 'Saudi Arabia', 'NRG Stadium', 'Houston', 'H'],
  ['2026-06-26T20:00:00', 'Uruguay', 'Spain', 'Estadio Akron', 'Zapopan', 'H'],
  ['2026-06-26T22:00:00', 'Norway', 'France', 'Gillette Stadium', 'Foxborough', 'I'],
  ['2026-06-26T22:00:00', 'Senegal', 'Iraq', 'BMO Field', 'Toronto', 'I'],
  ['2026-06-27T16:00:00', 'Algeria', 'Austria', 'Arrowhead Stadium', 'Kansas City', 'J'],
  ['2026-06-27T16:00:00', 'Jordan', 'Argentina', 'AT&T Stadium', 'Arlington', 'J'],
  ['2026-06-27T20:00:00', 'Colombia', 'Portugal', 'Hard Rock Stadium', 'Miami Gardens', 'K'],
  ['2026-06-27T20:00:00', 'DR Congo', 'Uzbekistan', 'Mercedes-Benz Stadium', 'Atlanta', 'K'],
  ['2026-06-27T22:00:00', 'Panama', 'England', 'MetLife Stadium', 'East Rutherford', 'L'],
  ['2026-06-27T22:00:00', 'Croatia', 'Ghana', 'Lincoln Financial Field', 'Philadelphia', 'L'],
];

async function seed() {
  console.log('Inserting teams...');
  
  const teamMap = {};
  
  for (const [group, names] of Object.entries(TEAMS)) {
    for (const name of names) {
      const flag = FLAGS[name] || '';
      const { data, error } = await supabase
        .from('teams')
        .insert({ name, group_letter: group, flag_url: flag, is_active: true })
        .select('id, name')
        .single();
      
      if (error) {
        console.error(`Error inserting ${name}:`, error.message);
      } else {
        teamMap[name] = data.id;
      }
    }
  }
  
  console.log(`Inserted ${Object.keys(teamMap).length} teams`);
  
  console.log('Inserting matches...');
  
  const rounds = {};
  for (const m of MATCHES) {
    const g = m[5];
    if (!rounds[g]) rounds[g] = 0;
    rounds[g]++;
    const roundNum = Math.ceil(rounds[g] / 2);
    
    const homeId = teamMap[m[1]];
    const awayId = teamMap[m[2]];
    
    if (!homeId || !awayId) {
      console.error(`Missing team: ${m[1]} or ${m[2]}`);
      continue;
    }
    
    const { error } = await supabase.from('matches').insert({
      home_team_id: homeId,
      away_team_id: awayId,
      phase: 'GROUP',
      group_letter: g,
      round_number: roundNum,
      match_date: m[0],
      stadium: m[3],
      location: m[4],
      status: 'SCHEDULED',
      home_score: null,
      away_score: null,
    });
    
    if (error) console.error(`Error inserting match ${m[1]} vs ${m[2]}:`, error.message);
  }
  
  console.log(`Inserted ${MATCHES.length} matches`);
}

seed().then(() => console.log('Done!')).catch(console.error);
