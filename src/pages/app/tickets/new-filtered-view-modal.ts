import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class NewFilteredViewModal extends BaseModal {
    readonly viewNameInput: Locator

    constructor(page: Page) {
        super(page)
        this.viewNameInput = page.getByTestId('mainApp_modalWrapper-saveAsNewFilteredViewModal_form-filteredViewForm_field-name').locator('input')
    }
}
