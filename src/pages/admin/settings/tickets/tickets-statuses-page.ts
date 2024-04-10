import { Locator, Page } from '@playwright/test'
import { envVars } from '@/helpers/environment-variables-helper'
import { BasePage } from '@/pages/base-page'

export class TicketsStatusesPage extends BasePage {
    readonly url: string
    readonly addNewStatusBtn: Locator
    readonly statusCreatedMsg: Locator
    readonly statusDeletedMsg: Locator
    readonly statusUpdatedMsg: Locator

    constructor(page: Page) {
        super(page)
        this.url = `${envVars.baseUrl}/admin/settings/tickets/statuses`
        this.addNewStatusBtn = page.getByRole('button', { name: 'Add new status' })
        this.statusCreatedMsg = page.getByText('The ticket status has been successfully created')
        this.statusDeletedMsg = page.getByText('The ticket status has been successfully deleted')
        this.statusUpdatedMsg = page.getByText('The ticket status has been successfully updated')
    }

    async getStatusByName(statusName: string) {
        return this.page.getByText(`drag_indicator${statusName}editdelete`)
    }

    async getDeleteBtnByName(statusName: string) {
        const row = this.page.locator('div[data-testid="adminApp_draggable-index"]', { has: this.page.getByText(`drag_indicator${statusName}editdelete`) })
        return row.locator('.tp-panel__buttons>button:nth-child(2)')
    }
}