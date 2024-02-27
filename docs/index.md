---
toc: false
---

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
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
  <h1>Wielermanager-manager</h1>
  <h2>Pedaling through the data. Insights to lead the pack.</h2>
</div>

```js
const {riders, races, teams} = await FileAttachment("data/data.json").json();
```

```js
function scatter({width} = {}) {
  return Plot.plot({
    title: "🚴 Wie pakte punten in het openingsweekend?",
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
