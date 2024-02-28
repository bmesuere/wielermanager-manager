// fetch data
const response = await fetch("https://fanarena.s3.amazonaws.com/data_KLASM_2024_static.json");
if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
const allData = await response.json();

// extract races
const races = allData.matches.map(race => ({ id: race.id, order: race.weekId, name: race.feedUrl, type: race.type, date: race.date }));
const pastRaces = races.filter(race => new Date(race.date) < Date.now());

// extract teams
const teams = allData.clubs.map(team => ({ id: team.id, name: team.name }));

// extract riders
const riders = allData.players.map(rider => {
  const results = pastRaces.map(race => {
    const result = rider.stats.find(stat => stat.matchId === race.id);
    if (result) {
      return { race: race.order, result: result.value, points: result.points };
    } else {
      return { race: race.order, result: "DNS", points: 0 };
    }
  });
  const total = results.reduce((sum, result) => sum + result.points, 0);
  const team = teams.find(d => d.id === rider.clubId);
  return { name: rider.name, team: team.name, value: rider.value, total, valueForMoney: total / rider.value, results };
});
riders.sort((a, b) => b.total - a.total);
riders.forEach((rider, i) => rider.position = i);

// create flat results
const results = [];
riders.forEach(rider => {
  rider.results.forEach(result => {
    results.push({
      name: rider.name,
      team: rider.team,
      value: rider.value,
      total: rider.total,
      race: races.find(r => r.order === result.race).name,
      result: result.result,
      points: result.points
    });
  })
})

// output json
process.stdout.write(JSON.stringify({ riders, results, teams, races, pastRaces }));
