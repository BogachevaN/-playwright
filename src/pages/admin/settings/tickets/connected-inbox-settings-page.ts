import { Locator, Page } from '@playwright/test'
import { envVars } from '@/helpers/environment-variables-helper'
import { BasePage } from '@/pages/base-page'

export class ConnectedInboxSettingsPage extends BasePage {
    readonly inboxName: Locator
    readonly senderNameInput: Locator
    readonly previewBtn: Locator
    readonly addAgentNameCheckbox: Locator
    readonly assignToInput: Locator
    readonly saveBtn: Locator
    readonly inboxUpdatedMsg: Locator
    readonly deleteBtn: Locator

    constructor(page: Page) {
        super(page)
        this.inboxName = page.locator('.page-title-20>div')
        this.senderNameInput = page.getByTestId('adminApp_form-editInboxForm_field-senderName').locator('input')
        this.previewBtn = page.getByRole('button', { name: 'Preview' })
        this.addAgentNameCheckbox = page.getByRole('checkbox', { name: 'Add agent name to public replies When enabled, the from address includes the name of the agent who is replying.' })
        this.assignToInput = page.getByTestId('adminApp_form-editInboxForm_field-assigneeId')
        this.saveBtn = page.getByRole('button', { name: 'Save' })
        this.inboxUpdatedMsg = page.getByText('The inbox has been successfully updated')
        this.deleteBtn = page.getByRole('button', { name: 'Delete inbox' })
    }    

    async getUrl(id: string) {
        return `${envVars.baseUrl}/admin/settings/tickets/connected-inboxes/${id}`
    }

    async getInboxCreatedMsg(inboxName: string) {
        return this.page.getByText(`The inbox ${inboxName}@test-workspace-257.touchpointtesting.com has been successfully created`)
    }

    async getInboxID(): Promise<string> {
        const id = await this.getCurrentPageURL()
        return id.substring(id.indexOf('/connected-inboxes/') + 19)
    }
}