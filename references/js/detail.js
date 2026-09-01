window.AV = window.AV || {};

AV.Detail = {
  render: function (state) {
    var g = AV.byId(state.gameId);
    var rows = AV.Storage.top(g.id, 10).map(function (r, i) {
      var medal = ['g1','g2','g3'][i] || '';
      return '<div class="mini-row" style="animation-delay:' + (i * 55) + 'ms">' +
        '<div class="rank ' + medal + '">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<div class="player-name">' + AV.esc(r.player) + '</div>' +
        '<div style="text-align:right">' +
          '<div class="score-cell ' + medal + '">' + AV.fmt(r.score) + '</div>' +
          '<div class="date-cell" style="margin-top:4px">' + r.date + '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    return '<section class="screen wrap">' +
      '<div class="btn btn-ghost" style="margin-bottom:28px" data-action="goto" data-route="lib">◄ VOLVER AL VAULT</div>' +
      '<div class="detail">' +
        '<div>' +
          '<div class="detail-cover" style="background:' + g.grad + '"><div class="cover-label">[ ARTE DE PORTADA ]</div></div>' +
          '<h1 class="pixel neon-yellow" style="margin:0;font-size:clamp(20px,4vw,34px);line-height:1.4">' + AV.esc(g.title) + '</h1>' +
          '<div class="tags"><div class="tag">' + g.category + '</div><div class="tag m">' + g.year + '</div><div class="tag y">1 JUGADOR</div></div>' +
          '<p class="lead">' + AV.esc(g.long) + '</p>' +
          '<div class="actions">' +
            '<div class="btn btn-cta" data-action="play" data-game="' + g.id + '">JUGAR AHORA</div>' +
            '<div class="btn btn-outline" style="padding:19px 30px;font-size:13px" data-action="goto" data-route="lib">VOLVER AL VAULT</div>' +
          '</div>' +
        '</div>' +
        '<div class="panel">' +
          '<div class="panel-head">MEJORES PUNTUACIONES</div>' + rows +
        '</div>' +
      '</div>' +
    '</section>';
  },
  mount: function () {}
};
