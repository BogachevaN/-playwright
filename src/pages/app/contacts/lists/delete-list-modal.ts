import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class DeleteListModal extends BaseModal {
    readonly keepContactsRadio: Locator
    readonly deleteContactsRadio: Locator

    constructor(page: Page) {
        super(page);
        this.keepContactsRadio = page.getByRole('radio', { name: 'Keep the contacts'})
        this.deleteContactsRadio = page.getByRole('radio', { name: 'Delete the contacts too'})
    }
}
