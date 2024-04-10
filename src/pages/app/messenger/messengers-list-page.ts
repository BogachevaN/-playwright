import { Locator, Page } from '@playwright/test'
import { envVars } from "@/helpers/environment-variables-helper"
import { BasePage } from '@/pages/base-page'

export class MessengersListPage extends BasePage {
    readonly baseUrl: string
    readonly redirectUrl: string
    readonly testWidgetBtn: Locator
    readonly noMessagesText: Locator
    readonly chatListSearchField: Locator
    readonly chatPreview: Locator
    readonly preChatFormLabel: Locator
    readonly emailPreChatValue: Locator
    readonly namePreChatValue: Locator
    readonly messagePreChatValue: Locator
    readonly showMoreFieldsBtn: Locator
    readonly chatIdValue: Locator
    readonly leftChatLog: Locator
    readonly ratedThisChatLog: Locator
    readonly takeItBtn: Locator
    readonly assignBtn: Locator
    readonly chatUpdatedMsg: Locator
    readonly chatRejectedMsg: Locator
    readonly chatSolvedMsg: Locator
    readonly moreBtn: Locator
    readonly theeDotsChatHeaderBtn: Locator
    readonly rejectBtn: Locator
    readonly solveRequestSectionBtn: Locator
    readonly solveChatHeaderBtn: Locator

    constructor(page: Page) {
        super(page)
        this.baseUrl = `${envVars.baseUrl}/messenger`
        this.redirectUrl = `${envVars.baseUrl}/messenger?filteredViewId=`
        this.testWidgetBtn = page.getByRole('button', { name: 'Test widget'})
        this.noMessagesText = page.getByText('Your open chats will be displayed here')
        this.chatListSearchField = page.locator('//input[@serviceid = "messengerChatList"]')
        this.chatPreview = page.locator('//div[@class="chat-preview__body"]')
        this.preChatFormLabel = page.getByText('Pre-chat form')
        this.namePreChatValue = page.locator('//strong[contains(text(), "Name:")]/following::span[1]')
        this.emailPreChatValue = page.locator('//strong[contains(text(), "Email:")]/following::span[1]')
        this.messagePreChatValue = page.locator('//strong[contains(text(), "Message:")]/following::span[1]')
        this.showMoreFieldsBtn = page.getByRole('button', { name: 'Show more fields' })
        this.chatIdValue = page.locator('//div[contains(text(), "Chat ID:")]/following::div[@class="tp-ellipsis__in"][1]')
        this.takeItBtn = page.getByRole('button', { name: 'Take it' })
        this.assignBtn = page.getByRole('button', { name: 'Assign' })
        this.chatUpdatedMsg = page.getByText('The chat has been successfully updated').first()
        this.chatRejectedMsg = page.getByText('The request has been successfully rejected').first()
        this.chatSolvedMsg = page.getByText('The chat has been successfully marked as solved.').first()
        this.moreBtn = page.getByRole('button', { name: 'More', exact: true })
        this.theeDotsChatHeaderBtn = page.locator('//div[@class = "messenger-chat-layout__header"]').getByRole('button').filter({ hasText: 'more_vert' })
        this.rejectBtn = page.getByRole('button', { name: 'Reject' })
        this.solveRequestSectionBtn = page.getByRole('button', { name: 'Solve' })
        this.solveChatHeaderBtn = page.getByRole('button').filter({ hasText: 'task_alt' })
    }

    async openFilteredView(name: string) {
        await this.page.locator('//div[@class="messenger-tabs-item__title"]').filter({ hasText: `${name}` }).click()
    }
    
    async searchChatList(searchRequest: string) {
        await this.chatListSearchField.fill(searchRequest)
        await this.page.keyboard.press('Enter');
    }

    async getSomeoneLeftChatAuditLog(fullName: string): Promise<Locator> {
        return this.page.getByText(fullName + ' left chat')
    }

    async getSomeoneRatedChatAsLog(fullName: string, rate: string): Promise<Locator> {
        return this.page.getByText(fullName + ' rated this chat as ' + rate)
    }

    async getFeedbackFromApp(fullName: string, feedback: string): Promise<Locator> {
        return this.page.getByText(fullName + ' left the following comment ' + '"' + feedback + '"')
    }

    async getChatIdFromSidebar(): Promise<string> {
        await this.showMoreFieldsBtn.click()
        return await this.chatIdValue.innerText()
    }

    async selectChatFromListByContactName(fullName: string) {
        await this.searchChatList(fullName)
        await this.loadPage([this.chatPreview])
        await this.chatPreview.click({ position: { x: 10, y: 10} })
    }

    async getChatStatusUpdatedLog(status: string): Promise<Locator> {
        return this.page.getByText('Chat status updated to ' + status)
    }

    async getSomeoneUpdatedChatStatusLog(fullName: string, status: string): Promise<Locator> {
        return this.page.getByText(fullName + ' updated chat status to ' + status)
    }

    async getSomeoneAssignedChatToLog(fullName: string, assignee: string): Promise<Locator> {
        return this.page.getByText(fullName + ' assigned chat to ' + assignee)
    }

    async getSomeoneJoinedChatLog(fullName: string): Promise<Locator> {
        return this.page.getByText(fullName + ' joined chat')
    }

    async getSomeoneRemovedAssigneeLog(fullName: string): Promise<Locator> {
        return this.page.getByText(fullName + ' removed the assignee from the chat')
    }

    async getSomeoneRejectedRequestWithReasonLog(fullName: string, reason: string): Promise<Locator> {
        return this.page.getByText(fullName + ' rejected the request with the reason "' + reason + '"')
    }
}