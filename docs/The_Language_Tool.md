# My Language Learning Platform.

1. [Introduction](#introduction)
2. [Description of Components Used](#description-of-components-used)
3. [MS Word App](#ms-word-app)
4. [Connection to Language Services](#connection-to-language-services)
5. [PWA App](#pwa-app)

## Introduction

Some time ago, I set a goal to learn new languages, recognizing that having basic communication skills in the native language of a visited country can make the entire trip a unique experience. I quickly discovered that acquiring a broad vocabulary of common words and understanding basic grammar is essential. 

I began my language-learning journey many years ago by using popular language apps to learn Spanish. While these apps are a great starting point, I realized that I lacked a broad range of vocabulary, which hindered my ability to have basic conversations. 

To remedy this, I decided to focus on becoming comfortable with the most common words first (e.g., 1000 words) before expanding to more advanced vocabulary. While there are many word lists available online, I found that creating my own personalized list could be more effective. We all have our common language structures that we use more frequently. Sometime this style of language is something that define us. 

This idea inspired me to create a diary app that could analyze my texts to identify incorrect words, which would then be stored in my personal database. This way, I could continuously learn and track my progress in mastering new vocabulary. By focusing on the most common words first and creating more and more complicated texts, I will able to quickly expand my vocabulary and improve my language skills.

In the tool I write texts in the desired languages as much as I can filling all the gaps in my native language. The tool will analyze the text and will suggest me the correct words. I can also add new words to the dictionary.

![The Language Tool](../images/languageTool/AppPresentation.gif)

## Components uses 

With a clear plan in mind, I set out to explore the various possibilities offered by Microsoft 365.  My first step was to explore the **Office JS app for MS Word**. However, as I wanted to utilize my current job scope and a solution that I was familiar with, I chose the **SPFx app**. 

Since I did not require a sophisticated database, I opted to store my data on **SharePoint Lists** in my tenant. By leveraging this approach, I was able to easily store and access my data without needing to invest significant time and effort in setting up a more complex system. 

![The source list](../images/languageTool/sourceList.jpg)

## MS Word App 

During my research, I discovered that while an [SPFx app was available for MS Outlook](https://www.youtube.com/watch?v=46J3SVzZem8), it was not available for other MS Office apps. However, after further investigation, I found a solution that would allow me to render a SharePoint page with an SPFx web part using Sideload of Office JS solutions. 

With this new understanding, I was able to implement the correct steps and successfully integrate the SPFx app into other MS Office apps beyond MS Outlook. This allowed me to leverage the benefits of the SPFx framework across multiple Microsoft tools.

To implement this solution, I followed these steps. 

### 1. Configure Manifest as following 
Replace TENANT_NAME with name of your tenant
Replace PAGE_URL with URL to your page (/sites/SiteName/SitePages/Test.aspx)
Replace ICONS_LIBRARY with Url to icons library (sites/SiteName/Shared%20Documents)

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<OfficeApp xmlns="http://schemas.microsoft.com/office/appforoffice/1.1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bt="http://schemas.microsoft.com/office/officeappbasictypes/1.0"
  xmlns:ov="http://schemas.microsoft.com/office/taskpaneappversionoverrides" xsi:type="TaskPaneApp">
  <Id>05c2e1c9-3e1d-406e-9a91-e9ac64854143</Id>
  <Version>1.0.0.0</Version>
  <ProviderName>mknet</ProviderName>
  <DefaultLocale>en-US</DefaultLocale>
  <DisplayName DefaultValue="Language Diary"/>
  <Description DefaultValue="The tool to learn new words"/>
  <IconUrl DefaultValue="https://localhost:3000/assets/icon-32.png"/>
  <HighResolutionIconUrl DefaultValue="https://localhost:3000/assets/icon-64.png"/>
  <SupportUrl DefaultValue="https://www.contoso.com/help"/>
  <AppDomains>
    <AppDomain>login.windows.net</AppDomain>
    <AppDomain>login.microsoftonline.com</AppDomain>
    <AppDomain>TENANT_NAME.sharepoint.com</AppDomain>
    <AppDomain>outlook.office.com</AppDomain>
    <AppDomain>TENANT_NAME-my.sharepoint.com</AppDomain>
  </AppDomains>
  <Hosts>
    <Host Name="Document"/>
  </Hosts>
  <DefaultSettings>
    <SourceLocation DefaultValue="https://TENANT_NAME.sharepoint.com"/>
  </DefaultSettings>
  <Permissions>ReadWriteDocument</Permissions>
  <VersionOverrides xmlns="http://schemas.microsoft.com/office/taskpaneappversionoverrides" xsi:type="VersionOverridesV1_0">
    <Hosts>
      <Host xsi:type="Document">
        <DesktopFormFactor>
          <GetStarted>
            <Title resid="GetStarted.Title"/>
            <Description resid="GetStarted.Description"/>
            <LearnMoreUrl resid="GetStarted.LearnMoreUrl"/>
          </GetStarted>
          <FunctionFile resid="Commands.Url" />
          <ExtensionPoint xsi:type="PrimaryCommandSurface">
            <OfficeTab id="TabHome">
              <Group id="CommandsGroup">
                <Label resid="CommandsGroup.Label" />
                <Icon>
                  <bt:Image size="16" resid="Icon.16x16" />
                  <bt:Image size="32" resid="Icon.32x32" />
                  <bt:Image size="80" resid="Icon.80x80" />
                </Icon>
                <Control xsi:type="Button" id="TaskpaneButton">
                  <Label resid="TaskpaneButton.Label" />
                  <Supertip>
                    <Title resid="TaskpaneButton.Label" />
                    <Description resid="TaskpaneButton.Tooltip" />
                  </Supertip>
                  <Icon>
                    <bt:Image size="16" resid="Icon.16x16" />
                    <bt:Image size="32" resid="Icon.32x32" />
                    <bt:Image size="80" resid="Icon.80x80" />
                  </Icon>
                  <Action xsi:type="ShowTaskpane">
                    <TaskpaneId>ButtonId1</TaskpaneId>
                    <SourceLocation resid="Taskpane.Url" />
                  </Action>
                </Control>
              </Group>
            </OfficeTab>
          </ExtensionPoint>
        </DesktopFormFactor>
      </Host>
    </Hosts>
    <Resources>
      <bt:Images>
        <bt:Image id="Icon.16x16" DefaultValue="https://TENANT_NAME.sharepoint.com/ICONS_LIBRARY/icon-16.png"/>
        <bt:Image id="Icon.32x32" DefaultValue="https://TENANT_NAME.sharepoint.com/ICONS_LIBRARY/icon-32.png"/>
        <bt:Image id="Icon.80x80" DefaultValue="https://TENANT_NAME.sharepoint.com/ICONS_LIBRARY/icon-80.png"/>
      </bt:Images>
      <bt:Urls>
        <bt:Url id="GetStarted.LearnMoreUrl" DefaultValue="https://go.microsoft.com/fwlink/?LinkId=276812" />
        <bt:Url id="Commands.Url" DefaultValue="https://TENANT_NAME.sharepoint.com/PAGE_URL" />
        <bt:Url id="Taskpane.Url" DefaultValue="https://TENANT_NAME.sharepoint.com/PAGE_URL" />
      </bt:Urls>
      <bt:ShortStrings>
        <bt:String id="GetStarted.Title" DefaultValue="Get started with Language Tools" />
        <bt:String id="CommandsGroup.Label" DefaultValue="Language Tools" />
        <bt:String id="TaskpaneButton.Label" DefaultValue="Language Diary" />
      </bt:ShortStrings>
      <bt:LongStrings>
        <bt:String id="GetStarted.Description" DefaultValue="Language Diary" />
        <bt:String id="TaskpaneButton.Tooltip" DefaultValue="Click to Show a Language Diary analisis" />
      </bt:LongStrings>
    </Resources>
  </VersionOverrides>
</OfficeApp>
```

### 2. Add OfficeJS script to SPFx solution. 

``` javascript

protected async onInit(): Promise<void> {

{...}

await SPComponentLoader.loadScript('https://appsforoffice.microsoft.com/lib/1/hosted/office.js', { globalExportsName: 'Office' })

{...}
  
}

```

### 3. Install Typings

npm i -save-dev @types/office-js to the solution

### 4. Add the addin manifest to AppCatalog

[App Catalog for Office Apps](../images/languageTool/AppCatalog.jpg)

### 5. Add the SPFx webpart on a desired page with SingleApp layout

## Connection to language services 

When selecting a platform for my language learning project, I chose **MS Word** for its native language checker functionality. This feature automatically highlights any incorrect words, adding an additional class (*SpellingErrorV2Themed*) that made it easy for me to grab a list of elements with this class using an OfficeJS function [body.getHtml()](https://learn.microsoft.com/en-us/javascript/api/word/word.body?view=word-js-preview#word-word-body-gethtml-member(1)) . 

However, I encountered a roadblock when this method [stopped working](https://github.com/OfficeDev/office-js/issues/2898#issuecomment-1279839683) in a new release. Despite trying other services, I was unable to find a satisfactory solution until I discovered **OpenAI**. 

With this powerful tool, I was able to detect incorrect words, receive suggestions for correcting them, and even get suggestions for the entire text. Additionally I use the same tool to get translations to selected words.

In both cases I make a query to get a result in stable JSON format. Fortunately OpenAI handles this kind of requests very well. 
You can test your queries [here](https://platform.openai.com/playground).

### Query for incorrect words
In the code I replace the *language* property with a name of the Language, and the *text* property with written text in the Word document.
`find incorrect ${language} words, find maximum 3 suggestions for them, show result in JSON format {incorrect_words:[ x:{ 'text', suggestions: []}], suggested_correction:'text' }, without any additional data: ${text}`

![Get words query](../images/languageTool/getWordsQuery.jpg)


### Translations query
In the code I replace the *wordsToTranslate* property with selected words separated by comma.
`get translations from Portuguese to English for words in json format [{"word":"","translation":""}]: ${wordsToTranslate}`

![Get Translations](../images/languageTool/getTranslations.jpg)

I used the following code to connect to the OpenAI API and get suggestions for the text. 

``` javascript
public async checkSpelling(text: string, language: string): Promise<ITextCheckResult> {
        try {
            const apiKey = ConstantsApi.ChatGPTApiKey;
            const apiUrl = 'https://api.openai.com/v1/chat/completions';
            const query = `find incorrect ${language} words, find maximum 3 suggestions for them,
         show result in JSON format {incorrect_words:[ x:{ 'text', suggestions: []}], suggested_correction:'text' },
         without any additional data: ${text}`;

            const response = await fetch(apiUrl, {
                body: JSON.stringify(
                    {
                        frequency_penalty: 0,
                        max_tokens: 2048,
                        model: 'gpt-3.5-turbo',
                        presence_penalty: 0,
                        temperature: 0,
                        top_p: 1,
                        messages: [{
                            role: 'assistant',
                            content: query
                        }
                        ]
                    }),
                headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                method: 'POST'
            });

            const jsonResponse = await response.json();

            const result = jsonResponse && jsonResponse.choices && jsonResponse.choices.length > 0
                && jsonResponse.choices[0].message &&
                jsonResponse.choices[0].message.content ? JSON.parse(jsonResponse.choices[0].message.content) : null;

            if (!result || !result.incorrect_words) {
                return {
                    incorrectWords: [],
                    suggestedText: null
                };
            }

            const incorrectWords = result.incorrect_words.map(
                (incorrectWord) => {
                    return { word: incorrectWord.text, suggestions: incorrectWord.suggestions, token: incorrectWord.text } as IIncorrectWord;
                });
            return {
                incorrectWords: incorrectWords,
                suggestedText: result.suggested_correction
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }
```


I used the following code to connect to the OpenAI API and get corrected text. 

``` javascript
 public async getTranslationsForWords(words: IWordToAnalyze[]): Promise<IWordToAnalyze[]> {
        try {
            const apiKey = ConstantsApi.ChatGPTApiKey;
            const apiUrl = 'https://api.openai.com/v1/chat/completions';

            const wordsToTranslate = words.filter((word) => word.isChecked).map((word) => word.title).join(',');
            const query = `get translations from Portuguese to English for words in json format [{"word":"","translation":""}]: ${wordsToTranslate}`;

            const response = await fetch(apiUrl, {
                body: JSON.stringify(
                    {
                        frequency_penalty: 0,
                        max_tokens: 2048,
                        model: 'gpt-3.5-turbo',
                        presence_penalty: 0,
                        temperature: 0,
                        top_p: 1,
                        messages: [{
                            role: 'assistant',
                            content: query
                        }
                        ]
                    }),
                headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                method: 'POST'
            });

            const jsonResponse = await response.json();

            const result = jsonResponse && jsonResponse.choices && jsonResponse.choices.length > 0
                && jsonResponse.choices[0].message &&
                jsonResponse.choices[0].message.content ? JSON.parse(jsonResponse.choices[0].message.content) : null;

            if (!result || result.length === 0) {
                return words;
            }

            const wordsWithTranslation = words.map(
                (word) => {
                    if (!!word.translation) { return word; }
                    const translationItem = find(result, (item) => item.word === word.title);
                    console.log(translationItem)
                    return { ...word, translation: translationItem ? translationItem.translation : null } as IWordToAnalyze;
                });

            return wordsWithTranslation;
        }
        catch (e) {
            console.error('Error in getTranslationsForWords', e);
        }
    }
```


## PWA 


To aid in my language learning journey, I decided to create a simple flashcards app that I could access easily from my phone. I used a service worker script and PWA solution, which allowed me to create a convenient shortcut on my phone's home screen. The article [Progressive WebApp in SharePoint - the supported way](http://www.msclouddeveloper.com/progressive-webapp-in-sharepoint/) was very helpful in this regard. For full extension code, please see the [GitHub repository](https://github.com/mkm17/pwa-extension).

**manifest.webmanifest file**
``` javascript
{
    "theme_color": "#323c48",
    "background_color": "#323c48",
    "display": "standalone",
    "scope": "/",
    "id":"/sites/LanguageApp/",
    "start_url": "<<LINK TO THE PAGE>>",
    "name": "Language App",
    "short_name": "Lang App",
    "description": "desc",
    "icons": [
        {
            "src": "<<PATH TO THE ICON LIBRARY>>/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "<<PATH TO THE ICON LIBRARY>>/icon-256x256.png",
            "sizes": "256x256",
            "type": "image/png"
        },
        {
            "src": "<<PATH TO THE ICON LIBRARY>>/icon-384x384.png",
            "sizes": "384x384",
            "type": "image/png"
        },
        {
            "src": "<<PATH TO THE ICON LIBRARY>>/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}

**sw.js service worker**
``` javascript

/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'precache-v1';
const CACHE_NAME = 'runtime_v1';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  '/'
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
	console.log('install');

  console.log(PRECACHE_URLS)

  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
	console.log('activate');
  const currentCaches = [PRECACHE, CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            console.log('Serving from cache:', event.request.url);
            return response;
          } else {
            console.log('Fetching from network:', event.request.url);
            return fetch(event.request)
              .then(response => {
                const clonedResponse = response.clone();
                caches.open(CACHE_NAME)
                  .then(cache => {
                    const cacheKey = event.request.url;
                    cache.put(cacheKey, clonedResponse);
                  });
                return response;
              })
              .catch(error => {
                console.error('Failed to fetch from network:', error);
                // Fallback to a custom offline page
                return caches.match('/offline.html');
              });
          }
        })
    );
  });
```

![Mobile Button](../images/languageTool/MobileButton.jpg)

While this solution worked well for the most part, I encountered an issue when trying to use the app offline, such as during longer flights. Despite my efforts, I was unable to create an app that was fully offline-capable. 

![The flashcards app](../images/languageTool/FlashCards.gif)

However, I did find a partial solution that involved rendering the flashcards page first and then caching the necessary requests. This allowed me to view the flashcards without requiring additional requests without Internet connections. 


---

I hope you enjoyed this article and found it useful. If you have any questions or comments, please feel free to reach out to me on [Linkedin](https://www.linkedin.com/in/micha%C5%82-kornet-sharepoint-dev/) .

