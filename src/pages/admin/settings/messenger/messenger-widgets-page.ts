import { Locator, Page } from '@playwright/test';
import { envVars } from "@/helpers/environment-variables-helper";
import { BasePage } from '@/pages/base-page';
import { TableComponent } from '@/components/app/table-component';

export class MessengerWidgetsPage extends BasePage {
    readonly baseUrl: string
    readonly redirectUrl: string
    readonly youHaveNoWidgetsLabel: Locator
    readonly supportWidget:Locator
    readonly newWidgetBtn: Locator
    readonly widgetCreatedMsg: Locator
    readonly widgetDeletedMsg: Locator
    readonly widgetUpdatedMsg: Locator
    readonly fieldsTable: TableComponent
    readonly noSearchResultsHeader: Locator

    constructor(page: Page) {
        super(page)
        this.baseUrl = `${envVars.baseUrl}/admin/settings/messenger/widgets`
        this.redirectUrl = `${envVars.baseUrl}/admin/settings/messenger/widgets?UI.messengerWidgetsWrapper`
        this.youHaveNoWidgetsLabel = page.getByText('You have no widgets yet')
        this.supportWidget = page.getByText('Rbi4rpic support')
        this.newWidgetBtn = page.getByRole('button', { name: 'New widget' })
        this.widgetCreatedMsg = page.getByText('The widget has been successfully created')
        this.widgetDeletedMsg = page.getByText('The widget has been successfully deleted')
        this.widgetUpdatedMsg = page.getByText('The widget has been successfully updated')
        this.fieldsTable = new TableComponent(page)
        this.noSearchResultsHeader = page.getByRole('heading', { name: 'There are no matching results' })
    }

    async searchWidget(widgetName: string) {
        await this.page.locator('input[placeholder="Search widgets"]').fill(`${widgetName}`)
        await this.page.keyboard.press('Enter')
    }

    async getDomainFromRow(row: Locator) {
        const element = row.locator('td:nth-child(3)>div>span>span')
        return await element.innerText()
    }
}