---
layout: postES
title:  "Crear una Página de SharePoint basada en una Página Plantilla usando MS Graph Pages API"
date:   2024-06-01 00:00:00 +0200
tags: ["SharePoint", "MSGraph"]
image: "/images/sectionsExtensions/Header.png"
language: es
permalink: /2024/05/29/es/Create_Page_From_Template_MS_Graph_Pages_Api.html
---

# Cómo Crear una Página de SharePoint Basada en una Página Plantilla Usando MS Graph Pages API

## Descripción del Problema

Hace algún tiempo, un usuario quería encontrar un método para crear una página de SharePoint basada en una plantilla personalizada usando la API de Graph [enlace al problema](https://github.com/SharePoint/sp-dev-docs/issues/9653). Quería explorar la API de MS Graph Pages y verificar si esto es posible.

## Descripción de la Solución

### Pasos para Crear una Página de SharePoint Basada en una Plantilla Personalizada

1. **Obtener el ID Único del Elemento de Plantilla**

   Una plantilla es en realidad una página ubicada en la carpeta Template. Puedes obtener el ID único del elemento de plantilla usando el siguiente endpoint:

   ```
   https://graph.microsoft.com/v1.0/sites/{siteId}/lists/{listId}/items/{itemListId}?$select=contentType,sharepointIds
   ```

   Asegúrate de obtener el `sharepointIds.listItemUniqueId` para el siguiente paso.

2. **Crear la Nueva Página Basada en la Plantilla**

   Usa la API de MS Graph Pages para crear una nueva página basada en la plantilla:

   ```
   POST https://graph.microsoft.com/v1.0/sites/{siteId}/pages
   ```

   Con el cuerpo de la solicitud que incluye el ID único de la plantilla obtenido en el paso anterior.

## Conclusión

La API de MS Graph Pages proporciona una manera eficiente de crear páginas de SharePoint basadas en plantillas personalizadas. Esta funcionalidad es especialmente útil para automatizar la creación de páginas con diseños consistentes en sitios de SharePoint.

Para más detalles sobre la implementación, consulta la documentación oficial de MS Graph Pages API.
