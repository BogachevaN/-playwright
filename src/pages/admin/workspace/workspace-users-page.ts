import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'
import { envVars } from '@/helpers/environment-variables-helper'
import { TableComponent } from "@/components/app/table-component"

export class WorkspaceUsersPage extends BasePage {
    readonly addUserBtn: Locator
    readonly usersTable: Locator
    readonly shareInviteLinkBtn: Locator
    readonly baseUrl: string
    readonly fieldsTable: TableComponent

    constructor(page: Page) {
        super(page)
        this.addUserBtn = page.getByTestId('adminApp_workspace_topFilterBar-workspaceUsers_buttonsLine_addUserButton')
        this.usersTable = page.getByTestId('adminApp_workspace_table-workspaceUsers')
        this.shareInviteLinkBtn = page.getByTestId('adminApp_workspace_topFilterBar-workspaceUsers_buttonsLine_shareInviteLinkButton')
        this.baseUrl = `${envVars.baseUrl}/admin/workspace/users` 
        this.fieldsTable = new TableComponent(page)
    }

    async tableOfUsersContains(user: any): Promise<any> {
        const count = await this.usersTable.locator('tbody>tr').count()
        let result = false
        for (let i = 1; i < count + 1; i++) {
            const email = await this.usersTable.locator(`tbody>tr:nth-child(${i})>td:nth-child(3)>span>span`).innerHTML()
            if (email.includes(user)) {
                result = true
            }
        }
        return result
    }

    async searchUser(userName: string) {
        await this.searchInTable('users', userName)
    }

    async getRoleInRow(row: Locator) {
        const element = row.locator('td:nth-child(4)>span>span')
        return await element.innerText()
    }

    async getStatusInRow(row: Locator) {
        const element = row.locator('td:nth-child(5)>div>div')
        return await element.innerText()
    }

    async getTeamInRow(row: Locator) {
        const element = row.locator('td:nth-child(6)>div>div>div>span')
        return await element.innerText()
    }
}
