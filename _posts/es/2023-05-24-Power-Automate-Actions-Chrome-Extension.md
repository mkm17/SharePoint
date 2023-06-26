---
layout: postES
title: "Power Automate Actions - Extensión para Chrome"
date: 2023-05-24 00:00:00 +0200
tags: ["Power Automate", "SharePoint", "MS Graph", "Extensión para Chrome"]
image: "/images/powerAutomateExtension/header.png"
language: es
permalink: /2023/05/24/es/Power_Automate_Actions_Chrome_Extension.html
---

¿Alguna vez has tenido problemas al gestionar acciones en **Power Automate**? ¡Quién no los ha tenido! Aquí llega la herramienta que he creado para facilitar mi trabajo en Power Automate. Esta herramienta se ha demostrado útil para optimizar los siguientes escenarios:

- [**1. Registro de todas las solicitudes HTTP desde SharePoint**](#1-registro-de-todas-las-solicitudes-http-desde-sharepoint)
- [**2. Duplicación de acciones entre inquilinos y entornos**](#2-duplicación-de-acciones-entre-inquilinos-y-entornos)
- [**3. Copia de acciones de blogs comunitarios**](#3-copia-de-acciones-de-blogs-comunitarios)
- [**4. Almacenamiento de acciones de forma más persistente**](#4-almacenamiento-de-acciones-de-forma-más-persistente)
- [**- ¡Utilizando acciones registradas y copiadas en flujos de Power Automate!**](#--utilizando-acciones-registradas-y-copiadas-en-flujos-de-power-automate)

[**¡Mira cómo instalarlo ahora!**](#cómo-instalar-la-herramienta) 

---

### **1. Registro de todas las solicitudes HTTP desde SharePoint**
Power Automate se integra fácilmente con la plataforma de SharePoint. Aunque existen muchas acciones predefinidas, aún faltan algunas. En estos casos, podemos invocar una **solicitud HTTP específica de SharePoint** y copiar encabezados, método y cuerpo desde la pestaña de red de las herramientas de desarrollo del navegador. Para facilitar este engorroso proceso, la [**Extensión para Chrome Power Automate Actions**](#cómo-instalar-la-herramienta) que he creado nos permite registrar automáticamente todas las solicitudes HTTP y almacenarlas en la sección **"Acciones Registradas"**. A partir de ahí, podemos copiar cualquier acción directamente a un flujo de Power Automate. ¡Este mismo registro funciona también para solicitudes de **MS Graph**!

**Captura de solicitudes invocadas directamente desde la interfaz de SharePoint**

![Acciones Registradas](/images/powerAutomateExtension/RecordDefaultSPActions.gif)

**Registro de solicitudes invocadas desde la consola del navegador**

![Acciones Registradas](/images/powerAutomateExtension/RecordConsoleAction.gif)

**Recolección de solicitudes ejecutadas con SP Editor**

![Acciones Registradas](/images/powerAutomateExtension/RecordActionsFromSPEditor.gif)

---

### **2. Duplicación de acciones entre inquilinos y entornos**
Si queremos reutilizar cualquier acción, copiarla a **"Mi Portapapeles"** puede ser útil. Sin embargo, esta función tiene sus limitaciones y no es persistente. Con la **Extensión para Chrome Power Automate Actions**, podemos copiar cualquier acción desde cualquier ubicación, mantenerla en el almacenamiento y pegarla cuando sea necesario en el siguiente flujo, independientemente de su ubicación.

![Copiar Acciones entre entornos](/images/powerAutomateExtension/CopyBetweenEnvs.gif)

---

### **3. Copia de acciones de blogs comunitarios**
Es genial encontrar soluciones inspiradoras presentadas en blogs. Con mayor frecuencia, para imitar las acciones de Power Automate que se describen, creamos una serie de nuevas acciones y, una a una, colocamos el contenido de la página revisando el código. Con la mencionada Extensión para Chrome, es posible copiar todas las acciones predefinidas de manera correcta (consulta nuestro artículo sobre la **presencia de una bombilla** como referencia) incluso simultáneamente, utilizando el botón de copia en la parte superior de la ventana.

![Copiar Acciones desde un blog](/images/powerAutomateExtension/CopyItemsFromBlogAndSaveOnFlow.gif)

---

### **4. Almacenamiento de acciones de forma más persistente**
Por defecto, todas las acciones copiadas desde un flujo se almacenan en **"Mi Portapapeles"** y se eliminan con bastante frecuencia. Esta herramienta proporciona una forma sencilla de mantener los mismos elementos en el **almacenamiento de Chrome**, de modo que estén disponibles incluso después de reiniciar el navegador.

![Copiar Acciones desde Mi Portapapeles](/images/powerAutomateExtension/CopyMyClipboardActions.gif)

---

### **- ¡Utilizando acciones registradas y copiadas en flujos de Power Automate!**
Con un solo botón en la Extensión para Chrome, todas las acciones seleccionadas se pueden copiar de vuelta a la sección **"Mi Portapapeles"** de Power Automate, siempre y cuando hayas abierto previamente esa sección. Aceptar un diálogo del navegador es el último paso necesario para ver las acciones listas para usar en la vista del creador de Power Automate.

![Pegar Acciones en mi portapapeles](/images/powerAutomateExtension/CopyItemsToMyClipboard.gif)

---

**¿Cómo instalar la herramienta?**

La herramienta está disponible en la **[Chrome Store](https://chrome.google.com/webstore/detail/power-automate-actions-ha/eoeddkppcaagdeafjfiopeldffkhjodl?hl=pl&authuser=0)**.

Si deseas instalar la extensión manualmente, descomprime el archivo zip *[ApplicationBuild](https://github.com/mkm17/powerautomate-actions-extension/blob/main/ApplicationBuild.zip)* y sigue los pasos descritos [aquí](https://support.google.com/chrome/a/answer/2714278?hl=en) para instalar el paquete localmente.

---

**Descargo de responsabilidad**

La herramienta fue creada para facilitar mis tareas diarias al reproducir pasos en varios flujos. La basé en la implementación actual de la experiencia del creador de Power Automate y cualquier actualización en la interfaz o en los procesos subyacentes puede hacer que la herramienta deje de funcionar. El código está disponible en [GitHub](https://github.com/mkm17/powerautomate-actions-extension/tree/main). Eres bienvenido/a a utilizarlo para mejorar tu eficiencia personal y compartir tus comentarios en la sección de [Issues](https://github.com/mkm17/powerautomate-actions-extension/issues).

---

