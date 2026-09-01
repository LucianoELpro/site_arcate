// Puntuaciones. Hoy: localStorage (invitados).
// Backend real: sustituye load/push por fetch a GET/POST /api/scores/:juego
// (o supabase.from('scores').select()/insert()).
window.AV = window.AV || {};

AV.Storage = (function () {
  var KEY = 'arcadeVault.scores.v1';

  function seedFor(id) {
    var names = ['NEO','PACO','LUCIA','R2D9','SOFIA','ZORRO','MAXI','IRIS','TITO','ELENA','VIPER','CHISPA'];
    var s = 0, i;
    for (i = 0; i < id.length; i++) s = (s * 31 + id.charCodeAt(i)) % 99991;
    function rnd() { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; }
    var out = [], v = 9000 + Math.floor(rnd() * 8000);
    for (i = 0; i < 10; i++) {
      out.push({
        player: names[Math.floor(rnd() * names.length)] + (i % 3 === 0 ? '' : '_' + (10 + Math.floor(rnd() * 89))),
        score: v,
        date: '2026-0' + (1 + Math.floor(rnd() * 8)) + '-' + String(1 + Math.floor(rnd() * 28)).padStart(2, '0')
      });
      v = Math.max(120, v - Math.floor(400 + rnd() * 1400));
    }
    return out;
  }

  function mine() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }

  return {
    all: function () {
      var saved = mine(), out = {};
      AV.GAMES.forEach(function (g) {
        out[g.id] = seedFor(g.id).concat(saved[g.id] || []).sort(function (a, b) { return b.score - a.score; });
      });
      return out;
    },
    top: function (id, n) { return (this.all()[id] || []).slice(0, n || 10); },
    best: function (id) { var l = this.top(id, 1); return l.length ? AV.fmt(l[0].score) : '—'; },
    push: function (id, entry) {
      var saved = mine();
      saved[id] = (saved[id] || []).concat([entry]);
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {}
    }
  };
})();
