import { Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class InviteUserByEmailModal extends BaseModal {

    async fillUserRow(userNumber: number, email: string) {
        this.page.getByTestId(`adminApp_modalWrapper-workspaceUserInviteByEmail_form-workspaceUserInviteForm_field-invitations.${userNumber-1}.email`)
            .locator('input')
            .fill(email)
    }

    constructor(page: Page) {
        super(page)
    }
}