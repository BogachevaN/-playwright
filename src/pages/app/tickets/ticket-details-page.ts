import { expect } from "@playwright/test"
import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'


export class TicketDetailsPage extends BasePage {
    readonly subjectInput: Locator
    readonly statusList: Locator
    readonly assignedToList: Locator
    readonly priorityList: Locator
    readonly inboxInput: Locator
    readonly moreBtn: Locator
    readonly deleteBtn: Locator
    readonly ticketUpdatedMsg: Locator
    readonly ccsInput: Locator
    readonly addCCBtn: Locator
    readonly searchContactInput: Locator
    readonly dueDateInput: Locator
    readonly calendarSaveBtn: Locator
    readonly followersInput: Locator
    readonly tagsInput: Locator
    readonly closeFlashMessageBtn: Locator
    readonly addFollowersBtn: Locator
    readonly findUserForFollowersInput: Locator
    readonly contactEmailInput: Locator
    readonly contactEmailField: Locator
    readonly contactTab: Locator
    readonly saveCCsBtn: Locator
    readonly saveFollowersBtn: Locator
    readonly saveTagBtn: Locator

    constructor(page: Page) {
        super(page)
        this.subjectInput = page.getByTestId('form-ticketDetailsForm_field-subject')
        this.statusList = page.getByTestId('form-ticketDetailsForm_field-statusId').locator('.q-chip__content')
        this.assignedToList = page.getByTestId('form-ticketDetailsForm_field-assigneeId').locator('.tp-ellipsis__in')
        this.priorityList = page.locator('.tp-priority--text')
        this.inboxInput = page.getByTestId('form-ticketDetailsForm_field-inbox').locator('.tp-form-line__text')
        this.moreBtn = page.getByRole('button', { name: 'More', exact: true })
        this.deleteBtn = page.getByRole('button', { name: 'Delete' })
        this.ticketUpdatedMsg = page.getByText('The ticket has been successfully updated').first()
        this.ccsInput = page.getByTestId('form-ticketDetailsForm_field-carbonCopyIds')
        this.addCCBtn = page.getByRole('button', { name: 'Add Cc'}).first()
        this.searchContactInput = page.getByPlaceholder('Enter contact name')
        this.dueDateInput = page.getByTestId('form-ticketDetailsForm_field-dueDate').locator('input')
        this.calendarSaveBtn = page.getByRole('button', { name: 'Save'})
        this.tagsInput = page.getByTestId('form-ticketDetailsForm_field-tagIds')
        this.closeFlashMessageBtn = page.getByText('close').first()
        this.followersInput = page.getByTestId('form-ticketDetailsForm_form-ticketFollowers')
        this.addFollowersBtn = page.getByRole('button', { name: 'Add followers' }).first()
        this.findUserForFollowersInput = page.getByPlaceholder('Enter user name')
        this.saveCCsBtn = page.getByRole('button', { name: 'Save' })
        this.saveFollowersBtn = page.getByTestId('form-ticketDetailsForm_form-ticketFollowers').getByRole('button', { name: 'Save' })
        this.saveTagBtn = page.getByRole('button', { name: 'Save' })

        //contact details
        this.contactTab = page.getByText('Contact detailskeyboard_arrow_down')
        this.contactEmailField = page.locator('//*[contains(@class,"field-emails__row__display")]');
        this.contactEmailInput = page.locator('input[name*="email"]')
    }

    async getCurrentTicketID(): Promise<string> {
        const id = await this.getCurrentPageURL()
        return id.substring(id.indexOf('/tickets/') + 9, id.indexOf('/messages'))
    }

    async addValueInCCsInput(value: string) {
        await this.ccsInput.click()
        await this.addCCBtn.click()
        await expect(this.searchContactInput).toBeVisible()
        await this.searchContactInput.fill(value)
        await this.selectValueInDropdown(value)
    }

    async checkUpdateMessage() {
        await expect(this.ticketUpdatedMsg).toBeVisible()
        await this.closeFlashMessageBtn.click()
    }

    async selectStatus(value: string) {
        await this.page.getByRole('option', { name: `${value}` }).click()
    }

    async getMessagesTabLocator(quantity: number) {
        return this.page.getByRole('tab', { name: `Messages ${quantity}` })
    }

    async getLogsTabLocator(quantity: number) {
        return this.page.getByRole('tab', { name: `Logs ${quantity}` })
    }
}
