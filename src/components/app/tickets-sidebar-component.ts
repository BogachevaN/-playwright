import { expect } from "@playwright/test"
import { Locator, Page } from "playwright-core"
import { BasePage } from '@/pages/base-page'

export class TicketsSidebarComponent extends BasePage {
    readonly allTicketsBtn: Locator
    readonly deletedBtn: Locator

    constructor(page: Page) {
        super(page)
        this.allTicketsBtn = page.getByTestId('mainApp_tickets-sidebar_draggable-name-all-tickets')
        this.deletedBtn = page.getByTestId('mainApp_tickets-sidebar_draggable-name-deleted')
    }

    async loadPage() {
        await expect(this.allTicketsBtn).toBeVisible()
    }

    async openFilteredView(viewName: string) {
        const value = viewName.toLowerCase().replaceAll(' ', '-')
        await this.page.getByTestId(`mainApp_tickets-sidebar_draggable-name-${value}`).click({ delay: 500 })
    }
}
