import { ContactsSidebarComponent } from '@/components/app/contacts-sidebar-component'
import { SideMenuNavigationComponent } from '@/components/app/sidemenu-navigation-component'
import { AllContactsPage } from '@/pages/app/contacts/all-contacts/all-contacts-page'
import { APIContactsHelper } from '@/helpers/api-helpers/api-contacts-helper'
import { test } from '@/fixtures/start'
import { expect } from '@playwright/test'
import { DashboardPage } from '@/pages/app/dashboard-page'
import { AllListsPage } from '@/pages/app/contacts/lists/all-lists-page'
import { NewListModal } from '@/pages/app/contacts/lists/new-list-modal'
import { ListDetailsPage } from '@/pages/app/contacts/lists/list-details-page'
import { DeleteListModal } from '@/pages/app/contacts/lists/delete-list-modal'

let dashboardPage: DashboardPage
let allContactsPage: AllContactsPage
let sideMenuNavigationComponent: SideMenuNavigationComponent
let contactsSidebarComponent: ContactsSidebarComponent
let email: string
let password: string
let authorizationToken: string
let apiHelper: APIContactsHelper
let listId: string
let allListsPage: AllListsPage
let newListModal: NewListModal
let listDetailsPage: ListDetailsPage
let listName: string
let deleteListModal: DeleteListModal

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    dashboardPage = new DashboardPage(currentPage.page)
    sideMenuNavigationComponent = new SideMenuNavigationComponent(currentPage.page)
    contactsSidebarComponent = new ContactsSidebarComponent(currentPage.page)
    allContactsPage = new AllContactsPage(currentPage.page)
    apiHelper = new APIContactsHelper()
    allListsPage = new AllListsPage(currentPage.page)
    listDetailsPage = new ListDetailsPage(currentPage.page)
    newListModal = new NewListModal(currentPage.page)
    listId = ''
    listName = 'Test list' + Math.round(Math.random() * 10000)
    deleteListModal = new DeleteListModal(currentPage.page)

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

test('Create a new list @all @smoke @contacts @createList', async () => {
    await sideMenuNavigationComponent.navigateToCategory('contacts')
    await allContactsPage.loadPage([allContactsPage.newContactBtn])
    await contactsSidebarComponent.navigateToContactsCategory('lists')
    await allListsPage.newListBtn.click()
    await newListModal.loadModal('New list')
    await newListModal.listNameInput.fill(listName)
    await newListModal.tagsInput.click()
    await newListModal.page.getByRole('option').getByText('tag1').click()
    await newListModal.tagsInput.blur()
    await newListModal.createBtn.click()
    await expect.soft(allListsPage.listCreatedMsg).toBeVisible()
    await listDetailsPage.loadPage([listDetailsPage.noContactInListText])
    listId = await listDetailsPage.getCurrentListID()
    expect.soft(await listDetailsPage.listTitle.innerHTML()).toEqual(listName)
    await allListsPage.open(allListsPage.baseUrl)
    await allListsPage.loadPage()
    const row = await allListsPage.listsTable.getRowByText(listName)
    const tag = await allListsPage.getTagFromRow(row)
    expect(tag).toEqual('tag1')
})

test('Delete an existing list @all @smoke @contacts @deleteList', async () => {
    listId = await apiHelper.createNewList(authorizationToken, listName)
    await allListsPage.open(allListsPage.baseUrl)
    await allListsPage.loadPage()
    const row = await allListsPage.listsTable.getRowByText(listName)
    await allListsPage.listsTable.openMenuInRow(row)
    await allListsPage.listsTable.selectOptionInDropdownMenu('Delete')
    await deleteListModal.loadModal('Delete list')
    await deleteListModal.confirmModal()
    await expect.soft(allListsPage.listDeletedMsg).toBeVisible()
    await allListsPage.searchList(listName)
    await expect(allListsPage.listsTable.noSearchResultsHeader).toBeVisible()
    listId = ''
})

test('Update an existing list @all @smoke @contacts @updateList', async () => {
    listId = await apiHelper.createNewList(authorizationToken, listName)
    await allListsPage.open(allListsPage.baseUrl)
    await allListsPage.loadPage()
    let row = await allListsPage.listsTable.getRowByText(listName)
    await allListsPage.listsTable.openMenuInRow(row)
    await allListsPage.listsTable.selectOptionInDropdownMenu('Edit details')
    await newListModal.loadModal('Edit list details')
    await newListModal.listNameInput.fill('Edit_' + listName)
    await newListModal.tagsInput.click()
    await newListModal.page.getByRole('option').getByText('tag1').click()
    await newListModal.tagsInput.blur()
    await newListModal.confirmModal()
    await expect.soft(allListsPage.listUpdatedMsg).toBeVisible()
    row = await allListsPage.listsTable.getRowByText('Edit_' + listName)
    expect.soft(row).not.toBeNull()
    const tag = await allListsPage.getTagFromRow(row)
    expect(tag).toEqual('tag1')
})

test.afterEach(async () => {
    if (listId != '') {
        await apiHelper.deleteList(authorizationToken, listId)
    }
})
