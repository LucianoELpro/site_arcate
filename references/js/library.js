window.AV = window.AV || {};

AV.Library = {
  render: function (state) {
    var q = state.query.trim().toLowerCase();
    var games = AV.GAMES.filter(function (g) {
      var okCat = state.cat === 'TODOS' || g.category === state.cat;
      var okQ = !q || (g.title + ' ' + g.blurb + ' ' + g.category).toLowerCase().indexOf(q) >= 0;
      return okCat && okQ;
    });

    var chips = AV.CATS.map(function (c) {
      return '<div class="chip ' + (state.cat === c ? 'active' : '') + '" data-action="cat" data-cat="' + c + '">' + c + '</div>';
    }).join('');

    var cards = games.map(function (g) {
      return '<article class="card">' +
        '<div class="cover" style="background:' + g.grad + '">' +
          '<div class="cover-label">[ PORTADA · ' + g.slug + ' ]</div>' +
          '<div class="cover-cat">' + g.category + '</div>' +
        '</div>' +
        '<div class="card-body">' +
          '<h3 class="card-title">' + AV.esc(g.title) + '</h3>' +
          '<p class="card-blurb">' + AV.esc(g.blurb) + '</p>' +
          '<div class="card-foot">' +
            '<div><div class="label">MEJOR PUNTUACIÓN</div><div class="best">' + AV.Storage.best(g.id) + '</div></div>' +
            '<div class="btn btn-outline" data-action="detail" data-game="' + g.id + '">JUGAR</div>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');

    var empty = '<div class="empty"><div class="pixel" style="font-size:14px;color:var(--magenta)">SIN RESULTADOS</div>' +
      '<p class="muted" style="margin-top:16px">Ningún cartucho coincide con esa búsqueda.</p></div>';

    return '<section class="screen wrap">' +
      '<div class="hero">' +
        '<div class="hero-row">' +
          '<img class="hero-gif" src="' + AV.HERO_GIF + '" alt="">' +
          '<h1 class="title">ARCADE VAULT</h1>' +
        '</div>' +
        '<p class="subtitle">INSERTA UNA MONEDA PARA JUGAR</p>' +
        '<p class="muted" style="margin:16px 0 0">' + AV.GAMES.length + ' cartuchos en la bóveda · puntuaciones guardadas en este navegador</p>' +
      '</div>' +
      '<div class="toolbar">' +
        '<input class="search" id="search" placeholder="Buscar un juego por nombre..." value="' + AV.esc(state.query) + '">' +
        '<div class="chips">' + chips + '</div>' +
      '</div>' +
      (games.length ? '<div class="grid">' + cards + '</div>' : empty) +
    '</section>';
  },

  mount: function (state) {
    var input = document.getElementById('search');
    if (!input) return;
    input.addEventListener('input', function () {
      state.query = input.value;
      AV.App.render({ keepFocus: 'search' });
    });
  }
};
