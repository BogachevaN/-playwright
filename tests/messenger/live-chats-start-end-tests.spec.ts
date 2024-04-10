import { expect, test } from '@/fixtures/start'
import { dataProviderManager } from '@tests/data/DataManager'
import { DataProviderInterface } from '../data/types'
import { Contact } from '@tests/data/ContactDataProvider'
import { APIMessengerHelper } from '@/helpers/api-helpers/api-messenger-helper'
import { DashboardPage } from '@/pages/app/dashboard-page'
import { APIBaseHelper } from '@/helpers/api-helpers/api-base-helper'
import { SideMenuNavigationComponent } from '@/components/app/sidemenu-navigation-component'
import { MessengersListPage } from '@/pages/app/messenger/messengers-list-page'
import { MessengerWidgetsPage } from '@/pages/admin/settings/messenger/messenger-widgets-page'
import { WidgetTestPage } from '@/pages/admin/settings/messenger/widget-test-page'

let apiHelper: APIBaseHelper
let apiMessengerHelper: APIMessengerHelper
let dashboardPage: DashboardPage
let sideMenuNavigationComponent: SideMenuNavigationComponent
let messengerListPage: MessengersListPage
let messengerWidgetsPage: MessengerWidgetsPage
let widgetTestPage: WidgetTestPage
let contactDataProvider: DataProviderInterface<Contact>
let email: string
let password: string
let authorizationToken: string
let widgetId: string
let chatId: string
let fullName: string

enum Rate {
    GOOD = 'Good',
    POOR = 'Poor',
  }

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    apiHelper = new APIBaseHelper()
    apiMessengerHelper = new APIMessengerHelper()
    dashboardPage = new DashboardPage(currentPage.page)
    sideMenuNavigationComponent = new SideMenuNavigationComponent(currentPage.page)
    messengerListPage = new MessengersListPage(currentPage.page)
    messengerWidgetsPage = new MessengerWidgetsPage(currentPage.page)
    contactDataProvider = dataProviderManager.createProvider<Contact>('contact')
    fullName = contactDataProvider.getField('firstName') + ' ' + contactDataProvider.getField('lastName')
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
})

test.afterEach(async () => {
    contactDataProvider.clear()
    if (widgetId != '') {
        await apiMessengerHelper.deleteWidget(authorizationToken, widgetId)
    }
    if (chatId != '') {
        await apiMessengerHelper.deleteChat(authorizationToken, chatId)
    }
})

test('Create a new live chat from a widget test page @all @smoke @messenger @createNewLiveChat', async ({ currentPage }) => {
    await sideMenuNavigationComponent.navigateToCategory("messenger")
    const widgetName = 'New test widget' + Math.round(Math.random() * 10000)
    const message = 'Hello, agent!' 
    widgetId = await apiMessengerHelper.createNewWidget(authorizationToken, widgetName)

    //create a new browser tab with the widget
    const widgetPage = await currentPage.page.context().newPage()
    widgetTestPage = new WidgetTestPage(widgetPage)
    await widgetPage.goto(messengerWidgetsPage.baseUrl)
    await widgetTestPage.open(widgetTestPage.baseUrl + widgetId)
    await widgetTestPage.loadPage([widgetTestPage.chatWithUsBtn])
    await widgetTestPage.startChatFromWidget(contactDataProvider.getField('email'), fullName, message)

    //check that the entered data are correctly displayed in the widget
    let actualNameInWidget = await widgetTestPage.namePreChatValue.innerText()
    actualNameInWidget = actualNameInWidget.substring((actualNameInWidget).indexOf(':') + 1).trim()
    expect.soft(actualNameInWidget).toEqual(fullName)
    let actualEmailInWidget = await widgetTestPage.emailPreChatValue.innerText()
    actualEmailInWidget = actualEmailInWidget.substring((actualEmailInWidget).indexOf(':') + 1).trim()
    expect.soft(actualEmailInWidget).toEqual(contactDataProvider.getField('email'))
    let actualMessageInWidget = await widgetTestPage.messagePreChatValue.innerText()
    actualMessageInWidget = actualMessageInWidget.substring((actualMessageInWidget).indexOf(':') + 1).trim()
    expect.soft(actualMessageInWidget).toEqual(message)

    //check that the entered data are correctly displayed in the app
    await messengerListPage.openFilteredView("Waiting now")
    await messengerListPage.loadPage([messengerListPage.chatListSearchField])
    await messengerListPage.selectChatFromListByContactName(fullName)
    expect.soft(await messengerListPage.namePreChatValue.innerText()).toEqual(fullName)
    expect.soft(await messengerListPage.emailPreChatValue.innerText()).toEqual(contactDataProvider.getField('email'))
    expect.soft(await messengerListPage.messagePreChatValue.innerText()).toEqual(message)

    //get chatId to remove the created chat
    chatId = await messengerListPage.getChatIdFromSidebar()
    await apiMessengerHelper.rejectChat(authorizationToken, chatId)
})

test('Live chat ended successfully by End chat button in the widget @all @smoke @messenger @liveChatEndedFromWidget', async ({ currentPage }) => {
    await sideMenuNavigationComponent.navigateToCategory("messenger")
    const widgetName = 'New test widget' + Math.round(Math.random() * 10000)
    const message = 'Hello, agent!' 
    const feedback = 'Amazing support, thank you!'
    const rate = Rate.GOOD
    widgetId = await apiMessengerHelper.createNewWidget(authorizationToken, widgetName)

    //create a new browser tab with the widget
    const widgetPage = await currentPage.page.context().newPage()
    widgetTestPage = new WidgetTestPage(widgetPage)
    await widgetPage.goto(messengerWidgetsPage.baseUrl)
    await widgetTestPage.open(widgetTestPage.baseUrl + widgetId)
    await widgetTestPage.loadPage([widgetTestPage.chatWithUsBtn])
    await widgetTestPage.startChatFromWidget(contactDataProvider.getField('email'), fullName, message)

    //end chat and leave feedback
    await widgetTestPage.endChatLeavingFeedback(rate, feedback)

    //check that feedback data are correctly displayed in the widget
    await widgetTestPage.loadPage([widgetTestPage.chatHasEndedLabel, widgetTestPage.ratedChatAsGoodLabel, widgetTestPage.startNewChatBtn])
    await widgetTestPage.loadPage([await widgetTestPage.getFeedbackFromWidget(feedback)])

    //check that feedback data are correctly displayed in the app
    await messengerListPage.openFilteredView("Missed")
    await messengerListPage.loadPage([messengerListPage.chatListSearchField])
    await messengerListPage.selectChatFromListByContactName(fullName)
    await messengerListPage.loadPage([await messengerListPage.getSomeoneLeftChatAuditLog(fullName)])
    await messengerListPage.loadPage([await messengerListPage.getSomeoneRatedChatAsLog(fullName, 'Good')])
    await messengerListPage.loadPage([await messengerListPage.getFeedbackFromApp(fullName, feedback)])

    //get chatId to remove the created chat
    chatId = await messengerListPage.getChatIdFromSidebar()
})

test('Start a new live chat in the widget after successfully ended one @all @smoke @messenger @startNewLiveChatAfterEndedOne', async ({ currentPage }) => {
    await sideMenuNavigationComponent.navigateToCategory("messenger")
    const widgetName = 'New test widget' + Math.round(Math.random() * 10000)
    let message = 'Hello, agent!' 
    const feedback = 'Terrible support, shame on you!'
    const rate = Rate.POOR
    widgetId = await apiMessengerHelper.createNewWidget(authorizationToken, widgetName)

    //create a new browser tab with the widget
    const widgetPage = await currentPage.page.context().newPage()
    widgetTestPage = new WidgetTestPage(widgetPage)
    await widgetPage.goto(messengerWidgetsPage.baseUrl)
    await widgetTestPage.open(widgetTestPage.baseUrl + widgetId)
    await widgetTestPage.loadPage([widgetTestPage.chatWithUsBtn])
    await widgetTestPage.startChatFromWidget(contactDataProvider.getField('email'), fullName, message)

    //get chatId
    await messengerListPage.openFilteredView("Waiting now")
    await messengerListPage.loadPage([messengerListPage.chatListSearchField])
    await messengerListPage.selectChatFromListByContactName(fullName)
    chatId = await messengerListPage.getChatIdFromSidebar()

    //end chat
    await widgetTestPage.threeDotsIcon.click()
    await widgetTestPage.endChatBtnPopup.click()
    await widgetTestPage.loadPage([widgetTestPage.endChatBtn])
    await widgetTestPage.endChatBtn.click()

    //leave feedback by clicking on the link
    await widgetTestPage.rateChat(rate)
    await widgetTestPage.closeBtn.click()
    await widgetTestPage.leaveCommentBtn.click()
    await widgetTestPage.feedbackField.click()
    await widgetTestPage.feedbackField.fill(feedback)
    await widgetTestPage.leaveFeedbackBtn.click()
    await widgetTestPage.startNewChatBtn.click()

    //remove the initial chat
    await apiMessengerHelper.deleteChat(authorizationToken, chatId)

    //check that the initial values of Email and Name fields are saved
    message = 'Missed me, agent?'
    await widgetTestPage.messagePreChatField.click()
    await widgetTestPage.messagePreChatField.fill(message)
    await widgetTestPage.startChatBtn.click()

    //check that the entered data are correctly displayed in the widget
    let actualNameInWidget = await widgetTestPage.namePreChatValue.innerText()
    actualNameInWidget = actualNameInWidget.substring((actualNameInWidget).indexOf(':') + 1).trim()
    expect.soft(actualNameInWidget).toEqual(fullName)
    let actualEmailInWidget = await widgetTestPage.emailPreChatValue.innerText()
    actualEmailInWidget = actualEmailInWidget.substring((actualEmailInWidget).indexOf(':') + 1).trim()
    expect.soft(actualEmailInWidget).toEqual(contactDataProvider.getField('email'))
    let actualMessageInWidget = await widgetTestPage.messagePreChatValue.innerText()
    actualMessageInWidget = actualMessageInWidget.substring((actualMessageInWidget).indexOf(':') + 1).trim()
    expect.soft(actualMessageInWidget).toEqual(message)

    //check that the entered data are correctly displayed in the app
    await messengerListPage.openFilteredView("Waiting now")
    await messengerListPage.loadPage([messengerListPage.chatListSearchField])
    await messengerListPage.selectChatFromListByContactName(fullName)
    expect.soft(await messengerListPage.namePreChatValue.innerText()).toEqual(fullName)
    expect.soft(await messengerListPage.emailPreChatValue.innerText()).toEqual(contactDataProvider.getField('email'))
    expect.soft(await messengerListPage.messagePreChatValue.innerText()).toEqual(message)

    //get chatId to remove the created chat
    chatId = await messengerListPage.getChatIdFromSidebar()
    await apiMessengerHelper.rejectChat(authorizationToken, chatId)
})