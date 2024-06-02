---
layout: post
title:  "Función Extendida de Copiar/Pegar para el nuevo editor de PowerAutomate"
date:   2024-01-14 00:00:00 +0200
tags: ["Power Automate", "SharePoint", "Extensión de Chrome"]
image: "/images/powerAutomateExtension/header.png"
language: es
permalink: /2024/01/13/Copy_Paste_Feature_Power_Automate_Actions.html
---

Hace algún tiempo, se introdujo el nuevo **editor de Power Automate**. Trajo algunas nuevas funciones y mejoras importantes. Una adición notable fue la función de **Copilot**, diseñada para acelerar el proceso de creación de nuevos flujos. Sin embargo, algunas de las opciones presentadas anteriormente faltaban en el punto inicial. Una de esas características fue la funcionalidad de **copiar/pegar** para acciones, introducida de manera limitada en una versión posterior del editor. Rápidamente se demostró insuficiente para los usuarios más avanzados. Después de leer muchos comentarios, decidí explorar la posibilidad de extender el método actual utilizado en **el nuevo editor de Power Automate**. El resultado es la versión actualizada de la **[Extensión de Acciones de Power Automate](https://chrome.google.com/webstore/detail/power-automate-actions-ha/eoeddkppcaagdeafjfiopeldffkhjodl?hl=pl&authuser=0)**.

Para obtener más información sobre la solución personalizada, consulta mi artículo anterior sobre la [Extensión de Acciones de Power Automate](https://michalkornet.com/2023/05/23/Power-Automate-Actions-Chrome-Extension.html).

[**¡Vea cómo instalarla ahora!**](#how-to-install-the-tool) 
<br />
<br />

### **Función Extendida de Copiar/Pegar para el nuevo editor de PowerAutomate**
Esta nueva función no solo mejora la funcionalidad de **copiar/pegar**, sino que también permite a los usuarios almacenar acciones copiadas para uso futuro. Además, proporciona la capacidad de seleccionar acciones específicas que deben copiarse en el editor.

![Copiar Pegar en el nuevo editor](/images/copyPastePowerAutomateExtension/CopyPasteExample.gif)

<br />
<br />

<strong id="how-to-install-the-tool">¿Cómo instalar la herramienta?</strong>

La herramienta está disponible en la **[Chrome Store](https://chrome.google.com/webstore/detail/power-automate-actions-ha/eoeddkppcaagdeafjfiopeldffkhjodl?hl=pl&authuser=0)**.

Si desea instalar la extensión manualmente, descomprima el archivo zip *[ApplicationBuild](https://github.com/mkm17/powerautomate-actions-extension/blob/main/ApplicationBuild.zip)* y siga los pasos descritos [aquí](https://support.google.com/chrome/a/answer/2714278?hl=en) para instalar el paquete localmente. 

<br />
<br />

**Descargo de responsabilidad**

Tenga en cuenta que en el nuevo editor el formato de las acciones almacenadas cambió, limitando el rango de características de la extensión disponibles en este modo. Seguiré investigando la posibilidad de mapear el nuevo formato al antiguo, habilitando la funcionalidad completa de la extensión en ambos **editores de Power Automate**.

La herramienta fue diseñada para aliviar mis dolores diarios al reproducir pasos a lo largo de varios flujos de trabajo. La basé en la implementación actual de la experiencia del creador de Power Automate y cualquier actualización de la interfaz o procesos subyacentes puede causar que la herramienta deje de funcionar. 
El código está disponible en [GitHub](https://github.com/mkm17/powerautomate-actions-extension/tree/main). Estás invitado a usarlo para tu eficiencia personal y compartir tus comentarios en la [sección de Issues](https://github.com/mkm17/powerautomate-actions-extension/issues).

<br />
