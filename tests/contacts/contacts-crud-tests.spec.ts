import { ContactsSidebarComponent } from '@/components/app/contacts-sidebar-component'
import { SideMenuNavigationComponent } from '@/components/app/sidemenu-navigation-component'
import { AllContactsPage } from '@/pages/app/contacts/all-contacts/all-contacts-page'
import { ContactDetailsPage } from '@/pages/app/contacts/all-contacts/contact-details-page'
import { NewContactModal } from '@/pages/app/contacts/all-contacts/new-contact-modal'
import { DeleteContactModal } from '@/pages/app/contacts/all-contacts/delete-contact-modal'
import { APIContactsHelper } from '@/helpers/api-helpers/api-contacts-helper'
import { test } from '@/fixtures/start'
import { expect } from '@playwright/test'
import { ContactStatusId } from '@/helpers/api-helpers/contact-status-id'
import { dataProviderManager } from '@tests/data/DataManager'
import { Contact } from '@tests/data/ContactDataProvider'
import { DataProviderInterface } from '@tests/data/types'
import { DashboardPage } from '@/pages/app/dashboard-page'
import { APIOrganizationsHelper } from '@/helpers/api-helpers/api-organizations-helper'

let dashboardPage: DashboardPage
let allContactsPage: AllContactsPage
let contactDetailsPage: ContactDetailsPage
let sidemenuNavigationComponent: SideMenuNavigationComponent
let contactsSidebarComponent: ContactsSidebarComponent
let newContactModal: NewContactModal
let deleteContactModal: DeleteContactModal
let email: string
let password: string
let authorizationToken: string
let apiHelper: APIContactsHelper
let contactId: string
let contactDataProvider: DataProviderInterface<Contact>
let organizationId: string
let apiOrgHelper: APIOrganizationsHelper

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    dashboardPage = new DashboardPage(currentPage.page)
    sidemenuNavigationComponent = new SideMenuNavigationComponent(currentPage.page)
    contactsSidebarComponent = new ContactsSidebarComponent(currentPage.page)
    allContactsPage = new AllContactsPage(currentPage.page)
    newContactModal = new NewContactModal(currentPage.page)
    deleteContactModal = new DeleteContactModal(currentPage.page)
    contactDetailsPage = new ContactDetailsPage(currentPage.page)
    apiHelper = new APIContactsHelper()
    contactId = ''
    contactDataProvider = dataProviderManager.createProvider<Contact>('contact')
    organizationId = ''
    apiOrgHelper = new APIOrganizationsHelper()

    for (const userData of testDataHelper.users) {
        if (userData.test == 'contacts_crud') {
            email = userData.email
            password = userData.password
        }
    }
    authorizationToken = (
        await apiHelper.getAuthorizationToken(email, password)
    ).toString()
    await currentPage.logIn(email, password)
    await dashboardPage.loadPage([dashboardPage.ticketsBlock])
})

test('Create a new contact @all @smoke @contacts @createContact', async () => {
    await sidemenuNavigationComponent.navigateToCategory('contacts')
    await allContactsPage.loadPage([allContactsPage.newContactBtn])
    await contactsSidebarComponent.navigateToContactsCategory('all')
    await allContactsPage.openNewContact()
    await newContactModal.loadModal()
    await newContactModal.firstNameInput.fill(contactDataProvider.getField('firstName'))
    await newContactModal.lastNameInput.fill(contactDataProvider.getField('lastName'))
    await newContactModal.emailInput.fill(contactDataProvider.getField('email'))
    await newContactModal.phoneInput.fill(contactDataProvider.getField('phone'))
    await newContactModal.socialMediaInput.fill(contactDataProvider.getField('socialMedia'))
    await newContactModal.assigneeField.click()
    await newContactModal.defaultAssignee.click()
    await newContactModal.addOtherFieldsBtn.click()
    await newContactModal.countryInput.fill(contactDataProvider.getField('country'))
    await newContactModal.selectValueInDropdown(contactDataProvider.getField('country'))
    await newContactModal.statusSelect.click()
    await newContactModal.selectValueInDropdown(contactDataProvider.getField('status'))
    await newContactModal.confirmModal()
    await expect.soft(allContactsPage.contactCreatedMsg).toBeVisible()
    await allContactsPage.openContactDetails(contactDataProvider.getField('firstName'))
    await contactDetailsPage.loadContactDetailsPage(contactDataProvider.getField('firstName'))
    contactId = (await contactDetailsPage.getCurrentContactID()).toString()
    organizationId = await apiOrgHelper.getOrganizationIdByName(authorizationToken, contactDataProvider.getField('organization'))
    expect.soft(await contactDetailsPage.contactPageTitle.textContent()).toEqual(
        contactDataProvider.getField('firstName') +
        ' ' +
        contactDataProvider.getField('lastName'))
    expect.soft(await contactDetailsPage.contactLinkBreadcrumbs.innerText()).toEqual(
        contactDataProvider.getField('firstName') +
        ' ' +
        contactDataProvider.getField('lastName'))
    expect.soft(await contactDetailsPage.firstNameField.inputValue()).toEqual(contactDataProvider.getField('firstName'))
    expect.soft(await contactDetailsPage.lastNameField.inputValue()).toEqual(contactDataProvider.getField('lastName'))
    expect.soft(await contactDetailsPage.emailField.innerText()).toContain(contactDataProvider.getField('email'))
    expect.soft(await contactDetailsPage.phoneField.inputValue()).toEqual(contactDataProvider.getField('phone'))
    expect.soft(await contactDetailsPage.countryField.innerText()).toEqual(contactDataProvider.getField('country'))
    expect.soft(await contactDetailsPage.statusField.innerText()).toEqual(contactDataProvider.getField('status').toUpperCase())
    expect.soft(await contactDetailsPage.assigneeField.innerText()).toContain('Firstname258 Lastname258 (you)')
    expect.soft(await contactDetailsPage.socialMediaLink.getAttribute('href')).toContain(contactDataProvider.getField('socialMedia'))
    expect.soft((await contactDetailsPage.organizationLink.innerText()).toLowerCase()).toEqual(contactDataProvider.getField('organization').toLowerCase())
    expect.soft((await contactDetailsPage.organizationField.innerText()).toLowerCase()).toContain(contactDataProvider.getField('organization').toLowerCase())
})

test('Delete an existing contact @all @smoke @contacts @deleteContact', async () => {
    contactId = await apiHelper.createNewContact(authorizationToken, contactDataProvider.export(), ContactStatusId.CONTACT)
    organizationId = await apiOrgHelper.getOrganizationIdByName(authorizationToken, contactDataProvider.getField('organization'))
    await sidemenuNavigationComponent.navigateToCategory('contacts')
    await allContactsPage.loadPage([allContactsPage.newContactBtn])
    await allContactsPage.openContactDetails(contactDataProvider.getField('firstName'))
    await contactDetailsPage.loadContactDetailsPage(contactDataProvider.getField('firstName'))
    await contactDetailsPage.deleteContact()
    await deleteContactModal.loadModal()
    expect.soft(await deleteContactModal.contactFullName.textContent()).toEqual(
        contactDataProvider.getField('firstName') +
        ' ' +
        contactDataProvider.getField('lastName'))
    await deleteContactModal.confirmModal()
    await expect.soft(allContactsPage.contactDeletedMsg).toBeVisible()
    await allContactsPage.searchContact(
        contactDataProvider.getField('firstName') +
        ' ' +
        contactDataProvider.getField('lastName'))
    await expect.soft(allContactsPage.contactsTable.noSearchResultsHeader).toBeVisible()
})

test('Update an existing contact @all @smoke @contacts @updateContact', async () => {
    contactId = await apiHelper.createNewContact(authorizationToken, contactDataProvider.export(), ContactStatusId.CONTACT)
    await sidemenuNavigationComponent.navigateToCategory('contacts')
    await allContactsPage.loadPage([allContactsPage.newContactBtn])
    await allContactsPage.openContactDetails(contactDataProvider.getField('firstName'))
    await contactDetailsPage.loadContactDetailsPage(contactDataProvider.getField('firstName'))
    organizationId = await apiOrgHelper.getOrganizationIdByName(authorizationToken, contactDataProvider.getField('organization'))
    await contactDetailsPage.editBtn.click()

    contactDataProvider.setField('firstName')
    contactDataProvider.setField('lastName')
    contactDataProvider.setField('email')
    contactDataProvider.setField('phone')
    contactDataProvider.setField('country','Cyprus')
    contactDataProvider.setField('status', 'Contact')
    contactDataProvider.setField('organization','markets1271')
    contactDataProvider.setField('socialMedia')

    await newContactModal.loadModal()
    await newContactModal.firstNameInput.fill(contactDataProvider.getField('firstName'))
    await newContactModal.lastNameInput.fill(contactDataProvider.getField('lastName'))
    await newContactModal.emailInput.fill(contactDataProvider.getField('email'))
    await newContactModal.phoneInput.fill(contactDataProvider.getField('phone'))
    await newContactModal.socialMediaInput.fill(contactDataProvider.getField('socialMedia'))
    await newContactModal.assigneeField.click()
    await newContactModal.defaultAssignee.click()
    await newContactModal.addOtherFieldsBtn.click()
    await newContactModal.organizationSelect.fill(contactDataProvider.getField('organization'))
    await newContactModal.selectValueInDropdown(contactDataProvider.getField('organization'))
    await newContactModal.countryInput.fill(contactDataProvider.getField('country'))
    await newContactModal.selectValueInDropdown(contactDataProvider.getField('country'))
    await newContactModal.statusSelect.click()
    await newContactModal.selectValueInDropdown(contactDataProvider.getField('status'))
    await newContactModal.confirmModal()
    await expect.soft(allContactsPage.contactUpdatedMsg).toBeVisible()
    await contactDetailsPage.loadContactDetailsPage(contactDataProvider.getField('firstName'))
    expect.soft(await contactDetailsPage.contactPageTitle.innerText()).toEqual(
        contactDataProvider.getField('firstName') +
        ' ' +
        contactDataProvider.getField('lastName'))
    expect.soft(await contactDetailsPage.contactLinkBreadcrumbs.innerText()).toEqual(
        contactDataProvider.getField('firstName') +
        ' ' +
        contactDataProvider.getField('lastName'))
    expect.soft(await contactDetailsPage.firstNameField.inputValue()).toEqual(contactDataProvider.getField('firstName'))
    expect.soft(await contactDetailsPage.lastNameField.inputValue()).toEqual(contactDataProvider.getField('lastName'))
    expect.soft(await contactDetailsPage.emailField.innerText()).toContain(contactDataProvider.getField('email'))
    expect.soft(await contactDetailsPage.phoneField.inputValue()).toEqual(contactDataProvider.getField('phone'))
    expect.soft(await contactDetailsPage.countryField.innerText()).toEqual(contactDataProvider.getField('country'))
    expect.soft(await contactDetailsPage.statusField.innerText()).toEqual(contactDataProvider.getField('status').toUpperCase())
    expect.soft(await contactDetailsPage.assigneeField.innerText()).toContain('Firstname258 Lastname258 (you)')
    expect.soft(await contactDetailsPage.socialMediaLink.getAttribute('href')).toContain(contactDataProvider.getField('socialMedia'))
    expect.soft((await contactDetailsPage.organizationLink.innerText()).toLowerCase()).toEqual(contactDataProvider.getField('organization').toLowerCase())
    expect.soft((await contactDetailsPage.organizationField.innerText()).toLowerCase()).toContain(contactDataProvider.getField('organization').toLowerCase())
})

test.afterEach(async () => {
    contactDataProvider.clear()
    if (contactId != '') {
        await apiHelper.deleteContact(authorizationToken, contactId)
    }
    if (organizationId != '') {
        await apiOrgHelper.deleteOrganization(authorizationToken, organizationId)
    }
})
