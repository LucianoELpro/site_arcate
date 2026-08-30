window.AV = window.AV || {};

AV.Nav = {
  render: function (state) {
    var authSide = state.user
      ? '<div style="display:flex;align-items:center;gap:10px">' +
          '<div class="avatar">' + AV.esc(state.user.name.charAt(0)) + '</div>' +
          '<div style="font-size:12px;letter-spacing:1px">' + AV.esc(state.user.name) + '</div>' +
          '<div class="nav-link" data-action="logout" style="font-size:11px">Salir</div>' +
        '</div>'
      : '<div class="btn btn-primary" data-action="goto" data-route="auth">INICIAR SESIÓN</div>';

    document.getElementById('navbar').innerHTML =
      '<div class="brand" data-action="goto" data-route="lib">' +
        '<span class="neon-cyan">ARCADE</span><span class="neon-magenta"> VAULT</span></div>' +
      '<div class="nav-links">' +
        '<div class="nav-link ' + (state.route === 'lib' ? 'active' : '') + '" data-action="goto" data-route="lib">Biblioteca</div>' +
        '<div class="nav-link ' + (state.route === 'hall' ? 'active' : '') + '" data-action="goto" data-route="hall">Salón de la Fama</div>' +
        '<div style="width:1px;height:22px;background:rgba(0,245,255,.25)"></div>' + authSide +
      '</div>' +
      '<div class="burger" data-action="menu"><span></span><span></span><span></span></div>';

    document.getElementById('mobile-menu').innerHTML = state.menuOpen
      ? '<div class="drawer">' +
          '<div class="close" data-action="menu">X</div>' +
          '<div class="item" data-action="goto" data-route="lib">BIBLIOTECA</div>' +
          '<div class="item" data-action="goto" data-route="hall">SALÓN DE LA FAMA</div>' +
          '<div class="btn btn-primary" style="margin-top:auto" data-action="goto" data-route="auth">MI CUENTA</div>' +
        '</div>'
      : '';
  }
};
