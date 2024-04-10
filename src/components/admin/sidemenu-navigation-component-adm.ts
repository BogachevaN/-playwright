import { expect } from "@playwright/test"
import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'

export class SideMenuNavigationComponentAdm extends BasePage {
    readonly workspaceBtn: Locator
    readonly myAccountBtn: Locator
    readonly settingsBtn: Locator

    constructor(page: Page) {
        super(page)
        this.workspaceBtn = page.getByTestId('adminApp_mainSidebar_sidebarItem-admin-workspace-self')
        this.myAccountBtn = page.getByTestId('adminApp_mainSidebar_sidebarItem-admin-account-self')
        this.settingsBtn = page.getByTestId('adminApp_mainSidebar_sidebarItem-admin-settings-self')
    }

    async loadPage() {
        await expect(this.workspaceBtn).toBeVisible()
    }
}
