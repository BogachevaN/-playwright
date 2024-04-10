import { expect } from "@playwright/test"
import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'

export class BaseModal extends BasePage {
    readonly modalTitle: Locator
    readonly cancelBtn: Locator
    readonly closeBtn: Locator
    readonly confirmBtn: Locator

    constructor(page: Page) {
        super(page)
        this.modalTitle = page.locator('.tp-modal__title')
        this.cancelBtn = page.locator('.tp-modal__footer>button')
        this.closeBtn = page.locator('.tp-modal__header-right>button')
        this.confirmBtn = page.locator('.tp-modal__footer-right>button')
    }

    async loadModal(value?: string) {
        if (value == undefined) {
            await expect(this.modalTitle).toBeVisible()
        } else {
            const nameTitle = await this.modalTitle.innerText()
            expect(nameTitle).toEqual(`${value}`)
        }
    }

    async closeModal() {
        this.closeBtn.click()
    }

    async confirmModal() {
        this.confirmBtn.click()
    }

    async cancelModal() {
        this.cancelBtn.click()
    }
}
