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
| `aviso-privacidad.html` | Aviso de privacidad. Va con `noindex`. |
| `assets/video/` | Videos de casos (`run`, `squat`, `patricia`...). Cada uno con su `poster_*.jpg`. |
| `assets/hero-cutout.*` | El hero: recorte sobre transparente (webp + png de respaldo). |
| `assets/og-image.jpg` | Imagen de previsualización al compartir (1200×630). |
| `sitemap.xml`, `robots.txt` | SEO. Ver abajo. |

## Convenciones

- **CTAs taggeados** para analítica y experimentos: clase `signup-cta` (compra de The Comeup, va a Instagram DM) o `assessment-cta` (formulario de aplicación), más `data-cta-location` indicando dónde está el botón. Todo CTA nuevo se taggea igual.
- **Motion:** transiciones con la variable `--spring` (muelle críticamente amortiguado, sin rebote) y `--spring-dur`. Sin rebote a propósito: no hay gestos con momentum en la página.
- **Accesibilidad:** el pase de diseño respeta `prefers-reduced-motion`, `prefers-reduced-transparency` y `prefers-contrast`. Cualquier animación nueva se apaga bajo reduced-motion.

## SEO

Las cuatro páginas públicas llevan `title`, `description`, `canonical`, Open Graph, Twitter Card y favicon. `index.html` lleva además datos estructurados JSON-LD de tipo `ProfessionalService`.

- **Al añadir una página nueva:** copia el bloque de meta tags de `calculadora.html` (es el más simple), ajusta `title`, `description`, `canonical` y `og:url`, y **agrégala a `sitemap.xml`**. Es fácil olvidarlo y entonces Google no la descubre.
- **Longitudes:** `title` hasta ~60 caracteres, `description` entre 150 y 160. Más largo se corta en los resultados.
- **Sin dirección en los datos estructurados.** Mazo entrena en un gimnasio del que no es dueño; declarar esa dirección como sede propia puede costar la suspensión del perfil de Google. El schema usa `areaServed` (zonas), no `address`. Solo se añade dirección si el gimnasio lo autoriza por escrito.
- **El `robots.txt` de la subcarpeta no lo lee nadie.** En un project page de GitHub, el buscador lee `mazothecoach.github.io/robots.txt`, que pertenece a otro repo. El archivo queda listo para el día que haya dominio propio; mientras tanto, quien controla la indexación es la `<meta name="robots">` de cada página.
- **`og-image.jpg` se regenera** con `scratchpad/og2.py` si cambia el hero o el mensaje. 1200×630, texto en el tercio izquierdo para que no lo tape el recorte.

## Pendientes de Mazo (nadie más puede hacerlos)

1. **Google Search Console.** Alta en `search.google.com/search-console`, verificar por meta tag (la opción más simple aquí), enviar `sitemap.xml` y pedir indexación manual de las tres páginas indexables. Sin esto no hay forma de saber si Google ve el sitio, y hoy no aparece indexado.
2. **Google Business Profile.** Solicitado y en aprobación. Al aprobarse: categoría "Entrenador personal", área de servicio (no dirección ajena), horarios, fotos propias, y el enlace a la landing con UTM para distinguir ese tráfico en PostHog.
3. **Reseñas.** Es lo que más pesa en el mapa de resultados locales. Pedírselas a los clientes actuales con el enlace corto del perfil.
4. **PostHog.** Falta el Project API key para conectar la analítica.

## Experimentos

El experimento activo y su fecha de cierre viven en `EXPERIMENTS.md`. La regla de decisión está en `.claude/commands/optimize-landing.md`: no se declara ganador antes de la fecha comprometida.

## Verificación local

El preview se levanta desde el workspace de Freelance (`.claude/launch.json`, entrada `landing`, puerto 8080). `file://` no sirve: PostHog y los feature flags necesitan origen http.

Ojo al verificar animaciones: si el panel del navegador no está visible, el reloj de animaciones se congela (`currentTime` clavado en 0) y `getComputedStyle` devuelve el valor inicial para siempre. Para leer el valor final, `element.getAnimations().forEach(a => a.finish())` antes de medir.
