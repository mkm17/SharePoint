---
layout: postES
title:  "SharePoint Api - ValidateUpdateFetchListItem"
date:   2024-08-12 00:00:00 +0200
tags: ["SharePoint", "SharePointApi"]
image: "/images/sharepointapi/ValidateUpdateFetchListItem/header.png"
language: es
permalink: /2024/08/10/es/SharePointApi_ValidateUpdateFetchListItem.html
---

## ¿Cómo funciona el tipo de actualización ValidateUpdateFetchListItem?

Después de algunas pruebas con [customRowAction](https://learn.microsoft.com/en-us/sharepoint/dev/declarative-customization/formatting-syntax-reference#customrowaction) en el formato de columnas, he notado que hay otro endpoint similar a `/items/(id)/ValidateUpdateListItem` llamado `/items/(id)/ValidateUpdateFetchListItem`, que se usa en el método `setValue`. Ambos usan el mismo cuerpo de solicitud y tienen el mismo efecto: actualizar un elemento.

La diferencia comienza en los resultados de la solicitud:

![Comparación de Llamadas](/images/sharepointapi/ValidateUpdateFetchListItem/CallsComparison.png)

Como puedes observar, la solicitud `ValidateUpdateFetchListItem` también proporciona información completa sobre el elemento cambiado en la propiedad `UpdatedData` del resultado.

## Uso

Este endpoint es especialmente útil cuando necesitas:

- **Actualizar un elemento** y **obtener los datos actualizados** en una sola llamada
- **Optimizar el rendimiento** evitando llamadas adicionales para obtener datos
- **Mantener la sincronización** de datos en aplicaciones en tiempo real

## Ventajas

- **Eficiencia mejorada**: Una sola llamada para actualizar y obtener datos
- **Menos tráfico de red**: Reduce el número de solicitudes HTTP
- **Datos actualizados garantizados**: Obtienes la información más reciente del elemento

## Conclusión

`ValidateUpdateFetchListItem` es una mejora valiosa sobre el endpoint estándar `ValidateUpdateListItem`, especialmente útil en escenarios donde necesitas los datos actualizados inmediatamente después de la modificación.
