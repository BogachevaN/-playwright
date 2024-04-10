import { Locator, Page } from '@playwright/test';
import { envVars } from "@/helpers/environment-variables-helper";
import { BasePage } from '@/pages/base-page';

export class MessengerNumbersPage extends BasePage {
    readonly baseUrl: string
    readonly redirectUrl: string
    readonly youHaveNoNumbersLabel: Locator
    readonly cellWithNumberInList:Locator

    constructor(page: Page) {
        super(page)
        this.baseUrl = `${envVars.baseUrl}/admin/settings/messenger/numbers`
        this.redirectUrl = `${envVars.baseUrl}/admin/settings/messenger/numbers?UI.virtualPhoneNumberTableIdWrapper=`
        this.youHaveNoNumbersLabel = page.getByText('You have no numbers yet')
        this.cellWithNumberInList = page.locator('//*[contains(@data-testid,"column-numberPool")]')
    }
}