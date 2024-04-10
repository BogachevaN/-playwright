import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'
import { envVars } from '@/helpers/environment-variables-helper'

export class WorkspaceGeneralPage extends BasePage {
    readonly editWorkspaceNameAndUrlBtn: Locator
    readonly baseUrl: string
    readonly redirectUrl: string

    constructor(page: Page) {
        super(page)
        this.editWorkspaceNameAndUrlBtn = page.getByTestId('adminApp_workspace_general_workspaceMain_button-workspaceUrlEdit')
        this.baseUrl = `${envVars.baseUrl}/admin/workspace`
        this.redirectUrl = `${envVars.baseUrl}/admin/workspace/general`
    }
}
