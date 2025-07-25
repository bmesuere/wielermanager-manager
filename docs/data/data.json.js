// fetch data
const response = await fetch("https://fanarena.s3.amazonaws.com/data_TOUR_2025_full.json");
if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
const allData = await response.json();

// extract races
const races = allData.matches.map(race => ({ id: race.id, order: race.weekId, name: race.feedUrl + " " + type2emoji(race.type), type: race.type, date: race.date }));
const pastRaces = races.filter(race => new Date(race.date) < Date.now());

// extract teams
const teams = allData.clubs.map(team => ({ id: team.id, name: team.name.split(" - ").slice(0, 2).join(" - ") }));

// extract riders
const riders = allData.players.filter(d => d.active == 1).map(rider => {
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
  return { name: rider.name, team: team.name, teamId: team.id, value: rider.value, total, valueForMoney: total / rider.value, results };
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
      teamId: rider.teamId,
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

function type2emoji(type) {
  if (type === "monument") return "🥇";
  if (type === "wt") return "🥈";
  if (type === "nwt") return "🥉";
  if (type === "hills") return "⛰️";
  if (type === "mountains") return "⛰️⛰️";
  if (type === "flat") return "🏁";
  if (type === "time") return "⏱️";
  return "";
}
