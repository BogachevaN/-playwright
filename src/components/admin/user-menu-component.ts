import { expect } from "@playwright/test"
import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'

export class UserMenuComponent extends BasePage {
    readonly logOutBtn: Locator

    constructor(page: Page) {
        super(page)
        this.logOutBtn = page.getByRole('button', { name: 'Log out' })
    }

    async loadPage() {
        await expect(this.logOutBtn).toBeVisible()
    }
}
