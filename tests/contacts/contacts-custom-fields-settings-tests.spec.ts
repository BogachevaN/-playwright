import { APITicketsHelper } from '@/helpers/api-helpers/api-tickets-helper'
import { expect, test } from '@/fixtures/start'
import { DashboardPage } from '@/pages/app/dashboard-page'
import { NewCustomFieldModal } from '@/pages/admin/common-forms/custom-fields/new-custom-field-modal'
import { dataProviderManager } from '@tests/data/DataManager'
import { DataProviderInterface } from '@tests/data/types'
import { CustomField } from '@tests/data/CustomFieldDataProvider'
import { APICustomFieldsHelper } from '@/helpers/api-helpers/api-custom-fields-helper'
import { ContactsCustomFieldsPage } from '@/pages/admin/settings/contacts/contacts-custom-fields-page'

let dashboardPage: DashboardPage
let email: string
let password: string
let apiHelper: APITicketsHelper
let authorizationToken: string
let contactsCustomFieldsPage: ContactsCustomFieldsPage
let newCustomFieldModal: NewCustomFieldModal
let customFieldDataProvider: DataProviderInterface<CustomField>
let apiCustomFieldsHelper: APICustomFieldsHelper
let fieldId: string

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    dashboardPage = new DashboardPage(currentPage.page)
    contactsCustomFieldsPage = new ContactsCustomFieldsPage(currentPage.page)
    newCustomFieldModal = new NewCustomFieldModal(currentPage.page)
    customFieldDataProvider = dataProviderManager.createProvider<CustomField>('customField')
    apiHelper = new APITicketsHelper()
    apiCustomFieldsHelper = new APICustomFieldsHelper()
    fieldId = ''

    for (const user of testDataHelper.users) {
        if (user.test == 'contacts_crud') {
            email = user.email
            password = user.password
        }
    }
    authorizationToken = (await apiHelper.getAuthorizationToken(email, password)).toString()
    await currentPage.logIn(email, password)
    await dashboardPage.loadPage([dashboardPage.ticketsBlock])
    await contactsCustomFieldsPage.open(contactsCustomFieldsPage.url)
    await contactsCustomFieldsPage.loadPage()
})

test.afterEach(async () => {
    if (fieldId != '') {
        await apiCustomFieldsHelper.deleteCustomField(authorizationToken, fieldId)
    }
})

test('Create new custom text field in contact @all @smoke @contactsSettings @createCustomTextFieldInContact', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    await contactsCustomFieldsPage.newCustomFieldBtn.click()
    await newCustomFieldModal.loadModal('New custom field')
    await newCustomFieldModal.fieldNameInput.fill(fieldName)
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(fieldName)
    await expect.soft(newCustomFieldModal.page.getByPlaceholder(`Enter ${fieldName}`)).toBeVisible()
    await newCustomFieldModal.confirmModal()
    await expect.soft(contactsCustomFieldsPage.fieldCreatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, fieldName, 'contact')
    await contactsCustomFieldsPage.searchCustomField(fieldName)
    const row = await contactsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await contactsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toContain('text_fields')
})

test('Create new custom number field in contact @all @smoke @contactsSettings @createCustomNumberFieldInContact', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    await contactsCustomFieldsPage.newCustomFieldBtn.click()
    await newCustomFieldModal.loadModal('New custom field')
    await newCustomFieldModal.fieldNameInput.fill(fieldName)
    await newCustomFieldModal.fieldTypeList.click()
    await newCustomFieldModal.selectValueInDropdown('Number')
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(fieldName)
    await expect.soft(newCustomFieldModal.page.getByPlaceholder(`Enter ${fieldName}`)).toBeVisible()
    await newCustomFieldModal.confirmModal()
    await expect.soft(contactsCustomFieldsPage.fieldCreatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, fieldName, 'contact')
    await contactsCustomFieldsPage.searchCustomField(fieldName)
    const row = await contactsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await contactsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toEqual('Number')
})

test('Create new custom date field in contact @all @smoke @contactsSettings @createCustomDateFieldInContact', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    await contactsCustomFieldsPage.newCustomFieldBtn.click()
    await newCustomFieldModal.loadModal('New custom field')
    await newCustomFieldModal.fieldNameInput.fill(fieldName)
    await newCustomFieldModal.fieldTypeList.click()
    await newCustomFieldModal.selectValueInDropdown('Date')
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(fieldName)
    await expect.soft(newCustomFieldModal.page.getByPlaceholder(`Select date`)).toBeVisible()
    await newCustomFieldModal.confirmModal()
    await expect.soft(contactsCustomFieldsPage.fieldCreatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, fieldName, 'contact')
    await contactsCustomFieldsPage.searchCustomField(fieldName)
    const row = await contactsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await contactsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toContain('event')
})

test('Create new custom checkbox field in contact @all @smoke @contactsSettings @createCustomCheckboxFieldInContact', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    await contactsCustomFieldsPage.newCustomFieldBtn.click()
    await newCustomFieldModal.loadModal('New custom field')
    await newCustomFieldModal.fieldNameInput.fill(fieldName)
    await newCustomFieldModal.fieldTypeList.click()
    await newCustomFieldModal.selectValueInDropdown('Checkbox')
    await expect.soft(newCustomFieldModal.checkboxDescriptionInput).toBeVisible()
    await newCustomFieldModal.checkboxDescriptionInput.fill('Test description')
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(fieldName)
    expect.soft(await newCustomFieldModal.page.getByTestId('adminApp_modalWrapper-customField_form-customFieldForm_field').locator('div > div.q-checkbox__label').innerHTML())
        .toEqual('Test description')
    await newCustomFieldModal.confirmModal()
    await expect.soft(contactsCustomFieldsPage.fieldCreatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, fieldName, 'contact')
    await contactsCustomFieldsPage.searchCustomField(fieldName)
    const row = await contactsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await contactsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toEqual('Checkbox')
})

test('Create new custom drop-down list field in contact @all @smoke @contactsSettings @createCustomDropDownListFieldInContact', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    await contactsCustomFieldsPage.newCustomFieldBtn.click()
    await newCustomFieldModal.loadModal('New custom field')
    await newCustomFieldModal.fieldNameInput.fill(fieldName)
    await newCustomFieldModal.fieldTypeList.click()
    await newCustomFieldModal.selectValueInDropdown('Drop-down list')
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(fieldName)
    await newCustomFieldModal.addDropdownValues(2, 'Test value')
    await newCustomFieldModal.checkDropdownValues(2, 'Test value')
    await newCustomFieldModal.confirmModal()
    await expect.soft(contactsCustomFieldsPage.fieldCreatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, fieldName, 'contact')
    await contactsCustomFieldsPage.searchCustomField(fieldName)
    const row = await contactsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await contactsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toEqual('Drop-down list')
})

test('Update custom text field in contact @all @smoke @contactsSettings @updateCustomTextFieldInContact', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    customFieldDataProvider.setField('entityType', 'contact')
    await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export()) 
    await contactsCustomFieldsPage.searchCustomField(fieldName)
    let row = await contactsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await contactsCustomFieldsPage.fieldsTable.openMenuInRow(row)
    await contactsCustomFieldsPage.fieldsTable.selectOptionInDropdownMenu('Edit')
    await newCustomFieldModal.loadModal('Edit custom field')
    const newFieldName = fieldName + '_edit'
    await newCustomFieldModal.fieldNameInput.fill(newFieldName)
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(newFieldName)
    await expect.soft(newCustomFieldModal.page.getByPlaceholder(`Enter ${newFieldName}`)).toBeVisible()
    await newCustomFieldModal.confirmModal()
    await expect.soft(contactsCustomFieldsPage.fieldUpdatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, newFieldName, 'contact')
    await contactsCustomFieldsPage.searchCustomField(newFieldName)
    row = await contactsCustomFieldsPage.fieldsTable.getRowByText(newFieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await contactsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toContain('text_fields')
})

test('Update custom date field in contact @all @smoke @contactsSettings @updateCustomDateFieldInContact', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    customFieldDataProvider.setField('type', 'datetime')
    customFieldDataProvider.setField('entityType', 'contact')
    await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export()) 
    await contactsCustomFieldsPage.searchCustomField(fieldName)
    let row = await contactsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await contactsCustomFieldsPage.fieldsTable.openMenuInRow(row)
    await contactsCustomFieldsPage.fieldsTable.selectOptionInDropdownMenu('Edit')
    await newCustomFieldModal.loadModal('Edit custom field')
    const newFieldName = fieldName + '_edit'
    await newCustomFieldModal.fieldNameInput.fill(newFieldName)
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(newFieldName)
    await expect.soft(newCustomFieldModal.page.getByPlaceholder(`Select date`)).toBeVisible()
    await newCustomFieldModal.confirmModal()
    await expect.soft(contactsCustomFieldsPage.fieldUpdatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, newFieldName, 'contact')
    await contactsCustomFieldsPage.searchCustomField(newFieldName)
    row = await contactsCustomFieldsPage.fieldsTable.getRowByText(newFieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await contactsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toContain('event')
})

test('Update custom checkbox field in contact @all @smoke @contactsSettings @updateCustomCheckboxFieldInContact', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    customFieldDataProvider.setField('type', 'checkbox')
    customFieldDataProvider.setField('description', 'Test description')
    customFieldDataProvider.setField('entityType', 'contact')
    await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export()) 
    await contactsCustomFieldsPage.searchCustomField(fieldName)
    let row = await contactsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await contactsCustomFieldsPage.fieldsTable.openMenuInRow(row)
    await contactsCustomFieldsPage.fieldsTable.selectOptionInDropdownMenu('Edit')
    await newCustomFieldModal.loadModal('Edit custom field')
    const newFieldName = fieldName + '_edit'
    const newDescription = 'Test description_edit'
    await newCustomFieldModal.fieldNameInput.fill(newFieldName)
    await newCustomFieldModal.checkboxDescriptionInput.fill(newDescription)
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(newFieldName)
    expect.soft(await newCustomFieldModal.page.getByTestId('adminApp_modalWrapper-customField_form-customFieldForm_field').locator('div > div.q-checkbox__label').innerHTML())
        .toEqual(newDescription)
    await newCustomFieldModal.confirmModal()
    await expect.soft(contactsCustomFieldsPage.fieldUpdatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, newFieldName, 'contact')
    await contactsCustomFieldsPage.searchCustomField(newFieldName)
    row = await contactsCustomFieldsPage.fieldsTable.getRowByText(newFieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await contactsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toEqual('Checkbox')
})

test('Update custom number field in contact @all @smoke @contactsSettings @updateCustomNumberFieldInContact', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    customFieldDataProvider.setField('type', 'number')
    customFieldDataProvider.setField('entityType', 'contact')
    await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export()) 
    await contactsCustomFieldsPage.searchCustomField(fieldName)
    let row = await contactsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await contactsCustomFieldsPage.fieldsTable.openMenuInRow(row)
    await contactsCustomFieldsPage.fieldsTable.selectOptionInDropdownMenu('Edit')
    await newCustomFieldModal.loadModal('Edit custom field')
    const newFieldName = fieldName + '_edit'
    await newCustomFieldModal.fieldNameInput.fill(newFieldName)
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(newFieldName)
    await expect.soft(newCustomFieldModal.page.getByPlaceholder(`Enter ${newFieldName}`)).toBeVisible()
    await newCustomFieldModal.confirmModal()
    await expect.soft(contactsCustomFieldsPage.fieldUpdatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, newFieldName, 'contact')
    await contactsCustomFieldsPage.searchCustomField(newFieldName)
    row = await contactsCustomFieldsPage.fieldsTable.getRowByText(newFieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await contactsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toEqual('Number')
})

test('Update custom drop-down list field in contact @all @smoke @contactsSettings @updateCustomDropDownListFieldInContact', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    customFieldDataProvider.setField('type', 'dropdown')
    customFieldDataProvider.setField('option', 'Test value')
    customFieldDataProvider.setField('entityType', 'contact')
    await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export()) 
    await contactsCustomFieldsPage.searchCustomField(fieldName)
    let row = await contactsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await contactsCustomFieldsPage.fieldsTable.openMenuInRow(row)
    await contactsCustomFieldsPage.fieldsTable.selectOptionInDropdownMenu('Edit')
    await newCustomFieldModal.loadModal('Edit custom field')
    const newFieldName = fieldName + '_edit'
    await newCustomFieldModal.fieldNameInput.fill(newFieldName)
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(newFieldName)
    await newCustomFieldModal.addDropdownValues(2, 'Test value_edit')
    await newCustomFieldModal.checkDropdownValues(2, 'Test value_edit')
    await newCustomFieldModal.confirmModal()
    await expect.soft(contactsCustomFieldsPage.fieldUpdatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, newFieldName, 'contact')
    await contactsCustomFieldsPage.searchCustomField(newFieldName)
    row = await contactsCustomFieldsPage.fieldsTable.getRowByText(newFieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await contactsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toEqual('Drop-down list')
})

test('Delete custom field in contact @all @smoke @contactsSettings @deleteCustomFieldInContact', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    customFieldDataProvider.setField('entityType', 'contact')
    fieldId = await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export()) 
    await contactsCustomFieldsPage.searchCustomField(fieldName)
    const row = await contactsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await contactsCustomFieldsPage.fieldsTable.openMenuInRow(row)
    await contactsCustomFieldsPage.fieldsTable.selectOptionInDropdownMenu('Delete')
    await newCustomFieldModal.loadModal('Delete custom field')
    await newCustomFieldModal.confirmModal()
    await expect.soft(contactsCustomFieldsPage.fieldDeletedMsg).toBeVisible()
    await contactsCustomFieldsPage.searchCustomField(fieldName)
    await expect.soft(contactsCustomFieldsPage.fieldsTable.noSearchResultsHeader).toBeVisible()
    fieldId = ''
})