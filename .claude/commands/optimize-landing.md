---
description: Ciclo semanal de optimización — lee el experimento en PostHog, propone UN cambio, espera aprobación y lo publica
---

Eres el optimizador de la landing de Mazo (https://mazothecoach.github.io/mazothecoach/).
Corre el ciclo completo respetando siempre el gate humano.

## 1. Contexto

Lee `CLAUDE.md` y `EXPERIMENTS.md`. De ahí sacas el experimento activo: su flag, sus variantes, la métrica primaria, la fecha de cierre comprometida y el historial de lo ya probado.

## 2. Datos (PostHog MCP, solo lectura)

Del experimento activo: exposiciones por variante, conversión de la métrica primaria (`$pageview` → `cta_click`), probabilidad de ganar, y las métricas secundarias.

Salud general de los últimos 7 días: pageviews, `cta_click` desglosado por `cta_location`, `assessment_submitted`, `calculadora_used`.

Si el MCP falla o no responde, reporta el error y termina. No inventes números ni estimes a ojo: sin datos no hay ciclo.

## 3. Reglas de decisión, en este orden

**Si hoy es anterior a la fecha de cierre comprometida:** reporta el estado y proyecta cuándo habrá datos suficientes. No propongas una decisión sobre el experimento — mirar resultados a media carrera y parar cuando se ven bien es exactamente cómo se declaran ganadores falsos. Sí puedes proponer un arreglo operativo si detectas algo roto (un evento que dejó de llegar, un CTA que no registra, una caída de tráfico).

**Si la fecha se cumplió, hay más de 95% de probabilidad de ganar y al menos 50 exposiciones por variante:** declara ganador.

**Si la fecha se cumplió y no hay ganador claro:** declara empate. El aprendizaje es que el cambio no movió la aguja; propone un cambio más grande o prueba otro elemento. Un empate también es información — dilo sin adornos.

## 4. Propuesta: exactamente un cambio

Formato: qué (el cambio concreto), por qué (los números que lo sustentan), riesgo, y cómo se revierte.

Lo típico tras un ganador: fijar la variante ganadora en `index.html`, retirar el código del flag terminado, y definir el siguiente experimento.

Con el tráfico de esta página, apunta a cambios grandes. Micro-ajustes de copy no alcanzan significancia y solo queman semanas.

## 5. Gate humano

Pregúntale a Mazo y espera un sí explícito. Sin aprobación: documenta la propuesta en `EXPERIMENTS.md` como pendiente y termina. Nunca edites antes del sí.

## 6. Publicar (solo después del sí)

1. Edita `index.html` — solo lo aprobado.
2. Verifica en el preview local (entrada `landing` del launch.json): render correcto, consola limpia, y el anti-flicker intacto si hay un experimento nuevo.
3. Commit descriptivo y push a `main`, que es el deploy. Verifica el live un par de minutos después.
4. Actualiza `EXPERIMENTS.md` con el resultado, la decisión y la fecha.
5. Recuérdale a Mazo los pasos que solo él puede hacer en la interfaz de PostHog: el MCP es de solo lectura, así que detener o archivar el experimento cerrado y crear el siguiente son manuales.

## Reglas duras

Un solo cambio por ciclo. Nunca toques `v2.html`. Nunca renombres archivos, rutas ni anchors: las URLs están publicadas en la bio de Instagram y en el podcast. Nunca escribas claves secretas en el repo. Nunca cambies el destino de un CTA sin aprobación explícita. Si tocas el snippet de PostHog, sincronízalo en las tres páginas.
