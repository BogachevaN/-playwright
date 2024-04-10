import { EmailConfirmationPage } from '@/pages/registration/email-confirmation-page'
import { CreateWorkspacePage } from '@/pages/registration/create-workspace-page'
import { CompanyInfoPage } from '@/pages/registration/company-info-page'
import { InviteTeamPage } from '@/pages/registration/invite-team-page'
import Mailosaur from 'mailosaur'
import { envVars } from '@/helpers/environment-variables-helper'
import { expect, test } from '@/fixtures/start'
import { getConfirmationCode, getLastLetter } from '@/helpers/email-helper'
import { User } from '@tests/data/UserDataProvider'
import { DataProviderInterface } from '@tests/data/types'
import { dataProviderManager } from '@tests/data/DataManager'
import { SignUpPage } from '@/pages/registration/sign-up-page'
import { DashboardPage } from '@/pages/app/dashboard-page'
import { MessengersListPage } from '@/pages/app/messenger/messengers-list-page'
import { APIBaseHelper } from '@/helpers/api-helpers/api-base-helper'
import { TicketsPage } from '@/pages/app/tickets/tickets-page'
import { WorkflowsPage } from '@/pages/app/workflows/workflows-page'
import { Chat } from '@tests/data/ChatDataProvider'
import { APIMessengerHelper } from '@/helpers/api-helpers/api-messenger-helper'
import { APITicketsHelper } from '@/helpers/api-helpers/api-tickets-helper'
import { Ticket } from '@tests/data/TicketDataProvider'
import { APIWorkspaceHelper } from '@/helpers/api-helpers/api-workspace-helper'
import { APIWorkflowHelper } from '@/helpers/api-helpers/api-workflow-helper'
import { TicketDetailsPage } from '@/pages/app/tickets/ticket-details-page'
import { CustomField } from '@tests/data/CustomFieldDataProvider'
import { APITicketsSettingsHelper } from '@/helpers/api-helpers/api-tickets-settings-helper'
import { TicketsCustomFieldsPage } from '@/pages/admin/settings/tickets/tickets-custom-fields-page'
import { faker } from '@faker-js/faker'
import { SpamFilterPage } from '@/pages/admin/settings/tickets/spam-filter-page'
import { APIContactsHelper } from '@/helpers/api-helpers/api-contacts-helper'
import { AllListsPage } from '@/pages/app/contacts/lists/all-lists-page'
import { AllSegmentsPage } from '@/pages/app/contacts/segments/all-segments-page'
import { ContactsCustomFieldsPage } from '@/pages/admin/settings/contacts/contacts-custom-fields-page'
import { OrganizationsCustomFieldsPage } from '@/pages/admin/settings/contacts/organizations-custom-fields-page'
import { MessengerNumbersPage } from '@/pages/admin/settings/messenger/messenger-numbers-page'
import { MessengerWidgetsPage } from '@/pages/admin/settings/messenger/messenger-widgets-page'
import { ListDetailsPage } from '@/pages/app/contacts/lists/list-details-page'
import { SegmentDetailsPage } from '@/pages/app/contacts/segments/segment-details-page'
import { WidgetTestPage } from '@/pages/admin/settings/messenger/widget-test-page'
import { APICustomFieldsHelper } from '@/helpers/api-helpers/api-custom-fields-helper'

let userDataProvider: DataProviderInterface<User>
let emailConfirmationPage: EmailConfirmationPage
let createWorkspacePage: CreateWorkspacePage
let companyInfoPage: CompanyInfoPage
let mailClient: Mailosaur
let inviteTeamPage: InviteTeamPage
let signUpPage: SignUpPage
let dashboardPage: DashboardPage
let messengerListPage: MessengersListPage
let authorizationToken: string
let apiHelper: APIBaseHelper
let ticketsPage: TicketsPage
let workflowsPage: WorkflowsPage
let chatDataProvider: DataProviderInterface<Chat>
let apiMessengerHelper: APIMessengerHelper
let apiTicketsHelper: APITicketsHelper
let ticketDataProvider: DataProviderInterface<Ticket>
let apiWorkspaceHelper: APIWorkspaceHelper
let apiWorkflowHelper: APIWorkflowHelper
let ticketId: string
let ticketDetailsPage: TicketDetailsPage
let customFieldDataProvider: DataProviderInterface<CustomField>
let apiTicketsSettingsHelper: APITicketsSettingsHelper
let ticketsCustomFieldsPage: TicketsCustomFieldsPage
let spamFilterPage: SpamFilterPage
let apiContactsHelper: APIContactsHelper
let listsPage: AllListsPage
let segmentsPage: AllSegmentsPage
let listDetailsPage: ListDetailsPage
let segmentDetailsPage: SegmentDetailsPage
let contactsCustomFieldsPage: ContactsCustomFieldsPage
let organizationsCustomFieldsPage: OrganizationsCustomFieldsPage
let messengerNumbersPage: MessengerNumbersPage
let messengerWidgetsPage: MessengerWidgetsPage
let widgetTestPage: WidgetTestPage
let apiCustomFieldsHelper: APICustomFieldsHelper

test.beforeAll(async ({ currentPage }) => {
    userDataProvider = dataProviderManager.createProvider<User>('user')
    emailConfirmationPage = new EmailConfirmationPage(currentPage.page)
    createWorkspacePage = new CreateWorkspacePage(currentPage.page)
    companyInfoPage = new CompanyInfoPage(currentPage.page)
    mailClient = new Mailosaur(envVars.mailosaurApiKey)
    inviteTeamPage = new InviteTeamPage(currentPage.page)
    signUpPage = new SignUpPage(currentPage.page)
    dashboardPage = new DashboardPage(currentPage.page)
    messengerListPage = new MessengersListPage(currentPage.page)
    apiHelper = new APIBaseHelper()
    ticketsPage = new TicketsPage(currentPage.page)
    workflowsPage = new WorkflowsPage(currentPage.page)
    chatDataProvider = dataProviderManager.createProvider<Chat>('chat')
    apiMessengerHelper = new APIMessengerHelper()
    apiTicketsHelper = new APITicketsHelper()
    ticketDataProvider = dataProviderManager.createProvider<Ticket>('ticket')
    apiWorkspaceHelper = new APIWorkspaceHelper()
    apiWorkflowHelper = new APIWorkflowHelper()
    ticketDetailsPage = new TicketDetailsPage(currentPage.page)
    customFieldDataProvider = dataProviderManager.createProvider<CustomField>('customField')
    apiTicketsSettingsHelper = new APITicketsSettingsHelper()
    ticketsCustomFieldsPage = new TicketsCustomFieldsPage(currentPage.page)
    spamFilterPage = new SpamFilterPage(currentPage.page)
    listsPage = new AllListsPage(currentPage.page)
    listDetailsPage = new ListDetailsPage(currentPage.page)
    segmentDetailsPage = new SegmentDetailsPage(currentPage.page)
    apiContactsHelper = new APIContactsHelper()
    segmentsPage = new AllSegmentsPage(currentPage.page)
    contactsCustomFieldsPage = new ContactsCustomFieldsPage(currentPage.page)
    organizationsCustomFieldsPage = new OrganizationsCustomFieldsPage(currentPage.page)
    messengerNumbersPage = new MessengerNumbersPage(currentPage.page)
    messengerWidgetsPage = new MessengerWidgetsPage(currentPage.page)
    widgetTestPage = new WidgetTestPage(currentPage.page)
    apiCustomFieldsHelper = new APICustomFieldsHelper()

    await currentPage.startFreeTrialLink.click()
    await signUpPage.enterValidDataSignupPage(userDataProvider)
    await emailConfirmationPage.loadPage()
    const letter = await getLastLetter(mailClient, userDataProvider.getField('email'))
    await emailConfirmationPage.enterConfirmationCode(getConfirmationCode(letter))
    await createWorkspacePage.loadPage()
    await createWorkspacePage.continueBtn.click()
    await companyInfoPage.loadPage()
    await companyInfoPage.skipThisStepBtn.click()
    await inviteTeamPage.loadPage()
    await inviteTeamPage.skipThisStepBtn.click()
    await dashboardPage.loadPage([dashboardPage.ticketsBlock])
    
    authorizationToken = (await apiHelper.getAuthorizationToken(userDataProvider.getField('email'), userDataProvider.getField('password'))).toString()
    ticketDataProvider.setField('assignee', userDataProvider.getField('firstName') + ' ' + userDataProvider.getField('lastName'))
    ticketDataProvider.setField('requester', 'TextMagic Support')
    const email = await apiWorkspaceHelper.getInboxEmailByName(authorizationToken, 'Support')
    ticketDataProvider.setField('inbox', email)
    ticketId = await apiTicketsHelper.createNewTicket(authorizationToken, ticketDataProvider.export())
})

test.afterAll(async () => {
    userDataProvider.clear()
})

test.describe.configure({ mode: 'default' })

test(`Checking the opening of messengers list page @all @smoke @pageOpening @openMessengersList`, async () => {
    const widgetId = await apiMessengerHelper.getWidgetByName(authorizationToken, 'Rbi4rpic support')
    chatDataProvider.setField('widgetId', widgetId)
    const chatId = (await apiMessengerHelper.createNewChat(authorizationToken, chatDataProvider.export())).chatId
    await apiMessengerHelper.takeChat(authorizationToken, chatId)
    await messengerListPage.open(messengerListPage.baseUrl)
    const chat = await messengerListPage.getLocatorByText(chatDataProvider.getField('name'))
    await messengerListPage.loadPage([chat], messengerListPage.redirectUrl)
})

test(`Checking the opening of tickets page @all @smoke @pageOpening @openTicketsPage`, async () => {
    await ticketsPage.open(ticketsPage.baseUrl)
    const ticket = await ticketsPage.getLocatorByText(ticketDataProvider.getField('subject'))
    await ticketsPage.loadPage([ticketsPage.newTicketBtn, ticket], ticketsPage.redirectUrl)
})

test(`Checking the opening of workflows page @all @smoke @pageOpening @openWorkflowsPage`, async () => {
    await apiWorkflowHelper.createNewWorkflow(authorizationToken, 'test workflow')
    const workflow = await ticketsPage.getLocatorByText('test workflow')
    await workflowsPage.open(workflowsPage.baseUrl)
    await workflowsPage.loadPage([workflow], workflowsPage.redirectUrl)
})

test(`Open messages tab in the ticket details page @all @smoke @pageOpening @openMessagesInTicket`, async () => {
    await ticketDetailsPage.open(envVars.baseUrl + `/tickets/${ticketId}/messages`)
    const messagesTab = await ticketDetailsPage.getMessagesTabLocator(0)
    await ticketDetailsPage.loadPage([messagesTab])
})

test.skip(`Open logs tab in the ticket details page @all @smoke @pageOpening @openLogsInTicket`, async () => {
    await ticketDetailsPage.open(envVars.baseUrl + `/tickets/${ticketId}/logs`)
    let messagesTab = await ticketDetailsPage.getLogsTabLocator(0)
    await ticketDetailsPage.loadPage([messagesTab])
    test.setTimeout(80000)
    await emailConfirmationPage.page.waitForTimeout(61000)
    ticketDetailsPage.page.reload()
    messagesTab = await ticketDetailsPage.getLogsTabLocator(1)
    await ticketDetailsPage.loadPage([messagesTab])
})

test(`Checking the opening of tickets custom fields page @all @smoke @pageOpening @openTicketsCustomFieldsPage`, async () => {
    await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export())
    await ticketsCustomFieldsPage.open(ticketsCustomFieldsPage.url)
    const field = await ticketsCustomFieldsPage.getLocatorByText(customFieldDataProvider.getField('name'))
    await ticketsCustomFieldsPage.loadPage([field])
})

test(`Checking the opening of spam filter page @all @smoke @pageOpening @openSpamFilterPage`, async () => {
    const whiteList = faker.internet.domainName()
    const blackList = faker.internet.domainName()
    await apiTicketsSettingsHelper.addSpamFilters(authorizationToken, [blackList], [whiteList])
    await spamFilterPage.open(spamFilterPage.url)
    await spamFilterPage.loadPage([await spamFilterPage.getLocatorByText(whiteList), await spamFilterPage.getLocatorByText(blackList)])
})

test(`Checking the opening of contacts/lists page @all @smoke @pageOpening @openListsPage`, async () => {
    const name = 'new test list'
    await apiContactsHelper.createNewList(authorizationToken, name)
    await listsPage.open(listsPage.baseUrl)
    const list = await listsPage.getLocatorByText(name)
    await listsPage.loadPage([list], listsPage.redirectUrl)
})

test(`Checking the opening of list details page @all @smoke @pageOpening @openListDetailsPage`, async () => {
    const listName = "BestList"
    const listId = await apiContactsHelper.createNewList(authorizationToken, listName)
    await listDetailsPage.open(listDetailsPage.baseUrl + listId)
    await listDetailsPage.loadPage([listDetailsPage.noContactInListText])
    expect.soft(await listDetailsPage.listTabTitle.innerText()).toEqual(listName)
    expect.soft(await listDetailsPage.listTitle.innerText()).toEqual(listName)
})

test(`Checking the opening of contacts/segments page @all @smoke @pageOpening @openSegmentsPage`, async () => {
    const name = 'new test segment'
    await apiContactsHelper.createNewSegment(authorizationToken, name)
    await segmentsPage.open(segmentsPage.baseUrl)
    const segment = await segmentsPage.getLocatorByText(name)
    await segmentsPage.loadPage([segment], segmentsPage.redirectUrl)
})

test(`Checking the opening of segment details page @all @smoke @pageOpening @openSegmentDetailsPage`, async () => {
    const segmentName = "BestSegment"
    const segmentId = await apiContactsHelper.createNewSegment(authorizationToken, segmentName)
    await segmentDetailsPage.open(segmentDetailsPage.baseUrl + segmentId)
    await segmentDetailsPage.loadPage([segmentDetailsPage.messageText, segmentDetailsPage.sendCampaignBtn])
    expect.soft(await segmentDetailsPage.segmentTabTitle.innerText()).toEqual(segmentName)
    expect.soft(await segmentDetailsPage.segmentTitle.innerText()).toEqual(segmentName)
})

test(`Checking the opening of contacts custom fields page @all @smoke @pageOpening @openContactsCustomFieldsPage`, async () => {
    customFieldDataProvider.setField('entityType', 'contact')
    await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export())
    await contactsCustomFieldsPage.open(contactsCustomFieldsPage.url)
    const field = await contactsCustomFieldsPage.getLocatorByText(customFieldDataProvider.getField('name'))
    await contactsCustomFieldsPage.loadPage([field])
})

test(`Checking the opening of organizations custom fields page @all @smoke @pageOpening @openOrganizationsCustomFieldsPage`, async () => {
    customFieldDataProvider.setField('entityType', 'organization')
    await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export())
    await organizationsCustomFieldsPage.open(organizationsCustomFieldsPage.url)
    const field = await organizationsCustomFieldsPage.getLocatorByText(customFieldDataProvider.getField('name'))
    await organizationsCustomFieldsPage.loadPage([field])
})

test(`Checking the opening of numbers page @all @smoke @pageOpening @openNumbersPage`, async () => {
    const poolNumberId = await apiMessengerHelper.getFirstAvailablePoolNumberId(authorizationToken)
    const phoneNumber = await apiMessengerHelper.buyNewNumberFromPool(authorizationToken, poolNumberId)
    await messengerNumbersPage.open(messengerNumbersPage.baseUrl)
    await messengerNumbersPage.loadPage([messengerNumbersPage.cellWithNumberInList], messengerNumbersPage.redirectUrl)
    //remove internal spaces to check the equality of phone numbers
    const phoneNumberInApp = (await messengerNumbersPage.cellWithNumberInList.innerText()).replace(/\s/g, "")
    expect(phoneNumberInApp).toEqual('+' + phoneNumber)
    await apiMessengerHelper.cancelBoughtPoolNumber(authorizationToken, poolNumberId)
})

test(`Checking the opening of empty widgets page @all @smoke @pageOpening @openEmptyWidgetsPage`, async () => {
    const widgetId = await apiMessengerHelper.getWidgetByName(authorizationToken, 'Rbi4rpic support')
    await apiMessengerHelper.deleteWidget(authorizationToken, widgetId)
    await messengerWidgetsPage.open(messengerWidgetsPage.baseUrl)
    await messengerWidgetsPage.loadPage([messengerWidgetsPage.youHaveNoWidgetsLabel], messengerWidgetsPage.redirectUrl)
})

test(`Checking the opening of widget test page @all @smoke @pageOpening @openWidgetTestPage`, async () => {
    const widgetName = 'New test widget'
    const widgetId = await apiMessengerHelper.createNewWidget(authorizationToken, widgetName)
    await widgetTestPage.open(widgetTestPage.baseUrl + widgetId)
    await widgetTestPage.loadPage([widgetTestPage.chatWithUsBtn])
    await widgetTestPage.chatWithUsBtn.click()
    await widgetTestPage.loadPage([widgetTestPage.startChatBtn])
    await apiMessengerHelper.deleteWidget(authorizationToken, widgetId)
})