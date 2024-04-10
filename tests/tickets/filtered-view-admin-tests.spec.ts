import { expect, test } from '@/fixtures/start'
import { DashboardPage } from '@/pages/app/dashboard-page'
import { HomePage } from '@/pages/admin/home-page'
import { SideMenuNavigationComponentAdm } from '@/components/admin/sidemenu-navigation-component-adm'
import { SettingsSidebarComponent } from '@/components/admin/settings-sidebar-component'
import { TicketsSettingsPage } from '@/pages/admin/settings/tickets/tickets-settings-page'
import { APITicketsSettingsHelper } from '@/helpers/api-helpers/api-tickets-settings-helper'
import { TicketsFilteredViewsPage } from '@/pages/admin/settings/tickets/tickets-filtered-views-page'
import { FilteredViewSettingsPage } from '@/pages/admin/settings/tickets/filtered-view-settings-page'
import { DeleteModal } from '@/pages/admin/common-forms/delete-modal'

let dashboardPage: DashboardPage
let email: string
let password: string
let apiHelper: APITicketsSettingsHelper
let authorizationToken: string
let homePage: HomePage
let sideMenuNavigationComponentAdm: SideMenuNavigationComponentAdm
let settingsSidebarComponent: SettingsSidebarComponent
let ticketsSettingsPage: TicketsSettingsPage
let ticketsFilteredViewsPage: TicketsFilteredViewsPage
let filteredViewName: string
let filteredViewSettingsPage: FilteredViewSettingsPage
let deleteModal: DeleteModal

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    dashboardPage = new DashboardPage(currentPage.page)
    apiHelper = new APITicketsSettingsHelper()
    homePage = new HomePage(currentPage.page)
    sideMenuNavigationComponentAdm = new SideMenuNavigationComponentAdm(currentPage.page)
    settingsSidebarComponent = new SettingsSidebarComponent(currentPage.page)
    ticketsSettingsPage = new TicketsSettingsPage(currentPage.page)
    filteredViewName = 'Test filtered view' + Math.round(Math.random() * 10000)
    ticketsFilteredViewsPage = new TicketsFilteredViewsPage(currentPage.page)
    filteredViewSettingsPage = new FilteredViewSettingsPage(currentPage.page)
    deleteModal = new DeleteModal(currentPage.page)

    for (const user of testDataHelper.users) {
        if (user.test == 'tickets_crud') {
            email = user.email
            password = user.password
        }
    }
    authorizationToken = (await apiHelper.getAuthorizationToken(email, password)).toString()
    await currentPage.logIn(email, password)
    await dashboardPage.loadPage([dashboardPage.ticketsBlock])
    await homePage.open(homePage.baseUrl)
    await sideMenuNavigationComponentAdm.settingsBtn.click()
    await settingsSidebarComponent.ticketsBtn.click()
    await ticketsSettingsPage.loadPage()
    await ticketsSettingsPage.filteredViewsBlock.click()
    await ticketsFilteredViewsPage.loadPage()
})

test.afterEach(async () => {
    const filteredViewId = await apiHelper.getFilteredViewIdByName(authorizationToken, filteredViewName)
    if (filteredViewId != undefined) {
        await apiHelper.deleteFilteredView(authorizationToken, filteredViewId)
    }
})

test('Create tickets filtered view @all @smoke @ticketsSettings @createTicketFilteredViewAdm', async () => {
    await ticketsFilteredViewsPage.newViewBtn.click()
    await filteredViewSettingsPage.loadPage()
    await filteredViewSettingsPage.viewNameInput.fill(filteredViewName)
    await filteredViewSettingsPage.filtersComponent.selectFilter('Status: All')
    await filteredViewSettingsPage.filtersComponent.selectCheckboxValue('Open')
    await filteredViewSettingsPage.filtersComponent.applyFilter()
    await filteredViewSettingsPage.filtersComponent.selectFilter('Priority: All')
    await filteredViewSettingsPage.filtersComponent.selectCheckboxValue('High')
    await filteredViewSettingsPage.filtersComponent.applyFilter()
    await filteredViewSettingsPage.groupByList.click()
    await filteredViewSettingsPage.selectValueInDropdown('Status')
    await filteredViewSettingsPage.saveChangesBtn.click()
    await expect.soft(ticketsFilteredViewsPage.viewCreatedMsg).toBeVisible()
    await ticketsFilteredViewsPage.searchView(filteredViewName)
    const row = await ticketsFilteredViewsPage.fieldsTable.getRowByText(filteredViewName)
    expect.soft(row).toBeVisible()
})

test('Update tickets filtered view @all @smoke @ticketsSettings @updateTicketFilteredViewAdm', async () => {
    await apiHelper.createFilteredView(authorizationToken, filteredViewName)
    await ticketsFilteredViewsPage.searchView(filteredViewName)
    let row = await ticketsFilteredViewsPage.fieldsTable.getRowByText(filteredViewName)
    await ticketsFilteredViewsPage.fieldsTable.openMenuInRow(row)
    await ticketsFilteredViewsPage.fieldsTable.selectOptionInDropdownMenu('Edit')
    filteredViewName += '_edit'
    //change filtered view
    await filteredViewSettingsPage.viewNameInput.fill(filteredViewName)
    await filteredViewSettingsPage.filtersComponent.selectFilter('Status: All')
    await filteredViewSettingsPage.filtersComponent.selectCheckboxValue('Draft')
    await filteredViewSettingsPage.filtersComponent.applyFilter()
    await filteredViewSettingsPage.filtersComponent.selectFilter('Priority: High')
    await filteredViewSettingsPage.filtersComponent.selectCheckboxValue('High')
    await filteredViewSettingsPage.filtersComponent.selectCheckboxValue('Normal')
    await filteredViewSettingsPage.saveChangesBtn.click()
    await expect.soft(ticketsFilteredViewsPage.viewUpdatedMsg).toBeVisible()
    await ticketsFilteredViewsPage.searchView(filteredViewName)
    row = await ticketsFilteredViewsPage.fieldsTable.getRowByText(filteredViewName)
    expect.soft(row).toBeVisible()
})

test('Delete tickets filtered view @all @smoke @ticketsSettings @deleteTicketFilteredViewAdm', async () => {
    await apiHelper.createFilteredView(authorizationToken, filteredViewName)
    await ticketsFilteredViewsPage.searchView(filteredViewName)
    const row = await ticketsFilteredViewsPage.fieldsTable.getRowByText(filteredViewName)
    await ticketsFilteredViewsPage.fieldsTable.openMenuInRow(row)
    await ticketsFilteredViewsPage.fieldsTable.selectOptionInDropdownMenu('Delete')
    await deleteModal.loadModal('Delete filtered view')
    await expect.soft(deleteModal.page.getByText(`By confirming this action, filtered view ${filteredViewName} will be deleted.`)).toBeVisible()
    await deleteModal.confirmModal()
    await expect.soft(ticketsFilteredViewsPage.viewDeletedMsg).toBeVisible()
    await ticketsFilteredViewsPage.searchView(filteredViewName)
    await expect.soft(ticketsFilteredViewsPage.fieldsTable.noSearchResultsHeader).toBeVisible()
})