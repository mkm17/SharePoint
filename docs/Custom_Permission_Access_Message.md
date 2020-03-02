# How to create custom access request messages

## Out of the box features

Have you thought about customization of the standard access request on your site? Currently, SharePoint provides simple message as a solution. The option is available in the *Access Request Settings*.

![Access Requests Settings](../images/accessRequestsSettings.jpg)

Current access request message is a little bit limited. In case when a user requests access to a site, an owner of the resource will get the notification (represented by an adaptive card) to add the user y to two default groups (members, visitors).

![Request Message](../images/RequestMessage1.jpg)

In case of a request to a certain list or item without inherited permission, a notification will have different structure and will allow providing unique access to the resource.

![Request Message](../images/RequestMessage2.jpg)

![Request Message](../images/RequestMessage3.jpg)

## Test Case Scenario

#### The business owner requirements

- the access request message should be the same in both represented cases.
- the message should have different structure
- notification should be defined as an adaptive card
- the owner should be able to add a user to 3 custom groups

#### We can achieve all of the requirements in a few steps:
- Enable Allow access requests option and set any it accounts to receive the standard messages.

![Access Requests Settings](../images/accessRequestsSettings.jpg)

-	Create flow/logicapp which will receive the http request.
-	Add event receiver on Access Requests list
```
Add-PnPEventReceiver -List "Access Requests" -Name "TestEventReceiver" -Url "<LogicAppURL>" -EventReceiverType ItemAdded -
Synchronization Synchronous
```
-	Update the created flow/logicapp

![First Flow](../images/Flow1Overview.jpg)

#### ConvertToJson action:

```javascript
json(xml(replace(triggerBody(), '<?xml version="1.0" encoding="UTF-8"?>', '')))
```

#### Schema of the converted xml of a request

```javascript
{
  "type": "object",
  "properties": {
    "s:Envelope": {
      "type": "object",
      "properties": {
        "s:Body": {
          "type": "object",
          "properties": {
            "ProcessEvent": {
              "type": "object",
              "properties": {
                "properties": {
                  "type": "object",
                  "properties": {
                    "AppEventProperties": {
                      "type": "object",
                      "properties": {
                        "@i:nil": {
                          "type": "string"
                        }
                      }
                    },
                    "ContextToken": {},
                    "CorrelationId": {
                      "type": "string"
                    },
                    "CultureLCID": {
                      "type": "string"
                    },
                    "EntityInstanceEventProperties": {
                      "type": "object",
                      "properties": {
                        "@i:nil": {
                          "type": "string"
                        }
                      }
                    },
                    "ErrorCode": {},
                    "ErrorMessage": {},
                    "EventType": {
                      "type": "string"
                    },
                    "ItemEventProperties": {
                      "type": "object",
                      "properties": {
                        "AfterProperties": {
                          "type": "object",
                          "properties": {
                            "a:KeyValueOfstringanyType": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "a:Key": {
                                    "type": "string"
                                  },
                                  "a:Value": {
                                    "type": "object",
                                    "properties": {
                                      "#text": {
                                        "type": "string"
                                      },
                                      "@i:type": {
                                        "type": "string"
                                      },
                                      "@xmlns:b": {
                                        "type": "string"
                                      }
                                    }
                                  }
                                },
                                "required": [
                                  "a:Key",
                                  "a:Value"
                                ]
                              }
                            },
                            "@xmlns:a": {
                              "type": "string"
                            }
                          }
                        },
                        "AfterUrl": {
                          "type": "object",
                          "properties": {
                            "@i:nil": {
                              "type": "string"
                            }
                          }
                        },
                        "BeforeProperties": {
                          "type": "object",
                          "properties": {
                            "@xmlns:a": {
                              "type": "string"
                            }
                          }
                        },
                        "BeforeUrl": {},
                        "CurrentUserId": {
                          "type": "string"
                        },
                        "ExternalNotificationMessage": {
                          "type": "object",
                          "properties": {
                            "@i:nil": {
                              "type": "string"
                            }
                          }
                        },
                        "IsBackgroundSave": {
                          "type": "string"
                        },
                        "ListId": {
                          "type": "string"
                        },
                        "ListItemId": {
                          "type": "string"
                        },
                        "ListTitle": {
                          "type": "string"
                        },
                        "UserDisplayName": {
                          "type": "string"
                        },
                        "UserLoginName": {
                          "type": "string"
                        },
                        "Versionless": {
                          "type": "string"
                        },
                        "WebUrl": {
                          "type": "string"
                        }
                      }
                    },
                    "ListEventProperties": {
                      "type": "object",
                      "properties": {
                        "@i:nil": {
                          "type": "string"
                        }
                      }
                    },
                    "SecurityEventProperties": {
                      "type": "object",
                      "properties": {
                        "@i:nil": {
                          "type": "string"
                        }
                      }
                    },
                    "UICultureLCID": {
                      "type": "string"
                    },
                    "WebEventProperties": {
                      "type": "object",
                      "properties": {
                        "@i:nil": {
                          "type": "string"
                        }
                      }
                    },
                    "@xmlns:i": {
                      "type": "string"
                    }
                  }
                },
                "@xmlns": {
                  "type": "string"
                }
              }
            }
          }
        },
        "@xmlns:s": {
          "type": "string"
        }
      }
    }
  }
}
```

All properties are in the array we can convert them into one JSON object by using the following function inside the apply to each action.

```javascript
addProperty(variables('AccessRequestObject'),item()?['a:Key'], item()?['a:Value']?['#text'])
```

#### An example of a final request object.

```javascript
{
  "PermissionLevelRequested": "<Permission Level>",
  "PermissionType": "<Permission Type>",
  "IsInvitation": "<Is an user invited>",
  "RequestId": "<RequestId>",
  "RequestedWebId": "<WebId>",
  "RequestedForDisplayName": "<User display name>",
  "Expires": "<Expiration Date>",
  "AnonymousLinkType": "<>",
  "RequestedByDisplayName": "<Requestor display name>",
  "RequestedListItemId": "<>",
  "Status": "0",
  "RequestedObjectTitle": "<Resource name>",
  "Conversation": "<Request comment>",
  "Title": "<Request title>",
  "RequestedByUserId": "<Requestor Id",
  "PropagateAcl": "<>",
  "RequestedObjectUrl": "<Url to requested resource>, ",
  "RequestedForUserId": "User ID",
  "FileSystemObjectType": "<Resource type>",
  "RequestedListId": "<Resource List Id>",
  "InheritingRequestedWebId": "<>",
  "SendWelcomeEmail": "<>",
  "RequestedFor": "<Login of a user>",
  "RequestedBy": "<Login of a requestor>"
}
```

####	An example of a message with adaptive card:
```html
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <script type="application/adaptivecard+json">{
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.0",
    "body": [
        {
            "type": "TextBlock",
            "text": "Access Request to Client Site",
            "weight": "Bolder",
            "size": "Medium"
        },
        {
            "type": "TextBlock",
            "text": "Dear user, \n\n please review the following access request",
            "wrap": true
        },
        {
            "type": "FactSet",
            "facts": [
                {
                    "title": "Client:",
                    "value": "Client name"
                },
                {
                    "title": "User:",
                    "value": "@{body('Parse_JSON')?['RequestedByDisplayName']}"
                },
                {
                    "title": "Requested Resource:",
                    "value": "@{body('Parse_JSON')?['RequestedObjectTitle']}"
                },
                {
                    "title": "Request date:",
                    "value": "@{utcNow()}"
                },
{
                    "title": "Comment",
                    "value": "@{body('Parse_JSON')?['Conversation']}"
                }
            ]
        }
    ],
    "actions": [
        {
            "type": "Action.Http",
            "title": "Assign to Group 1",
            "method": "POST",
            "headers": [
                {
                    "name": "Authorization",
                    "value": ""
                }
            ],
            "url": "<URL_TO_A_DECISION_FLOW>",
            "body": "{'decision':'Approve','userId':'@{body('Parse_JSON')?['RequestedForUserId']}','webId':'@{body('Parse_JSON')?['RequestedWebId']}','RequestId':'@{body('Parse_JSON')?['RequestId']}'}"
        },
        {
            "type": "Action.Http",
            "title": "Assign to Group 2",
            "method": "POST",
            "headers": [
                {
                    "name": "Authorization",
                    "value": ""
                }
            ],
            "url": "<URL_TO_A_DECISION_FLOW>",
            "body": "{'decision':'Approve2','userId':'@{body('Parse_JSON')?['RequestedForUserId']}','webId':'@{body('Parse_JSON')?['RequestedWebId']}','RequestId':'@{body('Parse_JSON')?['RequestId']}'}"
        },
        {
            "type": "Action.Http",
            "title": "Reject",
            "method": "POST",
            "headers": [
                {
                    "name": "Authorization",
                    "value": ""
                }
            ],
            "url": "<URL_TO_A_DECISION_FLOW>",
            "body": "{'decision':'Reject','userId':'@{body('Parse_JSON')?['RequestedForUserId']}','webId':'@{body('Parse_JSON')?['RequestedWebId']}','RequestId':'@{body('Parse_JSON')?['RequestId']}'}"
        }
    ]
}
  </script>
</head>
<body>
</body>
</html>
```


![Adaptive Card](../images/AdaptiveCards1.jpg)

Second Flow which will be triggered after clicking one of the button.

![Second Flow](../images/SecondFlow.jpg)

>It may happen that the Access Request list is not available. To be sure that the structure is created, you need to create one access request by the user with insufficient permissions to the site or one of the child component.

---

Principal author: Michał Kornet

LinkedIn: https://www.linkedin.com/in/micha%C5%82-kornet-sharepoint-dev/
