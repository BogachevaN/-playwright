import { Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class DeleteWidgetModal extends BaseModal {

    constructor(page: Page) {
        super(page)
    }

    async getText(widgetName: string) {
        return this.page.getByText(`Deleting this web widget ${widgetName} will result in removing this widget from all pages. This change cannot be undone.
        Are you sure you would like to delete this widget?`)
    }
}
