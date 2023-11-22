---
layout: postES
title:  "Unique Permissions SPFx Extension"
date:   2023-07-30 00:00:00 +0200
tags: [ "SharePoint", "SPFx", "Field Customizer"]
image: "/images/uniquePermissions/uniquePermissionsHeader.png"
language: xx
permalink: /2023/07/30/es/Unique_Permissions_SPFx_Extension.html
---

# Tabla de Contenidos
- [Concepto](#concepto)
- [Funcionalidades](#funcionalidades)
- [Instalación y Configuración](#instalación-y-configuración)

## Concepto

En mi experiencia, me he encontrado con varias situaciones en las que he tenido dificultades para manejar elementos o documentos con permisos únicos. Desafortunadamente, actualmente no hay un método directo para verificar esta información desde la vista de lista. Revisar cada elemento individualmente podría ser una experiencia tediosa y frustrante. Aunque una opción es generar un informe con datos sobre los permisos, esto agrega complejidad al utilizar una herramienta diferente fuera de SharePoint.

Este desafío me llevó a explorar posibilidades para una solución más eficiente. Comencé creando un simple personalizador de campos que muestra permisos únicos para los elementos. A medida que progresaba, agregué nuevas funcionalidades, culminando en el desarrollo de un personalizador de campos de ejemplo para permisos únicos.

Con este personalizador, ahora puedes ver y gestionar fácilmente los permisos únicos directamente desde la vista de lista, simplificando el proceso y mejorando la experiencia del usuario. Ya no será necesario navegar a través de múltiples interfaces o generar informes separados. Este personalizador simplifica la tarea de manejar elementos o documentos con permisos únicos, convirtiéndose en una adición valiosa a tu flujo de trabajo.

## Funcionalidades

La solución permite una manera sencilla de gestionar permisos únicos en elementos de la lista. Proporciona un personalizador de campos que se puede utilizar para mostrar los permisos del usuario actual, información sobre la singularidad de los permisos para un elemento y también varias opciones útiles que son fácilmente accesibles desde la columna.

![react-field-unique-permissions](/images/uniquePermissions/checkUserPermission.gif)
  
Todos los usuarios verán íconos que indican la singularidad de los permisos para un elemento y los permisos del usuario actual (actualmente, reconocemos permisos de Lectura, Edición y Administración).

#### Mostrar elementos con permisos únicos

![unique-permissions](/images/uniquePermissions/uniquePermissions.png)

#### Mostrar permisos del usuario actual

![current-user-permissions](/images/uniquePermissions/currentUserPermissions.png)

#### Mostrar permisos del usuario elegido

Para mostrar los permisos del usuario elegido, debes hacer clic en el ícono en la parte superior de la cinta y elegir el nombre del usuario. Luego, todos los elementos se actualizarán y verás los permisos del usuario seleccionado.

![check-user-permissions](/images/uniquePermissions/checkUserPermission.gif)

#### Gestionar permisos del elemento desde el personalizador de campos

Un usuario con permisos de administración también puede realizar algunas actividades directamente desde la columna del elemento. La solución proporciona una interfaz sencilla para restablecer la herencia de roles o un enlace directo a los detalles de los permisos.

![manage-permissions](/images/uniquePermissions/managePermissions.png)

## Instalación y Configuración

Puedes encontrar la solución en mi [repositorio de GitHub](https://github.com/mkm17/sp-dev-fx-extensions/tree/react-field-unique-permissions/samples/react-field-unique-permissions). Dentro, encontrarás más información sobre la instalación de la extensión.
