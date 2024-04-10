import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class EditUserDetailsModal extends BaseModal {
    readonly firstNameInput: Locator
    readonly lastNameInput: Locator
    readonly jobTitleInput: Locator
    readonly emailInput: Locator
    readonly phoneInput: Locator
    readonly roleList: Locator
    readonly teamInput: Locator
    readonly clearTeam: Locator

    constructor(page: Page) {
        super(page)
        this.firstNameInput = page.getByTestId('adminApp_modalWrapper-workspaceEditUser_form-userForm_field-firstName').locator('input')
        this.lastNameInput = page.getByTestId('adminApp_modalWrapper-workspaceEditUser_form-userForm_field-lastName').locator('input')
        this.jobTitleInput = page.getByTestId('adminApp_modalWrapper-workspaceEditUser_form-userForm_field-jobTitle').locator('input')
        this.emailInput = page.getByTestId('adminApp_modalWrapper-workspaceEditUser_form-userForm_field-email').locator('input')
        this.phoneInput = page.getByTestId('adminApp_modalWrapper-workspaceEditUser_form-userForm_field-phone').locator('input')
        this.roleList = page.getByTestId('adminApp_modalWrapper-workspaceEditUser_form-userForm_field-roleId').getByText('arrow_drop_down')
        this.teamInput = page.getByText('General + -1')
        this.clearTeam = page.getByTestId('adminApp_modalWrapper-workspaceEditUser_form-userForm_field-teamIds').getByRole('button', { name: 'cancel' })
    }
}