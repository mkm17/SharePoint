---
layout: post
title:  "Extended Copy/Paste feature for the new PowerAutomate editor"
date:   2024-01-14 00:00:00 +0200
tags: ["Power Automate", "SharePoint", "Chrome Extension"]
image: "/images/powerAutomateExtension/header.png"
language: en
---

Some time ago, the new **Power Automate editor** was introduced. It brought a few new features and major improvements. A noteworthy addition was the **Copilot** feature, designed to expedite the creation process of new flows. However, some of the previously featured options were missing at the initial point. Such a feature was the **copy/paste** functionality for actions, introduced in a constrained form in a later version of the editor. It quickly turned out insufficient to more advanced users. After reading many comments, I decided to explore the possibility of extending the current method used in **the new Power Automate editor**. The result is the updated version of the **[Power Automate Actions Extension](https://chrome.google.com/webstore/detail/power-automate-actions-ha/eoeddkppcaagdeafjfiopeldffkhjodl?hl=pl&authuser=0)**.

To get more information regarding the custom solution, check my previous article on the [Power Automate Actions Extension](https://michalkornet.com/2023/05/23/Power-Automate-Actions-Chrome-Extension.html).


[**See how to install it now!**](#how-to-install-the-tool) 
<br />
<br />

### **Extended Copy/Paste feature for the new PowerAutomate editor**
This new feature not only enhances the **copy/paste** functionality but also allows users to store copied actions for future use. Additionally, it provides the capability to select specific actions that should be copied into the editor.

![Copy Paste in the new editor](/images/copyPastePowerAutomateExtension/CopyPasteExample.gif)

<br />
<br />

<strong id="how-to-install-the-tool">How to install the tool?</strong>

The tool is available on the **[Chrome Store](https://chrome.google.com/webstore/detail/power-automate-actions-ha/eoeddkppcaagdeafjfiopeldffkhjodl?hl=pl&authuser=0)**.

If you would like to install the extension manually - please unpack the *[ApplicationBuild](https://github.com/mkm17/powerautomate-actions-extension/blob/main/ApplicationBuild.zip)* zip file and follow the steps described [here](https://support.google.com/chrome/a/answer/2714278?hl=en) to install the package locally. 


<br />
<br />


 **Disclaimer**

Please mind that in the new editor the format of stored actions changed, limiting the range of the extension features available in this mode. I will keep on investigating the possibility of mapping the new format to the old one, enabling the full functionality of the extension in both **Power Automate editor**.

The tool was meant to ease my daily pains with reproducing steps throughout various workflows. I based it on the current implementation of the Power Automate maker experience and any updates to the interface or underlying processes may cause the tool to stop working. 
The code is available on [GitHub](https://github.com/mkm17/powerautomate-actions-extension/tree/main). You are welcome to use it for your personal efficiency and share your feedback in [Issues section](https://github.com/mkm17/powerautomate-actions-extension/issues).

<br />