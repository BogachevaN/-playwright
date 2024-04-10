import { expect } from "@playwright/test"
import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'

export class HeaderActionsComponentApp extends BasePage {
    readonly userMenuBtn: Locator
    readonly goToAdmin: Locator

    constructor(page: Page) {
        super(page)
        this.userMenuBtn = page.getByTestId('mainApp_header_dropdown-profile')
        this.goToAdmin = page.getByTestId('mainApp_header_button-iconAdmin')
    }

    async loadPage() {
        await expect(this.userMenuBtn).toBeVisible()
    }

    async openUserMenu() {
        await this.userMenuBtn.click()
    }

    async navigateToAdmin() {
        await this.goToAdmin.click()
    }
}
