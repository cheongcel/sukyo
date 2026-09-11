// Run from repository root: node scripts/generate-calendar.mjs
// Build-time only: deployed calculations never access the network.
import fs from 'node:fs';
import crypto from 'node:crypto';
const revision = '241fa20712a179b2287d801bb30b51af227461e6';
const url = `https://raw.githubusercontent.com/manakai/data-locale/${revision}/data/calendar/kyuureki-map.txt`;
const response = await fetch(url);
if (!response.ok) throw new Error(`Calendar download failed: ${response.status}`);
const text = await response.text();
const rows = text.trim().split('\n').map(line => line.trim().split(/\s+/)).filter(([solar]) => solar >= '1900-01-01' && solar <= '2101-01-29');
const starts = rows.filter(([,lunar]) => lunar.endsWith('-01')).map(([solar,lunar]) => {
  const match = /^(\d{4})-(\d{2})(')?-01$/.exec(lunar);
  if (!match) throw new Error(`Invalid lunar date: ${lunar}`);
  return `${solar},${Number(match[1])},${Number(match[2])},${Boolean(match[3])}`;
});
if (!starts[0].startsWith('1900-01-01,') || !starts.at(-1).startsWith('2101-01-29,')) throw new Error('Incomplete coverage');
const header = `# Gregorian month start,lunar year,lunar month,leap month\n# Source: ${url}\n# Source SHA-256: ${crypto.createHash('sha256').update(text).digest('hex')}\n`;
fs.writeFileSync('src/main/resources/calendar/kyureki-months.csv', header + starts.join('\n') + '\n');
console.log(`Generated ${starts.length} month boundaries; covered ${rows.length} source days.`);
