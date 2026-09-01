window.AV = window.AV || {};

AV.Hall = {
  render: function (state) {
    var me = state.user && !state.user.guest ? state.user.name : null;

    var tabs = AV.GAMES.map(function (g) {
      return '<div class="chip ' + (state.hallId === g.id ? 'active' : '') + '" data-action="hall" data-game="' + g.id + '">' + g.slug + '</div>';
    }).join('');

    var rows = AV.Storage.top(state.hallId, 10).map(function (r, i) {
      var medal = ['g1','g2','g3'][i] || '';
      var mine = me && r.player === me;
      return '<div class="table-row ' + (mine ? 'mine' : (i < 3 ? 'top3' : '')) + '" style="animation-delay:' + (i * 55) + 'ms">' +
        '<div class="rank ' + medal + '">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<div class="player-cell"><div class="player-name">' + AV.esc(r.player) + '</div>' +
          (mine ? '<div class="mine-badge">TU MEJOR MARCA</div>' : '') + '</div>' +
        '<div class="score-cell ' + medal + '">' + AV.fmt(r.score) + '</div>' +
        '<div class="date-cell">' + r.date + '</div>' +
      '</div>';
    }).join('');

    return '<section class="screen wrap wrap-narrow">' +
      '<div class="hero">' +
        '<h1 class="pixel neon-yellow" style="margin:0;font-size:clamp(20px,4.6vw,40px);line-height:1.4">SALÓN DE LA FAMA</h1>' +
        '<p class="muted" style="margin:18px 0 0">Las diez mejores marcas de cada cartucho de la bóveda.</p>' +
      '</div>' +
      '<div class="tabs-row">' + tabs + '</div>' +
      '<div class="panel">' +
        '<div class="table-head"><div>RANGO</div><div>JUGADOR</div><div class="score-cell">PUNTUACIÓN</div><div class="date-cell">FECHA</div></div>' +
        rows +
      '</div>' +
      '<p class="fineprint" style="text-align:left;margin-top:22px">Datos leídos de localStorage. En producción, esta tabla se alimentaría del endpoint <span class="neon-cyan">GET /api/scores/:juego</span>.</p>' +
    '</section>';
  },
  mount: function () {}
};
