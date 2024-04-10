import { Locator, Page } from '@playwright/test'
import { BasePage } from '@/pages/base-page'
import { envVars } from "@/helpers/environment-variables-helper"
import { TableComponent } from '@/components/app/table-component'

export class AllSegmentsPage extends BasePage {
    readonly baseUrl: string
    readonly redirectUrl: string
    readonly noSegmentsText: Locator
    readonly createNewSegmentBtn: Locator
    readonly newSegmentBtn: Locator
    readonly segmentCreatedMsg: Locator
    readonly segmentDeletedMsg: Locator
    readonly segmentUpdatedMsg: Locator
    readonly segmentsTable: TableComponent

    constructor(page: Page) {
        super(page)
        this.baseUrl = `${envVars.baseUrl}/contacts/segments`
        this.redirectUrl = `${envVars.baseUrl}/contacts/segments?UI.segmentsWrapper`
        this.noSegmentsText = page.getByText('You have no segments yet')
        this.createNewSegmentBtn = page.getByRole('button', { name: 'Create new segment'})
        this.newSegmentBtn = page.getByRole('button', { name: 'New segment'})
        this.segmentCreatedMsg = page.getByText('The segment has been successfully created')
        this.segmentDeletedMsg = page.getByText('The segment has been successfully deleted')
        this.segmentUpdatedMsg = page.getByText('The segment has been successfully updated')
        this.segmentsTable = new TableComponent(page)
    }

    async searchSegment(segmentName: string) {
        await this.searchInTable('segments', segmentName)
    }

    async getTagFromRow(row: Locator) {
        return await row.locator('td:nth-child(4)').locator('span').innerHTML()
    }
}