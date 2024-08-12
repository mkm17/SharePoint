---
layout: post
title:  "SharePoint Api - ValidateUpdateFetchListItem"
date:   2024-08-12 00:00:00 +0200
tags: ["SharePoint", "SharePointApi"]
image: "/images/sharepointapi/ValidateUpdateFetchListItem/header.png"
language: en
---

## How ValidateUpdateFetchListItem type of update works?

After some tests with [customRowAction](https://learn.microsoft.com/en-us/sharepoint/dev/declarative-customization/formatting-syntax-reference#customrowaction) in column formatting, I have noticed that there is another endpoint similar to `/items/(id)/ValidateUpdateItem` named `/items/(id)/ValidateUpdateFetchListItem`, which is used in the `setValue` method. Both use the same request body and have the same effect — updating an item.

The difference starts in the request results:

![Calls Comparison](/images/sharepointapi/ValidateUpdateFetchListItem/CallsComparison.png)


As you can observe, the `ValidateUpdateFetchListItem` request also provides full information about the changed item in the `UpdatedData` property of the result.

## Usage

Example to be used in Power Automate flow: 

  {% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{"id":"a0f2c2c7-e8b6-42ad-bcf7-d6694fab1e58","brandColor":"#036C70","connectionReferences":{"shared_sharepointonline":{"connection":{"id":"/providers/Microsoft.PowerApps/apis/shared_sharepointonline/connections/ec614f7d51d84ccdb6ad7756232951f9"}}},"connectorDisplayName":"SharePoint","icon":"https://connectoricons-prod.azureedge.net/u/jayawan/releases/v1.0.1697/1.0.1697.3786/sharepointonline/icon.png","isTrigger":false,"operationName":"ValidateUpdateFetchListItem","operationDefinition":{"type":"OpenApiConnection","inputs":{"host":{"connectionName":"shared_sharepointonline","operationId":"HttpRequest","apiId":"/providers/Microsoft.PowerApps/apis/shared_sharepointonline"},"parameters":{"dataset":"https://contoso.sharepoint.com/sites/sitename","parameters/method":"POST","parameters/uri":"_api/web/GetList(@a1)/items(@a2)/ValidateUpdateFetchListItem()?@a1='%2Fsites%2Fsitename%2FLists%2FListName'&@a2=1 ","parameters/headers":{"accept":"application/json;odata=verbose","content-type":"application/json;odata=verbose;charset=utf-8"},"parameters/body":"\r\n\r\n{\r\n  \"formValues\": [\n    {\n      \"FieldName\": \"Title\",\n      \"FieldValue\": \"TitleValue\"\n    }\n  ],\n  \"bNewDocumentUpdate\": false\n}\n\r\n"},"authentication":{"type":"Raw","value":"@json(decodeBase64(triggerOutputs().headers['X-MS-APIM-Tokens']))['$ConnectionKey']"}},"runAfter":{}}}
</div>

<br/>

Replace *contoso*, *TargetSite*, and *TargetList* with your values.

**URL:**

```
 https://<contoso>.sharepoint.com/sites/<TargetSite>/_api/web/GetList(@a1)/ValidateUpdateFetchListItem()?@a1=%27%2Fsites%2F<TargetSite>%2FLists%2F<TargetList>%27
```

**Body:**

```json
{
  "formValues": [
    {
      "FieldName": "Title",
      "FieldValue": "TitleValue"
    }
  ],
  "bNewDocumentUpdate": false
}
```


**An example of result**
```json
{
  "d": {
    "ValidateUpdateFetchListItem": {
      "__metadata": {
        "type": "SP.ListItemUpdateResults"
      },
      "UpdatedData": "{ \"Row\" : \n[{\r\n\"ID\": \"1\",\r\n\"PermMask\": \"0x7ffffffffffbffff\",\r\n\"FSObjType\": \"0\",\r\n\"UniqueId\": \"{1556EB05-0135-469F-8170-48C9802EAA1F}\",\r\n\"Title\": \"TitleValue\",\r\n\"FileLeafRef\": \"1_.000\",\r\n\"FileLeafRef.Name\": \"1_\",\r\n\"FileLeafRef.Suffix\": \"000\",\r\n\"Created_x0020_Date\": \"1;#2024-07-29 10:21:59\",\r\n\"Created_x0020_Date.\": \"2024-07-29T17:21:59Z\",\r\n\"Created_x0020_Date.ifnew\": \"1\",\r\n\"FileRef\": \"\\u002fsites\\u002fSiteName\\u002fLists\\u002fListName\\u002f1_.000\",\r\n\"FileRef.urlencode\": \"%2Fsites%2FSiteName%2FLists%2FListName%2F1%5F%2E000\",\r\n\"FileRef.urlencodeasurl\": \"\\u002fsites\\u002fSiteName\\u002fLists\\u002fListName\\u002f1_.000\",\r\n\"FileRef.urlencoding\": \"\\u002fsites\\u002fSiteName\\u002fLists\\u002fListName\\u002f1_.000\",\r\n\"FileRef.scriptencodeasurl\": \"\\\\u002fsites\\\\u002fSiteName\\\\u002fLists\\\\u002fListName\\\\u002f1_.000\",\r\n\"File_x0020_Type\": \"\",\r\n\"HTML_x0020_File_x0020_Type.File_x0020_Type.mapall\": \"icgen.gif|||\",\r\n\"HTML_x0020_File_x0020_Type.File_x0020_Type.mapcon\": \"\",\r\n\"HTML_x0020_File_x0020_Type.File_x0020_Type.mapico\": \"icgen.gif\",\r\n\"ContentTypeId\": \"0x0100C6346114FCBA5642B737CFEF36E87277005CB6464EE82D9F4190824DA0F156AFD0\",\r\n\"TestColumn2\": \"\",\r\n\"TestColumn\": \"\",\r\n\"ItemChildCount\": \"0\",\r\n\"FolderChildCount\": \"0\",\r\n\"ScopeId\": \"{AC3A9953-2893-4E7E-835E-6C17F9D7B41D}\",\r\n\"owshiddenversion\": \"3\",\r\n\"Restricted\": \"\"\r\n}\r\n],\"FirstRow\" : 1,\r\n\"FolderPermissions\" : \"0x7ffffffffffbffff\"\r\n,\"LastRow\" : 1,\r\n\"RowLimit\" : 30\r\n,\"FilterLink\" : \"?\"\n,\"ForceNoHierarchy\" : \"1\"\n,\"HierarchyHasIndention\" : \"\"\n,\"CurrentFolderPrincipalCount\" : \"0\"\n,\"CurrentFolderSpItemUrl\" : \"\"\n\n}",
      "UpdateResults": {
        "__metadata": {
          "type": "Collection(SP.ListItemFormUpdateValue)"
        },
        "results": [
          {
            "ErrorCode": 0,
            "ErrorMessage": null,
            "FieldName": "Title",
            "FieldValue": "TitleValue",
            "HasException": false,
            "ItemId": 1
          }
        ]
      }
    }
  }
}
```

The endpoint would be useful when you need to use the updated item data after the update.