/* Configuración de analítica.
   PEGA AQUÍ EL PROJECT API KEY DE POSTHOG Y LISTO: es el único lugar donde va.
   Lo encuentras en posthog.com → Settings → Project → Project API Key.
   Empieza con "phc_". Es publicable: puede vivir en el repo sin problema.
   Mientras esté vacío, la analítica simplemente no se activa y la página
   funciona igual. */
window.MZ_CONFIG = {
  posthogKey: '',
  posthogHost: 'https://us.i.posthog.com'   // cámbialo a https://eu.i.posthog.com si elegiste región europea
};
