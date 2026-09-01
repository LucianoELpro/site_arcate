window.AV = window.AV || {};

// Pantalla de juego: bezel CRT + demo jugable en canvas (NEÓN SERPIENTE).
// Para cartuchos externos, usa el iframe aislado: AV.Player.loadCartridge('juegos/mi-juego.html')
AV.Player = {
  COLS: 24, ROWS: 18, CELL: 20,

  render: function (state) {
    var g = AV.byId(state.gameId);
    var inner = g.playable
      ? '<canvas id="game-canvas" width="480" height="360"></canvas>'
      : '<div class="cartridge"><div>' +
          '<div class="spinner"></div>' +
          '<div class="pixel" style="font-size:11px;color:var(--cyan);line-height:1.9">CARGANDO CARTUCHO</div>' +
          '<p class="muted" style="margin:18px auto 0;max-width:44ch;line-height:1.8">Este contenedor es un iframe aislado: aquí se monta el archivo HTML del juego externo. Llama a AV.Player.loadCartridge(ruta) con la ruta del cartucho.</p>' +
        '</div></div>';

    return '<section class="screen wrap wrap-narrow" style="padding-top:34px">' +
      '<div class="hud">' +
        '<div class="hud-stats">' +
          '<div><div class="label">PUNTUACIÓN</div><div class="hud-val neon-cyan">' + AV.fmt(state.score) + '</div></div>' +
          '<div><div class="label">VIDAS</div><div class="hud-val neon-magenta">' + ('♥'.repeat(Math.max(0, state.lives)) || '—') + '</div></div>' +
          '<div><div class="label">NIVEL</div><div class="hud-val neon-yellow">' + String(state.level).padStart(2, '0') + '</div></div>' +
          '<div><div class="label">JUGADOR</div><div style="font-size:14px;letter-spacing:1px;margin-top:9px">' + AV.esc(state.user ? state.user.name : 'INVITADO') + '</div></div>' +
        '</div>' +
        '<div style="display:flex;gap:10px">' +
          '<div class="btn btn-yellow" data-action="pause">' + (state.paused ? 'SEGUIR' : 'PAUSA') + '</div>' +
          '<div class="btn btn-magenta" data-action="quit">SALIR</div>' +
        '</div>' +
      '</div>' +
      '<div class="bezel"><div class="screen-inner">' + inner + '</div>' +
        '<div class="controls-bar"><div>' + g.controls + '</div><div>ESPACIO · PAUSA</div></div>' +
      '</div>' +
    '</section>';
  },

  mount: function (state) {
    var g = AV.byId(state.gameId);
    if (!g.playable) return;
    this.state = state;
    this.canvas = document.getElementById('game-canvas');
    if (!this.canvas) return;
    if (!this.g) this.reset();
    this.draw();
    this.start();
  },

  loadCartridge: function (src) {
    var host = document.querySelector('.screen-inner');
    if (host) host.innerHTML = '<iframe id="game-frame" src="' + src + '" sandbox="allow-scripts"></iframe>';
  },

  reset: function () {
    this.g = {
      snake: [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }],
      dir: { x: 1, y: 0 }, next: null, food: { x: 17, y: 9 }, eaten: 0
    };
  },

  speed: function () { return Math.max(55, 110 - (this.state.level - 1) * 8); },

  start: function () {
    var self = this;
    this.runId = (this.runId || 0) + 1;
    var id = this.runId;
    clearTimeout(this.timer);
    (function tick() {
      if (id !== self.runId) return;
      try { self.step(); } catch (e) { console.error(e); }
      self.timer = setTimeout(tick, self.speed());
    })();
  },

  stop: function () { this.runId = (this.runId || 0) + 1; clearTimeout(this.timer); },

  turn: function (dx, dy) {
    if (!this.g) return;
    var d = this.g.dir;
    if (dx === -d.x && dy === -d.y) return;
    this.g.next = { x: dx, y: dy };
  },

  placeFood: function () {
    var busy = {}, p;
    this.g.snake.forEach(function (s) { busy[s.x + ',' + s.y] = 1; });
    do { p = { x: Math.floor(Math.random() * this.COLS), y: Math.floor(Math.random() * this.ROWS) }; }
    while (busy[p.x + ',' + p.y]);
    this.g.food = p;
  },

  step: function () {
    var st = this.state;
    if (!this.g || st.paused || st.gameOver || st.route !== 'play') return;
    var g = this.g;
    if (g.next) { g.dir = g.next; g.next = null; }
    var head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };
    var wall = head.x < 0 || head.y < 0 || head.x >= this.COLS || head.y >= this.ROWS;
    var self_ = g.snake.some(function (p) { return p.x === head.x && p.y === head.y; });
    if (wall || self_) return this.die();
    g.snake.unshift(head);
    if (head.x === g.food.x && head.y === g.food.y) {
      g.eaten++;
      this.placeFood();
      st.score += 10 * st.level;
      st.level = 1 + Math.floor(g.eaten / 5);
      AV.App.refreshHud();
    } else {
      g.snake.pop();
    }
    this.draw();
  },

  die: function () {
    var st = this.state;
    st.lives -= 1;
    if (st.lives > 0) {
      this.reset();
      this.draw();
      AV.App.refreshHud();
    } else {
      this.stop();
      st.lives = 0;
      st.gameOver = true;
      AV.App.render();
    }
  },

  draw: function () {
    var c = this.canvas, cs = this.CELL, x, y;
    if (!c || !this.g) return;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#05050a';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = 'rgba(0,245,255,.07)';
    ctx.lineWidth = 1;
    for (x = 0; x <= this.COLS; x++) { ctx.beginPath(); ctx.moveTo(x * cs, 0); ctx.lineTo(x * cs, c.height); ctx.stroke(); }
    for (y = 0; y <= this.ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * cs); ctx.lineTo(c.width, y * cs); ctx.stroke(); }
    var f = this.g.food;
    ctx.shadowBlur = 18; ctx.shadowColor = '#ff006e'; ctx.fillStyle = '#ff006e';
    ctx.fillRect(f.x * cs + 5, f.y * cs + 5, cs - 10, cs - 10);
    this.g.snake.forEach(function (p, i) {
      ctx.shadowColor = i === 0 ? '#f5ff00' : '#00f5ff';
      ctx.shadowBlur = i === 0 ? 22 : 12;
      ctx.fillStyle = i === 0 ? '#f5ff00' : '#00f5ff';
      ctx.globalAlpha = i === 0 ? 1 : Math.max(.35, 1 - i * 0.03);
      ctx.fillRect(p.x * cs + 2, p.y * cs + 2, cs - 4, cs - 4);
    });
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  }
};

// Modal de fin de partida
AV.GameOver = {
  render: function (state) {
    if (!state.gameOver) return state.paused ? '<div class="pause-back"><div class="pause-text">PAUSA</div></div>' : '';
    var submit = state.saved
      ? '<div class="typed" id="typed"></div>'
      : '<div style="margin-top:28px;display:flex;flex-direction:column;gap:12px">' +
          '<input class="input" id="score-name" style="text-align:center;letter-spacing:2px" placeholder="Tu nombre o iniciales">' +
          '<div class="btn btn-primary" style="padding:16px;font-size:11px" data-action="save">GUARDAR PUNTUACIÓN</div>' +
        '</div>';
    var guest = (!state.user || state.user.guest)
      ? '<p class="fineprint" style="margin-top:22px">Estás jugando como invitado: la puntuación se guarda solo en este navegador.</p>' : '';

    return '<div class="modal-back"><div class="modal">' +
      '<div class="pixel neon-magenta" style="font-size:clamp(16px,4vw,24px)">FIN DEL JUEGO</div>' +
      '<div class="label" style="margin:26px 0 6px;letter-spacing:2px">PUNTUACIÓN FINAL</div>' +
      '<div class="final">' + AV.fmt(state.score) + '</div>' + submit + guest +
      '<div class="modal-actions">' +
        '<div class="btn btn-yellow" data-action="play" data-game="' + state.gameId + '">JUGAR DE NUEVO</div>' +
        '<div class="btn btn-ghost" data-action="goto" data-route="lib">VOLVER AL VAULT</div>' +
      '</div>' +
    '</div></div>';
  },

  typewriter: function () {
    var el = document.getElementById('typed');
    if (!el) return;
    var msg = 'PUNTUACIÓN GUARDADA', i = 0;
    clearInterval(this.t);
    this.t = setInterval(function () {
      i++;
      el.textContent = msg.slice(0, i) + '_';
      if (i >= msg.length) clearInterval(AV.GameOver.t);
    }, 60);
  }
};
