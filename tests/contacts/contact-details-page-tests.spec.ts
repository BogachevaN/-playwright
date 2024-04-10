import { AllContactsPage } from '@/pages/app/contacts/all-contacts/all-contacts-page'
import { ContactDetailsPage } from '@/pages/app/contacts/all-contacts/contact-details-page'
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
let email: string
let password: string
let authorizationToken: string
let apiContactsHelper: APIContactsHelper
let apiOrgHelper: APIOrganizationsHelper
let contactId: string
let orgId: string
let contactDataProvider: DataProviderInterface<Contact>

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    dashboardPage = new DashboardPage(currentPage.page)
    allContactsPage = new AllContactsPage(currentPage.page)
    contactDetailsPage = new ContactDetailsPage(currentPage.page)
    apiContactsHelper = new APIContactsHelper()
    apiOrgHelper = new APIOrganizationsHelper()
    contactDataProvider = dataProviderManager.createProvider<Contact>('contact')
   
    for (const userData of testDataHelper.users) {
        if (userData.test == 'contacts_crud') {
            email = userData.email
            password = userData.password
        }
    }
    authorizationToken = (await apiContactsHelper.getAuthorizationToken(email, password)).toString()
    contactId = await apiContactsHelper.createNewContact(authorizationToken, contactDataProvider.export(), ContactStatusId.CONTACT)
    orgId = await apiOrgHelper.getOrganizationIdByName(authorizationToken, contactDataProvider.getField('organization'))
    await currentPage.logIn(email, password)
    await dashboardPage.loadPage([dashboardPage.ticketsBlock])
    await contactDetailsPage.open(allContactsPage.baseUrl + '/' + contactId)
    await contactDetailsPage.loadPage([contactDetailsPage.activeTab, contactDetailsPage.noOpenActivitiesText, 
        contactDetailsPage.collapsedNoteForm], 
        allContactsPage.baseUrl + '/' + contactId + '/activities')
})

test('Create a new internal note in contact @all @smoke @contacts @contactsDetailsPage @createContactNote', async () => {
    await contactDetailsPage.collapsedNoteForm.click()
    expect.soft(contactDetailsPage.noteForm).toBeVisible()
    await contactDetailsPage.noteForm.fill('New note')
    await contactDetailsPage.addNoteBtn.click()
    expect.soft(contactDetailsPage.noOpenActivitiesText).toBeVisible()
    expect.soft(contactDetailsPage.note).toBeVisible()
})

test('Update fullName in contact sidebar @all @smoke @contacts @contactsDetailsPage @updateFullNameInContactSidebar', async () => {
    contactDataProvider.setField('firstName')
    contactDataProvider.setField('lastName')

    await contactDetailsPage.firstNameField.fill(contactDataProvider.getField('firstName'))
    await contactDetailsPage.firstNameField.blur()
    await expect.soft(allContactsPage.contactUpdatedMsg).toBeVisible()
    expect.soft(await contactDetailsPage.firstNameField.inputValue()).toEqual(contactDataProvider.getField('firstName'))
   
    await contactDetailsPage.lastNameField.fill(contactDataProvider.getField('lastName'))
    await contactDetailsPage.lastNameField.blur()
    await expect.soft(allContactsPage.contactUpdatedMsg).toBeVisible()
    expect.soft(await contactDetailsPage.lastNameField.inputValue()).toEqual(contactDataProvider.getField('lastName'))
})

test('Update organization in contact sidebar @all @smoke @contacts @contactsDetailsPage @updateOrgInContactSidebar', async () => {
    contactDataProvider.setField('organization', 'markets1271')
    await contactDetailsPage.organizationField.click()
    await contactDetailsPage.organizationInput.fill(contactDataProvider.getField('organization'))
    await contactDetailsPage.selectValueInDropdown(contactDataProvider.getField('organization'))
    await expect.soft(allContactsPage.contactUpdatedMsg).toBeVisible()
    expect.soft((await contactDetailsPage.organizationField.innerText()).toLowerCase()).toContain(contactDataProvider.getField('organization').toLowerCase())
})

test('Add social media in contact sidebar @all @smoke @contacts @contactsDetailsPage @addSocialMediaInContactSidebar', async () => {
    await contactDetailsPage.socialMediaField.click()
    await contactDetailsPage.socialMediaInput.fill(contactDataProvider.getField('socialMedia'))
    await contactDetailsPage.sidebarFieldSaveBtn.click()
    await expect.soft(allContactsPage.contactUpdatedMsg).toBeVisible()
    expect.soft(await contactDetailsPage.socialMediaLink.getAttribute('href')).toContain(contactDataProvider.getField('socialMedia'))
})

test('Add assignee in contact sidebar @all @smoke @contacts @contactsDetailsPage @addAssigneeInContactSidebar', async () => {
    await contactDetailsPage.assigneeField.click()
    await contactDetailsPage.selectValueInDropdown('Firstname258 Lastname258 (you)')
    await expect.soft(allContactsPage.contactUpdatedMsg).toBeVisible()
    expect.soft(await contactDetailsPage.assigneeField.innerText()).toContain('Firstname258 Lastname258 (you)')
})

test('Update status in contact sidebar @all @smoke @contacts @contactsDetailsPage @updateStatusInContactSidebar', async () => {
    contactDataProvider.setField('status', 'Lead')
    await contactDetailsPage.statusField.click()
    await contactDetailsPage.selectValueInDropdown(contactDataProvider.getField('status'))
    await expect.soft(allContactsPage.contactUpdatedMsg).toBeVisible()
    expect.soft(await contactDetailsPage.statusField.innerText()).toEqual(contactDataProvider.getField('status').toUpperCase())
})

test('Update email in contact sidebar @all @smoke @contacts @contactsDetailsPage @updateEmailInContactSidebar', async () => {
    contactDataProvider.setField('email')
    await contactDetailsPage.emailField.click()
    await contactDetailsPage.emailInput.fill(contactDataProvider.getField('email'))
    await contactDetailsPage.sidebarFieldSaveBtn.click()
    await expect.soft(allContactsPage.contactUpdatedMsg).toBeVisible()
    expect.soft(await contactDetailsPage.emailField.innerText()).toContain(contactDataProvider.getField('email'))
})

test('Update phone in contact sidebar @all @smoke @contacts @contactsDetailsPage @updatePhoneInContactSidebar', async () => {
    contactDataProvider.setField('phone')
    await contactDetailsPage.phoneField.fill(contactDataProvider.getField('phone'))
    await contactDetailsPage.phoneField.blur()
    await expect.soft(allContactsPage.contactUpdatedMsg).toBeVisible()
    expect.soft(await contactDetailsPage.phoneField.inputValue()).toEqual(contactDataProvider.getField('phone'))
})

test('Add country in contact sidebar @all @smoke @contacts @contactsDetailsPage @addCountryInContactSidebar', async () => {
    contactDataProvider.setField('country','Cyprus')
    await contactDetailsPage.countryInput.fill(contactDataProvider.getField('country'))
    await contactDetailsPage.selectValueInDropdown(contactDataProvider.getField('country'))
    await expect.soft(allContactsPage.contactUpdatedMsg).toBeVisible()
    expect.soft(await contactDetailsPage.countryField.innerText()).toEqual(contactDataProvider.getField('country'))
})

test('Add timezone in contact sidebar @all @smoke @contacts @contactsDetailsPage @addTimezoneInContactSidebar', async () => {
    contactDataProvider.setField('timezone')
    await contactDetailsPage.timezoneField.click()
    await contactDetailsPage.selectValueInDropdown(contactDataProvider.getField('timezone'))
    await expect.soft(allContactsPage.contactUpdatedMsg).toBeVisible()
    expect.soft(await contactDetailsPage.timezoneField.innerText()).toContain(contactDataProvider.getField('timezone'))
})

test('Add lists in contact sidebar @all @smoke @contacts @contactsDetailsPage @addListsInContactSidebar', async () => {
    await contactDetailsPage.listsField.click()
    await contactDetailsPage.selectValueInDropdown('Test list1')
    await expect.soft(allContactsPage.contactUpdatedMsg).toBeVisible()
    expect.soft(await contactDetailsPage.listBadge.innerText()).toContain('Test list1')
})

test('Add tags in contact sidebar @all @smoke @contacts @contactsDetailsPage @addTagsInContactSidebar', async () => {
    await contactDetailsPage.tagsInput.click()
    await contactDetailsPage.selectValueInDropdown('tag1')
    await contactDetailsPage.sidebarFieldSaveBtn.click()
    await expect.soft(allContactsPage.contactUpdatedMsg).toBeVisible()
    expect.soft(await contactDetailsPage.tagBadge.innerText()).toEqual('tag1')
})

test('Add followers in contact sidebar @all @smoke @contacts @contactsDetailsPage @addFollowersInContactSidebar', async () => {
    await contactDetailsPage.followersField.click()
    await contactDetailsPage.selectValueInDropdown('FirstName258 LastName258')
    await contactDetailsPage.followersInput.click()
    await contactDetailsPage.sidebarFieldSaveBtn.click()
    await expect.soft(allContactsPage.contactUpdatedMsg).toBeVisible()
    await contactDetailsPage.followersField.getByText('F').first().hover()
    expect(contactDetailsPage.page.locator('.tp-tooltip__main:text("FirstName258 LastName258")')).toBeVisible()    
})

test.afterEach(async () => {
    contactDataProvider.clear()
    if (contactId != '') {
        await apiContactsHelper.deleteContact(authorizationToken, contactId)
    }
    if (orgId != '') {
        await apiOrgHelper.deleteOrganization(authorizationToken, orgId)
    }
})
