---
layout: post
title:  "SharePoint Api - Change Default Column Values"
date:   2025-04-29 00:00:00 +0200
tags: ["SharePoint", "SharePointApi"]
image: "/images/sharepointapi/ChangeDefaultColumnValues/header.png"
language: en
---

### Update 2025-06-16
The article has been updated to include information about setting the configuration when the Default Column Values setting is not initially enabled on the library. This is important because the client_LocationBasedDefaults.html file alone is not enough to make it work [Update](#set-default-column-initially).

## Change Default Column Values

The Default Column Values setting is a great option for setting values for new items in a library. This setting allows us, for example, to set different values for different folders, which can be beneficial when all items within certain folders should have the same value by default (e.g., for search or filtering purposes).

This setting is available on the document library settings page.

*https://TENANT.sharepoint.com/sites/SITE/_layouts/15/ColumnDefaults.aspx?List={LISTID}*


As shown in the image, we can set default values for each column at each folder and subfolder level.
![Default Column Values Settings](/images/sharepointapi/ChangeDefaultColumnValues/ChangeDefaultColumnValuesSettings.png)

Please note that not all columns are available for this setting. For example, **Lookup** and **Person** columns are not supported.


Of course, it is ok to set all values using the UI but what if we want to automate this process?

<br/>

The main issue in this case is that this setting is not saved in the column settings or the list settings. At first glance, it seems there is no SharePoint API to handle it.

During research, I found that this setting is saved in a **file!** named *client_LocationBasedDefaults.html*, located in the Forms folder of the library.


Screen from SP Editor Extension:
![File editor of SP Editor Extension](/images/sharepointapi/ChangeDefaultColumnValues/spEditorFileEditor.png)


The content of the file is a XML. An example of structure is shown below:

```xml
<MetadataDefaults><a href="/sites/example/LIBRARY/folder1/subFolder1"><DefaultValue FieldName="TextColumn">SubTest</DefaultValue></a><a href="/sites/example/LIBRARY/folder2/subFolder2"><DefaultValue FieldName="TextColumn">SubTest2</DefaultValue><DefaultValue FieldName="DateColumn">2025-05-01T07:00:00Z</DefaultValue></a></MetadataDefaults>
```

So the structure for a particular rule is following:

```xml
<MetadataDefaults>
  <a href="path to folder">
    <DefaultValue FieldName="column name">Default Value</DefaultValue>
    <DefaultValue FieldName="column name2">Default Value2</DefaultValue>
    {... more columns}
  </a>
  {... more folders}
</MetadataDefaults>
```

Example of Power Automate Flow Action:

**URL:**

```
 https://<<contoso>>.sharepoint.com/sites/<<siteName>>/_api/web/getFolderByServerRelativePath(decodedUrl='%2Fsites%2F**SITENAME**%2F**LIBRARY**%2FForms')/files/add(overwrite=true,url='client_LocationBasedDefaults.html')
```

**Body:**

```xml

<MetadataDefaults><a href="/sites/SITENAME/LIBRARY/folder1/subFolder1"><DefaultValue FieldName="TextColumn">SubTest</DefaultValue></a><a href="/sites/SITENAME/LIBRARY/folder2/subFolder2"><DefaultValue FieldName="TextColumn">SubTest2</DefaultValue><DefaultValue FieldName="DateColumn">2025-05-01T07:00:00Z</DefaultValue></a></MetadataDefaults>

```

Using this method please remember that the file is overridden, so to update the values you need to get the current values, add your new ones and then update the file.

![PA Action](/images/sharepointapi/ChangeDefaultColumnValues/PAAction.png)

  {% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{"id":"6471f670-aeb4-4835-bf14-2f78534cb6a6","brandColor":"#036C70","connectionReferences":{"shared_sharepointonline":{"connection":{"id":"/sharedsharepointonline_a82fc"}},"shared_office365":{"connection":{"id":"/admin_CoECoreO365Outlook"}}},"connectorDisplayName":"SharePoint","icon":"https://conn-afd-prod-endpoint-bmc9bqahasf3grgk.b01.azurefd.net/releases/v1.0.1746/1.0.1746.4174/sharepointonline/icon.png","isTrigger":false,"operationName":"add(overwrite=true,url='client_LocationBasedDefaults.html')","operationDefinition":{"type":"OpenApiConnection","inputs":{"host":{"connectionName":"shared_sharepointonline","operationId":"HttpRequest","apiId":"/providers/Microsoft.PowerApps/apis/shared_sharepointonline"},"parameters":{"dataset":"https://contoso.sharepoint.com/sites/siteName","parameters/method":"POST","parameters/uri":"_api/web/getFolderByServerRelativePath(decodedUrl='%2Fsites%2FSITENAME%2FLIBRARY%2FForms')/files/add(overwrite=true,url='client_LocationBasedDefaults.html')","parameters/headers":{"Accept":"application/json","Content-Type":"application/json;charset=utf-8"},"parameters/body":"XML CONTENT"},"authentication":{"type":"Raw","value":"@json(decodeBase64(triggerOutputs().headers['X-MS-APIM-Tokens']))['$ConnectionKey']"}},"runAfter":{}}}
</div>

<br/>

Replace *contoso*, *siteName*, *SITENAME*, *LIBRARY*, and your XML in body.


## Set Default Column Setting Initially
If the Default Column Values setting is not enabled on the library, this requires adding an Event Receiver to the library. Details about the Event Receiver can be found below.

The code was found thanks to the [pnpjs library](https://github.com/pnp/pnpjs).

![Add Event receiver](/images/sharepointapi/ChangeDefaultColumnValues/AddEventReceiver.png)

**URL:**

```
 https://<<contoso>>.sharepoint.com/sites/<<siteName>>/_api/web/lists/getByTitle('<<ListName>>')/EventReceivers/add
```

**Body:**

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