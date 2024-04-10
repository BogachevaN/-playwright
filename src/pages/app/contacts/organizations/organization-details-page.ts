import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '@/pages/base-page'

export class OrganizationDetailsPage extends BasePage {
  readonly assignedToInput: Locator
  readonly domainsField: Locator
  readonly phoneNumberInput: Locator
  readonly emailInput: Locator
  readonly countryInput: Locator
  readonly localTimeInput: Locator
  readonly localTimeSelectedValue: Locator
  readonly moreBtn: Locator
  readonly deleteBtn: Locator
  readonly editBtn: Locator
  readonly noOpenActivitiesText: Locator
  readonly defaultOrgBreadcrumb: Locator
  readonly defaultOrgTitle: Locator

  constructor(page: Page) {
    super(page)
    this.assignedToInput = page.getByTestId('form-organizationDetails_formPartial_field-assigneeId').locator('.tp-ellipsis__in')
    this.domainsField = page.getByTestId('form-organizationDetails_formPartial_field-domains').locator('span')
    this.phoneNumberInput = page.getByTestId('form-organizationDetails_formPartial_field-phone').locator('input')
    this.emailInput = page.getByTestId('form-organizationDetails_formPartial_field-email').locator('input')
    this.countryInput = page.locator('.tp-country-title')
    this.localTimeInput = page.getByTestId('form-organizationDetails_formPartial_field-timezoneId').getByText('arrow_drop_down')
    this.localTimeSelectedValue = page.locator('div[aria-selected=true]>span')
    this.moreBtn = page.getByRole('button', { name: 'More' })
    this.deleteBtn = page.getByRole('button', { name: 'Delete' })
    this.editBtn = page.getByRole('button').filter({ hasText: /^create$/ })
    this.noOpenActivitiesText = page.getByText('There are no open activities');
    this.defaultOrgBreadcrumb = page.locator('//*[contains(@class, "breadcrumbs")]//span[contains(text(), "Textmagic")]');
    this.defaultOrgTitle = page.locator('//*[contains(@class, "details-hero__title")]//div[contains(text(), "Textmagic")]');
  }

  async loadOrgPage(value: string) {
    await expect(this.page.locator(`div[class*=page-title]:has-text("${value}")`)).toBeVisible()
  }

  async getCurrentOrganizationID(): Promise<string> {
    const id = await this.getCurrentPageURL()
    return id.substring(id.indexOf('/organizations/') + 15, id.indexOf('/activities'))
  }
}
