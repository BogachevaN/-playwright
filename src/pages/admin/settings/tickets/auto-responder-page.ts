import { Locator, Page } from '@playwright/test'
import { envVars } from '@/helpers/environment-variables-helper'
import { BasePage } from '@/pages/base-page'

export class AutoResponderPage extends BasePage {
    //Outside business hours - OBH
    //Within business hours - WBH
    readonly emailSubjectOBHInput: Locator
    readonly emailSubjectWBHInput: Locator
    readonly url: string

    constructor(page: Page) {
        super(page)
        this.emailSubjectOBHInput = page.getByTestId('adminApp_form-ticketAutoResponderForm_field-outsideWorkspaceHours.subject.main')
        this.emailSubjectWBHInput = page.getByTestId('adminApp_form-ticketAutoResponderForm_field-duringWorkspaceHours.subject.main')
        this.url = `${envVars.baseUrl}/admin/settings/tickets/auto-responder`
    }    
}