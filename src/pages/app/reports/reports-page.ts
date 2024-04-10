import { Page } from '@playwright/test'
import { envVars } from "@/helpers/environment-variables-helper"
import { BasePage } from '@/pages/base-page'

export class ReportsPage extends BasePage {
    readonly baseUrl: string

    constructor(page: Page) {
        super(page)
        this.baseUrl = `${envVars.baseUrl}/reports`
    }
}