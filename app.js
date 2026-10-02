/* ------------------------------------------------------------------
   WhatsApp Landing Page — runtime
   Builds the WhatsApp link, fires tracking, performs the redirect.
   Edit config.js, not this file.
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  var C = window.LP_CONFIG || {};
  var params = new URLSearchParams(window.location.search);

  function el(id) { return document.getElementById(id); }
  function digitsOnly(s) { return String(s == null ? '' : s).replace(/[^0-9]/g, ''); }
  function param(name) { return C.allowUrlOverrides ? (params.get(name) || '') : ''; }
  function setText(id, value) { var n = el(id); if (n && value != null) n.textContent = value; }

  /* ---------------- number selection ---------------- */

  var numbers = (C.whatsappNumbers || []).map(digitsOnly).filter(Boolean);

  function pickNumber() {
    var override = digitsOnly(param('n') || param('number'));
    if (override) return override;
    if (!numbers.length) return '';
    if (numbers.length === 1) return numbers[0];

    var mode = C.rotation || 'random';
    if (mode === 'off') return numbers[0];

    if (mode === 'sequential') {
      try {
        var key = 'lp_rotation_index';
        var i = parseInt(window.localStorage.getItem(key) || '0', 10);
        if (isNaN(i) || i < 0) i = 0;
        window.localStorage.setItem(key, String((i + 1) % numbers.length));
        return numbers[i % numbers.length];
      } catch (e) { /* storage blocked — fall through to random */ }
    }
    return numbers[Math.floor(Math.random() * numbers.length)];
  }

  var phone = pickNumber();

  /* ---------------- message ---------------- */

  function buildMessage() {
    var msg = param('m') || param('text') || C.prefillMessage || '';
    if (C.appendRefToMessage) {
      var ref = param('ref') || param('utm_campaign');
      if (ref) {
        var fmt = C.refMessageFormat || '\n\n(Ref: {ref})';
        msg += fmt.replace('{ref}', ref);
      }
    }
    return msg;
  }

  var message = buildMessage();

  /* ---------------- link ---------------- */

  function isDesktop() {
    return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i
      .test(navigator.userAgent || '');
  }

  function buildLink() {
    if (!phone) return '';
    var text = message ? encodeURIComponent(message) : '';
    if (C.desktopUsesWebWhatsApp && isDesktop()) {
      return 'https://web.whatsapp.com/send?phone=' + phone + (text ? '&text=' + text : '');
    }
    return 'https://wa.me/' + phone + (text ? '?text=' + text : '');
  }

  var waLink = buildLink();

  /* ---------------- tracking ---------------- */

  var tracked = false;

  function fireTracking() {
    if (tracked) return;
    tracked = true;

    // The Meta Pixel "Subscribe" event is fired by the pixel block in
    // index.html, not here — firing it in both places double-counts.

    try {
      if (window.gtag) {
        window.gtag('event', 'whatsapp_click', {
          event_category: 'engagement',
          event_label: phone
        });
      }
    } catch (e) { /* no-op */ }
  }

  /* ---------------- redirect ---------------- */

  var fallbackTimer = null;

  function showFallback() {
    var f = el('fallback');
    if (f) f.classList.add('is-visible');
  }

  function goToWhatsApp(viaClick) {
    if (!waLink) return;

    fireTracking();

    var note = el('note');
    if (note) {
      note.textContent = C.redirectingText || 'Opening WhatsApp…';
      note.classList.add('is-active');
    }

    if (fallbackTimer) clearTimeout(fallbackTimer);
    fallbackTimer = setTimeout(showFallback, 3500);

    // Desktop clicks open a new tab natively — nothing more to do.
    if (viaClick) return;

    setTimeout(function () {
      window.location.href = waLink;
    }, Math.max(0, C.trackingFlushMs == null ? 300 : C.trackingFlushMs));
  }

  /* ---------------- render ---------------- */

  function render() {
    var brand = C.brandName || 'Your Business';
    var initial = (brand.trim()[0] || 'B').toUpperCase();

    setText('brandName', brand);
    setText('footerBrand', brand);
    var mark = el('brandMark');
    if (C.logoMark && mark) {
      var img = document.createElement('img');
      img.src = C.logoMark;
      img.alt = '';
      mark.textContent = '';
      mark.appendChild(img);
      mark.classList.add('has-logo');
    } else {
      setText('brandMark', initial);
    }
    setText('onlineLabel', C.onlineLabel);
    setText('badge', C.badge);
    setText('headline', C.headline);
    highlight('headline', C.headlineHighlight);
    setText('subheadline', C.subheadline);
    setText('buttonLabel', C.buttonLabel);
    setText('note', C.reassurance);
    setText('fallback', C.fallbackText);
    setText('footerNote', C.footerNote);

    if (C.pageTitle) {
      document.title = C.pageTitle;
      setMeta('property', 'og:title', C.pageTitle);
    }
    if (C.pageDescription) {
      setMeta('name', 'description', C.pageDescription);
      setMeta('property', 'og:description', C.pageDescription);
    }
    if (C.shareImage) {
      setMeta('property', 'og:image', C.shareImage);
      setMeta('name', 'twitter:image', C.shareImage);
    }
    setMeta('property', 'og:url', window.location.origin + window.location.pathname);

    if (C.privacyUrl) el('privacyLink').setAttribute('href', C.privacyUrl);
    if (C.termsUrl) el('termsLink').setAttribute('href', C.termsUrl);

    // CTAs — every [data-wa-cta] link opens the same chat
    var ctas = Array.prototype.slice.call(document.querySelectorAll('[data-wa-cta]'));
    if (!waLink) {
      setText('note', 'Setup needed: add your WhatsApp number in config.js');
      console.warn('[landing] No WhatsApp number configured — set whatsappNumbers in config.js');
    }

    ctas.forEach(function (cta) {
      if (waLink) {
        cta.setAttribute('href', waLink);
        cta.setAttribute('target', isDesktop() ? '_blank' : '_self');
        cta.setAttribute('aria-label', (C.buttonLabel || 'Chat on WhatsApp') + ' — opens WhatsApp');
      } else {
        cta.setAttribute('href', '#');
        cta.setAttribute('aria-disabled', 'true');
      }

      cta.addEventListener('click', function (e) {
        if (!waLink) { e.preventDefault(); return; }
        // Desktop opens a new tab, so this page stays alive and the pixel
        // beacon gets out. On mobile WhatsApp replaces this page — hold the
        // navigation for trackingFlushMs so the Subscribe event is delivered.
        if (isDesktop()) { goToWhatsApp(true); return; }
        e.preventDefault();
        goToWhatsApp(false);
      });
    });

    // Trust row
    var trust = el('trust');
    var stats = C.stats || [];
    if (C.showTrust && stats.length) {
      trust.hidden = false;
      stats.forEach(function (s) {
        var wrap = document.createElement('div');
        var v = document.createElement('div');
        var l = document.createElement('div');
        v.className = 'stat-value';
        l.className = 'stat-label';
        v.textContent = s.value;
        l.textContent = s.label;
        wrap.appendChild(v);
        wrap.appendChild(l);
        trust.appendChild(wrap);
      });
    }
  }

  // Wrap the first occurrence of `word` inside #id in <span class="hl">.
  function highlight(id, word) {
    var n = el(id);
    if (!n || !word) return;
    var text = n.textContent;
    var at = text.toLowerCase().indexOf(String(word).toLowerCase());
    if (at < 0) return;
    var span = document.createElement('span');
    span.className = 'hl';
    span.textContent = text.slice(at, at + word.length);
    n.textContent = '';
    n.appendChild(document.createTextNode(text.slice(0, at)));
    n.appendChild(span);
    n.appendChild(document.createTextNode(text.slice(at + word.length)));
  }

  function setMeta(attr, key, value) {
    var tag = document.head.querySelector('meta[' + attr + '="' + key + '"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attr, key);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', value);
  }

  /* ---------------- boot ---------------- */

  render();

  var redirectDisabled = params.get('noredirect') === '1' || params.get('preview') === '1';

  if (C.autoRedirect && waLink && !redirectDisabled) {
    setTimeout(function () { goToWhatsApp(false); },
      Math.max(0, C.redirectDelayMs == null ? 1800 : C.redirectDelayMs));
  }

  // If the visitor comes back (WhatsApp opened, then they hit back), reset the
  // page instead of instantly bouncing them out again.
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    var note = el('note');
    if (note) {
      note.textContent = C.reassurance || '';
      note.classList.remove('is-active');
    }
    var f = el('fallback');
    if (f) f.classList.remove('is-visible');
  });
})();
