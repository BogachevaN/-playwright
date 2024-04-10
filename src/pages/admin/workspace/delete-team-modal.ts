import { Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class DeleteTeamModal extends BaseModal {

    constructor(page: Page) {
        super(page)
    }

    async getText(teamName: string) {
        return this.page.getByText(`You are going to delete ${teamName} team. After deletion, all users belonging to the team will stay in your workspace.`)
    }
}