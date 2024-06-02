---
layout: post
title:  "Fondo de Sección Personalizado"
date:   2024-05-04 00:00:00 +0200
tags: ["SharePoint"]
image: "/images/sectionBackground/image/header.png"
language: es
permalink: /2024/05/03/Section-Background-Custom-Image.html
---

## ¿Hay alguna manera de establecer una imagen personalizada como fondo de sección en SharePoint Online?

En la nueva actualización de SharePoint Online, ahora puedes establecer fondos adicionales predefinidos para secciones de página, además de los 4 colores de tema que estaban disponibles antes. Pero, ¿qué pasa si quieres usar tu propia imagen?

Por defecto, tal opción no es posible desde la experiencia del usuario en este momento. Sin embargo, hay una solución para lograrlo. Aquí te mostramos cómo hacerlo con [CLI para M365](https://pnp.github.io/cli-microsoft365/).

Hace algún tiempo, exploré la posibilidad de establecer colores de fondo estándar para secciones utilizando el parámetro *zoneEmphasis* en [el comando de añadir sección de página](https://pnp.github.io/cli-microsoft365/cmd/spo/page/page-section-add/). Ahora, al examinar cómo se definen internamente los nuevos fondos, descubrí que la nueva configuración trae algunas posibilidades extra y una de ellas es permitir especificar tu propia URL de imagen.

### Explicación paso a paso
#### 1. Selecciona el último fondo de sección predefinido para una sección de página seleccionada.

![Seleccionar el último fondo de sección predefinido](/images/sectionBackground/image/backgroundSelection.png)

![Resultado de la página](/images/sectionBackground/image/pageResult.png)

#### 2. Inicia sesión en tu tenant utilizando la herramienta CLI para M365.

``` powershell
m365 login
```

#### 3. Obtén el contenido de la página utilizando el siguiente comando.
    
``` powershell
m365 spo page get --webUrl https://contoso.sharepoint.com/sites/TargetSite --name "TargetPage.aspx"
``` 

![Obter contenido de la pagina](/images/sectionBackground/image/canvasResult.png)

#### 4. Identifica el valor canvasContentJson del resultado. 

Debe verse así:

```json
"[{\"position\":{\"layoutIndex\":1,\"zoneIndex\":1,\"sectionIndex\":1,\"sectionFactor\":12,\"controlIndex\":1,\"zoneId\":\"a79cf521-5755-46fb-8b74-f51d4fbb1494\"},\"controlType\":3,\"id\":\"98d36bd7-c5f2-4e36-a210-92bc364ef2d0\",\"webPartId\":\"c4bd7b2f-7b6e-4599-8485-16504575f590\",\"reservedHeight\":450,\"reservedWidth\":1188,\"addedFromPersistedData\":true,\"webPartData\":{\"id\":\"c4bd7b2f-7b6e-4599-8485-16504575f590\",\"instanceId\":\"98d36bd7-c5f2-4e36-a210-92bc364ef2d0\",\"title\":\"Hero\",\"description\":\"Prominently display up to 5 pieces of content with links, images, pictures, videos, or photos in a highly visual layout.\",\"audiences\":[],\"serverProcessedContent\":{\"htmlStrings\":{},\"searchablePlainTexts\":{\"content[0].callToActionText\":\"Learn more\"},\"imageSources\":{\"content[0].previewImage.url\":\"https://media.akamai.odsp.cdn.office.net/westeurope1-mediap.svc.ms/transform/thumbnail?provider=url&inputFormat=jpg&docid=https://cdn.hubblecontent.osi.office.net/m365content/publish/0078ee3a-9487-4a9c-9705-49032b9c00f3/1065261400.jpg&w=960\"},\"links\":{\"content[0].link\":\"https://cdn.hubblecontent.osi.office.net/m365content/publish/0078ee3a-9487-4a9c-9705-49032b9c00f3/1065261400.jpg\"},\"componentDependencies\":{\"heroLayoutComponentId\":\"9586b262-54de-4b27-9eb9-34c671400c33\",\"carouselLayoutComponentId\":\"8ac0c53c-e8d0-4e3e-87d0-7449eb0d4027\"},\"customMetadata\":{\"content[0].previewImage.url\":{\"renderwidthratio\":\"0.5\",\"renderwidthratiothreshold\":\"640\",\"mincanvaswidth\":\"1\"}}},\"dataVersion\":\"1.5\",\"properties\":{\"heroLayoutThreshold\":640,\"carouselLayoutMaxWidth\":639,\"layoutCategory\":1,\"layout\":5,\"content\":[{\"id\":\"95afe589-4473-4d94-b956-c462ea9be7af\",\"type\":\"UrlLink\",\"color\":4,\"description\":\"\",\"title\":\"\",\"showDescription\":false,\"showTitle\":true,\"alternateText\":\"\",\"imageDisplayOption\":1,\"isDefaultImage\":false,\"showCallToAction\":true,\"isDefaultImageLoaded\":true,\"isCustomImageLoaded\":false,\"showFeatureText\":false,\"previewImage\":{\"zoomRatio\":1,\"imageUrl\":\"https://media.akamai.odsp.cdn.office.net/westeurope1-mediap.svc.ms/transform/thumbnail?provider=url&inputFormat=jpg&docid=https%3A%2F%2Fcdn.hubblecontent.osi.office.net%2Fm365content%2Fpublish%2F0078ee3a-9487-4a9c-9705-49032b9c00f3%2F1065261400.jpg&w=960\",\"widthFactor\":0.5,\"minCanvasWidth\":1}},{\"id\":\"3c9fbbdb-0860-4777-bb61-9b794c8df2ef\",\"type\":\"Image\",\"color\":4,\"description\":\"\",\"title\":\"\",\"showDescription\":false,\"showTitle\":true,\"alternateText\":\"\",\"imageDisplayOption\":0,\"isDefaultImage\":false,\"showCallToAction\":false,\"isDefaultImageLoaded\":false,\"isCustomImageLoaded\":false,\"showFeatureText\":false},{\"id\":\"f07c62a8-b6ff-4dbb-acd2-f23d8f93594d\",\"type\":\"Image\",\"color\":4,\"description\":\"\",\"title\":\"\",\"showDescription\":false,\"showTitle\":true,\"alternateText\":\"\",\"imageDisplayOption\":0,\"isDefaultImage\":false,\"showCallToAction\":false,\"isDefaultImageLoaded\":false,\"isCustomImageLoaded\":false,\"showFeatureText\":false},{\"id\":\"cd33fa47-66a5-4c78-89bc-764e89c00bf8\",\"type\":\"Image\",\"color\":4,\"description\":\"\",\"title\":\"\",\"showDescription\":false,\"showTitle\":true,\"alternateText\":\"\",\"imageDisplayOption\":0,\"isDefaultImage\":false,\"showCallToAction\":false,\"isDefaultImageLoaded\":false,\"isCustomImageLoaded\":false,\"showFeatureText\":false},{\"id\":\"819113e8-679b-4fd5-92eb-432e2539afe5\",\"type\":\"Image\",\"color\":4,\"description\":\"\",\"title\":\"\",\"showDescription\":false,\"showTitle\":true,\"alternateText\":\"\",\"imageDisplayOption\":0,\"isDefaultImage\":false,\"showCallToAction\":false,\"isDefaultImageLoaded\":false,\"isCustomImageLoaded\":false,\"showFeatureText\":false}]},\"containsDynamicDataSource\":false}},{\"controlType\":0,\"pageSettingsSlice\":{\"isDefaultDescription\":true,\"isDefaultThumbnail\":true,\"isSpellCheckEnabled\":true,\"globalRichTextStylingVersion\":1,\"rtePageSettings\":{\"contentVersion\":5},\"isEmailReady\":false}},{\"controlType\":14,\"webPartData\":{\"properties\":{\"zoneBackground\":{\"a79cf521-5755-46fb-8b74-f51d4fbb1494\":{\"type\":\"image\",\"imageData\":{\"source\":1,\"fileName\":\"sectionbackgroundimagedark3.jpg\",\"height\":955,\"width\":555},\"overlay\":{\"color\":\"#000000\",\"opacity\":7},\"useLightText\":true}}},\"serverProcessedContent\":{\"htmlStrings\":{},\"searchablePlainTexts\":{},\"imageSources\":{\"zoneBackground.a79cf521-5755-46fb-8b74-f51d4fbb1494.imageData.url\":\"/_layouts/15/images/sectionbackgroundimagedark3.jpg\"},\"links\":{}},\"dataVersion\":\"1.0\"}}]"
```

#### 5. Modifica la cadena JSON para lograr el resultado deseado.

Copia y pega el resultado presentado en un valor JSON en cualquier editor de texto y reemplaza la cadena *\\"* por el signo *"* sign, y elimina los primeros y últimos signos " para obtener un JSON correcto.

![JSON correcto](/images/sectionBackground/image/extractJson.png)

Nota que la definición del fondo de la sección no es solo un color o *zoneEmphasis*, como en los 'antiguos' fondos de sección, sino un web part con un tipo de control *14* y datos regulares de web part

#### 6. Define un fondo de sección personalizado.

En los datos, localiza un valor que defina la imagen. Las propiedades a cambiar son  *fileName*, *height*, y *width*. Adicionalmente, modifica   *zoneBackground.a79cf521-5755-46fb-8b74-f51d4fbb1494.imageData.url*, que representa la URL de la imagen objetivo.

```json
{
        "controlType": 14,
        "webPartData": {
            "properties": {
                "zoneBackground": {
                    "a79cf521-5755-46fb-8b74-f51d4fbb1494": {
                        "type": "image",
                        "imageData": {
                            "source": 1,
                            "fileName": "sectionbackgroundimagedark3.jpg",
                            "height": 955,
                            "width": 555
                        },
                        "overlay": {
                            "color": "#000000",
                            "opacity": 7
                        },
                        "useLightText": true
                    }
                }
            },
            "serverProcessedContent": {
                "htmlStrings": {},
                "searchablePlainTexts": {},
                "imageSources": {
                    "zoneBackground.a79cf521-5755-46fb-8b74-f51d4fbb1494.imageData.url": "/_layouts/15/images/sectionbackgroundimagedark3.jpg"
                },
                "links": {}
            },
            "dataVersion": "1.0"
        }
    }
```

#### 7. Ejecuta el comando.

Añade el signo ' al principio y al final de la nueva cadena JSON y úsalo en el parámetro *--content* del siguiente comando:

``` powershell
m365 spo page set --name "TargetPage.aspx" --webUrl https://contoso.sharepoint.com/sites/TargetSite --content 'the new string'
```

En caso de cualquier problema con la cadena JSON resultante, consulta la sección [Remarks](https://pnp.github.io/cli-microsoft365/cmd/spo/page/page-set/#remarks) del comando *page set* command.


Aquí está el resultado final de los cambios realizados en el fondo de la sección de la página.

![Result](/images/sectionBackground/image/result.png)
