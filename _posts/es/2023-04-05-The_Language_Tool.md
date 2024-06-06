---
layout: postES
title:  "Mi Plataforma de Aprendizaje de Idiomas"
date:   2023-04-05 00:00:00 +0200
tags: ["SharePoint", "SPFx", "OfficeJS", "MS Word", "OpenAI", "ChatGPT" ]
image: "/images/languageTool/header.png"
language: es
permalink: /2023/04/05/es/The_Language_tool.html
---

1. [Introducción](#introducción)
2. [Descripción de los Componentes Utilizados](#descripción-de-los-componentes-utilizados)
3. [Aplicación de MS Word](#aplicación-de-ms-word)
4. [Conexión a los Servicios de Idiomas](#conexión-a-los-servicios-de-idiomas)
5. [Aplicación PWA](#la-aplicación-pwa)

## Introducción

Hace algún tiempo, me propuse el objetivo de aprender nuevos idiomas, reconociendo que tener conocimientos básicos del idioma nativo de cualquier país visitado hace que todo el viaje sea una experiencia verdaderamente única. Para estas habilidades de comunicación, adquirir un vocabulario fundamental y comprender las reglas gramaticales es esencial.

Comencé mi viaje de aprendizaje de idiomas hace muchos años utilizando aplicaciones populares de idiomas para aprender español. Si bien estas aplicaciones son un buen punto de partida, me di cuenta de que me faltaba cierto rango de vocabulario, lo que dificultaba mi capacidad de tener conversaciones básicas en el día a día.

Para remediar esto, decidí centrarme en familiarizarme primero con las palabras más comunes (por ejemplo, un conjunto de las 1000 palabras más populares) antes de adentrarme en un vocabulario más avanzado. Si bien existen muchos glosarios disponibles en línea, descubrí que crear mi propia lista personalizada de palabras que utilizo a diario podría ser mucho más efectivo. Todos tenemos nuestras propias estructuras de lenguaje que nos hacen únicos y nos permiten abordar los temas que más nos interesan.

Esta idea me inspiró a crear una aplicación de diario que analiza mis textos para identificar palabras incorrectas que luego se almacenan en mi base de datos personal. De esta manera, puedo aprender de forma regular y hacer un seguimiento de mi progreso en el dominio de nuevas palabras en un idioma extranjero. Al centrarme primero en las palabras más comunes y crear textos cada vez más complicados con el tiempo, mi vocabulario se expande rápidamente y mis habilidades lingüísticas en general mejoran visualmente.

En la herramienta, puedes practicar escribir textos completos en cualquier idioma elegible y completar cualquier expresión desconocida con palabras o frases del otro idioma, ¡incluso el tuyo nativo! La herramienta analiza la entrada y sugiere correcciones para palabras individuales, así como para todo el texto. Además, se pueden agregar nuevas palabras a un diccionario personal para revisarlas más tarde.

![La Herramienta de idiomas](/images/languageTool/AppPresentation.gif)
[Enlace a la Solución](https://github.com/mkm17/sp-language-diary)

## Descripción de los Componentes Utilizados

Con un plan claro en mente, me propuse explorar los servicios ofrecidos por Microsoft 365. Comencé con la **aplicación de Office JS** para **MS Word** y **la aplicación SPFx**.

Dado que la solución no requería una base de datos sofisticada, decidí almacenar mis datos en una **lista de SharePoint** en mi sitio de arrendatario. Siguiendo este enfoque, pude recopilar y acceder a mis datos sin necesidad de invertir mucho tiempo y esfuerzo en configurar un sistema complejo.

![La lista de origen](/images/languageTool/sourceList.jpg)

## Aplicación de MS Word 

Durante mi investigación, descubrí que si bien había una [aplicación SPFx disponible para MS Outlook](https://www.youtube.com/watch?v=46J3SVzZem8), no existía para otras aplicaciones de MS Office. Sin embargo, después de una investigación adicional, encontré otra solución que me permitiría mostrar una página de SharePoint con una parte web SPFx mediante la carga lateral de soluciones de Office JS.

Así, siguiendo los pasos que se enumeran a continuación, pude integrar con éxito la aplicación SPFx en varias herramientas de la suite de Microsoft Office.

Para usar la aplicación de SharePoint SPFx en MS Word, debes:

### 1. Configurar el Manifiesto
Reemplaza TENANT_NAME por el nombre de tu arrendatario.
Reemplaza PAGE_URL por la URL de tu página (/sites/SiteName/SitePages/Test.aspx)
Reemplaza ICONS_LIBRARY por una URL a la biblioteca de iconos (sites/SiteName/Shared%20Documents)

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

### 2. Agregar el script de OfficeJS a la solución SPFx

``` javascript

protected async onInit(): Promise<void> {

{...}

await SPComponentLoader.loadScript('https://appsforoffice.microsoft.com/lib/1/hosted/office.js', { globalExportsName: 'Office' })

{...}
  
}

```

### 3. Instalar Typings en la solución SPFx

npm i -save-dev @types/office-js to the solution

### 4. Agregar el Manifiesto del complemento al App Catalog

![App Catalog for Office Apps](/images/languageTool/AppCatalog.jpg)

### 5. Agregar el elemento web SPFx a cualquier página con el diseño SingleApp

Actualice el valor de PAGE_URL en el archivo de manifiesto con la URL de la página donde agregó el web part.

## Conexión a los servicios de idiomas

Al seleccionar una plataforma principal para llevar a cabo mi proyecto de aprendizaje de idiomas, elegí **MS Word** debido a su funcionalidad nativa de verificación de idioma. Esta característica resalta automáticamente cualquier palabra incorrecta, agregando una clase adicional (*SpellingErrorV2Themed*) que me facilitó la tarea de obtener una lista de elementos con esta clase utilizando una función de OfficeJS [body.getHtml()](https://learn.microsoft.com/en-us/javascript/api/word/word.body?view=word-js-preview#word-word-body-gethtml-member(1)) . 

Sin embargo, me encontré con un obstáculo cuando este método [dejó de funcionar](https://github.com/OfficeDev/office-js/issues/2898#issuecomment-1279839683) en una nueva versión. A pesar de intentar otros servicios, no pude encontrar una solución satisfactoria, hasta que descubrí **OpenAI**.

Con esta poderosa herramienta, pude detectar palabras incorrectas, recibir sugerencias para corregirlas e incluso obtener sugerencias para todo el texto introducido. Además, pude utilizar la misma herramienta para obtener traducciones de palabras seleccionadas.

En ambos casos, la misma consulta devuelve un resultado en un formato JSON estable. Afortunadamente, OpenAI maneja bien este tipo de solicitudes. Siéntete libre de probar tus propias consultas [aquí](https://platform.openai.com/playground). Lo importante es utilizar la sintaxis correcta de los resultados. Para lograr esto, utilicé el siguiente texto al final de la consulta: 
*`how result in JSON format {incorrect_words:[ x:{ 'text', suggestions: []}], suggested_correction:'text' }`*.

Para obtener la apiKey, debes crear una cuenta en el sitio web de OpenAI y crear una nueva en la [página](https://platform.openai.com/account/api-keys).
![Clave de API de OpenAI](/images/languageTool/getOpenAIApiKey.png)

### Consulta de palabras incorrectas
En el código, reemplazo la propiedad *language* con el nombre del idioma utilizado y la propiedad *text* con el texto escrito en el documento de Word.
`find incorrect ${language} words, find maximum 3 suggestions for them, show result in JSON format {incorrect_words:[ x:{ 'text', suggestions: []}], suggested_correction:'text' }, without any additional data: ${text}`

![Consulta de palabras](/images/languageTool/getWordsQuery.jpg)

### Consulta de traducciones
Además, la propiedad *wordsToTranslate* se reemplaza con las palabras seleccionadas separadas por comas.
`get translations from Portuguese to English for words in json format [{"word":"","translation":""}]: ${wordsToTranslate}`

![Obtener traducciones](/images/languageTool/getTranslations.jpg)

Utilice el siguiente código para conectarme a la API de OpenAI, obtener sugerencias y texto corregido.

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
            console.error('Error in checkSpelling', e);
        }
    }
```

Utilicé el siguiente código para conectarme a la API de OpenAI y obtener traducciones para las palabras seleccionadas.

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
                    return { ...word, translation: translationItem ? translationItem.translation : null } as IWordToAnalyze;
                });

            return wordsWithTranslation;
        }
        catch (e) {
            console.error('Error in getTranslationsForWords', e);
        }
    }
```


## La aplicación PWA

Como ayuda adicional en mi proceso de aprendizaje de idiomas, decidí crear una aplicación simple de tarjetas de vocabulario a la que pudiera acceder fácilmente mi teléfono. Utilicé un script service worker y la solución de PWA, lo que me permitió crear un acceso directo conveniente en la pantalla de inicio del móvil. El artículo [Progressive WebApp en SharePoint - la forma compatible](http://www.msclouddeveloper.com/progressive-webapp-in-sharepoint/) fue de gran ayuda en este sentido. Para ver el código completo de la extensión, consulta el [repositorio de GitHub](https://github.com/mkm17/pwa-extension).


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
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
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
            return response;
          } else {
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

<img src="/images/languageTool/MobileButton.jpg" alt= "Mobile Button"  height="560">

Si bien esta solución funcionó bastante bien, encontré un problema al intentar usar la aplicación sin conexión y en modo avión.

![La aplicación de tarjetas de memoria](/images/languageTool/FlashCards.gif)

Hasta ahora, solo he encontrado una solución parcial para este caso, que implica renderizar primero la página de tarjetas de memoria y luego almacenar en caché todas las solicitudes necesarias. Esto me permite ver las tarjetas de memoria sin necesidad de realizar solicitudes adicionales que requieran conexión a Internet.


---

Espero que hayas disfrutado este artículo y que te haya sido útil para tu caso. Si tienes alguna pregunta o comentario, no dudes en contactarme en [LinkedIn](https://www.linkedin.com/in/micha%C5%82-kornet-sharepoint-dev/).

