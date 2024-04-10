import { Locator, Page } from '@playwright/test'
import { BasePage } from '@/pages/base-page'
import { envVars } from "@/helpers/environment-variables-helper"

export class AllImportsPage extends BasePage {
    readonly baseUrl: string
    readonly redirectUrl: string
    readonly noImportsText: Locator
    readonly importContactsBtn: Locator

    constructor(page: Page) {
        super(page)
        this.baseUrl = `${envVars.baseUrl}/contacts/imports`
        this.redirectUrl = `${envVars.baseUrl}/contacts/imports?UI.importsWrapper`
        this.noImportsText = page.getByText("You haven't imported contacts yet")
        this.importContactsBtn = page.getByRole('button', { name: 'Import contacts'})
    }
}