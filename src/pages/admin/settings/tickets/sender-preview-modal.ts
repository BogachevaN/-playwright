import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class SenderPreviewModal extends BaseModal {
    readonly senderName: Locator

    constructor(page: Page) {
        super(page)
        this.senderName = page.locator('.tp-ellipsis__in>span:nth-child(1)')
    }
}
