import { Locator, Page } from '@playwright/test'
import { BasePage } from '@/pages/base-page'
import { envVars } from "@/helpers/environment-variables-helper"
import { TableComponent } from '@/components/app/table-component'

export class AllListsPage extends BasePage {
    readonly baseUrl: string
    readonly redirectUrl: string
    readonly noListsText: Locator
    readonly createNewListBtn: Locator
    readonly importListsBtn: Locator
    readonly newListBtn: Locator
    readonly listCreatedMsg: Locator
    readonly listDeletedMsg: Locator
    readonly listUpdatedMsg: Locator
    readonly listsTable: TableComponent

    constructor(page: Page) {
        super(page)
        this.baseUrl = `${envVars.baseUrl}/contacts/lists`
        this.redirectUrl = `${envVars.baseUrl}/contacts/lists?UI.contactsListWrapper`
        this.noListsText = page.getByText('You have no lists yet')
        this.createNewListBtn = page.getByRole('button', { name: 'Create new list'})
        this.importListsBtn = page.getByRole('button', { name: 'Import lists'})
        this.newListBtn = page.getByRole('button', { name: 'New list'})
        this.listCreatedMsg = page.getByText('The list has been successfully created')
        this.listDeletedMsg = page.getByText('The list has been successfully deleted')
        this.listUpdatedMsg = page.getByText('The list has been successfully updated')
        this.listsTable = new TableComponent(page)
    }

    async searchList(listName: string) {
        await this.searchInTable('lists', listName)
    }

    async getTagFromRow(row: Locator) {
        return await row.locator('td:nth-child(4)').locator('span').innerHTML()
    }
}