---
layout: post
title:  "SharePoint Pages co-Authoring - SavePageCoAuth endpoint"
date:   2025-07-19 00:00:00 +0200
tags: ["SharePoint", "SharePointApi"]
image: "/images/coAuthoringIssue/header.png"
language: en
---

## SharePoint Pages Co-Authoring

Some time ago, I was informed that my sample extension had stopped working. The [Page Sections extension](https://github.com/mkm17/react-application-page-sections), which uses the standard SharePoint API `savepage` endpoint to modify page content (by updating the `ContentCanvas1` property with a JSON structure containing the selected section), was no longer functioning as expected.

The issue reported by users was that after the [co-authoring feature](https://support.microsoft.com/en-us/office/collaborate-on-sharepoint-pages-and-news-with-coauthoring-91d7dc25-37c3-44a4-99da-f552e0f9cfe9) was enabled on the tenant, they could no longer save the page using the extension and the mentioned endpoint.


![Co-authoring indicator](/images/coAuthoringIssue/coAuthoringIndicator.png)

### An Error

The error thrown suggested that the page was being locked. In fact, even the same user could not save the page using the `savepage` endpoint while it was in co-authoring mode. Furthermore, even after the page was no longer being actively edited, the user still could not save it using the same endpoint. 

(It appears that the page remains locked for several minutes after the last save.)

The error was:

```json
{
    "odata.error": {
        "code": "-2147018894, Microsoft.SharePoint.SPFileLockException",
        "message": {
            "lang": "en-US",
            "value": "The file https://contoso.sharepoint.com/sites/siteName/SitePages/Co-Authoring-test.aspx is locked for shared use by user@contoso.onmicrosoft.com [membership]."
        }
    }
}
```

![Error](/images/coAuthoringIssue/error.png)


### New Endpoints

By observing the requests made during a co-authoring session on a page, we can identify some interesting endpoints starting with `https://contoso.sharepoint.com/sites/site/_api/sitepages/pages(pageId)`:


The endpoint used to save the page during co-authoring is `SavePageCoAuth`, which allows saving page content while the co-authoring session is active.

To extend the co-authoring session, SharePoint uses the `ExtendCoAuthSession` endpoint.

To discard an active co-authoring session, the `DiscardCoAuth` endpoint is used.

Additionally, the page includes properties such as `AuthoringMetadata` and `CoAuthState`, which provide metadata related to the co-authoring state and authoring activity.

### Save Page in Co-Authoring Mode

*Remark: As you will see below, I did not explain all the property values. Unfortunately, I haven't discovered them during my research. Please keep in mind that this may not be the most complete or recommended approach.*

To save the page in co-authoring mode, you need to use the `SavePageCoAuth` endpoint. The request should look like this:

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

As you can see in the request, you also need to provide additional properties such as `AuthoringMetadata` and `CoAuthState`. You can retrieve these values by requesting the page properties using the following endpoint:

`https://contoso.sharepoint.com/sites/site/_api/sitepages/pages(pageId)`


### Is It That Simple?

Partially yes, but there are some additional considerations.

In my solution, I save the page content and would like to allow the user to continue editing it from that point in the UI. However, the result isn't perfect. After a few seconds, the user sees the version of the page as it was before saving it using the `SavePageCoAuth` endpoint.

To resolve this mystery, we need to dive a bit deeper into how the co-authoring solution works under the hood.

*Another remark: as I mentioned before, I do not have complete knowledge about the background of the solution, so the following is based on my research and assumptions.*

When inspecting the network requests, you may notice some that look like this:

![Fluidrequests](/images/coAuthoringIssue/fluidRequests.png)

This indicates that page editing in co-authoring mode is based on the [Fluid Framework](https://fluidframework.com/). The Fluid Framework is a set of libraries and services that enable real-time collaboration in web applications. It allows multiple users to work on the same document simultaneously, with changes reflected in real time.

It is used, for example, in Microsoft Loop, and it can also be used in embedded SharePoint scenarios. If you try [this example](https://github.com/microsoft/FluidExamples/tree/main/item-counter-spe) from the Fluid Framework documentation, you'll see similar requests in the browser’s network tab:

![Fluid Example](/images/coAuthoringIssue/Fluidexample.png)

Ideally, the best approach would be to use the existing Fluid Framework integration to save page content directly. Unfortunately, this is not so easy (I am not sure if it’s even possible).

Using the `SavePageCoAuth` endpoint alone will update the page content. However, because of the Fluid Framework’s active state management, the user may experience strange behavior, such as the page content reverting or being overwritten shortly after editing.

![Fluid Framework effect](/images/coAuthoringIssue/CoAuthoringUpdate.gif)


To avoid this behavior, I implemented the following steps:

1. **Save the page content** using the `SavePageCoAuth` endpoint.
2. **Discard the co-authoring session** using the `DiscardCoAuth` endpoint.
3. **Checkout the page** using the `Checkout` endpoint. (I ran this in a loop to ensure the page was successfully checked out.)
4. **Save the page again** using the standard `SavePage` endpoint.

---

### Discard Co-Authoring Session Details


```http
POST https://contoso.sharepoint.com/sites/site/_api/sitepages/pages(pageId)/discardCoAuth?$expand=VersionInfo
Content-Type: application/json
```

```json
{
  "lockId": "pageContentJson.AuthoringMetadata.SessionId"
}
```

This way, the page content is saved, and the user can continue editing it without the strange effect of unexpected content updates. 

Of course, this approach has some disadvantages, the co-authoring session is discarded so when the page is reloaded, it will no longer be in co-authoring mode. To return to co-authoring, the user must save the page and then start editing it again.

As I mentioned earlier, I have the impression that there might be a more elegant way to update the page during a co-authoring session, so stay tuned for future updates.