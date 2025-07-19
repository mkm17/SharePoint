---
layout: post
title:  "SharePoint Pages co-Authoring - SavePageCoAuth"
date:   2025-07-19 00:00:00 +0200
tags: ["SharePoint", "SharePointApi"]
image: "/images/sharepointapi/coAuthoringIssue/header.png"
language: en
---

## SharePoint Pages co-Authoring

Sometimes ago I have received an information that my example of extension stopped working. [The page sections extension](https://github.com/mkm17/react-application-page-sections) using a standard SharePoint API savepage endpoint to modify a page content (it updates ContentCanvas1 property with JSON structure of the page with added chosen section).

The problem raised by users was that after the [co-authoring feature](https://support.microsoft.com/en-us/office/collaborate-on-sharepoint-pages-and-news-with-coauthoring-91d7dc25-37c3-44a4-99da-f552e0f9cfe9) was enabled on the tenant then the user could not save the page using the extension and the motioned endpoint.

![Co-authoring indicator](/images/coAuthoringIssue/coAuthoringIndicator.png)

### An error

The error thrown suggested that the page is being locked. In fact, the same user couldn't save the page using savepage endpoint whe the page is in co-authoring mode. More, even when the page is not edited anymore again user could not save it using savepage endpoint. (It looks like the pages is locked for some more minutes after last save.)

The error was:
```json
{
    "odata.error": {
        "code": "-2147018894, Microsoft.SharePoint.SPFileLockException",
        "message": {
            "lang": "en-US",
            "value": "The file https://contoso.sharepoint.com/sites/AudienceTest/SitePages/Co-Authoring-test.aspx is locked for shared use by mkornet@contoso.onmicrosoft.com [membership]."
        }
    }
}
```

![Error](/images/coAuthoringIssue/error.png)


### New endpoints

Looking at the requests used during the co-authoring session on the page we can find some interesting endpoints.

https://contoso.sharepoint.com/sites/site/_api/sitepages/pages(pageId)/ExtendSessionCoAuth

The endpoint used to save the page is `SavePageCoAuth` and it is used to save the page content in co-authoring mode.

The endpoint to extend the co-authoring session is `ExtendCoAuthSession`.

Teh endpoint to discard the co-authoring session is `DiscardCoAuth`.

The page has some additional properties like `AuthoringMetadata` and `CoAuthState`.

### Save Page in Co-Authoring Mode

*Remark: As you will see below, I did not explain all the properties values, unfortunately I haven't find out them during my research. So please have in mind that that maybe it is not the best approach*

To save the page in co-authoring mode you need to use the `SavePageCoAuth` endpoint. The request should look like this:

```http
POST https://contoso.sharepoint.com/sites/site/_api/sitepages/pages(pageId)/SavePageCoAuth
Content-Type: application/json
```

```json
{
  "CanvasContent1": "<<page content JSON>>",
    "AuthoringMetadata": {
      "ClientOperation": 3,
      "FluidContainerCustomId": "pageContentJson.AuthoringMetadata.FluidContainerCustomId",
      "IsSingleUserSession": true,
      "SequenceId": "pageContentJson.AuthoringMetadata.SequenceId",
      "SessionId": "pageContentJson.AuthoringMetadata.SessionId"
    },
    "CoAuthState": {
      "Action": 1,
      "LockAction": 2,
      "SharedLockId": "pageContentJson.CoAuthState?.SharedLockId"
    },
    "Collaborators": [ ]
}
```

as you can see in the request you need to provide also some additional properties like `AuthoringMetadata` and `CoAuthState`. you can find it by requesting the page properties using `https://contoso.sharepoint.com/sites/site/_api/sitepages/pages(pageId)` request.

### Is that simple?

Partially yes, but there are some additional things to consider.

In my solution I save the page content and i would like to allow user to edit it from this point in UI. The effect is not perfect because after some seconds user will get the version of the page which user left before saving it using `SavePageCoAuth` endpoint. To resolve this mystery we have to jump a little bit deeper into the co-authoring solution background.

*Another remark: as i mentioned before, I did not have a full knowledge about the solution so the text below is based on my research and assumptions.*

When you will explore the requests you will find some of them like: 

![Fluidrequests](/images/coAuthoringIssue/fluidRequests.png)

It shows that the page editing is based on the [Fluid Framework](https://fluidframework.com/). The Fluid Framework is a set of libraries and services that enable real-time collaboration in web applications. It allows multiple users to work on the same document simultaneously, with changes being reflected in real-time.

It is used for example on MS Loop. It can be used also in SharePoint embedded. When you try [the example](https://github.com/microsoft/FluidExamples/tree/main/item-counter-spe) provided on the Fluid Framework website you will see the same requests in the network tab.

![Fluid Example](/images/coAuthoringIssue/Fluidexample.png)

The best option would be to use the existing Fluid Framework solution to save the page content, but unfortunately, it is not so easy to connect (if even possible).

Using the `SavePageCoAuth` endpoint alone will update the page content but because of existing Fluid Framework user version makes a strange effect of page content update during page editing.

![Fluid Framework effect](/images/coAuthoringIssue/CoAuthoringUpdate.gif)


To avoid this effect I have made the following steps: 

1 - Use the `SavePageCoAuth` endpoint to save the page content.
2 - Use the `discardCoAuth` endpoint to discard the co-authoring session.
3 - Checkout the page using the `Checkout` endpoint (I have done it in the loop to ensure that the page is checked out).
4 - Use the standard `SavePage` endpoint to save the page content again.

*Discard Co-Authoring Session details.*

```http
POST https://contoso.sharepoint.com/sites/site/_api/sitepages/pages(pageId)/discardCoAuth?$expand=VersionInfo
Content-Type: application/json
```

```json
{
  "lockId": "pageContentJson.AuthoringMetadata.SessionId"
}
```

this way the page content is saved and the user can continue editing it without the strange effect of page content update. Of course this approach has some disadvantages, the co-authoring session is discarded so when you reload the page you will not be in this mode anymore. To comeback to the co-authoring mode you need to save the page, and then edit it again.

And as I mentioned before, I have impression that there is a more wise way to update the page during co-authoring session, so stay tuned for the next updates.