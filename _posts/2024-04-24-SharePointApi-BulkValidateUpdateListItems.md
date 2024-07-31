---
layout: post
title:  "SharePoint Api - BulkValidateUpdateListItems"
date:   2024-04-23 00:00:00 +0200
tags: ["SharePoint", "SharePointApi"]
image: "/images/sharepointapi/BulkValidateUpdateListItems/header.png"
language: en
---

## How to update multiple items using SharePoint REST API?

You can answer the following question using different methods. Of course, one of them is to use batching and  well-known endpoints like `/items/(id)` or `/items/(id)ValidateUpdateItem`.

But did you know that there is yet another method to achieve the same effect? Let’s imagine a scenario where you need to update the same value in selected items. For example, giving a user the possibility to select multiple items and change the status, or to approve multiple items at the same time.

SharePoint exposes a [BulkValidateUpdateListItems](https://learn.microsoft.com/en-us/openspecs/sharepoint_protocols/ms-csomspt/ebc47581-36e4-457b-8045-a4cf1f4da501) endpoint which expects a body similar to the [ValidateUpdateListItems](https://learn.microsoft.com/en-us/openspecs/sharepoint_protocols/ms-csomspt/652ab52f-8f47-4eec-95fd-743af5ee38cc).

I have compared these three REST API methods to update multiple items. For each method, I have taken 4 different items in the same list to update the same property. 

![Calls Comparison](/images/sharepointapi/BulkValidateUpdateListItems/CallsComparison.png)

The results are as follows:

| Method                      | Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Average Execution Time |
| --------------------------- | ----- | ----- | ----- | ----- | ----- | ---------------------- |
| ValidateUpdateListItems     | 0.645 | 0.692 | 0.472 | 0.418 | 0.496 | 0.545 seconds          |
| Update                      | 0.665 | 0.733 | 0.914 | 0.455 | 0.499 | 0.653 seconds          |
| BulkValidateUpdateListItems | 0.510 | 0.696 | 0.861 | 0.334 | 0.473 | 0.575 seconds          |


As you can see, the execution time looks similar for all methods.

Now, let's check an example of the code to approve many items at the same time. A real-case scenario could be to approve multiple items simultaneously.

Replace *contoso*, *TargetSite*, and *TargetList* with your values.


## Usage

Example to be used in Power Automate flow: 

  {% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{"id":"0eb4e4a9-0ef6-498f-ba47-c113ad8705e8","brandColor":"#036C70","connectionReferences":{"shared_sharepointonline":{"connection":{"id":"/providers/Microsoft.PowerApps/apis/shared_sharepointonline/connections/ec614f7d51d84ccdb6ad7756232951f9"}}},"connectorDisplayName":"SharePoint","icon":"https://connectoricons-prod.azureedge.net/u/jayawan/releases/v1.0.1697/1.0.1697.3786/sharepointonline/icon.png","isTrigger":false,"operationName":"BulkValidateUpdateListItems","operationDefinition":{"type":"OpenApiConnection","inputs":{"host":{"connectionName":"shared_sharepointonline","operationId":"HttpRequest","apiId":"/providers/Microsoft.PowerApps/apis/shared_sharepointonline"},"parameters":{"dataset":"https://contoso.sharepoint.com/sites/SiteName","parameters/method":"POST","parameters/uri":"_api/web/lists/getByTitle('ListName')/BulkValidateUpdateListItems","parameters/headers":{"content-type":"application/json;odata=verbose;charset=utf-8","accept":"application/json"},"parameters/body":"{\n  \"itemIds\":[1,2],\n  \"formValues\":[\n    {\n        \"FieldName\":\"Title\",\n        \"FieldValue\":\"TitleChange\",\n        \"HasException\":false,\n        \"ErrorMessage\":null\n    }\n  ],\n  \"bNewDocumentUpdate\":false,\n  \"checkInComment\":null\n}"},"authentication":{"type":"Raw","value":"@json(decodeBase64(triggerOutputs().headers['X-MS-APIM-Tokens']))['$ConnectionKey']"}},"runAfter":{}}}
</div>

<br/>

**URL:**

```
 https://<contoso>.sharepoint.com/sites/<TargetSite>/_api/web/GetList(@a1)/BulkValidateUpdateListItems()?@a1=%27%2Fsites%2F<TargetSite>%2FLists%2F<TargetList>%27
```

Provide ids of the items you want to update to the *itemIds* parameter. The *formValues* should contain the field you want to update. In this case, the field is _ModerationStatus, and the value is 0 (Approved).

**Body:**

```json
{
  "itemIds":[1,2,3,4],
  "formValues":[
    {
        "FieldName":"_ModerationStatus",
        "FieldValue":"0",
        "HasException":false,
        "ErrorMessage":null
    }
  ],
  "bNewDocumentUpdate":false,
  "checkInComment":null
}
```


**An example of result**
```json
{
  "d": {
    "BulkValidateUpdateListItems": {
      "__metadata": {
        "type": "Collection(SP.ListItemFormUpdateValue)"
      },
      "results": [
        {
          "ErrorCode": 0,
          "ErrorMessage": null,
          "FieldName": "_ModerationStatus",
          "FieldValue": "0",
          "HasException": false,
          "ItemId": 1
        },
        {
          "ErrorCode": 0,
          "ErrorMessage": "You cannot perform this action on a checked out document.",
          "FieldName": null,
          "FieldValue": null,
          "HasException": true,
          "ItemId": 2
        },
        {
          "ErrorCode": 0,
          "ErrorMessage": null,
          "FieldName": "_ModerationStatus",
          "FieldValue": "0",
          "HasException": false,
          "ItemId": 3
        },
        {
          "ErrorCode": 0,
          "ErrorMessage": null,
          "FieldName": "_ModerationStatus",
          "FieldValue": "0",
          "HasException": false,
          "ItemId": 4
        }
      ]
    }
  }
}
```