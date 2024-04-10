import { Locator, Page } from '@playwright/test'
import { envVars } from '@/helpers/environment-variables-helper'
import { BasePage } from '@/pages/base-page'
import { TableComponent } from '@/components/app/table-component'

export class TicketsFilteredViewsPage extends BasePage {
    readonly baseUrl: string
    readonly redirectUrl: string
    readonly newViewBtn: Locator
    readonly viewCreatedMsg: Locator
    readonly viewDeletedMsg: Locator
    readonly viewUpdatedMsg: Locator
    readonly fieldsTable: TableComponent

    constructor(page: Page) {
        super(page)
        this.baseUrl = `${envVars.baseUrl}/admin/settings/tickets/filtered`
        this.redirectUrl = `${envVars.baseUrl}/admin/settings/tickets/filtered/all`
        this.newViewBtn = page.getByRole('button', { name: 'New view' })
        this.viewCreatedMsg = page.getByText('The view has been successfully created')
        this.viewDeletedMsg = page.getByText('The view has been successfully deleted')
        this.viewUpdatedMsg = page.getByText('The view has been successfully updated')
        this.fieldsTable = new TableComponent(page)
    }

    async searchView(viewName: string) {
        await this.searchInTable('views', viewName)
    }
}