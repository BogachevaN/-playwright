import { Locator, Page } from 'playwright-core'
import { BasePage } from '../../pages/base-page'
import { NewFilteredViewModal } from '@/pages/app/tickets/new-filtered-view-modal'

export class FiltersComponent extends BasePage {
    readonly applyBtn: Locator
    readonly saveBtn: Locator
    readonly saveAsNewBtn: Locator
    readonly newFilteredViewModal: NewFilteredViewModal
    readonly saveToCurrentViewBtn: Locator

    constructor(page: Page) {
        super(page)
        this.applyBtn = page.getByRole('button', { name: 'Apply' })
        this.saveBtn = page.getByRole('button', { name: 'Save', exact: true  })
        this.saveAsNewBtn = page.getByRole('button', { name: 'Save as new' })
        this.newFilteredViewModal = new NewFilteredViewModal(page)
        this.saveToCurrentViewBtn = page.getByRole('button', { name: 'Save to current view' })
    }

    async selectFilter(filterName: string) {
        await this.page.getByRole('button', { name: `${filterName}` }).click()
    }

    async applyFilter() {
        await this.applyBtn.click()
    }

    async selectCheckboxValue(value:string) {
        await this.page.getByRole('checkbox', { name: `${value}` }).click()
    }

    async saveFilterAsNew(filteredViewName: string) {
        await this.saveBtn.click()
        await this.saveAsNewBtn.click()
        await this.newFilteredViewModal.viewNameInput.fill(filteredViewName)
        await this.newFilteredViewModal.confirmModal()
    }

    async saveToCurrentView(filteredViewName: string) {
        await this.saveBtn.click()
        await this.saveToCurrentViewBtn.click()
        //await expect.soft(this.saveBtn).not.toBeVisible()
    }
}
