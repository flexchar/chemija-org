import { join } from 'node:path';

const brandDir = import.meta.dir;
const root = join(brandDir, '../../../..');
const source = join(brandDir, 'chemija-mark.svg');
const publicDirs = [
  join(root, 'astro-app/public'),
  join(root, 'question-bank/app/public'),
];
const rasterSizes = [16, 32, 180, 512];
const rasterNames = {
  16: 'favicon-16.png',
  32: 'favicon-32.png',
  180: 'apple-touch-icon.png',
  512: 'chemija-mark-512.png',
};

function makeIco(pngs) {
  const headerLength = 6 + pngs.length * 16;
  const totalLength = headerLength + pngs.reduce((total, png) => total + png.length, 0);
  const ico = new Uint8Array(totalLength);
  const view = new DataView(ico.buffer);
  view.setUint16(2, 1, true);
  view.setUint16(4, pngs.length, true);
  let offset = headerLength;

  pngs.forEach((png, index) => {
    const entry = 6 + index * 16;
    const size = index === 0 ? 16 : 32;
    ico[entry] = size;
    ico[entry + 1] = size;
    view.setUint16(entry + 4, 1, true);
    view.setUint16(entry + 6, 32, true);
    view.setUint32(entry + 8, png.length, true);
    view.setUint32(entry + 12, offset, true);
    ico.set(png, offset);
    offset += png.length;
  });

  return ico;
}

const svg = await Bun.file(source).arrayBuffer();
const generated = new Map();
for (const size of rasterSizes) {
  const result = Bun.spawnSync([
    'timeout', '300', 'rsvg-convert', '-w', String(size), '-h', String(size),
    '-o', join(publicDirs[0], rasterNames[size]), source,
  ]);
  if (result.exitCode !== 0) {
    throw new Error(`rsvg-convert failed for ${size}px: ${result.stderr.toString()}`);
  }
  generated.set(size, new Uint8Array(await Bun.file(join(publicDirs[0], rasterNames[size])).arrayBuffer()));
}

const ico = makeIco([generated.get(16), generated.get(32)]);
for (const publicDir of publicDirs) {
  await Bun.write(join(publicDir, 'favicon.svg'), svg);
  for (const size of rasterSizes) {
    await Bun.write(join(publicDir, rasterNames[size]), generated.get(size));
  }
  await Bun.write(join(publicDir, 'favicon.ico'), ico);
}
