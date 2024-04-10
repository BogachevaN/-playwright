import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class NewContactModal extends BaseModal {
    readonly firstNameInput: Locator
    readonly lastNameInput: Locator
    readonly avatarUpload: Locator
    readonly emailInput: Locator
    readonly emailLabelSelect: Locator
    readonly phoneInput: Locator
    readonly phoneLabelSelect: Locator
    readonly primaryLabel: Locator
    readonly trashBinBtn: Locator
    readonly addAnotherBtn: Locator
    readonly statusSelect: Locator
    readonly assigneeField: Locator
    readonly defaultAssignee: Locator
    readonly addOtherFieldsBtn: Locator
    readonly createAnotherCheckbox: Locator
    readonly organizationSelect: Locator
    readonly countryInput: Locator
    readonly socialMediaInput: Locator

    constructor(page: Page) {
        super(page)
        this.firstNameInput = page.locator('//*[contains(@data-testid, "modalWrapper-contact_form-contactForm_field-firstName")]//input')
        this.lastNameInput = page.locator('//*[contains(@data-testid, "modalWrapper-contact_form-contactForm_field-lastName")]//input')
        this.avatarUpload = page.locator('.upload-avatar')
        this.emailInput = page.locator('//*[contains(@data-testid, "modalWrapper-contact_form-contactForm_field-emails.0.email")]//input')
        this.emailLabelSelect = page.locator('select[name*="emails"]')
        this.phoneInput = page.locator('//*[contains(@data-testid, "modalWrapper-contact_form-contactForm_field-phones.0.number")]//input')
        this.phoneLabelSelect = page.locator('select[name*="phones"]')
        this.primaryLabel = page.locator('div[name*="isPrimary"]')
        this.trashBinBtn = page.locator('.remove-button')
        this.addAnotherBtn = page.locator('div[aria-selected=true]>span')
        this.statusSelect = page.locator('//*[contains(@data-testid, "modalWrapper-contact_form-contactForm_field-statusId")]')
        this.assigneeField = page.locator('//*[contains(@data-testid, "modalWrapper-contact_form-contactForm_field-assigneeId")]')
        this.defaultAssignee = page.getByText('Firstname258 Lastname258 (you)')
        this.addOtherFieldsBtn = page.locator('//*[contains(@data-testid, "modalWrapper-contact_form-contactForm_formPartial-add-organizationId")]')
        this.createAnotherCheckbox = page.locator('.tp-modal__create-another >.q-checkbox')
        this.organizationSelect = page.locator('//*[contains(@data-testid, "modalWrapper-contact_form-contactForm_formPartial_field-organizationId")]//input')
        this.countryInput = page.locator('//*[contains(@class, "modal")]//input[contains(@type, "country")]')
        this.socialMediaInput = page.locator('input[name*="socialMedia"]')
    }
}
