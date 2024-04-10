import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class MarkChatAsSolvedModal extends BaseModal {
    readonly markAsSolvedBtn: Locator

    constructor(page: Page) {
        super(page)
        this.markAsSolvedBtn = page.getByRole('button', { name: 'Mark as solved' })
    }

    async getOngoingConversationWithContactLabel(contactFulName: string): Promise<Locator> {
        return this.page.getByText('You have an ongoing conversation with ' + contactFulName)
    }
}