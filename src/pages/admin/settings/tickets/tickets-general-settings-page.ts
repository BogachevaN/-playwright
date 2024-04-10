import { Locator, Page } from '@playwright/test'
import { envVars } from '@/helpers/environment-variables-helper'
import { BasePage } from '@/pages/base-page'

export class TicketsGeneralSettingsPage extends BasePage {
    readonly url: string
    readonly startTicketIdCountFromInput: Locator
    readonly automaticallyMarkTicketAsClosedInput: Locator

    constructor(page: Page) {
        super(page)
        this.url = `${envVars.baseUrl}/admin/settings/tickets/general`
        this.startTicketIdCountFromInput = page.getByTestId('adminApp_form-ticketGeneralForm_field-workspaceNextTicketId')
        this.automaticallyMarkTicketAsClosedInput = page.getByTestId('adminApp_form-ticketGeneralForm_field-solvedTicketLifeTime')
    }    
}