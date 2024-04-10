import { expect, test } from '@/fixtures/start'
import { AllContactsPage } from '@/pages/app/contacts/all-contacts/all-contacts-page'
import { OrganizationsPage } from '@/pages/app/contacts/organizations/organizations-page'
import { OrganizationDetailsPage } from '@/pages/app/contacts/organizations/organization-details-page'
import { NewOrganizationModal } from '@/pages/app/contacts/organizations/new-organization-modal'
import { DeleteOrganizationModal } from '@/pages/app/contacts/organizations/delete-organization-modal'
import { EditOrganizationModal } from '@/pages/app/contacts/organizations/edit-organization-modal'
import { SideMenuNavigationComponent } from '@/components/app/sidemenu-navigation-component'
import { ContactsSidebarComponent } from '@/components/app/contacts-sidebar-component'
import { APIOrganizationsHelper } from '@/helpers/api-helpers/api-organizations-helper'
import { dataProviderManager } from '@tests/data/DataManager'
import { Organization } from '@tests/data/OrganizationDataProvider'
import { DataProviderInterface } from '../data/types'
import { DashboardPage } from '@/pages/app/dashboard-page'

let dashboardPage: DashboardPage
let allContactsPage: AllContactsPage
let organizationsPage: OrganizationsPage
let organizationsDetailsPage: OrganizationDetailsPage
let newOrganizationModal: NewOrganizationModal
let deleteOrganizationModal: DeleteOrganizationModal
let editOrganizationModal: EditOrganizationModal
let sidemenuNavigationComponent: SideMenuNavigationComponent
let contactsSidebarComponent: ContactsSidebarComponent
let email: string
let password: string
let apiHelper: APIOrganizationsHelper
let authorizationToken: string
let organizationId: string
let orgDataProvider: DataProviderInterface<Organization>

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    dashboardPage = new DashboardPage(currentPage.page)
    allContactsPage = new AllContactsPage(currentPage.page)
    sidemenuNavigationComponent = new SideMenuNavigationComponent(currentPage.page)
    contactsSidebarComponent = new ContactsSidebarComponent(currentPage.page)
    organizationsPage = new OrganizationsPage(currentPage.page)
    organizationsDetailsPage = new OrganizationDetailsPage(currentPage.page)
    newOrganizationModal = new NewOrganizationModal(currentPage.page)
    editOrganizationModal = new EditOrganizationModal(currentPage.page)
    deleteOrganizationModal = new DeleteOrganizationModal(currentPage.page)
    apiHelper = new APIOrganizationsHelper()
    organizationId = ''
    orgDataProvider = dataProviderManager.createProvider<Organization>('organization')

    for (const user of testDataHelper.users) {
        if (user.test == 'organizations_crud') {
            email = user.email
            password = user.password
        }
    }
    authorizationToken = (await apiHelper.getAuthorizationToken(email, password)).toString()
    await currentPage.logIn(email, password)
    await dashboardPage.loadPage([dashboardPage.ticketsBlock])
})

test.afterEach(async () => {
    orgDataProvider.clear()
    if (organizationId != '') {
        await apiHelper.deleteOrganization(authorizationToken, organizationId)
    }
})

//PRO-6804 
test('Create a new organization @all @smoke @organizations @createOrganization', async () => {
    await sidemenuNavigationComponent.navigateToCategory("contacts")
    await allContactsPage.loadPage([allContactsPage.newContactBtn])
    await contactsSidebarComponent.navigateToContactsCategory("organizations")
    await organizationsPage.newOrganizationBtn.click()
    await newOrganizationModal.loadModal('New organization')
    await newOrganizationModal.nameInput.fill(orgDataProvider.getField('name'))
    await newOrganizationModal.domainsInput.fill(orgDataProvider.getField('domain'))
    await newOrganizationModal.countryInput.fill(orgDataProvider.getField('country'))
    await organizationsPage.selectValueInDropdown(orgDataProvider.getField('country'))
    await newOrganizationModal.assigneeInput.click()
    await organizationsPage.selectValueInDropdown(orgDataProvider.getField('assignee'))
    await newOrganizationModal.emailLink.click()
    await newOrganizationModal.emailInput.fill(orgDataProvider.getField('email'))
    await newOrganizationModal.phoneInput.fill(orgDataProvider.getField('phone'))
    await newOrganizationModal.timezoneInput.click()
    await newOrganizationModal.timezoneInput.fill(orgDataProvider.getField('timezone'))
    await organizationsPage.selectValueInDropdown(orgDataProvider.getField('timezone'))
    await newOrganizationModal.confirmModal();
    await expect.soft(organizationsPage.organizationCreatedMsg).toBeVisible()
    await organizationsPage.openOrganizationDetails(orgDataProvider.getField('name'))
    await organizationsDetailsPage.loadOrgPage(orgDataProvider.getField('name'))
    organizationId = (await organizationsDetailsPage.getCurrentOrganizationID()).toString()
    expect.soft(await organizationsDetailsPage.assignedToInput.innerText()).toEqual(orgDataProvider.getField('assignee'))
    expect.soft((await organizationsDetailsPage.domainsField.innerHTML())).toEqual(orgDataProvider.getField('domain').toLowerCase())
    expect.soft(await organizationsDetailsPage.phoneNumberInput.inputValue()).toEqual(orgDataProvider.getField('phone'))
    expect.soft(await organizationsDetailsPage.emailInput.inputValue()).toEqual(orgDataProvider.getField('email'))
    expect.soft(await organizationsDetailsPage.countryInput.innerText()).toEqual(orgDataProvider.getField('country'))
    await organizationsDetailsPage.localTimeInput.click()
    //PRO-6804 раскоментить после исправления бага
    //expect.soft(await organizationsDetailsPage.localTimeSelectedValue.innerText()).toContain(orgDataProvider.getField('timezone'))
})

test('Delete an existing organization @all @smoke @organizations @deleteOrganization', async () => {
    organizationId = await apiHelper.createNewOrganization(authorizationToken, orgDataProvider.export())
    await sidemenuNavigationComponent.navigateToCategory("contacts")
    await allContactsPage.loadPage([allContactsPage.newContactBtn])
    await contactsSidebarComponent.navigateToContactsCategory("organizations")
    await organizationsPage.loadPage([organizationsPage.newOrganizationBtn])
    await organizationsPage.openOrganizationDetails(orgDataProvider.getField('name'))
    await organizationsDetailsPage.loadOrgPage(orgDataProvider.getField('name'))
    await organizationsDetailsPage.moreBtn.click()
    await organizationsDetailsPage.deleteBtn.click()
    await deleteOrganizationModal.loadModal()
    await deleteOrganizationModal.deleteOrganizationBtn.click()
    await expect.soft(organizationsPage.organizationDeletedMsg).toBeVisible()
    await organizationsPage.searchOrganization(orgDataProvider.getField('name'))
    await expect.soft(organizationsPage.noSearchResultsHeader).toBeVisible()
})

test('Update an existing organization @all @smoke @organizations @updateOrganization', async () => {
    organizationId = await apiHelper.createNewOrganization(authorizationToken, orgDataProvider.export())
    await sidemenuNavigationComponent.navigateToCategory("contacts")
    await allContactsPage.loadPage([allContactsPage.newContactBtn])
    await contactsSidebarComponent.navigateToContactsCategory("organizations")
    await organizationsPage.loadPage([organizationsPage.newOrganizationBtn])
    await organizationsPage.openOrganizationDetails(orgDataProvider.getField('name'))
    await organizationsDetailsPage.loadOrgPage(orgDataProvider.getField('name'))
    await organizationsDetailsPage.editBtn.click()

    orgDataProvider.setField('name')
    orgDataProvider.setField('domain')
    orgDataProvider.setField('email')
    orgDataProvider.setField('phone')
    await editOrganizationModal.loadModal('Edit organization')
    await editOrganizationModal.nameInput.fill(orgDataProvider.getField('name'))
    await editOrganizationModal.domainsInput.fill(orgDataProvider.getField('domain'))
    await editOrganizationModal.emailLink.click()
    await editOrganizationModal.emailInput.fill(orgDataProvider.getField('email'))
    await editOrganizationModal.phoneInput.fill(orgDataProvider.getField('phone'))
    await editOrganizationModal.saveBtn.click()
    await expect.soft(organizationsPage.organizationUpdatedMsg).toBeVisible()
    await organizationsDetailsPage.loadOrgPage(orgDataProvider.getField('name'))
    expect.soft((await organizationsDetailsPage.domainsField.innerHTML())).toEqual(orgDataProvider.getField('domain').toLowerCase())
    expect.soft(await organizationsDetailsPage.phoneNumberInput.inputValue()).toEqual(orgDataProvider.getField('phone'))
    expect.soft(await organizationsDetailsPage.emailInput.inputValue()).toEqual(orgDataProvider.getField('email'))
})
