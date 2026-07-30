const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const store = path.join(root, 'store');

function readPng(fileName) {
  const filePath = path.join(store, fileName);
  const data = fs.readFileSync(filePath);
  assert.strictEqual(
    data.subarray(0, 8).toString('hex'),
    '89504e470d0a1a0a',
    `${fileName} must be a PNG`,
  );
  assert.strictEqual(data.subarray(12, 16).toString('ascii'), 'IHDR', `${fileName} must start with IHDR`);
  return {
    filePath,
    size: data.length,
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
    bitDepth: data[24],
    colorType: data[25],
  };
}

function assertPng(fileName, width, height, colorType, maxBytes) {
  const info = readPng(fileName);
  assert.strictEqual(info.width, width, `${fileName} width`);
  assert.strictEqual(info.height, height, `${fileName} height`);
  assert.strictEqual(info.bitDepth, 8, `${fileName} must use 8-bit channels`);
  assert.strictEqual(info.colorType, colorType, `${fileName} PNG color type`);
  if (maxBytes) {
    assert.ok(info.size <= maxBytes, `${fileName} must not exceed ${maxBytes} bytes`);
  }
}

assertPng('icon-512.png', 512, 512, 6, 1024 * 1024);
assertPng('feature-graphic-1024x500.png', 1024, 500, 2);

const expectedScreenshots = [
  'screenshot-1-editor.png',
  'screenshot-2-3d.png',
  'screenshot-3-finished-part.png',
  'screenshot-4-toolpath.png',
  'screenshot-5-learn.png',
];
const screenshots = fs
  .readdirSync(store)
  .filter((fileName) => /^screenshot-\d+.*\.png$/.test(fileName))
  .sort();

assert.deepStrictEqual(screenshots, expectedScreenshots, 'store must contain only the numbered current screenshots');
assert.ok(screenshots.length >= 4 && screenshots.length <= 8, 'Play supports four to eight recommended phone screenshots');
for (const fileName of screenshots) {
  assertPng(fileName, 1080, 1920, 2, 8 * 1024 * 1024);
  assert.ok(1920 <= 2 * 1080, `${fileName} must stay within Play's 2:1 dimension limit`);
}

const videoPath = path.join(store, 'preview-video.mp4');
const video = fs.readFileSync(videoPath);
assert.strictEqual(video.subarray(4, 8).toString('ascii'), 'ftyp', 'preview-video.mp4 must use an MP4 container');
assert.ok(video.length > 1024 * 1024, 'preview-video.mp4 must not be an empty placeholder');
assert.ok(video.length < 100 * 1024 * 1024, 'preview-video.mp4 must remain practical for GitHub');

const readme = fs.readFileSync(path.join(store, 'README.md'), 'utf8');
for (const fileName of ['icon-512.png', 'feature-graphic-1024x500.png', ...expectedScreenshots, 'preview-video.mp4']) {
  assert.ok(readme.includes(`\`${fileName}\``), `store/README.md must document ${fileName}`);
}

console.log('store-assets.test.js: Play icon, feature graphic, five screenshots and preview video verified');
