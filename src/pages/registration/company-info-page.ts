import { expect } from "@playwright/test"
import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'


export class CompanyInfoPage extends BasePage {
    readonly companySizeList: Locator
    readonly industryList: Locator
    readonly continueBtn: Locator
    readonly skipThisStepBtn: Locator

    constructor(page: Page) {
        super(page)
        this.companySizeList = page.getByTestId('form-surveyForm_field-companySize')
        this.industryList = page.getByTestId('form-surveyForm_field-industry')
        this.continueBtn = page.getByTestId('form-surveyForm_button-submit')
        this.skipThisStepBtn = page.getByRole('button', { name: 'Skip this step' })
    }

    async loadPage() {
        await expect(this.companySizeList).toBeVisible()
    }
}
