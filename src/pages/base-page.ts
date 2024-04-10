import { expect, Locator, Page } from '@playwright/test'

export class BasePage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async selectValueInDropdown(value: string) {
        await this.page.locator(`.q-item:has-text("${value}")`).click()
    }

    async isContainValue(value: any): Promise<any> {
        const newLocal = this.page.locator(`.page-content:has-text("${value}")`)
        return await newLocal.isVisible()
    }

    async checkRedFrame(locator: Locator): Promise<boolean> {
        let result = false
        let n = 0
        while (n < 50 && !result) {
            const label =  this.page.locator('label', { has: locator })
            const classValue = await label.getAttribute('class')
            if (classValue?.includes('tp-field-error')) {
                result = true
            }
            await this.page.waitForTimeout(100)
            n++
        }
        return result
    }

    async getErrorMessage(locator: Locator): Promise<any> {
        let errorMessage = "";
        let n = 0;
        while (n < 50 && errorMessage == "") {
            const parentLocator = this.page.locator('label>div', { has: this.page.locator('div>div', {has: locator}) })
            const errorLocator = parentLocator.locator('div:nth-child(2)>div>div>div:nth-child(1)')
            errorMessage = await errorLocator.innerHTML()
            await this.page.waitForTimeout(100)
            n++
        }
        return errorMessage
    }

    async getStringLocator(locator: Locator): Promise<string> {
        const selector = locator.toString();
        const parts = selector.split("Locator@");
        if (parts.length !== 2) { throw Error("extractSelector: suspect that this is not a locator"); }
        return parts[1];
    }

    async getValueFromDropdownInput(dropdownInput: Locator): Promise<any> {
        const parentLocator = this.page.locator('div.q-field__native', { has: dropdownInput})
        const elementWithValue = parentLocator.locator('div')
        const value = await elementWithValue.innerHTML()
        return value
    }

    async getCurrentPageURL(): Promise<string> {
        return this.page.url()
    }

    async open(url: string) {
        await this.page.goto(url)
    }

    async loadPage(elements?: Array<Locator>, redirectUrl?: string) {
        await this.page.waitForLoadState('domcontentloaded')
        if (elements != undefined) {
            for (const element of elements) {
                await expect(this.page.locator(await this.getStringLocator(element))).toBeVisible()
            }
        }
        if (redirectUrl != undefined) {
            const currentUrl = this.page.url()
            expect(currentUrl).toContain(redirectUrl)
        }
    }

    async getLocatorByText(text: string) {
        return this.page.getByText(text)
    }

    async getToggleState(element: Locator) {
        const state = await element.getAttribute('modelvalue')
        let result
        if (state != null) {
            if (state.toLowerCase() === 'true') {
                result = true
            }
            if (state.toLowerCase() === 'false') {
                result = false
            }
        }
        return result
    }

    async searchCustomField(fieldName: string) {
        await this.searchInTable('custom fields', fieldName)
    }

    async searchInTable(entityName: string, value: string) {
        await this.page.locator(`input[placeholder="Search ${entityName}"]`).fill(`${value}`)
        await this.page.keyboard.press('Enter')
    }
}
