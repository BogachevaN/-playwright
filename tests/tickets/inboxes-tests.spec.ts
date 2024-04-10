import { expect, test } from '@/fixtures/start'
import { DashboardPage } from '@/pages/app/dashboard-page'
import { HomePage } from '@/pages/admin/home-page'
import { SideMenuNavigationComponentAdm } from '@/components/admin/sidemenu-navigation-component-adm'
import { SettingsSidebarComponent } from '@/components/admin/settings-sidebar-component'
import { TicketsSettingsPage } from '@/pages/admin/settings/tickets/tickets-settings-page'
import { ConnectedInboxesPage } from '@/pages/admin/settings/tickets/connected-inboxes-page'
import { ConnectInboxPage } from '@/pages/admin/settings/tickets/connect-inbox-page'
import { ConnectedInboxSettingsPage } from '@/pages/admin/settings/tickets/connected-inbox-settings-page'
import { APITicketsSettingsHelper } from '@/helpers/api-helpers/api-tickets-settings-helper'
import { SenderPreviewModal } from '@/pages/admin/settings/tickets/sender-preview-modal'
import { DeleteInboxModal } from '@/pages/admin/settings/tickets/delete-inbox-modal'

let dashboardPage: DashboardPage
let email: string
let password: string
let apiHelper: APITicketsSettingsHelper
let authorizationToken: string
let homePage: HomePage
let sideMenuNavigationComponentAdm: SideMenuNavigationComponentAdm
let settingsSidebarComponent: SettingsSidebarComponent
let ticketsSettingsPage: TicketsSettingsPage
let connectedInboxesPage: ConnectedInboxesPage
let connectInboxPage: ConnectInboxPage
let touchpointInboxName: string
let connectedInboxSettingsPage: ConnectedInboxSettingsPage
let inboxId: string
let domain: string
let senderPreviewModal: SenderPreviewModal
let deleteInboxModal: DeleteInboxModal

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    dashboardPage = new DashboardPage(currentPage.page)
    apiHelper = new APITicketsSettingsHelper()
    homePage = new HomePage(currentPage.page)
    sideMenuNavigationComponentAdm = new SideMenuNavigationComponentAdm(currentPage.page)
    settingsSidebarComponent = new SettingsSidebarComponent(currentPage.page)
    ticketsSettingsPage = new TicketsSettingsPage(currentPage.page)
    connectedInboxesPage = new ConnectedInboxesPage(currentPage.page)
    connectInboxPage = new ConnectInboxPage(currentPage.page)
    touchpointInboxName = 'test.inbox.' + Math.round(Math.random() * 10000)
    connectedInboxSettingsPage = new ConnectedInboxSettingsPage(currentPage.page)
    inboxId = ''
    domain = '@test-workspace-257.touchpointtesting.com'
    senderPreviewModal = new SenderPreviewModal(currentPage.page)
    deleteInboxModal = new DeleteInboxModal(currentPage.page)

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
    await ticketsSettingsPage.connectedInboxesBlock.click()
    await connectedInboxesPage.loadPage()
})

test.afterEach(async () => {
    if (inboxId != '') {
        await apiHelper.deleteInbox(authorizationToken, inboxId)
    }
})

test('Create a new Touchpoint inbox @all @smoke @ticketsSettings @createTouchpointInbox', async () => {
    await connectedInboxesPage.connectNewInboxBtn.click()
    await connectInboxPage.loadPage()
    await connectInboxPage.createTouchpointInboxRadioBtn.click()
    await connectInboxPage.touchpointInboxNameInput.fill(touchpointInboxName)
    await connectInboxPage.continueBtn.click()
    expect.soft(await connectInboxPage.senderNameInput.inputValue()).toEqual('TestWorkspace257 Support')
    expect.soft(await connectInboxPage.senderNamePreview.innerText()).toEqual('firstName257 lastName257 (TestWorkspace257 Support)')
    expect.soft(await connectInboxPage.defaultAssigneeList.locator('.tp-ellipsis__in').innerText()).toEqual('Unassigned')
    await connectInboxPage.saveAndFinishBtn.click()
    await connectedInboxSettingsPage.loadPage([connectedInboxSettingsPage.senderNameInput])
    expect.soft(await connectedInboxSettingsPage.inboxName.innerHTML()).toEqual(touchpointInboxName + domain)
    inboxId = await connectedInboxSettingsPage.getInboxID()
    expect(await connectedInboxSettingsPage.getInboxCreatedMsg(touchpointInboxName)).toBeVisible()  
})

test('Update Touchpoint inbox @all @smoke @ticketsSettings @updateTouchpointInbox', async () => {
    inboxId = await apiHelper.createTouchpointInbox(authorizationToken, domain , touchpointInboxName)
    const row = await connectedInboxesPage.fieldsTable.getRowByText(touchpointInboxName + domain)
    await connectedInboxesPage.fieldsTable.openMenuInRow(row)
    await connectedInboxesPage.fieldsTable.selectOptionInDropdownMenu('View details')
    await connectedInboxSettingsPage.loadPage([connectedInboxSettingsPage.senderNameInput])
    await connectedInboxSettingsPage.senderNameInput.fill('TestWorkspace257 Support_edit')
    await connectedInboxSettingsPage.previewBtn.click()
    await senderPreviewModal.loadModal('Sender preview')
    expect.soft(await senderPreviewModal.senderName.innerText()).toEqual('firstName257 lastName257 (TestWorkspace257 Support_edit)')
    await senderPreviewModal.closeModal()
    await connectedInboxSettingsPage.addAgentNameCheckbox.click()
    await connectedInboxSettingsPage.previewBtn.click()
    await senderPreviewModal.loadModal('Sender preview')
    expect.soft(await senderPreviewModal.senderName.innerText()).toEqual('TestWorkspace257 Support_edit')
    await senderPreviewModal.closeModal()
    await connectedInboxSettingsPage.assignToInput.click()
    await connectedInboxSettingsPage.selectValueInDropdown('FirstName259 LastName259')
    await connectedInboxSettingsPage.saveBtn.click()
    await expect.soft(connectedInboxSettingsPage.inboxUpdatedMsg).toBeVisible()
})

test('Delete Touchpoint inbox @all @smoke @ticketsSettings @deleteTouchpointInbox', async () => {
    inboxId = await apiHelper.createTouchpointInbox(authorizationToken, domain , touchpointInboxName)
    const row = await connectedInboxesPage.fieldsTable.getRowByText(touchpointInboxName + domain)
    await (await connectedInboxesPage.getEmailFromRow(row)).click()
    await connectedInboxSettingsPage.loadPage([connectedInboxSettingsPage.senderNameInput])
    await connectedInboxSettingsPage.deleteBtn.click()
    await deleteInboxModal.loadModal('Delete inbox')
    await expect.soft(deleteInboxModal.textOnModalFirst).toBeVisible()
    await expect.soft(deleteInboxModal.textOnModalSecond).toBeVisible()
    await deleteInboxModal.confirmModal()
    connectedInboxesPage.loadPage()
    await expect.soft(connectedInboxesPage.inboxDeletedMsg).toBeVisible()
    await connectedInboxesPage.searchInbox(touchpointInboxName)
    await expect.soft(connectedInboxesPage.fieldsTable.noSearchResultsHeader).toBeVisible()
    inboxId = ''
})