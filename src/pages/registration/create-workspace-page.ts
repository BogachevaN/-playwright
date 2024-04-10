import { expect } from "@playwright/test"
import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'

export class CreateWorkspacePage extends BasePage {
    readonly workspaceNameInput: Locator
    readonly workspaceUrlInput: Locator
    readonly domainInput: Locator
    readonly continueBtn: Locator

    constructor(page: Page) {
        super(page)
        this.workspaceNameInput = page.getByTestId('form-workspaceForm_field-name').locator('input')
        this.workspaceUrlInput = page.getByTestId('form-workspaceForm_field-identity').locator('input')
        this.domainInput = page.locator("//div[contains(text(),'.touchpoint.com')]")
        this.continueBtn = page.getByTestId('form-workspaceForm_button-submit')
    }

    async loadPage() {
        await expect(this.workspaceNameInput).toBeVisible()
    }
}
