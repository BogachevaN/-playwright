import { EmailConfirmationPage } from '@/pages/registration/email-confirmation-page'
import { CreateWorkspacePage } from '@/pages/registration/create-workspace-page'
import { CompanyInfoPage } from '@/pages/registration/company-info-page'
import { InviteTeamPage } from '@/pages/registration/invite-team-page'
import { HomePage } from '@/pages/admin/home-page'
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
import { AllContactsPage } from '@/pages/app/contacts/all-contacts/all-contacts-page'
import { WorkflowsPage } from '@/pages/app/workflows/workflows-page'
import { ReportsPage } from '@/pages/app/reports/reports-page'
import { MyAccountPage } from '@/pages/admin/my-account/my-account-page'
import { MessengerSettingsPage } from '@/pages/admin/settings/messenger/messenger-settings-page'
import { WorkspaceGeneralPage } from '@/pages/admin/workspace/workspace-general-page'
import { AllListsPage } from '@/pages/app/contacts/lists/all-lists-page'
import { OrganizationsPage } from '@/pages/app/contacts/organizations/organizations-page'
import { AllImportsPage } from '@/pages/app/contacts/imports/all-imports-page'
import { AllSegmentsPage } from '@/pages/app/contacts/segments/all-segments-page'
import { TicketsSettingsPage } from '@/pages/admin/settings/tickets/tickets-settings-page'
import { ConnectedInboxesPage } from '@/pages/admin/settings/tickets/connected-inboxes-page'
import { APIInboxesHelper } from '@/helpers/api-helpers/api-inboxes-helper'
import { ConnectedInboxSettingsPage } from '@/pages/admin/settings/tickets/connected-inbox-settings-page'
import { AutoResponderPage } from '@/pages/admin/settings/tickets/auto-responder-page'
import { FeedbackSurveyPage } from '@/pages/admin/settings/tickets/feedback-survey-page'
import { PublicReplyPage } from '@/pages/admin/settings/tickets/public-reply-page'
import { TicketsGeneralSettingsPage } from '@/pages/admin/settings/tickets/tickets-general-settings-page'
import { TicketsFilteredViewsPage } from '@/pages/admin/settings/tickets/tickets-filtered-views-page'
import { TicketsStatusesPage } from '@/pages/admin/settings/tickets/tickets-statuses-page'
import { TicketsCustomFieldsPage } from '@/pages/admin/settings/tickets/tickets-custom-fields-page'
import { SpamFilterPage } from '@/pages/admin/settings/tickets/spam-filter-page'
import { ContactDetailsPage } from '@/pages/app/contacts/all-contacts/contact-details-page'
import { APIContactsHelper } from '@/helpers/api-helpers/api-contacts-helper'
import { ContactsSettingsPage } from '@/pages/admin/settings/contacts/contacts-settings-page'
import { ContactsCustomFieldsPage } from '@/pages/admin/settings/contacts/contacts-custom-fields-page'
import { OrganizationsCustomFieldsPage } from '@/pages/admin/settings/contacts/organizations-custom-fields-page'
import { ContactsStatusesPage } from '@/pages/admin/settings/contacts/contacts-statuses-page'
import { APIOrganizationsHelper } from '@/helpers/api-helpers/api-organizations-helper'
import { OrganizationDetailsPage } from '@/pages/app/contacts/organizations/organization-details-page'
import { ProfilePage } from '@/pages/admin/workspace/profile-page'
import { APIUsersHelper } from '@/helpers/api-helpers/api-users-helper'
import { WorkspaceTeamsPage } from '@/pages/admin/workspace/workspace-teams-page'
import { WorkspaceRolesPage } from '@/pages/admin/workspace/workspace-roles-page'
import { WorkspaceSecurityPage } from '@/pages/admin/workspace/workspace-security-page'
import { WorkspaceUsersPage } from '@/pages/admin/workspace/workspace-users-page'
import { NewImportPage } from '@/pages/app/contacts/imports/new-import-page'
import { MessengerNumbersPage } from '@/pages/admin/settings/messenger/messenger-numbers-page'
import { MessengerWidgetsPage } from '@/pages/admin/settings/messenger/messenger-widgets-page'
import { AccountNotificationsPage } from '@/pages/admin/my-account/account-notifications-page'
import { AccountPreferencesPage } from '@/pages/admin/my-account/account-preferences-page'

let userDataProvider: DataProviderInterface<User>
let emailConfirmationPage: EmailConfirmationPage
let createWorkspacePage: CreateWorkspacePage
let companyInfoPage: CompanyInfoPage
let mailClient: Mailosaur
let inviteTeamPage: InviteTeamPage
let homePage: HomePage
let signUpPage: SignUpPage
let dashboardPage: DashboardPage
let messengerListPage: MessengersListPage
let authorizationToken: string
let apiHelper: APIBaseHelper
let apiContactsHelper: APIContactsHelper
let apiOrgHelper: APIOrganizationsHelper
let ticketsPage: TicketsPage
let contactsPage: AllContactsPage
let contactDetailsPage: ContactDetailsPage
let orgDetailsPage: OrganizationDetailsPage
let listsPage: AllListsPage
let segmentsPage: AllSegmentsPage
let importsPage: AllImportsPage
let organizationsPage: OrganizationsPage
let workflowsPage: WorkflowsPage
let reportsPage: ReportsPage
let myAccountPage: MyAccountPage
let profilePage: ProfilePage
let messengerSettingsPage: MessengerSettingsPage
let workspaceGeneralPage: WorkspaceGeneralPage
let workspaceUsersPage: WorkspaceUsersPage
let workspaceTeamsPage: WorkspaceTeamsPage
let workspaceRolesPage: WorkspaceRolesPage
let workspaceSecurityPage: WorkspaceSecurityPage
let defaultContactId: string
let defaultOrgId: string
let ticketsSettingsPage: TicketsSettingsPage
let connectedInboxesPage: ConnectedInboxesPage
let apiInboxesHelper: APIInboxesHelper
let apiUserHelper: APIUsersHelper
let connectedInboxSettingsPage: ConnectedInboxSettingsPage
let autoResponderPage: AutoResponderPage
let feedbackSurveyPage: FeedbackSurveyPage
let publicReplyPage: PublicReplyPage
let ticketsGeneralSettingsPage: TicketsGeneralSettingsPage
let ticketsFilteredViewsPage: TicketsFilteredViewsPage
let ticketsStatusesPage: TicketsStatusesPage
let ticketsCustomFieldsPage: TicketsCustomFieldsPage
let spamFilterPage: SpamFilterPage
let contactsSettingsPage: ContactsSettingsPage
let contactsCustomFieldsPage: ContactsCustomFieldsPage
let organizationsCustomFieldsPage: OrganizationsCustomFieldsPage
let contactsStatusesPage: ContactsStatusesPage
let newImportPage: NewImportPage
let messengerNumbersPage: MessengerNumbersPage
let messengerWidgetsPage: MessengerWidgetsPage
let accountNotificationsPage: AccountNotificationsPage
let accountPreferencesPage: AccountPreferencesPage

test.beforeAll(async ({ currentPage }) => {
    userDataProvider = dataProviderManager.createProvider<User>('user')
    emailConfirmationPage = new EmailConfirmationPage(currentPage.page)
    createWorkspacePage = new CreateWorkspacePage(currentPage.page)
    companyInfoPage = new CompanyInfoPage(currentPage.page)
    mailClient = new Mailosaur(envVars.mailosaurApiKey)
    inviteTeamPage = new InviteTeamPage(currentPage.page)
    signUpPage = new SignUpPage(currentPage.page)
    homePage = new HomePage(currentPage.page)
    dashboardPage = new DashboardPage(currentPage.page)
    messengerListPage = new MessengersListPage(currentPage.page)
    apiHelper = new APIBaseHelper()
    apiContactsHelper = new APIContactsHelper()
    apiUserHelper = new APIUsersHelper()
    apiOrgHelper = new APIOrganizationsHelper()
    ticketsPage = new TicketsPage(currentPage.page)
    contactsPage = new AllContactsPage(currentPage.page)
    contactDetailsPage = new ContactDetailsPage(currentPage.page)
    orgDetailsPage = new OrganizationDetailsPage(currentPage.page)
    listsPage = new AllListsPage(currentPage.page)
    segmentsPage = new AllSegmentsPage(currentPage.page)
    importsPage = new AllImportsPage(currentPage.page)
    organizationsPage = new OrganizationsPage(currentPage.page)
    workflowsPage = new WorkflowsPage(currentPage.page)
    reportsPage = new ReportsPage(currentPage.page)
    myAccountPage = new MyAccountPage(currentPage.page)
    profilePage = new ProfilePage(currentPage.page)
    messengerSettingsPage = new MessengerSettingsPage(currentPage.page)
    workspaceGeneralPage = new WorkspaceGeneralPage(currentPage.page)
    workspaceUsersPage = new WorkspaceUsersPage(currentPage.page)
    workspaceTeamsPage = new WorkspaceTeamsPage(currentPage.page)
    workspaceRolesPage = new WorkspaceRolesPage(currentPage.page)
    workspaceSecurityPage = new WorkspaceSecurityPage(currentPage.page)
    ticketsSettingsPage = new TicketsSettingsPage(currentPage.page)
    connectedInboxesPage = new ConnectedInboxesPage(currentPage.page)
    apiInboxesHelper = new APIInboxesHelper()
    connectedInboxSettingsPage = new ConnectedInboxSettingsPage(currentPage.page)
    autoResponderPage = new AutoResponderPage(currentPage.page)
    feedbackSurveyPage = new FeedbackSurveyPage(currentPage.page)
    publicReplyPage = new PublicReplyPage(currentPage.page)
    ticketsGeneralSettingsPage = new TicketsGeneralSettingsPage(currentPage.page)
    ticketsFilteredViewsPage = new TicketsFilteredViewsPage(currentPage.page)
    ticketsStatusesPage = new TicketsStatusesPage(currentPage.page)
    ticketsCustomFieldsPage = new TicketsCustomFieldsPage(currentPage.page)
    spamFilterPage = new SpamFilterPage(currentPage.page)
    contactsSettingsPage = new ContactsSettingsPage(currentPage.page)
    contactsCustomFieldsPage = new ContactsCustomFieldsPage(currentPage.page)
    organizationsCustomFieldsPage = new OrganizationsCustomFieldsPage(currentPage.page)
    contactsStatusesPage = new ContactsStatusesPage(currentPage.page)
    newImportPage = new NewImportPage(currentPage.page)
    messengerNumbersPage = new MessengerNumbersPage(currentPage.page)
    messengerWidgetsPage = new MessengerWidgetsPage(currentPage.page)
    accountNotificationsPage = new AccountNotificationsPage(currentPage.page)
    accountPreferencesPage = new AccountPreferencesPage(currentPage.page)

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
})

test.afterAll(async () => {
    userDataProvider.clear()
})

test.describe.configure({ mode: 'default' })

test(`Checking the opening of empty dashboard page @all @smoke @pageOpening @openEmptyDashboardPage`, async () => {
    await dashboardPage.open(dashboardPage.baseUrl)
    await dashboardPage.loadPage([dashboardPage.ticketsBlock, await dashboardPage.getContactsLocator(1)], dashboardPage.redirectUrl)
})

test(`Checking the opening of empty messengers list page @all @smoke @pageOpening @openEmptyMessengersList`, async () => {
    await messengerListPage.open(messengerListPage.baseUrl)
    const redirectUrl = messengerListPage.redirectUrl + await apiHelper.getFilteredViewIdByName(authorizationToken, 'My open')
    await messengerListPage.loadPage([messengerListPage.noMessagesText, messengerListPage.testWidgetBtn], redirectUrl)
})

test(`Checking the opening of empty tickets page @all @smoke @pageOpening @openEmptyTicketsPage`, async () => {
    await ticketsPage.open(ticketsPage.baseUrl)
    await ticketsPage.loadPage([ticketsPage.createNewTicketBtn], ticketsPage.redirectUrl)
})

test(`Checking the opening of default contacts page @all @smoke @pageOpening @openDefaultContactsPage`, async () => {
    await contactsPage.open(contactsPage.baseUrl)
    await contactsPage.loadPage([contactsPage.defaultContact], contactsPage.redirectUrl)
})

test(`Checking the opening of default contact details page @all @smoke @pageOpening @openDefaultContactDetailsPage`, async () => {
    defaultContactId = await apiContactsHelper.getContactIdByFullName(authorizationToken, 'TextMagic Support')
    await contactDetailsPage.open(contactsPage.baseUrl + '/' + defaultContactId)
    await contactDetailsPage.loadPage([contactDetailsPage.defaultContactTitle, contactDetailsPage.activeTab, contactDetailsPage.noOpenActivitiesText], 
        contactsPage.baseUrl + '/' + defaultContactId + '/activities')
})

test(`Checking the opening of empty contacts/lists page @all @smoke @pageOpening @openEmptyListsPage`, async () => {
    await listsPage.open(listsPage.baseUrl)
    await listsPage.loadPage([listsPage.noListsText, listsPage.newListBtn, listsPage.importListsBtn], listsPage.redirectUrl)
})

test(`Checking the opening of default contacts/organizations page @all @smoke @pageOpening @openDefaultOrganizationsPage`, async () => {
    await organizationsPage.open(organizationsPage.baseUrl)
    await organizationsPage.loadPage([organizationsPage.defaultOrganization], organizationsPage.redirectUrl)
})

test(`Checking the opening of default organization details page @all @smoke @pageOpening @openDefaultOrgDetailsPage`, async () => {
    defaultOrgId = await apiOrgHelper.getOrganizationIdByName(authorizationToken, 'Textmagic')
    await orgDetailsPage.open(organizationsPage.baseUrl + '/' + defaultOrgId)
    await orgDetailsPage.loadPage([orgDetailsPage.defaultOrgBreadcrumb, orgDetailsPage.defaultOrgTitle, orgDetailsPage.noOpenActivitiesText], 
        organizationsPage.baseUrl + '/' + defaultOrgId + '/activities')
})

test(`Checking the opening of empty contacts/segments page @all @smoke @pageOpening @openEmptySegmentsPage`, async () => {
    await segmentsPage.open(segmentsPage.baseUrl)
    await segmentsPage.loadPage([segmentsPage.noSegmentsText, segmentsPage.newSegmentBtn], segmentsPage.redirectUrl)
})

test(`Checking the opening of empty contacts/imports page @all @smoke @pageOpening @openEmptyImportsPage`, async () => {
    await importsPage.open(importsPage.baseUrl)
    await importsPage.loadPage([importsPage.noImportsText, importsPage.importContactsBtn], importsPage.redirectUrl)
})

test(`Checking the opening of empty workflows page @all @smoke @pageOpening @openEmptyWorkflowsPage`, async () => {
    await workflowsPage.open(workflowsPage.baseUrl)
    await workflowsPage.loadPage([workflowsPage.createFromScratchBtn], workflowsPage.redirectUrl)
})

test.skip(`Checking the opening of empty reports page @all @smoke @pageOpening @openEmptyReportsPage`, async () => {
    await reportsPage.open(reportsPage.baseUrl)
    //not implemented page
})

test(`Checking the opening of admin home page @all @smoke @pageOpening @openAdminHomePage`, async () => {
    await homePage.open(homePage.baseUrl)
    await homePage.loadPage([homePage.myAccountBtn], homePage.redirectUrl)
})

test(`Checking the opening of my account page @all @smoke @pageOpening @openMyAccountPage`, async () => {
    await myAccountPage.open(myAccountPage.baseUrl)
    await myAccountPage.loadPage([myAccountPage.userFullNameText], myAccountPage.redirectUrl)
    const userFullName = await myAccountPage.userFullNameText.innerHTML()
    expect(userFullName).toEqual(userDataProvider.getField('firstName') + ' ' + userDataProvider.getField('lastName'))
})

test(`Checking the opening of user profile page @all @smoke @pageOpening @openProfilePage`, async () => {
    const userId = await apiUserHelper.getUserIdByInboxName(authorizationToken, userDataProvider.getField('email'))
    await profilePage.open(profilePage.baseUrl + userId)
    await profilePage.loadPage([profilePage.detailsSidebar, profilePage.twoFaBlock], profilePage.baseUrl + userId + '/profile')
    const userEmail = await profilePage.emailInput.inputValue()
    expect(userEmail).toEqual(userDataProvider.getField('email'))
})

test(`Checking the opening of messenger settings page @all @smoke @pageOpening @openMessengerSettingsPage`, async () => {
    await messengerSettingsPage.open(messengerSettingsPage.baseUrl)
    await messengerSettingsPage.loadPage([messengerSettingsPage.autoSolveChatsText], messengerSettingsPage.redirectUrl)
})

test(`Checking the opening of workspace general page @all @smoke @pageOpening @openWorkspaceGeneralPage`, async () => {
    await workspaceGeneralPage.open(workspaceGeneralPage.baseUrl)
    await workspaceGeneralPage.loadPage([workspaceGeneralPage.editWorkspaceNameAndUrlBtn], workspaceGeneralPage.redirectUrl)
})

test(`Checking the opening of workspace/users page @all @smoke @pageOpening @openWorkspaceUsersPage`, async () => {
    await workspaceUsersPage.open(workspaceUsersPage.baseUrl)
    await workspaceUsersPage.loadPage([workspaceUsersPage.addUserBtn, workspaceUsersPage.usersTable])
    expect(await workspaceUsersPage.tableOfUsersContains(userDataProvider.getField('email'))).toBeTruthy()
})

test(`Checking the opening of workspace/teams page @all @smoke @pageOpening @openWorkspaceTeamsPage`, async () => {
    await workspaceTeamsPage.open(workspaceTeamsPage.baseUrl)
    await workspaceTeamsPage.loadPage([workspaceTeamsPage.newTeamBtn, workspaceTeamsPage.teamsTable])
})

test(`Checking the opening of workspace/roles page @all @smoke @pageOpening @openWorkspaceRolesPage`, async () => {
    await workspaceRolesPage.open(workspaceRolesPage.baseUrl)
    await workspaceRolesPage.loadPage([workspaceRolesPage.newRoleBtn, workspaceRolesPage.rolesTable])
})

test(`Checking the opening of workspace/security page @all @smoke @pageOpening @openWorkspaceSecurityPage`, async () => {
    await workspaceSecurityPage.open(workspaceSecurityPage.baseUrl)
    await workspaceSecurityPage.loadPage([workspaceSecurityPage.enable2FaEnforcementBtn,workspaceSecurityPage.authBlockTitle, workspaceSecurityPage.passwordBlockTitle])
})

test(`Checking the opening of tickets settings page @all @smoke @pageOpening @openTicketsSettingsPage`, async () => {
    await ticketsSettingsPage.open(ticketsSettingsPage.url)
    await ticketsSettingsPage.loadPage([ticketsSettingsPage.connectedInboxesBlock])
})

test(`Checking the opening of connected inboxes page @all @smoke @pageOpening @openConnectedInboxesPage`, async () => {
    await connectedInboxesPage.open(connectedInboxesPage.url)
    const email = await apiInboxesHelper.getSupportEmail(authorizationToken)
    await connectedInboxesPage.loadPage([await connectedInboxesPage.getInboxLocatorByName(email)])
})

test(`Checking the opening of connected inbox settings page @all @smoke @pageOpening @openConnectedInboxSettingsPage`, async () => {
    const email = await apiInboxesHelper.getSupportEmail(authorizationToken)
    const id = await apiInboxesHelper.getInboxIdByName(authorizationToken, email)
    await connectedInboxSettingsPage.open(await connectedInboxSettingsPage.getUrl(id))
    await connectedInboxSettingsPage.loadPage([connectedInboxSettingsPage.inboxName])
})

test(`Checking the opening of auto-responder page @all @smoke @pageOpening @openAutoResponderPage`, async () => {
    await autoResponderPage.open(autoResponderPage.url)
    await autoResponderPage.loadPage([autoResponderPage.emailSubjectOBHInput, autoResponderPage.emailSubjectWBHInput])
})

test(`Checking the opening of feedback survey page @all @smoke @pageOpening @openFeedbackSurveyPage`, async () => {
    await feedbackSurveyPage.open(feedbackSurveyPage.url)
    await feedbackSurveyPage.loadPage([feedbackSurveyPage.sendFeedbackSurveyToggle, feedbackSurveyPage.thankYouMessageInput])
})

test(`Checking the opening of public reply page @all @smoke @pageOpening @openPublicReplyPage`, async () => {
    await publicReplyPage.open(publicReplyPage.url)
    await publicReplyPage.loadPage([publicReplyPage.emailSubjectInput, publicReplyPage.footerInput])
})

test(`Checking the opening of ticket general settings page @all @smoke @pageOpening @openTicketGeneralSettingsPage`, async () => {
    await ticketsGeneralSettingsPage.open(ticketsGeneralSettingsPage.url)
    await ticketsGeneralSettingsPage.loadPage([ticketsGeneralSettingsPage.startTicketIdCountFromInput, ticketsGeneralSettingsPage.automaticallyMarkTicketAsClosedInput])
})

//PRO-7436
test.skip(`Checking the opening of tickets filtered views page @all @smoke @pageOpening @openTicketsFilteredViewsPage`, async () => {
    await ticketsFilteredViewsPage.open(ticketsFilteredViewsPage.baseUrl)
    await ticketsFilteredViewsPage.loadPage([ticketsFilteredViewsPage.newViewBtn], ticketsFilteredViewsPage.redirectUrl)
})

test(`Checking the opening of tickets statuses page @all @smoke @pageOpening @openTicketsStatusesPage`, async () => {
    await ticketsStatusesPage.open(ticketsStatusesPage.url)
    await ticketsStatusesPage.loadPage([ticketsStatusesPage.addNewStatusBtn])
})

test(`Checking the opening of empty tickets custom fields page @all @smoke @pageOpening @openEmptyTicketsCustomFieldsPage`, async () => {
    await ticketsCustomFieldsPage.open(ticketsCustomFieldsPage.url)
    await ticketsCustomFieldsPage.loadPage([ticketsCustomFieldsPage.noCustomFieldsText])
})

test(`Checking the opening of empty spam filter page @all @smoke @pageOpening @openEmptySpamFilterPage`, async () => {
    await spamFilterPage.open(spamFilterPage.url)
    await spamFilterPage.loadPage([spamFilterPage.blacklistedEmailsAndDomainsArea, spamFilterPage.whitelistedEmailsAndDomainsArea])
})

test(`Checking the opening of contacts settings page @all @smoke @pageOpening @openContactsSettingsPage`, async () => {
    await contactsSettingsPage.open(contactsSettingsPage.url)
    await contactsSettingsPage.loadPage([contactsSettingsPage.contactCustomFieldBlock])
})

test(`Checking the opening of empty contacts custom fields page @all @smoke @pageOpening @openEmptyContactsCustomFieldsPage`, async () => {
    await contactsCustomFieldsPage.open(contactsCustomFieldsPage.url)
    await contactsCustomFieldsPage.loadPage([contactsCustomFieldsPage.defaultPaginationText])
    const sourceFieldRow = await organizationsCustomFieldsPage.fieldsTable.getRowByText('Source')
    await expect.soft(sourceFieldRow).toBeVisible()
    const sourceFieldType = await organizationsCustomFieldsPage.getFieldTypeFromRow(sourceFieldRow)
    expect.soft(sourceFieldType).toContain('Drop-down')
})

test(`Checking the opening of empty organizations custom fields page @all @smoke @pageOpening @openEmptyOrganizationsCustomFieldsPage`, async () => {
    await organizationsCustomFieldsPage.open(organizationsCustomFieldsPage.url)
    await organizationsCustomFieldsPage.loadPage([organizationsCustomFieldsPage.defaultPaginationText])
    const typeFieldRow = await organizationsCustomFieldsPage.fieldsTable.getRowByText('Type')
    await expect.soft(typeFieldRow).toBeVisible()
    const typeFieldType = await organizationsCustomFieldsPage.getFieldTypeFromRow(typeFieldRow)
    expect.soft(typeFieldType).toContain('Drop-down')
    const industryFieldRow = await organizationsCustomFieldsPage.fieldsTable.getRowByText('Industry')
    await expect.soft(typeFieldRow).toBeVisible()
    const industryFieldType = await organizationsCustomFieldsPage.getFieldTypeFromRow(industryFieldRow)
    expect.soft(industryFieldType).toContain('Drop-down')
    const sizeFieldRow = await organizationsCustomFieldsPage.fieldsTable.getRowByText('Size')
    await expect.soft(typeFieldRow).toBeVisible()
    const sizeFieldType = await organizationsCustomFieldsPage.getFieldTypeFromRow(sizeFieldRow)
    expect.soft(sizeFieldType).toContain('Drop-down')
})

test(`Checking the opening of contacts statuses page @all @smoke @pageOpening @openContactsStatusesPage`, async () => {
    await contactsStatusesPage.open(contactsStatusesPage.url)
    await contactsStatusesPage.loadPage([contactsStatusesPage.addNewStatusBtn])
})

test(`Checking the opening of new import page @all @smoke @pageOpening @openNewImportPage`, async () => {
    await newImportPage.open(newImportPage.url)
    await newImportPage.loadPage([newImportPage.browseFilesBtn])
})

test(`Checking the opening of empty numbers page @all @smoke @pageOpening @openEmptyNumbersPage`, async () => {
    await messengerNumbersPage.open(messengerNumbersPage.baseUrl)
    await messengerNumbersPage.loadPage([messengerNumbersPage.youHaveNoNumbersLabel], messengerNumbersPage.redirectUrl)
})

test(`Checking the opening of widgets page @all @smoke @pageOpening @openWidgetsPage`, async () => {
    await messengerWidgetsPage.open(messengerWidgetsPage.baseUrl)
    await messengerWidgetsPage.loadPage([messengerWidgetsPage.supportWidget], messengerWidgetsPage.redirectUrl)
})

test(`Checking the opening of account notifications page @all @smoke @pageOpening @openAccountNotificationsPage`, async () => {
    await accountNotificationsPage.open(accountNotificationsPage.baseUrl)
    await accountNotificationsPage.loadPage([accountNotificationsPage.emailNotificationsToggle])
    const state = await accountNotificationsPage.getToggleState(accountNotificationsPage.emailNotificationsToggle)
    expect(state).toEqual(true)
})

test(`Checking the opening of account preferences page @all @smoke @pageOpening @openAccountPreferencesPage`, async () => {
    await accountPreferencesPage.open(accountPreferencesPage.baseUrl)
    await accountPreferencesPage.loadPage([accountPreferencesPage.localizationText, accountPreferencesPage.sendingMessageOptionsText])
})
