import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class NewTicketStatusModal extends BaseModal {
    readonly statusInput: Locator
    readonly preview: Locator

    constructor(page: Page) {
        super(page)
        this.statusInput = page.getByTestId('adminApp_modalWrapper-ticketStatus_form-ticketStatusForm_field-name').locator('input')
        this.preview = page.locator('div.tp-modal__main>div>div.q-chip__content')
    }
}
