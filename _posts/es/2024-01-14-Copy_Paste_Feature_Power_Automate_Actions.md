---
layout: postES
title:  "Función Extendida de Copiar/Pegar para el nuevo editor de PowerAutomate"
date:   2024-01-14 00:00:00 +0200
tags: ["Power Automate", "SharePoint", "Chrome Extension"]
image: "/images/powerAutomateExtension/header.png"
language: es
permalink: /2024/01/13/es/Copy_Paste_Feature_Power_Automate_Actions.html
---

Hace algún tiempo, se presentó el nuevo **editor de Power Automate**. Este trajo algunas nuevas funciones y mejoras importantes. Una adición destacada fue la función de **Copilot**, diseñada para acelerar el proceso de creación de nuevos flujos. Sin embargo, algunas de las opciones presentadas anteriormente faltaban en el punto inicial. Una de esas características fue la funcionalidad de **copiar/pegar** para acciones, introducida de manera limitada en una versión posterior del editor. Rápidamente resultó insuficiente para los usuarios más avanzados. Después de leer muchos comentarios, decidí explorar la posibilidad de extender el método actual utilizado en **el nuevo editor de Power Automate**. El resultado es la versión actualizada de la **[Extensión de Acciones de Power Automate](https://chrome.google.com/webstore/detail/power-automate-actions-ha/eoeddkppcaagdeafjfiopeldffkhjodl?hl=pl&authuser=0)**.

Para obtener más información sobre la solución personalizada, consulta mi artículo anterior sobre la [Extensión de Acciones de Power Automate](https://michalkornet.com/2023/05/23/Power-Automate-Actions-Chrome-Extension.html).

[**¡Mira cómo instalarlo ahora!**](#how-to-install-the-tool) 
<br />
<br />

### **Función Extendida de Copiar/Pegar para el nuevo editor de PowerAutomate**
Función de **Copiar/Pegar** extendida para el nuevo editor de Power Automate Esta nueva función no solo mejora la funcionalidad de copiar/pegar, sino que también permite a los usuarios almacenar acciones copiadas para uso futuro. Además, proporciona la capacidad de seleccionar acciones específicas que deben copiarse en el editor.

![Copiar Pegar en el nuevo editor](/images/copyPastePowerAutomateExtension/CopyPasteExample.gif)

<br />
<br />

<strong id="how-to-install-the-tool">¿Cómo instalar la herramienta?</strong>

La herramienta está disponible en la **[Chrome Store](https://chrome.google.com/webstore/detail/power-automate-actions-ha/eoeddkppcaagdeafjfiopeldffkhjodl?hl=pl&authuser=0)**.

Si desea instalar la extensión manualmente, descomprima el archivo zip *[ApplicationBuild](https://github.com/mkm17/powerautomate-actions-extension/blob/main/ApplicationBuild.zip)* y siga los pasos descritos [aquí](https://support.google.com/chrome/a/answer/2714278?hl=en) para instalar el paquete localmente. 

<br />
<br />

**Descargo de responsabilidad**

Ten en cuenta que en el nuevo editor, el formato de las acciones almacenadas ha cambiado, lo que limita el alcance de las características de la extensión disponibles en este modo. Seguiré investigando la posibilidad de mapear el nuevo formato al antiguo, lo que permitiría la funcionalidad completa de la extensión en ambos  **editores de Power Automate**.

La herramienta fue diseñada para aliviar mis dolores diarios al reproducir pasos en varios flujos de trabajo. Me basé en la implementación actual de la experiencia de Power Automate y cualquier actualización en la interfaz o procesos subyacentes puede hacer que la herramienta deje de funcionar. El código está disponible en [GitHub](https://github.com/mkm17/powerautomate-actions-extension/tree/main). Eres bienvenido a usarlo para mejorar tu eficiencia personal y compartir tus comentarios en la [sección de Issues.](https://github.com/mkm17/powerautomate-actions-extension/issues).

<br />
