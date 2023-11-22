---
layout: postES
title:  "Informe de Incidentes de Archivos de SharePoint - Script de PowerShell"
date:   2024-09-20 00:00:00 +0200
tags: [ "SharePoint", "PowerShell"]
image: "/images/fileincidentsscript/fileIncidentsScriptHeader.png"
language: es
permalink: /2023/07/30/es/Report_of_SharePoint_Files_Incidents.html
---

# Informe de Incidentes de Archivos de SharePoint - Script de PowerShell

Hace algún tiempo, tuve una conversación con mi amigo sobre los problemas que comúnmente enfrentan los usuarios no técnicos de SharePoint. Descubrimos que muchos de estos problemas están vinculados a las bibliotecas de documentos y la colaboración en archivos. A veces, las acciones individuales pueden causar problemas para los equipos que trabajan juntos. Dado que los errores humanos pueden ocurrir y ocurrirán, es vital responder rápidamente cuando algo sale mal. Como resultado de nuestra discusión, me embarqué en un proyecto para crear un script que ayude a encontrar y solucionar problemas con archivos en SharePoint.

Este script está creado utilizando PowerShell y hace uso de la biblioteca **PnP PowerShell**, que es una herramienta muy útil para gestionar entornos de SharePoint.

Para recopilar la información necesaria, inicialmente utilicé la **versión estándar de SharePoint**. Sin embargo, me di cuenta de que ciertos detalles cruciales, como los cambios en los nombres de archivos, estaban ausentes en los datos de versionamiento. Aunque todas las versiones conservaban el nombre final del archivo, necesitaba una visión más completa. Por lo tanto, incorporé el punto final de **actividades**, accesible a través de la **API REST de SharePoint versión 2**. Este punto final no solo completa la información faltante sobre los cambios de nombre de archivos, sino que también ofrece información valiosa sobre la historia del archivo.

## Uso del Punto Final de Actividades

Para acceder a información detallada sobre las actividades de archivos, utilizamos el punto final de **actividades**. Este punto final es accesible a través de la [**API REST de SharePoint versión 2**](https://learn.microsoft.com/en-us/sharepoint/dev/apis/sharepoint-rest-graph), que sirve como una puerta de enlace a MS Graph. Para recuperar las actividades de archivos, necesitamos una URL en el formato de OneDrive. Para obtener esta URL, podemos enviar una solicitud POST al punto final de **GetSharingInformation**. La respuesta incluirá algunas propiedades como itemUrl, que podemos utilizar para acceder a las actividades de archivos.

Una vez que tenemos la URL correcta, podemos realizar una solicitud **GET** al [punto final de actividades](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/api/activities_list?view=odsp-graph-online). Esto se puede hacer utilizando el comando *Invoke-PnPSPRestMethod*, como se muestra en el ejemplo a continuación. El [tipo de recurso **action**](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/resources/itemactivity?view=odsp-graph-online) proporciona detalles sobre la actividad. Por ejemplo, en el caso de un **cambio de nombre** de archivo, la propiedad de acción mostrará el nombre antiguo, así como la hora y el actor.

```powershell
    # Obtener solo itemUrl en formato de SharePoint api 2.0 desde la información de uso compartido del archivo
    $requestUrl = "$SiteUrl/_api/web/Lists('$documentLibraryId')/GetItemById('$fileId')/GetSharingInformation?%24select=itemUrl"
    $sharingInformation = Invoke-PnPSPRestMethod -Url $requestUrl -Method Post -Accept "application/json" -Content "{}"

    # Obtener las actividades del archivo desde la SharePoint api 2.0
    $itemUrl = $sharingInformation.itemUrl
    $activities = Invoke-PnPSPRestMethod -Url "$itemUrl/activities" -Accept "application/json"

```

## Datos incluidos en el informe

He configurado el script para identificar los siguientes eventos:

- Cambio de nombre de un archivo
- Restaurar un archivo de la papelera de reciclaje
- Compartir un archivo con alguien
- Reducción del tamaño de un archivo en más del 50%
- Mover un archivo dentro de la biblioteca
- Desmarcar un archivo

Además, he añadido funciones para realizar un seguimiento de la lista de personas que editan cada archivo y exportar la lista completa de editores en la biblioteca. Esto nos permite identificar usuarios que no deberían tener derechos de edición o aquellos que editaron archivos solo ocasionalmente y luego dejaron de hacerlo. Al prestar atención a estos factores, el script ayuda a mantener un entorno colaborativo más seguro y eficiente.


## Resultado del script

El resultado del script son dos archivos CSV. El primero contiene información sobre los incidentes, y el segundo contiene información sobre los editores.

![resultado](/images/fileincidentsscript/fileIncidentsScriptResult.png)


## El propio script


```powershell

# Utiliza tus variables
$targetSiteUrl = "https://contoso.sharepoint.com/sites/siteExample"
$libraryName = "Documents"

$editors = New-Object PSObject

function Get-DocumentLibrary {
    param (
        [string]$SiteUrl,
        [string]$LibraryName
    )

    $documentLibrary = Get-PnPList -Identity $LibraryName
    if ($documentLibrary.BaseTemplate -ne [Microsoft.SharePoint.Client.ListTemplateType]::DocumentLibrary) {
        Write-Host "La lista no es una biblioteca de documentos"
        return $null
    }

    return $documentLibrary
}

function Get-IsFolder {
    param (
        [Microsoft.SharePoint.Client.ListItem]$document
    )

    $fsObjType = $document.FieldValues["FSObjType"]

    return $fsObjType -eq 1
}

function Get-IncidentObject {
    param (
        [Microsoft.SharePoint.Client.ListItem]$document
    )

    $fileName = $document.FieldValues["FileLeafRef"]
    $fileId = $document.FieldValues["ID"]
    $fileType = $document.FieldValues["File_x0020_Type"]
    $fileSize = $document.FieldValues["File_x0020_Size"]
    $createdBy = $document.FieldValues["Created_x0020_By"]
    $createdDate = $document.FieldValues["Created_x0020_Date"]
    $modifiedBy = $document.FieldValues["Modified_x0020_By"]
    $modifiedDate = $document.FieldValues["Last_x0020_Modified"]

    $documentMetadata = [PSCustomObject]@{
        FileName     = $fileName
        FileId       = $fileId
        FileType     = $fileType
        FileSize     = $fileSize
        CreatedBy    = $createdBy
        CreatedDate  = $createdDate
        ModifiedBy   = $modifiedBy
        ModifiedDate = $modifiedDate
    }

    return $documentMetadata
}

function Get-ClonedPSCustomObject {
    param (
        [Parameter(Mandatory)]
        [PSCustomObject]$object
    )
    $newObject = New-Object PSObject
    $object.PSObject.Properties | ForEach-Object {
        $newObject | Add-Member -MemberType $_.MemberType -Name $_.Name -Value $_.Value
    }
    return $newObject
}

function Get-FileActivitiesIncidents {
    param (
        [string]$SiteUrl,
        [string]$documentLibraryId,
        [string]$fileId,
        [PSCustomObject]$incidentObj
    )

    # Obtén solo itemUrl en el formato de la api 2.0 de SharePoint a partir de la información de uso compartido del archivo
    $requestUrl = "$SiteUrl/_api/web/Lists('$documentLibraryId')/GetItemById('$fileId')/GetSharingInformation?%24select=itemUrl"
    $sharingInformation = Invoke-PnPSPRestMethod -Url $requestUrl -Method Post -Accept "application/json" -Content "{}"

    # Obtén las actividades del archivo desde la api 2.0 de SharePoint
    $itemUrl = $sharingInformation.itemUrl
    $activities = Invoke-PnPSPRestMethod -Url "$itemUrl/activities" -Accept "application/json"

    $incidents = @()

    $activities.value | ForEach-Object {
        $activity = $_
        $isRename = $activity.action."rename"
        $isShare = $activity.action."share"
        $isMoved = $activity.action."move"
        $isRestored = $activity.action."restore"

        $incidentToAdd = Get-ClonedPSCustomObject -object $incidentObj

        $editor = $activity.actor.user.userPrincipalName
        IncrementEditor -key $editor

        $incidentToAdd | Add-Member -MemberType NoteProperty -Name "Who" -Value $editor
        $incidentToAdd | Add-Member -MemberType NoteProperty -Name "When" -Value $activity.times.recordedTime

        if ($isRename) {
            $incidentToAdd | Add-Member -MemberType NoteProperty -Name "Incident" -Value "El nombre del archivo ha sido cambiado"
            $incidentToAdd | Add-Member -MemberType NoteProperty -Name "ValueBefore" -Value $isRename.oldName
            $incidentToAdd | Add-Member -MemberType NoteProperty -Name "ValueAfter" -Value ""
            $incidents += $incidentToAdd
        }

        if ($isMoved) {
            $incidentToAdd | Add-Member -MemberType NoteProperty -Name "Incident" -Value "El archivo ha sido movido"
            $incidentToAdd | Add-Member -MemberType NoteProperty -Name "ValueBefore" -Value $isMoved.From
            $incidentToAdd | Add-Member -MemberType NoteProperty -Name "ValueAfter" -Value ""
            $incidents += $incidentToAdd
        }

        if ($isShare) {
            $formattedRecipients = $isShare.recipients | ForEach-Object {
                $_.user.userPrincipalName
            }

            $incidentToAdd | Add-Member -MemberType NoteProperty -Name "Incident" -Value "El archivo ha sido compartido"
            $incidentToAdd | Add-Member -MemberType NoteProperty -Name "ValueBefore" -Value ""
            $incidentToAdd | Add-Member -MemberType NoteProperty -Name "ValueAfter" -Value $formattedRecipients
            $incidents += $incidentToAdd
        }

        if ($isRestored) {
            $incidentToAdd | Add-Member -MemberType NoteProperty -Name "Incident" -Value "El archivo ha sido restaurado"
            $incidentToAdd | Add-Member -MemberType NoteProperty -Name "ValueBefore" -Value ""
            $incidentToAdd | Add-Member -MemberType NoteProperty -Name "ValueAfter" -Value ""
            $incidents += $incidentToAdd
        }
    }

    return $incidents
}

function IncrementEditor {
    param (
        [Parameter(Mandatory)]
        [string]$key
    )

    if ($editors.PSObject.Properties[$key]) {
        $editors.$key += 1
    }
    else {
        $editors | Add-Member -MemberType NoteProperty -Name $key -Value 1
    }
}

function Get-FileIsCheckedOut {
    param (
        [Parameter(Mandatory)]
        [Microsoft.SharePoint.Client.ListItem]$item,

        [Parameter(Mandatory)]
        [PSCustomObject]$incidentObj
    )

    $fileIsCheckedOut = $item.FieldValues["CheckoutUser"]
    if ($fileIsCheckedOut) {
        $incidentObj | Add-Member -MemberType NoteProperty -Name "Incident" -Value "El archivo está marcado como verificado"
        $incidentObj | Add-Member -MemberType NoteProperty -Name "ValueBefore" -Value ""
        $incidentObj | Add-Member -MemberType NoteProperty -Name "ValueAfter" -Value $fileIsCheckedOut.Email
        return $incidentObj
    }
}

function Get-FileSizeHasDecreasedByMoreThan50Percent {
    param (
        [Parameter(Mandatory)]
        [Microsoft.SharePoint.Client.ClientObject]$version1,

        [Parameter(Mandatory)]
        [Microsoft.SharePoint.Client.ClientObject]$version2,

        [Parameter(Mandatory)]
        [string]$modifiedBy,

        [Parameter(Mandatory)]
        [string]$actionModifiedDate,

        [Parameter(Mandatory)]
        [PSCustomObject]$incidentObj
    )
    $fileSize1 = $version1.Length
    $fileSize2 = $version2.Length

    if ($fileSize1 -gt $fileSize2) {
        $fileSizeDecrease = $fileSize1 - $fileSize2
        $fileSizeDecreasePercentage = $fileSizeDecrease / $fileSize1

        if ($fileSizeDecreasePercentage -gt 0.5) {

            $incidentObj | Add-Member -MemberType NoteProperty -Name "Incident" -Value "El tamaño del archivo ha disminuido en más del 50%"
            $incidentObj | Add-Member -MemberType NoteProperty -Name "ValueBefore" -Value $fileSize2
            $incidentObj | Add-Member -MemberType NoteProperty -Name "ValueAfter" -Value $fileSize1
    
            return $incidentObj      
        }
    }
}

function Get-EditorIncident {
    param (
        [Parameter(Mandatory = $true)]
        [PSCustomObject]$editorsIncident,

        [Parameter(Mandatory = $true)]
        [string]$fileEditors
    )

    $editorsIncident | Add-Member -MemberType NoteProperty -Name "Who" -Value $fileEditors
    $editorsIncident | Add-Member -MemberType NoteProperty -Name "When" -Value ""
    $editorsIncident | Add-Member -MemberType NoteProperty -Name "Incident" -Value "Editores de archivo"
    $editorsIncident | Add-Member -MemberType NoteProperty -Name "ValueBefore" -Value ""
    $editorsIncident | Add-Member -MemberType NoteProperty -Name "ValueAfter" -Value ""
    return $editorsIncident
}

function Get-DocumentVersionsIncidents {
    param (
        [System.Collections.Generic.List[Microsoft.SharePoint.Client.ListItemVersion]]$documentVersions,
        [Microsoft.SharePoint.Client.ListItem]$document,
        [Microsoft.SharePoint.Client.File]$documentFile,
        [PSCustomObject]$incidentObj
    )

    $previousVersion = $null
    $previousFileVersion = $null
    $incidents = @()
    
    # Lista de editores para el archivo, el creador es el primer editor
    $creator = $document.FieldValues["Created_x0020_By"].Replace("i:0#.f|membership|", "") 
    $fileEditors = $creator + ";"
    IncrementEditor -key $creator

    for ($versionIndex = 0; $versionIndex -lt $documentVersions.Count; $versionIndex++) {
        $version = $documentVersions[$versionIndex]
        $incidentToAdd = Get-ClonedPSCustomObject -object $incidentObj

        # Por alguna razón, la primera versión no tiene la propiedad FileVersion, así que la tomamos del documentFile
        if ($versionIndex -eq 0) {
            $fileVersion = $documentFile
        }
        else {
            $fileVersion = Get-PnPProperty -ClientObject $version -Property FileVersion
        }

        # en los siguientes pasos comparamos dos versiones del archivo, así que necesitamos omitir la primera versión
        if ($null -eq $previousVersion) {
            $previousVersion = $version
            $previousFileVersion = $fileVersion
            continue
        }

        $editor = $version.FieldValues["Modified_x0020_By"].Replace("i:0#.f|membership|", "")
        $fileEditors += $editor + ";"
        IncrementEditor -key $editor
        
        $incidentToAdd | Add-Member -MemberType NoteProperty -Name "Who" -Value $editor
        $incidentToAdd | Add-Member -MemberType NoteProperty -Name "When" -Value $version.FieldValues["Last_x0020_Modified"] 

        $fileIsCheckoutIncident = Get-ClonedPSCustomObject -object $incidentToAdd
        $fileIsCheckedOut = Get-FileIsCheckedOut -item $document -incidentObj $fileIsCheckoutIncident
        if ($fileIsCheckedOut) {
            $incidents += $fileIsCheckedOut
        }

        $fileSizeHasDecreasedIncident = Get-ClonedPSCustomObject -object $incidentToAdd
        $fileSizeHasDecreased = Get-FileSizeHasDecreasedByMoreThan50Percent -version1 $fileVersion -version2 $previousFileVersion -modifiedBy $version.FieldValues["Modified_x0020_By"] -actionModifiedDate $version.FieldValues["Last_x0020_Modified"] -incidentObj  $fileSizeHasDecreasedIncident

        if ($fileSizeHasDecreased) {
            $incidents += $fileSizeHasDecreased
        }

        $previousVersion = $version
        $previousFileVersion = $fileVersion
    }

    # Para cada archivo, añadir un incidente con todos los editores
    $editorsIncident = Get-ClonedPSCustomObject -object $incidentObj
    $incidents += Get-EditorIncident -editorsIncident $editorsIncident -fileEditors $fileEditors

    return $incidents
}

function Get-CSVDataFromEditorsObject {
    $csvData = @()
    $keys = $editors.PSObject.Properties | ForEach-Object { $_.Name }

    # Añadir pares clave-valor a los datos CSV
    foreach ($key in $keys) {
        $csvData += [PSCustomObject]@{
            Name       = $key
            Activities = $editors.$key
        }
    }

    return $csvData
}

function CheckFiles {
    param(
        [Parameter(Mandatory)]
        [ValidateNotNullOrEmpty()]
        [string]$SiteUrl,

        [Parameter(Mandatory)]
        [ValidateNotNullOrEmpty()]
        [string]$LibraryName,

        [Parameter]
        [string]$Date
    )

    try {
        Connect-PnPOnline -Url $SiteUrl -Interactive

        # Obtener la biblioteca de documentos
        $documentLibrary = Get-DocumentLibrary -SiteUrl $SiteUrl -LibraryName $LibraryName
    
        # Si la lista no es una biblioteca de documentos, regresar
        if (-not $documentLibrary) { return }
    
        $documents = Get-PnPListItem -List $LibraryName -Fields "FileLeafRef", "ID", "File_x0020_Type", "File_x0020_Size", "Created_x0020_By", "Created_x0020_Date", "Modified_x0020_By", "Last_x0020_Modified", "CheckoutUser", "Versions", "File"
        $incidents = @()

        # Recorrer todos los documentos en la biblioteca
        foreach ($document in $documents) {

            # Si el elemento es una carpeta, omitirlo
            if (Get-IsFolder -document $document) { continue; }

            $documentVersions = Get-PnPProperty -ClientObject $document -Property Versions
            $documentFile = Get-PnPProperty -ClientObject $document -Property File
    
            # Obtener un objeto de incidente vacío
            $incidentObj = Get-IncidentObject -document $document

            # Obtener los incidentes para las actividades del archivo - SharePoint api 2.0
            $incidents += Get-FileActivitiesIncidents -SiteUrl $SiteUrl -documentLibraryId $documentLibrary.Id -fileId $document.Id -incidentObj $incidentObj 

            # Obtener los incidentes para las versiones del archivo
            $incidents += Get-DocumentVersionsIncidents -document $document -documentVersions $documentVersions -documentFile $documentFile -incidentObj $incidentObj
        }

        # Exportar los incidentes a un archivo CSV
        $incidents | Export-Csv -Path "$PSScriptRoot/informe.csv" -NoTypeInformation
        
        # Exportar los editores a un archivo CSV
        $csvEditorsData = Get-CSVDataFromEditorsObject
        $csvEditorsData | Export-Csv -Path "$PSScriptRoot/editores.csv" -NoTypeInformation

        Disconnect-PnPOnline
    }
    catch {
        Write-Host $_.Exception.Message
    }
}

CheckFiles -SiteUrl $targetSiteUrl -LibraryName $libraryName

```


