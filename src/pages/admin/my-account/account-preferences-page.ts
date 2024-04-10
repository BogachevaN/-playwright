import { Locator, Page } from '@playwright/test';
import { envVars } from "@/helpers/environment-variables-helper";
import { BasePage } from '@/pages/base-page';

export class AccountPreferencesPage extends BasePage {
    readonly baseUrl: string
    readonly localizationText: Locator
    readonly sendingMessageOptionsText: Locator

    constructor(page: Page) {
        super(page)
        this.baseUrl = `${envVars.baseUrl}/admin/account/preferences`
        this.localizationText = page.getByText('Localization')
        this.sendingMessageOptionsText = page.getByText('Sending message options')
    }
}