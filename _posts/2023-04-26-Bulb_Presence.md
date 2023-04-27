---
layout: post
title:  "Use a bulb to indicate presence in Microsoft Teams"
date:   2023-04-26 00:00:00 +0200
tags: ["Power Automate", "Xiaomi Yeelight", "MS Graph"]
image: "/images/bulb/header.png"
---

Have you ever wondered how easily **Power Automate** can connect to external devices? 

In this article, I share my idea of a system to visually inform about someone's availability status in Teams.

With the global pandemic forcing many of us to work remotely, it became crucial to establish new rules not only in our workplaces but also at home with other household members. We have all seen these popular videos of someone unintentionally interrupting an important meeting at the least convenient moment. This got me thinking if there was a way to display someone's availability to other household members or coworkers who do not have access to the employee's **Microsoft 365** environment.

My investigation started with some existing solutions on the same note: [The Status Cube published by John Klimister](https://www.blueboxes.co.uk/building-a-ms-teams-status-cube-with-the-graph-api-presence-subscriptions), [Hue Bulb example by Scott Hanselman](https://www.hanselman.com/blog/mirroring-your-presence-status-from-the-microsoft-graph-in-teams-to-lifx-or-hue-bias-lighting), [or the automation based on Raspberry Pi by Elio Struyf](https://www.eliostruyf.com/diy-building-busy-light-show-microsoft-teams-presence/). Inspiring as they are, each one presents more complex scenario and demands high-code abilities. My aim was to use the least programming possible so that more people could benefit from the customized setup in their own environment.

### Table of Contents
- [Presence and subscriptions in MS Graph](#presence-and-subscriptions-in-ms-graph)
- [Power Automate](#power-automate)
    - [Trigger](#trigger)
    - [Main actions](#main-actions)
  - [The subscription update](#the-subscription-update)
- [The final effect](#the-final-effect)
- [Known issues](#known-issues)

## [Presence](https://learn.microsoft.com/en-us/graph/api/resources/presence?view=graph-rest-1.0) and [subscriptions](https://learn.microsoft.com/en-us/graph/api/resources/subscription?view=graph-rest-1.0) in MS Graph

 The information on user availability status is included in general user data and can be captured by MS Graph using a subscription. The subscription resource type is used to receive notifications when such resource is created, updated, or deleted. We will use this functionality to monitor shifts in any Teams user presence and trigger a Power Automate flow each time the status changes.
 
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

Power Automate was a natural choice for a simple yet powerful solution to design an effective workflow triggered by the user's availability change and performing consequent actions to switch the bulb color accordingly. The graph below presents the flow design.

![Flow](/images/bulb/PresenceDisplayFlow.PNG)

#### Trigger
* The flow fires on the HTTP request. Use the HTTP trigger to initialize the subscription request from the **Microsoft Graph API**. 
  
* Ultimately, two kinds of requests will initialize the flow. The first one aims at confirming the secret value to the **Microsoft Graph API** by responding with a required value. This step is essential for establishing the authentication and authorization process with the API. The second request involves handling the value of user presence, which allows for capturing and processing the availability status of the user. 

* To start your tests and make sure the subscription request is valid at any point of workflow development, leverage the MS Graph Explorer. 
![Graph Explorer](/images/bulb/GraphExplorer.png)

#### Main actions
 * Initialize the object variable used to store the set of values to provide before the first run. It includes the bulb data - you will take the "did", "region" and "type" properties from the test query in the Discover step described below.
  
  ![DiscoverAction](/images/bulb/DiscoverOnly.png)

 *did*: This property refers to the unique identifier of the Yeelight Colorful Bulb.

*region*: Your region.

*type*: It refers to the type or model of the Yeelight Colorful Bulb.
  
 The "tenantId" value store the identifier number of your tenant. I add the following values to the object variable to indicate the color codes for particular options:

```javascript
{
  "redColor": "16711680",
  "greenColor": "65280",
  "yellowColor": "16776960",
  "whiteColor": "16777215",
}
```

![InitVariable](/images/bulb/initdata.png)

 * The integer variables come in handy in storing the information on target and current light colors.
  
 * Check if the request is a subscription confirmation with the following condition.

![Condition](/images/bulb/IsSubscriptionConfirmationCondition.png)

```javascript
contains(triggerOutputs(),'queries') is equal to true
```

If the condition is met, the flow will respond with the required value to the **Microsoft Graph API** ato confirm the subscription. Otherwise, it will proceed to the next steps.

* Check if the request addresses the current tenant - to secure a process, we validate the secret value coming from the request. In a standard case, we can use a method described in this [blog post](https://elnathsoft.pl/steal-data-with-ms-flow/). As we do not control the request body, instead, we can check if the request is coming from the tenant specified in the tenantId property of the object variable with the bulb data. Otherwise, it will cancel the workflow.
![Tenant](/images/bulb/TenantIdCheck.png)

```javascript
triggerOutputs()?['body']?['value'][0]?['tenantId']  is equal to  '<<TENANT ID>>'
```

![Check Tenant Id](/images/bulb/checktenantid.png)

* For this particular project, I incorporated the **Yeelight Colorful Bulb** device, which is an affordable smart bulb controlled remotely within a Wi-Fi connection.
  To get more information about the device use the Discover and Query actions of the Yeelight service provided by Xiaomi. The output of the query contains the "spectrumRGB" property to be set in a variable within the next action.
![Discovery action](/images/bulb/DiscoverBulb.png)

To set up the integration, you will need to register an account with Xiaomi and connect the Yeelight Colorful Bulb. Due to security concerns, I use a separate connection established solely for Xiaomi products. Once the bulb is connected to your Xiaomi account, you need to log in to the same account to establish the connection within each Xiaomi-based action in the Power Automate maker view.

 * Check if the value parameter is not empty - in further stages we use the first element from the *value* array. to avoid errors we check if the *value* is not empty.

```javascript
length(triggerOutputs()?['body']?['value']) is not equal to 0
```

* Set the bulb colour based on the identified user activity - the Switch action to override the varNewBulbColor with the user activity indicator:

![switch](/images/bulb/switchStatement.png)

```javascript
triggerOutputs()?['body']?['value'][0]?['resourceData']?['activity']
```

Here are the values to be used in the Switch statement:

```javascript
OffWork - whiteColor
Offline - whiteColor
Available - greenColor
Busy - redColor
DoNotDisturb - redColor
BeRightBack - yellowColor
Away - yellowColor
```

* Check if the target color is different than the current one - the condition checks if the current color of the bulb is different from the target color. If the condition is false, the flow will terminate.

![Color change condition](/images/bulb/colorChangeCondition.png)


* To change the color of the bulb using Power Automate, populating the following properties in all the final Color action is essential:

![Color action](/images/bulb/ColorBulb.png)


### The subscription update

We treat the process described above in terms of the Proof of Concept. To keep your subscription valid, every 60 minutes another flow must be triggered to perform the same request as in MS Graph Explorer, thereby updating the subscription.

![Subscription Update Flow](/images/bulb/SubscriptionUpdate.png)

The process of creating a Custom Connector for MS Graph is described [here](https://medium.com/rapha%C3%ABl-pothin/create-a-custom-connector-for-microsoft-graph-581676585529).


## The final effect
The bulb changes its color based on the user's availability status. When the user is offline or not working, it functions as a regular bulb. When the user is available, the bulb turns green. When the user is busy or away, the bulb turns red. When the user is away, the bulb turns yellow.
![Effect](/images/bulb/effect.png)


## Known issues

   * For unidentified reasons, the subscription tends to trigger the flow multiple times. I have tried some workarounds, but so far none of them has been successful. If anyone has any ideas, please let me know.

![TooManyRequests](/images/bulb/TooManyRequests.png)


   * Changing the color of the bulb returns the following error. However, the color is changed properly and no other issues are observed.
   
![Error](/images/bulb/ChangeColorError.png)

