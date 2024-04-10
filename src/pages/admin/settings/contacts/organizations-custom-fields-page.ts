import { Locator, Page } from '@playwright/test'
import { envVars } from '@/helpers/environment-variables-helper'
import { BasePage } from '@/pages/base-page'
import { TableComponent } from '@/components/app/table-component'

export class OrganizationsCustomFieldsPage extends BasePage {
    readonly url: string
    readonly defaultPaginationText: Locator
    readonly newCustomFieldBtn: Locator
    readonly fieldCreatedMsg: Locator
    readonly fieldDeletedMsg: Locator
    readonly fieldUpdatedMsg: Locator
    readonly fieldsTable: TableComponent

    constructor(page: Page) {
        super(page)
        this.url = `${envVars.baseUrl}/admin/settings/contacts/organization-fields`
        this.defaultPaginationText = page.getByText('1-3 of 3 fields')
        this.newCustomFieldBtn = page.getByRole('button', { name: 'New custom field' })
        this.fieldCreatedMsg = page.getByText('The custom field has been successfully created')
        this.fieldDeletedMsg = page.getByText('The custom field has been successfully deleted')
        this.fieldUpdatedMsg = page.getByText('The custom field has been successfully updated')
        this.fieldsTable = new TableComponent(page)
    }

    async getFieldTypeFromRow(row: Locator) {
        const element = row.locator('td:nth-child(3)').locator('div')
        return await element.innerText()
    }
}