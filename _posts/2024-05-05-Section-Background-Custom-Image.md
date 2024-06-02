---
layout: post
title:  "Customized Section Background"
date:   2024-05-04 00:00:00 +0200
tags: ["SharePoint"]
image: "/images/sectionBackground/image/header.png"
language: en
---

## Is there a way to set a custom image as a section background in SharePoint Online?

In the new update of SharePoint Online, you can now set additional predefined backgrounds for page sections, next to the 4 theme colors that used to be available before. But what if you want to use your own image instead?

By default, such an option is not possible from the user experience as of now. However, there is a workaround to achieve the goal. Here's how to do it with [CLI for M365](https://pnp.github.io/cli-microsoft365/).

Some time ago, I explored the possibility of setting standard background section colors using the *zoneEmphasis* parameter in [the page section add command](https://pnp.github.io/cli-microsoft365/cmd/spo/page/page-section-add/). Now, while examining how the new backgrounds are defined internally, I found out that the new setup brings some extra possibilities and one of them is allowing to specify your own image URL.

### Step-by-step explanation
#### 1. Select the last predefined section background for a selected page section.

![Select the last predefined section background](/images/sectionBackground/image/backgroundSelection.png)

![Page result](/images/sectionBackground/image/pageResult.png)

#### 2. Login to your tenant using the CLI for M365 tool.

``` powershell
m365 login
```

#### 3. Get the page content output using the following command.
    
``` powershell
m365 spo page get --webUrl https://contoso.sharepoint.com/sites/TargetSite --name "TargetPage.aspx"
``` 

![Get page content](/images/sectionBackground/image/canvasResult.png)

#### 4. Identify the *canvasContentJson* value from the output. 

It should look like this:

```json
"[{\"position\":{\"layoutIndex\":1,\"zoneIndex\":1,\"sectionIndex\":1,\"sectionFactor\":12,\"controlIndex\":1,\"zoneId\":\"a79cf521-5755-46fb-8b74-f51d4fbb1494\"},\"controlType\":3,\"id\":\"98d36bd7-c5f2-4e36-a210-92bc364ef2d0\",\"webPartId\":\"c4bd7b2f-7b6e-4599-8485-16504575f590\",\"reservedHeight\":450,\"reservedWidth\":1188,\"addedFromPersistedData\":true,\"webPartData\":{\"id\":\"c4bd7b2f-7b6e-4599-8485-16504575f590\",\"instanceId\":\"98d36bd7-c5f2-4e36-a210-92bc364ef2d0\",\"title\":\"Hero\",\"description\":\"Prominently display up to 5 pieces of content with links, images, pictures, videos, or photos in a highly visual layout.\",\"audiences\":[],\"serverProcessedContent\":{\"htmlStrings\":{},\"searchablePlainTexts\":{\"content[0].callToActionText\":\"Learn more\"},\"imageSources\":{\"content[0].previewImage.url\":\"https://media.akamai.odsp.cdn.office.net/westeurope1-mediap.svc.ms/transform/thumbnail?provider=url&inputFormat=jpg&docid=https://cdn.hubblecontent.osi.office.net/m365content/publish/0078ee3a-9487-4a9c-9705-49032b9c00f3/1065261400.jpg&w=960\"},\"links\":{\"content[0].link\":\"https://cdn.hubblecontent.osi.office.net/m365content/publish/0078ee3a-9487-4a9c-9705-49032b9c00f3/1065261400.jpg\"},\"componentDependencies\":{\"heroLayoutComponentId\":\"9586b262-54de-4b27-9eb9-34c671400c33\",\"carouselLayoutComponentId\":\"8ac0c53c-e8d0-4e3e-87d0-7449eb0d4027\"},\"customMetadata\":{\"content[0].previewImage.url\":{\"renderwidthratio\":\"0.5\",\"renderwidthratiothreshold\":\"640\",\"mincanvaswidth\":\"1\"}}},\"dataVersion\":\"1.5\",\"properties\":{\"heroLayoutThreshold\":640,\"carouselLayoutMaxWidth\":639,\"layoutCategory\":1,\"layout\":5,\"content\":[{\"id\":\"95afe589-4473-4d94-b956-c462ea9be7af\",\"type\":\"UrlLink\",\"color\":4,\"description\":\"\",\"title\":\"\",\"showDescription\":false,\"showTitle\":true,\"alternateText\":\"\",\"imageDisplayOption\":1,\"isDefaultImage\":false,\"showCallToAction\":true,\"isDefaultImageLoaded\":true,\"isCustomImageLoaded\":false,\"showFeatureText\":false,\"previewImage\":{\"zoomRatio\":1,\"imageUrl\":\"https://media.akamai.odsp.cdn.office.net/westeurope1-mediap.svc.ms/transform/thumbnail?provider=url&inputFormat=jpg&docid=https%3A%2F%2Fcdn.hubblecontent.osi.office.net%2Fm365content%2Fpublish%2F0078ee3a-9487-4a9c-9705-49032b9c00f3%2F1065261400.jpg&w=960\",\"widthFactor\":0.5,\"minCanvasWidth\":1}},{\"id\":\"3c9fbbdb-0860-4777-bb61-9b794c8df2ef\",\"type\":\"Image\",\"color\":4,\"description\":\"\",\"title\":\"\",\"showDescription\":false,\"showTitle\":true,\"alternateText\":\"\",\"imageDisplayOption\":0,\"isDefaultImage\":false,\"showCallToAction\":false,\"isDefaultImageLoaded\":false,\"isCustomImageLoaded\":false,\"showFeatureText\":false},{\"id\":\"f07c62a8-b6ff-4dbb-acd2-f23d8f93594d\",\"type\":\"Image\",\"color\":4,\"description\":\"\",\"title\":\"\",\"showDescription\":false,\"showTitle\":true,\"alternateText\":\"\",\"imageDisplayOption\":0,\"isDefaultImage\":false,\"showCallToAction\":false,\"isDefaultImageLoaded\":false,\"isCustomImageLoaded\":false,\"showFeatureText\":false},{\"id\":\"cd33fa47-66a5-4c78-89bc-764e89c00bf8\",\"type\":\"Image\",\"color\":4,\"description\":\"\",\"title\":\"\",\"showDescription\":false,\"showTitle\":true,\"alternateText\":\"\",\"imageDisplayOption\":0,\"isDefaultImage\":false,\"showCallToAction\":false,\"isDefaultImageLoaded\":false,\"isCustomImageLoaded\":false,\"showFeatureText\":false},{\"id\":\"819113e8-679b-4fd5-92eb-432e2539afe5\",\"type\":\"Image\",\"color\":4,\"description\":\"\",\"title\":\"\",\"showDescription\":false,\"showTitle\":true,\"alternateText\":\"\",\"imageDisplayOption\":0,\"isDefaultImage\":false,\"showCallToAction\":false,\"isDefaultImageLoaded\":false,\"isCustomImageLoaded\":false,\"showFeatureText\":false}]},\"containsDynamicDataSource\":false}},{\"controlType\":0,\"pageSettingsSlice\":{\"isDefaultDescription\":true,\"isDefaultThumbnail\":true,\"isSpellCheckEnabled\":true,\"globalRichTextStylingVersion\":1,\"rtePageSettings\":{\"contentVersion\":5},\"isEmailReady\":false}},{\"controlType\":14,\"webPartData\":{\"properties\":{\"zoneBackground\":{\"a79cf521-5755-46fb-8b74-f51d4fbb1494\":{\"type\":\"image\",\"imageData\":{\"source\":1,\"fileName\":\"sectionbackgroundimagedark3.jpg\",\"height\":955,\"width\":555},\"overlay\":{\"color\":\"#000000\",\"opacity\":7},\"useLightText\":true}}},\"serverProcessedContent\":{\"htmlStrings\":{},\"searchablePlainTexts\":{},\"imageSources\":{\"zoneBackground.a79cf521-5755-46fb-8b74-f51d4fbb1494.imageData.url\":\"/_layouts/15/images/sectionbackgroundimagedark3.jpg\"},\"links\":{}},\"dataVersion\":\"1.0\"}}]"
```

#### 5. Modify the JSON string to achieve the desired result.

Copy and paste the result presented in a stringified JSON value into any text editor and replace the *\\"* string with the *"* sign, and remove first and last *"* signs to achieve a correct JSON.

![Correct JSON](/images/sectionBackground/image/extractJson.png)

Notice that the section background definition is not just a color or *zoneEmphasis*, like in the 'old' section backgrounds, but a web part with a control type *14* and regular web part data. 

#### 6. Define a custom section background.

In the data, locate a value defining the image. The properties to change are *fileName*, *height*, and *width*. Additionally, modify  *zoneBackground.a79cf521-5755-46fb-8b74-f51d4fbb1494.imageData.url*, which represents the URL of the target image.

```json
{
        "controlType": 14,
        "webPartData": {
            "properties": {
                "zoneBackground": {
                    "a79cf521-5755-46fb-8b74-f51d4fbb1494": {
                        "type": "image",
                        "imageData": {
                            "source": 1,
                            "fileName": "sectionbackgroundimagedark3.jpg",
                            "height": 955,
                            "width": 555
                        },
                        "overlay": {
                            "color": "#000000",
                            "opacity": 7
                        },
                        "useLightText": true
                    }
                }
            },
            "serverProcessedContent": {
                "htmlStrings": {},
                "searchablePlainTexts": {},
                "imageSources": {
                    "zoneBackground.a79cf521-5755-46fb-8b74-f51d4fbb1494.imageData.url": "/_layouts/15/images/sectionbackgroundimagedark3.jpg"
                },
                "links": {}
            },
            "dataVersion": "1.0"
        }
    }
```

#### 7. Execute the command.

Add the ' sign at the beginning and the end of the new JSON string and use it in the *--content* parameter of the following command: 

``` powershell
m365 spo page set --name "TargetPage.aspx" --webUrl https://contoso.sharepoint.com/sites/TargetSite --content 'the new string'
```

In case of any problems with the resulting JSON string, refer to the [Remarks](https://pnp.github.io/cli-microsoft365/cmd/spo/page/page-set/#remarks) section of the *page set* command.


Here is the final result of the changes made to the page section background.

![Result](/images/sectionBackground/image/result.png)
