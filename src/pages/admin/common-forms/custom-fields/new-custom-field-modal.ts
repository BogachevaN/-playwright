import { Locator, Page, expect } from '@playwright/test'
import { BaseModal } from '@/pages/base-modal'

export class NewCustomFieldModal extends BaseModal {
    readonly fieldNameInput: Locator
    readonly fieldTypeList: Locator
    readonly previewTitle: Locator
    readonly checkboxDescriptionInput: Locator
    readonly addNewValueBtn: Locator

    constructor(page: Page) {
        super(page)
        this.fieldNameInput = page.getByTestId('adminApp_modalWrapper-customField_form-customFieldForm_field-name').locator('input')
        this.fieldTypeList = page.getByTestId('adminApp_modalWrapper-customField_form-customFieldForm_field-type')
        this.previewTitle = page.locator('.preview__title > div > h6')
        this.checkboxDescriptionInput = page.getByTestId('adminApp_modalWrapper-customField_form-customFieldForm_field-description').locator('input')
        this.addNewValueBtn = page.getByRole('button', { name: 'Add new value' })
    }

    async addDropdownValues(numberOfValues: number, value: string) {
        for (let i = 0; i < numberOfValues; i++) {
            const locator = `adminApp_modalWrapper-customField_form-customFieldForm_draggable-id_field-options.${i}.value`
            await this.page.getByTestId(locator).getByPlaceholder('Enter value').click()
            await this.page.getByTestId(locator).getByPlaceholder('Enter value').fill(value + i)
            if (i != numberOfValues - 1) {
                this.addNewValueBtn.click()
            }
        }
    } 

    async checkDropdownValues(numberOfValues: number, value: string) {
        await this.page.getByTestId('adminApp_modalWrapper-customField_form-customFieldForm_field').click()
        let option = ''
        for (let i = 0; i < numberOfValues; i++) {
            option = await this.page.locator('.simple-select-dropdown>div>div>span').nth(i).innerHTML()
            expect(option).toEqual(value + i)
        }
    }
}
