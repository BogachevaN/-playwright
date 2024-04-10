import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'
import { envVars } from '@/helpers/environment-variables-helper'
import { TableComponent } from "@/components/app/table-component"

export class WorkspaceTeamsPage extends BasePage {
    readonly newTeamBtn: Locator
    readonly baseUrl: string
    readonly teamsTable: Locator
    readonly teamCreatedMsg: Locator
    readonly teamDeletedMsg: Locator
    readonly teamUpdatedMsg: Locator
    readonly fieldsTable: TableComponent

    constructor(page: Page) {
        super(page)
        this.newTeamBtn = page.getByText('New team')
        this.baseUrl = `${envVars.baseUrl}/admin/workspace/teams`
        this.teamsTable = page.getByTestId('adminApp_workspace_table-teams')
        this.teamCreatedMsg = page.getByText('The team has been successfully created')
        this.teamDeletedMsg = page.getByText('The team has been successfully deleted')
        this.teamUpdatedMsg = page.getByText('The team has been successfully updated')
        this.fieldsTable = new TableComponent(page)
    }

    async searchTeam(teamName: string) {
        await this.searchInTable('teams', teamName)
    }

    async getDefaultMarkInRow(row: Locator) {
        const element = row.locator('td:nth-child(2)>div>span>div>div')
        return await element.innerText()
    }
}