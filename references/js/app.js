window.AV = window.AV || {};

AV.App = (function () {
  var state = {
    route: 'lib', gameId: 'serpiente', hallId: 'serpiente',
    query: '', cat: 'TODOS', user: null, authTab: 'login', menuOpen: false,
    score: 0, lives: 3, level: 1, paused: false, gameOver: false, saved: false
  };

  var SCREENS = { lib: 'Library', detail: 'Detail', play: 'Player', auth: 'Auth', hall: 'Hall' };

  function render(opts) {
    opts = opts || {};
    var mod = AV[SCREENS[state.route]];
    document.getElementById('app').innerHTML = mod.render(state);
    document.getElementById('overlay').innerHTML = state.route === 'play' ? AV.GameOver.render(state) : '';
    AV.Nav.render(state);
    if (mod.mount) mod.mount(state);
    if (state.saved) AV.GameOver.typewriter();
    if (opts.keepFocus) {
      var el = document.getElementById(opts.keepFocus);
      if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
    }
  }

  function refreshHud() {
    if (state.route !== 'play') return;
    var hud = document.querySelector('.hud-stats');
    if (!hud) return;
    var vals = hud.querySelectorAll('.hud-val');
    if (vals[0]) vals[0].textContent = AV.fmt(state.score);
    if (vals[1]) vals[1].textContent = '♥'.repeat(Math.max(0, state.lives)) || '—';
    if (vals[2]) vals[2].textContent = String(state.level).padStart(2, '0');
  }

  function goto(route) {
    if (state.route === 'play' && route !== 'play') AV.Player.stop();
    state.route = route;
    state.menuOpen = false;
    render();
    window.scrollTo(0, 0);
  }

  function play(id) {
    AV.Player.stop();
    AV.Player.g = null;
    state.gameId = id || state.gameId;
    state.route = 'play';
    state.score = 0; state.lives = 3; state.level = 1;
    state.paused = false; state.gameOver = false; state.saved = false;
    render();
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-action]');
    if (!t) return;
    var a = t.dataset.action;

    if (a === 'goto') goto(t.dataset.route);
    else if (a === 'menu') { state.menuOpen = !state.menuOpen; AV.Nav.render(state); }
    else if (a === 'cat') { state.cat = t.dataset.cat; render(); }
    else if (a === 'detail') { state.gameId = t.dataset.game; goto('detail'); }
    else if (a === 'play') play(t.dataset.game);
    else if (a === 'pause') { state.paused = !state.paused; render(); }
    else if (a === 'quit') { AV.Player.stop(); goto('lib'); }
    else if (a === 'hall') { state.hallId = t.dataset.game; render(); }
    else if (a === 'tab') { state.authTab = t.dataset.tab; render(); }
    else if (a === 'logout') { state.user = null; render(); }
    else if (a === 'guest') { state.user = { name: 'INVITADO', guest: true }; goto('lib'); }
    else if (a === 'login') { state.user = { name: (state.authUser || 'JUGADOR_01').toUpperCase(), guest: false }; goto('lib'); }
    else if (a === 'save') {
      var input = document.getElementById('score-name');
      var name = ((input && input.value) || (state.user && state.user.name) || 'INVITADO').toUpperCase().slice(0, 14);
      AV.Storage.push(state.gameId, { player: name, score: state.score, date: new Date().toISOString().slice(0, 10) });
      state.saved = true;
      render();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (state.route !== 'play') return;
    if (e.key === ' ') { e.preventDefault(); state.paused = !state.paused; render(); return; }
    var map = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
                w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
    var m = map[e.key] || map[String(e.key).toLowerCase()];
    if (!m) return;
    e.preventDefault();
    AV.Player.turn(m[0], m[1]);
  });

  state.authUser = '';
  render();

  return { render: render, refreshHud: refreshHud, state: state, goto: goto, play: play };
})();
