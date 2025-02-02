---
layout: post
title:  "Get All Parent Flows which use a specific Child Flow"
date:   2025-02-05 00:00:00 +0200
tags: ["Power Automate"]
image: "/images/getAllParentFlows/header.png"
language: en
---

Recently, I was involved in a project where I had to make a change to a solution's flows. As the solution was quite complex, including many flows and Parent-Child relationships, I needed to find all Parent Flows that use a specific Child Flow.

![Parent Flow](/images/getAllParentFlows/parentFlow.png)

Of course, in this case, we could manually go through all flows and check each one, but that would be very time-consuming. So, I decided to find a way to automate this process.

Since the CLI for M365 provides many flow-related commands, I decided to use this tool.

The following script will help you find all Parent Flows that use a specific Child Flow.

Please note that I am using flow commands without the `--asAdmin` parameter, so you need to have access to all flows where the "Run a Child Flow" action is potentially used.

To get a list of flows, you need to find the environment ID and the Child Flow ID. You can find them in the URL of the specific flow.

![Parameters](/images/getAllParentFlows/ParametersFromURL.png)

```powershell
    $m365Status = m365 status --output text
    if ($m365Status -eq "Logged Out") {
        m365 login
    }

    $environment = 'Default-dc109ffd-4298-487e-xxxx-6b9b1a2cd3e2'
    $childFlowId = 'e5a842f3-f5ac-ed0c-xxxx-c8df2af79fb3'

    $childFlow = m365 flow get --name $childFlowId --environmentName $environment --output json | ConvertFrom-Json 
    $workflowEntityId = $childFlow.properties.workflowEntityId

    if (!$childFlow) {
        Write-Host "Child flow not found try different environment or id"
        exit
    }

    if ($childFlow.properties.definitionSummary.triggers[0].type -ne 'Request' -or $childFlow.properties.definitionSummary.triggers[0].kind -ne "Button") {
        Write-Host "Child flow has incorrect trigger"
        exit
    }

    $flows = m365 flow list --environmentName $environment --output json | ConvertFrom-Json

    foreach ($flow in $flows) {
        $displayName = $flow.properties.displayName
        $id = $flow.name
        $hasWorkflowAction = $false
        
        foreach ($action in $flow.properties.definitionSummary.actions) {
            if ($action.type -eq 'Workflow') {
                $hasWorkflowAction = $true
                break
            }
        }

        if ($hasWorkflowAction) {
            $flowDetails = m365 flow get --name $id --environmentName $environment --output json | ConvertFrom-Json

            $flowDetails.properties.definition.actions | Get-Member -MemberType Properties | ForEach-Object {
                $property = $_.Name
                $detailedAction = $flowDetails.properties.definition.actions.$property

                if ($detailedAction.type -eq 'Workflow' -and $detailedAction.inputs.host.workflowReferenceName -eq $workflowEntityId) {
                    $previousActions = $detailedAction.runAfter;
                    $previousActionNames = ""

                    $previousActions | Get-Member -MemberType Properties | ForEach-Object {
                        $previousActionNames += $_.Name + ", "
                    }

                    Write-Host "$displayName -> $id -> before: $previousActionNames"
                }
            }
        }
    }

  ```

  As a result, you will see a list of all Parent Flows that use a specific Child Flow, including its display name, ID, and the name of the action that runs before the Child Flow.

  ![Result](/images/getAllParentFlows/result.png)