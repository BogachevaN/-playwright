import { expect, test } from '@/fixtures/start'
import { DashboardPage } from '@/pages/app/dashboard-page'
import { SideMenuNavigationComponent } from '@/components/app/sidemenu-navigation-component'
import { TicketsPage } from '@/pages/app/tickets/tickets-page'
import { TicketsSidebarComponent } from '@/components/app/tickets-sidebar-component'
import { APITicketsSettingsHelper } from '@/helpers/api-helpers/api-tickets-settings-helper'

let dashboardPage: DashboardPage
let email: string
let password: string
let apiHelper: APITicketsSettingsHelper
let authorizationToken: string
let sidemenuNavigationComponent: SideMenuNavigationComponent
let ticketsPage: TicketsPage
let ticketsSidebarComponent: TicketsSidebarComponent
let filteredViewName: string

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    dashboardPage = new DashboardPage(currentPage.page)
    apiHelper = new APITicketsSettingsHelper()
    sidemenuNavigationComponent = new SideMenuNavigationComponent(currentPage.page)
    ticketsPage = new TicketsPage(currentPage.page)
    ticketsSidebarComponent = new TicketsSidebarComponent(currentPage.page)

    for (const user of testDataHelper.users) {
        if (user.test == 'filtered_views_app') {
            email = user.email
            password = user.password
        }
    }
    authorizationToken = (await apiHelper.getAuthorizationToken(email, password)).toString()
    await currentPage.logIn(email, password)
    await dashboardPage.loadPage([dashboardPage.ticketsBlock])
    await sidemenuNavigationComponent.navigateToCategory('tickets')
    await ticketsPage.loadPage([ticketsPage.newTicketBtn])
})

test.afterEach(async () => {
    const filteredViewId = await apiHelper.getFilteredViewIdByName(authorizationToken, filteredViewName)
    if (filteredViewId != undefined) {
        await apiHelper.deleteFilteredView(authorizationToken, filteredViewId)
    }
})

test('Create tickets filtered view @all @smoke @tickets @createTicketFilteredView', async () => {
    filteredViewName = 'Open tickets with high priority'
    await ticketsPage.filterBtn.click()
    //create filtered view
    await ticketsPage.filtersComponent.selectFilter('Status: All')
    await ticketsPage.filtersComponent.selectCheckboxValue('Open')
    await ticketsPage.filtersComponent.applyFilter()
    await ticketsPage.filtersComponent.selectFilter('Priority: All')
    await ticketsPage.filtersComponent.selectCheckboxValue('High')
    await ticketsPage.filtersComponent.applyFilter()
    await ticketsPage.filtersComponent.saveFilterAsNew(filteredViewName)
    //check filtered view
    await ticketsSidebarComponent.openFilteredView(filteredViewName)
    expect.soft(await ticketsPage.filteredViewTitle.innerText()).toEqual(filteredViewName)
    const filtersMap = new Map()
    filtersMap.set('Status', 'Open')
    filtersMap.set('Priority', 'High')
    await ticketsPage.checkFilteredTable(filtersMap)
})

test('Update tickets filtered view @all @smoke @tickets @updateTicketFilteredView', async () => {
    filteredViewName = 'Test filtered view' + Math.round(Math.random() * 10000)
    await apiHelper.createFilteredView(authorizationToken, filteredViewName)
    await ticketsPage.page.reload()
    await ticketsSidebarComponent.openFilteredView(filteredViewName)
    await ticketsPage.filterBtn.click()
    //change filtered view
    await ticketsPage.filtersComponent.selectFilter('Status: All')
    await ticketsPage.filtersComponent.selectCheckboxValue('Draft')
    await ticketsPage.filtersComponent.applyFilter()
    await ticketsPage.filtersComponent.selectFilter('Priority: High')
    await ticketsPage.filtersComponent.selectCheckboxValue('High')
    await ticketsPage.filtersComponent.selectCheckboxValue('Normal')
    await ticketsPage.filtersComponent.applyFilter()
    await ticketsPage.filtersComponent.saveToCurrentView(filteredViewName)
    //check filtered view
    await ticketsSidebarComponent.openFilteredView(filteredViewName)
    expect.soft(await ticketsPage.filteredViewTitle.innerText()).toEqual(filteredViewName)
    const filtersMap = new Map()
    filtersMap.set('Status', 'Draft')
    filtersMap.set('Priority', 'Normal')
})