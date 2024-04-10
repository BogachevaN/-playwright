import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class DeleteSegmentModal extends BaseModal {

    constructor(page: Page) {
        super(page);
    }

    async getFormText(segmentName: string) {
        return this.page.getByText(`By confirming this action, segment ${segmentName} will be deleted. All activities history of the segment and related files will be permanently deleted.`)
    }
}
