---
layout: post
title:  "New Version (1.0.7) of Power Automate Actions Extension"
date:   2025-01-12 00:00:00 +0200
tags: ["Power Automate", "Chrome Extension"]
image: "/images/powerAutomateExtension/header.png"
language: en
---

[**See how to install it now!**](#how-to-install-the-tool) 
<br />
<br />

The new version of the extension (1.0.7) introduces features to enhance navigation through the tool.
Now, the extension displays messages in a notification banner.

![Recorded Actions](/images/powerAutomateExtension/Version107/NotificationBar.png)

<br />

Also in this version, you can paste recorded actions into the new Power Automate editor. The selected actions will be inserted in the clipboard and can be pasted using the standard paste operation in the editor.

When a user pastes actions, they will be stored within a single "Scope" action. Unfortunately, we cannot configure all action settings automatically, so the user must manually set the correct connection for each pasted action. Please see the example below.

![HTTP Actions](/images/powerAutomateExtension/Version107/PasteActions.gif)


<br />

Since the copy functionality has changed in the new editor, the previous copy action feature has been removed in this version. Please refer to this article: [Obsolete Copy Action](https://michalkornet.com/2024/01/13/Copy_Paste_Feature_Power_Automate_Actions.html).

<br />
<br />

**Full Change Log:**
<br />
1.0.7
- Fixed pasting recorded actions into the new Power Automate editor.
- Added a notification banner.
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