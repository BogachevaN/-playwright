import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class RejectChatModal extends BaseModal {
    readonly rejectReasonField: Locator
    readonly rejectBtn: Locator

    constructor(page: Page) {
        super(page)
        this.rejectReasonField = page.getByPlaceholder('Please explain why you are rejecting this request')
        this.rejectBtn = page.getByTestId('modalWrapper-chatRejectModal_form-chatRejectForm-submit')
    }
}