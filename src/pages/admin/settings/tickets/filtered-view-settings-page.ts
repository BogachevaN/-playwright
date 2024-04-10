import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'
import { FiltersComponent } from '@/components/app/filters-component'

export class FilteredViewSettingsPage extends BaseModal {
    readonly viewNameInput: Locator
    readonly filtersComponent: FiltersComponent
    readonly groupByList: Locator
    readonly saveChangesBtn: Locator

    constructor(page: Page) {
        super(page)
        this.viewNameInput = page.getByTestId('adminApp_form-filteredViewForm_field-name').locator('input')
        this.filtersComponent = new FiltersComponent(page)
        this.groupByList = page.getByTestId('adminApp_form-filteredViewForm_field-body.groupBy_field').nth(0)
        this.saveChangesBtn = page.getByRole('button', {name: 'Save changes' })
    }
}
