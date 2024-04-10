import { Locator, Page } from '@playwright/test'
import { envVars } from '@/helpers/environment-variables-helper'
import { BasePage } from '@/pages/base-page'

export class PublicReplyPage extends BasePage {
    readonly url: string
    readonly emailSubjectInput: Locator
    readonly footerInput: Locator

    constructor(page: Page) {
        super(page)
        this.url = `${envVars.baseUrl}/admin/settings/tickets/public-reply`
        this.emailSubjectInput = page.getByTestId('adminApp_form-ticketSettingsPublicReplyForm_field-subject.main')
        this.footerInput = page.getByTestId('adminApp_form-ticketSettingsPublicReplyForm_field-footer.main')
    }    
}