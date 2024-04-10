import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class NewSegmentModal extends BaseModal {
    readonly segmentNameInput: Locator
    readonly tagsInput: Locator
    readonly createBtn: Locator
    readonly formId: Locator


    constructor(page: Page) {
        super(page)
        this.segmentNameInput = page.getByTestId('mainApp_modalWrapper-segment_form-segments_field-name').locator('input')
        this.tagsInput = page.getByTestId('mainApp_modalWrapper-segment_form-segments_field-tagIds').locator('input')
        this.createBtn = page.getByTestId('mainApp_modalWrapper-segment').getByRole('button', { name: 'Create' })
        this.formId = page.getByTestId('mainApp_modalWrapper-segment')
    }
}
