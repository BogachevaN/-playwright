import { Locator, Page } from '@playwright/test';
import { envVars } from "@/helpers/environment-variables-helper";
import { BasePage } from '@/pages/base-page';

export class MessengerSettingsPage extends BasePage {
    readonly baseUrl: string
    readonly redirectUrl: string
    readonly autoSolveChatsText: Locator
    readonly widgetsBlock: Locator

    constructor(page: Page) {
        super(page)
        this.baseUrl = `${envVars.baseUrl}/admin/settings`
        this.redirectUrl = `${envVars.baseUrl}/admin/settings/messenger`
        this.autoSolveChatsText = page.getByText('Auto-solve chats')
        this.widgetsBlock = page.getByRole('link', { name: /There are [0-9] active web widgets in this workspace./ })
    }
}