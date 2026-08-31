/* Analítica y consentimiento — compartido por index, assessment y calculadora.
   El init de PostHog vive inline en el <head> de cada página (lo necesita el
   anti-flicker de los experimentos); aquí va todo lo que puede esperar. */
(function () {
  'use strict';

  var CONSENT_KEY = 'mz_consent';
  var consent = null;
  try { consent = localStorage.getItem(CONSENT_KEY); } catch (e) { /* modo privado */ }

  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
    consent = value;
  }

  function ph() { return window.posthog && window.posthog.__loaded ? window.posthog : null; }

  /* ---------- Banner de consentimiento ---------- */
  /* Aviso con opción de rechazar, no un muro que bloquee la página: la ley
     mexicana no exige consentimiento previo y un muro mataría el poco tráfico. */
  function injectStyles() {
    if (document.getElementById('mz-consent-styles')) return;
    var st = document.createElement('style');
    st.id = 'mz-consent-styles';
    st.textContent = [
      '.mz-consent{position:fixed;left:0;right:0;bottom:0;z-index:9999;display:flex;',
      'align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;',
      'padding:14px 20px;background:rgba(8,8,8,.82);backdrop-filter:blur(20px) saturate(180%);',
      '-webkit-backdrop-filter:blur(20px) saturate(180%);border-top:1px solid rgba(255,255,255,.12);',
      'font-family:Inter,system-ui,sans-serif;animation:mzUp .38s cubic-bezier(.2,.8,.2,1) both}',
      '@keyframes mzUp{from{transform:translateY(100%)}}',
      '.mz-consent p{margin:0;font-size:12.5px;line-height:1.5;color:#c9c9c9;max-width:62ch}',
      '.mz-consent a{color:#c8f000}',
      '.mz-consent-btns{display:flex;gap:8px;flex-shrink:0}',
      '.mz-consent button{font-family:inherit;font-size:11.5px;letter-spacing:.06em;',
      'text-transform:uppercase;padding:9px 18px;border:1px solid rgba(255,255,255,.2);',
      'background:transparent;color:#f2f0eb;cursor:pointer;transition:all .25s}',
      '.mz-consent button:hover{border-color:#c8f000;color:#c8f000}',
      '.mz-consent button[data-mz=ok]{background:#c8f000;color:#080808;border-color:#c8f000;font-weight:600}',
      '.mz-consent button[data-mz=ok]:hover{background:#fff;border-color:#fff;color:#080808}',
      '.mz-consent button:active{transform:scale(.97)}',
      '.mz-consent button:focus-visible{outline:2px solid #c8f000;outline-offset:3px}',
      '@media(prefers-reduced-motion:reduce){.mz-consent{animation:none}}',
      '@media(prefers-reduced-transparency:reduce){.mz-consent{background:#080808;backdrop-filter:none}}',
      '@media(max-width:560px){.mz-consent{flex-direction:column;align-items:stretch;text-align:left}',
      '.mz-consent-btns button{flex:1}}'
    ].join('');
    document.head.appendChild(st);
  }

  function showBanner() {
    injectStyles();
    var bar = document.createElement('div');
    bar.className = 'mz-consent';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Aviso de privacidad');
    bar.innerHTML =
      '<p>Uso analítica para entender qué le sirve a la gente en esta página. ' +
      '<a href="aviso-privacidad.html">Cómo trato tus datos</a>.</p>' +
      '<div class="mz-consent-btns">' +
      '<button type="button" data-mz="ok">Entendido</button>' +
      '<button type="button" data-mz="no">No, gracias</button>' +
      '</div>';

    bar.addEventListener('click', function (e) {
      var choice = e.target.getAttribute('data-mz');
      if (!choice) return;
      if (choice === 'no') {
        setConsent('no');
        var p = ph();
        if (p) { p.opt_out_capturing(); }
      } else {
        setConsent('ok');
      }
      bar.remove();
    });

    document.body.appendChild(bar);
  }

  if (consent !== 'ok' && consent !== 'no') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }

  /* ---------- Eventos ---------- */
  /* Delegado en document: sobrevive a cambios de markup y a los CTAs que
     inserta un experimento. El autocapture ya registra los clics para los
     heatmaps; estos eventos existen para que las métricas de los experimentos
     no dependan de selectores que pueden cambiar. */
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('.signup-cta, .assessment-cta, .question-cta') : null;
    if (!el) return;
    var p = ph();
    if (!p) return;
    var kind = el.classList.contains('signup-cta') ? 'comeup'
             : el.classList.contains('question-cta') ? 'pregunta'
             : 'assessment';
    p.capture('cta_click', {
      cta: kind,
      cta_location: el.getAttribute('data-cta-location') || 'sin-marcar'
    });
  }, true);

  /* Calculadora: los botones llaman funciones globales por onclick, así que se
     envuelven en vez de engancharse por listener. */
  ['calcular', 'adaptativo'].forEach(function (name) {
    var original = window[name];
    if (typeof original !== 'function') return;
    window[name] = function () {
      var p = ph();
      if (p) { p.capture('calculadora_used', { tipo: name === 'calcular' ? 'objetivo' : 'adaptativo' }); }
      return original.apply(this, arguments);
    };
  });

  /* ---------- Movimiento reducido ---------- */
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var hero = document.querySelector('video.hero-main-img');
    if (hero) { hero.removeAttribute('autoplay'); hero.pause(); }
  }
})();
