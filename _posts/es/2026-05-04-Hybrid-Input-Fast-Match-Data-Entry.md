---
layout: postES
title: "Entrada Híbrida para el Registro Rápido de Eventos de Partido"
date: 2026-05-04 00:00:00 +0200
tags: ["SharePoint", "SPFx", "React"]
image: "/images/hybridInput/header.png"
description: "Cómo combinar atajos de teclado, clics del ratón y comandos de voz permite registrar eventos de partido manualmente a la velocidad del juego en directo."
language: es
permalink: /2026/05/04/es/Hybrid-Input-Fast-Match-Data-Entry.html
---

## El Contexto

En el artículo de hoy me gustaría abordar un tema más teórico.
Vivimos en una época magnífica para el análisis de datos. Las herramientas de IA pueden procesar grandes cantidades de información, encontrar patrones y generar conclusiones en segundos. El problema es que alguien sigue teniendo que proporcionar esos datos en primer lugar.

Me di cuenta de esto mientras trabajaba en un pequeño proyecto personal para mi equipo amateur de **fútbol 6v6**. Quería analizar los eventos del partido — tiros, goles, pases, pérdidas de balón, zonas del campo y dirección del juego. No encontré ninguna herramienta que extrajera automáticamente ese nivel de detalle a partir de una grabación de vídeo. También consideré usar modelos de visión de IA para procesar los fotogramas del vídeo, pero el coste en tokens para un partido completo sería enorme — y obtener resultados fiables tampoco sería sencillo, ya que el fútbol amateur raramente dispone de una cámara fija y el ritmo de juego es bastante diferente al del fútbol de campo completo (que es con lo que la mayoría de los modelos están entrenados). Así que los datos tenían que introducirse manualmente.

La pregunta era: ¿cómo hacer ese proceso lo más rápido posible?

![App overview](/images/matchApp/mainView.PNG)

<br/>

## El Problema con los Formularios Tradicionales

El enfoque obvio sería un formulario — desplegables para el tipo de acción, el jugador, la zona del campo, la dirección, etc. Pero rellenar un formulario para cada acción durante un partido es desesperadamente lento. Un partido típico de 6v6 tiene decenas de eventos por cada parte. Para cuando encuentras el desplegable correcto y seleccionas un valor, la siguiente acción ya ha ocurrido.

**El humano se convierte en el cuello de botella** del proceso.

![Standard form approach](/images/matchApp/standardForm.PNG)

<br/>

## El Enfoque de Entrada Híbrida

En lugar de depender de un único método de entrada, construí un enfoque híbrido que combina tres formas de registrar un evento:

- **Atajos de teclado** — cada tecla se asigna a una acción específica del partido, al control de la reproducción del vídeo o a un cambio de posesión
- **Clic del ratón sobre un mapa del campo** — haz clic en la zona donde ocurrió la acción
- **Comandos de voz** — di la acción en voz alta

El objetivo era registrar un evento completo en menos de dos segundos en lugar del lento proceso de hacer clic en varios elementos.

<br/>

### Atajos de Teclado

Cada tecla del teclado está asignada a una acción específica o a un cambio de posesión. Pulsar una tecla preselecciona instantáneamente el tipo de acción, de modo que lo único que queda por hacer es confirmar la zona y el jugador.

Por ejemplo:

| Tecla | Acción |
|---|---|
| `G` | Gol |
| `S` | Tiro |
| `P` | Pase |
| `L` | Pérdida de balón |

![Keyboard shortcut mapping](/images/matchApp/keyboardShortcuts.PNG)

<br/>

### Clic del Ratón sobre el Mapa del Campo

La aplicación incluye un mapa del campo en SVG dividido en zonas. Un solo clic registra la ubicación del tiro.

![Pitch map with zones](/images/matchApp/pitchMap.PNG)

<br/>

### Entrada por Voz

Para situaciones en las que ambas manos están ocupadas (o el usuario simplemente lo prefiere), la aplicación admite comandos de voz mediante la **Web Speech API** integrada en los navegadores modernos. Pronunciar el nombre de la acción — por ejemplo *"gol"* o *"tiro"* — rellena automáticamente el campo del tipo de acción y desplaza el foco a los campos siguientes, como jugador y zona del campo.

![Voice input feature](/images/matchApp/voiceInput.PNG)

<br/>

## Un Flujo de Registro Típico

Así es como se registra un tiro en la práctica:

**Usando teclado + ratón:**

1. Pulsa `S` — el tipo de acción se establece como *Tiro*
2. Haz clic en la zona del mapa del campo donde se produjo el tiro
3. Selecciona el jugador (un solo clic en la pequeña lista de jugadores)
4. El evento se guarda automáticamente en la base de datos

**Usando la voz:**

1. Di *"gol"* — el micrófono recoge el comando y establece el tipo de acción como *Gol*
2. Haz clic en la zona del mapa del campo donde se marcó el gol
3. Selecciona el jugador
4. El evento se guarda automáticamente en la base de datos

El mismo resultado también se puede conseguir combinando libremente los tres métodos, ya que cada acción admite todos los tipos de entrada.

<br/>

## Resultados

Con este enfoque pude ver la repetición de un partido a velocidad normal y registrar eventos sin tener que detener el vídeo con frecuencia. Tras el partido, los datos recopilados muestran información útil sobre el rendimiento del equipo — por ejemplo, qué zonas se utilizaron más, dónde se produjeron las pérdidas de balón y con qué frecuencia el equipo jugó hacia adelante frente a hacia atrás. En mis pruebas recopilé alrededor de 600 eventos por partido. Sin el enfoque híbrido, esa tarea habría sido muy costosa en tiempo.

![Match data results](/images/matchApp/results.PNG)

<br/>

## Resumen

La IA es excelente analizando datos. Pero primero, alguien tiene que recopilar esos datos.

Cuando no existe ninguna herramienta que lo haga automáticamente, la única opción es la introducción manual. En ese caso, la velocidad de entrada de datos se vuelve muy importante.

Usar una combinación de **atajos de teclado**, **clics del ratón** y **comandos de voz** permite registrar cada evento en aproximadamente un segundo. Esto es mucho más rápido que rellenar formularios con desplegables.

La idea clave es sencilla: ofrece al usuario múltiples formas de introducir los mismos datos, y deja que elija la más rápida en cada momento.
