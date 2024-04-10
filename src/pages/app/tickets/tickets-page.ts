import { expect } from "@playwright/test"
import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'
import { envVars } from "@/helpers/environment-variables-helper"
import { FiltersComponent } from "@/components/app/filters-component"
import { TableComponent } from "@/components/app/table-component"

export class TicketsPage extends BasePage {
    readonly newTicketBtn: Locator
    readonly ticketCreatedMsg: Locator
    readonly ticketsTable: Locator
    readonly ticketMovedMsg: Locator
    readonly threeDotMenuBtn: Locator
    readonly deleteBtnInRow: Locator
    readonly ticketDeletedMsg: Locator
    readonly baseUrl: string
    readonly redirectUrl: string
    readonly createNewTicketBtn: Locator
    readonly filterBtn: Locator
    readonly filtersComponent: FiltersComponent
    readonly filteredViewTitle: Locator
    readonly fieldsTable: TableComponent 

    constructor(page: Page) {
        super(page)
        this.newTicketBtn = page.getByRole('button', { name: 'New ticket' })
        this.ticketCreatedMsg = page.getByText('The ticket has been successfully created')
        this.ticketsTable = page.getByTestId('mainApp_table-tickets')
        this.ticketMovedMsg = page.getByText('The ticket has been successfully moved to trash')
        this.threeDotMenuBtn = page.getByTestId('mainApp_table-tickets-body').getByRole('button').filter({ hasText: 'more_vert' })
        this.deleteBtnInRow = page.getByRole('button', { name: 'Delete', exact: true })
        this.ticketDeletedMsg = page.getByText('The ticket has been successfully deleted')
        this.baseUrl = `${envVars.baseUrl}/tickets`
        this.redirectUrl = `${envVars.baseUrl}/tickets/all/`
        this.createNewTicketBtn = page.getByRole('button', { name: 'Create new ticket' })
        this.filterBtn = page.getByTestId('mainApp_topFilterBar-tickets_button-filtersToggler')
        this.filtersComponent = new FiltersComponent(page)
        this.filteredViewTitle = page.locator('.title-wrap>h1')
        this.fieldsTable = new TableComponent(page)
    }

    async openTicketDetails(value: string) {
        await this.searchTicket(value)
        await expect(this.ticketsTable).toBeVisible()
        await this.page.getByTestId('mainApp_table-tickets').locator(`span.pointer:has-text("${value}")`).hover()
        await this.page.getByTestId('mainApp_table-tickets').locator(`span.pointer:has-text("${value}")`).click()
    }

    async searchTicket(value: string) {
        await this.searchInTable('tickets', value)
    }

    async checkFilteredTable(filtersMap: Map<string, string>) {
        const rows = await this.fieldsTable.getTableRows()
        const count = await rows.count()
        filtersMap.forEach(async (value, key) => {
            switch (key) {
                case 'Status': {
                    for (let i=0; i<count; i++) {
                        expect.soft(await rows.nth(i).locator('td:nth-child(7)>div>div').innerText()).toEqual(value.toUpperCase())
                    }
                    break
                }
                case 'Priority': {
                    for (let i=0; i<count; i++) {
                        expect.soft(await rows.nth(i).locator('td:nth-child(4)>div>span').innerText()).toEqual(value)
                    }
                    break
                }
            }
        })
    }
}
