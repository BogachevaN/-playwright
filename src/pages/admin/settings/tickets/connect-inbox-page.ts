import { Locator, Page } from '@playwright/test'
import { envVars } from '@/helpers/environment-variables-helper'
import { BasePage } from '@/pages/base-page'

export class ConnectInboxPage extends BasePage {
    readonly connectExistingInboxRadioBtn: Locator
    readonly createTouchpointInboxRadioBtn: Locator
    readonly touchpointInboxNameInput: Locator
    readonly continueBtn: Locator
    readonly senderNameInput: Locator
    readonly senderNamePreview: Locator
    readonly defaultAssigneeList: Locator
    readonly saveAndFinishBtn: Locator

    constructor(page: Page) {
        super(page)
        this.connectExistingInboxRadioBtn = page.getByRole('radio', { name: 'Connect an existing inbox' })
        this.createTouchpointInboxRadioBtn = page.getByRole('radio', { name: 'Create a new Touchpoint inbox' })
        this.touchpointInboxNameInput = page.getByTestId('adminApp_form-connectNewInboxForm_field-name').locator('input')
        this.continueBtn = page.getByRole('button', { name: 'Continue' })
        this.senderNameInput = page.getByTestId('adminApp_form-connectNewInboxForm_field-senderName').locator('input')
        this.senderNamePreview = page.locator('.tp-ellipsis__in>span:nth-child(1)')
        this.defaultAssigneeList = page.getByTestId('adminApp_form-connectNewInboxForm_field-defaultAssignee')
        this.saveAndFinishBtn = page.getByRole('button', { name: 'Save and finish' })
    }    

    async getUrl(id: string) {
        return `${envVars.baseUrl}/admin/settings/tickets/connected-inboxes/${id}`
    }
}