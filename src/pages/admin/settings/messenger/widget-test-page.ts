import { Locator, Page } from '@playwright/test'
import { envVars } from "@/helpers/environment-variables-helper"
import { BasePage } from '@/pages/base-page'

export class WidgetTestPage extends BasePage {
    readonly baseUrl: string
    readonly chatWithUsBtn: Locator
    readonly startChatBtn:Locator
    readonly emailPreChatField: Locator
    readonly namePreChatField: Locator
    readonly messagePreChatField: Locator
    readonly preChatFormLabel: Locator
    readonly emailPreChatValue: Locator
    readonly namePreChatValue: Locator
    readonly messagePreChatValue: Locator
    readonly threeDotsIcon: Locator
    readonly endChatBtnPopup: Locator
    readonly endChatBtn: Locator
    readonly feedbackField: Locator
    readonly leaveFeedbackBtn: Locator
    readonly startNewChatBtn: Locator
    readonly chatHasEndedLabel: Locator
    readonly ratedChatAsGoodLabel: Locator
    readonly closeBtn: Locator
    readonly leaveCommentBtn: Locator

    constructor(page: Page) {
        super(page)
        this.baseUrl = `${envVars.baseUrl}/widget-test-page/`
        this.chatWithUsBtn = page.frameLocator('iframe').getByText('Contact us')
        this.startChatBtn = page.frameLocator('iframe').getByText('Start chat')
        this.emailPreChatField = page.frameLocator('iframe').getByTestId('form-startChatForm_field-email').locator('input')
        this.namePreChatField = page.frameLocator('iframe').getByTestId('form-startChatForm_field-name').locator('input')
        this.messagePreChatField = page.frameLocator('iframe').getByTestId('form-startChatForm_field-message').locator('//textarea[@name="message"]')
        this.preChatFormLabel = page.frameLocator('iframe').getByText('Pre-chat form')
        this.namePreChatValue = page.frameLocator('iframe').locator('//span[contains(text(), "Name:")]/parent::span')
        this.emailPreChatValue = page.frameLocator('iframe').locator('//span[contains(text(), "Email:")]/parent::span')
        this.messagePreChatValue = page.frameLocator('iframe').locator('//span[contains(text(), "Message:")]/parent::span')
        this.threeDotsIcon = page.frameLocator('iframe').locator('button').filter({ hasText: 'more_vert' }).first()
        this.endChatBtnPopup = page.frameLocator('iframe').getByRole('button', { name: 'End chat' })
        this.endChatBtn = page.frameLocator('iframe').locator('//div[@class = "chatting-popover"]//span[text() = "End chat"]')
        this.feedbackField = page.frameLocator('iframe').getByTestId('form-chatPopoverForm_field-feedback').locator('//textarea[@name="feedback"]')
        this.leaveFeedbackBtn = page.frameLocator('iframe').getByTestId('form-chatPopoverForm_form-submit')
        this.startNewChatBtn = page.frameLocator('iframe').getByRole('button', { name: 'Start new chat' })
        this.chatHasEndedLabel = page.frameLocator('iframe').getByText('Chat has ended')
        this.ratedChatAsGoodLabel = page.frameLocator('iframe').getByText('You rated this chat as Good')
        this.closeBtn = page.frameLocator('iframe').locator('button').filter({ hasText: 'close' })
        this.leaveCommentBtn = page.frameLocator('iframe').getByRole('button', { name: 'Leave comment' })
    }

    async getFeedbackFromWidget(feedback: string): Promise<Locator> {
        return this.page.frameLocator('iframe').getByText('You left the following comment ').filter({ hasText: feedback });
    }

    async startChatFromWidget(email: string, name: string, message: string) {
        await this.chatWithUsBtn.click()
        await this.loadPage([this.startChatBtn])
        await this.emailPreChatField.fill(email)
        await this.namePreChatField.fill(name)
        await this.messagePreChatField.click()
        await this.messagePreChatField.fill(message)
        await this.startChatBtn.click()
        await this.loadPage([this.preChatFormLabel])
    }

    async rateChat(rate: string) {
        await this.page.frameLocator('iframe').getByRole('button', { name: rate }).click()
    }

    async endChatLeavingFeedback(rate: string, feedback: string) {
        await this.threeDotsIcon.click()
        await this.endChatBtnPopup.click()
        await this.loadPage([this.endChatBtn])
        await this.endChatBtn.click()
        await this.rateChat(rate)
        await this.feedbackField.click()
        await this.feedbackField.fill(feedback)
        await this.leaveFeedbackBtn.click()
    }
}