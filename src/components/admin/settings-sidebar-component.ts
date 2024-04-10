import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'

export class SettingsSidebarComponent extends BasePage {
    readonly ticketsBtn: Locator
    readonly contactsBtn: Locator
    readonly messengerBtn: Locator

    constructor(page: Page) {
        super(page)
        this.ticketsBtn = page.getByTestId('adminApp_listItem-admin-settings-tickets')
        this.contactsBtn = page.getByTestId('adminApp_listItem-admin-settings-contacts')
        this.messengerBtn = page.getByTestId('adminApp_listItem-admin-settings-messenger')
    }
}
