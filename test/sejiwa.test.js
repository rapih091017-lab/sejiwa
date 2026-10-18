const test = require('node:test');
const assert = require('node:assert');
const { normalize, detectCrisis, ageBucket, nextPrompt, PROMPTS } = require('../lib/sejiwa.js');

test('normalize menurunkan huruf dan membuang tanda baca', () => {
  assert.strictEqual(normalize('Bunuh Diri!!'), 'bunuh diri');
  assert.strictEqual(normalize('  hopeless... banget? '), 'hopeless banget');
});

test('detectCrisis mendeteksi frasa krisis bahasa Indonesia', () => {
  assert.strictEqual(detectCrisis('aku pengen bunuh diri').level, 'crisis');
  assert.strictEqual(detectCrisis('saya ingin mengakhiri hidup saya').level, 'crisis');
  assert.strictEqual(detectCrisis('gantung diri aja rasanya').level, 'crisis');
});

test('detectCrisis mendeteksi frasa krisis bahasa Inggris', () => {
  assert.strictEqual(detectCrisis('i want to die').level, 'crisis');
  assert.strictEqual(detectCrisis('kill myself today').level, 'crisis');
});

test('detectCrisis mendeteksi level warning', () => {
  assert.strictEqual(detectCrisis('rasanya hopeless banget').level, 'warning');
  assert.strictEqual(detectCrisis('capek hidup terus').level, 'warning');
  assert.strictEqual(detectCrisis('aku tidak berharga').level, 'warning');
});

test('detectCrisis diam untuk teks netral', () => {
  const r = detectCrisis('hari ini cuaca enak, aku jalan-jalan');
  assert.strictEqual(r.level, 'none');
  assert.deepStrictEqual(r.matched, []);
});

test('ageBucket memetakan usia ke segmen', () => {
  assert.strictEqual(ageBucket(13), '13-17');
  assert.strictEqual(ageBucket(17), '13-17');
  assert.strictEqual(ageBucket(20), '18-25');
  assert.strictEqual(ageBucket(30), '26-40');
  assert.strictEqual(ageBucket(41), '41+');
  assert.strictEqual(ageBucket(99), '41+');
  assert.strictEqual(ageBucket(9), null);
});

test('ageBucket menolak usia di bawah 13', () => {
  assert.strictEqual(ageBucket(12), null);
  assert.strictEqual(ageBucket('abc'), null);
});

test('nextPrompt memberi prompt valid dan berganti', () => {
  const a = nextPrompt(0, '18-25');
  const b = nextPrompt(1, '18-25');
  assert.ok(a && a.length > 0);
  assert.notStrictEqual(a, b);
});

test('semua bucket punya prompt', () => {
  for (const bucket of ['13-17', '18-25', '26-40', '41+']) {
    assert.ok(PROMPTS[bucket].length >= 3, 'bucket ' + bucket + ' kurang prompt');
  }
});
