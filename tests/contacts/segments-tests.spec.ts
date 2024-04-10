import { ContactsSidebarComponent } from '@/components/app/contacts-sidebar-component'
import { SideMenuNavigationComponent } from '@/components/app/sidemenu-navigation-component'
import { AllContactsPage } from '@/pages/app/contacts/all-contacts/all-contacts-page'
import { APIContactsHelper } from '@/helpers/api-helpers/api-contacts-helper'
import { test } from '@/fixtures/start'
import { expect } from '@playwright/test'
import { DashboardPage } from '@/pages/app/dashboard-page'
import { AllSegmentsPage } from '@/pages/app/contacts/segments/all-segments-page'
import { NewSegmentModal } from '@/pages/app/contacts/segments/new-segment-modal'
import { SegmentDetailsPage } from '@/pages/app/contacts/segments/segment-details-page'
import { DeleteSegmentModal } from '@/pages/app/contacts/segments/delete-segment-modal'

let dashboardPage: DashboardPage
let allContactsPage: AllContactsPage
let sideMenuNavigationComponent: SideMenuNavigationComponent
let contactsSidebarComponent: ContactsSidebarComponent
let email: string
let password: string
let authorizationToken: string
let apiHelper: APIContactsHelper
let segmentId: string
let segmentDetailsPage: SegmentDetailsPage
let segmentName: string
let deleteSegmentModal: DeleteSegmentModal
let allSegmentsPage: AllSegmentsPage
let newSegmentModal: NewSegmentModal

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    dashboardPage = new DashboardPage(currentPage.page)
    sideMenuNavigationComponent = new SideMenuNavigationComponent(currentPage.page)
    contactsSidebarComponent = new ContactsSidebarComponent(currentPage.page)
    allContactsPage = new AllContactsPage(currentPage.page)
    apiHelper = new APIContactsHelper()
    segmentDetailsPage = new SegmentDetailsPage(currentPage.page)
    segmentId = ''
    segmentName = 'Test segment' + Math.round(Math.random() * 10000)
    deleteSegmentModal = new DeleteSegmentModal(currentPage.page)
    allSegmentsPage = new AllSegmentsPage(currentPage.page)
    newSegmentModal = new NewSegmentModal(currentPage.page)

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

test('Create a new segment @all @smoke @contacts @createSegment', async () => {
    await sideMenuNavigationComponent.navigateToCategory('contacts')
    await allContactsPage.loadPage([allContactsPage.newContactBtn])
    await contactsSidebarComponent.navigateToContactsCategory('segments')
    await allSegmentsPage.newSegmentBtn.click()
    await newSegmentModal.loadModal('New segment')
    await newSegmentModal.segmentNameInput.fill(segmentName)
    await newSegmentModal.tagsInput.click()
    await newSegmentModal.page.getByRole('option').getByText('tag1').click()
    await newSegmentModal.tagsInput.blur()
    await newSegmentModal.createBtn.click()
    await expect.soft(allSegmentsPage.segmentCreatedMsg).toBeVisible()
    await segmentDetailsPage.loadPage([segmentDetailsPage.messageText])
    segmentId = await segmentDetailsPage.getCurrentSegmentID()
    expect.soft(await segmentDetailsPage.segmentTitle.innerHTML()).toEqual(segmentName)
    await allSegmentsPage.open(allSegmentsPage.baseUrl)
    await allSegmentsPage.loadPage()
    const row = await allSegmentsPage.segmentsTable.getRowByText(segmentName)
    const tag = await allSegmentsPage.getTagFromRow(row)
    expect(tag).toEqual('tag1')
})

test('Delete an existing segment @all @smoke @contacts @deleteSegment', async () => {
    segmentId = await apiHelper.createNewSegment(authorizationToken, segmentName)
    await allSegmentsPage.open(allSegmentsPage.baseUrl)
    await allSegmentsPage.loadPage()
    const row = await allSegmentsPage.segmentsTable.getRowByText(segmentName)
    await allSegmentsPage.segmentsTable.openMenuInRow(row)
    await allSegmentsPage.segmentsTable.selectOptionInDropdownMenu('Delete')
    await deleteSegmentModal.loadModal('Delete segment')
    expect(await deleteSegmentModal.getFormText(segmentName)).toBeVisible()
    await deleteSegmentModal.confirmModal()
    await expect.soft(allSegmentsPage.segmentDeletedMsg).toBeVisible()
    await allSegmentsPage.searchSegment(segmentName)
    await expect(allSegmentsPage.segmentsTable.noSearchResultsHeader).toBeVisible()
    segmentId = ''
})

test('Update an existing segment @all @smoke @contacts @updateSegment', async () => {
    segmentId = await apiHelper.createNewSegment(authorizationToken, segmentName)
    await allSegmentsPage.open(allSegmentsPage.baseUrl)
    await allSegmentsPage.loadPage()
    let row = await allSegmentsPage.segmentsTable.getRowByText(segmentName)
    await allSegmentsPage.segmentsTable.openMenuInRow(row)
    await allSegmentsPage.segmentsTable.selectOptionInDropdownMenu('Edit')
    await newSegmentModal.loadModal('Edit segment details')
    await newSegmentModal.segmentNameInput.fill('Edit_' + segmentName)
    await newSegmentModal.tagsInput.click()
    await newSegmentModal.page.getByRole('option').getByText('tag1').click()
    await newSegmentModal.tagsInput.blur()
    await newSegmentModal.confirmModal()
    await expect.soft(allSegmentsPage.segmentUpdatedMsg).toBeVisible()
    row = await allSegmentsPage.segmentsTable.getRowByText('Edit_' + segmentName)
    expect.soft(row).not.toBeNull()
    const tag = await allSegmentsPage.getTagFromRow(row)
    expect(tag).toEqual('tag1')
})

test.afterEach(async () => {
    if (segmentId != '') {
        await apiHelper.deleteSegment(authorizationToken, segmentId)
    }
})
