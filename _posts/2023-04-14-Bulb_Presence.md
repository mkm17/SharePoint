---
layout: post
title:  "Use a bulb to indicate presence in Microsoft Teams"
date:   2023-04-17 11:08:54 +0200
tags: ["Power Automate", "Xiaomi Yeelight", "MS Graph"]
photo: "/images/bulb/header.png"
---

Have you ever wondered how easily **Power Automate** can connect to external devices? 

In this article, I share my idea of a system to visually inform about someone's availability status in Teams.

With the global pandemic forcing many of us to work remotely, it became crucial to establish new rules not only in our workplaces but also at home with other household members. We have all seen these popular videos of someone unintentionally interrupting an important meeting at the least convenient moment. This got me thinking if there was a way to display someone's availability to other household members or coworkers who do not have access to the employee's **Microsoft 365** environment.

My investigation started with some existing solutions on the same note: [The status Cube done by John Klimister](https://www.blueboxes.co.uk/building-a-ms-teams-status-cube-with-the-graph-api-presence-subscriptions), [Hue Bulb example done by Scott Hanselman](https://www.hanselman.com/blog/mirroring-your-presence-status-from-the-microsoft-graph-in-teams-to-lifx-or-hue-bias-lighting), [Raspberry Pi solution done by Elio Struyf](https://www.eliostruyf.com/diy-building-busy-light-show-microsoft-teams-presence/). Inspiring as they are, each one presents more complex scenario and demands high-code abilities. My aim was to use the least programming possible so that more people could benefit from the customized setup in their own environment.

### Table of Contents
- [Presence and subscriptions in MS Graph](#presence-and-subscriptions-in-ms-graph)
- [Power Automate](#power-automate)
    - [Main steps](#main-steps)
- [Xiaomi Yeelight 1S](#xiaomi-yeelight-1s)
- [The final effect](#the-final-effect)
- [Known issues](#known-issues)

## [Presence](https://learn.microsoft.com/en-us/graph/api/resources/presence?view=graph-rest-1.0) and [subscriptions](https://learn.microsoft.com/en-us/graph/api/resources/subscription?view=graph-rest-1.0) in MS Graph

 The presence information included in each user's data in MS Graph shows one's availability status. The subscription resource type is used to receive notifications when such resource is created, updated, or deleted. We will use this functionality to monitor the changes of user's presence and trigger a Power Automate flow only when the status changes.
 
 Here is an example of a subscription request payload for the presence resource type:

```javascript
{
    "changeType": "updated",
    "notificationUrl": "<<FLOW URL>>",
    "resource": "/communications/presences/<<USER ID>>",
    "expirationDateTime": "2023-04-12T18:23:45.9356913Z",
    "clientState": "secretClientValue",
    "latestSupportedTlsVersion": "v1_2"
}
```

*changeType*: The type of change in the subscribed resource that raises a notification. The supported values are created, updated, and deleted.

*notificationUrl*: The URL of the endpoint that receives the notifications. Replace with your API URL (in this case, Power Automate HTTP trigger from point 2 in the Power Automate section).

*resource*: The resource that the subscription monitors for changes. This resource is identified by the resource path.  For a single user, use the endpoint */communications/presences/{id}*, where *{id}* represents the user's ID. Using the Microsoft Graph API, you can also track a list of users with the following endpoint: */communications/presences?$filter=id in ('{id}', '{id}', ...)*.

*expirationDateTime*: The date and time when the subscription expires. Note that the maximum expiration time for the presence endpoint is 60 minutes, so make sure to update your subscription accordingly to ensure the functionality persists. The date and time are in UTC and are represented using ISO 8601 format. For example, midnight UTC on Jan 1, 2024 is represented as 2024-01-01T00:00:00Z.

## Power Automate

Power Automate was a simple yet powerful solution to design an effective workflow triggered on the user's availability change and performing certain following actions accordingly.

![Flow](/images/bulb/fullFlow.png)

#### Main steps
* trigger the flow on HTTP request
  
  To test the subscription request itself, leverage the MS Graph Explorer.
![Graph Explorer](/images/bulb/GraphExplorer.png)

 * The flow requires handling two type of requests. The first request involves confirming the secret value to the **Microsoft Graph API** by responding with the required value. This step is essential for establishing the authentication and authorization process with the API. The second request involves handling the presence value, which allows for capturing and processing the availability status of the user.
  
 * check if the request is a subscription confirmation request
![Confirm](/images/bulb/requestType.png)

```javascript
length(triggerOutputs()?['body']?['value'])   is equal to  0
```

 * check if the request source is from our tenant
To make a flow more secure we should check some secret value coming from the request In standard case we can use a method described in this [blog post](https://elnathsoft.pl/steal-data-with-ms-flow/). Unfortunately in this case we do not control the request body, so we can check for example a tenant id which is coming from the request.
  
![Tenant](/images/bulb/TenantIdCheck.png)

```javascript
triggerOutputs()?['body']?['value'][0]?['tenantId']  is equal to  '<<TENANT ID>>'
```

* Set color in Switch statement based on the presence value

presence value
```javascript
triggerOutputs()?['body']?['value'][0]?['resourceData']?['activity']
```

colors used
```javascript
{
  "redColor": 16711680,
  "greenColor": 65280,
  "yellowColor": 16776960,
  "whiteColor": 16777215,
}
```

color based on presence value
```javascript
OffWork - whiteColor
Offline - whiteColor
Available - greenColor
Busy - redColor
DoNotDisturb - redColor
BeRightBack - yellowColor
Away - yellowColor
```

## Xiaomi Yeelight 1S

For this particular project, I incorporated the **Yeelight Colorful Bulb** device, which is an affordable smart bulb controlled remotely within the Wi-Fi connection.

To set up the integration, you will need to register an account with Xiaomi and connect the Yeelight Colorful Bulb. Due to security concerns, I use a separate connection established solely for Xiaomi products. Once the bulb is connected to your Xiaomi account, you need to log in to the same account to establish the connection within each Xiaomi-based action in the Power Automate maker view.

Use the "Discovery" action provided by Xiaomi to retrieve all the details of your Yeelight Colorful Bulb directly in Power Automate. This action allows to identify all the connected devices associated with your Xiaomi account and retrieve comprehensive details about each of them.

![Discover action](/images/bulb/DiscoverBulb.png)

To change the color of the bulb using Power Automate, populating the following properties in all the eligible actions is essential:

![Color action](/images/bulb/ColorBulb.png)

*did*: This property refers to the unique identifier of the Yeelight Colorful Bulb.

*spectrumRGB*: It represents the color that you want to set for the bulb, expressed in RGB integer format.

*region*: Your region.

*type*: It refers to the type or model of the Yeelight Colorful Bulb.

## The final effect
The bulb changes its color based on the user's availability status. When the user is offline or not working, it functions as a regular bulb. When the user is available, the bulb turns green. When the user is busy or away, the bulb turns red. When the user is away, the bulb turns yellow.
![Effect](/images/bulb/effect.png)


## Known issues

   * For unidentified reason, the subscription tends to trigger the flow multiple times. I have tried some workarounds, but so far none of them has been successful. If anyone has any ideas, please let me know.

![TooManyRequests](/images/bulb/TooManyRequests.png)


   * Changing the color of the bulb returns the following error. However, the color is changed properly and no other issues are observed.
   
![Error](/images/bulb/ChangeColorError.png)

