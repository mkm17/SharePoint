---
layout: post
title:  "SharePoint page translation"
date:   2024-07-13 00:00:00 +0200
tags: ["SharePoint", "QuickFinding"]
image: "/images/sharePointPageTranslations/Header.png"
language: en
---

# SharePoint page translation

Today, just a quick topic about page translation.

As you may know, there are settings to make your pages multilingual. For example, the user can switch from the English to the Arabic version of the page. 

When the translation is changed once, the next opened page would also open in the target language.

![Page translation](/images/sharePointPageTranslations/pageTranslations.PNG)

<br><br>

### But have you ever thought about where this information is stored?

My first thought was that maybe there is information saved somewhere in user preferences. 

After some research, I have noticed that you can find this information in the **cookies** under a property named **siteLangPref**.

![Cookie](/images/sharePointPageTranslations/cookie.PNG)

<br><br>

As you can see, the value has format like :
* *46c3e867-9879-431e-96fb-032d00ca978d_1dd434ff-f388-4bc9-8e7c-b1c90ef08907_en-us* for English 
* *46c3e867-9879-431e-96fb-032d00ca978d_1dd434ff-f388-4bc9-8e7c-b1c90ef08907_ar-sa* for Arabic.

The format is as follows: 
```
siteId_webId_language
```

### Multiple sites

When a user chooses languages across multiple sites, the cookie will store the information for each site separately.

![Cookie](/images/sharePointPageTranslations/cookie2.PNG)

<br><br>

As you can see, the value follows this format (in this example, English is chosen for one site and Danish for another):

  * 46c3e867-9879-431e-96fb-032d00ca978d_1dd434ff-f388-4bc9-8e7c-b1c90ef08907_en-us.3b543835-7c9b-46ba-b0a1-9667f96dd7c2_fb0a066f-c10f-4734-94d1-f896de4aa484_da-dk


This format separates each site's information by dots: 
```
siteId1_webId1_language1.siteId2_webId2_language2
```

This means that you can set the preferred language for the user individually for selected sites.

