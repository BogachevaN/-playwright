import { expect } from "@playwright/test"
import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'

export class ContactsSidebarComponent extends BasePage {
    readonly contactsSidebarList: Locator

    constructor(page: Page) {
        super(page)
        this.contactsSidebarList = page.locator('div[class*="page-content-sidebar-list"]')
    }

    async loadPage() {
        await expect(this.contactsSidebarList).toBeVisible()
    }

    async navigateToContactsCategory(category : string) {
        await this.contactsSidebarList.getByTestId('mainApp_sidebar-contactsSidebar_listItem-user-contacts-' + category).click()
    }
}
