import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class DeleteInboxModal extends BaseModal {
     readonly textOnModalFirst: Locator
     readonly textOnModalSecond: Locator

    constructor(page: Page) {
        super(page)
        this.textOnModalFirst = page.getByText(`By deleting this inbox, you will not be able to receive any emails sent to this address. All existing tickets will change their status to Closed, and you will not be able to send any replies from such tickets.`)
        this.textOnModalSecond = page.getByText('Are you sure you want to delete it?')
    }
}
