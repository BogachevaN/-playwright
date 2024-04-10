import { Locator, Page } from '@playwright/test'
import { envVars } from "@/helpers/environment-variables-helper"
import { BasePage } from '@/pages/base-page'

export class WorkflowsPage extends BasePage {
    readonly baseUrl: string
    readonly redirectUrl: string
    readonly createFromScratchBtn: Locator

    constructor(page: Page) {
        super(page)
        this.baseUrl = `${envVars.baseUrl}/workflows`
        this.redirectUrl = `${envVars.baseUrl}/workflows/all?UI.WorkflowsTableIdWrapper`
        this.createFromScratchBtn = page.getByText('Create from scratch')
    }
}