# mazothecoach — landing

Landing de captación de clientes de coaching. HTML plano, sin build, sin dependencias.
Deploy: **push a `main` = producción** (GitHub Pages, raíz del repo). No hay CI ni staging.

Live: https://mazothecoach.github.io/mazothecoach/

## Reglas duras

- **No tocar `v2.html`.** Es una versión alterna viva; está fuera de scope de todo trabajo en `index.html`.
- **No renombrar archivos, rutas ni anchors.** Las URLs están publicadas en la bio de Instagram, en descripciones de episodios del podcast y en flujos de ManyChat. Romper una URL rompe el funnel.
- **No meter claves secretas en el repo.** El Project API key de PostHog (`phc_...`) sí es publicable y vive en el HTML; un Personal API key nunca.
- El snippet de PostHog está duplicado en `index.html`, `mazothecoach-assessment.html` y `calculadora.html`. **Si tocas uno, sincroniza los tres.**

## Estructura

| Archivo | Qué es |
|---|---|
| `index.html` | La landing principal. Todo el tráfico entra aquí. CSS en 3 bloques `<style>` inline: base, capítulos MZ, y pase de diseño. |
| `mazothecoach-assessment.html` | Formulario de aplicación. **No usa `<form>`**: envía por `fetch` a un webhook de n8n. |
| `calculadora.html` | Calculadora de calorías. |
| `v2.html` | Versión alterna. Intocable. |
| `assets/video/` | Videos de casos (`run`, `squat`, `patricia`...) + `hero.*`. Cada uno con su `poster_*.jpg`. |

## Convenciones

- **CTAs taggeados** para analítica y experimentos: clase `signup-cta` (compra de The Comeup, va a Instagram DM) o `assessment-cta` (formulario de aplicación), más `data-cta-location` indicando dónde está el botón. Todo CTA nuevo se taggea igual.
- **Motion:** transiciones con la variable `--spring` (muelle críticamente amortiguado, sin rebote) y `--spring-dur`. Sin rebote a propósito: no hay gestos con momentum en la página.
- **Accesibilidad:** el pase de diseño respeta `prefers-reduced-motion`, `prefers-reduced-transparency` y `prefers-contrast`. Cualquier animación nueva se apaga bajo reduced-motion.

## Experimentos

El experimento activo y su fecha de cierre viven en `EXPERIMENTS.md`. La regla de decisión está en `.claude/commands/optimize-landing.md`: no se declara ganador antes de la fecha comprometida.

## Verificación local

El preview se levanta desde el workspace de Freelance (`.claude/launch.json`, entrada `landing`, puerto 8080). `file://` no sirve: PostHog y los feature flags necesitan origen http.

Ojo al verificar animaciones: si el panel del navegador no está visible, el reloj de animaciones se congela (`currentTime` clavado en 0) y `getComputedStyle` devuelve el valor inicial para siempre. Para leer el valor final, `element.getAnimations().forEach(a => a.finish())` antes de medir.
