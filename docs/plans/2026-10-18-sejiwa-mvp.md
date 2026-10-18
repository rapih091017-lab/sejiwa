# Sejiwa MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use godmode:task-runner to implement this plan task-by-task.

**Goal:** MVP web app final: check-in mood harian, jurnal empatik bersegmen usia, deteksi krisis berlapis, tombol darurat 119 ext 8 — semua localStorage, tanpa server.

**Architecture:** Static web app 2 halaman. Logika murni (detektor krisis, segmentasi usia, prompt jurnal) dipisah ke `lib/sejiwa.js` agar bisa dites Node. UI di `app.html` memakai design token yang sama dengan landing `index.html`. Persistensi localStorage (privasi: data tidak keluar browser).

**Tech Stack:** HTML + Tailwind CDN + vanilla JS, Lora/Raleway, Lucide; test: `node --test` (assert, tanpa framework).

---

### Task 0: Repo baseline

**Files:** Create: `.gitignore`

**Steps:**
1. `git init` di `D:\sejiwa`
2. `.gitignore`: `node_modules/`
3. Commit baseline `index.html` — `feat: landing page Sejiwa`

### Task 1: Rencana

**Files:** Create: `docs/plans/2026-10-18-sejiwa-mvp.md`

**Steps:**
1. Simpan plan ini
2. Commit — `docs: rencana implementasi MVP`

### Task 2: Logika murni + test (TDD)

**Files:**
- Create: `lib/sejiwa.js`
- Create: `test/sejiwa.test.js`

**Steps:**
1. Tulis test dulu (`test/sejiwa.test.js`):
   - `detectCrisis("aku pengen bunuh diri")` → level `crisis`
   - `detectCrisis("rasa nya hopeless banget")` → level `warning`
   - `detectCrisis("hari ini cuaca enak")` → level `none`
   - `ageBucket(15)` → `13-17`, `ageBucket(30)` → `26-40`, `ageBucket(50)` → `41+`
   - `nextPrompt(3, "18-25")` balik non-kosong, beda dari index terakhir
   - `normalize("Bunuh Diri!!")` → `"bunuh diri"`
2. Jalankan `node --test test/` — Expected: FAIL (module belum ada)
3. Implement `lib/sejiwa.js`: `normalize`, `detectCrisis` (2 layer: crisis list ~20 frasa ID/EN, warning list ~15 frasa, lowercase+punctuation strip), `ageBucket`, `PROMPTS` per bucket, `nextPrompt`, export UMD-style (browser `window.Sejiwa`, Node `module.exports`)
4. Jalankan ulang — Expected: PASS semua
5. Commit — `feat: logika deteksi krisis + segmentasi usia + test`

### Task 3: Aplikasi UI

**Files:** Create: `app.html`

**Steps:**
1. Design token sama dengan `index.html` (gelap 1 level: `#7C3AED`/`#A78BFA`/`#059669`/`#F5F3FF`/`#2E1065`), font Lora+Raleway, Lucide, TANPA komentar HTML
2. Onboarding: pilih usia → bucket tersimpan
3. Section: check-in mood (5 level, simpan per hari, bar chart 7 hari), jurnal (prompt berganti per bucket, tombol simpan, respon empatik template), riwayat entry, kartu self-help per bucket
4. Simpan entry → `detectCrisis` → level `crisis`: modal darurat (119 ext 8, Yayasan Pulih 021-78842580, langkah grounding); `warning`: kartu dukungan lembut + hint hotline
5. Band darurat sticky + disclaimer medis
6. Verify: `python -c "from html.parser import HTMLParser; HTMLParser().feed(open(r'D:\sejiwa\app.html',encoding='utf-8').read()); print('OK')"`
7. Commit — `feat: aplikasi MVP check-in mood + jurnal + deteksi krisis`

### Task 4: Integrasi landing

**Files:** Modify: `index.html`

**Steps:**
1. Tambah CTA `Coba demo → app.html` di hero (samping CTA utama)
2. Verify parse + `rg -c "\-\-" index.html app.html lib/sejiwa.js` → Expected: 0
3. Commit — `feat: tautan demo dari landing`

### Task 5: Verifikasi akhir

1. `node --test test/` → PASS
2. Parse semua HTML → OK
3. Buka `app.html` di browser, smoke test: pilih usia, check-in, jurnal dengan kata krisis → modal muncul
4. Commit sisa bila ada

**Definisi selesai:** test Node hijau, 0 komentar `--`, mood+jurnal+deteksi krisis+hotline berfungsi di browser, landing tertaut.
