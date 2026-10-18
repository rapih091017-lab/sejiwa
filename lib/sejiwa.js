(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.Sejiwa = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function normalize(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  var CRISIS = [
    'bunuh diri',
    'mengakhiri hidup',
    'akhiri hidup',
    'menghabisi diri',
    'gantung diri',
    'ingin mati',
    'pengen mati',
    'pengen bunuh',
    'mau bunuh',
    'tidak mau hidup',
    'tidak ingin hidup',
    'tidak betah hidup',
    'overdosis',
    'minum obat banyak',
    'lompat dari',
    'buang diri',
    'suicide',
    'kill myself',
    'killing myself',
    'want to die',
    'want to end my life',
    'end my life',
    'self harm',
    'harm myself'
  ];

  var WARNING = [
    'hopeless',
    'tidak ada harapan',
    'putus asa',
    'capek hidup',
    'lelah hidup',
    'muak hidup',
    'tired of life',
    'tidak berharga',
    'nggak berharga',
    'tidak guna',
    'nggak guna',
    'worthless',
    'beban ini berat',
    'beban berat',
    'ingin hilang saja',
    'pengen hilang',
    'want to disappear',
    'no reason to live',
    'sakit hati banget',
    'hancur lebur',
    'kiamat rasanya',
    'tak ada gunanya'
  ];

  function matchList(normalized, list) {
    for (var i = 0; i < list.length; i++) {
      if (normalized.indexOf(list[i]) !== -1) return list[i];
    }
    return null;
  }

  function detectCrisis(text) {
    var n = normalize(text);
    var hit = matchList(n, CRISIS);
    if (hit) return { level: 'crisis', matched: hit };
    hit = matchList(n, WARNING);
    if (hit) return { level: 'warning', matched: hit };
    return { level: 'none', matched: [] };
  }

  function ageBucket(age) {
    var n = Number(age);
    if (!isFinite(n) || n < 13) return null;
    if (n <= 17) return '13-17';
    if (n <= 25) return '18-25';
    if (n <= 40) return '26-40';
    return '41+';
  }

  var PROMPTS = {
    '13-17': [
      'Hari ini ada momen yang bikin kamu senang atau capek? Cerita versi paling jujur, singkat juga boleh.',
      'Kalau perasaan kamu punya warna hari ini, warnanya apa? Kenapa gitu?',
      'Ada sesuatu di sekolah atau sama teman yang masih nempel di kepala?',
      'Apa yang pengen kamu bilang tapi belum berani hari ini?',
      'Besok pagi, hal kecil apa yang bikin kamu sedikit lebih oke?'
    ],
    '18-25': [
      'Apa yang paling menguras energimu minggu ini — dan apa yang sebenarnya kamu butuhkan dari itu?',
      'Kalau boleh jujur tanpa disangka, apa yang sedang kamu rasakan sekarang?',
      'Ada keputusan yang lagi kamu tunda? Apa yang bikin ragu?',
      'Siapa atau apa yang bikin kamu merasa didengar belakangan ini?',
      'Satu hal yang ingin kamu ucapkan terima kasih pada dirimu sendiri hari ini?'
    ],
    '26-40': [
      'Dari semua yang harus kamu pikul hari ini, mana yang paling berat?',
      'Apa satu stres kerja yang bisa kamu turunkan levelnya minggu ini?',
      'Kapan terakhir kali kamu istirahat tanpa merasa bersalah?',
      'Apa yang kamu butuhkan tapi jarang kamu minta ke orang lain?',
      'Di tengah padatnya, ada momen kecil yang bikin lega hari ini?'
    ],
    '41+': [
      'Apa yang paling menyerap tenaga Anda belakangan ini?',
      'Bagaimana kabar hati Anda hari ini, dengan jujur?',
      'Ada hal yang ingin Anda pelajari atau lepaskan tahun ini?',
      'Siapa yang bisa Anda ajak bicara tanpa perlu berpura-pura?',
      'Apa satu hal kecil yang bisa Anda lakukan untuk diri sendiri minggu ini?'
    ]
  };

  function nextPrompt(index, bucket) {
    var list = PROMPTS[bucket] || PROMPTS['18-25'];
    return list[index % list.length];
  }

  return {
    normalize: normalize,
    detectCrisis: detectCrisis,
    ageBucket: ageBucket,
    nextPrompt: nextPrompt,
    PROMPTS: PROMPTS,
    CRISIS: CRISIS,
    WARNING: WARNING
  };
});
