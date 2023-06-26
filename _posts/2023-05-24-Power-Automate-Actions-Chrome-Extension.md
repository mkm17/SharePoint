---
layout: post
title:  "Power Automate Actions - Chrome Extension"
date:   2023-05-24 00:00:00 +0200
tags: ["Power Automate", "SharePoint", "MS Graph", "Chrome Extension"]
image: "/images/powerAutomateExtension/header.png"
language: en
---

Have you ever had any issue with managing actions in **Power Automate**? Who hasn't? Here comes the tool I have created to make my work in Power Automate easier. It proves to optimize the following scenarios:
- [**1. Recording all HTTP requests from SharePoint**](#1-recording-all-http-requests-from-sharepoint)
- [**2. Duplicating actions in between tenants and environments**](#2-duplicating-actions-in-between-tenants-and-environments)
- [**3. Coping actions from community blogs**](#3-coping-actions-from-community-blogs)
- [**4. Storing actions in a more persistent way**](#4-storing-actions-in-a-more-persistent-way)
- [**- Using recorded and copied actions in Power Automate workflows!**](#--using-recorded-and-copied-actions-in-power-automate-workflows)

[**See how to install it now!**](#how-to-install-the-tool) 
<br />
<br />


### **1. Recording all HTTP requests from SharePoint**
Power Automate easily integrates with the SharePoint platform. Although there are many predefined actions, some of them are still missing. In such cases, we can invoke a particular **SharePoint HTTP request** and copy headers, method, and body from the Network tab of browser developer tools. To make this cumbersome process easier, the created [**Power Automate Actions - Chrome Extension**](#how-to-install-the-tool) allows us to record all HTTP requests automatically and stores them in **“Recorded Actions”**. From there, we can straight away [**copy any action to a Power Automate workflow**](#--using-recorded-and-copied-actions-in-power-automate-workflows). The same recording works for **MS Graph** requests as well!

 **Catching requests invoked directly from the SharePoint interface**

![Recorded Actions](/images/powerAutomateExtension/RecordDefaultSPActions.gif)


 **Recording requests invoked from the browser console**

![Recorded Actions](/images/powerAutomateExtension/RecordConsoleAction.gif)


 **Gathering requests executed with SP Editor**

![Recorded Actions](/images/powerAutomateExtension/RecordActionsFromSPEditor.gif)

<br />
<br />

### **2. Duplicating actions in between tenants and environments**
If we want to reuse any action, copying it to **“My Clipboard”** may come in handy. But this feature has its limitation and is not persistent. With the **Power Automate Actions - Chrome Extension**, we can copy any action from any location, keep it in the storage and past when needed to the next flow regardless of its location.

![Copy Actions Between Environments](/images/powerAutomateExtension/CopyBetweenEnvs.gif)

<br />
<br />

### **3. Coping actions from community blogs**
It's great to find inspiring solutions presented on blogs. Most frequently, to mimic following Power Automate actions, we create a row of new actions and one by one, manually, place the content from the page with peeking the code. With the aforementioned Chrome Extension, it is possible to copy all predefined in a correct manner actions (please check **[our article about bulb presence](https://michalkornet.com/2023/04/25/Bulb_Presence.html)** as a reference) - even simultaneously, using the copy button at the top of the window.

![Copy Actions from blog](/images/powerAutomateExtension/CopyItemsFromBlogAndSaveOnFlow.gif)

<br />
<br />

### **4. Storing actions in a more persistent way**
By default, all the actions copied from a workflow are stored in **“My Clipboard”** and cleared quite frequently.
The tool gives an effortless opportunity to keep the same items in the **Chrome storage** instead, so they are available even after the browser restart.

![Copy Actions from My Clipboard](/images/powerAutomateExtension/CopyMyClipboardActions.gif)

<br />
<br />

### **- Using recorded and copied actions in Power Automate workflows!**
With a single button in the **Chrome Extension**, all selected actions can be copied back to the **"My Clipboard"** section of Power Automate - if only you opened the section beforehand. Accepting a browser dialog is the last step required to see the ready to use actions in the Power Automate maker view.

![Paste Actions to my clipboard](/images/powerAutomateExtension/CopyItemsToMyClipboard.gif)

<br />
<br />

<strong id="how-to-install-the-tool">How to install the tool?</strong>

The tool is available on the **[Chrome Store](https://chrome.google.com/webstore/detail/power-automate-actions-ha/eoeddkppcaagdeafjfiopeldffkhjodl?hl=pl&authuser=0)**.

If you would like to install the extension manually - please unpack the *[ApplicationBuild](https://github.com/mkm17/powerautomate-actions-extension/blob/main/ApplicationBuild.zip)* zip file and follow the steps described [here](https://support.google.com/chrome/a/answer/2714278?hl=en) to install the package locally. 



<br />
<br />


 **Disclaimer**

The tool was meant to ease my daily pains with reproducing steps throughout various workflows. I based it on the current implementation of the Power Automate maker experience and any updates to the interface or underlying processes may cause the tool to stop working. 
The code is available on [GitHub](https://github.com/mkm17/powerautomate-actions-extension/tree/main). You are welcome to use it for your personal efficiency and share your feedback in [Issues section](https://github.com/mkm17/powerautomate-actions-extension/issues).

<br />
<br />