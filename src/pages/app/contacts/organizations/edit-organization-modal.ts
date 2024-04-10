import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class EditOrganizationModal extends BaseModal {
    readonly nameInput: Locator
    readonly domainsInput: Locator
    readonly emailLink: Locator
    readonly emailInput: Locator
    readonly phoneInput: Locator
    readonly saveBtn: Locator

    constructor(page: Page) {
        super(page)
        this.nameInput = page.getByTestId('modalWrapper-organization_form-organizationForm_field-name').locator('input')
        this.domainsInput = page.getByTestId('modalWrapper-organization_form-organizationForm_field-domains').locator('input')
        this.emailLink = page.getByTestId('modalWrapper-organization_form-organizationForm_formPartial-add-email')
        this.emailInput = page.getByPlaceholder('Enter email address')
        this.phoneInput = page.getByPlaceholder('Enter phone number')
        this.saveBtn = page.getByTestId('modalWrapper-organization_form-organizationForm-submit')
    }
}
