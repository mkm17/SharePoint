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
  
  {% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{"id":"5fac0a4e-16fc-4f41-99e3-a5954da2a20f","brandColor":"#007ee5","icon":"https://connectoricons-prod.azureedge.net/releases/v1.0.1549/1.0.1549.2680/yeelight/icon.png","isTrigger":false,"operationName":"Discover details on your Xiaomi devices","operationDefinition":{"type":"OpenApiConnection","inputs":{"host":{"connectionName":"shared_yeelight_2","operationId":"Discover","apiId":"/providers/Microsoft.PowerApps/apis/shared_yeelight"},"parameters":{},"authentication":"@parameters('$authentication')"},"runAfter":{"Check_if_the_request_addresses_the_current_tenant":["Succeeded"]},"metadata":{"operationMetadataId":"256540c4-ef84-4b99-ae32-55929bba99f5"}}}
</div>

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
{% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">{"id":"7e112577-ea1e-488b-8156-171c7586fd49","brandColor":"#770BD6","connectionReferences":{"shared_yeelight_2":{"connection":{"id":"/providers/Microsoft.PowerApps/apis/shared_yeelight/connections/shared-yeelight-26212218-f942-4cdb-af50-0853bfcb13be"}}},"connectorDisplayName":"Variables","icon":"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzMnB4IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAzMiAzMiIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQogPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjNzcwQkQ2Ii8+DQogPGcgZmlsbD0iI2ZmZiI+DQogIDxwYXRoIGQ9Ik02Ljc2MywxMy42ODV2LTMuMjA4QzYuNzYzLDguNzQ4LDcuNzYyLDgsMTAsOHYxLjA3Yy0xLDAtMiwwLjMyNS0yLDEuNDA3djMuMTg4ICAgIEM4LDE0LjgzNiw2LjUxMiwxNiw1LjUxMiwxNkM2LjUxMiwxNiw4LDE3LjE2NCw4LDE4LjMzNVYyMS41YzAsMS4wODIsMSwxLjQyOSwyLDEuNDI5VjI0Yy0yLjIzOCwwLTMuMjM4LTAuNzcyLTMuMjM4LTIuNXYtMy4xNjUgICAgYzAtMS4xNDktMC44OTMtMS41MjktMS43NjMtMS41ODV2LTEuNUM1Ljg3LDE1LjE5NCw2Ljc2MywxNC44MzQsNi43NjMsMTMuNjg1eiIvPg0KICA8cGF0aCBkPSJtMjUuMjM4IDEzLjY4NXYtMy4yMDhjMC0xLjcyOS0xLTIuNDc3LTMuMjM4LTIuNDc3djEuMDdjMSAwIDIgMC4zMjUgMiAxLjQwN3YzLjE4OGMwIDEuMTcxIDEuNDg4IDIuMzM1IDIuNDg4IDIuMzM1LTEgMC0yLjQ4OCAxLjE2NC0yLjQ4OCAyLjMzNXYzLjE2NWMwIDEuMDgyLTEgMS40MjktMiAxLjQyOXYxLjA3MWMyLjIzOCAwIDMuMjM4LTAuNzcyIDMuMjM4LTIuNXYtMy4xNjVjMC0xLjE0OSAwLjg5My0xLjUyOSAxLjc2Mi0xLjU4NXYtMS41Yy0wLjg3LTAuMDU2LTEuNzYyLTAuNDE2LTEuNzYyLTEuNTY1eiIvPg0KICA8cGF0aCBkPSJtMTUuODE1IDE2LjUxMmwtMC4yNDItMC42NDFjLTAuMTc3LTAuNDUzLTAuMjczLTAuNjk4LTAuMjg5LTAuNzM0bC0wLjM3NS0wLjgzNmMtMC4yNjYtMC41OTktMC41MjEtMC44OTgtMC43NjYtMC44OTgtMC4zNyAwLTAuNjYyIDAuMzQ3LTAuODc1IDEuMDM5LTAuMTU2LTAuMDU3LTAuMjM0LTAuMTQxLTAuMjM0LTAuMjUgMC0wLjMyMyAwLjE4OC0wLjY5MiAwLjU2Mi0xLjEwOSAwLjM3NS0wLjQxNyAwLjcxLTAuNjI1IDEuMDA3LTAuNjI1IDAuNTgzIDAgMS4xODYgMC44MzkgMS44MTEgMi41MTZsMC4xNjEgMC40MTQgMC4xOC0wLjI4OWMxLjEwOC0xLjc2IDIuMDQ0LTIuNjQxIDIuODA0LTIuNjQxIDAuMTk4IDAgMC40MyAwLjA1OCAwLjY5NSAwLjE3MmwtMC45NDYgMC45OTJjLTAuMTI1LTAuMDM2LTAuMjE0LTAuMDU1LTAuMjY2LTAuMDU1LTAuNTczIDAtMS4yNTYgMC42NTktMi4wNDggMS45NzdsLTAuMjI3IDAuMzc5IDAuMTc5IDAuNDhjMC42ODQgMS44OTEgMS4yNDkgMi44MzYgMS42OTQgMi44MzYgMC40MDggMCAwLjcyLTAuMjkyIDAuOTM1LTAuODc1IDAuMTQ2IDAuMDk0IDAuMjE5IDAuMTkgMC4yMTkgMC4yODkgMCAwLjI2MS0wLjIwOCAwLjU3My0wLjYyNSAwLjkzOHMtMC43NzYgMC41NDctMS4wNzggMC41NDdjLTAuNjA0IDAtMS4yMjEtMC44NTItMS44NTEtMi41NTVsLTAuMjE5LTAuNTc4LTAuMjI3IDAuMzk4Yy0xLjA2MiAxLjgyMy0yLjA3OCAyLjczNC0zLjA0NyAyLjczNC0wLjM2NSAwLTAuNjc1LTAuMDkxLTAuOTMtMC4yNzFsMC45MDYtMC44ODVjMC4xNTYgMC4xNTYgMC4zMzggMC4yMzQgMC41NDcgMC4yMzQgMC41ODggMCAxLjI1LTAuNTk2IDEuOTg0LTEuNzg2bDAuNDA2LTAuNjU4IDAuMTU1LTAuMjU5eiIvPg0KICA8ZWxsaXBzZSB0cmFuc2Zvcm09Im1hdHJpeCguMDUzNiAtLjk5ODYgLjk5ODYgLjA1MzYgNS40OTI1IDMyLjI0NSkiIGN4PSIxOS43NTciIGN5PSIxMy4yMjUiIHJ4PSIuNzc4IiByeT0iLjc3OCIvPg0KICA8ZWxsaXBzZSB0cmFuc2Zvcm09Im1hdHJpeCguMDUzNiAtLjk5ODYgLjk5ODYgLjA1MzYgLTcuNTgzOSAzMC42MjkpIiBjeD0iMTIuMzY2IiBjeT0iMTkuMzE1IiByeD0iLjc3OCIgcnk9Ii43NzgiLz4NCiA8L2c+DQo8L3N2Zz4NCg==","isTrigger":false,"operationName":"Initialize_varBulbData","operationDefinition":{"type":"InitializeVariable","inputs":{"variables":[{"name":"varBulbData","type":"object","value":{"did":"","region":"DE","type":"","redColor":"16711680","greenColor":"65280","yellowColor":"16776960","whiteColor":"16777215","tenantId":""}}]},"runAfter":{},"metadata":{"operationMetadataId":"15e38f57-13f7-44a3-a1f9-c63aeb68f357"}}}
</div>

![InitVariable](/images/bulb/initdata.png)

 * The integer variables come in handy in storing the information on target and current light colors.
  
 * Check if the request is a subscription confirmation with the following condition.

  {% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{"id":"05eea601-17eb-4a3e-8a49-83ca410d74d8","brandColor":"#007ee5","icon":"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZlcnNpb249IjEuMSIgdmlld0JveD0iLTQgLTQgNjAgNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQogPHBhdGggZD0ibS00LTRoNjB2NjBoLTYweiIgZmlsbD0iIzQ4NEY1OCIvPg0KIDxwYXRoIGQ9Ik00MSAxOC41di03LjVoLTMwdjcuNWg1LjY0djEzLjgzbC0zLjI4NS0zLjI4NS0xLjA2NSAxLjA2NSA0LjAzNSA0LjA1Ljg3Ljg0aC02LjE5NXY2aDEzLjV2LTZoLTYuOWwuODU1LS44NTUgNC4wMzUtNC4wNS0xLjA2NS0xLjA2NS0zLjI4NSAzLjI4NXYtMTMuODE1aDE1djEzLjgzbC0zLjI4NS0zLjI4NS0xLjA2NSAxLjA2NSA0LjAzNSA0LjA1Ljg3Ljg0aC02LjE5NXY2aDEzLjV2LTZoLTYuOWwuODU1LS44NTUgNC4wMzUtNC4wNS0xLjA2NS0xLjA2NS0zLjI4NSAzLjI4NXYtMTMuODE1em0tMjguNS02aDI3djQuNWgtMjd6IiBmaWxsPSIjZmZmIi8+DQo8L3N2Zz4NCg==","isTrigger":false,"operationName":"Check if the request is a subscription confirmation","operationDefinition":{"type":"If","expression":{"equals":["@contains(triggerOutputs(), 'queries')","@true"]},"actions":{},"runAfter":{"Check_if_the_request_is_a_subscription_confirmation_3":["Succeeded"]},"metadata":{"operationMetadataId":"7e06a1a3-4f25-47e7-89d3-d2f8fcc0c80d"}}}
</div>

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

{% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{"id":"785b8302-cfe2-4404-a70d-a68275111f3f","brandColor":"#007ee5","icon":"https://connectoricons-prod.azureedge.net/releases/v1.0.1549/1.0.1549.2680/yeelight/icon.png","isTrigger":false,"operationName":"Identify the target device","operationDefinition":{"type":"OpenApiConnection","inputs":{"host":{"connectionName":"shared_yeelight_2","operationId":"Query","apiId":"/providers/Microsoft.PowerApps/apis/shared_yeelight"},"parameters":{"body/did":"@variables('varBulbData')?['did']","body/region":"@variables('varBulbData')?['region']","body/type":"@variables('varBulbData')?['type']"},"authentication":"@parameters('$authentication')"},"runAfter":{"Discover_details_on_your_Xiaomi_devices":["Succeeded"]},"metadata":{"operationMetadataId":"3255b09e-0b64-4f23-8e1c-0f5be01f4564"}}}
</div>

![Discovery action](/images/bulb/DiscoverBulb.png)

To set up the integration, you will need to register an account with Xiaomi and connect the Yeelight Colorful Bulb. Due to security concerns, I use a separate connection established solely for Xiaomi products. Once the bulb is connected to your Xiaomi account, you need to log in to the same account to establish the connection within each Xiaomi-based action in the Power Automate maker view.

 * Check if the value parameter is not empty - in further stages we use the first element from the *value* array. to avoid errors we check if the *value* is not empty.

```javascript
length(triggerOutputs()?['body']?['value']) is not equal to 0
```

* Set the bulb colour based on the identified user activity - the Switch action to override the varNewBulbColor with the user activity indicator:

{% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{
    "id": "a9abf920-e736-4b15-ae5e-463c366da02b",
    "brandColor": "#007ee5",
    "icon": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDMyIDMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KIDxwYXRoIGQ9Im0wIDBoMzJ2MzJoLTMyeiIgZmlsbD0iIzQ4NEY1OCIvPg0KIDxnIGZpbGw9IiNmZmYiPg0KICA8cGF0aCBkPSJtMjUuNiAxOS42di03LjJoLTE5LjJ2Ny4yem0tMS4yLTEuMmgtMTYuODAxdi00LjhoMTYuOHY0Ljh6Ii8+DQogIDxwYXRoIGQ9Ik0xMS44IDE3LjJ2LTEuMmgtLjZ2LTEuMmgtMS4ydjEuMmgtLjZ2MS4yeiIvPg0KICA8cGF0aCBkPSJNMTUuNCAxNy4ydi0xLjJoLS42di0xLjJoLTEuMnYxLjJoLS42djEuMnoiLz4NCiAgPHBhdGggZD0iTTE5IDE3LjJ2LTEuMmgtLjZ2LTEuMmgtMS4ydjEuMmgtLjZ2MS4yeiIvPg0KICA8cGF0aCBkPSJNMjIuNiAxNy4ydi0xLjJoLS42di0xLjJoLTEuMnYxLjJoLS42djEuMnoiLz4NCiA8L2c+DQo8L3N2Zz4NCg==",
    "isTrigger": false,
    "operationName": "Set the bulb colour based on the identified user activity",
    "operationDefinition": {
        "type": "Switch",
        "expression": "@triggerOutputs()?['body']?['value'][0]?['resourceData']?['activity']",
        "cases": {
            "OffWork": {
                "case": "OffWork",
                "actions": {
                    "Set_varNewBulbColor_to_white": {
                        "type": "SetVariable",
                        "inputs": {
                            "name": "varNewBulbColor",
                            "value": "@variables('varBulbData')?['whiteColor']"
                        },
                        "runAfter": {}
                    }
                }
            },
            "Available": {
                "case": "Available",
                "actions": {
                    "Set_varNewBulbColor_to_green": {
                        "type": "SetVariable",
                        "inputs": {
                            "name": "varNewBulbColor",
                            "value": "@variables('varBulbData')?['greenColor']"
                        },
                        "runAfter": {}
                    }
                }
            },
            "Busy": {
                "case": "Busy",
                "actions": {
                    "Set_varNewBulbColor_to_red": {
                        "type": "SetVariable",
                        "inputs": {
                            "name": "varNewBulbColor",
                            "value": "@variables('varBulbData')?['redColor']"
                        },
                        "runAfter": {}
                    }
                }
            },
            "DoNotDisturb": {
                "case": "DoNotDisturb",
                "actions": {
                    "Set_varNewBulbColor_to_red_2": {
                        "type": "SetVariable",
                        "inputs": {
                            "name": "varNewBulbColor",
                            "value": "@variables('varBulbData')?['redColor']"
                        },
                        "runAfter": {}
                    }
                }
            },
            "BeRightBack": {
                "case": "BeRightBack",
                "actions": {
                    "Set_varNewBulbColor_to_yellow": {
                        "type": "SetVariable",
                        "inputs": {
                            "name": "varNewBulbColor",
                            "value": "@variables('varBulbData')?['yellowColor']"
                        },
                        "runAfter": {}
                    }
                }
            },
            "Away": {
                "case": "Away",
                "actions": {
                    "Set_varNewBulbColor_to_yellow_2": {
                        "type": "SetVariable",
                        "inputs": {
                            "name": "varNewBulbColor",
                            "value": "@variables('varBulbData')?['yellowColor']"
                        },
                        "runAfter": {}
                    }
                }
            },
            "Offline": {
                "case": "Offline",
                "actions": {
                    "Set_varNewBulbColor_to_white_2": {
                        "type": "SetVariable",
                        "inputs": {
                            "name": "varNewBulbColor",
                            "value": "@variables('varBulbData')?['whiteColor']"
                        },
                        "runAfter": {}
                    }
                }
            }
        },
        "default": {
            "actions": {}
        },
        "runAfter": {},
        "metadata": {
            "operationMetadataId": "eddaf68d-de21-48d6-9d31-dc3674e17763"
        }
    }
}
</div>

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

{% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{"id":"d056f961-752c-46a7-bd5f-033572eb6279","brandColor":"#007ee5","icon":"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZlcnNpb249IjEuMSIgdmlld0JveD0iLTQgLTQgNjAgNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQogPHBhdGggZD0ibS00LTRoNjB2NjBoLTYweiIgZmlsbD0iIzQ4NEY1OCIvPg0KIDxwYXRoIGQ9Ik00MSAxOC41di03LjVoLTMwdjcuNWg1LjY0djEzLjgzbC0zLjI4NS0zLjI4NS0xLjA2NSAxLjA2NSA0LjAzNSA0LjA1Ljg3Ljg0aC02LjE5NXY2aDEzLjV2LTZoLTYuOWwuODU1LS44NTUgNC4wMzUtNC4wNS0xLjA2NS0xLjA2NS0zLjI4NSAzLjI4NXYtMTMuODE1aDE1djEzLjgzbC0zLjI4NS0zLjI4NS0xLjA2NSAxLjA2NSA0LjAzNSA0LjA1Ljg3Ljg0aC02LjE5NXY2aDEzLjV2LTZoLTYuOWwuODU1LS44NTUgNC4wMzUtNC4wNS0xLjA2NS0xLjA2NS0zLjI4NSAzLjI4NXYtMTMuODE1em0tMjguNS02aDI3djQuNWgtMjd6IiBmaWxsPSIjZmZmIi8+DQo8L3N2Zz4NCg==","isTrigger":false,"operationName":"Check if the target colour is different than the current one","operationDefinition":{"type":"If","expression":{"not":{"equals":["@variables('varNewBulbColor')","@variables('varPreviousBulbColor')"]}},"actions":{},"runAfter":{},"metadata":{"operationMetadataId":"a3522d65-3eea-48f2-ab5e-0ed5202d6925"}}}
</div>

![Color change condition](/images/bulb/colorChangeCondition.png)


* To change the color of the bulb using Power Automate, populating the following properties in all the final Color action is essential:

{% include codeHeader.html %}
<div class="powerAutomateCode" style="display:none">
{"id":"eb83e063-99d4-44f9-9c3c-f0b3e8321f38","brandColor":"#007ee5","icon":"https://connectoricons-prod.azureedge.net/releases/v1.0.1549/1.0.1549.2680/yeelight/icon.png","isTrigger":false,"operationName":"Change the bulb colour","operationDefinition":{"type":"OpenApiConnection","inputs":{"host":{"connectionName":"shared_yeelight_2","operationId":"Color","apiId":"/providers/Microsoft.PowerApps/apis/shared_yeelight"},"parameters":{"body/did":"@variables('varBulbData')?['did']","body/spectrumRGB":"@variables('varNewBulbColor')","body/region":"@variables('varBulbData')?['region']","body/type":"@variables('varBulbData')?['type']"},"authentication":{"type":"Raw","value":"@json(decodeBase64(triggerOutputs().headers['X-MS-APIM-Tokens']))['$ConnectionKey']"}},"runAfter":{},"metadata":{"operationMetadataId":"26108701-6a4f-4510-9d1c-3f0f116f7fdd"}}}
</div>

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

