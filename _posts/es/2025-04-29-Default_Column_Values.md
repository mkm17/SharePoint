---
layout: postES
title:  "SharePoint Api - Cambiar Valores Predeterminados de Columna"
date:   2025-04-29 00:00:00 +0200
tags: ["SharePoint", "SharePointApi"]
image: "/images/sharepointapi/ChangeDefaultColumnValues/header.png"
language: es
permalink: /2025/04/29/es/Default_Column_Values.html
---

### Actualización 2025-06-16
El artículo ha sido actualizado para incluir información sobre cómo configurar la configuración cuando la opción de Valores Predeterminados de Columna no está inicialmente habilitada en la biblioteca. Esto es importante porque solo el archivo client_LocationBasedDefaults.html no es suficiente para que funcione [Actualización](#configurar-configuración-inicial-de-columna-predeterminada).

## Cambiar Valores Predeterminados de Columna

La configuración de Valores Predeterminados de Columna es una excelente opción para establecer valores para nuevos elementos en una biblioteca. Esta configuración nos permite, por ejemplo, establecer diferentes valores para diferentes carpetas, lo que puede ser beneficioso cuando todos los elementos dentro de ciertas carpetas deben tener el mismo valor por defecto (por ejemplo, para propósitos de búsqueda o filtrado).

Esta configuración está disponible en la página de configuraciones de la biblioteca de documentos.

*https://TENANT.sharepoint.com/sites/SITE/_layouts/15/ColumnDefaults.aspx?List={LISTID}*

Como se muestra en la imagen, podemos establecer valores predeterminados para cada columna en cada nivel de carpeta y subcarpeta.
![Configuraciones de Valores Predeterminados de Columna](/images/sharepointapi/ChangeDefaultColumnValues/ChangeDefaultColumnValuesSettings.png)

Ten en cuenta que no todas las columnas están disponibles para esta configuración. Por ejemplo, las columnas de **Búsqueda** y **Persona** no son compatibles.

Por supuesto, está bien configurar todos los valores usando la interfaz de usuario, pero ¿qué pasa si queremos automatizar este proceso?

<br/>

El problema principal en este caso es que esta configuración no se guarda en las configuraciones de columna o las configuraciones de lista. A primera vista, parece que no hay una API de SharePoint para manejarlo.

Durante la investigación, descubrí que esta configuración se guarda en un **archivo!** llamado *client_LocationBasedDefaults.html*, ubicado en la carpeta Forms de la biblioteca.

Pantalla de la Extensión SP Editor:
![Editor de archivos de la Extensión SP Editor](/images/sharepointapi/ChangeDefaultColumnValues/spEditorFileEditor.png)

El contenido del archivo es XML. Un ejemplo de la estructura se muestra a continuación:

```xml
<MetadataDefaults><a href="/sites/example/LIBRARY/folder1/subFolder1"><DefaultValue FieldName="TextColumn">SubTest</DefaultValue></a><a href="/sites/example/LIBRARY/folder2/subFolder2"><DefaultValue FieldName="TextColumn">SubTest2</DefaultValue><DefaultValue FieldName="DateColumn">2025-05-01T07:00:00Z</DefaultValue></a></MetadataDefaults>
```

Así que la estructura para una regla particular es la siguiente:

```xml
<MetadataDefaults>
  <a href="ruta a la carpeta">
    <DefaultValue FieldName="nombre de columna">Valor Predeterminado</DefaultValue>
    <DefaultValue FieldName="nombre de columna2">Valor Predeterminado2</DefaultValue>
    {... más columnas}
  </a>
  {... más carpetas}
</MetadataDefaults>
```

Ejemplo de Acción de Flujo de Power Automate:

**URL:**

```
 https://<<contoso>>.sharepoint.com/sites/<<nombreSitio>>/_api/web/getFolderByServerRelativePath(decodedUrl='%2Fsites%2F**NOMBRESITIO**%2F**BIBLIOTECA**%2FForms')/files/add(overwrite=true,url='client_LocationBasedDefaults.html')
```

**Cuerpo:**

```xml

<MetadataDefaults><a href="/sites/NOMBRESITIO/BIBLIOTECA/folder1/subFolder1"><DefaultValue FieldName="TextColumn">SubTest</DefaultValue></a><a href="/sites/NOMBRESITIO/BIBLIOTECA/folder2/subFolder2"><DefaultValue FieldName="TextColumn">SubTest2</DefaultValue><DefaultValue FieldName="DateColumn">2025-05-01T07:00:00Z</DefaultValue></a></MetadataDefaults>

```

Al usar este método, recuerda que el archivo se sobrescribe, por lo que para actualizar los valores necesitas obtener los valores actuales, agregar los nuevos y luego actualizar el archivo.

![Acción PA](/images/sharepointapi/ChangeDefaultColumnValues/PAAction.png)

  {% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{"id":"6471f670-aeb4-4835-bf14-2f78534cb6a6","brandColor":"#036C70","connectionReferences":{"shared_sharepointonline":{"connection":{"id":"/sharedsharepointonline_a82fc"}},"shared_office365":{"connection":{"id":"/admin_CoECoreO365Outlook"}}},"connectorDisplayName":"SharePoint","icon":"https://conn-afd-prod-endpoint-bmc9bqahasf3grgk.b01.azurefd.net/releases/v1.0.1746/1.0.1746.4174/sharepointonline/icon.png","isTrigger":false,"operationName":"add(overwrite=true,url='client_LocationBasedDefaults.html')","operationDefinition":{"type":"OpenApiConnection","inputs":{"host":{"connectionName":"shared_sharepointonline","operationId":"HttpRequest","apiId":"/providers/Microsoft.PowerApps/apis/shared_sharepointonline"},"parameters":{"dataset":"https://contoso.sharepoint.com/sites/siteName","parameters/method":"POST","parameters/uri":"_api/web/getFolderByServerRelativePath(decodedUrl='%2Fsites%2FSITENAME%2FLIBRARY%2FForms')/files/add(overwrite=true,url='client_LocationBasedDefaults.html')","parameters/headers":{"Accept":"application/json","Content-Type":"application/json;charset=utf-8"},"parameters/body":"XML CONTENT"},"authentication":{"type":"Raw","value":"@json(decodeBase64(triggerOutputs().headers['X-MS-APIM-Tokens']))['$ConnectionKey']"}},"runAfter":{}}}
</div>

<br/>

Reemplaza *contoso*, *nombreSitio*, *NOMBRESITIO*, *BIBLIOTECA*, y tu XML en el cuerpo.

## Configurar Configuración Inicial de Columna Predeterminada
Si la configuración de Valores Predeterminados de Columna no está habilitada en la biblioteca, esto requiere agregar un Event Receiver a la biblioteca. Los detalles sobre el Event Receiver se pueden encontrar a continuación.

El código fue encontrado gracias a la [biblioteca pnpjs](https://github.com/pnp/pnpjs).

![Agregar Event receiver](/images/sharepointapi/ChangeDefaultColumnValues/AddEventReceiver.png)

**URL:**

```
 https://<<contoso>>.sharepoint.com/sites/<<nombreSitio>>/_api/web/lists/getByTitle('<<NombreLista>>')/EventReceivers/add
```

**Cuerpo:**

```json
{
  "eventReceiverCreationInformation": {
    "EventType": 10001,
    "ReceiverAssembly": "Microsoft.Office.DocumentManagement, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c",
    "ReceiverClass": "Microsoft.Office.DocumentManagement.LocationBasedMetadataDefaultsReceiver",
    "ReceiverName": "LocationBasedMetadataDefaultsReceiver ItemAdded",
    "SequenceNumber": 1000,
    "Synchronization": 1
  }
}
```

  {% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{
        "id": "7a3955e0-f505-4f9f-ae7f-d805943ff04d",
        "brandColor": "#036C70",
        "connectorDisplayName": "SharePoint",
        "icon": "https://conn-afd-prod-endpoint-bmc9bqahasf3grgk.b01.azurefd.net/releases/v1.0.1723/1.0.1723.3986/sharepointonline/icon.png",
        "isTrigger": false,
        "operationName": "add",
        "operationDefinition": {
          "type": "OpenApiConnection",
          "inputs": {
            "host": {
              "connectionName": "shared_sharepointonline",
              "operationId": "HttpRequest",
              "apiId": "/providers/Microsoft.PowerApps/apis/shared_sharepointonline"
            },
            "parameters": {
              "dataset": "https://contoso.sharepoint.com/sites/siteName",
              "parameters/method": "POST",
              "parameters/uri": "_api/web/lists/getByTitle('ListName')/EventReceivers/add",
              "parameters/headers": {"Accept":"application/json","Content-Type":"application/json;charset=utf-8"}
              ,"parameters/body": {"eventReceiverCreationInformation":{"EventType":10001,"ReceiverAssembly":"Microsoft.Office.DocumentManagement, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c","ReceiverClass":"Microsoft.Office.DocumentManagement.LocationBasedMetadataDefaultsReceiver","ReceiverName":"LocationBasedMetadataDefaultsReceiver ItemAdded","SequenceNumber":1000,"Synchronization":1}}
            },
            "authentication": "@parameters('$authentication')"
          }
        }
      }
</div>

<br/>
