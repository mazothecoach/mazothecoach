# Experimentos

Registro de lo que se prueba en la landing, qué se decidió y por qué. Lo lee y lo actualiza `/optimize-landing`.

## Regla de paro

Se declara ganador solo cuando se cumplen las tres condiciones: la fecha de cierre comprometida llegó, la probabilidad de ganar supera 95%, y hay al menos 50 exposiciones por variante.

La fecha se fija **antes** de lanzar y no se mueve. Mirar resultados a media carrera y parar cuando se ven bien es cómo se shipean ganadores falsos.

Con el tráfico actual de esta página, solo los cambios grandes alcanzan significancia en un plazo razonable. Micro-ajustes de copy no valen una ronda: queman semanas para devolver ruido. Un empate es información válida — significa que el elemento probado no es el que decide.

## Estado actual

**Ninguno corriendo.** Bloqueado por instrumentación: hace falta que PostHog esté midiendo y con al menos una semana de tráfico base antes de lanzar el primero.

## Siguiente experimento (preparado, sin lanzar)

**Hipótesis:** un titular de resultado concreto convierte más clics a CTA que uno de identidad.

| | |
|---|---|
| Flag | `landing-hero-headline` |
| Control (A) | `ENTRENA CON PROPÓSITO.` |
| Variante (B) | pendiente — lo escribe Mazo |
| Métrica primaria | embudo `$pageview` → `cta_click` |
| Secundarias | `cta_click` con `cta=assessment`, `assessment_submitted`, profundidad de scroll |
| Duración | 4 semanas desde el lanzamiento |

La variante B debe mantener el tono honesto y no motivacional de la marca, y una longitud parecida al control para no romper el layout del hero.

Si Mazo prefiere no tocar el titular, la alternativa es el copy del CTA principal (`OBTENER THE COMEUP`) contra una variante anclada en precio o acción.

## Historial

| Fecha | Experimento | Resultado | Decisión |
|---|---|---|---|
| — | — | — | — |
