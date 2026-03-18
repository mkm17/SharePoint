---
layout: post
title:  "SharePoint Api - Cache"
date:   2026-03-12 00:00:00 +0200
tags: ["SharePoint", "SharePointApi"]
image: "/images/sharepointapi/Cache/header.png"
language: en
---

## Introduction

When you check SharePoint API logs, you can often see two endpoints: `ReadCacheOrCreate` and `ReadCacheOrCreate2`.

![Network tab result](/images/spCacheApi/networkTab.png)

Request and response details do not clearly explain their purpose at first, but they give useful hints.

![Request payload](/images/spCacheApi/payload.png)

![Request result](/images/spCacheApi/Result.png)

<br/>

## How It Works

So far, I have not found a major difference between `ReadCacheOrCreate` and `ReadCacheOrCreate2`.

From my tests, both endpoints work with the same payload.


In practice, response payloads suggest that these calls store and read UI state and component metadata.

For example, results may include data about specific web parts, or flags that show whether the user already dismissed default SharePoint components.

## Where Is It Stored?

To see where this data is stored, check the user personal site.

This site is not only for user files. It also contains hidden lists.

There are likely several hidden lists for user-related data, such as `SharePointHomeCacheList` and `PersonalCacheLibrary`.

These lists are the source used by this API.

<br/>

## What Is Stored There?

Both lists use folders to group data.

In `PersonalCacheLibrary`, you can find data about page template usage and web part cache.
![PersonalCacheLibrary](/images/spCacheApi/personalcacheLibrary.png)

In `SharePointHomeList`, you can find web part usage, some app settings, and `FRE_Cached_Data`.

`FRE_Cached_Data` includes details such as whether the user dismissed some information shown on the tenant.
![SharePointHomeList](/images/spCacheApi/sharepointhomelist.png)

## Usage

The example below gets or creates a specific cache key in the `FRE_Cached_Data` folder of `SharePointHomeList`.

{% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{"id":"62b976e1-5df3-4ee8-ba58-3a89899828fd","brandColor":"#474747","connectionReferences":{"shared_sharepointonline":{"connection":{"id":"/new_sharedsharepointonline_56b91"}}},"connectorDisplayName":"SharePoint","icon":"https://conn-afd-prod-endpoint-bmc9bqahasf3grgk.b01.azurefd.net/releases/v1.0.1769/1.0.1769.4361/sharepointonline/icon.png","isTrigger":false,"operationName":"ReadCacheOrCreate","operationDefinition":{"type":"OpenApiConnection","inputs":{"host":{"connectionName":"shared_sharepointonline","operationId":"HttpRequest","apiId":"/providers/Microsoft.PowerApps/apis/shared_sharepointonline"},"parameters":{"dataset":"https://TENANT.sharepoint.com/sites/SITE","parameters/method":"POST","parameters/uri":"_api/SP.UserProfiles.PersonalCache/ReadCacheOrCreate","parameters/headers":{"accept":"application/json","content-type":"application/json;odata=verbose;charset=utf-8"},"parameters/body":"{\"folderPath\":{\"__metadata\":{\"type\":\"SP.ResourcePath\"},\"DecodedUrl\":\"FRE_Cached_Data\"},\"requiredCacheKeys\":[\"TestKey\"],\"createIfMissing\":true}"},"authentication":{"type":"Raw","value":"@json(decodeBase64(triggerOutputs().headers['X-MS-APIM-Tokens']))['$ConnectionKey']"}},"runAfter":{"Ensure user in SharePoint":["Succeeded"]}}}
</div>

<br/>

Replace *contoso* with your value.

**URL:**

```
POST https://*contoso*.sharepoint.com/_api/SP.UserProfiles.PersonalCache/ReadCacheOrCreate
```

**Headers:**

```json
{
  "accept": "application/json;odata=verbose",
  "content-type": "application/json;odata=verbose"
}
```

**Body:**

```json
{
  "folderPath": {
    "__metadata": {
      "type": "SP.ResourcePath"
    },
    "DecodedUrl": "FRE_Cached_Data"
  },
  "requiredCacheKeys": [
    "TestKey"
  ],
  "createIfMissing": true
}
```

<br/>

**An example of result:**

```json
{
  "odata.metadata": "https://tenant.sharepoint.com/sites/site/_api/$metadata#Collection(SP.UserProfiles.PersonalCacheItem)",
  "value": [
    {
      "AltTitle": "TestKey",
      "CacheKey": "TestKey",
      "CacheName": "SharePointHomeCacheList",
      "CacheValue": null,
      "CacheValueHash": null,
      "CacheValueHtml": null,
      "CacheVersion": null,
      "ContainerUrl": "FRE_Cached_Data",
      "ListItemId": 617,
      "ListItemUniqueId": "1f433061-56c4-4974-bf87-c375f36b7778",
      "ModifiedTimeUtc": "2026-03-18T20:01:20Z"
    }
  ]
}
```

<br/>

## Additional Notes

You may ask: why not use a standard `Add list item` call and write directly to that list?

Based on observed behavior, this is likely blocked by architecture boundaries.

A regular SharePoint site and a user personal site are in different domains, so we cannot send a standard request directly to the personal site from the current site context.

<br/>

## Summary

Can we use this in custom solutions? Technically yes, but I do not recommend relying on it in production.

These endpoints are not publicly documented, so any implementation is at your own risk and may break without notice.

The goal of this article is to explain observed behavior and show how this mechanism works.

It also suggests that if you want to store user information outside the user profile, the personal site may be a good direction, because SharePoint already does this.
