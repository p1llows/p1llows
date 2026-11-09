const fs = require('fs');

const rows = [
  {
    cat: 'LANGUAGES',
    items: ['PHP', 'TypeScript', 'JavaScript', 'SQL', 'Bash', 'HTML5', 'CSS3']
  },
  {
    cat: 'BACKEND',
    items: ['Laravel', 'Node.js', 'Express.js', 'REST APIs', 'Blade']
  },
  {
    cat: 'FRONTEND',
    items: ['React', 'Next.js', 'Vue.js', 'Tailwind CSS', 'Quasar', 'Vite']
  },
  {
    cat: 'DATA & CACHE',
    items: ['PostgreSQL', 'MySQL', 'MariaDB', 'MongoDB', 'Redis']
  },
  {
    cat: 'INFRA & TOOLS',
    items: ['Docker', 'Git', 'GitHub Actions', 'Vercel', 'Cloudflare']
  }
];

const icons = {
  'PHP': `<ellipse cx="7" cy="7" rx="6.5" ry="4.5" fill="none" stroke="currentColor" stroke-width="1"/><text x="7" y="9.2" text-anchor="middle" style="font:800 6px sans-serif;letter-spacing:-0.2px" fill="currentColor">php</text>`,
  'TypeScript': `<rect x="0.5" y="0.5" width="13" height="13" rx="2" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="1"/><text x="7" y="10" text-anchor="middle" style="font:800 7.5px 'Segoe UI',sans-serif" fill="currentColor">TS</text>`,
  'JavaScript': `<rect x="0.5" y="0.5" width="13" height="13" rx="2" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="1"/><text x="7" y="10" text-anchor="middle" style="font:800 7.5px 'Segoe UI',sans-serif" fill="currentColor">JS</text>`,
  'SQL': `<ellipse cx="7" cy="3.5" rx="5.5" ry="1.8" fill="none" stroke="currentColor" stroke-width="1"/><path d="M1.5 3.5v3.5c0 .9 2.5 1.8 5.5 1.8s5.5-.9 5.5-1.8V3.5 M1.5 7v3.5c0 .9 2.5 1.8 5.5 1.8s5.5-.9 5.5-1.8V7" fill="none" stroke="currentColor" stroke-width="1"/>`,
  'Bash': `<rect x="0.5" y="1" width="13" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1"/><path d="M3 4.5l2.5 2L3 8.5 M7.5 8.5h3" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>`,
  'HTML5': `<polygon points="1.5,1 12.5,1 11.5,11.5 7,13 2.5,11.5" fill="none" stroke="currentColor" stroke-width="1"/><path d="M7 3.5h3.2l-.3 3H7v2.2l1.8-.5.1-1h1.3l-.2 2.2L7 11z" fill="currentColor"/>`,
  'CSS3': `<polygon points="1.5,1 12.5,1 11.5,11.5 7,13 2.5,11.5" fill="none" stroke="currentColor" stroke-width="1"/><path d="M7 3.5h3.2l-.2 2H7v1.8h2.8l-.3 2.8L7 11z" fill="currentColor"/>`,
  'Laravel': `<path d="M7 1l5 2.8v5.6L7 12.2 2 9.4V3.8z" fill="none" stroke="currentColor" stroke-width="1"/><path d="M7 1v11.2 M2 3.8L7 6.6l5-2.8" fill="none" stroke="currentColor" stroke-width="1"/>`,
  'Node.js': `<polygon points="7,1 12.5,4 12.5,10 7,13 1.5,10 1.5,4" fill="none" stroke="currentColor" stroke-width="1"/><path d="M4.5 9.5V4.5l5 5V4.5" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>`,
  'Express.js': `<text x="7" y="10" text-anchor="middle" style="font:800 8.5px 'Segoe UI',sans-serif;font-style:italic" fill="currentColor">ex</text>`,
  'REST APIs': `<circle cx="3" cy="7" r="1.8" fill="currentColor"/><circle cx="11" cy="3.5" r="1.8" fill="currentColor"/><circle cx="11" cy="10.5" r="1.8" fill="currentColor"/><line x1="3" y1="7" x2="11" y2="3.5" stroke="currentColor" stroke-width="1"/><line x1="3" y1="7" x2="11" y2="10.5" stroke="currentColor" stroke-width="1"/>`,
  'Blade': `<text x="7" y="10" text-anchor="middle" style="font:700 8.5px ui-monospace,monospace" fill="currentColor">{ }</text>`,
  'React': `<ellipse cx="7" cy="7" rx="6" ry="2.2" fill="none" stroke="currentColor" stroke-width="1"/><ellipse cx="7" cy="7" rx="6" ry="2.2" transform="rotate(60 7 7)" fill="none" stroke="currentColor" stroke-width="1"/><ellipse cx="7" cy="7" rx="6" ry="2.2" transform="rotate(120 7 7)" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="7" cy="7" r="1.2" fill="currentColor"/>`,
  'Next.js': `<circle cx="7" cy="7" r="5.8" fill="none" stroke="currentColor" stroke-width="1"/><path d="M4.8 9.8V4.2l5 5.2h.4V4.2" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>`,
  'Vue.js': `<polygon points="1,2 7,12 13,2 10,2 7,7.2 4,2" fill="currentColor"/><polygon points="4,2 7,7.2 10,2 8,2 7,3.8 6,2" fill="none" stroke="currentColor" stroke-width="0.5"/>`,
  'Tailwind CSS': `<path d="M3.8 5.2c.8-1.2 2-1.5 3.2-1.1 1.2.4 1.6 1.5 2.8 1.9.8.2 1.6-.2 2-.6-.6 1.2-1.8 1.6-3 1.2-1.2-.4-1.6-1.5-2.8-1.9-.8-.3-1.6.2-2.2.5z M1.8 8.4c.8-1.2 2-1.5 3.2-1.1 1.2.4 1.6 1.5 2.8 1.9.8.2 1.6-.2 2-.6-.6 1.2-1.8 1.6-3 1.2-1.2-.4-1.6-1.5-2.8-1.9-.8-.3-1.6.2-2.2.5z" fill="currentColor"/>`,
  'Quasar': `<circle cx="7" cy="7" r="4.2" fill="currentColor"/><ellipse cx="7" cy="7" rx="6" ry="2" transform="rotate(-30 7 7)" fill="none" stroke="currentColor" stroke-width="1"/>`,
  'Vite': `<polygon points="7.5,1 2.5,7 6,7 5,13 11.5,6 8,6" fill="currentColor"/>`,
  'PostgreSQL': `<path d="M2.5 4.5C2.5 2.5 4.5 1 7 1s4.5 1.5 4.5 3.5c0 1.2-.6 2.2-1.5 2.8v3.2c0 1.5-1.5 2.5-3 2.5s-3-1-3-2.5V7.3C3.1 6.7 2.5 5.7 2.5 4.5z" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="5" cy="4.5" r="0.8" fill="currentColor"/><path d="M7 6v4" stroke="currentColor" stroke-width="1"/>`,
  'MySQL': `<path d="M2 10.5c1-3.5 3.5-6.5 7.5-6.5 1.5 0 2.5.5 3 1.5-.5 1-2 2-3.5 2.5-2.5.8-3.5 2.5-4 3.5H2z" fill="currentColor"/>`,
  'MariaDB': `<ellipse cx="7" cy="4" rx="5.5" ry="1.8" fill="none" stroke="currentColor" stroke-width="1"/><path d="M1.5 4v4.5c0 1 2.5 1.8 5.5 1.8s5.5-.8 5.5-1.8V4" fill="none" stroke="currentColor" stroke-width="1"/><path d="M4.5 7.2l2.2 2.2 2.8-2.8" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>`,
  'MongoDB': `<path d="M7 1C7 1 3.5 4.8 3.5 7.8c0 2.3 1.6 3.9 3.5 4.2 1.9-.3 3.5-1.9 3.5-4.2C10.5 4.8 7 1 7 1z" fill="none" stroke="currentColor" stroke-width="1"/><line x1="7" y1="1.5" x2="7" y2="12" stroke="currentColor" stroke-width="0.9"/>`,
  'Redis': `<polygon points="7,1.5 12.5,4.5 7,7.5 1.5,4.5" fill="none" stroke="currentColor" stroke-width="1"/><path d="M1.5 6.5l5.5 3 5.5-3 M1.5 9.5l5.5 3 5.5-3" fill="none" stroke="currentColor" stroke-width="1"/>`,
  'Docker': `<rect x="3" y="4" width="1.8" height="1.8" fill="currentColor"/><rect x="5.5" y="4" width="1.8" height="1.8" fill="currentColor"/><rect x="8" y="4" width="1.8" height="1.8" fill="currentColor"/><rect x="5.5" y="1.5" width="1.8" height="1.8" fill="currentColor"/><path d="M1 7h11.5c0 2.2-1.3 4-4 4-2 0-3-.7-4-1.3C3.5 9.2 2.5 9.2 1 8.5V7z" fill="none" stroke="currentColor" stroke-width="1"/>`,
  'Git': `<rect x="2.5" y="2.5" width="9" height="9" rx="1.5" transform="rotate(45 7 7)" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="7" cy="4.8" r="1" fill="currentColor"/><circle cx="4.8" cy="9.2" r="1" fill="currentColor"/><circle cx="9.2" cy="7" r="1" fill="currentColor"/><path d="M7 4.8v2.2m0 0l2.2 0m-2.2 0L4.8 9.2" stroke="currentColor" stroke-width="0.9"/>`,
  'GitHub Actions': `<circle cx="7" cy="7" r="5.2" fill="none" stroke="currentColor" stroke-width="1"/><polygon points="5.5,4.5 9.8,7 5.5,9.5" fill="currentColor"/>`,
  'Vercel': `<polygon points="7,2 12.5,12 1.5,12" fill="currentColor"/>`,
  'Cloudflare': `<path d="M10.8 5.5a2.8 2.8 0 00-2.6 1.8 2 2 0 00-1.6-.6 2 2 0 00-1.9 1.4A2 2 0 002.5 10a2 2 0 002 2h6.5a2 2 0 002-2 2 2 0 00-1.5-1.9 2.8 2.8 0 00-.7-2.6z" fill="currentColor"/>`
};

function generateSVG(isDark) {
  const bg = isDark ? '#0d1117' : '#ffffff';
  const border = isDark ? 'url(#stack-border-dark)' : 'url(#stack-border-light)';
  const sysText = '#6e7681';
  const circle1 = isDark ? '#30363d' : '#d0d7de';
  const circle2 = isDark ? '#21262d' : '#eaeef2';
  const divLine = isDark ? '#21262d' : '#eaeef2';
  const scanFill = isDark ? 'url(#scanline-dark)' : 'url(#scanline-light)';
  const catBoxFill = isDark ? '#161b22' : '#f6f8fa';
  const catBoxStroke = isDark ? '#30363d' : '#d0d7de';
  const catText = isDark ? '#f0f6fc' : '#0d1117';
  const chipBg = isDark ? '#161b22' : '#f6f8fa';
  const chipBorder = isDark ? '#30363d' : '#d0d7de';
  const chipText = isDark ? '#c9d1d9' : '#24292f';
  const chipIconColor = isDark ? '#f0f6fc' : '#0d1117';
  const rowLine = isDark ? '#161b22' : '#eaeef2';
  const statusDotFill = isDark ? '#f0f6fc' : '#0d1117';

  let out = `<svg width="860" height="290" viewBox="0 0 860 290" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">\n`;
  out += `  <defs>\n`;
  if (isDark) {
    out += `    <linearGradient id="stack-border-dark" x1="0" y1="0" x2="860" y2="290" gradientUnits="userSpaceOnUse">\n`;
    out += `      <stop offset="0%" stop-color="#30363d"/>\n`;
    out += `      <stop offset="50%" stop-color="#21262d"/>\n`;
    out += `      <stop offset="100%" stop-color="#30363d"/>\n`;
    out += `    </linearGradient>\n`;
    out += `    <linearGradient id="scanline-dark" x1="0%" y1="0%" x2="100%" y2="0%">\n`;
    out += `      <stop offset="0%" stop-color="#21262d" stop-opacity="0"/>\n`;
    out += `      <stop offset="50%" stop-color="#f0f6fc" stop-opacity="0.9"/>\n`;
    out += `      <stop offset="100%" stop-color="#21262d" stop-opacity="0"/>\n`;
    out += `    </linearGradient>\n`;
  } else {
    out += `    <linearGradient id="stack-border-light" x1="0" y1="0" x2="860" y2="290" gradientUnits="userSpaceOnUse">\n`;
    out += `      <stop offset="0%" stop-color="#d0d7de"/>\n`;
    out += `      <stop offset="50%" stop-color="#eaeef2"/>\n`;
    out += `      <stop offset="100%" stop-color="#d0d7de"/>\n`;
    out += `    </linearGradient>\n`;
    out += `    <linearGradient id="scanline-light" x1="0%" y1="0%" x2="100%" y2="0%">\n`;
    out += `      <stop offset="0%" stop-color="#eaeef2" stop-opacity="0"/>\n`;
    out += `      <stop offset="50%" stop-color="#0d1117" stop-opacity="0.8"/>\n`;
    out += `      <stop offset="100%" stop-color="#eaeef2" stop-opacity="0"/>\n`;
    out += `    </linearGradient>\n`;
  }
  out += `  </defs>\n\n`;

  out += `  <style>\n`;
  out += `    @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(0.8); } }\n`;
  out += `    @keyframes sweep { 0% { transform: translateX(-350px); } 100% { transform: translateX(860px); } }\n`;
  out += `    .status-dot { animation: pulse 2.2s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }\n`;
  out += `    .beam { animation: sweep 4.5s linear infinite; }\n`;
  out += `  </style>\n\n`;

  out += `  <!-- Outer Card Container -->\n`;
  out += `  <rect width="860" height="290" rx="10" fill="${bg}" stroke="${border}" stroke-width="1.2"/>\n\n`;

  out += `  <!-- Top System Bar (No pill) -->\n`;
  out += `  <circle cx="28" cy="20" r="4" fill="${circle1}"/>\n`;
  out += `  <circle cx="42" cy="20" r="4" fill="${circle2}"/>\n`;
  out += `  <circle cx="56" cy="20" r="4" fill="${circle2}"/>\n\n`;
  out += `  <text x="75" y="24" style="font:600 10.5px ui-monospace,monospace;letter-spacing:2px;fill:${sysText}">REGISTRY // TECH_STACK_MATRIX</text>\n\n`;

  out += `  <!-- Divider Line with Sweeping Beam -->\n`;
  out += `  <line x1="20" y1="36" x2="840" y2="36" stroke="${divLine}" stroke-width="1"/>\n`;
  const clipId = isDark ? 'stack-clip-dark' : 'stack-clip-light';
  out += `  <g clip-path="url(#${clipId})">\n`;
  out += `    <clipPath id="${clipId}">\n`;
  out += `      <rect x="20" y="35" width="820" height="2"/>\n`;
  out += `    </clipPath>\n`;
  out += `    <rect class="beam" x="0" y="35" width="300" height="2" fill="${scanFill}"/>\n`;
  out += `  </g>\n\n`;

  // Rows
  const yStart = 48;
  const rowHeight = 44;
  rows.forEach((r, idx) => {
    const y = yStart + idx * rowHeight;
    out += `  <!-- Row ${idx + 1}: ${r.cat.replace(/&/g, 'and')} -->\n`;
    out += `  <g transform="translate(25, ${y})">\n`;
    out += `    <!-- Category Badge -->\n`;
    out += `    <rect width="130" height="28" rx="5" fill="${catBoxFill}" stroke="${catBoxStroke}" stroke-width="1"/>\n`;
    out += `    <circle class="status-dot" cx="14" cy="14" r="2.5" fill="${statusDotFill}"/>\n`;
    const catLabel = r.cat.replace(/&/g, '&amp;');
    out += `    <text x="72" y="18" text-anchor="middle" style="font:700 10.5px ui-monospace,monospace;letter-spacing:1.5px;fill:${catText}">${catLabel}</text>\n\n`;

    out += `    <!-- Stack Items with Icons -->\n`;
    let chipX = 142;
    r.items.forEach(item => {
      const iconSvg = icons[item] || '';
      const textWidth = Math.ceil(item.length * 6.8);
      const chipW = 7 + 14 + 6 + textWidth + 8;
      out += `    <g transform="translate(${chipX}, 1)">\n`;
      out += `      <rect width="${chipW}" height="26" rx="4" fill="${chipBg}" stroke="${chipBorder}" stroke-width="1"/>\n`;
      out += `      <g transform="translate(6, 6)" color="${chipIconColor}">\n`;
      out += `        ${iconSvg}\n`;
      out += `      </g>\n`;
      out += `      <text x="26" y="17" style="font:600 11px ui-monospace,monospace;fill:${chipText}">${item}</text>\n`;
      out += `    </g>\n`;
      chipX += chipW + 6;
    });
    out += `  </g>\n`;

    if (idx < rows.length - 1) {
      out += `  <line x1="25" y1="${y + 36}" x2="835" y2="${y + 36}" stroke="${rowLine}" stroke-width="1"/>\n\n`;
    }
  });

  out += `</svg>\n`;
  return out;
}

fs.writeFileSync('assets/dark/stack.svg', generateSVG(true), 'utf8');
fs.writeFileSync('assets/stack.svg', generateSVG(false), 'utf8');
console.log('Successfully generated assets/dark/stack.svg and assets/stack.svg with icons!');
