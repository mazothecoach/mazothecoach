/* Configuración de analítica y medición.
   Todo lo que hay que pegar va aquí: ningún otro archivo se toca. */
window.MZ_CONFIG = {

  /* --- PostHog (activo) ---
     Project API Key, de posthog.com → Settings → Project.
     Es publicable: puede vivir en el repo sin problema. */
  posthogKey: 'phc_ozp6iD26zKf4yqWSmgHpzCZ4k36JXqy9Y95vXT3WqJaG',
  posthogHost: 'https://us.i.posthog.com',

  /* --- Google Ads (pendiente de IDs) ---
     Sin estos valores la etiqueta de Google ni se carga, así que la página
     funciona igual y no se envía nada.

     1. googleAdsId: en Google Ads → Herramientas → Etiqueta de Google.
        Tiene la forma AW-123456789.
     2. labels: crea una acción de conversión por cada objetivo
        (Herramientas → Conversiones → Nueva acción → Sitio web → Manual).
        Al terminar, Google muestra un send_to del tipo AW-123456789/AbC-D_efGh.
        Aquí va solo la parte de después de la barra. */
  googleAdsId: '',
  googleAdsLabels: {
    assessment: '',   // envió el formulario de aplicación
    agenda: '',       // agendó una llamada
    contacto: ''      // clic para escribir por Instagram
  }
};
