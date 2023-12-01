---
layout: post
title:  "Copy Page Sections Extension"
date:   2023-11-22 00:00:00 +0200
tags: [ "SharePoint","SPFx", "Application Customizer"]
image: "/images/fileincidentsscript/fileIncidentsScriptHeader.png"
language: xx
---

# Enhancing SharePoint Online Editing Experience with Application Extension

## Introduction

SharePoint Online is a powerful platform for collaboration and content management, but sometimes users find themselves wishing for additional features to streamline their workflow. In response to this need, together with Olga we have developed the SharePoint Online Application Extension – a solution designed to enhance the editing capabilities of SharePoint pages.

## The Idea Behind the Solution

The inspiration for our solution came from a need identified by my wife. Recognizing the limitations in editing SharePoint pages, we set out to create an application extension that would fill the gaps in functionality. The result is a tool that allows users to copy selected sections with complete web part configurations to a designated list containing information about each section, known as "SectionTemplates." This list includes details such as title, description, icon name, and a JSON-format template.

## Key Features

### 1. Section Copying

Our solution facilitates the copying of sections from two distinct sources:
   - **Global Section List:** Managed by administrators, this global list provides a centralized repository of sections for consistent use across the organization.
   - **Site-specific Section List:** Tailored for users, this list allows site-specific sections to be created, catering to the unique needs of individual teams or projects.

### 2. Efficient Page Creation

By enabling the quick insertion of pre-configured sections, our extension accelerates the page creation process. This not only saves time but also ensures consistency in the layout and structure of SharePoint pages.

### 3. Systematizing Page Development

The Section Templates list serves as a reference point for all available sections, fostering a more organized approach to page development. Users can easily select and implement sections without having to recreate them from scratch.

### 4. Easy way to copy webparts with the whole configuration

The solution allows users to copy webparts with the whole configuration. This feature is especially useful when users want to copy a webpart with a complex configuration, such as a quick links webpart. The solution will copy the webpart with the whole configuration and will add it to the section template list. The webpart will be added to the page with the same configuration as it was in the section template list.

## How It Works

### Creation of Section Template
1. **Select Section:** Users can choose a section from the SharePoint page they are currently editing.
   
   ![Copy Section Button](/images/sectionsExtensions/CopySectionButton.png)

2. **Create Section:** Users can create a new section by adding a title, description, and icon name.
   
   ![Copy Section Form](/images/sectionsExtensions/CopySectionForm.png)

3. **Copy Section JSON Code** Users can copy the JSON code of the selected section to the clipboard. This feature can be used to add items to the global section list.

   ![Copy To Clipboard](/images/sectionsExtensions/CopyToClipboard.png)

### Apply section to page
1. **Add Section:** Users will see the "Add Section" button on the command bar of the SharePoint page when the page is in the edit mode.
   
   ![Add Section Button](/images/sectionsExtensions/AddSectionButton.png)

2. **Select Source:** Users can choose sections from either the global list or the site-specific list based on their requirements.
   
   ![Add Section Panel](/images/sectionsExtensions/AddSectionPanel.png)

3. **Copy to Page:** The chosen section, along with its configuration, is seamlessly copied at the end to the desired SharePoint page. To show the effect the solution will refresh the current page. 

## Sections storage

![SectionTemplatesList](/images/sectionsExtensions/SectionTemplatesList.png)

### Site-specific Section List Configuration

1. The site-specific section list is created automatically when the extension is installed on a site. The list is named "SectionTemplates", provisioning is provided by the standard SPFx extension capabilities.
2. List Contains Information about title, description, icon name, and a JSON-format template.

### Global Section List Configuration

1. The global section list is created manually by the administrator. The list should also be named "SectionTemplates" and have the same structure as the site-specific section list.
2. The global section list web url should be specified in the extension properties.

In both case, the permissions to the lists should be configured by the administrator. By default the lists are created with the same permissions as the site where the lists are created.
We advised that, for the global section list, the administrator should make sure that the users who need to use the extension have only read access to the list. This list should have only sections predefined as verified by content managers on a tenant.

For site-specific section list, the administrator should make sure that the users who need to use the extension have read and write access to the list. Custom level permission to allow people to add sections is recommendable in this case.

#### Remarks

Please remember to wait for the page to be saved before copying the section to the page. Before copying the section to the page, please make sure that the page is saved. Please observe the page command bar for "Your draft has been saved" message.

![Page Draft Saved](/images/sectionsExtensions/PageDraftSaved.png)

Because based on the copy section button position we calculate the section position on the page. If the page is not saved, the section will be added to the end of the page.

For the same reason currently we do not handle the section coping in case when a page is in the mobile view.

## Benefits

- **Time Savings:** Rapid page development with pre-configured sections.
- **Consistency:** Ensure uniformity in page layouts across the organization.
- **User Flexibility:** Empower users with the ability to create site-specific sections tailored to their needs.

## Conclusion

Our SharePoint Online Application Extension is a valuable addition for organizations and users looking to enhance their SharePoint editing experience. By simplifying the process of section creation and providing a systematic approach to page development, this extension contributes to a more efficient and organized SharePoint environment.

To learn more or get started with the SharePoint Online Application Extension, visit [link to your solution].