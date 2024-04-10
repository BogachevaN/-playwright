import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '@/pages/base-page'
import { envVars } from '@/helpers/environment-variables-helper'

export class OrganizationsPage extends BasePage {
  readonly baseUrl: string
  readonly redirectUrl: string
  readonly organizationsHeader: Locator
  readonly newOrganizationBtn: Locator
  readonly organizationCreatedMsg: Locator
  readonly noSearchResultsHeader: Locator
  readonly organizationsTable: Locator
  readonly organizationDeletedMsg: Locator
  readonly organizationUpdatedMsg: Locator
  readonly defaultOrganization: Locator

  constructor(page: Page) {
    super(page)
    this.baseUrl = `${envVars.baseUrl}/contacts/organizations`
    this.redirectUrl = `${envVars.baseUrl}/contacts/organizations?UI.organizationsWrapper`
    this.organizationsHeader = page.locator('h1:text-is("Organizations")')
    this.newOrganizationBtn = page.getByRole('button', { name: 'New organization' })
    this.organizationCreatedMsg = page.getByText('The Organization has been successfully created')
    this.noSearchResultsHeader = page.getByRole('heading', { name: 'There are no matching results' })
    this.organizationsTable = page.getByTestId('mainApp_table-organizations')
    this.organizationDeletedMsg = page.getByText('The Organization has been successfully deleted')
    this.organizationUpdatedMsg = page.getByText('The Organization has been successfully updated')
    this.defaultOrganization = page.locator('//div[@name="Textmagic"]')
  }

  async searchOrganization(orgName: string) {
    await this.searchInTable('organizations', orgName)
  }

  async openOrganizationDetails(value: string) {
    await this.searchOrganization(value)
    await expect(this.organizationsTable).toBeVisible()
    await this.page.locator("//div[@name='" + value + "']").hover()
    await this.page.locator("//div[@name='" + value + "']").click()
  }
}
