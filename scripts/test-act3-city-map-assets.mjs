#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ACT3_CITY_MAP_REFERENCE, ACT3_CITY_NODES, ACT3_CITY_ICON_URLS, getAct3CityIconUrl } from "../src/game/act3CityMapNodes.ts";
const pngPath=ACT3_CITY_MAP_REFERENCE.backgroundRepositoryPath;
assert.ok(fs.existsSync(pngPath),"Missing clean city background");
const png=fs.readFileSync(pngPath);
assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10],"Background must be PNG");
const width=png.readUInt32BE(16),height=png.readUInt32BE(20);
assert.equal(width,ACT3_CITY_MAP_REFERENCE.width,"Unexpected image width, adjust coords deliberately");
assert.equal(height,ACT3_CITY_MAP_REFERENCE.height,"Unexpected image height, adjust coords deliberately");
assert.equal(ACT3_CITY_MAP_REFERENCE.backgroundPublicUrl,"/"+pngPath.slice("public/".length));
const icons=Object.entries(ACT3_CITY_ICON_URLS);
assert.equal(icons.length,5);
assert.deepEqual(new Set(icons.map(([k])=>k)),new Set(ACT3_CITY_NODES.map(n=>n.iconKey)));
for(const [key,url] of icons){
  const file=path.posix.join("public",url);
  assert.equal(getAct3CityIconUrl(key),url);
  assert.ok(fs.existsSync(file),"Missing icon "+key);
  const svg=fs.readFileSync(file,"utf8");
  assert.match(svg,/<svg\b[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(svg,/viewBox="0 0 124 136"/);
  assert.match(svg,/<\/svg>\s*$/);
  assert.doesNotMatch(svg,/<text(?:\s|>)/i,"Pins must NOT contain text labels");
  assert.match(svg,/<path d="M62 14 C82 14/,"SVG geometry drift: recalc anchor");
}
console.log("Act 3 city map assets: PNG 1672x941 + 5 text-free SVG pins with defined anchors: PASS");
