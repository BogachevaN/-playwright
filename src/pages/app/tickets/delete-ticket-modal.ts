import { Locator, Page } from "@playwright/test"
import { BaseModal } from "@/pages/base-modal"

export class DeleteTicketModal extends BaseModal {
    readonly deleteBtn: Locator

    constructor(page: Page) {
        super(page)
        this.deleteBtn = page.getByTestId('mainApp_modalWrapper-confirmationDelete').getByRole('button', { name: 'Delete' })
    }
}
