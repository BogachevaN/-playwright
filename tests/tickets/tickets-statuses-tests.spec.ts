import { expect, test } from '@/fixtures/start'
import { DashboardPage } from '@/pages/app/dashboard-page'
import { HomePage } from '@/pages/admin/home-page'
import { SideMenuNavigationComponentAdm } from '@/components/admin/sidemenu-navigation-component-adm'
import { SettingsSidebarComponent } from '@/components/admin/settings-sidebar-component'
import { TicketsSettingsPage } from '@/pages/admin/settings/tickets/tickets-settings-page'
import { TicketsStatusesPage } from '@/pages/admin/settings/tickets/tickets-statuses-page'
import { NewTicketStatusModal } from '@/pages/admin/settings/tickets/new-ticket-status-modal'
import { APITicketsSettingsHelper } from '@/helpers/api-helpers/api-tickets-settings-helper'
import { DeleteTicketStatusModal } from '@/pages/admin/settings/tickets/delete-ticket-status-modal'

let dashboardPage: DashboardPage
let email: string
let password: string
let apiHelper: APITicketsSettingsHelper
let authorizationToken: string
let homePage: HomePage
let sideMenuNavigationComponentAdm: SideMenuNavigationComponentAdm
let settingsSidebarComponent: SettingsSidebarComponent
let ticketsSettingsPage: TicketsSettingsPage
let ticketsStatusesPage: TicketsStatusesPage
let newTicketStatusModal: NewTicketStatusModal
let statusId: string
let deleteTicketStatusModal: DeleteTicketStatusModal

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    dashboardPage = new DashboardPage(currentPage.page)
    apiHelper = new APITicketsSettingsHelper()
    homePage = new HomePage(currentPage.page)
    sideMenuNavigationComponentAdm = new SideMenuNavigationComponentAdm(currentPage.page)
    settingsSidebarComponent = new SettingsSidebarComponent(currentPage.page)
    ticketsSettingsPage = new TicketsSettingsPage(currentPage.page)
    ticketsStatusesPage = new TicketsStatusesPage(currentPage.page)
    newTicketStatusModal = new NewTicketStatusModal(currentPage.page)
    statusId = ''
    deleteTicketStatusModal = new DeleteTicketStatusModal(currentPage.page)

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
    await ticketsSettingsPage.statusesBlock.click()
    await ticketsStatusesPage.loadPage()
})

test.afterEach(async () => {
    if (statusId != '') {
        await apiHelper.deleteTicketStatus(authorizationToken, statusId)
    }
})

test('Create new ticket status @all @smoke @ticketsSettings @createTicketStatus', async () => {
    const statusName = 'Test status ' + Math.round(Math.random() * 10000)
    await ticketsStatusesPage.addNewStatusBtn.click()
    await newTicketStatusModal.loadModal('New ticket status')
    await newTicketStatusModal.statusInput.fill(statusName)
    expect.soft(await newTicketStatusModal.preview.innerText()).toEqual(statusName.toUpperCase())
    await newTicketStatusModal.confirmModal()
    await expect.soft(ticketsStatusesPage.statusCreatedMsg).toBeVisible()
    statusId = await apiHelper.getIdByStatusName(authorizationToken, statusName)
    expect(await ticketsStatusesPage.getStatusByName(statusName)).toBeVisible()
})

test('Update ticket status @all @smoke @ticketsSettings @updateTicketStatus', async () => {
    const statusName = 'Test status ' + Math.round(Math.random() * 10000)
    statusId = await apiHelper.createTicketStatus(authorizationToken, statusName)
    await ticketsStatusesPage.page.reload()
    await (await ticketsStatusesPage.getStatusByName(statusName)).click()
    const newStatusName = statusName + '_edit'
    await newTicketStatusModal.statusInput.fill(newStatusName)
    await newTicketStatusModal.preview.click()
    expect.soft(await newTicketStatusModal.preview.innerText()).toEqual(newStatusName.toUpperCase())
    await newTicketStatusModal.confirmModal()
    await expect.soft(ticketsStatusesPage.statusUpdatedMsg).toBeVisible()
    expect(await ticketsStatusesPage.getStatusByName(newStatusName)).toBeVisible()
})

test('Delete ticket status @all @smoke @ticketsSettings @deleteTicketStatus', async () => {
    const statusName = 'TestStatus' + Math.round(Math.random() * 10000)
    statusId = await apiHelper.createTicketStatus(authorizationToken, statusName)
    await ticketsStatusesPage.page.reload()
    await (await ticketsStatusesPage.getStatusByName(statusName)).hover()
    await (await ticketsStatusesPage.getDeleteBtnByName(statusName)).click()
    await deleteTicketStatusModal.loadModal('Delete ticket status')
    await deleteTicketStatusModal.confirmModal()
    await expect.soft(ticketsStatusesPage.statusDeletedMsg).toBeVisible()
    expect.soft(await ticketsStatusesPage.getStatusByName(statusName)).not.toBeVisible()
    statusId = ''
})