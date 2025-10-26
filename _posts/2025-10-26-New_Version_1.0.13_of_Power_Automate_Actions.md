---
layout: post
title:  "New Version (1.0.13) of Power Automate Actions Extension"
date:   2025-09-27 00:00:00 +0200
tags: ["Power Automate", "Chrome Extension"]
image: "/images/powerAutomateExtension/header.png"
language: en
---

[**See how to install it now!**](#how-to-install-the-tool) 
<br />
<br />

The new version of the extension (1.0.13) a new setting panel to customize the extension behavior.

![Search Feature](/images/powerAutomateExtension/version113/settingPanel.png)

<br />
<br />

In the setting tab, users can now configure the following settings.

- Option to manually override page type detection. This is useful in scenarios where the automatic detection may not accurately identify the page type. Which is especially the case in the modern Power Automate maker.

- The maximum recording time for actions. This is particularly useful for users who want to limit the duration of their recordings to avoid capturing unnecessary steps.

- Toggle the visibility of the action search bar. This allows users to hide or show the search functionality based on their preference, providing a cleaner interface if desired.
  
  <br />
<br />

![Action Details](/images/powerAutomateExtension/version113/SettingDetails.png)

<br />
<br />


**Full Change Log:**
<br />
**1.0.13***

- Added a Settings tab with options to configure the maximum recording time and toggle the visibility of the action search bar.
- Added a setting to manually override page type detection.
  
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