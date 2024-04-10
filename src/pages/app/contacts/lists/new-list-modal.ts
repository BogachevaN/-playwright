import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class NewListModal extends BaseModal {
    readonly listNameInput: Locator
    readonly tagsInput: Locator
    readonly createBtn: Locator
    readonly formId: Locator


    constructor(page: Page) {
        super(page)
        this.listNameInput = page.getByTestId('mainApp_modalWrapper-contactsList_form-contactListForm_field-name').locator('input')
        this.tagsInput = page.getByTestId('mainApp_modalWrapper-contactsList_form-contactListForm_field-tagIds').locator('input')
        this.createBtn = page.getByTestId('mainApp_modalWrapper-contactsList').getByRole('button', { name: 'Create' })
        this.formId = page.getByTestId('mainApp_modalWrapper-contactsList_form-contactListForm')
    }
}
