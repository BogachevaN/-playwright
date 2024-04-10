import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class DeleteOrganizationModal extends BaseModal {
    readonly deleteOrganizationBtn: Locator
    readonly modalTitle: Locator

    constructor(page: Page) {
        super(page)
        this.deleteOrganizationBtn = page.getByRole('button', { name: 'Delete organization' })
        this.modalTitle = page.getByText('Delete organization').first()
    }
}
