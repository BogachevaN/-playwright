import { expect } from "@playwright/test"
import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'

export class EmailConfirmationPage extends BasePage {
    readonly resendLink: Locator
    readonly confirmationCodeInput: Locator
    readonly successResendCodeMsg: Locator
    readonly resendingCodeNotAvailableMsg: Locator

    constructor(page: Page) {
        super(page)
        this.resendLink = page.getByTestId('form-emailConfirmation_form-resendEmailConfirmationForm')
        this.confirmationCodeInput = page.locator('.code-input')
        this.successResendCodeMsg = page.getByText('Successfully sent email')
        this.resendingCodeNotAvailableMsg = page.locator('div.tp-alert:has-text("Re-sending of the email will be available in ")')
    }

    async loadPage() {
        await expect(this.confirmationCodeInput).toBeVisible()
    }

   async enterConfirmationCode(code: string) {
        this.confirmationCodeInput.fill(code)
   }

    async getErrorMessageFromConfirmationPage(): Promise<any> {
        let errorMessage = "";
        let n = 0;
        while (n < 100 && errorMessage == "") {
            errorMessage = await this.page.locator('label>div').nth(1).innerText()
            await this.page.waitForTimeout(100)
            n++
        }
        return errorMessage
    }
}
