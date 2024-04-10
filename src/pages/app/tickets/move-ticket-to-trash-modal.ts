import { Locator, Page } from "@playwright/test"
import { BaseModal } from '@/pages/base-modal'

export class MoveTicketToTrashModal extends BaseModal {
    readonly moveBtn: Locator

    constructor(page: Page) {
        super(page)
        this.moveBtn = page.getByRole('button', { name: 'Move' })
    }
}
