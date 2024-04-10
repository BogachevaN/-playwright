import { Locator, Page } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class NewWidgetModal extends BaseModal {
    readonly widgetNameInput: Locator
    readonly preview: Locator
    readonly domainInput: Locator

    constructor(page: Page) {
        super(page)
        this.widgetNameInput = page.getByTestId('adminApp_modalWrapper-widgetCreateOrUpdate_form-widgetForm_field-name').locator('input')
        this.domainInput = page.getByTestId('adminApp_modalWrapper-widgetCreateOrUpdate_form-widgetForm_field-domain').locator('input')
        this.preview = page.locator('div.tp-modal__main>div>div.q-chip__content')
    }

    async getDomainValue(widgetName:string) {
        return widgetName.replace(/ /g,'') + '.org'
    }
}
