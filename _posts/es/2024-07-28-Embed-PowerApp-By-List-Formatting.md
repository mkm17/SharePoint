---
layout: postES
title:  "Incrustar vista dedicada de Power Apps usando el formato de lista de SharePoint"
date:   2024-08-03 00:00:00 +0200
tags: ["SharePoint", "CanvasApp"]
image: "/images/embededPowerApp/header.png"
language: es
permalink: /2024/07/28/es/Embed_PowerApp_By_List_Formatting.html
---

En la publicación de blog de hoy, me gustaría compartir un hallazgo útil sobre una configuración poderosa detrás de la función de formato de lista de SharePoint.

Es posible que ya hayas visto múltiples ejemplos de usar la opción [customRowAction](https://learn.microsoft.com/en-us/sharepoint/dev/declarative-customization/formatting-syntax-reference#customrowaction) para ejecutar un flujo directamente desde la lista de SharePoint haciendo clic en un botón o actualizando valores de elementos.

Imaginemos que necesitas obtener más detalles por elemento y poder gestionar estas propiedades con el botón de acción.

Ciertamente podrías empezar a escribir código personalizado en el field customizer de SPFx, pero una aplicación canvas de Power Apps de bajo código junto con la opción *customRowAction embed* tiene mucho que ofrecer aquí.

### Creación de la aplicación

En este caso básico, he creado una aplicación canvas simple en Power Apps, mostrando información adicional sobre un elemento de lista y con dos botones para ejecutar flujos de Power Automate relacionados.

La parte crucial es que en la aplicación, estoy usando la función *Param("ID")* para obtener el ID exacto del elemento de la URL en la que se hizo clic en la lista de SharePoint.

![Simple Power App](/images/embededPowerApp/simplePowerApp.png)

Después de publicar y compartir la aplicación, obtén su enlace web. La URL de la aplicación debería verse similar a esta: *https://apps.powerapps.com/play/e/<enviromentName>/a/<app id>?tenantId=<tenantId>&hint=74c99cf5-5ef9-4a0f-8f6a-829ec80a9c33&sourcetime=1722273673473*.

![URL de la app](/images/embededPowerApp/createdAppLink.png)

### Formato de columna

Para integrar la Power App en tu lista de SharePoint, necesitas usar el formato de columna personalizado con la acción `customRowAction` de tipo `embed`. Esto permite que la aplicación se abra directamente dentro del contexto de SharePoint.

### Configuración JSON

El formato JSON debe incluir:
- El tipo de acción como "embed"
- La URL de la Power App
- El parámetro ID que se pasará a la aplicación

### Beneficios

Esta aproximación ofrece:
- **Integración perfecta** entre SharePoint y Power Apps
- **Experiencia de usuario mejorada** sin salir del contexto de SharePoint  
- **Capacidades extendidas** para gestionar datos de lista
- **Solución de bajo código** que no requiere desarrollo SPFx personalizado

### Conclusión

El uso de Power Apps incrustadas en listas de SharePoint mediante formato de columna proporciona una manera poderosa y flexible de extender la funcionalidad de SharePoint sin requerir desarrollo complejo.
