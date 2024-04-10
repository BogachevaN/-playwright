import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'
import { envVars } from '@/helpers/environment-variables-helper'

export class WorkspaceRolesPage extends BasePage {
    readonly newRoleBtn: Locator
    readonly baseUrl: string
    readonly rolesTable: Locator

    constructor(page: Page) {
        super(page)
        this.newRoleBtn = page.getByText('New role')
        this.baseUrl = `${envVars.baseUrl}/admin/workspace/roles`
        this.rolesTable = page.getByTestId('adminApp_workspace_table-rolesTableId')
    }
}