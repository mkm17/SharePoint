---
layout: post
title:  "SharePoint Api - SetRating Column"
date:   2024-11-30 00:00:00 +0200
tags: ["SharePoint", "SharePointApi"]
image: "/images/sharepointapi/SetRating/header.png"
language: en
---

## Have you ever thought about how to update a rating column in SharePoint using API?

SharePoint includes many commonly known column types, such as single line of text, date, person, etc. Some of these are more complex, but **the Rating column** is a really interesting example. It gathers ratings from multiple users and displays an average score for each item.

![Rating Column](/images/sharepointapi/SetRating/RatingColumn.png)

Each list can have **only one unique** rating-type column.

Since this is not a standard column type  you need to use a special endpoint to create it.

<br/>

## How to Create a Rating Column

Here is an example of how to add a **Rating column** using a Power Automate flow:

{% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{"id":"e7a6f799-931e-4db2-b2d6-ccb194de0963","brandColor":"#036C70","connectionReferences":{"shared_sharepointonline":{"connection":{"id":"/providers/Microsoft.PowerApps/apis/shared_sharepointonline/connections/ec614f7d51d84ccdb6ad7756232951f9"}}},"connectorDisplayName":"SharePoint","icon":"https://connectoricons-prod.azureedge.net/u/jayawan/releases/v1.0.1697/1.0.1697.3786/sharepointonline/icon.png","isTrigger":false,"operationName":"SetListRating","operationDefinition":{"type":"OpenApiConnection","inputs":{"host":{"connectionName":"shared_sharepointonline","operationId":"HttpRequest","apiId":"/providers/Microsoft.PowerApps/apis/shared_sharepointonline"},"parameters":{"dataset":"https://contoso.sharepoint.com/sites/SITENAME","parameters/method":"POST","parameters/uri":"_api/Microsoft.SharePoint.Portal.RatingSettings.SetListRating(listID=@a1,ratingType=@a2)?@a1=%27LISTID%27&@a2=1","parameters/headers":{"accept":"application/json;odata=verbose","Content-Type":"application/json;odata=verbose"},"parameters/body":"{}"},"authentication":{"type":"Raw","value":"@json(decodeBase64(triggerOutputs().headers['X-MS-APIM-Tokens']))['$ConnectionKey']"}},"runAfter":{}}}
</div>

<br/>

Replace *contoso*, *siteName*, and *listId* with your values.

**URL:**

```
 https://<<contoso>>.sharepoint.com/sites/<<siteName>>/_api/Microsoft.SharePoint.Portal.RatingSettings.SetListRating(listID=@a1,ratingType=@a2)?@a1=%27<<listId>>%27&@a2=1
```

**Body:**

```json
{
}
```

## Usage

Again as **the Rating column** is not a standard column type, you need to use a special endpoint `SetRating` to update it.

![SetRating](/images/sharepointapi/SetRating/SetRating.png)

Example of How to Rate an Item in a Power Automate Flow:

  {% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{"id":"8cc9728e-a803-4e9c-afee-391f09adf3a5","brandColor":"#036C70","connectionReferences":{"shared_sharepointonline":{"connection":{"id":"/providers/Microsoft.PowerApps/apis/shared_sharepointonline/connections/ec614f7d51d84ccdb6ad7756232951f9"}}},"connectorDisplayName":"SharePoint","icon":"https://connectoricons-prod.azureedge.net/u/jayawan/releases/v1.0.1697/1.0.1697.3786/sharepointonline/icon.png","isTrigger":false,"operationName":"SetRating","operationDefinition":{"type":"OpenApiConnection","inputs":{"host":{"connectionName":"shared_sharepointonline","operationId":"HttpRequest","apiId":"/providers/Microsoft.PowerApps/apis/shared_sharepointonline"},"parameters":{"dataset":"https://contoso.sharepoint.com/sites/SITENAME","parameters/method":"POST","parameters/uri":"_api/Microsoft.Office.Server.ReputationModel.Reputation.SetRating(listID=@a1,itemID=@a2,rating=@a3)?@a1=%27%7BLISTID%7D%27&@a2=%27ID%27&@a3=5","parameters/headers":{"accept":"application/json;odata=verbose","Content-Type":"application/json;odata=verbose"},"parameters/body":"{}"},"authentication":{"type":"Raw","value":"@json(decodeBase64(triggerOutputs().headers['X-MS-APIM-Tokens']))['$ConnectionKey']"}},"runAfter":{}}}
</div>

<br/>

Replace *contoso*, *siteName*, *listId*, *itemId*, and the 1 to 5 value of *rating* with your values.

**URL:**

```
 https://<<contoso>>.sharepoint.com/sites/<<siteName>>/_api/Microsoft.Office.Server.ReputationModel.Reputation.SetRating(listID=@a1,itemID=@a2,rating=@a3)?@a1=%27<<listId>>%27&@a2=%27<<itemId>>%27&@a3=<<rating>>

```

**Body:**

```json
{
}
```


**An example of result:**
```json
{
  "d": {
    "SetListRating" : 1
  }
}
```

The column is a great way to collect feedback from users for each item. Since we can collect multiple ratings for one item, there is no need to create another list or table to gather opinions in simple cases.
