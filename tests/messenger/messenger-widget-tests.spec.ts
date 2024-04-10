import { expect, test } from '@/fixtures/start'
import { DashboardPage } from '@/pages/app/dashboard-page'
import { HomePage } from '@/pages/admin/home-page'
import { SideMenuNavigationComponentAdm } from '@/components/admin/sidemenu-navigation-component-adm'
import { SettingsSidebarComponent } from '@/components/admin/settings-sidebar-component'
import { MessengerSettingsPage } from '@/pages/admin/settings/messenger/messenger-settings-page'
import { MessengerWidgetsPage } from '@/pages/admin/settings/messenger/messenger-widgets-page'
import { APIMessengerHelper } from '@/helpers/api-helpers/api-messenger-helper'
import { NewWidgetModal } from '@/pages/admin/settings/messenger/new-widget-modal'
import { DeleteWidgetModal } from '@/pages/admin/settings/messenger/delete-widget-modal'

let dashboardPage: DashboardPage
let email: string
let password: string
let apiHelper: APIMessengerHelper
let authorizationToken: string
let homePage: HomePage
let sideMenuNavigationComponentAdm: SideMenuNavigationComponentAdm
let settingsSidebarComponent: SettingsSidebarComponent
let messengerSettingsPage: MessengerSettingsPage
let widgetsPage: MessengerWidgetsPage
let newWidgetModal: NewWidgetModal
let deleteWidgetModal: DeleteWidgetModal
let widgetId: string
let widgetName: string

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    dashboardPage = new DashboardPage(currentPage.page)
    apiHelper = new APIMessengerHelper()
    homePage = new HomePage(currentPage.page)
    sideMenuNavigationComponentAdm = new SideMenuNavigationComponentAdm(currentPage.page)
    settingsSidebarComponent = new SettingsSidebarComponent(currentPage.page)
    messengerSettingsPage = new MessengerSettingsPage(currentPage.page)
    widgetsPage = new MessengerWidgetsPage(currentPage.page)
    newWidgetModal = new NewWidgetModal(currentPage.page)
    deleteWidgetModal = new DeleteWidgetModal(currentPage.page)
    widgetId = ''
    widgetName = 'Test widget ' + Math.round(Math.random() * 10000)

    for (const user of testDataHelper.users) {
        if (user.test == 'widget_crud') {
            email = user.email
            password = user.password
        }
    }
    authorizationToken = (await apiHelper.getAuthorizationToken(email, password)).toString()
    await currentPage.logIn(email, password)
    await dashboardPage.loadPage([dashboardPage.ticketsBlock])
    await homePage.open(homePage.baseUrl)
    await sideMenuNavigationComponentAdm.settingsBtn.click()
    await settingsSidebarComponent.messengerBtn.click()
    await messengerSettingsPage.widgetsBlock.click()
    await widgetsPage.loadPage()
})

test.afterEach(async () => {
    if (widgetId != '') {
        await apiHelper.deleteWidget(authorizationToken, widgetId)
    }
})

test('Create new widget @all @smoke @messengerSettings @createWidget', async () => {
    await widgetsPage.newWidgetBtn.click()
    await newWidgetModal.loadModal('New widget')
    await newWidgetModal.widgetNameInput.fill(widgetName)
    const domain = await newWidgetModal.getDomainValue(widgetName)
    await newWidgetModal.domainInput.fill(domain)
    await newWidgetModal.confirmModal()
    await expect.soft(widgetsPage.widgetCreatedMsg).toBeVisible()
    widgetId = await apiHelper.getWidgetIdByWidgetName(authorizationToken, widgetName)
    await widgetsPage.searchWidget(widgetName)
    const row = await widgetsPage.fieldsTable.getRowByText(widgetName)
    expect.soft(row).toBeVisible()
    const actualDomain = await widgetsPage.getDomainFromRow(row)
    expect(domain).toEqual(actualDomain)
})

test('Update widget @all @smoke @messengerSettings @updateWidget', async () => {
    widgetId = await apiHelper.createNewWidget(authorizationToken, widgetName)
    let row = await widgetsPage.fieldsTable.getRowByText(widgetName)
    await widgetsPage.fieldsTable.openMenuInRow(row)
    await widgetsPage.fieldsTable.selectOptionInDropdownMenu('Edit details')
    await newWidgetModal.loadModal('Edit widget')
    const newWidgetName = widgetName + '-edit'
    await newWidgetModal.widgetNameInput.fill(newWidgetName)
    const newDomain = await newWidgetModal.getDomainValue(newWidgetName)
    await newWidgetModal.domainInput.fill(newDomain)
    await newWidgetModal.confirmModal()
    await expect.soft(widgetsPage.widgetUpdatedMsg).toBeVisible()
    await widgetsPage.searchWidget(newWidgetName)
    row = await widgetsPage.fieldsTable.getRowByText(newWidgetName)
    expect.soft(row).toBeVisible()
    const actualDomain = await widgetsPage.getDomainFromRow(row)
    expect(newDomain).toEqual(actualDomain)
})

test('Delete widget @all @smoke @messengerSettings @deleteWidget', async () => {
    widgetId = await apiHelper.createNewWidget(authorizationToken, widgetName)
    const row = await widgetsPage.fieldsTable.getRowByText(widgetName)
    await widgetsPage.fieldsTable.openMenuInRow(row)
    await widgetsPage.fieldsTable.selectOptionInDropdownMenu('Delete')
    await deleteWidgetModal.loadModal('Delete widget')
    await expect.soft(await deleteWidgetModal.getText(widgetName)).toBeVisible()
    await deleteWidgetModal.confirmModal()
    await expect.soft(widgetsPage.widgetDeletedMsg).toBeVisible()
    await widgetsPage.searchWidget(widgetName)
    await expect.soft(widgetsPage.noSearchResultsHeader).toBeVisible()
    widgetId = ''
})