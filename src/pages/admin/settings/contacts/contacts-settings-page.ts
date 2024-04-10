import { Locator, Page } from '@playwright/test'
import { envVars } from '@/helpers/environment-variables-helper'
import { BasePage } from '@/pages/base-page'


export class ContactsSettingsPage extends BasePage {
    readonly url: string
    readonly contactCustomFieldBlock: Locator
    readonly statusesBlock: Locator

    constructor(page: Page) {
        super(page)
        this.url = `${envVars.baseUrl}/admin/settings/contacts`
        this.contactCustomFieldBlock = page.locator('div:text-is("Contact custom fields")')
        this.statusesBlock = page.getByRole('link', { name: /There are [0-9] contact statuses in this workspace./ }) 
    }
}
