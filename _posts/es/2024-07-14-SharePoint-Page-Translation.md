---
layout: postES
title:  "Traducción de páginas de SharePoint"
date:   2024-07-13 00:00:00 +0200
tags: ["SharePoint", "QuickFinding"]
image: "/images/sharePointPageTranslations/Header.png"
language: es
permalink: /2024/07/14/es/SharePoint_Page_Translation.html
---

# Traducción de páginas de SharePoint

Hoy, solo un tema rápido sobre la traducción de páginas.

Como sabrás, hay configuraciones para hacer que tus páginas sean multiidioma. Por ejemplo, el usuario puede cambiar de la versión en inglés a la versión en árabe de la página.

Cuando la traducción se cambia una vez, la siguiente página abierta también se abrirá en el idioma de destino.

![Traducción de página](/images/sharePointPageTranslations/pageTranslations.PNG)

<br><br>

### ¿Pero alguna vez te has preguntado dónde se almacena esta información?

Mi primer pensamiento fue que tal vez hay información guardada en algún lugar en las preferencias del usuario.

Después de algunas investigaciones, he notado que puedes encontrar esta información en las **cookies** bajo una propiedad llamada **siteLangPref**.

![Cookie](/images/sharePointPageTranslations/cookie.PNG)

<br><br>

### Información Técnica

Esta configuración de idioma se almacena en las cookies del navegador, lo que permite que SharePoint recuerde la preferencia de idioma del usuario entre sesiones. Esto es útil para:

- Mantener la consistencia de idioma en múltiples páginas
- Proporcionar una experiencia de usuario personalizada
- Reducir la necesidad de cambiar manualmente el idioma en cada página

### Conclusión

Entender cómo SharePoint maneja las traducciones de páginas nos ayuda a crear mejores experiencias multiidioma para nuestros usuarios. La información almacenada en cookies es una solución simple pero efectiva para mantener las preferencias de idioma.
