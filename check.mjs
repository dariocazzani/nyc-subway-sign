// Smoke test: decode a live MTA feed with the page's own parser and sanity-check the result.
// Run: node check.mjs
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('index.html', import.meta.url), 'utf8');
const core = html.match(/<script id="core">([\s\S]*?)<\/script>/)[1];
const { parseFeed } = new Function(`${core}; return { parseFeed };`)();

const res = await fetch('https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l');
assert.ok(res.ok, `feed HTTP ${res.status}`);
const rows = parseFeed(await res.arrayBuffer()), now = Date.now() / 1000;

assert.ok(rows.length > 20, `only ${rows.length} arrivals decoded`);
for (const r of rows) {
  assert.equal(r.route, 'L', JSON.stringify(r));
  assert.match(r.stop, /^L\d\d[NS]$/);
  assert.match(r.dest, /^L\d\d$/);
  assert.ok(Math.abs(r.t - now) < 6 * 3600 && Math.abs(r.d - now) < 6 * 3600, JSON.stringify(r));
}
console.log(`ok: ${rows.length} L train arrivals decoded`);
