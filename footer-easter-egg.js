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
        btn.style.cssText = 'display:block;width:100%;text-align:left;background:none;border:none;color:rgba(255,255,255,0.7);font-family:"DM Mono",monospace;font-size:0.65rem;letter-spacing:0.06em;text-transform:uppercase;padding:0.5rem 0.75rem;border-radius:999px;cursor:pointer;white-space:nowrap;transition:background 0.15s,color 0.15s;';
        btn.onmouseenter = function() { btn.style.background = 'rgba(74,158,221,0.12)'; btn.style.color = 'rgba(255,255,255,0.9)'; };
        btn.onmouseleave = function() { btn.style.background = 'none'; btn.style.color = 'rgba(255,255,255,0.7)'; };
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

  var btnStyle = 'display:block;width:100%;text-align:left;background:none;border:none;color:rgba(255,255,255,0.7);font-family:"DM Mono",monospace;font-size:0.65rem;letter-spacing:0.06em;text-transform:uppercase;padding:0.5rem 0.75rem;border-radius:999px;cursor:pointer;white-space:nowrap;transition:background 0.15s,color 0.15s;';
  var rowStyle = 'display:flex;justify-content:space-between;align-items:center;padding:0.35rem 0.75rem;gap:1.5rem;';
  var labelStyle = 'font-size:0.78rem;color:rgba(255,255,255,0.7);white-space:nowrap;';
  var miStyle = 'font-size:0.78rem;color:rgba(255,255,255,0.45);font-family:\'DM Mono\',monospace;white-space:nowrap;';

  function addHover(el) {
    el.onmouseenter = function() { el.style.background = 'rgba(74,158,221,0.12)'; el.style.color = 'rgba(255,255,255,0.9)'; };
    el.onmouseleave = function() { el.style.background = 'none'; el.style.color = 'rgba(255,255,255,0.7)'; };
  }

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
    title.style.cssText = 'font-size:0.65rem;font-family:"DM Mono",monospace;color:rgba(255,255,255,0.35);letter-spacing:0.06em;text-transform:uppercase;white-space:nowrap;';
    title.textContent = 'Driving distance to Medford, OR';

    var toggleWrap = document.createElement('div');
    toggleWrap.style.cssText = 'display:flex;align-items:center;gap:0.35rem;cursor:pointer;flex-shrink:0;background:rgba(255,255,255,0.06);border-radius:100px;padding:0.2rem 0.45rem;';

    var miLbl = document.createElement('span');
    miLbl.style.cssText = 'font-size:0.6rem;font-family:"DM Mono",monospace;color:rgba(255,255,255,0.55);text-transform:none;transition:color 0.2s;';
    miLbl.textContent = 'mi';

    var track = document.createElement('div');
    track.style.cssText = 'width:28px;height:16px;border-radius:100px;background:rgba(255,255,255,0.2);position:relative;transition:background 0.25s;flex-shrink:0;';

    var thumb = document.createElement('div');
    thumb.style.cssText = 'width:12px;height:12px;border-radius:50%;background:white;position:absolute;top:2px;left:2px;transition:transform 0.25s;';
    track.appendChild(thumb);

    var kmLbl = document.createElement('span');
    kmLbl.style.cssText = 'font-size:0.6rem;font-family:"DM Mono",monospace;color:rgba(255,255,255,0.25);text-transform:none;transition:color 0.2s;';
    kmLbl.textContent = 'km';

    function updateToggleUI() {
      if (useKm) {
        track.style.background = '#4a9edd';
        thumb.style.transform = 'translateX(12px)';
        miLbl.style.color = 'rgba(255,255,255,0.25)';
        kmLbl.style.color = 'rgba(255,255,255,0.55)';
      } else {
        track.style.background = 'rgba(255,255,255,0.2)';
        thumb.style.transform = 'translateX(0)';
        miLbl.style.color = 'rgba(255,255,255,0.55)';
        kmLbl.style.color = 'rgba(255,255,255,0.25)';
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
      lbl.style.cssText = labelStyle;
      lbl.textContent = c.label;
      var val = document.createElement('span');
      val.style.cssText = miStyle;
      val.textContent = fmt(c.miles);
      row.appendChild(lbl);
      row.appendChild(val);
      menu.appendChild(row);
      valueEls.push({ el: val, miles: c.miles });
    });

    var userRow = document.createElement('div');
    userRow.style.cssText = rowStyle;
    var userLabel = document.createElement('span');
    userLabel.style.cssText = labelStyle;
    userLabel.textContent = 'You';
    var userVal = document.createElement('span');
    userVal.style.cssText = miStyle;
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
    directions.style.cssText = btnStyle + 'text-decoration:none;display:block;text-transform:none;';
    directions.textContent = '🗺️ Directions please!';
    addHover(directions);
    menu.appendChild(directions);

    var howFar = document.createElement('button');
    howFar.style.cssText = btnStyle;
    howFar.textContent = '📏 How far away is Medford?';
    addHover(howFar);
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
