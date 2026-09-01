window.AV = window.AV || {};

// Pantalla de autenticación. Los envíos son simulados:
// conecta submitAuth con POST /api/auth/login | /api/auth/register (o Supabase Auth).
AV.Auth = {
  render: function (state) {
    var reg = state.authTab === 'register';
    return '<section class="screen auth-wrap"><div class="auth-card">' +
      '<div class="pixel" style="text-align:center;font-size:15px;margin-bottom:30px">' +
        '<span class="neon-cyan">ARCADE</span><span class="neon-magenta"> VAULT</span></div>' +
      '<div class="tabs">' +
        '<div class="tab ' + (reg ? '' : 'active') + '" data-action="tab" data-tab="login">INICIAR SESIÓN</div>' +
        '<div class="tab ' + (reg ? 'active' : '') + '" data-action="tab" data-tab="register">CREAR CUENTA</div>' +
      '</div>' +
      '<label class="field"><div class="field-label">USUARIO</div>' +
        '<input class="input" id="auth-user" placeholder="jugador_01" value="' + AV.esc(state.authUser) + '"></label>' +
      (reg ? '<label class="field"><div class="field-label">CORREO ELECTRÓNICO</div>' +
        '<input class="input" type="email" placeholder="tu@correo.com"></label>' : '') +
      '<label class="field"><div class="field-label">CONTRASEÑA</div>' +
        '<input class="input" type="password" placeholder="••••••••"></label>' +
      '<div class="btn btn-primary" style="width:100%;padding:17px;font-size:11px" data-action="login">' +
        (reg ? 'CREAR CUENTA' : 'ENTRAR') + '</div>' +
      '<div class="divider"><span></span><em>O CONTINÚA CON</em><span></span></div>' +
      '<div class="social"><div data-action="login">Google</div><div data-action="login">GitHub</div></div>' +
      '<div class="guest" data-action="guest">JUGAR COMO INVITADO</div>' +
      '<p class="fineprint">Sin cuenta, las puntuaciones no se guardan en el servidor. Aquí conectaría la API de autenticación (REST o Supabase).</p>' +
    '</div></section>';
  },

  mount: function (state) {
    var el = document.getElementById('auth-user');
    if (el) el.addEventListener('input', function () { state.authUser = el.value; });
  }
};
