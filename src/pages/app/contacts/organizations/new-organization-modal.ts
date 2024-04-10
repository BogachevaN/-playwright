import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class NewOrganizationModal extends BaseModal {
    readonly nameInput: Locator
    readonly domainsInput: Locator
    readonly countryInput: Locator
    readonly assigneeInput: Locator
    readonly emailLink: Locator
    readonly emailInput: Locator
    readonly phoneInput: Locator
    readonly timezoneInput: Locator
    readonly createBtn: Locator

    constructor(page: Page) {
        super(page)
        this.nameInput = page.getByTestId('mainApp_modalWrapper-organization_form-organizationForm_field-name').locator('input')
        this.domainsInput = page.getByTestId('mainApp_modalWrapper-organization_form-organizationForm_field-domains').locator('input')
        this.countryInput = page.getByTestId('mainApp_modalWrapper-organization_form-organizationForm_field-countryId').locator('input')
        this.assigneeInput = page.getByTestId('mainApp_modalWrapper-organization_form-organizationForm_field-assigneeId').locator('input')
        this.emailLink = page.getByTestId('mainApp_modalWrapper-organization_form-organizationForm_formPartial-add-email')
        this.emailInput = page.getByTestId('mainApp_modalWrapper-organization_form-organizationForm_formPartial_field-email').locator('input')
        this.phoneInput = page.getByTestId('mainApp_modalWrapper-organization_form-organizationForm_formPartial_field-phone').locator('input')
        this.timezoneInput = page.locator('input[type="timezone"]')
        this.createBtn = page.getByTestId('mainApp_modalWrapper-organization_form-organizationForm-submit')
    }
}
