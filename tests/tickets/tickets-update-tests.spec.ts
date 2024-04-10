import { SideMenuNavigationComponent } from '@/components/app/sidemenu-navigation-component'
import { TicketsPage } from '@/pages/app/tickets/tickets-page'
import { TicketDetailsPage } from '@/pages/app/tickets/ticket-details-page'
import { APITicketsHelper } from '@/helpers/api-helpers/api-tickets-helper'
import { expect, test } from '@/fixtures/start'
import { dataProviderManager } from '@tests/data/DataManager'
import { Ticket } from '@tests/data/TicketDataProvider'
import { DataProviderInterface } from '@tests/data/types'
import { DashboardPage } from '@/pages/app/dashboard-page'

let dashboardPage: DashboardPage
let email: string
let password: string
let sideMenuNavigationComponent: SideMenuNavigationComponent
let ticketsPage: TicketsPage
let ticketDetailsPage: TicketDetailsPage
let ticketId: string
let apiHelper: APITicketsHelper
let authorizationToken: string
let ticketDataProvider: DataProviderInterface<Ticket>

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    sideMenuNavigationComponent = new SideMenuNavigationComponent(currentPage.page)
    ticketsPage = new TicketsPage(currentPage.page)
    ticketDetailsPage = new TicketDetailsPage(currentPage.page)
    apiHelper = new APITicketsHelper()
    ticketDataProvider = dataProviderManager.createProvider<Ticket>('ticket')
    dashboardPage = new DashboardPage(currentPage.page)

    for (const user of testDataHelper.users) {
        if (user.test == 'tickets_crud') {
            email = user.email
            password = user.password
        }
    }
    authorizationToken = (await apiHelper.getAuthorizationToken(email, password)).toString()
    await currentPage.logIn(email, password)
    await dashboardPage.loadPage([dashboardPage.ticketsBlock])
    ticketId = await apiHelper.createNewTicket(authorizationToken, ticketDataProvider.export())
    await sideMenuNavigationComponent.navigateToCategory('tickets')
    await ticketsPage.loadPage([ticketsPage.newTicketBtn])
    await ticketsPage.openTicketDetails(ticketDataProvider.getField('subject'))
    await ticketDetailsPage.loadPage([ticketDetailsPage.moreBtn])
    await ticketDetailsPage.page.waitForLoadState('domcontentloaded')
})

test.afterEach(async () => {
    ticketDataProvider.clear()
    if (ticketId != '') {
        await apiHelper.markTrashTicket(authorizationToken, ticketId)
        await apiHelper.deleteTicket(authorizationToken, ticketId)
        ticketId = ''
    }
})

test('Update ticket status @all @regress @tickets @updateTicketStatus', async () => {
    await ticketDetailsPage.statusList.click({ delay: 500 })
    await ticketDetailsPage.selectStatus('Open')
    await ticketDetailsPage.checkUpdateMessage()
    expect(await ticketDetailsPage.statusList.innerText()).toEqual('OPEN')
})

test('Update Assigned to field @all @smoke @tickets @updateTicketAssigned', async () => {
    await ticketDetailsPage.assignedToList.click({ delay: 500 })
    await ticketDetailsPage.selectValueInDropdown('FirstName259 LastName259')
    await ticketDetailsPage.checkUpdateMessage()
    expect(await ticketDetailsPage.assignedToList.innerText()).toEqual('FirstName259 LastName259')
})

test('Update Priority field @all @regress @tickets @updateTicketPriority', async () => {
    await ticketDetailsPage.priorityList.click({ delay: 500 })
    await ticketDetailsPage.selectValueInDropdown('High')
    await ticketDetailsPage.checkUpdateMessage()
    expect(await ticketDetailsPage.priorityList.innerText()).toEqual('High')
})

test('Update CCs field @all @smoke @tickets @updateTicketCCs', async () => {
    await ticketDetailsPage.ccsInput.click()
    await ticketDetailsPage.ccsInput.locator('input').fill('Rosemary')
    await ticketDetailsPage.selectValueInDropdown('Rosemary Green')
    await ticketDetailsPage.ccsInput.click()
    await ticketDetailsPage.saveCCsBtn.click()
    await ticketDetailsPage.checkUpdateMessage()
    expect(await ticketDetailsPage.ccsInput.locator('span').innerHTML()).toEqual('R')
})

test('Update Due date field @all @smoke @tickets @updateTicketDueDate', async () => {
    await ticketDetailsPage.dueDateInput.click({ delay: 500 })
    await ticketDetailsPage.calendarSaveBtn.click()
    await ticketDetailsPage.checkUpdateMessage()
})

test('Update Tags field @all @smoke @tickets @updateTicketTags', async () => {
    await ticketDetailsPage.tagsInput.click({ delay: 500 })
    await ticketDetailsPage.selectValueInDropdown('tag10')
    await ticketDetailsPage.saveTagBtn.click()
    await ticketDetailsPage.checkUpdateMessage()
    expect(ticketDetailsPage.tagsInput.getByText('tag10')).toBeVisible()
})

test('Update Followers field @all @smoke @tickets @updateTicketFollowers', async () => {
    await ticketDetailsPage.followersInput.click({ delay: 500 })
    await ticketDetailsPage.selectValueInDropdown('FirstName257 LastName257')
    await ticketDetailsPage.followersInput.click()
    await ticketDetailsPage.saveFollowersBtn.click()
    await ticketDetailsPage.checkUpdateMessage()
    await ticketDetailsPage.followersInput.getByText('F').first().hover()
    expect(ticketDetailsPage.page.locator('.tp-tooltip__main:text("FirstName257 LastName257")')).toBeVisible()
})

test('Update Subject field @all @smoke @tickets @updateTicketSubject', async () => {
    await ticketDetailsPage.subjectInput.click()
    await ticketDetailsPage.subjectInput.type('changed')
    await ticketDetailsPage.page.keyboard.press('Enter')
    await ticketDetailsPage.checkUpdateMessage()
    expect(ticketDetailsPage.subjectInput.locator(`:has-text("${ticketDataProvider.getField('subject')}changed")`).first()).toBeVisible()
})
