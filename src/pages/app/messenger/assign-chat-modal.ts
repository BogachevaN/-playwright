import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class AssignChatModal extends BaseModal {
    readonly assignRequestLabel: Locator
    readonly assignChatLabel: Locator
    readonly assignBtn: Locator
    readonly assigneeList: Locator

    constructor(page: Page) {
        super(page)
        this.assignRequestLabel = page.getByText('Assign request')
        this.assignChatLabel = page.getByText('Assign chat')
        this.assignBtn = page.getByTestId('modalWrapper-chatAssigneeModal_form-chatAssigneeForm-submit')
        this.assigneeList = page.getByTestId('modalWrapper-chatAssigneeModal_form-chatAssigneeForm_field-assigneeId')
    }
}