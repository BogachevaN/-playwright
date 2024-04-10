import { expect } from "@playwright/test"
import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'

export class WorkspaceSidebarComponent extends BasePage {
    readonly allContactsBtn: Locator
    readonly teamsBtn: Locator
    readonly usersBtn: Locator

    constructor(page: Page) {
        super(page)
        this.allContactsBtn = page.locator('h1:text-is("Users")')
        this.teamsBtn = page.getByTestId('adminApp_workspace_general_listItem-admin-workspace-teams-self')
        this.usersBtn = page.getByTestId('adminApp_workspace_general_listItem-admin-workspace-users-self')
    }

    async loadPage() {
        await expect(this.allContactsBtn).toBeVisible()
    }
}
