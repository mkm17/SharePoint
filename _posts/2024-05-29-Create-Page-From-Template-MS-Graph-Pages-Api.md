---
layout: post
title:  "Create a SharePoint Page based on a Template Page Using MS Graph Pages API"
date:   2024-06-01 00:00:00 +0200
tags: ["SharePoint", "MSGraph"]
image: "/images/sectionsExtensions/Header.png"
language: en
---

# How to Create a SharePoint Page Based on a Template Page Using MS Graph Pages API

## Issue Description

Some time ago, one of an user wanted to find a method to create a SharePoint page based on a custom template using the Graph API [link to the issue](https://github.com/SharePoint/sp-dev-docs/issues/9653). I wanted to explore the MS Graph Pages API and check if this is possible.

## Solution Overview

### Steps to Create a SharePoint Page Based on a Custom Template

1. **Retrieve the Template Item Unique ID**

   A template is actually a page located in the Template folder. You can retrieve the unique ID of the template item using the following endpoint:

   ```
   https://graph.microsoft.com/v1.0/sites/{siteId}/lists/{listId}/items/{itemListId}?$select=contentType,sharepointIds
   ```

   Make sure to get the `sharepointIds.listItemUniqueId` for the next step.



2. **Obtain the Page Content of the Template**

   Note that page templates are not included in [the list of pages](https://learn.microsoft.com/en-us/graph/api/basesitepage-list?view=graph-rest-1.0&tabs=http) when using the `https://graph.microsoft.com/v1.0/sites/{SiteId}/pages` [endpoint](https://learn.microsoft.com/en-us/graph/api/basesitepage-list?view=graph-rest-1.0&tabs=http). However, you can still access them directly:

   ```
   https://graph.microsoft.com/v1.0/sites/{SiteId}/pages/{listItemUniqueId}/microsoft.graph.sitePage?$expand=canvasLayout
   ```

3. **Extract and Edit the CanvasLayout Object**

   Extract the `canvasLayout` object from the result and remove properties such as `horizontalSections@odata.context`, `columns@odata.context`, and `webparts@odata.context`.

4. **Create a New Page with the Edited CanvasLayout**

   Make a POST call to the following [endpoint](https://learn.microsoft.com/en-us/graph/api/sitepage-create?view=graph-rest-1.0&tabs=http) with the edited `canvasLayout` parameter and all required fields in the body:

   ```
   https://graph.microsoft.com/v1.0/sites/{siteId}/pages
   ```

   Ensure that your request body includes the necessary fields along with the `canvasLayout`.

## Conclusion

By following these steps, you can create a SharePoint page based on a custom template using the MS Graph Pages API. While there is no direct method available in the Pages API documentation, this workaround allows you to achieve the desired result by manipulating the `canvasLayout` of a template page.

Of course, this needs to be tested with more complex templates. As mentioned by the user in the GitHub issue [link to the comment](https://github.com/SharePoint/sp-dev-docs/issues/9653#issuecomment-2076456106), this method will not work for some web parts, such as the Yammer web part. I haven't investigated this deeply, but please share your experiences if you encounter any issues.