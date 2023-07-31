---
layout: post
title:  "Unique Permissions SPFx Extension"
date:   2023-07-30 00:00:00 +0200
tags: [ "SharePoint", "SPFx", "Field Customizer"]
image: "/images/uniquePermissions/uniquePermissionsHeader.png"
language: en
---

### Table of Contents
- **[Concept](#1-concept)**
- **[Functionalities](#2-functionalities)**
- **[Installation and configuration](#3-installation-and-configuration)**

## Concept

In my experience, I have encountered several situations where I struggled to handle items or documents with unique permissions. Unfortunately, there is currently no direct method to check this information from the list view. Going through each item individually could be a cumbersome and frustrating experience. While one option is to generate a report with data about the permissions, it adds complexity by using a different tool outside SharePoint.

This challenge pushed me to explore possibilities for a more efficient solution. I started by creating a simple field customizer that displays unique permissions for items. As I progressed, I added new functionalities, culminating in the development of a sample unique permissions field customizer.

With this customizer, you can now easily view and manage unique permissions right from the list view, streamlining the process and enhancing the user experience. No longer will you need to navigate through multiple interfaces or generate separate reports. This customizer simplifies the task of handling items or documents with unique permissions, making it a valuable addition to your workflow.


## Functionalities

The solution allows an easy way to manage unique permissions on list items. It provides a field customizer that can be used to display a current user's permissions, information about the uniqueness of permissions for an item, and also a bunch of useful options that are easily accessible from the column.


![react-field-unique-permissions](/images/uniquePermissions/checkUserPermission.gif)
<br />
<br />

All users will see icons which indicate the uniqueness of permissions for an item and current user permissions (currently, we recognize Read, Edit, and Manage permissions).

<br />
#### **Show items with unique permissions**

![unique-permissions](/images/uniquePermissions/uniquePermissions.png)

<br />
#### **Show current user permissions**

![current-user-permissions](/images/uniquePermissions/currentUserPermissions.png)

<br />
#### **Show chosen user permissions**

To show chosen user permissions, you need to click on the icon at the top of the ribbon and choose the user's name. Then, all items will be refreshed, and you will see the chosen user's permissions

![check-user-permissions](/images/uniquePermissions/checkUserPermission.gif)


<br />
#### **Manage item permissions from field customiser**

A user with manage permissions can also do some activities directly from the item column. The solution provides a simple interface to reset role inheritance or a direct link to permissions details

![manage-permissions](/images/uniquePermissions/managePermissions.png)


### Installation and configuration
   
You can find the solution in my [GitHub repository.](https://github.com/mkm17/sp-dev-fx-extensions/tree/react-field-unique-permissions/samples/react-field-unique-permissions) Inside, you will find more information about the extension's installation.