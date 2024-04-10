import { APITicketsHelper } from '@/helpers/api-helpers/api-tickets-helper'
import { expect, test } from '@/fixtures/start'
import { DashboardPage } from '@/pages/app/dashboard-page'
import { TicketsCustomFieldsPage } from '@/pages/admin/settings/tickets/tickets-custom-fields-page'
import { NewCustomFieldModal } from '@/pages/admin/common-forms/custom-fields/new-custom-field-modal'
import { dataProviderManager } from '@tests/data/DataManager'
import { DataProviderInterface } from '@tests/data/types'
import { CustomField } from '@tests/data/CustomFieldDataProvider'
import { APICustomFieldsHelper } from '@/helpers/api-helpers/api-custom-fields-helper'

let dashboardPage: DashboardPage
let email: string
let password: string
let apiHelper: APITicketsHelper
let authorizationToken: string
let ticketsCustomFieldsPage: TicketsCustomFieldsPage
let newCustomFieldModal: NewCustomFieldModal
let customFieldDataProvider: DataProviderInterface<CustomField>
let apiCustomFieldsHelper: APICustomFieldsHelper
let fieldId: string

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    dashboardPage = new DashboardPage(currentPage.page)
    ticketsCustomFieldsPage = new TicketsCustomFieldsPage(currentPage.page)
    newCustomFieldModal = new NewCustomFieldModal(currentPage.page)
    customFieldDataProvider = dataProviderManager.createProvider<CustomField>('customField')
    apiHelper = new APITicketsHelper()
    apiCustomFieldsHelper = new APICustomFieldsHelper()
    fieldId = ''

    for (const user of testDataHelper.users) {
        if (user.test == 'tickets_crud') {
            email = user.email
            password = user.password
        }
    }
    authorizationToken = (await apiHelper.getAuthorizationToken(email, password)).toString()
    await currentPage.logIn(email, password)
    await dashboardPage.loadPage([dashboardPage.ticketsBlock])
    await ticketsCustomFieldsPage.open(ticketsCustomFieldsPage.url)
    await ticketsCustomFieldsPage.loadPage()
})

test.afterEach(async () => {
    if (fieldId != '') {
        await apiCustomFieldsHelper.deleteCustomField(authorizationToken, fieldId)
    }
})

test('Create new custom text field in ticket @all @smoke @ticketsSettings @createCustomTextFieldInTicket', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    await ticketsCustomFieldsPage.newCustomFieldBtn.click()
    await newCustomFieldModal.loadModal('New custom field')
    await newCustomFieldModal.fieldNameInput.fill(fieldName)
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(fieldName)
    await expect.soft(newCustomFieldModal.page.getByPlaceholder(`Enter ${fieldName}`)).toBeVisible()
    await newCustomFieldModal.confirmModal()
    await expect.soft(ticketsCustomFieldsPage.fieldCreatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, fieldName, 'ticket')
    await ticketsCustomFieldsPage.searchCustomField(fieldName)
    const row = await ticketsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await ticketsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toContain('text_fields')
})

test('Create new custom number field in ticket @all @smoke @ticketsSettings @createCustomNumberFieldInTicket', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    await ticketsCustomFieldsPage.newCustomFieldBtn.click()
    await newCustomFieldModal.loadModal('New custom field')
    await newCustomFieldModal.fieldNameInput.fill(fieldName)
    await newCustomFieldModal.fieldTypeList.click()
    await newCustomFieldModal.selectValueInDropdown('Number')
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(fieldName)
    await expect.soft(newCustomFieldModal.page.getByPlaceholder(`Enter ${fieldName}`)).toBeVisible()
    await newCustomFieldModal.confirmModal()
    await expect.soft(ticketsCustomFieldsPage.fieldCreatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, fieldName, 'ticket')
    await ticketsCustomFieldsPage.searchCustomField(fieldName)
    const row = await ticketsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await ticketsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toEqual('Number')
})

test('Create new custom date field in ticket @all @smoke @ticketsSettings @createCustomDateFieldInTicket', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    await ticketsCustomFieldsPage.newCustomFieldBtn.click()
    await newCustomFieldModal.loadModal('New custom field')
    await newCustomFieldModal.fieldNameInput.fill(fieldName)
    await newCustomFieldModal.fieldTypeList.click()
    await newCustomFieldModal.selectValueInDropdown('Date')
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(fieldName)
    await expect.soft(newCustomFieldModal.page.getByPlaceholder(`Select date`)).toBeVisible()
    await newCustomFieldModal.confirmModal()
    await expect.soft(ticketsCustomFieldsPage.fieldCreatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, fieldName, 'ticket')
    await ticketsCustomFieldsPage.searchCustomField(fieldName)
    const row = await ticketsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await ticketsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toContain('event')
})

test('Create new custom checkbox field in ticket @all @smoke @ticketsSettings @createCustomCheckboxFieldInTicket', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    await ticketsCustomFieldsPage.newCustomFieldBtn.click()
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
    await expect.soft(ticketsCustomFieldsPage.fieldCreatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, fieldName, 'ticket')
    await ticketsCustomFieldsPage.searchCustomField(fieldName)
    const row = await ticketsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await ticketsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toEqual('Checkbox')
})

test('Create new custom drop-down list field in ticket @all @smoke @ticketsSettings @createCustomDropDownListFieldInTicket', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    await ticketsCustomFieldsPage.newCustomFieldBtn.click()
    await newCustomFieldModal.loadModal('New custom field')
    await newCustomFieldModal.fieldNameInput.fill(fieldName)
    await newCustomFieldModal.fieldTypeList.click()
    await newCustomFieldModal.selectValueInDropdown('Drop-down list')
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(fieldName)
    await newCustomFieldModal.addDropdownValues(2, 'Test value')
    await newCustomFieldModal.checkDropdownValues(2, 'Test value')
    await newCustomFieldModal.confirmModal()
    await expect.soft(ticketsCustomFieldsPage.fieldCreatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, fieldName, 'ticket')
    await ticketsCustomFieldsPage.searchCustomField(fieldName)
    const row = await ticketsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await ticketsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toEqual('Drop-down list')
})

test('Update custom text field in ticket @all @smoke @ticketsSettings @updateCustomTextFieldInTicket', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export())
    await ticketsCustomFieldsPage.searchCustomField(fieldName) 
    let row = await ticketsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await ticketsCustomFieldsPage.fieldsTable.openMenuInRow(row)
    await ticketsCustomFieldsPage.fieldsTable.selectOptionInDropdownMenu('Edit')
    await newCustomFieldModal.loadModal('Edit custom field')
    const newFieldName = fieldName + '_edit'
    await newCustomFieldModal.fieldNameInput.fill(newFieldName)
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(newFieldName)
    await expect.soft(newCustomFieldModal.page.getByPlaceholder(`Enter ${newFieldName}`)).toBeVisible()
    await newCustomFieldModal.confirmModal()
    await expect.soft(ticketsCustomFieldsPage.fieldUpdatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, newFieldName, 'ticket')
    await ticketsCustomFieldsPage.searchCustomField(newFieldName)
    row = await ticketsCustomFieldsPage.fieldsTable.getRowByText(newFieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await ticketsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toContain('text_fields')
})

test('Update custom date field in ticket @all @smoke @ticketsSettings @updateCustomDateFieldInTicket', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    customFieldDataProvider.setField('type', 'datetime')
    await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export())
    await ticketsCustomFieldsPage.searchCustomField(fieldName) 
    let row = await ticketsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await ticketsCustomFieldsPage.fieldsTable.openMenuInRow(row)
    await ticketsCustomFieldsPage.fieldsTable.selectOptionInDropdownMenu('Edit')
    await newCustomFieldModal.loadModal('Edit custom field')
    const newFieldName = fieldName + '_edit'
    await newCustomFieldModal.fieldNameInput.fill(newFieldName)
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(newFieldName)
    await expect.soft(newCustomFieldModal.page.getByPlaceholder(`Select date`)).toBeVisible()
    await newCustomFieldModal.confirmModal()
    await expect.soft(ticketsCustomFieldsPage.fieldUpdatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, newFieldName, 'ticket')
    await ticketsCustomFieldsPage.searchCustomField(newFieldName)
    row = await ticketsCustomFieldsPage.fieldsTable.getRowByText(newFieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await ticketsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toContain('event')
})

test('Update custom checkbox field in ticket @all @smoke @ticketsSettings @updateCustomCheckboxFieldInTicket', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    customFieldDataProvider.setField('type', 'checkbox')
    customFieldDataProvider.setField('description', 'Test description')
    await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export()) 
    await ticketsCustomFieldsPage.searchCustomField(fieldName)
    let row = await ticketsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await ticketsCustomFieldsPage.fieldsTable.openMenuInRow(row)
    await ticketsCustomFieldsPage.fieldsTable.selectOptionInDropdownMenu('Edit')
    await newCustomFieldModal.loadModal('Edit custom field')
    const newFieldName = fieldName + '_edit'
    const newDescription = 'Test description_edit'
    await newCustomFieldModal.fieldNameInput.fill(newFieldName)
    await newCustomFieldModal.checkboxDescriptionInput.fill(newDescription)
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(newFieldName)
    expect.soft(await newCustomFieldModal.page.getByTestId('adminApp_modalWrapper-customField_form-customFieldForm_field').locator('div > div.q-checkbox__label').innerHTML())
        .toEqual(newDescription)
    await newCustomFieldModal.confirmModal()
    await expect.soft(ticketsCustomFieldsPage.fieldUpdatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, newFieldName, 'ticket')
    await ticketsCustomFieldsPage.searchCustomField(newFieldName)
    row = await ticketsCustomFieldsPage.fieldsTable.getRowByText(newFieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await ticketsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toEqual('Checkbox')
})

test('Update custom number field in ticket @all @smoke @ticketsSettings @updateCustomNumberFieldInTicket', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    customFieldDataProvider.setField('type', 'number')
    await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export()) 
    await ticketsCustomFieldsPage.searchCustomField(fieldName)
    let row = await ticketsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await ticketsCustomFieldsPage.fieldsTable.openMenuInRow(row)
    await ticketsCustomFieldsPage.fieldsTable.selectOptionInDropdownMenu('Edit')
    await newCustomFieldModal.loadModal('Edit custom field')
    const newFieldName = fieldName + '_edit'
    await newCustomFieldModal.fieldNameInput.fill(newFieldName)
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(newFieldName)
    await expect.soft(newCustomFieldModal.page.getByPlaceholder(`Enter ${newFieldName}`)).toBeVisible()
    await newCustomFieldModal.confirmModal()
    await expect.soft(ticketsCustomFieldsPage.fieldUpdatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, newFieldName, 'ticket')
    await ticketsCustomFieldsPage.searchCustomField(newFieldName)
    row = await ticketsCustomFieldsPage.fieldsTable.getRowByText(newFieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await ticketsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toEqual('Number')
})

test('Update custom drop-down list field in ticket @all @smoke @ticketsSettings @updateCustomDropDownListFieldInTicket', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    customFieldDataProvider.setField('type', 'dropdown')
    customFieldDataProvider.setField('option', 'Test value')
    await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export()) 
    await ticketsCustomFieldsPage.searchCustomField(fieldName)
    let row = await ticketsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await ticketsCustomFieldsPage.fieldsTable.openMenuInRow(row)
    await ticketsCustomFieldsPage.fieldsTable.selectOptionInDropdownMenu('Edit')
    await newCustomFieldModal.loadModal('Edit custom field')
    const newFieldName = fieldName + '_edit'
    await newCustomFieldModal.fieldNameInput.fill(newFieldName)
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(newFieldName)
    await newCustomFieldModal.addDropdownValues(2, 'Test value_edit')
    await newCustomFieldModal.checkDropdownValues(2, 'Test value_edit')
    await newCustomFieldModal.confirmModal()
    await expect.soft(ticketsCustomFieldsPage.fieldUpdatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, newFieldName, 'ticket')
    await ticketsCustomFieldsPage.searchCustomField(newFieldName)
    row = await ticketsCustomFieldsPage.fieldsTable.getRowByText(newFieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await ticketsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toEqual('Drop-down list')
})

test('Delete custom field in ticket @all @smoke @ticketsSettings @deleteCustomFieldInTicket', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    fieldId = await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export()) 
    await ticketsCustomFieldsPage.searchCustomField(fieldName)
    const row = await ticketsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await ticketsCustomFieldsPage.fieldsTable.openMenuInRow(row)
    await ticketsCustomFieldsPage.fieldsTable.selectOptionInDropdownMenu('Delete')
    await newCustomFieldModal.loadModal('Delete custom field')
    await newCustomFieldModal.confirmModal()
    await expect.soft(ticketsCustomFieldsPage.fieldDeletedMsg).toBeVisible()
    await ticketsCustomFieldsPage.searchCustomField(fieldName)
    await expect.soft(ticketsCustomFieldsPage.fieldsTable.noSearchResultsHeader).toBeVisible()
    fieldId = ''
})