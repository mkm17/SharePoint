---
layout: postES
title:  "SharePoint Api - Columna SetRating"
date:   2024-11-30 00:00:00 +0200
tags: ["SharePoint", "SharePointApi"]
image: "/images/sharepointapi/SetRating/header.png"
language: es
permalink: /2024/11/30/es/SharePointApi_SetRatingColumn.html
---

## ¿Alguna vez has pensado en cómo actualizar una columna de calificación en SharePoint usando API?

SharePoint incluye muchos tipos de columnas comúnmente conocidos, como línea simple de texto, fecha, persona, etc. Algunos de estos son más complejos, pero **la columna de Calificación** es un ejemplo realmente interesante. Recopila calificaciones de múltiples usuarios y muestra una puntuación promedio para cada elemento.

![Columna de Calificación](/images/sharepointapi/SetRating/RatingColumn.png)

Cada lista puede tener **solo una columna única** de tipo calificación.

Dado que este no es un tipo de columna estándar, necesitas usar un endpoint especial para crearla.

## Características de la Columna de Calificación

### Funcionalidad Única
- **Agregación automática** de múltiples calificaciones de usuarios
- **Cálculo de promedio** en tiempo real
- **Una por lista**: Solo se permite una columna de calificación por lista

### Casos de Uso
- **Evaluación de contenido** por parte de usuarios
- **Sistemas de feedback** para documentos o elementos
- **Métricas de calidad** basadas en la comunidad

## Implementación via API

Para trabajar con columnas de calificación mediante API, debes:

1. **Usar endpoints específicos** para su creación
2. **Manejar la agregación** de datos de calificación
3. **Considerar permisos** para calificaciones de usuarios

## Conclusión

Las columnas de calificación en SharePoint proporcionan una manera poderosa de recopilar feedback de usuarios. Aunque requieren endpoints especiales para su manipulación via API, ofrecen funcionalidad valiosa para sistemas colaborativos.
