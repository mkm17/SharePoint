---
layout: post
title:  "New Version (1.0.6) of Power Automate Actions Extension"
date:   2024-11-08 00:00:00 +0200
tags: ["Power Automate", "MSGraph", "Chrome Extension"]
image: "/images/powerAutomateExtension/header.png"
language: en
---

[**See how to install it now!**](#how-to-install-the-tool) 
<br />
<br />

The new version of the extension (1.0.6) includes new features to help you work with Microsoft Graph in Power Automate flows.

![Recorded Actions](/images/powerAutomateExtension/Version106/MsGraphActions.gif)

In this version, you can record all actions from the Microsoft Graph Explorer page. As you may know, Power Automate offers special HTTP actions to interact with Microsoft Graph, instead of the default HTTP action. The tool now automatically detects the type of endpoint used and saves the correct action to the clipboard.

![HTTP Actions](/images/powerAutomateExtension/Version106/HTTPActions.png)


There are also improvements in the recording function. In the previous version, recordings were not saved, so they were lost after refreshing the page. This issue is now fixed.

Additionally, some small improvements have been made to the UI.

**Full Change Log:**
1.0.6
- Added support for HTTP Microsoft Graph actions.
- Enabled recording of actions on Microsoft Graph Explorer and Classic SharePoint pages.
- Enhanced persistence of recorded actions.
- Fixed scrolling for actions.

 **[Power Automate Actions Extension](https://chrome.google.com/webstore/detail/power-automate-actions-ha/eoeddkppcaagdeafjfiopeldffkhjodl?hl=pl&authuser=0)**.

To get more information regarding the custom solution, check my previous article on the [Power Automate Actions Extension](https://michalkornet.com/2023/05/23/Power-Automate-Actions-Chrome-Extension.html).


<strong id="how-to-install-the-tool">How to install the tool?</strong>

The tool is available on the **[Chrome Store](https://chrome.google.com/webstore/detail/power-automate-actions-ha/eoeddkppcaagdeafjfiopeldffkhjodl?hl=pl&authuser=0)**.

If you would like to install the extension manually - please unpack the *[ApplicationBuild](https://github.com/mkm17/powerautomate-actions-extension/blob/main/ApplicationBuild.zip)* zip file and follow the steps described [here](https://support.google.com/chrome/a/answer/2714278?hl=en) to install the package locally. 


<br />
<br />

 **Disclaimer**

The tool was meant to ease my daily pains with reproducing steps throughout various workflows. I based it on the current implementation of the Power Automate maker experience and any updates to the interface or underlying processes may cause the tool to stop working. 
The code is available on [GitHub](https://github.com/mkm17/powerautomate-actions-extension/tree/main). You are welcome to use it for your personal efficiency and share your feedback in [Issues section](https://github.com/mkm17/powerautomate-actions-extension/issues).

<br />