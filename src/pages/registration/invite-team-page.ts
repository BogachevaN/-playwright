import { expect } from "@playwright/test"
import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'


export class InviteTeamPage extends BasePage {
    readonly inviteUsersByEmailBox: Locator
    readonly userRoleList: Locator
    readonly sendInvitesBtn: Locator
    readonly skipThisStepBtn: Locator

    constructor(page: Page) {
        super(page)
        this.inviteUsersByEmailBox = page.getByTestId('form-inviteUserForm_field-emails').locator('textarea')
        this.userRoleList = page.getByTestId('form-inviteUserForm_field-roleId')
        this.sendInvitesBtn = page.getByTestId('form-inviteUserForm_button-submit')
        this.skipThisStepBtn = page.getByRole('button', { name: 'Skip this step' })
    }

    async loadPage() {
        await expect(this.inviteUsersByEmailBox).toBeVisible()
    }
}
