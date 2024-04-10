import { expect, test } from '@/fixtures/start'
import { DashboardPage } from '@/pages/app/dashboard-page'
import { HomePage } from '@/pages/admin/home-page'
import { SideMenuNavigationComponentAdm } from '@/components/admin/sidemenu-navigation-component-adm'
import { SettingsSidebarComponent } from '@/components/admin/settings-sidebar-component'
import { APIContactsSettingsHelper } from '@/helpers/api-helpers/api-contacts-settings-helper'
import { ContactsSettingsPage } from '@/pages/admin/settings/contacts/contacts-settings-page'
import { ContactsStatusesPage } from '@/pages/admin/settings/contacts/contacts-statuses-page'
import { NewContactStatusModal } from '@/pages/admin/settings/contacts/new-contact-status-modal'
import { DeleteContactStatusModal } from '@/pages/admin/settings/contacts/delete-contact-status-modal'

let dashboardPage: DashboardPage
let email: string
let password: string
let apiHelper: APIContactsSettingsHelper
let authorizationToken: string
let homePage: HomePage
let sideMenuNavigationComponentAdm: SideMenuNavigationComponentAdm
let settingsSidebarComponent: SettingsSidebarComponent
let contactsSettingsPage: ContactsSettingsPage
let contactsStatusesPage: ContactsStatusesPage
let newContactStatusModal: NewContactStatusModal
let statusId: string
let deleteContactStatusModal: DeleteContactStatusModal

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    dashboardPage = new DashboardPage(currentPage.page)
    apiHelper = new APIContactsSettingsHelper()
    homePage = new HomePage(currentPage.page)
    sideMenuNavigationComponentAdm = new SideMenuNavigationComponentAdm(currentPage.page)
    settingsSidebarComponent = new SettingsSidebarComponent(currentPage.page)
    contactsSettingsPage = new ContactsSettingsPage(currentPage.page)
    contactsStatusesPage = new ContactsStatusesPage(currentPage.page)
    newContactStatusModal = new NewContactStatusModal(currentPage.page)
    statusId = ''
    deleteContactStatusModal = new DeleteContactStatusModal(currentPage.page)

    for (const user of testDataHelper.users) {
        if (user.test == 'contacts_crud') {
            email = user.email
            password = user.password
        }
    }
    authorizationToken = (await apiHelper.getAuthorizationToken(email, password)).toString()
    await currentPage.logIn(email, password)
    await dashboardPage.loadPage([dashboardPage.ticketsBlock])
    await homePage.open(homePage.baseUrl)
    await sideMenuNavigationComponentAdm.settingsBtn.click()
    await settingsSidebarComponent.contactsBtn.click()
    await contactsSettingsPage.statusesBlock.click()
    await contactsStatusesPage.loadPage()
})

test.afterEach(async () => {
    if (statusId != '') {
        await apiHelper.deleteContactStatus(authorizationToken, statusId)
    }
})

test('Create new contact status @all @smoke @contactsSettings @createContactStatus', async () => {
    const statusName = 'Test status ' + Math.round(Math.random() * 10000)
    await contactsStatusesPage.addNewStatusBtn.click()
    await newContactStatusModal.loadModal('New contact status')
    await newContactStatusModal.statusInput.fill(statusName)
    expect.soft(await newContactStatusModal.preview.innerText()).toEqual(statusName.toUpperCase())
    await newContactStatusModal.confirmModal()
    await expect.soft(contactsStatusesPage.statusCreatedMsg).toBeVisible()
    statusId = await apiHelper.getStatusIdByStatusName(authorizationToken, statusName)
    expect(await contactsStatusesPage.getStatusByName(statusName)).toBeVisible()
})

test('Update contact status @all @smoke @contactsSettings @updateContactStatus', async () => {
    const statusName = 'Test status ' + Math.round(Math.random() * 10000)
    statusId = await apiHelper.createContactStatus(authorizationToken, statusName)
    await contactsStatusesPage.page.reload()
    await (await contactsStatusesPage.getStatusByName(statusName)).click()
    await newContactStatusModal.loadModal('Edit contact status')
    const newStatusName = statusName + '_edit'
    await newContactStatusModal.statusInput.fill(newStatusName)
    await newContactStatusModal.preview.click()
    expect.soft(await newContactStatusModal.preview.innerText()).toEqual(newStatusName.toUpperCase())
    await newContactStatusModal.confirmModal()
    await expect.soft(contactsStatusesPage.statusUpdatedMsg).toBeVisible()
    expect(await contactsStatusesPage.getStatusByName(newStatusName)).toBeVisible()
})

//PRO-8202
test.skip('Delete contact status @all @smoke @contactsSettings @deleteContactStatus', async () => {
    const statusName = 'TestStatus' + Math.round(Math.random() * 10000)
    statusId = await apiHelper.createContactStatus(authorizationToken, statusName)
    await contactsStatusesPage.page.reload()
    await (await contactsStatusesPage.getStatusByName(statusName)).hover()
    await (await contactsStatusesPage.getDeleteBtnByName(statusName)).click()
    await deleteContactStatusModal.loadModal('Delete contact status')
    await deleteContactStatusModal.confirmModal()
    await expect.soft(contactsStatusesPage.statusDeletedMsg).toBeVisible()
    expect(await contactsStatusesPage.getStatusByName(statusName)).not.toBeVisible()
    statusId = ''
})