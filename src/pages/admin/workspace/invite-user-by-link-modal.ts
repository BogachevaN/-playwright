import { Locator, Page, expect } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class InviteUserByLinkModal extends BaseModal {
    readonly expirationDateList: Locator
    readonly copyBtn: Locator
    readonly saveChangesBtn: Locator
    readonly inviteLink: Locator

    constructor(page: Page) {
        super(page)
        this.expirationDateList = page.getByTestId('adminApp_modalWrapper-workspaceUserInviteByLink_form-invitationLinkForm_field-lifetimeInDays')
        this.copyBtn = page.getByRole('button', { name: 'Copy' })
        this.saveChangesBtn = page.getByTestId('adminApp_modalWrapper-workspaceUserInviteByLink_form-invitationLinkForm-submit')
        this.inviteLink = page.locator('.invite__link')
    }

    async loadPage() {
        await expect(this.expirationDateList).toBeVisible();
    }
}