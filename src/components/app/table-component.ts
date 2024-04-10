import { expect } from '@playwright/test'
import { Locator, Page } from 'playwright-core'
import { BasePage } from '../../pages/base-page'

export class TableComponent extends BasePage {
    readonly searchField: Locator
    readonly filtersBtn: Locator
    readonly columnsBtn: Locator
    readonly table: Locator
    readonly tableHeader: Locator
    readonly tableCheckbox: Locator
    readonly tableFooter: Locator
    readonly paginationPrev: Locator
    readonly paginationNext: Locator
    readonly noSearchResultsHeader: Locator

    constructor(page: Page) {
        super(page)
        this.searchField = page.locator('//div[contains(@class,"filter-line__right")]//input')
        this.filtersBtn = page.locator('div[class="filter-line__right"]>button')
        this.columnsBtn = page.locator('.tp-dropdown-columns')
        this.table = page.locator('.tp-table')
        this.tableHeader = page.locator('thead')
        this.tableCheckbox = page.locator('.td-checkbox')
        this.tableFooter = page.locator('.tp-table-footer')
        this.paginationPrev = page.locator('.tp-table-pagination__prev')
        this.paginationNext = page.locator('.tp-table-pagination__next')
        this.noSearchResultsHeader = page.getByRole('heading', { name: 'There are no matching results' })
    }

    async loadTable() {
        await expect(this.tableFooter).toBeVisible()
    }

    async navigateToPrevTablePage() {
        this.paginationPrev.click
    }

    async navigateToNextTablePage() {
        this.paginationNext.click
    }

    async getRowByText(textInRow: string) {
        return this.page.locator("tr", { has: this.page.locator(`text="${textInRow}"`) })
    }

    async openMenuInRow(row: Locator) {
        await row.locator('.td-actions').click()
    }

    async selectOptionInDropdownMenu(menuName: string) {
        await this.page.locator('.tp-dropdown__menu')
            .getByRole('button', { name: `${menuName}` })
            .click()
    }

    async getTableRows() {
        return this.page.locator('tbody>tr')
    }
}
