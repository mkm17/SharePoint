---
layout: post
title:  "Embed dedicated Power Apps view using the SharePoint list formatting"
date:   2024-08-03 00:00:00 +0200
tags: ["SharePoint", "CanvasApp"]
image: "/images/embededPowerApp/Header.png"
language: en
---

In the today's blog post, I would like to share a handy finding about a powerful setting behind the SharePoint list formatting feature.

You might have already seen multiple examples of using the [customRowAction](https://learn.microsoft.com/en-us/sharepoint/dev/declarative-customization/formatting-syntax-reference#customrowaction) option to run a flow directly from the SharePoint list by clicking on a button or updating item values. 

Let's imagine that you need to grasp more details per item and be able to manage these properties with the action button. 

You could certainly start scratching a custom code in the SPFx field customizer but a low-code canvas Power Apps application along with the *customRowAction embed* option has a lot to offer here.

### Creation of the app

In this basic case, I have created a simple canvas application in Power Apps, displaying further information about a list item and featuring two buttons to run related Power Automate flows.

The crucial part is that in the app, I am using the *Param("ID")* function to get the exact item ID from the URL clicked on the SharePoint list.

![Simple Power App](/images/embededPowerApp/simplePowerApp.png)

After publishing and sharing the app, get its web link. The app URL should look similarly to this one: *https://apps.powerapps.com/play/e/<enviromentName>/a/<app id>?tenantId=<tenantId>&hint=74c99cf5-5ef9-4a0f-8f6a-829ec80a9c33&sourcetime=1722273673473*.

![app URL](/images/embededPowerApp/createdAppLink.png)


### Column formatting

The link will be used in the column formatting. Create a dedicated text column and format it using the scheme below.

![columnFormatting](/images/embededPowerApp/columnformatting.png)

``` json

{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
  "elmType": "button",
  "customRowAction": {
    "action": "embed",
    "actionInput": {
      "src": "='https://apps.powerapps.com/play/e/<enviromentName>/a/<app id>?ID=' + [$ID] + '&tenantId=<tenantId>&hint=74c99cf5-5ef9-4a0f-8f6a-829ec80a9c33&sourcetime=1722273673473'",
      "height": "630",
      "width": "350"
    }
  },
  "txtContent": "Click here open Power App"
}

```

Test the deployment by clicking on a button next to any existing list items. You should see the application displaying specific item details.

![Power App Opened](/images/embededPowerApp/openPowerApp.png)


When the buttons are clicked, a connected Power Automate flow is triggered. In this showcase, I have just provided the ID of the clicked item but following the labels, it could easily 'archive' an item in any datasource or delete it from the list.

![PowerAutomate](/images/embededPowerApp//flowResult.png)


The scenario presented here is just the tip of the iceberg, but the simple combination of customRowAction formatting and Power Apps Param functionality can be a real game-changer in some common scenarios, offering simple and visually appealing options that extend the native SharePoint interface.