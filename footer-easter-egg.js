/* ── YEAR MENU ── */
(function() {
  var isMobile = window.innerWidth < 900 || 'ontouchstart' in window;

  function triggerDarkMode() {
    var isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', isDark);
  }

  var items = [
    { label: '📖 What even is 2026?', action: function() { window.open('https://en.wikipedia.org/wiki/2026','_blank','noopener'); } },
    { label: '🪩 Party mode',         action: function() { triggerPartyMode(); } },
    { label: '🖥️ View source (retro)', action: function() { triggerViewSource(); } },
    { label: '👾 Play Galaga',         action: function() { if (typeof triggerGalaga === 'function') triggerGalaga(); }, desktopOnly: true },
    { label: '🛷 Line Rider',          action: function() { triggerLineRider(); }, desktopOnly: true },
    { get label() { return document.documentElement.classList.contains('dark') ? '☀️ Light mode' : '🌙 Dark mode'; }, action: function() { triggerDarkMode(); } },
  ];

  window.closeYearMenu = function() {
    document.getElementById('yearMenu').style.display = 'none';
  };
  function closeYearMenu() { window.closeYearMenu(); }

  window.toggleYearMenu = function(e) {
    e.stopPropagation();
    var menu = document.getElementById('yearMenu');
    if (menu.style.display === 'none') {
      if (window.closeMedfordMenu) window.closeMedfordMenu();
      menu.innerHTML = '';
      items.forEach(function(item) {
        if (item.desktopOnly && isMobile) return;
        var btn = document.createElement('button');
        btn.textContent = item.label;
        btn.className = 'fmenu-btn';
        btn.onclick = function() { closeYearMenu(); item.action(); };
        menu.appendChild(btn);
      });
      menu.style.display = 'block';
    } else {
      closeYearMenu();
    }
  };

  document.addEventListener('click', function(e) {
    if (!document.getElementById('yearMenuWrap').contains(e.target)) closeYearMenu();
  });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeYearMenu(); });

  /* ── PARTY MODE ── */
  window.triggerPartyMode = function() {
    if (document.getElementById('party-overlay')) return;

    var overlay = document.createElement('div');
    overlay.id = 'party-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99990;overflow:hidden;';

    var ball = document.createElement('div');
    ball.style.cssText = 'position:absolute;top:8%;left:50%;transform:translateX(-50%);width:90px;height:90px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff 0%,#ccc 30%,#888 60%,#444 100%);box-shadow:0 0 40px 10px rgba(255,255,255,0.4);animation:discospin 2s linear infinite;pointer-events:auto;cursor:pointer;';
    ball.title = 'Click to stop the party';
    ball.onclick = function() { stopParty(); };

    var rays = document.createElement('div');
    rays.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;animation:rayrotate 3s linear infinite;pointer-events:none;';
    for (var r = 0; r < 8; r++) {
      var ray = document.createElement('div');
      var hue = (r * 45) % 360;
      ray.style.cssText = 'position:absolute;top:14%;left:50%;width:3px;height:60%;background:linear-gradient(to bottom,hsla('+hue+',100%,70%,0.6),transparent);transform-origin:top center;transform:rotate('+(r*45)+'deg);border-radius:2px;';
      rays.appendChild(ray);
    }

    overlay.appendChild(rays);
    overlay.appendChild(ball);

    var colors = ['#4a9edd','#f9c74f','#f94144','#43aa8b','#f3722c','#c77dff','#ffffff'];
    var pieces = [];
    for (var i = 0; i < 120; i++) {
      var p = document.createElement('div');
      var c = colors[i % colors.length];
      var size = 6 + Math.random() * 8;
      p.style.cssText = 'position:absolute;width:'+size+'px;height:'+size+'px;background:'+c+';border-radius:'+(Math.random()>0.5?'50%':'2px')+';left:'+(Math.random()*100)+'%;top:-20px;opacity:0.9;';
      var vx = (Math.random()-0.5)*3, vy = 2+Math.random()*3, rot = Math.random()*360, rotV = (Math.random()-0.5)*8;
      pieces.push({ el:p, x:parseFloat(p.style.left), y:-20, vx:vx, vy:vy, rot:rot, rotV:rotV });
      overlay.appendChild(p);
    }

    document.body.appendChild(overlay);

    if (!document.getElementById('party-styles')) {
      var style = document.createElement('style');
      style.id = 'party-styles';
      style.textContent = '@keyframes discospin{to{transform:translateX(-50%) rotate(360deg)}} @keyframes rayrotate{to{transform:rotate(360deg)}}';
      document.head.appendChild(style);
    }

    var raf;
    function animateConfetti() {
      pieces.forEach(function(p) {
        p.x += p.vx; p.y += p.vy; p.rot += p.rotV; p.vy += 0.05;
        p.el.style.left = p.x + '%';
        p.el.style.top = p.y + 'px';
        p.el.style.transform = 'rotate('+p.rot+'deg)';
        if (p.y > window.innerHeight + 20) { p.y = -20; p.x = Math.random()*100; p.vy = 2+Math.random()*3; }
      });
      raf = requestAnimationFrame(animateConfetti);
    }
    animateConfetti();

    var stopBtn = document.createElement('button');
    stopBtn.textContent = 'ESC · Stop the party';
    stopBtn.style.cssText = 'position:absolute;bottom:1.5rem;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.55);backdrop-filter:blur(6px);color:rgba(255,255,255,0.8);border:1px solid rgba(255,255,255,0.2);border-radius:20px;padding:0.35rem 1rem;font-family:"DM Mono",monospace;font-size:0.62rem;letter-spacing:0.1em;cursor:pointer;pointer-events:auto;white-space:nowrap;';
    stopBtn.onclick = function() { stopParty(); };
    overlay.appendChild(stopBtn);

    overlay._stopRaf = function() { cancelAnimationFrame(raf); };

    function escStop(e) { if (e.key === 'Escape') { stopParty(); } }
    function clickStop() { if (!document.getElementById('party-overlay')) return; stopParty(); }
    document.addEventListener('keydown', escStop);
    setTimeout(function() { document.addEventListener('click', clickStop); }, 300);
    overlay._cleanup = function() { document.removeEventListener('keydown', escStop); document.removeEventListener('click', clickStop); };

    overlay._autoStop = setTimeout(stopParty, 15000);
  };

  function stopParty() {
    var o = document.getElementById('party-overlay');
    if (!o) return;
    clearTimeout(o._autoStop);
    o._stopRaf();
    if (o._cleanup) o._cleanup();
    o.remove();
  }

  /* ── WIN98 VIEW SOURCE ── */
  window.triggerViewSource = function() {
    if (document.getElementById('win98-overlay')) return;

    var win = document.createElement('div');
    win.id = 'win98-overlay';
    win.style.cssText = 'position:fixed;inset:0;z-index:99998;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.4);';

    win.innerHTML = [
      '<div style="width:480px;max-width:92vw;font-family:\'Courier New\',monospace;font-size:0.78rem;background:#c0c0c0;border:2px solid;border-color:#fff #808080 #808080 #fff;box-shadow:2px 2px 0 #000;">',
        '<div style="background:linear-gradient(90deg,#000080,#1084d0);color:#fff;padding:3px 6px;display:flex;justify-content:space-between;align-items:center;cursor:default;user-select:none;">',
          '<span>Source of: https://dayne.design/</span>',
          '<button class="win98-close" style="background:#c0c0c0;border:1px solid;border-color:#fff #808080 #808080 #fff;width:16px;height:14px;font-size:0.6rem;line-height:1;cursor:pointer;padding:0;">✕</button>',
        '</div>',
        '<div style="background:#fff;margin:4px;padding:10px;height:220px;overflow-y:auto;border:2px inset #808080;white-space:pre;line-height:1.6;color:#000;">',
          '&lt;!DOCTYPE html&gt;\n&lt;html lang="en"&gt;\n&lt;head&gt;\n  &lt;meta charset="UTF-8"&gt;\n  &lt;title&gt;Dayne Petera — Product Designer&lt;/title&gt;\n  &lt;!-- handcrafted with love --&gt;\n  &lt;!-- no frameworks were harmed --&gt;\n  &lt;!-- just vibes and vanilla JS --&gt;\n&lt;/head&gt;\n&lt;body&gt;\n  &lt;!-- hello curious person 👋 --&gt;\n  ...\n&lt;/body&gt;\n&lt;/html&gt;',
        '</div>',
        '<div style="padding:8px;display:flex;gap:6px;justify-content:space-between;align-items:center;">',
          '<a href="https://github.com/dayne-train/daynedesign" target="_blank" rel="noopener noreferrer" style="color:#000080;font-size:0.72rem;">View actual source on GitHub ↗</a>',
          '<div style="display:flex;gap:6px;">',
            '<button id="goRetroBtn" style="background:#c0c0c0;border:2px solid;border-color:#fff #808080 #808080 #fff;padding:2px 14px;cursor:pointer;font-family:inherit;font-size:0.78rem;">🖥️ Go Retro</button>',
            '<button class="win98-close" style="background:#c0c0c0;border:2px solid;border-color:#fff #808080 #808080 #fff;padding:2px 14px;cursor:pointer;font-family:inherit;font-size:0.78rem;">OK</button>',
          '</div>',
        '</div>',
      '</div>',
    ].join('');

    document.body.appendChild(win);

    win.querySelectorAll('.win98-close').forEach(function(btn) { btn.addEventListener('click', cleanup); });
    document.getElementById('goRetroBtn').addEventListener('click', function() { window.location.href = 'retro.html'; });
    win.addEventListener('click', function(e) { if (e.target === win) cleanup(); });
    document.addEventListener('keydown', function esc(e) { if (e.key==='Escape') { cleanup(); document.removeEventListener('keydown',esc); } });

    var box = win.querySelector('div');
    var titleBar = box.querySelector('div');
    var dragging = false, ox = 0, oy = 0;

    titleBar.style.cursor = 'move';

    titleBar.addEventListener('mousedown', function(e) {
      if (e.target.classList.contains('win98-close')) return;
      var r = box.getBoundingClientRect();
      box.style.position = 'absolute';
      box.style.left = r.left + 'px';
      box.style.top  = r.top  + 'px';
      box.style.margin = '0';
      win.style.alignItems = 'flex-start';
      win.style.justifyContent = 'flex-start';
      ox = e.clientX - r.left;
      oy = e.clientY - r.top;
      dragging = true;
      e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
      if (!dragging) return;
      var x = Math.max(0, Math.min(e.clientX - ox, window.innerWidth  - box.offsetWidth));
      var y = Math.max(0, Math.min(e.clientY - oy, window.innerHeight - box.offsetHeight));
      box.style.left = x + 'px';
      box.style.top  = y + 'px';
    });

    document.addEventListener('mouseup', function() { dragging = false; });

    var arrowSVG   = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 20 24"><polygon points="0,0 0,20 5,15 8,23 11,21 8,13 14,13" fill="white" stroke="black" stroke-width="1.5" stroke-linejoin="round"/></svg>';
    var pointerSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 20 24"><path d="M6 1 C6 1 5 1 5 2 L5 14 L3 12 C3 12 2 11 1 12 C0 13 1 14 1 14 L6 21 C6 21 8 24 12 24 C16 24 18 21 18 18 L18 10 C18 10 18 9 17 9 C16 9 16 10 16 10 L16 14 C16 14 15 13 14 13 L14 8 C14 8 14 7 13 7 C12 7 12 8 12 8 L12 13 C12 13 11 12 10 12 L10 3 C10 3 10 2 9 2 C8 2 8 3 8 3 L8 13 C8 13 7 12 6 12 L6 2 C6 2 6 1 6 1Z" fill="white" stroke="black" stroke-width="1" stroke-linejoin="round"/></svg>';

    var arrowURI   = 'data:image/svg+xml,' + encodeURIComponent(arrowSVG);
    var pointerURI = 'data:image/svg+xml,' + encodeURIComponent(pointerSVG);

    var currentURI = arrowURI;
    var insideWin  = false;

    win.style.cursor = 'none';
    win.querySelectorAll('button, a').forEach(function(el) { el.style.cursor = 'none'; });

    var cursor = document.createElement('div');
    cursor.style.cssText = 'position:fixed;width:20px;height:24px;pointer-events:none;z-index:99999;background:url("'+currentURI+'") no-repeat;background-size:contain;display:none;';
    document.body.appendChild(cursor);

    var trailCount = 7;
    var trail = [];
    for (var t = 0; t < trailCount; t++) {
      var ghost = document.createElement('div');
      var op = (0.55 - t * 0.07).toFixed(2);
      var sc = (1 - t * 0.06).toFixed(2);
      ghost.style.cssText = 'position:fixed;width:20px;height:24px;pointer-events:none;z-index:'+(99997-t)+';background:url("'+currentURI+'") no-repeat;background-size:contain;opacity:'+op+';transform-origin:top left;transform:scale('+sc+');display:none;';
      document.body.appendChild(ghost);
      trail.push({ el: ghost, uri: currentURI });
    }

    function setCursorType(uri) {
      currentURI = uri;
      cursor.style.backgroundImage = 'url("' + uri + '")';
    }

    win.addEventListener('mouseover', function(e) {
      var el = e.target.closest('button, a');
      setCursorType(el ? pointerURI : arrowURI);
    });

    win.addEventListener('mouseenter', function() {
      insideWin = true;
      cursor.style.display = 'block';
    });
    win.addEventListener('mouseleave', function() {
      insideWin = false;
      cursor.style.display = 'none';
      trail.forEach(function(d) { d.el.style.display = 'none'; });
      positions.length = 0;
    });

    var positions = [];
    function onMove(e) {
      if (!insideWin) return;
      var x = e.clientX, y = e.clientY;
      cursor.style.left = x + 'px';
      cursor.style.top  = y + 'px';
      positions.unshift({ x: x, y: y, uri: currentURI });
      if (positions.length > trailCount * 5) positions.length = trailCount * 5;
      trail.forEach(function(d, i) {
        var p = positions[(i + 1) * 4];
        if (!p) return;
        d.el.style.display = 'block';
        d.el.style.left = p.x + 'px';
        d.el.style.top  = p.y + 'px';
        d.el.style.backgroundImage = 'url("' + p.uri + '")';
      });
    }
    win.addEventListener('mousemove', onMove);
    document.addEventListener('mousemove', function(e) {
      if (dragging) onMove(e);
    });

    function cleanup() {
      win.remove();
      cursor.remove();
      trail.forEach(function(d) { d.el.remove(); });
    }
  };

  /* ── LINE RIDER ── */
  window.triggerLineRider = function() {
    if (document.getElementById('lr-wrap')) return;

    var W = window.innerWidth, H = window.innerHeight;

    // ── State ──
    var lines = [];
    var STATE = 'DRAW';
    var rafId = null;
    var drawStart = null;  // world coords
    var mousePos  = null;  // world coords
    var rider = { x: 0, y: 0, vx: 0, vy: 0, angle: 0, alive: false };
    var riderTrail = [];
    var toastEl = null;

    // ── Camera ──
    var cam = { x: 0, y: 0, scale: 1 };
    var isPanning = false;
    var panLastX = 0, panLastY = 0;

    function screenToWorld(sx, sy) {
      return { x: (sx - cam.x) / cam.scale, y: (sy - cam.y) / cam.scale };
    }

    function zoomAt(sx, sy, factor) {
      var newScale = Math.max(0.1, Math.min(12, cam.scale * factor));
      cam.x = sx - (sx - cam.x) * (newScale / cam.scale);
      cam.y = sy - (sy - cam.y) * (newScale / cam.scale);
      cam.scale = newScale;
      updateZoomLabel();
    }

    function resetView() {
      cam.x = 0; cam.y = 0; cam.scale = 1;
      updateZoomLabel();
    }

    // ── DOM ──
    var wrap = document.createElement('div');
    wrap.id = 'lr-wrap';
    wrap.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#0d0d1a;user-select:none;font-family:"DM Mono",monospace;';

    var toolbar = document.createElement('div');
    toolbar.style.cssText = 'position:absolute;top:0;left:0;right:0;height:48px;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;padding:0 1rem;gap:0.6rem;z-index:2;border-bottom:1px solid rgba(255,255,255,0.08);box-sizing:border-box;';

    function tbBtn(label) {
      var b = document.createElement('button');
      b.textContent = label;
      b.style.cssText = 'background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.75);border:1px solid rgba(255,255,255,0.18);border-radius:6px;padding:0.28rem 0.7rem;font-family:"DM Mono",monospace;font-size:0.7rem;letter-spacing:0.06em;cursor:pointer;white-space:nowrap;';
      b.onmouseenter = function() { b.style.background = 'rgba(255,255,255,0.13)'; };
      b.onmouseleave = function() { b.style.background = b._sky ? 'rgba(74,158,221,0.25)' : 'rgba(255,255,255,0.07)'; };
      return b;
    }

    var titleEl = document.createElement('span');
    titleEl.textContent = '🛷 Line Rider';
    titleEl.style.cssText = 'color:rgba(255,255,255,0.85);font-size:0.78rem;letter-spacing:0.08em;margin-right:0.25rem;';

    var playBtn  = tbBtn('▶  Play');
    var clearBtn = tbBtn('⟳  Clear all');

    var GRAVITY_PRESETS = [
      { label: '↓ Normal', value: 0.38 },
      { label: '↓ Low',    value: 0.14 },
      { label: '↓ Moon',   value: 0.04 },
    ];
    var gravityIndex = 0;
    var gravityBtn = tbBtn(GRAVITY_PRESETS[0].label);
    gravityBtn.title = 'Cycle gravity';
    function updateGravityBtn() {
      var preset = GRAVITY_PRESETS[gravityIndex];
      gravityBtn.textContent = preset.label;
      GRAVITY = preset.value;
      var isAlt = gravityIndex > 0;
      gravityBtn._sky = isAlt;
      gravityBtn.style.background   = isAlt ? 'rgba(74,158,221,0.25)' : 'rgba(255,255,255,0.07)';
      gravityBtn.style.borderColor  = isAlt ? 'rgba(74,158,221,0.45)' : 'rgba(255,255,255,0.18)';
      gravityBtn.style.color        = isAlt ? 'rgba(74,158,221,1)'    : 'rgba(255,255,255,0.75)';
    }
    gravityBtn.addEventListener('click', function() {
      gravityIndex = (gravityIndex + 1) % GRAVITY_PRESETS.length;
      updateGravityBtn();
    });

    var sep = document.createElement('div');
    sep.style.cssText = 'width:1px;height:20px;background:rgba(255,255,255,0.1);margin:0 0.1rem;';

    var zoomOutBtn = tbBtn('−');
    zoomOutBtn.title = 'Zoom out (pinch or − key)';
    var zoomLabel = document.createElement('span');
    zoomLabel.style.cssText = 'color:rgba(255,255,255,0.45);font-size:0.68rem;letter-spacing:0.04em;min-width:3.2rem;text-align:center;cursor:default;';
    zoomLabel.textContent = '100%';
    var zoomInBtn = tbBtn('+');
    zoomInBtn.title = 'Zoom in (pinch or = key)';
    var resetViewBtn = tbBtn('⌂');
    resetViewBtn.title = 'Reset view (H)';

    function updateZoomLabel() {
      zoomLabel.textContent = Math.round(cam.scale * 100) + '%';
    }

    var spacer = document.createElement('div');
    spacer.style.flex = '1';

    var hintEl = document.createElement('span');
    hintEl.textContent = 'Draw lines · Space to ride · pinch/scroll to zoom · two-finger pan';
    hintEl.style.cssText = 'color:rgba(255,255,255,0.25);font-size:0.65rem;letter-spacing:0.04em;transition:opacity 0.6s;pointer-events:none;';

    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&#x2715;';
    closeBtn.style.cssText = 'background:none;color:rgba(255,255,255,0.45);border:none;font-size:1rem;cursor:pointer;padding:0.1rem 0.35rem;line-height:1;margin-left:0.25rem;';
    closeBtn.onmouseenter = function() { closeBtn.style.color = '#fff'; };
    closeBtn.onmouseleave = function() { closeBtn.style.color = 'rgba(255,255,255,0.45)'; };
    closeBtn.onclick = quit;

    toolbar.appendChild(titleEl);
    toolbar.appendChild(playBtn);
    toolbar.appendChild(clearBtn);
    toolbar.appendChild(gravityBtn);
    toolbar.appendChild(sep);
    toolbar.appendChild(zoomOutBtn);
    toolbar.appendChild(zoomLabel);
    toolbar.appendChild(zoomInBtn);
    toolbar.appendChild(resetViewBtn);
    toolbar.appendChild(spacer);
    toolbar.appendChild(hintEl);
    toolbar.appendChild(closeBtn);

    var canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    canvas.style.cssText = 'position:absolute;top:0;left:0;display:block;';

    wrap.appendChild(toolbar);
    wrap.appendChild(canvas);
    document.body.appendChild(wrap);

    var ctx = canvas.getContext('2d');

    function setCursor(c) { canvas.style.cursor = c; }
    setCursor('crosshair');

    // ── Toast ──
    function showToast(msg) {
      if (toastEl) { toastEl.remove(); toastEl = null; }
      toastEl = document.createElement('div');
      toastEl.textContent = msg;
      toastEl.style.cssText = 'position:absolute;bottom:2.5rem;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.72);color:rgba(255,255,255,0.82);padding:0.45rem 1.1rem;border-radius:20px;font-family:"DM Mono",monospace;font-size:0.72rem;letter-spacing:0.05em;pointer-events:none;white-space:nowrap;transition:opacity 0.4s;z-index:3;';
      wrap.appendChild(toastEl);
      setTimeout(function() { if (toastEl) { toastEl.style.opacity = '0'; setTimeout(function() { if (toastEl) { toastEl.remove(); toastEl = null; } }, 420); } }, 2500);
    }

    // ── Render ──
    function render() {
      ctx.clearRect(0, 0, W, H);

      // Apply camera transform for world-space drawing
      ctx.save();
      ctx.setTransform(cam.scale, 0, 0, cam.scale, cam.x, cam.y);

      var pw = 2.5 / cam.scale; // pixel-constant line width

      // Committed lines
      ctx.strokeStyle = 'rgba(255,255,255,0.88)';
      ctx.lineWidth = pw;
      ctx.lineCap = 'round';
      for (var i = 0; i < lines.length; i++) {
        var l = lines[i];
        ctx.beginPath(); ctx.moveTo(l.x1, l.y1); ctx.lineTo(l.x2, l.y2); ctx.stroke();
      }

      // Spawn marker
      if (lines.length > 0 && STATE === 'DRAW') {
        var mr = 6 / cam.scale;
        ctx.beginPath();
        ctx.arc(lines[0].x1, lines[0].y1, mr, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(74,158,221,0.7)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(74,158,221,1)';
        ctx.lineWidth = 1.5 / cam.scale;
        ctx.stroke();
      }

      // Preview line while drawing
      if (STATE === 'DRAW' && drawStart && mousePos) {
        ctx.strokeStyle = 'rgba(255,255,255,0.32)';
        ctx.lineWidth = 2 / cam.scale;
        ctx.setLineDash([7 / cam.scale, 6 / cam.scale]);
        ctx.beginPath(); ctx.moveTo(drawStart.x, drawStart.y); ctx.lineTo(mousePos.x, mousePos.y); ctx.stroke();
        ctx.setLineDash([]);
      }

      // Rider trail
      for (var t = 0; t < riderTrail.length; t++) {
        var p = riderTrail[t];
        var a = (1 - t / riderTrail.length) * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200,164,80,' + a + ')';
        ctx.fill();
      }

      // Rider
      if (STATE !== 'DRAW' && rider.alive) {
        ctx.save();
        ctx.translate(rider.x, rider.y);
        ctx.rotate(rider.angle);

        ctx.fillStyle = '#c8a450';
        ctx.beginPath(); ctx.rect(-14, 1, 28, 6); ctx.fill();

        ctx.strokeStyle = '#8a6020';
        ctx.lineWidth = 1.5; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-13, 7); ctx.lineTo(-15, 11);
        ctx.moveTo(13, 7);  ctx.lineTo(15, 11);
        ctx.stroke();

        ctx.strokeStyle = '#e8d0a0';
        ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -11); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-8, -6); ctx.lineTo(8, -6); ctx.stroke();

        ctx.beginPath(); ctx.arc(0, -16, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = '#e8d0a0'; ctx.fill();
        ctx.strokeStyle = '#c8a450'; ctx.lineWidth = 1.5; ctx.stroke();

        ctx.restore();
      }

      ctx.restore(); // reset transform
    }

    // ── Physics ──
    var GRAVITY = 0.38;
    var FRICTION      = 0.995;  // applied once per frame on flat/downhill
    var FRICTION_UP   = 0.9995; // much less loss when climbing
    var SNAP = 11;

    function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

    function physicsStep() {
      if (!rider.alive) return;

      rider.vy += GRAVITY;
      rider.x  += rider.vx;
      rider.y  += rider.vy;

      riderTrail.unshift({ x: rider.x, y: rider.y });
      if (riderTrail.length > 10) riderTrail.length = 10;

      var onGround = false;
      var groundAngle = 0;

      for (var iter = 0; iter < 3; iter++) {
        for (var i = 0; i < lines.length; i++) {
          var l = lines[i];
          var ldx = l.x2 - l.x1, ldy = l.y2 - l.y1;
          var len2 = ldx * ldx + ldy * ldy;
          if (len2 < 1) continue;

          var t = clamp(((rider.x - l.x1) * ldx + (rider.y - l.y1) * ldy) / len2, 0, 1);
          var cx = l.x1 + t * ldx, cy = l.y1 + t * ldy;
          var ex = rider.x - cx, ey = rider.y - cy;
          var dist = Math.sqrt(ex * ex + ey * ey);

          if (dist < SNAP && dist > 0.01) {
            var nx = ex / dist, ny = ey / dist;
            if (ny > 0.15) continue;
            var vDotN = rider.vx * nx + rider.vy * ny;
            if (vDotN >= 0) continue;
            rider.x = cx + nx * SNAP;
            rider.y = cy + ny * SNAP;
            rider.vx -= vDotN * nx;
            rider.vy -= vDotN * ny;
            onGround = true;
            groundAngle = Math.atan2(ldy, ldx);
          }
        }
      }

      if (onGround) {
        // Apply friction once per frame — use lower friction when climbing to preserve momentum
        var climbing = rider.vy < -0.5;
        var fr = climbing ? FRICTION_UP : FRICTION;
        rider.vx *= fr;
        rider.vy *= fr;

        var diff = groundAngle - rider.angle;
        while (diff > Math.PI)  diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        rider.angle += diff * 0.25;
      } else {
        rider.angle *= 0.88;
      }

      var spd = Math.sqrt(rider.vx * rider.vx + rider.vy * rider.vy);
      if (spd > 28) { rider.vx = rider.vx / spd * 28; rider.vy = rider.vy / spd * 28; }

      // Far fall (world units, generous for zoomed/panned canvases)
      if (rider.y > 8000 || rider.y < -8000 || rider.x < -8000 || rider.x > 8000) {
        rider.alive = false;
        showToast('Fell off — press R to reset or Space to try again');
        setState('PAUSED');
      }
    }

    // ── Loop ──
    function loop() {
      if (STATE === 'PLAY') physicsStep();
      render();
      rafId = requestAnimationFrame(loop);
    }

    // ── State machine ──
    function setState(s) {
      STATE = s;
      if (s === 'PLAY') {
        playBtn.textContent = '⏸  Pause';
        playBtn._sky = true;
        playBtn.style.background = 'rgba(74,158,221,0.25)';
        playBtn.style.borderColor = 'rgba(74,158,221,0.45)';
        playBtn.style.color = 'rgba(74,158,221,1)';
        setCursor('default');
      } else {
        playBtn.textContent = '▶  Play';
        playBtn._sky = false;
        playBtn.style.background = 'rgba(255,255,255,0.07)';
        playBtn.style.borderColor = 'rgba(255,255,255,0.18)';
        playBtn.style.color = 'rgba(255,255,255,0.75)';
        setCursor('crosshair');
      }
    }

    function spawnRider() {
      if (lines.length === 0) { showToast('Draw some lines first!'); return false; }
      rider.x = lines[0].x1; rider.y = lines[0].y1 - 22;
      rider.vx = 0.8; rider.vy = 0; rider.angle = 0; rider.alive = true;
      riderTrail = [];
      return true;
    }

    function togglePlay() {
      if (STATE === 'DRAW') { if (!spawnRider()) return; setState('PLAY'); }
      else if (STATE === 'PLAY') { setState('PAUSED'); }
      else { if (!rider.alive && !spawnRider()) return; setState('PLAY'); }
    }

    function resetRider() {
      if (lines.length === 0) return;
      spawnRider(); setState('PAUSED');
    }

    function clearAll() {
      lines = []; riderTrail = [];
      rider.alive = false;
      drawStart = null; mousePos = null;
      setState('DRAW');
      hintEl.style.opacity = '1';
    }

    // ── Mouse: draw ──
    function evtScreen(e) {
      var r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    canvas.addEventListener('contextmenu', function(e) { e.preventDefault(); });

    canvas.addEventListener('mousedown', function(e) {
      // Right-click or middle-click → pan
      if (e.button === 2 || e.button === 1) {
        e.preventDefault();
        isPanning = true;
        panLastX = e.clientX; panLastY = e.clientY;
        setCursor('grabbing');
        return;
      }
      // Left-click → draw (only in DRAW state)
      if (e.button !== 0 || STATE !== 'DRAW') return;
      var s = evtScreen(e);
      drawStart = screenToWorld(s.x, s.y);
      mousePos  = { x: drawStart.x, y: drawStart.y };
    });

    function onWinMove(e) {
      if (isPanning) {
        cam.x += e.clientX - panLastX;
        cam.y += e.clientY - panLastY;
        panLastX = e.clientX; panLastY = e.clientY;
        return;
      }
      if (STATE !== 'DRAW' || !drawStart) return;
      var s = evtScreen(e);
      mousePos = screenToWorld(s.x, s.y);
    }

    function onWinUp(e) {
      if (isPanning) {
        isPanning = false;
        setCursor(STATE === 'DRAW' ? 'crosshair' : 'default');
        return;
      }
      if (e.button !== 0 || STATE !== 'DRAW' || !drawStart) return;
      var s = evtScreen(e);
      var end = screenToWorld(s.x, s.y);
      var dx = end.x - drawStart.x, dy = end.y - drawStart.y;
      if (dx * dx + dy * dy > 36 / (cam.scale * cam.scale)) {
        lines.push({ x1: drawStart.x, y1: drawStart.y, x2: end.x, y2: end.y });
        if (lines.length === 1) hintEl.style.opacity = '0';
      }
      drawStart = null; mousePos = null;
    }

    window.addEventListener('mousemove', onWinMove);
    window.addEventListener('mouseup', onWinUp);

    // ── Mouse / trackpad: zoom + pan ──
    canvas.addEventListener('wheel', function(e) {
      e.preventDefault();
      var s = evtScreen(e);
      if (e.ctrlKey) {
        // Trackpad pinch-to-zoom (ctrlKey is set by the OS for pinch gestures)
        // deltaY values are small floats, so use exponential scaling for smoothness
        var factor = Math.pow(1.002, -e.deltaY);
        zoomAt(s.x, s.y, factor);
      } else {
        // Two-finger scroll → pan; plain scroll wheel also pans (use +/− or toolbar to zoom)
        cam.x -= e.deltaX;
        cam.y -= e.deltaY;
      }
    }, { passive: false });

    // ── Toolbar zoom buttons ──
    zoomInBtn.addEventListener('click', function() { zoomAt(W / 2, H / 2, 1.25); });
    zoomOutBtn.addEventListener('click', function() { zoomAt(W / 2, H / 2, 1 / 1.25); });
    resetViewBtn.addEventListener('click', resetView);

    // ── Keys ──
    function onKey(e) {
      if (e.key === 'Escape') { quit(); return; }
      if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); togglePlay(); return; }
      if (e.key === 'r' || e.key === 'R') { if (e.shiftKey) clearAll(); else resetRider(); return; }
      if (e.key === 'h' || e.key === 'H') { resetView(); return; }
      if (e.key === '=') { zoomAt(W / 2, H / 2, 1.25); return; }
      if (e.key === '-') { zoomAt(W / 2, H / 2, 1 / 1.25); return; }
    }
    document.addEventListener('keydown', onKey);

    playBtn.addEventListener('click', function() { togglePlay(); });
    clearBtn.addEventListener('click', function() { clearAll(); });

    // ── Quit ──
    function quit() {
      cancelAnimationFrame(rafId);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('mousemove', onWinMove);
      window.removeEventListener('mouseup', onWinUp);
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
    }

    rafId = requestAnimationFrame(loop);
  };

})();

/* MEDFORD MENU */
(function() {
  var wrap = document.getElementById('medfordMenuWrap');
  var btn  = document.getElementById('medfordBtn');
  var menu = document.getElementById('medfordMenu');
  if (!btn || !menu) return;

  var MEDFORD = { lat: 42.3265, lon: -122.8756 };
  var CITIES = [
    { label: 'New York, NY',      miles: 2998 },
    { label: 'San Francisco, CA', miles: 362  },
    { label: 'Seattle, WA',       miles: 446  },
    { label: 'Phoenix, AZ',       miles: 1060 },
    { label: 'Moran, WY',         miles: 901  },
  ];

  var rowStyle = 'display:flex;justify-content:space-between;align-items:center;padding:0.35rem 0.75rem;gap:1.5rem;';

  function closeMenu() { menu.style.display = 'none'; }
  window.closeMedfordMenu = closeMenu;

  function clampMenu() {
    menu.style.right = '0';
    menu.style.left = 'auto';
    var rect = menu.getBoundingClientRect();
    if (rect.left < 8) {
      menu.style.right = 'auto';
      menu.style.left = (-wrap.getBoundingClientRect().left + 8) + 'px';
    }
  }

  var distanceCache = {};

  function driveDistance(lat, lon) {
    var key = lat + ',' + lon;
    if (distanceCache[key] !== undefined) return Promise.resolve(distanceCache[key]);
    var url = 'https://router.project-osrm.org/route/v1/driving/'
      + lon + ',' + lat + ';' + MEDFORD.lon + ',' + MEDFORD.lat
      + '?overview=false';
    return fetch(url)
      .then(function(r) { return r.json(); })
      .then(function(d) {
        var miles = Math.round(d.routes[0].distance / 1609.34);
        distanceCache[key] = miles;
        return miles;
      });
  }

  function buildDistanceView() {
    menu.innerHTML = '';
    var useKm = false;
    var valueEls = [];

    function fmt(miles) {
      return useKm
        ? Math.round(miles * 1.60934).toLocaleString() + ' km'
        : miles.toLocaleString() + ' mi';
    }

    function refreshAll() {
      valueEls.forEach(function(v) {
        if (v.miles !== null) v.el.textContent = fmt(v.miles);
      });
    }

    var header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:0.4rem 0.75rem 0.2rem;gap:1rem;';

    var title = document.createElement('span');
    title.className = 'fmenu-section-title';
    title.textContent = 'Driving distance to Medford, OR';

    var toggleWrap = document.createElement('div');
    toggleWrap.className = 'fmenu-toggle-wrap';

    var miLbl = document.createElement('span');
    miLbl.className = 'fmenu-toggle-lbl';
    miLbl.textContent = 'mi';

    var track = document.createElement('div');
    track.className = 'fmenu-track';

    var thumb = document.createElement('div');
    thumb.style.cssText = 'width:12px;height:12px;border-radius:50%;background:white;position:absolute;top:2px;left:2px;transition:transform 0.25s;';
    track.appendChild(thumb);

    var kmLbl = document.createElement('span');
    kmLbl.className = 'fmenu-toggle-lbl dim';
    kmLbl.textContent = 'km';

    function updateToggleUI() {
      if (useKm) {
        track.style.background = '#4a9edd';
        thumb.style.transform = 'translateX(12px)';
        miLbl.classList.add('dim');
        kmLbl.classList.remove('dim');
      } else {
        track.style.background = '';
        thumb.style.transform = 'translateX(0)';
        miLbl.classList.remove('dim');
        kmLbl.classList.add('dim');
      }
    }

    toggleWrap.onclick = function(e) {
      e.stopPropagation();
      useKm = !useKm;
      updateToggleUI();
      refreshAll();
    };

    toggleWrap.appendChild(miLbl);
    toggleWrap.appendChild(track);
    toggleWrap.appendChild(kmLbl);

    header.appendChild(title);
    header.appendChild(toggleWrap);
    menu.appendChild(header);

    CITIES.forEach(function(c) {
      var row = document.createElement('div');
      row.style.cssText = rowStyle;
      var lbl = document.createElement('span');
      lbl.className = 'fmenu-row-label';
      lbl.textContent = c.label;
      var val = document.createElement('span');
      val.className = 'fmenu-row-value';
      val.textContent = fmt(c.miles);
      row.appendChild(lbl);
      row.appendChild(val);
      menu.appendChild(row);
      valueEls.push({ el: val, miles: c.miles });
    });

    var userRow = document.createElement('div');
    userRow.style.cssText = rowStyle;
    var userLabel = document.createElement('span');
    userLabel.className = 'fmenu-row-label';
    userLabel.textContent = 'You';
    var userVal = document.createElement('span');
    userVal.className = 'fmenu-row-value';
    userVal.textContent = 'locating\u2026';
    userRow.appendChild(userLabel);
    userRow.appendChild(userVal);
    menu.appendChild(userRow);
    var userEntry = { el: userVal, miles: null };
    valueEls.push(userEntry);

    var ipPromise = distanceCache._ip
      ? Promise.resolve(distanceCache._ip)
      : fetch('https://ipapi.co/json/').then(function(r) { return r.json(); }).then(function(d) { distanceCache._ip = d; return d; });

    ipPromise
      .then(function(d) {
        var city = [d.city, d.region_code || d.country_code].filter(Boolean).join(', ') || 'You';
        userLabel.textContent = city + ' (you)';
        return driveDistance(d.latitude, d.longitude);
      })
      .then(function(miles) {
        userEntry.miles = miles;
        userVal.textContent = fmt(miles);
      })
      .catch(function() { userVal.textContent = '—'; });
  }

  function buildMainMenu() {
    menu.innerHTML = '';

    var directions = document.createElement('a');
    directions.href = 'https://maps.app.goo.gl/c1PoGoBUCVr2QkoL8';
    directions.target = '_blank';
    directions.rel = 'noopener noreferrer';
    directions.className = 'fmenu-btn';
    directions.textContent = '🗺️ DIRECTIONS PLEASE!';
    menu.appendChild(directions);

    var howFar = document.createElement('button');
    howFar.className = 'fmenu-btn';
    howFar.textContent = '📏 How far away is Medford?';
    howFar.onclick = function(e) {
      e.stopPropagation();
      buildDistanceView();
      clampMenu();
    };
    menu.appendChild(howFar);
  }

  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (menu.style.display !== 'none') { closeMenu(); return; }
    if (window.closeYearMenu) window.closeYearMenu();
    buildMainMenu();
    menu.style.display = 'block';
    clampMenu();
  });

  document.addEventListener('click', function(e) {
    if (!wrap.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeMenu(); });
})();
