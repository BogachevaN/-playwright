import { expect } from "@playwright/test"
import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'

export class HeaderActionsComponent extends BasePage {
    readonly userMenuBtn: Locator
    readonly backToAppBtn: Locator

    constructor(page: Page) {
        super(page)
        this.userMenuBtn = page.getByTestId('adminApp_header_dropdown-profile')
        this.backToAppBtn = page.locator('text="Back to app"')
    }

    async loadPage() {
        await expect(this.userMenuBtn).toBeVisible()
    }

    async openUserMenu() {
        await this.userMenuBtn.click()
    }

    async navigateToApp() {
        await this.backToAppBtn.click()
    }
}
