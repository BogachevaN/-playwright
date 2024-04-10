import { Locator, Page } from '@playwright/test'
import { envVars } from '@/helpers/environment-variables-helper'
import { BasePage } from '@/pages/base-page'

export class NewImportPage extends BasePage {
    readonly url: string
    readonly browseFilesBtn: Locator

    constructor(page: Page) {
        super(page)
        this.url = `${envVars.baseUrl}/contacts/imports/new`
        this.browseFilesBtn = page.getByTestId('mainApp_form-contactImportForm_field-tmpFile').getByRole('button', { name: 'Browse files' })
    }
}