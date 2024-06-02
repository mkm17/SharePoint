---
layout: post
title:  "API de SharePoint - BulkValidateUpdateListItems"
date:   2024-04-23 00:00:00 +0200
tags: ["SharePoint", "SharePointApi"]
image: "/images/sharepointapi/BulkValidateUpdateListItems/header.png"
language: es
permalink: /2024/04/22/SharePointApi-BulkValidateUpdateListItems.html
---

## ¿Cómo actualizar múltiples elementos usando la API REST de SharePoint?

Puedes responder a la siguiente pregunta utilizando diferentes métodos. Por supuesto, uno de ellos es usar el procesamiento por lotes y los puntos finales bien conocidos como `/items/(id)` o `/items/(id)ValidateUpdateItem`.

¿Pero sabías que hay otro método para lograr el mismo efecto? Imaginemos un escenario donde necesitas actualizar el mismo valor en elementos seleccionados. Por ejemplo, dar al usuario la posibilidad de seleccionar múltiples elementos y cambiar el estado, o aprobar varios elementos al mismo tiempo.

SharePoint expone un punto final [BulkValidateUpdateListItems](https://learn.microsoft.com/en-us/openspecs/sharepoint_protocols/ms-csomspt/ebc47581-36e4-457b-8045-a4cf1f4da501) que espera un cuerpo similar al [ValidateUpdateListItems](https://learn.microsoft.com/en-us/openspecs/sharepoint_protocols/ms-csomspt/652ab52f-8f47-4eec-95fd-743af5ee38cc).

He comparado estos tres métodos de API REST para actualizar múltiples elementos. Para cada método, he tomado 4 elementos diferentes en la misma lista para actualizar la misma propiedad.

![Comparación de llamadas](/images/sharepointapi/BulkValidateUpdateListItems/CallsComparison.png)

Los resultados son los siguientes:

| Método                      | Ejecución 1 | Ejecución 2 | Ejecución 3 | Ejecución 4 | Ejecución 5 | Tiempo Promedio de Ejecución |
| --------------------------- | ----- | ----- | ----- | ----- | ----- | ----------------------------- |
| ValidateUpdateListItems     | 0.645 | 0.692 | 0.472 | 0.418 | 0.496 | 0.545 segundos                |
| Update                      | 0.665 | 0.733 | 0.914 | 0.455 | 0.499 | 0.653 segundos                |
| BulkValidateUpdateListItems | 0.510 | 0.696 | 0.861 | 0.334 | 0.473 | 0.575 segundos                |

Como puedes ver, el tiempo de ejecución es similar para todos los métodos.

Ahora, vamos a ver un ejemplo de código para aprobar muchos elementos al mismo tiempo. Un escenario real podría ser aprobar múltiples elementos simultáneamente.

Reemplaza *contoso*, *TargetSite*, y *TargetList* con tus valores.

**URL:**

```
 https://<contoso>.sharepoint.com/sites/<TargetSite>/_api/web/GetList(@a1)/BulkValidateUpdateListItems()?@a1=%27%2Fsites%2F<TargetSite>%2FLists%2F<TargetList>%27
```

Proporciona los ids de los elementos que deseas actualizar en el parámetro *itemIds*. Los *formValues* deben contener el campo que deseas actualizar. En este caso, el campo es _ModerationStatus, y el valor es 0 (Aprobado).

**Cuerpo:**

```json
{
  "itemIds":[1,2,3,4],
  "formValues":[
    {
        "FieldName":"_ModerationStatus",
        "FieldValue":"0",
        "HasException":false,
        "ErrorMessage":null
    }
  ],
  "bNewDocumentUpdate":false,
  "checkInComment":null
}
```

**Un ejemplo de resultado**
```json
{
  "d": {
    "BulkValidateUpdateListItems": {
      "__metadata": {
        "type": "Collection(SP.ListItemFormUpdateValue)"
      },
      "results": [
        {
          "ErrorCode": 0,
          "ErrorMessage": null,
          "FieldName": "_ModerationStatus",
          "FieldValue": "0",
          "HasException": false,
          "ItemId": 1
        },
        {
          "ErrorCode": 0,
          "ErrorMessage": "You cannot perform this action on a checked out document.",
          "FieldName": null,
          "FieldValue": null,
          "HasException": true,
          "ItemId": 2
        },
        {
          "ErrorCode": 0,
          "ErrorMessage": null,
          "FieldName": "_ModerationStatus",
          "FieldValue": "0",
          "HasException": false,
          "ItemId": 3
        },
        {
          "ErrorCode": 0,
          "ErrorMessage": null,
          "FieldName": "_ModerationStatus",
          "FieldValue": "0",
          "HasException": false,
          "ItemId": 4
        }
      ]
    }
  }
}
```