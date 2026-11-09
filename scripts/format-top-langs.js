#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseLanguages(filePath) {
  const matches = [];
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const regex1 = /<circle[^>]*\/>\s*<text[^>]*>\s*([A-Za-z0-9_#+.\-/\s]+?)\s+([0-9.]+)%\s*<\/text>/g;
    let match;
    while ((match = regex1.exec(content)) !== null) {
      matches.push({ name: match[1].trim(), pct: parseFloat(match[2]) });
    }
  } catch {}

  if (matches.length === 0) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const regex2 = /class="lang-name">\s*([A-Za-z0-9_#+.\-/\s]+?)\s*<tspan[^>]*>\s*([0-9.]+)%\s*<\/tspan>/g;
      let match;
      while ((match = regex2.exec(content)) !== null) {
        matches.push({ name: match[1].trim(), pct: parseFloat(match[2]) });
      }
    } catch {}
  }

  if (matches.length === 0) {
    return [
      { name: 'TypeScript', pct: 48.36 },
      { name: 'PHP', pct: 39.54 },
      { name: 'Blade', pct: 10.82 },
      { name: 'CSS', pct: 0.83 },
      { name: 'JavaScript', pct: 0.16 },
      { name: 'Shell', pct: 0.13 },
      { name: 'Dockerfile', pct: 0.11 },
      { name: 'HTML', pct: 0.05 }
    ];
  }

  // De-duplicate and sort descending by percentage
  const map = new Map();
  for (const m of matches) {
    if (!map.has(m.name) || map.get(m.name).pct < m.pct) {
      map.set(m.name, m);
    }
  }
  const result = Array.from(map.values());
  result.sort((a, b) => b.pct - a.pct);
  return result;
}

function renderSvg(theme, langs) {
  const isDark = (theme === 'dark');
  const headerFill = isDark ? '#e6edf3' : '#0d1117';
  const textFill = isDark ? '#8b949e' : '#57606a';
  const pctFill = isDark ? '#e6edf3' : '#0d1117';

  // Monochrome palette matching GitHub Stats
  const darkShades = ['#e6edf3', '#8b949e', '#57606a', '#484f58', '#38404a', '#30363d', '#282e35', '#21262d'];
  const lightShades = ['#0d1117', '#57606a', '#8c959f', '#afb8c1', '#c0c7cf', '#d0d7de', '#d8dee4', '#eaeef2'];
  const shades = isDark ? darkShades : lightShades;
  const clipId = isDark ? 'lang-bar-clip-dark' : 'lang-bar-clip-light';

  // Calculate progress bar segments based on sorted percentages
  const totalBarW = 417.0;
  const barRects = [];
  let currentX = 0.0;
  for (let i = 0; i < Math.min(langs.length, 4); i++) {
    const item = langs[i];
    const w = parseFloat(((item.pct / 100.0) * totalBarW).toFixed(1));
    const color = shades[i % shades.length];
    barRects.push(`      <rect x="${currentX.toFixed(1)}" y="0" width="${w.toFixed(1)}" height="8" fill="${color}" />`);
    currentX += w;
  }
  if (currentX < totalBarW) {
    const remW = parseFloat((totalBarW - currentX).toFixed(1));
    barRects.push(`      <rect x="${currentX.toFixed(1)}" y="0" width="${remW.toFixed(1)}" height="8" fill="${shades[4]}" />`);
  }

  // Group top 4 in Col 1, next 4 in Col 2
  const col1 = langs.slice(0, 4);
  const col2 = langs.slice(4, 8);

  function renderCol(items, xOffset, startIndex) {
    return items.map((item, row) => {
      const y = row * 24;
      const color = shades[(startIndex + row) % shades.length];
      return `    <g transform="translate(${xOffset}, ${y})">
      <circle cx="5" cy="5" r="4.5" fill="${color}" />
      <text x="18" y="9" class="lang-name">${item.name} <tspan class="lang-pct">${item.pct.toFixed(2)}%</tspan></text>
    </g>`;
    }).join('\n');
  }

  const col1Svg = renderCol(col1, 0, 0);
  const col2Svg = renderCol(col2, 215, 4);
  const desc = langs.slice(0, 6).map(l => `${l.name}: ${l.pct.toFixed(2)}%`).join(', ');

  return `<svg
  width="467"
  height="195"
  viewBox="0 0 467 195"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-labelledby="descId"
>
  <title id="titleId">Jewel Ramirez&#39;s Most Used Languages</title>
  <desc id="descId">${desc}</desc>
  <style>
    .header {
      font: 600 18px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
      fill: ${headerFill};
    }
    .lang-name {
      font: 400 13px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
      fill: ${textFill};
    }
    .lang-pct {
      font-weight: 700;
      fill: ${pctFill};
    }
  </style>

  <rect
    x="0.5"
    y="0.5"
    rx="4.5"
    height="99%"
    width="466"
    fill="#00000000"
    stroke-opacity="0"
  />

  <g transform="translate(25, 35)">
    <text x="0" y="0" class="header">Most Used Languages</text>
  </g>

  <!-- Segmented monochrome progress bar (width 417 matches card proportion) -->
  <g transform="translate(25, 50)">
    <clipPath id="${clipId}">
      <rect x="0" y="0" width="417" height="8" rx="4" />
    </clipPath>
    <g clip-path="url(#${clipId})">
${barRects.join('\n')}
    </g>
  </g>

  <!-- Language List (2 Columns matching GitHub Stats card dimensions and typography) -->
  <g transform="translate(25, 78)">
${col1Svg}
${col2Svg}
  </g>
</svg>`;
}

function main() {
  const themes = ['dark', 'light'];
  for (const theme of themes) {
    const file = path.join(__dirname, '..', 'profile', `top-langs-${theme}.svg`);
    const langs = parseLanguages(file);
    const svg = renderSvg(theme, langs);
    fs.writeFileSync(file, svg, 'utf-8');
    console.log(`Generated monochrome 467x195 card: profile/top-langs-${theme}.svg`);
  }
}

main();
