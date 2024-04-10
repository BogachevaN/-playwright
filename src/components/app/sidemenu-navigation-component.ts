import { expect } from "@playwright/test"
import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'

export class SideMenuNavigationComponent extends BasePage {
    readonly categories: Locator

    constructor(page: Page) {
        super(page);
        this.categories = page.locator('ul[class*="sidebar"]');
    }

    async loadPage() {
        await expect(this.categories).toBeVisible();
    }

    async navigateToCategory(category: string) {
        await this.categories.locator(`div[data-testid*="mainApp_mainSidebar_sidebarItem-user-${category}"]`).click();
    }
}
