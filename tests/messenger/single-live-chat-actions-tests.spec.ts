import { expect, test } from '@/fixtures/start'
import { dataProviderManager } from '@tests/data/DataManager'
import { DataProviderInterface } from '../data/types'
import { Chat } from '@tests/data/ChatDataProvider'
import { APIMessengerHelper } from '@/helpers/api-helpers/api-messenger-helper'
import { DashboardPage } from '@/pages/app/dashboard-page'
import { APIBaseHelper } from '@/helpers/api-helpers/api-base-helper'
import { SideMenuNavigationComponent } from '@/components/app/sidemenu-navigation-component'
import { MessengersListPage } from '@/pages/app/messenger/messengers-list-page'
import { AssignChatModal } from '@/pages/app/messenger/assign-chat-modal'
import { RejectChatModal } from '@/pages/app/messenger/reject-chat-modal'
import { MarkChatAsSolvedModal } from '@/pages/app/messenger/mark-chat-as-solved-modal'

let apiHelper: APIBaseHelper
let apiMessengerHelper: APIMessengerHelper
let dashboardPage: DashboardPage
let sideMenuNavigationComponent: SideMenuNavigationComponent
let messengerListPage: MessengersListPage
let assignChatModal: AssignChatModal
let rejectChatModal: RejectChatModal
let markChatAsSolvedModal: MarkChatAsSolvedModal
let chatDataProvider: DataProviderInterface<Chat>
let email: string
let password: string
let authorizationToken: string
let widgetId: any
let chatId: string

enum FilteredView {
    WAITING_NOW = 'Waiting now',
    MISSED = 'Missed',
    MY_OPEN = 'My open',
    ALL_OPEN = 'All open',
    MY_SOLVED = 'My solved',
    ALL_SOLVED = 'All solved',
}

enum ChatStatus {
    WAITING_NOW = 'Waiting now',
    MISSED = 'Missed',
    OPEN = 'Open',
    SOLVED = 'Solved',
}

const agentFullName = 'Vadim34 Dolbin34'

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    apiHelper = new APIBaseHelper()
    apiMessengerHelper = new APIMessengerHelper()
    dashboardPage = new DashboardPage(currentPage.page)
    sideMenuNavigationComponent = new SideMenuNavigationComponent(currentPage.page)
    messengerListPage = new MessengersListPage(currentPage.page)
    assignChatModal = new AssignChatModal(currentPage.page)
    rejectChatModal = new RejectChatModal(currentPage.page)
    markChatAsSolvedModal = new MarkChatAsSolvedModal(currentPage.page)
    chatDataProvider = dataProviderManager.createProvider<Chat>('chat')
    widgetId = ''
    chatId = ''

    for (const user of testDataHelper.users) {
        if (user.test == 'messenger_crud') {
            email = user.email
            password = user.password
        }
    }
    
    authorizationToken = (await apiHelper.getAuthorizationToken(email, password)).toString()
    await currentPage.logIn(email, password)
    await dashboardPage.loadPage([dashboardPage.ticketsBlock])
    await sideMenuNavigationComponent.navigateToCategory("messenger")
})

test.afterEach(async () => {
    chatDataProvider.clear()
    if (widgetId != '') {
        await apiMessengerHelper.deleteWidget(authorizationToken, widgetId)
    }
    if (chatId != '') {
        await apiMessengerHelper.deleteChat(authorizationToken, chatId)
    }
})

const takeItFilteredViews = [FilteredView.WAITING_NOW, FilteredView.MISSED]
for (const takeItFilteredView of takeItFilteredViews) {
    test(`Take it single action for ${takeItFilteredView} status @all @smoke @messenger @takeItLiveChatAction`, async ({ currentPage }) => {
        const widgetName = 'New test widget' + Math.round(Math.random() * 10000)
        widgetId = await apiMessengerHelper.createNewWidget(authorizationToken, widgetName)
        chatDataProvider.setField('widgetId', widgetId)
        const returnedChatData = await apiMessengerHelper.createNewChat(authorizationToken, chatDataProvider.export())
        chatId = returnedChatData.chatId
        const chatToken = returnedChatData.token
        if (takeItFilteredView === FilteredView.MISSED)
            await apiMessengerHelper.closeChat(chatToken, chatId)
        await messengerListPage.openFilteredView(takeItFilteredView)
        await messengerListPage.loadPage([messengerListPage.chatListSearchField])
        await messengerListPage.selectChatFromListByContactName(chatDataProvider.getField('name'))
        await messengerListPage.takeItBtn.click()

        //check that the chat is successfully taken in the app
        await messengerListPage.openFilteredView(FilteredView.MY_OPEN)
        await messengerListPage.loadPage([messengerListPage.chatListSearchField])
        await messengerListPage.selectChatFromListByContactName(chatDataProvider.getField('name'))
        if (takeItFilteredView === FilteredView.MISSED) {
            await expect.soft(await messengerListPage.getSomeoneLeftChatAuditLog(chatDataProvider.getField('name'))).toBeVisible()
            await expect.soft(await messengerListPage.getChatStatusUpdatedLog(ChatStatus.MISSED)).toBeVisible()
        }
        await expect.soft(await messengerListPage.getSomeoneUpdatedChatStatusLog(agentFullName, ChatStatus.OPEN)).toBeVisible()
        await expect.soft(await messengerListPage.getSomeoneAssignedChatToLog(agentFullName, agentFullName)).toBeVisible()
        if (takeItFilteredView === FilteredView.WAITING_NOW)
            await expect.soft(await messengerListPage.getSomeoneJoinedChatLog(agentFullName)).toBeVisible()
        await apiMessengerHelper.solveChat(authorizationToken, chatId)
    })
}

const assignRequestsFilteredViews = [FilteredView.WAITING_NOW, FilteredView.MISSED]
for (const assignRequestsFilteredView of assignRequestsFilteredViews) {
    test(`Assign requests single action for ${assignRequestsFilteredView} status @all @smoke @messenger @assignRequestsLiveChatAction`, async ({ currentPage }) => {
        const widgetName = 'New test widget' + Math.round(Math.random() * 10000)
        widgetId = await apiMessengerHelper.createNewWidget(authorizationToken, widgetName)
        chatDataProvider.setField('widgetId', widgetId)
        const returnedChatData = await apiMessengerHelper.createNewChat(authorizationToken, chatDataProvider.export())
        chatId = returnedChatData.chatId
        const chatToken = returnedChatData.token
        if (assignRequestsFilteredView === FilteredView.MISSED)
            await apiMessengerHelper.closeChat(chatToken, chatId)
        await messengerListPage.openFilteredView(assignRequestsFilteredView)
        await messengerListPage.loadPage([messengerListPage.chatListSearchField])
        await messengerListPage.selectChatFromListByContactName(chatDataProvider.getField('name'))
        if (assignRequestsFilteredView === FilteredView.MISSED)
            await messengerListPage.moreBtn.click({ delay: 1000 })
        await messengerListPage.assignBtn.click()
        await assignChatModal.loadPage([assignChatModal.assignRequestLabel])
        await assignChatModal.assignBtn.click()

        //check that the chat is successfully assigned in the app
        await expect.soft(messengerListPage.chatUpdatedMsg).toBeVisible()
        await messengerListPage.openFilteredView(FilteredView.MY_OPEN)
        await messengerListPage.loadPage([messengerListPage.chatListSearchField])
        await messengerListPage.selectChatFromListByContactName(chatDataProvider.getField('name'))
        if (assignRequestsFilteredView === FilteredView.MISSED) {
            await expect.soft(await messengerListPage.getSomeoneLeftChatAuditLog(chatDataProvider.getField('name'))).toBeVisible()
            await expect.soft(await messengerListPage.getChatStatusUpdatedLog(ChatStatus.MISSED)).toBeVisible()
        }
        await expect.soft(await messengerListPage.getSomeoneUpdatedChatStatusLog(agentFullName, ChatStatus.OPEN)).toBeVisible()
        await expect.soft(await messengerListPage.getSomeoneAssignedChatToLog(agentFullName, agentFullName)).toBeVisible()
        if (assignRequestsFilteredView === FilteredView.WAITING_NOW)
            await expect.soft(await messengerListPage.getSomeoneJoinedChatLog(agentFullName)).toBeVisible()
        await apiMessengerHelper.solveChat(authorizationToken, chatId)
    })
}

const assignChatsFilteredViews = [FilteredView.MY_OPEN, FilteredView.MY_SOLVED]
for (const assignChatsFilteredView of assignChatsFilteredViews) {
    test(`Assign chats single action for ${assignChatsFilteredView} status @all @smoke @messenger @assignChatsLiveChatAction`, async ({ currentPage }) => {
        const widgetName = 'New test widget' + Math.round(Math.random() * 10000)
        widgetId = await apiMessengerHelper.createNewWidget(authorizationToken, widgetName)
        chatDataProvider.setField('widgetId', widgetId)
        const returnedChatData = await apiMessengerHelper.createNewChat(authorizationToken, chatDataProvider.export())
        chatId = returnedChatData.chatId
        await apiMessengerHelper.takeChat(authorizationToken, chatId)
        if (assignChatsFilteredView === FilteredView.MY_SOLVED)
            await apiMessengerHelper.solveChat(authorizationToken, chatId)
        await messengerListPage.openFilteredView(assignChatsFilteredView)
        await messengerListPage.loadPage([messengerListPage.chatListSearchField])
        await messengerListPage.selectChatFromListByContactName(chatDataProvider.getField('name'))
        await messengerListPage.theeDotsChatHeaderBtn.click({ delay: 1000 })
        await messengerListPage.assignBtn.click()
        await assignChatModal.loadPage([assignChatModal.assignChatLabel])
        await assignChatModal.assigneeList.click({ delay: 1000 })
        await assignChatModal.selectValueInDropdown('Unassigned')
        await assignChatModal.assignBtn.click()

        //check that the chat is successfully assigned in the app
        await expect.soft(messengerListPage.chatUpdatedMsg).toBeVisible()
        await expect.soft(await messengerListPage.getSomeoneUpdatedChatStatusLog(agentFullName, ChatStatus.OPEN)).toBeVisible()
        await expect.soft(await messengerListPage.getSomeoneAssignedChatToLog(agentFullName, agentFullName)).toBeVisible()
        await expect.soft(await messengerListPage.getSomeoneJoinedChatLog(agentFullName)).toBeVisible()
        if (assignChatsFilteredView === FilteredView.MY_SOLVED)
            await expect.soft(await messengerListPage.getSomeoneUpdatedChatStatusLog(agentFullName, ChatStatus.SOLVED)).toBeVisible()
        await expect.soft(await messengerListPage.getSomeoneRemovedAssigneeLog(agentFullName)).toBeVisible()
        if (assignChatsFilteredView === FilteredView.MY_OPEN)
            await apiMessengerHelper.solveChat(authorizationToken, chatId)
    })
}

test(`Reject single action for Waiting now status @all @smoke @messenger @rejectLiveChatAction`, async ({ currentPage }) => {
        const widgetName = 'New test widget' + Math.round(Math.random() * 10000)
        widgetId = await apiMessengerHelper.createNewWidget(authorizationToken, widgetName)
        chatDataProvider.setField('widgetId', widgetId)
        const returnedChatData = await apiMessengerHelper.createNewChat(authorizationToken, chatDataProvider.export())
        chatId = returnedChatData.chatId
        await messengerListPage.openFilteredView(FilteredView.WAITING_NOW)
        await messengerListPage.loadPage([messengerListPage.chatListSearchField])
        await messengerListPage.selectChatFromListByContactName(chatDataProvider.getField('name'))
        await messengerListPage.rejectBtn.click()
        const rejectReason = 'Too many chat requests with spam messages'
        await rejectChatModal.rejectReasonField.fill(rejectReason)
        await rejectChatModal.rejectBtn.click()

        //check that the chat is successfully rejected in the app
        await expect.soft(messengerListPage.chatRejectedMsg).toBeVisible()
        await messengerListPage.openFilteredView(FilteredView.ALL_SOLVED)
        await messengerListPage.loadPage([messengerListPage.chatListSearchField])
        await messengerListPage.selectChatFromListByContactName(chatDataProvider.getField('name'))
        await expect.soft(await messengerListPage.getSomeoneRejectedRequestWithReasonLog(agentFullName, rejectReason)).toBeVisible()
        await expect.soft(await messengerListPage.getSomeoneUpdatedChatStatusLog(agentFullName, ChatStatus.SOLVED)).toBeVisible()
})

const markAsSolvedFilteredViews = [FilteredView.MISSED, FilteredView.MY_OPEN]
for (const markAsSolvedFilteredView of markAsSolvedFilteredViews) {
    test(`Mark as solved single action for ${markAsSolvedFilteredView} status @all @smoke @messenger @markAsSolvedLiveChatAction`, async ({ currentPage }) => {
        const widgetName = 'New test widget' + Math.round(Math.random() * 10000)
        widgetId = await apiMessengerHelper.createNewWidget(authorizationToken, widgetName)
        chatDataProvider.setField('widgetId', widgetId)
        const returnedChatData = await apiMessengerHelper.createNewChat(authorizationToken, chatDataProvider.export())
        chatId = returnedChatData.chatId
        const chatToken = returnedChatData.token
        if (markAsSolvedFilteredView === FilteredView.MISSED)
            await apiMessengerHelper.closeChat(chatToken, chatId)
        else if (markAsSolvedFilteredView === FilteredView.MY_OPEN)
            await apiMessengerHelper.takeChat(authorizationToken, chatId)
        await messengerListPage.openFilteredView(markAsSolvedFilteredView)
        await messengerListPage.loadPage([messengerListPage.chatListSearchField])
        await messengerListPage.selectChatFromListByContactName(chatDataProvider.getField('name'))
        if (markAsSolvedFilteredView === FilteredView.MISSED)
            await messengerListPage.solveRequestSectionBtn.click()
        else if (markAsSolvedFilteredView === FilteredView.MY_OPEN) {
            await messengerListPage.solveChatHeaderBtn.click()
            await expect.soft(await markChatAsSolvedModal.getOngoingConversationWithContactLabel(chatDataProvider.getField('name'))).toBeVisible()
            await markChatAsSolvedModal.markAsSolvedBtn.click()
        }

        //check that the chat is successfully marked as solved in the app
        await expect.soft(messengerListPage.chatSolvedMsg).toBeVisible()
        await messengerListPage.openFilteredView(FilteredView.MY_SOLVED)
        await messengerListPage.loadPage([messengerListPage.chatListSearchField])
        await messengerListPage.selectChatFromListByContactName(chatDataProvider.getField('name'))
        if (markAsSolvedFilteredView === FilteredView.MISSED) {
            await expect.soft(await messengerListPage.getSomeoneLeftChatAuditLog(chatDataProvider.getField('name'))).toBeVisible()
            await expect.soft(await messengerListPage.getChatStatusUpdatedLog(ChatStatus.MISSED)).toBeVisible()
        }
        else if (markAsSolvedFilteredView === FilteredView.MY_OPEN) {
            await expect.soft(await messengerListPage.getSomeoneUpdatedChatStatusLog(agentFullName, ChatStatus.OPEN)).toBeVisible()
            await expect.soft(await messengerListPage.getSomeoneJoinedChatLog(agentFullName)).toBeVisible()
        }
        await expect.soft(await messengerListPage.getSomeoneUpdatedChatStatusLog(agentFullName, ChatStatus.SOLVED)).toBeVisible()
        await expect.soft(await messengerListPage.getSomeoneAssignedChatToLog(agentFullName, agentFullName)).toBeVisible()
    })
}