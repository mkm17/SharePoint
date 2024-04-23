---
layout: post
title:  "SharePoint Api - BulkValidateUpdateListItems"
date:   2024-04-22 00:00:00 +0200
tags: ["SharePoint", "SharePointApi"]
image: "/images/sharepointapi/BulkValidateUpdateListItems/header.png"
language: en
---

## How to update multiple items using SharePoint REST API?

You can answer the following question using different methods. Of course, one of the methods is to use batching and methods like `/items/update` or `AddValidateUpdateItem`.

But did you know that there is another method to achieve the same effect? Let’s imagine a scenario where you need to update the same value in selected items. For example, giving a user the possibility to select multiple items and change the status, or to approve multiple items at the same time.

SharePoint exposes a [BulkValidateUpdateListItems](https://learn.microsoft.com/en-us/openspecs/sharepoint_protocols/ms-csomspt/ebc47581-36e4-457b-8045-a4cf1f4da501) endpoint which expects a body similar to the ValidateUpdateListItems.

I have compared three REST API methods to update multiple items. For each method, I have taken 4 different items in the same list to update the same property. 

![Calls Comparison](/images/sharepointapi/BulkValidateUpdateListItems/CallsComparison.png)

The results are as follows:

| Method                      | Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Average Execution Time |
| --------------------------- | ----- | ----- | ----- | ----- | ----- | ---------------------- |
| ValidateUpdateListItems     | 0.645 | 0.692 | 0.472 | 0.418 | 0.496 | 0.545 seconds          |
| Update                      | 0.665 | 0.733 | 0.914 | 0.455 | 0.499 | 0.653 seconds          |
| BulkValidateUpdateListItems | 0.510 | 0.696 | 0.861 | 0.334 | 0.473 | 0.575 seconds          |


As you can see, the execution time looks similar for all methods.

Now, let's check an example of the code to approve many items at the same time. A real-case scenario could be to approve multiple items simultaneously.

Replace contoso, TargetSite, and TargetList with your values.

**URL:**

```
 https://<contoso>.sharepoint.com/sites/<TargetSite>/_api/web/GetList(@a1)/BulkValidateUpdateListItems()?@a1=%27%2Fsites%2F<TargetSite>%2FLists%2F<TargetList>%27
```

Replace the itemIds with the items you want to update. The formValues should contain the field you want to update. In this case, the field is _ModerationStatus, and the value is 0 (Approved).

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