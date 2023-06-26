---
layout: postES
title: "Gestión de permisos: Cómo crear mensajes personalizados para solicitudes de acceso"
date: 2020-09-14 00:00:00 +0200
tags: ["Power Automate", "SharePoint", "Adaptive Cards"]
image: "/images/header.png"
language: es
permalink: /2020/09/14/es/Custom_Permission_Access_Message.html
---

## Función integrada

¿Alguna vez has pensado en personalizar la solicitud de acceso estándar en tu sitio? Actualmente, la plataforma SharePoint ofrece la generación de un mensaje definido y simple como solución. La gestión de esta opción está disponible en la ventana emergente bajo el botón *Configuración de solicitud de acceso* de la interfaz de *Permisos*.

![Configuración de solicitudes de acceso](/images/accessRequestsSettings.jpg)

El formato predeterminado del mensaje para solicitudes de acceso tiene sus limitaciones. Cuando un usuario solicita acceso a un sitio, el propietario del recurso recibe una notificación representada por una Tarjeta Adaptativa compuesta, para agregar al usuario a uno de los dos grupos predeterminados (Miembros, Visitantes) o rechazar la solicitud.

![Mensaje de solicitud](/images/RequestMessage1.jpg)

En caso de enviar una solicitud para obtener acceso a una lista o elemento específico sin permisos heredados, la notificación tiene una estructura adaptada y permite proporcionar un acceso único al recurso solicitado.

![Mensaje de solicitud](/images/RequestMessage2.jpg)

![Mensaje de solicitud](/images/RequestMessage3.jpg)

Todo el proceso de envío de solicitudes de acceso se maneja en la lista de *Solicitudes de acceso* predeterminada, oculta en un sitio.

> Puede ocurrir que la lista de *Solicitudes de acceso* no esté disponible en un sitio. Para asegurarse de que sea accesible, un usuario con permisos insuficientes para el sitio o alguno de los componentes secundarios debe emitir la solicitud de acceso.

## Escenario de prueba

#### Requisitos comerciales:

- Los mensajes para solicitudes de acceso deben estandarizarse.
- Debe ser posible definir la estructura de los mensajes.
- La notificación debe utilizar Tarjetas Adaptativas de Microsoft.
- Se debe tener la opción de agregar a un usuario a cualquiera de los dos grupos personalizados predefinidos.
- Posibilidad de publicar mensajes en la aplicación MS Teams.

#### La solución que cumple con todos los requisitos se puede lograr en unos pocos pasos:

- Ingresar a la interfaz de *Configuración de solicitud de acceso* y habilitar la opción *Permitir solicitudes de acceso*. Seleccionar una cuenta para recibir mensajes estándar. De lo contrario, la función de solicitudes de acceso estará desactivada.

![Configuración de solicitudes de acceso](/images/accessRequestsSettings.jpg)

- Crear un flujo de trabajo de Power Automate o Logic Apps que recibirá una solicitud HTTP.
- Agregar un receptor de eventos PnP a la lista de Solicitudes de acceso usando el siguiente código:
```
Add-PnPEventReceiver -List "Access Requests" -Name "TestEventReceiver" -Url "<LogicAppURL>" -EventReceiverType ItemAdded -
Synchronization Synchronous
```
- Actualiza el flujo de trabajo creado de acuerdo al esquema y los parámetros de acción que se muestran a continuación:

![Primer Flujo](/images/Flow1Overview.jpg)

#### Inicialización de la variable AccessRequestObject:

``` javascript
{
   Name: 'AccessRequestObject',
   Type: 'Object',
   Value: {}
}
```

#### Inicialización de la variable tempObject:

``` javascript
{
   Name: 'tempObject',
   Type: 'Object',
   Value: {}
}
```

#### Acción ConvertToJson (Compose):

```javascript
json(xml(replace(triggerBody(), '<?xml version="1.0" encoding="UTF-8"?>', '')))
```

#### Esquema del elemento XML convertido de la solicitud:

```javascript
{
  "type": "object",
  "properties": {
    "s:Envelope": {
      "type": "object",
      "properties": {
        "s:Body": {
          "type": "object",
          "properties": {
            "ProcessEvent": {
              "type": "object",
              "properties": {
                "properties": {
                  "type": "object",
                  "properties": {
                    "AppEventProperties": {
                      "type": "object",
                      "properties": {
                        "@i:nil": {
                          "type": "string"
                        }
                      }
                    },
                    "ContextToken": {},
                    "CorrelationId": {
                      "type": "string"
                    },
                    "CultureLCID": {
                      "type": "string"
                    },
                    "EntityInstanceEventProperties": {
                      "type": "object",
                      "properties": {
                        "@i:nil": {
                          "type": "string"
                        }
                      }
                    },
                    "ErrorCode": {},
                    "ErrorMessage": {},
                    "EventType": {
                      "type": "string"
                    },
                    "ItemEventProperties": {
                      "type": "object",
                      "properties": {
                        "AfterProperties": {
                          "type": "object",
                          "properties": {
                            "a:KeyValueOfstringanyType": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "a:Key": {
                                    "type": "string"
                                  },
                                  "a:Value": {
                                    "type": "object",
                                    "properties": {
                                      "#text": {
                                        "type": "string"
                                      },
                                      "@i:type": {
                                        "type": "string"
                                      },
                                      "@xmlns:b": {
                                        "type": "string"
                                      }
                                    }
                                  }
                                },
                                "required": [
                                  "a:Key",
                                  "a:Value"
                                ]
                              }
                            },
                            "@xmlns:a": {
                              "type": "string"
                            }
                          }
                        },
                        "AfterUrl": {
                          "type": "object",
                          "properties": {
                            "@i:nil": {
                              "type": "string"
                            }
                          }
                        },
                        "BeforeProperties": {
                          "type": "object",
                          "properties": {
                            "@xmlns:a": {
                              "type": "string"
                            }
                          }
                        },
                        "BeforeUrl": {},
                        "CurrentUserId": {
                          "type": "string"
                        },
                        "ExternalNotificationMessage": {
                          "type": "object",
                          "properties": {
                            "@i:nil": {
                              "type": "string"
                            }
                          }
                        },
                        "IsBackgroundSave": {
                          "type": "string"
                        },
                        "ListId": {
                          "type": "string"
                        },
                        "ListItemId": {
                          "type": "string"
                        },
                        "ListTitle": {
                          "type": "string"
                        },
                        "UserDisplayName": {
                          "type": "string"
                        },
                        "UserLoginName": {
                          "type": "string"
                        },
                        "Versionless": {
                          "type": "string"
                        },
                        "WebUrl": {
                          "type": "string"
                        }
                      }
                    },
                    "ListEventProperties": {
                      "type": "object",
                      "properties": {
                        "@i:nil": {
                          "type": "string"
                        }
                      }
                    },
                    "SecurityEventProperties": {
                      "type": "object",
                      "properties": {
                        "@i:nil": {
                          "type": "string"
                        }
                      }
                    },
                    "UICultureLCID": {
                      "type": "string"
                    },
                    "WebEventProperties": {
                      "type": "object",
                      "properties": {
                        "@i:nil": {
                          "type": "string"
                        }
                      }
                    },
                    "@xmlns:i": {
                      "type": "string"
                    }
                  }
                },
                "@xmlns": {
                  "type": "string"
                }
              }
            }
          }
        },
        "@xmlns:s": {
          "type": "string"
        }
      }
    }
  }
}
```

Todos las propiedades de la solicitud se almacenan en un elemento de matriz. Podemos convertirlas en un solo objeto JSON utilizando la siguiente función dentro de la acción Aplicar a cada uno (Apply to each).

```javascript
//Aplicar para cada entrada
outputs('ConvertTojson')?['s:Envelope']?['s:Body']?['ProcessEvent']?['properties']?['ItemEventProperties']?['AfterProperties']?['a:KeyValueOfstringanyType']

// Valor de una acción "Establecer variable tempObject" dentro de "Aplicar para cada"
addProperty(variables('AccessRequestObject'),item()?['a:Key'], item()?['a:Value']?['#text'])

// Valor de una acción "Establecer variable AccessRequestObject" dentro de "Aplicar para cada"
variables('tempObject')
```

#### Un ejemplo del objeto de solicitud final utilizado como muestra para el esquema de datos de una acción Parse JSON:

```javascript
{
  "PermissionLevelRequested": "<Permission Level>",
  "PermissionType": "<Permission Type>",
  "IsInvitation": "<Is an user invited>",
  "RequestId": "<RequestId>",
  "RequestedWebId": "<WebId>",
  "RequestedForDisplayName": "<User display name>",
  "Expires": "<Expiration Date>",
  "AnonymousLinkType": "<>",
  "RequestedByDisplayName": "<Requestor display name>",
  "RequestedListItemId": "<>",
  "Status": "0",
  "RequestedObjectTitle": "<Resource name>",
  "Conversation": "<Request comment>",
  "Title": "<Request title>",
  "RequestedByUserId": "<Requestor Id",
  "PropagateAcl": "<>",
  "RequestedObjectUrl": "<Url to requested resource>, ",
  "RequestedForUserId": "User ID",
  "FileSystemObjectType": "<Resource type>",
  "RequestedListId": "<Resource List Id>",
  "InheritingRequestedWebId": "<>",
  "SendWelcomeEmail": "<>",
  "RequestedFor": "<Login of a user>",
  "RequestedBy": "<Login of a requestor>"
}
```
Como puedes ver, la solicitud procesa una gran cantidad de información útil. En los próximos pasos, haremos uso de estos datos, consultando, por ejemplo, *RequestedByDisplayName*, *RequestedObjectTitle*, *Conversation*, y *RequestedWebId*. 

#### Un ejemplo de la estructura de un mensaje con una solución de Adaptive Card es la siguiente:
```html
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <script type="application/adaptivecard+json">{
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.0",
    "body": [
        {
            "type": "TextBlock",
            "text": "An access request to a Client Site",
            "weight": "Bolder",
            "size": "Medium"
        },
        {
            "type": "TextBlock",
            "text": "Dear user, \n\n please review the following access request",
            "wrap": true
        },
        {
            "type": "FactSet",
            "facts": [
                {
                    "title": "Client:",
                    "value": "Client name"
                },
                {
                    "title": "User:",
                    "value": "@{body('Parse_JSON')?['RequestedByDisplayName']}"
                },
                {
                    "title": "Requested Resource:",
                    "value": "@{body('Parse_JSON')?['RequestedObjectTitle']}"
                },
                {
                    "title": "Request date:",
                    "value": "@{utcNow()}"
                },
{
                    "title": "Comment",
                    "value": "@{body('Parse_JSON')?['Conversation']}"
                }
            ]
        }
    ],
    "actions": [
        {
            "type": "Action.Http",
            "title": "Assign to Group 1",
            "method": "POST",
            "headers": [
                {
                    "name": "Authorization",
                    "value": ""
                }
            ],
            "url": "<URL_TO_A_DECISION_FLOW>",
            "body": "{'decision':'Approve','userId':'@{body('Parse_JSON')?['RequestedForUserId']}','webId':'@{body('Parse_JSON')?['RequestedWebId']}','RequestId':'@{body('Parse_JSON')?['RequestId']}'}"
        },
        {
            "type": "Action.Http",
            "title": "Assign to Group 2",
            "method": "POST",
            "headers": [
                {
                    "name": "Authorization",
                    "value": ""
                }
            ],
            "url": "<URL_TO_A_DECISION_FLOW>",
            "body": "{'decision':'Approve2','userId':'@{body('Parse_JSON')?['RequestedForUserId']}','webId':'@{body('Parse_JSON')?['RequestedWebId']}','RequestId':'@{body('Parse_JSON')?['RequestId']}'}"
        },
        {
            "type": "Action.Http",
            "title": "Reject",
            "method": "POST",
            "headers": [
                {
                    "name": "Authorization",
                    "value": ""
                }
            ],
            "url": "<URL_TO_A_DECISION_FLOW>",
            "body": "{'decision':'Reject','userId':'@{body('Parse_JSON')?['RequestedForUserId']}','webId':'@{body('Parse_JSON')?['RequestedWebId']}','RequestId':'@{body('Parse_JSON')?['RequestId']}'}"
        }
    ]
}
  </script>
</head>
<body>
</body>
</html>
```

La acción HTTP dentro del elemento Adaptive Card permite activar otro flujo, a través del cual podemos manejar una elección de decisión realizada por un usuario autorizado.

Un ejemplo del cuerpo de la solicitud sería:
```
{ 
  'decision':'Approve2',
  'userId':'@{body('Parse_JSON')?['RequestedForUserId']}',
  'webId':'@{body('Parse_JSON')?['RequestedWebId']}',
  'RequestId':'@{body('Parse_JSON')?['RequestId']}'
}``
```

![Adaptive Card](/images/AdaptiveCards1.jpg)

El segundo flujo se activará automáticamente después de hacer clic en uno de los botones proporcionados. 

![Segundo flujo](/images/SecondFlow.jpg)

En la siguiente parte del flujo de decisión, puedes manejar la solicitud recibida de muchas formas, adaptando el proceso a las necesidades y requisitos específicos de tu organización. Aquí hay algunas acciones que se pueden utilizar para complementar el flujo de trabajo:

- Almacenar datos sobre la solicitud de acceso en una lista personalizada.
- Generar mensajes mejorados de Adaptive Card con la decisión tomada en MS Outlook o MS Teams.
- Introducir una ruta de aprobación de varias etapas. 

## Realizar una limpieza

Una vez implementado el nuevo proceso, debemos eliminar todos los elementos adicionales en la lista predeterminada de Solicitudes de acceso. Para hacerlo, necesitamos agregar acciones de eliminación (Delete) al flujo creado inicialmente, utilizando las propiedades *ListId*, *ListItemId* y *WebUrl* del desencadenador de flujo establecido.: 

```
body('ConvertTojson')?['s:Envelope']?['s:Body']?['ProcessEvent']?['properties']?['ItemEventProperties']
```

```javascript
"ItemEventProperties":{
       "AfterProperties":{},
       "AfterUrl":{},
       "BeforeProperties":{},
       "BeforeUrl":null,
       "CurrentUserId":"1073741823",
       "ExternalNotificationMessage":{},
       "IsBackgroundSave":"false",
       **"ListId":"<LIST_ID>",**
       **"ListItemId":"<ID>",**
       "ListTitle":"Access Requests",
       "UserDisplayName":"System Account",
       "UserLoginName":"SHAREPOINT\\system",
       "Versionless":"false",
       **"WebUrl":"<WebUrl>"**
 }
 ```
  
  Estos valores nos permiten crear una solicitud REST sencilla para eliminar elementos innecesarios.

---

Autor: Michał Kornet [LinkedIn](https://www.linkedin.com/in/micha%C5%82-kornet-sharepoint-dev/)

Co-Autor: Olga Staszek [LinkedIn](https://www.linkedin.com/in/olga-staszek-2ba909b2/)
