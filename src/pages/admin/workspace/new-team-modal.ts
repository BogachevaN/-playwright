import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class NewTeamModal extends BaseModal {
    readonly teamNameInput: Locator
    readonly makeDefaultCheckbox: Locator

    constructor(page: Page) {
        super(page)
        this.teamNameInput = page.getByTestId('adminApp_modalWrapper-team_form-teamForm_field-name').locator('input')
        this.makeDefaultCheckbox = page.getByRole('checkbox', { name: 'Make this team default for new users' })
    }
}