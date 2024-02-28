---
toc: false
---

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 2rem 0 6rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 2rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1.15;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>

<div class="hero">
  <h1>Wieler<wbr>manager-manager</h1>
  <h2>Pedaling through the data. Insights to lead the pack.</h2>
</div>

```js
// add a fake import to trigger the dataloader for the data
FileAttachment("data/data.json");
const {riders, results, races, pastRaces, teams} = await FileAttachment("data/data.json?version=5").json();
```

```js
function scatter({width} = {}) {
  return Plot.plot({
    title: "🚴 Wie pakte punten in de openingskoersen?",
    width,
    height: 500,
    grid: true,
    x: {label: "Waarde (miljoen)"},
    y: {label: "Punten"},
    color: {scheme: "Turbo", label: "Totaal aantal punten"},
    marks: [
      Plot.dot(riders, {
        x: "value",
        y: "total",
        stroke: "total",
        channels: {Naam: "name", Team: "team", Waarde: "value"},
        tip: {format: {Naam: true, Team: true, Waarde: d => `${d} miljoen`, stroke: true, x: false, y: false}}
      })
    ]
  });
}
```
<div class="card">
  ${resize((width) => scatter({width}))}
</div>

```js
function byTeam({width} = {}) {
  return Plot.plot({
    title: "🚴 Welk team scoorde het best?",
    marginLeft: 160,
    width,
    height: 700,
    grid: false,
    x: {
      axis: "top",
      label: "Totaal aantal punten",
      grid: true
    },
    y: {
      label: null
    },
    color: {
      scheme: "blues", domain: [0, 12], range: [0.3, 1]
    },
    marks: [
      Plot.ruleX([0]),
      Plot.ruleY(riders, Plot.groupY({x1: "min", x2: "max"}, {x: "total", y: "team", sort: {y: "-x2"}})),
      Plot.dot(riders, {x: "total", y: "team", fill: "value", channels: {Naam: "name", Team: "team", Waarde: "value"},
        tip: {format: {Naam: true, Team: true, Waarde: d => `${d} miljoen`, fill: false, x: true, y: false}}})
    ]
  });
}
```

```js
function byValue({width} = {}) {
  return Plot.plot({
    title: "🚴 Wie is zijn geld waard?",
    marginLeft: 140,
    width,
    height: 700,
    x: {axis: "top", grid: true, label: "Punten per miljoen"},
    y: {label: null},
    color: {scheme: "blues", label: "Waarde (miljoen)", domain: [0, 12], range: [0.3, 1]},
    marks: [
      Plot.barX(riders, {x: "valueForMoney", y: "name", fill: "value", sort: {y: "-x", limit: 36}, channels: {Naam: "name", Team: "team", Waarde: "value", Totaal: "total"} ,tip: {format: {Naam: true, Team: true, Waarde: d => `${d} miljoen`, fill: false, x: true, Totaal: d => `${d} punten`, y: false}}}),
      Plot.ruleX([0])
    ]
  });
}
```

<div class="grid grid-cols-2">
  <div class="card">
    ${resize((width) => byTeam({width}))}
  </div>
  <div class="card">
    ${resize((width) => byValue({width}))}
  </div>
</div>

```js
function pointsByRace({width} = {}) {
  return Plot.plot({
    width,
    marginLeft: 140,
    x: {axis: "top", grid: true, label: "Aantal punten"},
    y: {label: null},
    color: {scheme: "observable10", label: "Race", legend: true, domain: pastRaces.map(r => r.name)},
    marks: [
      Plot.rectX(results.filter(r => teamFilter === "Alle teams" ? true : r.team === teamFilter), {
        x: "points",
        y: "name",
        fill: "race",
        sort: {y: "-x", limit: teamFilter === "Alle teams" ? 20 : 100},
        channels: {Naam: "name", Team: "team", Waarde: "value", Totaal: "total"} ,
        tip: {format: {Naam: true, Team: true, Waarde: d => `${d} miljoen`, Totaal: d => `${d} punten`, fill: true, x: true, y: false}}
      }),
      Plot.ruleX([0])
    ]
  });
}
```

```js
const teamFilterSelect = Inputs.select(["Alle teams", ...teams.map(t => t.name)], {label: null});
const teamFilter = Generators.input(teamFilterSelect);
```

<div class="card">
  <div style="display: flex; justify-content: space-between; flex-wrap: wrap; align-items: flex-end">
    <h2>🚴 Waar verzamelden de renners hun punten?</h2>
    ${teamFilterSelect}
  </div>
  ${resize((width) => pointsByRace({width}))}
</div>
