import { Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class DeleteTicketStatusModal extends BaseModal {

    constructor(page: Page) {
        super(page)
    }
}
