import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class DeleteContactModal extends BaseModal {
    readonly contactFullName: Locator

    constructor(page: Page) {
        super(page);
        this.contactFullName = page.locator('//*[contains(@class, "slotted")]')
    }
}
