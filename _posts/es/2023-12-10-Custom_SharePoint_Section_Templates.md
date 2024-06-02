---
layout: post
title:  "Plantillas Personalizadas de Sección en SharePoint"
date:   2025-12-10 00:00:00 +0200
tags: [ "SharePoint","SPFx", "Application Customizer"]
image: "/images/sectionsExtensions/Header.png"
language: es
permalink: /2023/12/09/es/Custom_SharePoint_Section_Templates.html
---

# Mejorando la Experiencia del Editor con Plantillas Personalizadas de Sección - la Extensión de SharePoint

## Introducción

Esta función ha sido desarrollada en asociación con Olga Staszek-Kornet, Consultora de Microsoft 365 y Power Platform, y Coordinadora de Proyectos en el área de Digital Workplace—en lo personal, mi esposa. Ella es la originadora de todo el concepto y la autora del artículo a continuación, mientras que yo soy el autor del código. La solución está disponible en [GitHub](https://github.com/mkm17/react-application-page-sections).

SharePoint Online se presenta como una plataforma robusta para la colaboración y la gestión de contenido. Microsoft trabaja arduamente para llevar esta magnífica herramienta a la nueva era de creación de contenido y procesamiento de información con algunas mejoras revolucionarias en el horizonte, como [Copilot en SharePoint](https://www.microsoft.com/en-ww/microsoft-365/roadmap?filters=SharePoint&searchterms=124840), [el nuevo centro de marca](https://www.microsoft.com/en-ww/microsoft-365/roadmap?filters=SharePoint&searchterms=124838), o [la coautoría simultánea en páginas de SharePoint](https://www.microsoft.com/en-ww/microsoft-365/roadmap?filters=SharePoint&searchterms=124853), por nombrar algunas. Aunque otras mejoras y características adicionales se entregan a SharePoint Online con bastante regularidad últimamente, los creadores de contenido aún se encuentran deseando elementos adicionales que son clave para sus funciones comerciales diarias.

Un punto de dolor frecuentemente encontrado es, sin duda, la falta de plantillas personalizables para secciones de página. Para responder a esta necesidad popular, juntos hemos desarrollado un concepto de la extensión de SharePoint Online: la solución de Plantillas Personalizadas de Sección diseñada para mejorar las capacidades de edición de las páginas de SharePoint.

## La idea detrás de la solución

La inspiración directa para desarrollar la solución provino del proyecto que he coordinado últimamente. Una gran empresa construye su plataforma intranet basada en SharePoint principalmente desde cero. Con una política estricta con respecto a la aplicación de elementos que soportan la identidad visual de la empresa y un fuerte enfoque en proporcionar una experiencia de usuario coherente y de alta calidad, un equipo de especialistas proyecta un conjunto de plantillas de página para ser distribuidas globalmente. Este es un enfoque popular para mantener diseños coherentes, pero con el creciente número de estas plantillas y sus variantes, la necesidad de más flexibilidad en el proceso de creación de páginas se vuelve más y más aparente. La solución que hemos desarrollado es una respuesta a esta necesidad.

Por supuesto, SharePoint Online tiene de manera nativa la función para plantillas de secciones de página. En principio, estas son esencialmente lo que necesitamos: secciones preconstruidas que ya están divididas en columnas y llenas con ciertas partes web. Qué lástima que esta función no sea personalizable y permita elegir solo entre 6 (¡seis!) opciones disponibles, construidas solo con las partes web de Texto e Imagen.

Reconociendo las limitaciones en la edición de páginas de SharePoint, nos propusimos crear la extensión de la aplicación que llenaría los vacíos en funcionalidad. El resultado es una herramienta flexible que permite a los usuarios guardar secciones ya desplegadas con configuraciones exactas de partes web y colocarlas en cualquier página. Las plantillas de secciones también pueden ser preparadas previamente por los administradores de SharePoint y liberadas globalmente en forma de biblioteca de secciones. Una lista designada de SharePoint constituye un almacenamiento simple pero efectivo para el código utilizado para recuperar los mismos diseños.

## Características clave

### 1. Duplicación de secciones

Nuestra solución facilita la recreación de plantillas de secciones predefinidas desde dos fuentes distintas:

- **Lista de Secciones Específicas del Sitio:** Adaptada por los propietarios y editores del sitio, permite definir plantillas de secciones específicas del sitio que se ajustan a las necesidades únicas de equipos o proyectos individuales.
- **Lista de Secciones Globales:** Gestionada por administradores, esta lista global proporciona un repositorio centralizado de secciones para uso consistente en toda la organización.

### 2. Creación eficiente de páginas

Al habilitar la inserción rápida de secciones preconfiguradas, nuestra extensión acelera el proceso de creación de páginas. Esto no solo ahorra tiempo, sino que también asegura consistencia en el diseño y la estructura de las páginas de SharePoint, manteniéndose en línea con las directrices aplicadas globalmente.

### 3. Desarrollo sistematizado de páginas

Las listas de Plantillas de Secciones sirven como punto de referencia para construir estructuras de página cohesivas basadas en arreglos repetitivos de secciones. De esta manera, los usuarios pueden seleccionar e implementar fácilmente secciones como 'bloques de construcción' principales en su página, fomentando simultáneamente un enfoque dirigido por la empresa para el desarrollo consistente de páginas.

### 4. Manera fácil de copiar partes web con configuración específica

La solución permite copiar secciones con partes web incrustadas, manteniendo toda su configuración inicial. Esta característica es especialmente útil cuando los usuarios desean copiar una parte web con configuración compleja o que consume tiempo, como la parte web de Enlaces Rápidos. Aquí, toda la configuración se guarda en el código, y así se puede colocar la copia exacta de alguna parte web en otra página agregando toda la sección copiada y eliminando las partes redundantes.

## El proceso de crear y aplicar plantillas de secciones

### Crear una plantilla de sección
1. **Seleccionar una sección:** Ve a tu página de SharePoint, activa el modo de Edición, selecciona cualquier sección que desees guardar y haz clic en el botón "Guardar sección" en la barra de comandos de la sección, en la parte izquierda de la pantalla.
   
   ![Botón Guardar Sección](/images/sectionsExtensions/CopySectionButton.png)

   Si se ha aplicado algún cambio a la estructura de la página, guarda tus cambios y activa el modo de Edición nuevamente o espera a que la página se guarde automáticamente antes de copiar la sección a la página. De lo contrario, la posición calculada de la sección será incorrecta e influirá en el alcance de la plantilla guardada. Por la misma razón, actualmente no manejamos esta actividad en la vista móvil.

2. **Guardar la sección seleccionada:** Crea una nueva plantilla de sección agregando un título (requerido), descripción y nombre de icono.
   
   ![Formulario Guardar Sección](/images/sectionsExtensions/CopySectionForm.png)

3. **Copiar el código JSON** Opcionalmente, copia el código JSON de la sección seleccionada al portapapeles. Esta característica puede usarse para agregar elementos a la Lista de Secciones Global o para echar un vistazo a los elementos dentro.

   ![Copiar al Portapapeles](/images/sectionsExtensions/CopyToClipboard.png)

### Aplicar la plantilla a otra página
1. **Agregar una sección:** En la página de destino (misma u otra), cuando esté en modo de Edición, el editor puede ver el nuevo botón "Agregar sección" en la barra superior, junto a 'Guardar como borrador', 'Deshacer', 'Descartar cambios', y las otras opciones disponibles nativamente en el proceso de creación de páginas.
   
   ![Botón Agregar Sección](/images/sectionsExtensions/AddSectionButton.png)

2. **Seleccionar la fuente de datos:** Elige la fuente de la plantilla que deseas usar, ya sea la Lista de Secciones Global con plantillas especificadas por el administrador o la lista específica del sitio basada en tus requisitos locales.
   
   ![Panel Agregar Sección](/images/sectionsExtensions/AddSectionPanel.png)

3. **Agregar a la página:** La sección elegida con columnas y partes web, junto con su configuración granular, se adjunta sin problemas al final de la página de SharePoint de destino. Para mostrar el efecto final, la solución actualizará la página actual automáticamente.

## Opciones de almacenamiento para plantillas de secciones

![Lista de Plantillas de Secciones](/images/sectionsExtensions/SectionTemplatesList.png)

### Lista de Plantillas de Sección Específicas del Sitio

1. La lista a nivel de sitio se crea automáticamente cuando la extensión personalizada se instala en un sitio. La provisión de la lista "SectionTemplates" se proporciona mediante las capacidades estándar de la extensión SPFx.
2. Los elementos de la lista contienen información sobre el título de la plantilla, descripción, nombre del icono y una plantilla en formato JSON.

### Lista de Plantillas de Sección Global

1. La lista de secciones global se crea manualmente por el administrador de SharePoint. La lista "SectionTemplates" debe tener la misma estructura que la lista de secciones específicas del sitio.
2. La URL web de la lista global de secciones debe especificarse en las propiedades de la extensión para extraer correctamente el rango de plantillas disponibles para elegir.

### Permisos

En ambos casos, los permisos para las listas deben ser configurados por el administrador. Por defecto, las listas específicas del sitio se crean con los mismos permisos que el sitio donde se crean. Todos los editores que necesiten usar la extensión deben tener al menos permisos para ver y agregar elementos de lista.

Para la lista global de secciones, es aconsejable otorgar acceso de solo lectura a todos los usuarios para permitirles aplicar las plantillas a sus sitios. Asegúrate de que las plantillas de secciones aplicadas globalmente aprovechen las partes web comúnmente accesibles y su configuración no use ningún elemento específico del sitio.

## Conclusión

Nuestra extensión de SharePoint Online para crear plantillas personalizadas de secciones de página es una valiosa adición para organizaciones y usuarios que buscan mejorar su experiencia de edición en SharePoint. Al simplificar el proceso de creación de secciones y proporcionar un enfoque sistemático para el desarrollo de páginas, esta extensión contribuye a un entorno de SharePoint más eficiente y organizado.

Para obtener más información o comenzar con la Extensión de Aplicación de SharePoint Online, visita [nuestro perfil de GitHub](https://github.com/mkm17/react-application-page-sections).
