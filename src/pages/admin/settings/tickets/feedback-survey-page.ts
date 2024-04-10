import { Locator, Page } from '@playwright/test'
import { envVars } from '@/helpers/environment-variables-helper'
import { BasePage } from '@/pages/base-page'

export class FeedbackSurveyPage extends BasePage {
    readonly url: string
    readonly sendFeedbackSurveyToggle: Locator
    readonly thankYouMessageInput: Locator

    constructor(page: Page) {
        super(page)
        this.url = `${envVars.baseUrl}/admin/settings/tickets/feedback-survey`
        this.sendFeedbackSurveyToggle = page.getByTestId('adminApp_form-ticketFeedbackSurveyForm_field-isNeedSendSatisfaction')
        this.thankYouMessageInput = page.getByTestId('adminApp_form-ticketFeedbackSurveyForm_field-thankYouMessage.main')
    }    
}