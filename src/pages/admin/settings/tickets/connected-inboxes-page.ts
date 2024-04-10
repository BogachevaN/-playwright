import { Locator, Page } from '@playwright/test'
import { envVars } from '@/helpers/environment-variables-helper'
import { BasePage } from '@/pages/base-page'
import { TableComponent } from '@/components/app/table-component'

export class ConnectedInboxesPage extends BasePage {
    readonly url: string
    readonly connectNewInboxBtn: Locator
    readonly fieldsTable: TableComponent
    readonly inboxDeletedMsg: Locator

    constructor(page: Page) {
        super(page)
        this.url = `${envVars.baseUrl}/admin/settings/tickets/connected-inboxes`
        this.connectNewInboxBtn = page.getByRole('button', { name: 'Connect new inbox' })
        this.fieldsTable = new TableComponent(page)
        this.inboxDeletedMsg = page.getByText('The inbox has been successfully deleted')
    }

    async getInboxLocatorByName(name: string) {
        return this.page.getByText(name)
    }

    async getEmailFromRow(row: Locator) {
        return row.locator('td:nth-child(1)')
    }

    async searchInbox(inboxName: string) {
        await this.searchInTable('inboxes', inboxName)
    }
}
