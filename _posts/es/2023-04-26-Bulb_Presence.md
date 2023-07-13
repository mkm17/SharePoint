---
layout: postES
title:  "Indicar estado de presencia usando la bombilla en Microsoft Teams"
date:   2023-04-26 00:00:00 +0200
tags: ["Power Automate", "Xiaomi Yeelight", "MS Graph"]
image: "/images/bulb/header.png"
language: es
permalink: /2023/04/26/es/Bulb_Presence.html
---

¿Alguna vez te has preguntado lo fácil que es en **Power Automate** conectarse a dispositivos externos?

En este artículo, comparto mi idea de un sistema para notificar visualmente el estado de disponibilidad de los participantes en Teams.

Con la pandemia global obligándonos a trabajar de forma remota, se volvió crucial establecer nuevas reglas no solo en nuestros lugares de trabajo, sino también en casa con otros miembros del hogar. Todos hemos visto videos virales de participantes interrumpiendo voluntariamente en reuniones importantes durante momentos menos convenientes. Esto me hizo pensar si había una manera de mostrar el estado de disponibilidad de los participantes a otros miembros del hogar o compañeros de trabajo que no tienen acceso al entorno de **Microsoft 365** del empleado.

Mi investigación comenzó con algunas soluciones ya existentes en la misma línea: [The Status Cube publicado por John Klimister](https://www.blueboxes.co.uk/building-a-ms-teams-status-cube-with-the-graph-api-presence-subscriptions), [Ejemplo de bombilla Hue por Scott Hanselman](https://www.hanselman.com/blog/mirroring-your-presence-status-from-the-microsoft-graph-in-teams-to-lifx-or-hue-bias-lighting), [o la automatización basada en Raspberry Pi de Elio Struyf](https://www.eliostruyf.com/diy-building-busy-light-show-microsoft-teams-presence/). Si bien son inspiradores, cada uno presenta escenarios más complejos y requiere habilidades avanzadas de programación. Mi objetivo era utilizar la menor cantidad de programación posible para que así más personas pudieran beneficiarse de la configuración personalizada en su propio entorno.

### Tabla de contenidos
- [Presencia y suscripciones en MS Graph](#presencia-y-suscripciones-en-ms-graph)
- [Power Automate](#power-automate)
  - [Desencadenador](#desencadenador)
  - [Acciones principales](#acciones-principales)
  - [La actualización de la suscripción](#la-actualización-de-la-suscripción)
- [El efecto final](#el-efecto-final)
- [Problemas conocidos](#problemas-conocidos)

## [Presencia](https://learn.microsoft.com/es-es/graph/api/resources/presence?view=graph-rest-1.0) y [suscripciones](https://learn.microsoft.com/es-es/graph/api/resources/subscription?view=graph-rest-1.0) en MS Graph

La información sobre el estado de disponibilidad del usuario se incluye en los datos generales de este mismo y se puede capturar mediante MS Graph utilizando una suscripción. El tipo de recurso de suscripción se utiliza para recibir notificaciones cuando se crea, actualiza o elimina dicho recurso. Utilizaremos esta funcionalidad para monitorear cambios en la presencia de cualquier usuario de Teams y activar un flujo de Power Automate cada vez que cambie el estado.

Aquí tienes un ejemplo de carga útil de solicitud de suscripción para el tipo de recurso de presencia:


```javascript
{
    "changeType": "updated",
    "notificationUrl": "<<FLOW URL>>",
    "resource": "/communications/presences/<<USER ID>>",
    "expirationDateTime": "2023-04-12T18:23:45.9356913Z",
    "clientState": "secretClientValue",
    "latestSupportedTlsVersion": "v1_2"
}
```
*changeType*: El tipo de cambio en el recurso suscrito que genera una notificación. Los valores admitidos son created, updated y deleted (creados, actualizados y eliminados)

*notificationUrl*: La URL del punto final que recibe las notificaciones. Reemplázala con tu URL de API (en este caso, el desencadenador HTTP de Power Automate del punto 2 en la sección de Power Automate).

*resource*: El recurso que la suscripción monitorea en busca de cambios. Este recurso se identifica mediante la ruta del recurso. Para un solo usuario, utiliza el endpoint */communications/presences/{id}*, donde *{id}* representa el ID del usuario. Utilizando la API de Microsoft Graph, también puedes hacer un seguimiento de una lista de usuarios con el siguiente endpoint: */communications/presences?$filter=id in (‘{id}’, ‘{id}’, …)*.

*expirationDateTime*: La fecha y hora en que expira la suscripción. Ten en cuenta que el tiempo máximo de expiración para el endpoint de presencia es de 60 minutos, así que asegúrate de actualizar tu suscripción en consecuencia para garantizar que la funcionalidad persista. La fecha y la hora están en UTC y se representan en formato ISO 8601. Por ejemplo, la medianoche UTC del 1 de enero de 2024 se representa como 2024-01-01T00:00:00Z.


## Power Automate

Power Automate fue una elección natural para una solución simple pero poderosa para diseñar un flujo de trabajo efectivo que se active por el cambio de disponibilidad del usuario y realice acciones consecuentes para cambiar el color de la bombilla en consecuencia. El siguiente gráfico presenta el diseño del flujo.

![Flow](/images/bulb/PresenceDisplayFlow.PNG)

### Desencadenador

* El flujo se activa mediante una solicitud HTTP. Utiliza el desencadenador HTTP para inicializar la solicitud de suscripción desde la **API de Microsoft Graph**.

* En última instancia, hay dos tipos de solicitudes que iniciarán el flujo. El primero tiene como objetivo confirmar el valor secreto a la **API de Microsoft Graph** al responder con un valor requerido. Este paso es esencial para establecer el proceso de autenticación y autorización con la API. La segunda solicitud implica manejar el valor de la presencia del usuario, lo que permite capturar y procesar el estado de disponibilidad del usuario.

* Para comenzar tus pruebas y asegurarte de que la solicitud de suscripción sea válida en cualquier punto del desarrollo del flujo de trabajo, utiliza el MS Graph Explorer.

![Graph Explorer](/images/bulb/GraphExplorer.png)

### Acciones principales

* Inicializa la variable de objeto utilizada para almacenar el conjunto de valores que se proporcionarán antes de la primera ejecución. Incluye los datos de la bombilla: tomarás las propiedades “did” (identificador), “region” (región) y “type” (tipo) de la consulta de prueba en el paso Descubrir que se describe a continuación.

 {% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{"id":"5fac0a4e-16fc-4f41-99e3-a5954da2a20f","brandColor":"#007ee5","icon":"https://connectoricons-prod.azureedge.net/releases/v1.0.1549/1.0.1549.2680/yeelight/icon.png","isTrigger":false,"operationName":"Discover details on your Xiaomi devices","operationDefinition":{"type":"OpenApiConnection","inputs":{"host":{"connectionName":"shared_yeelight_2","operationId":"Discover","apiId":"/providers/Microsoft.PowerApps/apis/shared_yeelight"},"parameters":{},"authentication":"@parameters('$authentication')"},"runAfter":{"Check_if_the_request_addresses_the_current_tenant":["Succeeded"]},"metadata":{"operationMetadataId":"256540c4-ef84-4b99-ae32-55929bba99f5"}}}
</div>

![DiscoverAction](/images/bulb/DiscoverOnly.png)

*did*: Esta propiedad se refiere al identificador único de la bombilla Yeelight Colorful.

*region*: Tu región.

*type*: Se refiere al tipo o modelo de la bombilla Yeelight Colorful.

El valor “tenantId” almacena el número de identificación de tu inquilino. Agrego los siguientes valores a la variable de objeto para indicar los códigos de color para opciones particulares:

```javascript
{
  "redColor": "16711680",
  "greenColor": "65280",
  "yellowColor": "16776960",
  "whiteColor": "16777215",
}
```
{% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">{"id":"7e112577-ea1e-488b-8156-171c7586fd49","brandColor":"#770BD6","connectionReferences":{"shared_yeelight_2":{"connection":{"id":"/providers/Microsoft.PowerApps/apis/shared_yeelight/connections/shared-yeelight-26212218-f942-4cdb-af50-0853bfcb13be"}}},"connectorDisplayName":"Variables","icon":"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzMnB4IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAzMiAzMiIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQogPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjNzcwQkQ2Ii8+DQogPGcgZmlsbD0iI2ZmZiI+DQogIDxwYXRoIGQ9Ik02Ljc2MywxMy42ODV2LTMuMjA4QzYuNzYzLDguNzQ4LDcuNzYyLDgsMTAsOHYxLjA3Yy0xLDAtMiwwLjMyNS0yLDEuNDA3djMuMTg4ICAgIEM4LDE0LjgzNiw2LjUxMiwxNiw1LjUxMiwxNkM2LjUxMiwxNiw4LDE3LjE2NCw4LDE4LjMzNVYyMS41YzAsMS4wODIsMSwxLjQyOSwyLDEuNDI5VjI0Yy0yLjIzOCwwLTMuMjM4LTAuNzcyLTMuMjM4LTIuNXYtMy4xNjUgICAgYzAtMS4xNDktMC44OTMtMS41MjktMS43NjMtMS41ODV2LTEuNUM1Ljg3LDE1LjE5NCw2Ljc2MywxNC44MzQsNi43NjMsMTMuNjg1eiIvPg0KICA8cGF0aCBkPSJtMjUuMjM4IDEzLjY4NXYtMy4yMDhjMC0xLjcyOS0xLTIuNDc3LTMuMjM4LTIuNDc3djEuMDdjMSAwIDIgMC4zMjUgMiAxLjQwN3YzLjE4OGMwIDEuMTcxIDEuNDg4IDIuMzM1IDIuNDg4IDIuMzM1LTEgMC0yLjQ4OCAxLjE2NC0yLjQ4OCAyLjMzNXYzLjE2NWMwIDEuMDgyLTEgMS40MjktMiAxLjQyOXYxLjA3MWMyLjIzOCAwIDMuMjM4LTAuNzcyIDMuMjM4LTIuNXYtMy4xNjVjMC0xLjE0OSAwLjg5My0xLjUyOSAxLjc2Mi0xLjU4NXYtMS41Yy0wLjg3LTAuMDU2LTEuNzYyLTAuNDE2LTEuNzYyLTEuNTY1eiIvPg0KICA8cGF0aCBkPSJtMTUuODE1IDE2LjUxMmwtMC4yNDItMC42NDFjLTAuMTc3LTAuNDUzLTAuMjczLTAuNjk4LTAuMjg5LTAuNzM0bC0wLjM3NS0wLjgzNmMtMC4yNjYtMC41OTktMC41MjEtMC44OTgtMC43NjYtMC44OTgtMC4zNyAwLTAuNjYyIDAuMzQ3LTAuODc1IDEuMDM5LTAuMTU2LTAuMDU3LTAuMjM0LTAuMTQxLTAuMjM0LTAuMjUgMC0wLjMyMyAwLjE4OC0wLjY5MiAwLjU2Mi0xLjEwOSAwLjM3NS0wLjQxNyAwLjcxLTAuNjI1IDEuMDA3LTAuNjI1IDAuNTgzIDAgMS4xODYgMC44MzkgMS44MTEgMi41MTZsMC4xNjEgMC40MTQgMC4xOC0wLjI4OWMxLjEwOC0xLjc2IDIuMDQ0LTIuNjQxIDIuODA0LTIuNjQxIDAuMTk4IDAgMC40MyAwLjA1OCAwLjY5NSAwLjE3MmwtMC45NDYgMC45OTJjLTAuMTI1LTAuMDM2LTAuMjE0LTAuMDU1LTAuMjY2LTAuMDU1LTAuNTczIDAtMS4yNTYgMC42NTktMi4wNDggMS45NzdsLTAuMjI3IDAuMzc5IDAuMTc5IDAuNDhjMC42ODQgMS44OTEgMS4yNDkgMi44MzYgMS42OTQgMi44MzYgMC40MDggMCAwLjcyLTAuMjkyIDAuOTM1LTAuODc1IDAuMTQ2IDAuMDk0IDAuMjE5IDAuMTkgMC4yMTkgMC4yODkgMCAwLjI2MS0wLjIwOCAwLjU3My0wLjYyNSAwLjkzOHMtMC43NzYgMC41NDctMS4wNzggMC41NDdjLTAuNjA0IDAtMS4yMjEtMC44NTItMS44NTEtMi41NTVsLTAuMjE5LTAuNTc4LTAuMjI3IDAuMzk4Yy0xLjA2MiAxLjgyMy0yLjA3OCAyLjczNC0zLjA0NyAyLjczNC0wLjM2NSAwLTAuNjc1LTAuMDkxLTAuOTMtMC4yNzFsMC45MDYtMC44ODVjMC4xNTYgMC4xNTYgMC4zMzggMC4yMzQgMC41NDcgMC4yMzQgMC41ODggMCAxLjI1LTAuNTk2IDEuOTg0LTEuNzg2bDAuNDA2LTAuNjU4IDAuMTU1LTAuMjU5eiIvPg0KICA8ZWxsaXBzZSB0cmFuc2Zvcm09Im1hdHJpeCguMDUzNiAtLjk5ODYgLjk5ODYgLjA1MzYgNS40OTI1IDMyLjI0NSkiIGN4PSIxOS43NTciIGN5PSIxMy4yMjUiIHJ4PSIuNzc4IiByeT0iLjc3OCIvPg0KICA8ZWxsaXBzZSB0cmFuc2Zvcm09Im1hdHJpeCguMDUzNiAtLjk5ODYgLjk5ODYgLjA1MzYgLTcuNTgzOSAzMC42MjkpIiBjeD0iMTIuMzY2IiBjeT0iMTkuMzE1IiByeD0iLjc3OCIgcnk9Ii43NzgiLz4NCiA8L2c+DQo8L3N2Zz4NCg==","isTrigger":false,"operationName":"Initialize_varBulbData","operationDefinition":{"type":"InitializeVariable","inputs":{"variables":[{"name":"varBulbData","type":"object","value":{"did":"","region":"DE","type":"","redColor":"16711680","greenColor":"65280","yellowColor":"16776960","whiteColor":"16777215","tenantId":""}}]},"runAfter":{},"metadata":{"operationMetadataId":"15e38f57-13f7-44a3-a1f9-c63aeb68f357"}}}
</div>

![InitVariable](/images/bulb/initdata.png)

* Las variables enteras resultan útiles para almacenar la información sobre los colores de luz objetivo y actual.

* Verifica si la solicitud es una confirmación de suscripción con la siguiente condición.

 {% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{"id":"05eea601-17eb-4a3e-8a49-83ca410d74d8","brandColor":"#007ee5","icon":"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZlcnNpb249IjEuMSIgdmlld0JveD0iLTQgLTQgNjAgNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQogPHBhdGggZD0ibS00LTRoNjB2NjBoLTYweiIgZmlsbD0iIzQ4NEY1OCIvPg0KIDxwYXRoIGQ9Ik00MSAxOC41di03LjVoLTMwdjcuNWg1LjY0djEzLjgzbC0zLjI4NS0zLjI4NS0xLjA2NSAxLjA2NSA0LjAzNSA0LjA1Ljg3Ljg0aC02LjE5NXY2aDEzLjV2LTZoLTYuOWwuODU1LS44NTUgNC4wMzUtNC4wNS0xLjA2NS0xLjA2NS0zLjI4NSAzLjI4NXYtMTMuODE1aDE1djEzLjgzbC0zLjI4NS0zLjI4NS0xLjA2NSAxLjA2NSA0LjAzNSA0LjA1Ljg3Ljg0aC02LjE5NXY2aDEzLjV2LTZoLTYuOWwuODU1LS44NTUgNC4wMzUtNC4wNS0xLjA2NS0xLjA2NS0zLjI4NSAzLjI4NXYtMTMuODE1em0tMjguNS02aDI3djQuNWgtMjd6IiBmaWxsPSIjZmZmIi8+DQo8L3N2Zz4NCg==","isTrigger":false,"operationName":"Check if the request is a subscription confirmation","operationDefinition":{"type":"If","expression":{"equals":["@contains(triggerOutputs(), 'queries')","@true"]},"actions":{},"runAfter":{"Check_if_the_request_is_a_subscription_confirmation_3":["Succeeded"]},"metadata":{"operationMetadataId":"7e06a1a3-4f25-47e7-89d3-d2f8fcc0c80d"}}}
</div>

![Condition](/images/bulb/IsSubscriptionConfirmationCondition.png)

```javascript
contains(triggerOutputs(),'queries') is equal to true
```

Si se cumple la condición, el flujo responderá con el valor requerido a la **Microsoft Graph API** para confirmar la suscripción. De lo contrario, pasará a los siguientes pasos.

* Verifica si la solicitud se dirige al inquilino actual: para asegurar el proceso, validamos el valor secreto que proviene de la solicitud. En un caso estándar, podemos utilizar un método descrito en esta [publicación de blog](https://elnathsoft.pl/steal-data-with-ms-flow/). Como no controlamos el cuerpo de la solicitud, en su lugar, podemos verificar si la solicitud proviene del inquilino especificado en la propiedad tenantId de la variable de objeto con los datos de la bombilla. De lo contrario, se cancelará el flujo de trabajo.

![Tenant](/images/bulb/TenantIdCheck.png)

```javascript
triggerOutputs()?['body']?['value'][0]?['tenantId']  is equal to  '<<TENANT ID>>'
```

![Check Tenant Id](/images/bulb/checktenantid.png)

Para este proyecto en particular, incorporé el dispositivo **Yeelight Colorful Bulb**, que es una bombilla inteligente asequible controlada de forma remota a través de una conexión Wi-Fi. Para obtener más información sobre el dispositivo, puedes utilizar las acciones de Descubrir (Discover) y Consultar (Query) del servicio Yeelight proporcionado por Xiaomi. La salida de la consulta contiene la propiedad “spectrumRGB” que debe establecerse en una variable para su uso en la siguiente acción.

{% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{"id":"785b8302-cfe2-4404-a70d-a68275111f3f","brandColor":"#007ee5","icon":"https://connectoricons-prod.azureedge.net/releases/v1.0.1549/1.0.1549.2680/yeelight/icon.png","isTrigger":false,"operationName":"Identify the target device","operationDefinition":{"type":"OpenApiConnection","inputs":{"host":{"connectionName":"shared_yeelight_2","operationId":"Query","apiId":"/providers/Microsoft.PowerApps/apis/shared_yeelight"},"parameters":{"body/did":"@variables('varBulbData')?['did']","body/region":"@variables('varBulbData')?['region']","body/type":"@variables('varBulbData')?['type']"},"authentication":"@parameters('$authentication')"},"runAfter":{"Discover_details_on_your_Xiaomi_devices":["Succeeded"]},"metadata":{"operationMetadataId":"3255b09e-0b64-4f23-8e1c-0f5be01f4564"}}}
</div>

![Discovery action](/images/bulb/DiscoverBulb.png)

Para configurar la integración, necesitarás registrar una cuenta con Xiaomi y conectar la Yeelight Colorful Bulb. Debido a preocupaciones de seguridad, utilizo una conexión separada establecida exclusivamente para productos de Xiaomi. Una vez que la bombilla esté conectada a tu cuenta de Xiaomi, debes iniciar sesión en la misma cuenta para establecer la conexión dentro de cada acción basada en Xiaomi en la vista del creador de Power Automate.

* Verifica si el parámetro “value” no está vacío: en etapas posteriores, utilizamos el primer elemento del array *value*. Para evitar errores, comprobamos si *value* no está vacío.

```javascript
length(triggerOutputs()?['body']?['value']) is not equal to 0
```

* Establece el color de la bombilla en función de la actividad del usuario identificada: utiliza la acción “Switch” para sobrescribir la variable “varNewBulbColor” con el indicador de actividad del usuario.

{% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{
    "id": "a9abf920-e736-4b15-ae5e-463c366da02b",
    "brandColor": "#007ee5",
    "icon": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDMyIDMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KIDxwYXRoIGQ9Im0wIDBoMzJ2MzJoLTMyeiIgZmlsbD0iIzQ4NEY1OCIvPg0KIDxnIGZpbGw9IiNmZmYiPg0KICA8cGF0aCBkPSJtMjUuNiAxOS42di03LjJoLTE5LjJ2Ny4yem0tMS4yLTEuMmgtMTYuODAxdi00LjhoMTYuOHY0Ljh6Ii8+DQogIDxwYXRoIGQ9Ik0xMS44IDE3LjJ2LTEuMmgtLjZ2LTEuMmgtMS4ydjEuMmgtLjZ2MS4yeiIvPg0KICA8cGF0aCBkPSJNMTUuNCAxNy4ydi0xLjJoLS42di0xLjJoLTEuMnYxLjJoLS42djEuMnoiLz4NCiAgPHBhdGggZD0iTTE5IDE3LjJ2LTEuMmgtLjZ2LTEuMmgtMS4ydjEuMmgtLjZ2MS4yeiIvPg0KICA8cGF0aCBkPSJNMjIuNiAxNy4ydi0xLjJoLS42di0xLjJoLTEuMnYxLjJoLS42djEuMnoiLz4NCiA8L2c+DQo8L3N2Zz4NCg==",
    "isTrigger": false,
    "operationName": "Set the bulb colour based on the identified user activity",
    "operationDefinition": {
        "type": "Switch",
        "expression": "@triggerOutputs()?['body']?['value'][0]?['resourceData']?['activity']",
        "cases": {
            "OffWork": {
                "case": "OffWork",
                "actions": {
                    "Set_varNewBulbColor_to_white": {
                        "type": "SetVariable",
                        "inputs": {
                            "name": "varNewBulbColor",
                            "value": "@variables('varBulbData')?['whiteColor']"
                        },
                        "runAfter": {}
                    }
                }
            },
            "Available": {
                "case": "Available",
                "actions": {
                    "Set_varNewBulbColor_to_green": {
                        "type": "SetVariable",
                        "inputs": {
                            "name": "varNewBulbColor",
                            "value": "@variables('varBulbData')?['greenColor']"
                        },
                        "runAfter": {}
                    }
                }
            },
            "Busy": {
                "case": "Busy",
                "actions": {
                    "Set_varNewBulbColor_to_red": {
                        "type": "SetVariable",
                        "inputs": {
                            "name": "varNewBulbColor",
                            "value": "@variables('varBulbData')?['redColor']"
                        },
                        "runAfter": {}
                    }
                }
            },
            "DoNotDisturb": {
                "case": "DoNotDisturb",
                "actions": {
                    "Set_varNewBulbColor_to_red_2": {
                        "type": "SetVariable",
                        "inputs": {
                            "name": "varNewBulbColor",
                            "value": "@variables('varBulbData')?['redColor']"
                        },
                        "runAfter": {}
                    }
                }
            },
            "BeRightBack": {
                "case": "BeRightBack",
                "actions": {
                    "Set_varNewBulbColor_to_yellow": {
                        "type": "SetVariable",
                        "inputs": {
                            "name": "varNewBulbColor",
                            "value": "@variables('varBulbData')?['yellowColor']"
                        },
                        "runAfter": {}
                    }
                }
            },
            "Away": {
                "case": "Away",
                "actions": {
                    "Set_varNewBulbColor_to_yellow_2": {
                        "type": "SetVariable",
                        "inputs": {
                            "name": "varNewBulbColor",
                            "value": "@variables('varBulbData')?['yellowColor']"
                        },
                        "runAfter": {}
                    }
                }
            },
            "Offline": {
                "case": "Offline",
                "actions": {
                    "Set_varNewBulbColor_to_white_2": {
                        "type": "SetVariable",
                        "inputs": {
                            "name": "varNewBulbColor",
                            "value": "@variables('varBulbData')?['whiteColor']"
                        },
                        "runAfter": {}
                    }
                }
            }
        },
        "default": {
            "actions": {}
        },
        "runAfter": {},
        "metadata": {
            "operationMetadataId": "eddaf68d-de21-48d6-9d31-dc3674e17763"
        }
    }
}
</div>

![switch](/images/bulb/switchStatement.png)

```javascript
triggerOutputs()?['body']?['value'][0]?['resourceData']?['activity']
```

Aquí tienes los valores que se deben utilizar en la declaración Switch:

```javascript
OffWork - whiteColor
Offline - whiteColor
Available - greenColor
Busy - redColor
DoNotDisturb - redColor
BeRightBack - yellowColor
Away - yellowColor
```

* Verificar si el color objetivo es diferente al actual: la condición verifica si el color actual de la bombilla es diferente al color objetivo. Si la condición es falsa, el flujo se terminará.

{% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{"id":"d056f961-752c-46a7-bd5f-033572eb6279","brandColor":"#007ee5","icon":"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZlcnNpb249IjEuMSIgdmlld0JveD0iLTQgLTQgNjAgNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQogPHBhdGggZD0ibS00LTRoNjB2NjBoLTYweiIgZmlsbD0iIzQ4NEY1OCIvPg0KIDxwYXRoIGQ9Ik00MSAxOC41di03LjVoLTMwdjcuNWg1LjY0djEzLjgzbC0zLjI4NS0zLjI4NS0xLjA2NSAxLjA2NSA0LjAzNSA0LjA1Ljg3Ljg0aC02LjE5NXY2aDEzLjV2LTZoLTYuOWwuODU1LS44NTUgNC4wMzUtNC4wNS0xLjA2NS0xLjA2NS0zLjI4NSAzLjI4NXYtMTMuODE1aDE1djEzLjgzbC0zLjI4NS0zLjI4NS0xLjA2NSAxLjA2NSA0LjAzNSA0LjA1Ljg3Ljg0aC02LjE5NXY2aDEzLjV2LTZoLTYuOWwuODU1LS44NTUgNC4wMzUtNC4wNS0xLjA2NS0xLjA2NS0zLjI4NSAzLjI4NXYtMTMuODE1em0tMjguNS02aDI3djQuNWgtMjd6IiBmaWxsPSIjZmZmIi8+DQo8L3N2Zz4NCg==","isTrigger":false,"operationName":"Check if the target colour is different than the current one","operationDefinition":{"type":"If","expression":{"not":{"equals":["@variables('varNewBulbColor')","@variables('varPreviousBulbColor')"]}},"actions":{},"runAfter":{},"metadata":{"operationMetadataId":"a3522d65-3eea-48f2-ab5e-0ed5202d6925"}}}
</div>

![Color change condition](/images/bulb/colorChangeCondition.png)

Para cambiar el color de la bombilla usando Power Automate, es esencial completar las siguientes propiedades en todas las acciones finales de Color:

{% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{"id":"eb83e063-99d4-44f9-9c3c-f0b3e8321f38","brandColor":"#007ee5","icon":"https://connectoricons-prod.azureedge.net/releases/v1.0.1549/1.0.1549.2680/yeelight/icon.png","isTrigger":false,"operationName":"Change the bulb colour","operationDefinition":{"type":"OpenApiConnection","inputs":{"host":{"connectionName":"shared_yeelight_2","operationId":"Color","apiId":"/providers/Microsoft.PowerApps/apis/shared_yeelight"},"parameters":{"body/did":"@variables('varBulbData')?['did']","body/spectrumRGB":"@variables('varNewBulbColor')","body/region":"@variables('varBulbData')?['region']","body/type":"@variables('varBulbData')?['type']"},"authentication":{"type":"Raw","value":"@json(decodeBase64(triggerOutputs().headers['X-MS-APIM-Tokens']))['$ConnectionKey']"}},"runAfter":{},"metadata":{"operationMetadataId":"26108701-6a4f-4510-9d1c-3f0f116f7fdd"}}}
</div>

![Color action](/images/bulb/ColorBulb.png)

### La actualización de la suscripción

Tratamos el proceso descrito anteriormente en términos de Prueba de Concepto. Para mantener tu suscripción válida, cada 60 minutos se debe activar otro flujo para realizar la misma solicitud que en MS Graph Explorer, actualizando así la suscripción.

![Subscription Update Flow](/images/bulb/SubscriptionUpdate.png)

El proceso de creación de un Conector Personalizado para MS Graph se describe [aquí](https://medium.com/rapha%C3%ABl-pothin/create-a-custom-connector-for-microsoft-graph-581676585529).

## El efecto final
 La bombilla cambia de color según el estado de disponibilidad del usuario. Cuando el usuario está desconectado o no está trabajando, funciona como una bombilla normal. Cuando el usuario está disponible, la bombilla se vuelve verde. Cuando el usuario está ocupado o ausente, la bombilla se vuelve roja. Cuando el usuario está ausente, la bombilla se vuelve amarilla.
![Effect](/images/bulb/effect.png)

## Problemas conocidos
 * Por razones desconocidas, la suscripción tiende a activar el flujo varias veces. He probado algunas soluciones alternativas, pero hasta ahora ninguna de ellas ha tenido éxito. Si alguien tiene alguna idea, por favor házmela saber.

![TooManyRequests](/images/bulb/TooManyRequests.png)

* Al cambiar el color de la bombilla muestra el siguiente error. Sin embargo, el color cambia correctamente y no se observan otros problemas.

![Error](/images/bulb/ChangeColorError.png)