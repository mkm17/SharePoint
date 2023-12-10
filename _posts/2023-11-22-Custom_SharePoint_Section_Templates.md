---
layout: post
title:  "Custom SharePoint Section Templates"
date:   2023-11-22 00:00:00 +0200
tags: [ "SharePoint","SPFx", "Application Customizer"]
image: "/images/fileincidentsscript/fileIncidentsScriptHeader.png"
language: xx
---

# Enhancing the Editor Experience with Custom Section Templates - the SharePoint Extension

## Introduction

This feature has been developed in association with Olga, the Digital Collaboration consultant and Microsoft expert, privately my wife. She is the originator of the whole concept and the author of the article below, while I am the author of the code. The solution is available on [GitHub...](

SharePoint Online is a powerful platform for collaboration and content management. Microsoft works hard to bring this superb tool to the new era of content creation and information processing with some groundbreaking upgrades on the horizon, like [Copilot in SharePoint](https://www.microsoft.com/en-ww/microsoft-365/roadmap?filters=SharePoint&searchterms=124840), [the brand new brand center](https://www.microsoft.com/en-ww/microsoft-365/roadmap?filters=SharePoint&searchterms=124838), or [simultaneous co-authoring on SharePoint pages](https://www.microsoft.com/en-ww/microsoft-365/roadmap?filters=SharePoint&searchterms=124853), just to name a few. Even though other enhancements and extra features are delivered to SharePoint Online on a quite regular basis lately, content creators still find themselves wishing for additional, key to their daily business functions.

One of frequently encountered pain points is certainly a lack of customizable page section templates. To respond to this popular need, together, we have developed a concept of the SharePoint Online extension – the Custom Section Templates solution designed to enhance the editing capabilities of SharePoint pages.

## The idea behind the solution

The direct inspiration for developing the solution came from the project I have coordinated lately. A large company builds its SharePoint-based  intranet platform mostly from scratch. With the strict policy regarding applying elements supporting the company visual identity and strong focus on providing coherent and high-quality end-user experience, a team of specialists projects a set of page templates to be distributed globally. This is a popular approach to keep the cohesive layouts but with the growing number of such templates and their variants, the need for more flexibility in the page creation process becomes more and more apparent. The solution we have developed is a response to this need.

Of course, SharePoint Online natively has the feature for page section templates. In principle, these are essentially just what we need - pre-built sections that are already broken into columns and filled in with certain web parts. What a shame that this feature is not customizable and allows to choose from only 6 (six!) options available, built only with the Text and Image web parts.

Recognizing the limitations in editing SharePoint pages, we set out to create the application extension that would fill the gaps in the functionality. The result is a flexible tool that allows users to save already deployed sections with exact web part configurations and place them on any pages. The section templates can be also pre-prepared by SharePoint admins and released globally in a form of the section library. A designated SharePoint list constitutes a simple yet effective storage for the code used for retrieving the same layouts.

## Key features

### 1.Duplication of sections

Our solution facilitates recreating predefined section templates from two distinct sources:

   - **Site-specific Section List:** Tailored by site owners and editors, allows for defining site-specific section templates that cater to the unique needs of individual teams or projects.
   - **Global Section List:** Managed by administrators, this global list provides a centralized repository of sections for consistent use across the organization.

### 2. Efficient page creation

By enabling the quick insertion of pre-configured sections, our extension accelerates the page creation process. This not only saves time but also ensures consistency in the layout and structure of SharePoint pages, keeping it in line with the globally applied guidelines.

### 3. Systematized page development

The Section Templates lists serve as a reference point for building cohesive page structures based on repetitive section arrangements. This way, users can easily select and implement sections as major 'building blocks' on their page, simultaneously fostering a company-steered approach to consistent page development.

### 4. Easy way to copy web parts with specific configuration

The solution allows to copy sections with embedded web parts, keeping their whole initial configuration. This feature is especially useful when users want to copy a web part with complex or time-consuming configuration, such as the Quick Links web part. Here, the whole configuration is saved in the code and thus you can place the exact copy of some web part to another page by adding the whole copied section and removing the redundant parts.

## The process of creating and applying section templates

### Create a section template
1. **Select a section:** Go to your SharePoint page, turn the Edit mode on, select any section you would like to save and click the "Save Section" button on the command bar of the section, in the left part of the screen.
   
   ![Copy Section Button](/images/sectionsExtensions/CopySectionButton.png)

   If any change has been applied to the page structure, save your changes and activate the Edit mode again or wait for the page to be saved automatically before copying the section to the page. Otherwise, the calculated position of the section will be faulty and influence the scope of the saved template. For the same reason, we do not currently handle this activity in the mobile view.

2. **Save the selected section:** Create a new section template by adding a title (required), description, and icon name.
   
   ![Copy Section Form](/images/sectionsExtensions/CopySectionForm.png)

3. **Copy the JSON code** Optionally, copy the JSON code of the selected section to the clipboard. This feature can be used to add items to the global Section List or peek the elements within.

   ![Copy To Clipboard](/images/sectionsExtensions/CopyToClipboard.png)

### Apply the template to another page
1. **Add a section:** On the target (same or another) page, when in the Edit mode, editor can see the new "Add Section" button on the upper bar, next to the 'Save as draft', 'Undo', 'Discard changes', and the other options natively available in the page creation process.
   
   ![Add Section Button](/images/sectionsExtensions/AddSectionButton.png)

2. **Select the data source:** Pick the source of the template you would like to use - whether it is the global Section List with templates specified by the admin or the site-specific list based on your local requirements.
   
   ![Add Section Panel](/images/sectionsExtensions/AddSectionPanel.png)

3. **Add to the page:** The chosen section with columns and web parts, along with their granular configuration, is seamlessly attached at the end of the target SharePoint page. To show the final effect, the solution will refresh the current page automatically. 

## Storing options for section templates

![SectionTemplatesList](/images/sectionsExtensions/SectionTemplatesList.png)


### Site-specific SectionTemplates list

1. The site-level list is created automatically when the custom extension is installed on a site. The provisioning of the "SectionTemplates" list is provided by the standard capabilities of the SPFx extension.
2. The list items contain information about the template title, description, icon name, and a JSON-format template.

### Global SectionTemplates list

1. The global section list is created manually by the SharePoint administrator. The "SectionTemplates" list should and have the same structure as the site-specific section list.
2. The web URL of the global section list should be specified in the extension properties to correctly pull the range of templates available to choose from.

### Permissions

In the both cases, the permissions to the lists should be configured by the administrator. By default, the site-specific lists are created with the same permissions as the site where they are created. All the editors who need to use the extension should have at least permissions to view and add list items.

For the global section list, it is advisable to grant the read-only access to all the users in order to let them apply the templates to their sites. Make sure that the globally applied section templates take advantage of the commonly accessible web parts and their configuration does not use any site-specific elements.

## Conclusion

Our SharePoint Online extension to create custom page section templates is a valuable addition for organizations and users looking to enhance their SharePoint editing experience. By simplifying the process of section creation and providing a systematic approach to page development, this extension contributes to a more efficient and organized SharePoint environment.

To learn more or get started with the SharePoint Online Application Extension, visit [our Github profile...]().