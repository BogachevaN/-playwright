import { SideMenuNavigationComponent } from '@/components/app/sidemenu-navigation-component'
import { TicketsSidebarComponent } from '@/components/app/tickets-sidebar-component'
import { expect, test } from '@/fixtures/start'
import { APITicketsHelper } from '@/helpers/api-helpers/api-tickets-helper'
import { DeleteTicketModal } from '@/pages/app/tickets/delete-ticket-modal'
import { MoveTicketToTrashModal } from '@/pages/app/tickets/move-ticket-to-trash-modal'
import { NewTicketModal } from '@/pages/app/tickets/new-ticket-modal'
import { TicketDetailsPage } from '@/pages/app/tickets/ticket-details-page'
import { TicketsPage } from '@/pages/app/tickets/tickets-page'
import Mailosaur from 'mailosaur';
import { sendEmailFromMailosaur } from '@/helpers/email-helper'
import { envVars } from '@/helpers/environment-variables-helper'
import { APIInboxesHelper } from '@/helpers/api-helpers/api-inboxes-helper'
import { APIContactsHelper } from '@/helpers/api-helpers/api-contacts-helper'
import { dataProviderManager } from '@tests/data/DataManager'
import { Ticket } from '@tests/data/TicketDataProvider'
import { ContactDetailsPage } from '@/pages/app/contacts/all-contacts/contact-details-page'
import { DataProviderInterface } from '@tests/data/types'
import { DashboardPage } from '@/pages/app/dashboard-page'

let email: string
let password: string
let sidemenuNavigationComponent: SideMenuNavigationComponent
let ticketsSidebarComponent: TicketsSidebarComponent
let ticketsPage: TicketsPage
let ticketDetailsPage: TicketDetailsPage
let newTicketModal: NewTicketModal
let ticketId: string
let apiHelper: APITicketsHelper
let authorizationToken: string
let moveTicketToTrashModal : MoveTicketToTrashModal
let deleteTicketModal: DeleteTicketModal
let mailClient: Mailosaur
let apiInboxesHelper: APIInboxesHelper
let apiContactsHelper: APIContactsHelper
let contactDetailsPage: ContactDetailsPage
let ticketDataProvider: DataProviderInterface<Ticket>
let dashboardPage: DashboardPage

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    sidemenuNavigationComponent = new SideMenuNavigationComponent(currentPage.page)
    ticketsSidebarComponent = new TicketsSidebarComponent(currentPage.page)
    ticketsPage = new TicketsPage(currentPage.page)
    ticketDetailsPage = new TicketDetailsPage(currentPage.page)
    newTicketModal = new NewTicketModal(currentPage.page)
    moveTicketToTrashModal = new MoveTicketToTrashModal(currentPage.page)
    deleteTicketModal = new DeleteTicketModal(currentPage.page)
    apiHelper = new APITicketsHelper()
    mailClient = new Mailosaur(envVars.mailosaurApiKey)
    apiInboxesHelper = new APIInboxesHelper()
    apiContactsHelper = new APIContactsHelper()
    contactDetailsPage = new ContactDetailsPage(currentPage.page)
    ticketId = ''
    ticketDataProvider = dataProviderManager.createProvider<Ticket>('ticket')
    dashboardPage = new DashboardPage(currentPage.page)

    for (const user of testDataHelper.users) {
        if (user.test == 'tickets_crud') {
            email = user.email
            password = user.password
        }
    }
    authorizationToken = (await apiHelper.getAuthorizationToken(email, password)).toString()
    await currentPage.logIn(email, password)
    await dashboardPage.loadPage([dashboardPage.ticketsBlock])
})

test.afterEach(async () => {
    ticketDataProvider.clear()
    if (ticketId != '') {
        await apiHelper.markTrashTicket(authorizationToken, ticketId)
        await apiHelper.deleteTicket(authorizationToken, ticketId)
    }
})

test('Manual ticket creation @smoke @tickets @createTicketManual @all', async () => {
    await sidemenuNavigationComponent.navigateToCategory('tickets')
    await ticketsPage.loadPage([ticketsPage.newTicketBtn])
    await ticketsPage.newTicketBtn.click()
    await newTicketModal.loadModal('New ticket')
    await newTicketModal.subjectInput.fill(ticketDataProvider.getField('subject'))
    await newTicketModal.requesterList.click()
    await newTicketModal.selectValueInDropdown(ticketDataProvider.getField('requester'))
    await expect.soft(newTicketModal.inboxList.locator(`:has-text("${ticketDataProvider.getField('inbox')}")`)).toBeVisible()
    const assigneeValue = ticketDataProvider.getField('assignee') + ' (you)'
    await expect.soft(newTicketModal.assigneeList.locator(`.tp-ellipsis__in:has-text("${assigneeValue}")`)).toBeVisible()
    await expect.soft(newTicketModal.priorityList.locator(`.tp-priority--text:has-text("${ticketDataProvider.getField('priority')}")`)).toBeVisible()
    await newTicketModal.createDraftBtn.click()
    await expect.soft(ticketsPage.ticketCreatedMsg).toBeVisible()
    await ticketDetailsPage.loadPage([ticketDetailsPage.moreBtn])
    ticketId = (await ticketDetailsPage.getCurrentTicketID()).toString()
    expect.soft(await ticketDetailsPage.subjectInput.locator(`:has-text("${ticketDataProvider.getField('subject')}")`).first()).toBeVisible()
    expect.soft(await ticketDetailsPage.statusList.innerText()).toEqual('DRAFT')
    expect.soft(await ticketDetailsPage.assignedToList.innerText()).toEqual(assigneeValue)
    expect.soft(await ticketDetailsPage.priorityList.innerText()).toEqual(ticketDataProvider.getField('priority'))
    expect.soft(await ticketDetailsPage.inboxInput.innerHTML()).toEqual(ticketDataProvider.getField('inbox'))
    await ticketDetailsPage.contactTab.click()
    const requester = ticketDataProvider.getField('requester').split(" ")
    expect.soft(await contactDetailsPage.firstNameField.inputValue()).toEqual(requester[0])
    expect.soft(await contactDetailsPage.lastNameField.inputValue()).toEqual(requester[1])
})

test('Delete an existing ticket @smoke @tickets @deleteTicket @all', async () => {
    ticketId = await apiHelper.createNewTicket(authorizationToken, ticketDataProvider.export())
    await sidemenuNavigationComponent.navigateToCategory('tickets')
    await ticketsPage.loadPage([ticketsPage.newTicketBtn])
    await ticketsPage.openTicketDetails(ticketDataProvider.getField('subject'))
    await ticketDetailsPage.loadPage([ticketDetailsPage.moreBtn])
    await ticketDetailsPage.moreBtn.click()
    await ticketDetailsPage.deleteBtn.click()
    await moveTicketToTrashModal.loadModal('Move ticket to trash')
    await moveTicketToTrashModal.moveBtn.click()
    await expect.soft(ticketsPage.ticketMovedMsg).toBeVisible()
    await ticketsPage.searchTicket(ticketDataProvider.getField('subject'))
    await expect.soft(ticketsPage.fieldsTable.noSearchResultsHeader).toBeVisible()
    await ticketsSidebarComponent.deletedBtn.click()
    await expect.soft(ticketsPage.ticketsTable).toBeVisible()
    await ticketsPage.searchTicket(ticketDataProvider.getField('subject'))
    await expect.soft(ticketsPage.ticketsTable).toBeVisible()
    await ticketsPage.threeDotMenuBtn.click()
    await ticketsPage.deleteBtnInRow.click()
    await deleteTicketModal.loadModal('Delete ticket')
    await deleteTicketModal.deleteBtn.click()
    await expect.soft(ticketsPage.ticketDeletedMsg).toBeVisible()
    await ticketsPage.searchTicket(ticketDataProvider.getField('subject'))
    await expect.soft(ticketsPage.fieldsTable.noSearchResultsHeader).toBeVisible()
    ticketId = ''
})

test('Creating a ticket from email @smoke @tickets @createTicketFromEmail @all', async () => {
    const to = await apiInboxesHelper.getSupportEmail(authorizationToken)
    await sendEmailFromMailosaur(mailClient, to, ticketDataProvider.getField('subject'))
    await sidemenuNavigationComponent.navigateToCategory('tickets')
    await ticketsPage.loadPage([ticketsPage.newTicketBtn])
    await ticketsPage.openTicketDetails(ticketDataProvider.getField('subject'))
    await ticketDetailsPage.loadPage([ticketDetailsPage.moreBtn])
    ticketId = (await ticketDetailsPage.getCurrentTicketID()).toString()
    expect.soft(await ticketDetailsPage.subjectInput.locator(`:has-text("${ticketDataProvider.getField('subject')}")`).first()).toBeVisible()
    expect.soft(await ticketDetailsPage.statusList.innerText()).toEqual('NEW')
    expect.soft(await ticketDetailsPage.assignedToList.innerText()).toEqual('Unassigned')
    expect.soft(await ticketDetailsPage.priorityList.innerText()).toEqual(ticketDataProvider.getField('priority'))
    expect.soft(await ticketDetailsPage.inboxInput.innerHTML()).toEqual(ticketDataProvider.getField('inbox'))
    await ticketDetailsPage.contactTab.click()
    await ticketDetailsPage.contactEmailField.click()
    const contactEmail = await ticketDetailsPage.contactEmailInput.inputValue()
    expect.soft(contactEmail).toContain('rbi4rpic.mailosaur.net')
    await apiContactsHelper.deleteContactsFromMailosaur(authorizationToken)
})
