import { Locator, Page } from '@playwright/test'
import { envVars } from '@/helpers/environment-variables-helper'
import { BasePage } from '@/pages/base-page'

export class SpamFilterPage extends BasePage {
    readonly url: string
    readonly blacklistedEmailsAndDomainsArea: Locator
    readonly whitelistedEmailsAndDomainsArea: Locator

    constructor(page: Page) {
        super(page)
        this.url = `${envVars.baseUrl}/admin/settings/tickets/spam-filter`
        this.blacklistedEmailsAndDomainsArea = page.getByTestId('adminApp_form-ticketSpamFilterForm_field-blacklisted.emailsAndDomains')
        this.whitelistedEmailsAndDomainsArea = page.getByTestId('adminApp_form-ticketSpamFilterForm_field-whitelisted.emailsAndDomains')
    }
}