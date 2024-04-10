import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class NewTicketModal extends BaseModal {
    readonly subjectInput: Locator
    readonly requesterList: Locator
    readonly inboxList: Locator
    readonly assigneeList: Locator
    readonly priorityList: Locator
    readonly createDraftBtn: Locator
    readonly ticketCreatedMsg: Locator

    constructor(page: Page) {
        super(page)
        this.subjectInput = page.locator('input[name="subject"]')
        this.requesterList = page.getByTestId('mainApp_modalWrapper-ticketCreate_form-ticketCreateForm_field-requesterId').locator('input')
        this.inboxList =  page.locator('div[id=inboxId]')
        this.assigneeList =  page.getByTestId('mainApp_modalWrapper-ticketCreate_form-ticketCreateForm_field-assigneeId')
        this.priorityList =  page.getByTestId('mainApp_modalWrapper-ticketCreate_form-ticketCreateForm_field-priority')
        this.createDraftBtn = page.getByTestId('mainApp_modalWrapper-ticketCreate_form-ticketCreateForm-submit')
    }
}
