---
layout: post
title:  "Power Automate Actions Chrome Extension"
date:   2023-05-25 00:00:00 +0200
tags: ["Power Automate", "SharePoint", "MS Graph", "Chrome Extension"]
image: "/images/powerAutomateExtention/header.png"
---

Have you ever had a problem with managing actions in Power Automate? In the article I will share with you information about the tool which I have created to make my life with Power Automate flows easier. 

In my common work with Power Automate I encountered some steps which could be optimized.
- [**1. Making SharePoint Http Requests and MS Graph HTTP Requests actions.**](#1-making-sharepoint-http-requests-and-ms-graph-http-requests-actions)
- [**2.	Copy actions between two different environments**](#2copy-actions-between-two-different-environments)
- [**3.	Copy entire action from community blogs.**](#3copy-entire-action-from-community-blogs)
- [**4.	Store actions in more persistent way.**](#4store-actions-in-more-persistent-way)

In the following points I will describe how I could achieve all these points using my Chrome Extension.

## **1. Making SharePoint Http Requests and MS Graph HTTP Requests actions.**
Power Automate is a great tool to interfere with SharePoint platform. However, there are many predefined actions, there still are some of them missing. In these cases, we can use SharePoint Http Request.
In such cases I use standard SharePoint behavior or SP Editor and PnPjs Console to invoke HTTP requests which I analyze in network tab of browser and copy details to SharePoint HTTP Request including headers, method, and body.
With the tool I could record all actions http actions which are invoked in SharePoint Page including the ones from PnPjs Console of SP Editor.
The whole action is stored in “Recorded Actions” section of the tool.

 **Default Requests invoked from SharePoint Page**
![Recorded Actions](/images/powerAutomateExtention/RecordDefaultSPActions.gif)

 **Requests invoked from browser console**
![Recorded Actions](/images/powerAutomateExtention/RecordConsoleAction.gif)

 **Requests invoked from SP Editor**
![Recorded Actions](/images/powerAutomateExtention/RecordActionsFromSPEditor.gif)


## **2.	Copy actions between two different environments**
There is a possibility to copy the whole flow currently, but unfortunately, we cannot use the same “My Clipboard” section between different environments.
With the tool we can copy all actions from “My Clipboard” section and then past selected actions to the next environment.

![Copy Actions from My Clipboard](/images/powerAutomateExtention/CopyMyClipboardActions.gif)


![Copy Actions Between Environments](/images/powerAutomateExtention/CopyBetweenEnvs.gif)


## **3.	Copy entire action from community blogs.**
It is nice that some solutions are presented in the blogs. Unfortunately, currently we must create a new action copy content from the page.
With the tool it is possible to copy all actions stored on the page. Please check [our article about bulb presence](https://michalkornet.com/2023/04/25/Bulb_Presence.html) as the  reference. 

![Copy Actions from blog](/images/powerAutomateExtention/CopyItemsFromBlogAndSaveOnFlow.gif)


## **4.	Store actions in more persistent way.**
Currently the actions are stored in “My Clipboard” section which clears the actions after some time.
With the tool actions are stored in the Chrome storage. So, it is handled in a more persistent way.


All actions can be copy to My Clipboard section of Power Automate (please remember that this section needs to be open). After coping of action you will see a browser dialog which should be accepted. After that you will see the action in My Clipboard section of Power Automate.

![Paste Actions to my clipboard](/images/powerAutomateExtention/CopyItemsToMyClipboard.gif)



 **Disclaimer**
This tool is not an official Microsoft product. It is a tool which I have created to make my life easier. In some cases I based on the current implementation of Power Automate edit page. So, if Microsoft will change the implementation of the page, the tool may not work properly. 
