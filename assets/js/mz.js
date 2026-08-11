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
  function showBanner() {
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
    var el = e.target.closest ? e.target.closest('.signup-cta, .assessment-cta') : null;
    if (!el) return;
    var p = ph();
    if (!p) return;
    p.capture('cta_click', {
      cta: el.classList.contains('signup-cta') ? 'comeup' : 'assessment',
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
