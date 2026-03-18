---
layout: postES
title:  "SharePoint Api - Caché"
date:   2026-03-12 00:00:00 +0200
tags: ["SharePoint", "SharePointApi"]
image: "/images/sharepointapi/spCacheApi/header.png"
language: es
permalink: /2026/03/12/es/SharePointApi-Cache.html
---

## Introducción

Cuando revisas los registros de llamadas de la API de SharePoint, notarás que algunos de los endpoints más invocados son `ReadCacheOrCreate` y `ReadCacheOrCreate2`.

![Resultado de la pestaña de red](/images/sharepointapi/spCacheApi/networkTab.png)

Revisar los detalles de la solicitud y la respuesta no explica de inmediato para qué se usan estas APIs, pero sí da pistas útiles sobre dónde buscar más información.

![Payload de la solicitud](/images/sharepointapi/spCacheApi/payload.png)

![Resultado de la solicitud](/images/sharepointapi/spCacheApi/Result.png)

<br/>

## Cómo Funciona

Hasta ahora, no he encontrado ninguna diferencia significativa entre `ReadCacheOrCreate` y `ReadCacheOrCreate2`; según lo que he observado, ambos se pueden usar de forma intercambiable con el mismo payload.

En la práctica, los payloads de respuesta sugieren que estas llamadas se usan para almacenar y leer el estado de la interfaz de usuario y metadatos de componentes.

Por ejemplo, los resultados pueden incluir información sobre web parts específicos o indicadores que muestran si el usuario actual ya descartó componentes predeterminados de SharePoint.

## ¿Dónde Se Almacena?

Para entender dónde se persisten estos datos, revisa los detalles del sitio personal del usuario.

Este sitio no es solo un lugar donde se almacenan los archivos del usuario. También contiene varias listas ocultas.

Es probable que existan varias listas ocultas usadas para almacenar datos relacionados con el usuario, como `SharePointHomeCacheList` y `PersonalCacheLibrary`, y estas listas parecen ser la fuente desde la cual esta API obtiene su información.

<br/>

## ¿Qué Se Almacena Allí?

Ambas listas usan carpetas para agrupar información.

En la lista `PersonalCacheLibrary`, podemos encontrar información sobre el uso de plantillas de página y la caché de web parts.
![PersonalCacheLibrary](/images/sharepointapi/spCacheApi/personalcacheLibrary.png)

En `SharePointHomeList`, podemos ver información sobre el uso de web parts, algunas configuraciones de la aplicación y `FRE_Cached_Data`, que incluye detalles como si cierta información mostrada en un sitio fue descartada por el usuario.
![SharePointHomeList](/images/sharepointapi/spCacheApi/sharepointhomelist.png)

## Uso

Aquí tienes un ejemplo de solicitud para obtener o crear una clave de caché específica en la carpeta `FRE_Cached_Data` de `SharePointHomeList`.

{% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{"id":"62b976e1-5df3-4ee8-ba58-3a89899828fd","brandColor":"#474747","connectionReferences":{"shared_sharepointonline":{"connection":{"id":"/new_sharedsharepointonline_56b91"}}},"connectorDisplayName":"SharePoint","icon":"https://conn-afd-prod-endpoint-bmc9bqahasf3grgk.b01.azurefd.net/releases/v1.0.1769/1.0.1769.4361/sharepointonline/icon.png","isTrigger":false,"operationName":"ReadCacheOrCreate","operationDefinition":{"type":"OpenApiConnection","inputs":{"host":{"connectionName":"shared_sharepointonline","operationId":"HttpRequest","apiId":"/providers/Microsoft.PowerApps/apis/shared_sharepointonline"},"parameters":{"dataset":"https://TENANT.sharepoint.com/sites/SITE","parameters/method":"POST","parameters/uri":"_api/SP.UserProfiles.PersonalCache/ReadCacheOrCreate","parameters/headers":{"accept":"application/json","content-type":"application/json;odata=verbose;charset=utf-8"},"parameters/body":"{\"folderPath\":{\"__metadata\":{\"type\":\"SP.ResourcePath\"},\"DecodedUrl\":\"FRE_Cached_Data\"},\"requiredCacheKeys\":[\"TestKey\"],\"createIfMissing\":true}"},"authentication":{"type":"Raw","value":"@json(decodeBase64(triggerOutputs().headers['X-MS-APIM-Tokens']))['$ConnectionKey']"}},"runAfter":{"Ensure user in SharePoint":["Succeeded"]}}}
</div>

<br/>

Reemplaza *contoso* por tu valor.

**URL:**

```
POST https://*contoso*.sharepoint.com/_api/SP.UserProfiles.PersonalCache/ReadCacheOrCreate
```

**Headers:**

```json
{
  "accept": "application/json;odata=verbose",
  "content-type": "application/json;odata=verbose"
}
```

**Body:**

```json
{
  "folderPath": {
    "__metadata": {
      "type": "SP.ResourcePath"
    },
    "DecodedUrl": "FRE_Cached_Data"
  },
  "requiredCacheKeys": [
    "TestKey"
  ],
  "createIfMissing": true
}
```

<br/>

**Un ejemplo de resultado:**

```json
{
  "odata.metadata": "https://tenant.sharepoint.com/sites/site/_api/$metadata#Collection(SP.UserProfiles.PersonalCacheItem)",
  "value": [
    {
      "AltTitle": "TestKey",
      "CacheKey": "TestKey",
      "CacheName": "SharePointHomeCacheList",
      "CacheValue": null,
      "CacheValueHash": null,
      "CacheValueHtml": null,
      "CacheVersion": null,
      "ContainerUrl": "FRE_Cached_Data",
      "ListItemId": 617,
      "ListItemUniqueId": "1f433061-56c4-4974-bf87-c375f36b7778",
      "ModifiedTimeUtc": "2026-03-18T20:01:20Z"
    }
  ]
}
```

<br/>

## Notas Adicionales

Alguien podría preguntar: ¿por qué no usar simplemente una llamada estándar `Add list item` y escribir directamente en esa lista?

Según el comportamiento observado, esto probablemente está bloqueado por límites de arquitectura. Un sitio regular de SharePoint y un sitio personal de usuario están en dominios diferentes, por lo que no podemos enviar directamente una solicitud estándar al sitio personal desde el contexto del sitio actual.

<br/>

## Resumen

¿Se puede usar esto en soluciones personalizadas? Técnicamente sí, pero no recomiendo depender de ello en producción.

Estos endpoints no están documentados públicamente, por lo que cualquier implementación basada en ellos se usa bajo tu propia responsabilidad y puede dejar de funcionar sin previo aviso.

El propósito de este artículo es explicar el comportamiento observado y mostrar cómo funciona este mecanismo.

También sugiere que, si deseas almacenar información del usuario fuera del perfil de usuario, el sitio personal puede ser una buena dirección, ya que SharePoint ya lo está haciendo.
