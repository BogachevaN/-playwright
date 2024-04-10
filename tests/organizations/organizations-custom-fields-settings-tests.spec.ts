import { APITicketsHelper } from '@/helpers/api-helpers/api-tickets-helper'
import { expect, test } from '@/fixtures/start'
import { DashboardPage } from '@/pages/app/dashboard-page'
import { NewCustomFieldModal } from '@/pages/admin/common-forms/custom-fields/new-custom-field-modal'
import { dataProviderManager } from '@tests/data/DataManager'
import { DataProviderInterface } from '@tests/data/types'
import { CustomField } from '@tests/data/CustomFieldDataProvider'
import { APICustomFieldsHelper } from '@/helpers/api-helpers/api-custom-fields-helper'
import { OrganizationsCustomFieldsPage } from '@/pages/admin/settings/contacts/organizations-custom-fields-page'

let dashboardPage: DashboardPage
let email: string
let password: string
let apiHelper: APITicketsHelper
let authorizationToken: string
let organizationsCustomFieldsPage: OrganizationsCustomFieldsPage
let newCustomFieldModal: NewCustomFieldModal
let customFieldDataProvider: DataProviderInterface<CustomField>
let apiCustomFieldsHelper: APICustomFieldsHelper
let fieldId: string

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    dashboardPage = new DashboardPage(currentPage.page)
    organizationsCustomFieldsPage = new OrganizationsCustomFieldsPage(currentPage.page)
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
    await organizationsCustomFieldsPage.open(organizationsCustomFieldsPage.url)
    await organizationsCustomFieldsPage.loadPage()
})

test.afterEach(async () => {
    if (fieldId != '') {
        await apiCustomFieldsHelper.deleteCustomField(authorizationToken, fieldId)
    }
})

test('Create new custom text field in organization @all @smoke @organizationsSettings @createCustomTextFieldInOrganization', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    await organizationsCustomFieldsPage.newCustomFieldBtn.click()
    await newCustomFieldModal.loadModal('New custom field')
    await newCustomFieldModal.fieldNameInput.fill(fieldName)
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(fieldName)
    await expect.soft(newCustomFieldModal.page.getByPlaceholder(`Enter ${fieldName}`)).toBeVisible()
    await newCustomFieldModal.confirmModal()
    await expect.soft(organizationsCustomFieldsPage.fieldCreatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, fieldName, 'organization')
    await organizationsCustomFieldsPage.searchCustomField(fieldName)
    const row = await organizationsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await organizationsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toContain('text_fields')
})

test('Create new custom number field in organization @all @smoke @organizationsSettings @createCustomNumberFieldInOrganization', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    await organizationsCustomFieldsPage.newCustomFieldBtn.click()
    await newCustomFieldModal.loadModal('New custom field')
    await newCustomFieldModal.fieldNameInput.fill(fieldName)
    await newCustomFieldModal.fieldTypeList.click()
    await newCustomFieldModal.selectValueInDropdown('Number')
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(fieldName)
    await expect.soft(newCustomFieldModal.page.getByPlaceholder(`Enter ${fieldName}`)).toBeVisible()
    await newCustomFieldModal.confirmModal()
    await expect.soft(organizationsCustomFieldsPage.fieldCreatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, fieldName, 'organization')
    await organizationsCustomFieldsPage.searchCustomField(fieldName)
    const row = await organizationsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await organizationsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toEqual('Number')
})

test('Create new custom date field in organization @all @smoke @organizationsSettings @createCustomDateFieldInOrganization', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    await organizationsCustomFieldsPage.newCustomFieldBtn.click()
    await newCustomFieldModal.loadModal('New custom field')
    await newCustomFieldModal.fieldNameInput.fill(fieldName)
    await newCustomFieldModal.fieldTypeList.click()
    await newCustomFieldModal.selectValueInDropdown('Date')
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(fieldName)
    await expect.soft(newCustomFieldModal.page.getByPlaceholder(`Select date`)).toBeVisible()
    await newCustomFieldModal.confirmModal()
    await expect.soft(organizationsCustomFieldsPage.fieldCreatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, fieldName, 'organization')
    await organizationsCustomFieldsPage.searchCustomField(fieldName)
    const row = await organizationsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await organizationsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toContain('event')
})

test('Create new custom checkbox field in organization @all @smoke @organizationsSettings @createCustomCheckboxFieldInOrganization', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    await organizationsCustomFieldsPage.newCustomFieldBtn.click()
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
    await expect.soft(organizationsCustomFieldsPage.fieldCreatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, fieldName, 'organization')
    await organizationsCustomFieldsPage.searchCustomField(fieldName)
    const row = await organizationsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await organizationsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toEqual('Checkbox')
})

test('Create new custom drop-down list field in organization @all @smoke @organizationsSettings @createCustomDropDownListFieldInOrganization', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    await organizationsCustomFieldsPage.newCustomFieldBtn.click()
    await newCustomFieldModal.loadModal('New custom field')
    await newCustomFieldModal.fieldNameInput.fill(fieldName)
    await newCustomFieldModal.fieldTypeList.click()
    await newCustomFieldModal.selectValueInDropdown('Drop-down list')
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(fieldName)
    await newCustomFieldModal.addDropdownValues(2, 'Test value')
    await newCustomFieldModal.checkDropdownValues(2, 'Test value')
    await newCustomFieldModal.confirmModal()
    await expect.soft(organizationsCustomFieldsPage.fieldCreatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, fieldName, 'organization')
    await organizationsCustomFieldsPage.searchCustomField(fieldName)
    const row = await organizationsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await organizationsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toEqual('Drop-down list')
})

test('Update custom text field in organization @all @smoke @organizationsSettings @updateCustomTextFieldInOrganization', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    customFieldDataProvider.setField('entityType', 'organization')
    await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export()) 
    await organizationsCustomFieldsPage.searchCustomField(fieldName)
    let row = await organizationsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await organizationsCustomFieldsPage.fieldsTable.openMenuInRow(row)
    await organizationsCustomFieldsPage.fieldsTable.selectOptionInDropdownMenu('Edit')
    await newCustomFieldModal.loadModal('Edit custom field')
    const newFieldName = fieldName + '_edit'
    await newCustomFieldModal.fieldNameInput.fill(newFieldName)
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(newFieldName)
    await expect.soft(newCustomFieldModal.page.getByPlaceholder(`Enter ${newFieldName}`)).toBeVisible()
    await newCustomFieldModal.confirmModal()
    await expect.soft(organizationsCustomFieldsPage.fieldUpdatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, newFieldName, 'organization')
    await organizationsCustomFieldsPage.searchCustomField(newFieldName)
    row = await organizationsCustomFieldsPage.fieldsTable.getRowByText(newFieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await organizationsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toContain('text_fields')
})

test('Update custom date field in organization @all @smoke @organizationsSettings @updateCustomDateFieldInOrganization', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    customFieldDataProvider.setField('type', 'datetime')
    customFieldDataProvider.setField('entityType', 'organization')
    await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export()) 
    await organizationsCustomFieldsPage.searchCustomField(fieldName)
    let row = await organizationsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await organizationsCustomFieldsPage.fieldsTable.openMenuInRow(row)
    await organizationsCustomFieldsPage.fieldsTable.selectOptionInDropdownMenu('Edit')
    await newCustomFieldModal.loadModal('Edit custom field')
    const newFieldName = fieldName + '_edit'
    await newCustomFieldModal.fieldNameInput.fill(newFieldName)
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(newFieldName)
    await expect.soft(newCustomFieldModal.page.getByPlaceholder(`Select date`)).toBeVisible()
    await newCustomFieldModal.confirmModal()
    await expect.soft(organizationsCustomFieldsPage.fieldUpdatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, newFieldName, 'organization')
    await organizationsCustomFieldsPage.searchCustomField(newFieldName)
    row = await organizationsCustomFieldsPage.fieldsTable.getRowByText(newFieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await organizationsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toContain('event')
})

test('Update custom checkbox field in organization @all @smoke @organizationsSettings @updateCustomCheckboxFieldInOrganization', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    customFieldDataProvider.setField('type', 'checkbox')
    customFieldDataProvider.setField('description', 'Test description')
    customFieldDataProvider.setField('entityType', 'organization')
    await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export()) 
    await organizationsCustomFieldsPage.searchCustomField(fieldName)
    let row = await organizationsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await organizationsCustomFieldsPage.fieldsTable.openMenuInRow(row)
    await organizationsCustomFieldsPage.fieldsTable.selectOptionInDropdownMenu('Edit')
    await newCustomFieldModal.loadModal('Edit custom field')
    const newFieldName = fieldName + '_edit'
    const newDescription = 'Test description_edit'
    await newCustomFieldModal.fieldNameInput.fill(newFieldName)
    await newCustomFieldModal.checkboxDescriptionInput.fill(newDescription)
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(newFieldName)
    expect.soft(await newCustomFieldModal.page.getByTestId('adminApp_modalWrapper-customField_form-customFieldForm_field').locator('div > div.q-checkbox__label').innerHTML())
        .toEqual(newDescription)
    await newCustomFieldModal.confirmModal()
    await expect.soft(organizationsCustomFieldsPage.fieldUpdatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, newFieldName, 'organization')
    await organizationsCustomFieldsPage.searchCustomField(newFieldName)
    row = await organizationsCustomFieldsPage.fieldsTable.getRowByText(newFieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await organizationsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toEqual('Checkbox')
})

test('Update custom number field in organization @all @smoke @organizationsSettings @updateCustomNumberFieldInOrganization', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    customFieldDataProvider.setField('type', 'number')
    customFieldDataProvider.setField('entityType', 'organization')
    await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export()) 
    await organizationsCustomFieldsPage.searchCustomField(fieldName)
    let row = await organizationsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await organizationsCustomFieldsPage.fieldsTable.openMenuInRow(row)
    await organizationsCustomFieldsPage.fieldsTable.selectOptionInDropdownMenu('Edit')
    await newCustomFieldModal.loadModal('Edit custom field')
    const newFieldName = fieldName + '_edit'
    await newCustomFieldModal.fieldNameInput.fill(newFieldName)
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(newFieldName)
    await expect.soft(newCustomFieldModal.page.getByPlaceholder(`Enter ${newFieldName}`)).toBeVisible()
    await newCustomFieldModal.confirmModal()
    await expect.soft(organizationsCustomFieldsPage.fieldUpdatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, newFieldName, 'organization')
    await organizationsCustomFieldsPage.searchCustomField(newFieldName)
    row = await organizationsCustomFieldsPage.fieldsTable.getRowByText(newFieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await organizationsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toEqual('Number')
})

test('Update custom drop-down list field in organization @all @smoke @organizationsSettings @updateCustomDropDownListFieldInOrganization', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    customFieldDataProvider.setField('type', 'dropdown')
    customFieldDataProvider.setField('option', 'Test value')
    customFieldDataProvider.setField('entityType', 'organization')
    await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export()) 
    await organizationsCustomFieldsPage.searchCustomField(fieldName)
    let row = await organizationsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await organizationsCustomFieldsPage.fieldsTable.openMenuInRow(row)
    await organizationsCustomFieldsPage.fieldsTable.selectOptionInDropdownMenu('Edit')
    await newCustomFieldModal.loadModal('Edit custom field')
    const newFieldName = fieldName + '_edit'
    await newCustomFieldModal.fieldNameInput.fill(newFieldName)
    expect.soft(await newCustomFieldModal.previewTitle.innerHTML()).toEqual(newFieldName)
    await newCustomFieldModal.addDropdownValues(2, 'Test value_edit')
    await newCustomFieldModal.checkDropdownValues(2, 'Test value_edit')
    await newCustomFieldModal.confirmModal()
    await expect.soft(organizationsCustomFieldsPage.fieldUpdatedMsg).toBeVisible()
    fieldId = await apiCustomFieldsHelper.getIdByName(authorizationToken, newFieldName, 'organization')
    await organizationsCustomFieldsPage.searchCustomField(newFieldName)
    row = await organizationsCustomFieldsPage.fieldsTable.getRowByText(newFieldName)
    await expect.soft(row).toBeVisible()
    const fieldType = await organizationsCustomFieldsPage.getFieldTypeFromRow(row)
    expect(fieldType).toEqual('Drop-down list')
})

test('Delete custom field in organization @all @smoke @organizationsSettings @deleteCustomFieldInOrganization', async () => {
    const fieldName = customFieldDataProvider.getField('name')
    customFieldDataProvider.setField('entityType', 'organization')
    fieldId = await apiCustomFieldsHelper.createNewCustomField(authorizationToken, customFieldDataProvider.export()) 
    await organizationsCustomFieldsPage.searchCustomField(fieldName)
    const row = await organizationsCustomFieldsPage.fieldsTable.getRowByText(fieldName)
    await organizationsCustomFieldsPage.fieldsTable.openMenuInRow(row)
    await organizationsCustomFieldsPage.fieldsTable.selectOptionInDropdownMenu('Delete')
    await newCustomFieldModal.loadModal('Delete custom field')
    await newCustomFieldModal.confirmModal()
    await expect(organizationsCustomFieldsPage.fieldDeletedMsg).toBeVisible()
    await organizationsCustomFieldsPage.searchCustomField(fieldName)
    await expect.soft(organizationsCustomFieldsPage.fieldsTable.noSearchResultsHeader).toBeVisible()
    fieldId = ''
})