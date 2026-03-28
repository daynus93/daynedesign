/* ── SAY HELLO MODAL ── */
(function() {
  var modal = document.getElementById('sayHelloModal');
  if (!modal) return;
  var backdrop = document.getElementById('shBackdrop');
  var sheet    = document.getElementById('shSheet');
  var closeBtn = document.getElementById('shClose');
  var cancelBtn= document.getElementById('shCancel');
  var sendBtn  = document.getElementById('shSend');
  var sendBtnHTML = sendBtn ? sendBtn.innerHTML : '';
  var reasonSel= document.getElementById('shReason');
  var messageTa= document.getElementById('shMessage');
  var fromInput  = document.getElementById('shFrom');
  var fromError  = document.getElementById('shFromError');
  var msgError   = document.getElementById('shMessageError');
  var charCount  = document.getElementById('shCharCount');
  var MAX_CHARS  = 500;

  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    document.querySelectorAll('#shReason option').forEach(function(opt) {
      opt.textContent = opt.textContent.replace(/\s*[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\s*$/u, '');
    });
  }

  var messages = {
    hi:       'Hey Dayne,\n\nJust wanted to reach out and say hi — love what you\'ve built.',
    hire:     'Hey Dayne,\n\nWe\'re looking for a product designer and your portfolio caught our eye. Would love to connect.',
    project:  'Hey Dayne,\n\nI have a project I\'d love to chat about.\n\nHere\'s a quick overview:\n',
    collab:   'Hey Dayne,\n\nI\'d love to explore a collaboration. Here\'s what I\'m thinking:\n',
    system:   'Hey Dayne,\n\nWe\'re looking to build out a design system and think you\'d be a great fit to lead it.',
    coffee:   'Hey Dayne,\n\nWould love to grab a virtual coffee and chat. Are you open to it?',
    feedback: 'Hey Dayne,\n\nI checked out your portfolio and wanted to share some thoughts:\n',
    question: 'Hey Dayne,\n\nQuick question for you:\n',
    wow:      'Lok\'tar ogar, Dayne.\n\nThe Horde has need of a designer. Report to Orgrimmar at once.',
    longtest: 'Hey Dayne,\n\nI came across your portfolio and wanted to reach out. The depth of thinking in your case studies is refreshing, and it is rare to see process documented so clearly. The HRIS Sync work especially stood out to me. The way you navigated complexity while keeping the user experience clean shows real craft. I would love to connect and learn more about your approach to product design. Your very close attention to small details and edge cases is exactly what our team is looking for right now.'
  };
  var subjects = {
    hi: 'Just saying hi', hire: 'Design role', project: 'Project inquiry',
    collab: 'Collaboration', system: 'Design system work',
    coffee: 'Virtual coffee?', feedback: 'Portfolio feedback',
    question: 'Quick question', wow: 'For the Horde', longtest: 'Long text example'
  };

  messageTa.value = messages.hi;
  var _modalScrollY = 0;
  function openModal() {
    window._shModalOpen = true;
    _modalScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + _modalScrollY + 'px';
    document.body.style.width = '100%';
    modal.style.display = 'flex';
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        modal.classList.add('sh-open');
        setTimeout(function() { messageTa.focus(); messageTa.setSelectionRange(messageTa.value.length, messageTa.value.length); }, 420);
      });
    });
  }
  function closeModal() {
    modal.classList.remove('sh-open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo({ top: _modalScrollY, behavior: 'instant' });
    window._shModalOpen = false;
    setTimeout(function() { modal.style.display = 'none'; resetModal(); }, 450);
  }

  function updateCharCount() {
    var len = messageTa.value.length;
    if (charCount) {
      var nearLimit = len >= MAX_CHARS * 0.9;
      charCount.textContent = len + '/' + MAX_CHARS;
      charCount.classList.toggle('sh-char-visible', nearLimit);
      charCount.classList.toggle('sh-char-over', len > MAX_CHARS);
    }
  }
  messageTa.addEventListener('input', function() {
    updateCharCount();
    messageTa.classList.remove('sh-input-error');
    if (msgError) msgError.textContent = '';
    resetSendBtn();
  });
  updateCharCount();

  reasonSel.addEventListener('change', function() {
    messageTa.value = messages[reasonSel.value] || '';
    updateCharCount();
    sendBtn._longtestClicks = 0;
    sendBtn.innerHTML = sendBtnHTML;
  });

  document.querySelectorAll('a[href="mailto:hello@dayne.design"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
  });

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  backdrop.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive: false });

  // Drag-to-dismiss on mobile (handle + sheet header)
  var handle = sheet && sheet.querySelector('.sh-handle');
  var dragStart = null, dragY = 0;
  function onDragStart(e) {
    if (window.innerWidth >= 641) return;
    dragStart = e.touches ? e.touches[0].clientY : e.clientY;
    dragY = 0;
    sheet.style.transition = 'none';
  }
  function onDragMove(e) {
    if (dragStart === null) return;
    e.preventDefault();
    var y = (e.touches ? e.touches[0].clientY : e.clientY) - dragStart;
    dragY = Math.max(0, y);
    sheet.style.transform = 'translateY(' + dragY + 'px)';
  }
  function onDragEnd() {
    if (dragStart === null) return;
    dragStart = null;
    sheet.style.transition = '';
    if (dragY > 120) {
      sheet.style.transform = '';
      closeModal();
    } else {
      sheet.style.transform = '';
    }
  }
  var shHeader = sheet && sheet.querySelector('.sh-header');
  [handle, shHeader].forEach(function(el) {
    if (!el) return;
    el.addEventListener('touchstart', onDragStart, { passive: true });
    el.addEventListener('mousedown', onDragStart);
  });
  window.addEventListener('touchmove', onDragMove, { passive: false });
  window.addEventListener('touchend', onDragEnd);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('sh-open')) closeModal();
  });
  sendBtn.addEventListener('click', function() {
    if (reasonSel.value === 'longtest') {
      sendBtn._longtestClicks = (sendBtn._longtestClicks || 0) + 1;
      if (sendBtn._longtestClicks >= 3) {
        sendBtn.innerHTML = 'that one doesn\'t work, stop. \u{1F91A}';
        clearTimeout(sendBtn._longtestTimer);
        sendBtn._longtestTimer = setTimeout(function() {
          sendBtn.innerHTML = sendBtnHTML;
          sendBtn._longtestClicks = 0;
        }, 2500);
      }
    }
    var from = fromInput.value.trim();
    var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from);
    fromInput.classList.toggle('sh-input-error', !valid);
    if (fromError) fromError.textContent = !valid ? (from === '' ? 'Email is required.' : 'Please enter a valid email.') : '';
    var msg = messageTa.value.trim();
    var msgEmpty = msg === '';
    var msgOver = messageTa.value.length > MAX_CHARS;
    messageTa.classList.toggle('sh-input-error', msgEmpty || msgOver);
    if (msgError) msgError.textContent = msgEmpty ? 'Please enter a message.' : msgOver ? 'Message is too long.' : '';
    if (reasonSel.value === 'longtest') return;
    sendBtn._longtestClicks = 0;
    if (!valid || msgEmpty || msgOver) {
      sendBtn._errClicks = (sendBtn._errClicks || 0) + 1;
      if (sendBtn._errClicks >= 2) {
        sendBtn.innerHTML = 'Fix your errors <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="5" x2="8" y2="8.5"/><circle cx="8" cy="11" r="0.5" fill="currentColor" stroke="none"/></svg>';
        clearTimeout(sendBtn._errTimer);
        sendBtn._errTimer = setTimeout(resetSendBtn, 3000);
      }
      if (!valid) { fromInput.focus(); } else { messageTa.focus(); }
      return;
    }
    sendBtn._errClicks = 0;
    var subject = (subjects[reasonSel.value] || 'Hello') + ' \u2014 ' + from;
    sendBtn.disabled = true;
    sendBtn.innerHTML = 'Sending\u2026';
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: 'ecb19b03-7658-47d1-84e9-4b198ef922dd',
        subject: subject,
        from_name: from,
        replyto: from,
        message: messageTa.value
      })
    }).then(function(r) { return r.json(); }).then(function(data) {
      if (data.success) {
        sendBtn.innerHTML = 'Sent!';
        setTimeout(closeModal, 800);
      } else {
        sendBtn.disabled = false;
        sendBtn.innerHTML = sendBtnHTML;
      }
    }).catch(function() {
      sendBtn.disabled = false;
      sendBtn.innerHTML = sendBtnHTML;
    });
  });
  function resetSendBtn() { sendBtn._errClicks = 0; sendBtn.innerHTML = sendBtnHTML; }
  function resetModal() {
    fromInput.value = '';
    fromInput.classList.remove('sh-input-error');
    if (fromError) fromError.textContent = '';
    reasonSel.value = 'hi';
    messageTa.value = messages.hi;
    messageTa.classList.remove('sh-input-error');
    if (msgError) msgError.textContent = '';
    updateCharCount();
    sendBtn.disabled = false;
    sendBtn._errClicks = 0;
    sendBtn._longtestClicks = 0;
    sendBtn.innerHTML = sendBtnHTML;
  }
  fromInput.addEventListener('input', function() { fromInput.classList.remove('sh-input-error'); if (fromError) fromError.textContent = ''; resetSendBtn(); });
})();
