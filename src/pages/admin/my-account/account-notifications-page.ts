import { Locator, Page } from '@playwright/test';
import { envVars } from "@/helpers/environment-variables-helper";
import { BasePage } from '@/pages/base-page';

export class AccountNotificationsPage extends BasePage {
    readonly baseUrl: string
    readonly emailNotificationsToggle: Locator

    constructor(page: Page) {
        super(page)
        this.baseUrl = `${envVars.baseUrl}/admin/account/notifications`
        this.emailNotificationsToggle = page.getByTestId('adminApp_form-accountNotificationsForm_field-settings.email').locator('.tp-toggle__wrap')
    }
}