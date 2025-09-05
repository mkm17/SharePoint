---
layout: postES
title:  "Coautoría de Páginas de SharePoint - endpoint SavePageCoAuth"
date:   2025-07-19 00:00:00 +0200
tags: ["SharePoint", "SharePointApi"]
image: "/images/coAuthoringIssue/header.png"
language: es
permalink: /2025/07/19/es/SharePoint_Pages_Co_Authoring_SavePageCoAuth.html
---

## Coautoría de Páginas de SharePoint

Hace algún tiempo, me informaron que mi extensión de ejemplo había dejado de funcionar. La [extensión Page Sections](https://github.com/mkm17/react-application-page-sections), que utiliza la API estándar de SharePoint `savepage` para modificar el contenido de la página (actualizando la propiedad `ContentCanvas1` con una estructura JSON que contiene la sección seleccionada), ya no funcionaba como se esperaba.

El problema reportado por los usuarios era que después de que la [función de coautoría](https://support.microsoft.com/en-us/office/collaborate-on-sharepoint-pages-and-news-with-coauthoring-91d7dc25-37c3-44a4-99da-f552e0f9cfe9) se habilitara en el tenant, ya no podían guardar la página usando la extensión y el endpoint mencionado.

![Indicador de coautoría](/images/coAuthoringIssue/coAuthoringIndicator.png)

### Un Error

El error mostrado sugería que la página estaba bloqueada. De hecho, incluso el mismo usuario no podía guardar la página usando el endpoint `savepage` mientras estaba en modo de coautoría. Además, incluso después de que la página ya no estuviera siendo editada activamente, el usuario aún no podía guardarla usando el mismo endpoint.

(Parece que la página permanece bloqueada durante varios minutos después del último guardado.)

El error era:

```json
{
    "odata.error": {
        "code": "-2147018894, Microsoft.SharePoint.SPFileLockException",
        "message": {
            "lang": "en-US",
            "value": "The file https://contoso.sharepoint.com/sites/siteName/SitePages/Co-Authoring-test.aspx is locked for shared use by user@contoso.onmicrosoft.com [membership]."
        }
    }
}
```

![Error](/images/coAuthoringIssue/error.png)

### Nuevos Endpoints

Observando las solicitudes realizadas durante una sesión de coautoría en una página, podemos identificar algunos endpoints interesantes que comienzan con `https://contoso.sharepoint.com/sites/site/_api/sitepages/pages(pageId)`:

El endpoint utilizado para guardar la página durante la coautoría es `SavePageCoAuth`, que permite guardar el contenido de la página mientras la sesión de coautoría está activa.

Para extender la sesión de coautoría, SharePoint utiliza el endpoint `ExtendCoAuthSession`.

Para descartar una sesión de coautoría activa, se utiliza el endpoint `DiscardCoAuth`.

Además, la página incluye propiedades como `AuthoringMetadata` y `CoAuthState`, que proporcionan metadatos relacionados con el estado de coautoría y la actividad de autoría.

### Guardar Página en Modo de Coautoría

*Observación: Como verás a continuación, no expliqué todos los valores de las propiedades. Desafortunadamente, no los descubrí durante mi investigación. Ten en cuenta que este puede no ser el enfoque más completo o recomendado.*

Para guardar la página en modo de coautoría, necesitas usar el endpoint `SavePageCoAuth`. La solicitud debería verse así:

```http
POST https://contoso.sharepoint.com/sites/site/_api/sitepages/pages(pageId)/SavePageCoAuth
Content-Type: application/json
```

```json
{
  "CanvasContent1": "<<contenido JSON de la página>>",
    "AuthoringMetadata": {
      "ClientOperation": 3,
      "FluidContainerCustomId": "pageContentJson.AuthoringMetadata.FluidContainerCustomId",
      "IsSingleUserSession": true,
      "SequenceId": "pageContentJson.AuthoringMetadata.SequenceId",
      "SessionId": "pageContentJson.AuthoringMetadata.SessionId"
    },
    "CoAuthState": {
      "Action": 1,
      "LockAction": 2,
      "SharedLockId": "pageContentJson.CoAuthState?.SharedLockId"
    },
    "Collaborators": [ ]
}
```

Como puedes ver en la solicitud, también necesitas proporcionar propiedades adicionales como `AuthoringMetadata` y `CoAuthState`. Puedes obtener estos valores solicitando las propiedades de la página usando el siguiente endpoint:

`https://contoso.sharepoint.com/sites/site/_api/sitepages/pages(pageId)`

### ¿Es Así de Simple?

Parcialmente sí, pero hay algunas consideraciones adicionales.

En mi solución, guardo el contenido de la página y me gustaría permitir que el usuario continúe editándola desde ese punto en la interfaz de usuario. Sin embargo, el resultado no es perfecto. Después de unos segundos, el usuario ve la versión de la página como estaba antes de guardarla usando el endpoint `SavePageCoAuth`.

Para resolver este misterio, necesitamos profundizar un poco más en cómo funciona la solución de coautoría por debajo.

*Otra observación: como mencioné antes, no tengo conocimiento completo sobre el fondo de la solución, por lo que lo siguiente se basa en mi investigación y suposiciones.*

Al inspeccionar las solicitudes de red, puedes notar algunas que se ven así:

![Solicitudes Fluid](/images/coAuthoringIssue/fluidRequests.png)

Esto indica que la edición de páginas en modo de coautoría se basa en el [Fluid Framework](https://fluidframework.com/). El Fluid Framework es un conjunto de bibliotecas y servicios que habilitan la colaboración en tiempo real en aplicaciones web. Permite que múltiples usuarios trabajen en el mismo documento simultáneamente, con cambios reflejados en tiempo real.

Se utiliza, por ejemplo, en Microsoft Loop, y también se puede usar en escenarios embebidos de SharePoint. Si intentas [este ejemplo](https://github.com/microsoft/FluidExamples/tree/main/item-counter-spe) de la documentación del Fluid Framework, verás solicitudes similares en la pestaña de red del navegador:

![Ejemplo Fluid](/images/coAuthoringIssue/Fluidexample.png)

Idealmente, el mejor enfoque sería usar la integración existente del Fluid Framework para guardar el contenido de la página directamente. Desafortunadamente, esto no es tan fácil (no estoy seguro si es posible).

Usar solo el endpoint `SavePageCoAuth` actualizará el contenido de la página. Sin embargo, debido a la gestión activa del estado del Fluid Framework, el usuario puede experimentar comportamientos extraños, como que el contenido de la página se revierta o se sobrescriba poco después de editar.

![Efecto del Fluid Framework](/images/coAuthoringIssue/CoAuthoringUpdate.gif)

Para evitar este comportamiento, implementé los siguientes pasos:

1. **Guardar el contenido de la página** usando el endpoint `SavePageCoAuth`.
2. **Descartar la sesión de coautoría** usando el endpoint `DiscardCoAuth`.
3. **Hacer checkout de la página** usando el endpoint `Checkout`. (Ejecuté esto en un bucle para asegurar que la página fuera exitosamente checked out.)
4. **Guardar la página nuevamente** usando el endpoint estándar `SavePage`.

---

### Detalles de Descartar Sesión de Coautoría

```http
POST https://contoso.sharepoint.com/sites/site/_api/sitepages/pages(pageId)/discardCoAuth?$expand=VersionInfo
Content-Type: application/json
```

```json
{
  "lockId": "pageContentJson.AuthoringMetadata.SessionId"
}
```

De esta manera, el contenido de la página se guarda y el usuario puede continuar editándola sin el efecto extraño de actualizaciones inesperadas del contenido.

Por supuesto, este enfoque tiene algunas desventajas: la sesión de coautoría se descarta, por lo que cuando la página se recarga, ya no estará en modo de coautoría. Para volver a la coautoría, el usuario debe guardar la página y luego comenzar a editarla nuevamente.

Como mencioné anteriormente, tengo la impresión de que podría haber una manera más elegante de actualizar la página durante una sesión de coautoría, así que mantente atento a futuras actualizaciones.
