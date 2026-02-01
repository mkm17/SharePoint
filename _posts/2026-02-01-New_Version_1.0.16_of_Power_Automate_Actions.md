---
layout: post
title:  "New Version (1.0.16) of Power Automate Actions Extension - Site Panel Support"
date:   2026-02-01 00:00:00 +0200
tags: ["Power Automate", "Chrome Extension"]
image: "/images/powerAutomateExtension/header.png"
language: en
---

[**See how to install it now!**](#how-to-install-the-tool) 
<br />
<br />


With this new feature, users can now:

- **Extension Side Panel Handler** - Thanks to [Tomi Tavela's suggestion](https://github.com/mkm17/powerautomate-actions-extension/issues/60), the extension can now also be displayed in a side panel. This is a more convenient way to access all the extension features while keeping the tool open at all times. This way, you can see all recorded actions live and there's no need to open the extension popup repeatedly to copy actions in the Power Automate editor.

![Site Panel](/images/powerAutomateExtension/version116/sidePanel.png)
<br />
<br />

- **Default Predefined Actions** - Since Power Automate doesn't include all possible SharePoint and other actions, the goal of this feature is to provide a list of commonly used actions that are missing from the standard Power Automate toolbox. This feature allows you to add both individual actions and snippets of action groups. The list will be continuously improved and added to the tool. The complete list is stored in the open GitHub repository.

![Default predefined actions](/images/powerAutomateExtension/version116/defaultPredefinedActions.png)

To enable this feature, set the 'Load Default Actions' toggle.

![Set default predefined actions](/images/powerAutomateExtension/version116/setDefaultPredefinedActions.png)

<br />
<br />

**Full Change Log:**
<br />

**1.0.16**
- Adds default predefined actions functionality.
- Adds side panel handler
  
<br />
<br />

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
