import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page'

export class ContactDetailsPage extends BasePage {
  readonly baseUrl: string;
  readonly contactLinkBreadcrumbs: Locator;
  readonly contactPageTitle: Locator;
  readonly organizationLink: Locator;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly emailField: Locator;
  readonly emailInput: Locator;
  readonly phoneField: Locator;
  readonly assigneeField: Locator;
  readonly countryField: Locator;
  readonly countryInput: Locator;
  readonly statusField: Locator;
  readonly socialMediaField: Locator;
  readonly socialMediaInput: Locator;
  readonly sidebarFieldCancelBtn: Locator;
  readonly sidebarFieldSaveBtn: Locator;
  readonly socialMediaAddAnotherBtn: Locator;
  readonly socialMediaLink: Locator;
  readonly organizationField: Locator;
  readonly organizationInput: Locator;
  readonly tagsInput: Locator;
  readonly tagBadge: Locator;
  readonly followersField: Locator;
  readonly followersInput: Locator;  
  readonly timezoneField: Locator;
  readonly listsField: Locator;
  readonly listBadge: Locator;
  readonly moreBtn: Locator;
  readonly deleteBtn: Locator;
  readonly editBtn: Locator;
  readonly noOpenActivitiesText: Locator;
  readonly activeTab: Locator;
  readonly defaultContactTitle: Locator;
  readonly collapsedNoteForm: Locator;
  readonly noteForm: Locator;
  readonly addNoteBtn: Locator;
  readonly note: Locator;
  readonly noteText: Locator;

  constructor(page: Page) {
    super(page)
    this.contactLinkBreadcrumbs = page.locator('//*[contains(@class,"breadcrumbs")]//li[3]');
    this.contactPageTitle = page.locator('//div[contains(@class,"page-title")]/div');
    this.organizationLink = page.locator('[class="details-hero__list-item"]>a>span');
    this.firstNameField = page.locator('input[name*="firstName"]');
    this.lastNameField = page.locator('input[name*="lastName"]');
    this.emailField = page.getByTestId('form-contactDetails_formPartial_field-emails');
    this.emailInput = page.locator('input[name*="email"]');
    this.phoneField = page.locator('input[name*="phone"]');
    this.countryField = page.locator('.tp-country-title');
    this.countryInput = page.locator('//input[@type="country"]');
    this.assigneeField = page.locator('//*[contains(@data-testid, "field-assigneeId")]');
    this.statusField = page.locator('//*[@data-testid="form-contactDetails_formPartial_field-statusId"]//*[contains(@class,"q-chip__content")]');
    this.socialMediaField = page.getByTestId('form-contactDetails_formPartial_field-socialMediaChannels');
    this.socialMediaInput = page.locator('input[name*="socialMedia"]');
    this.sidebarFieldCancelBtn = page.locator('//*[contains(@class,"save-cancel-buttons")]//button[1]');
    this.sidebarFieldSaveBtn = page.locator('//*[contains(@class,"save-cancel-buttons")]//button[2]');
    this.socialMediaAddAnotherBtn = page.getByText('Add another');
    this.socialMediaLink = page.locator('//*[@class="tp-fields-container-social-media__value"]//a');
    this.organizationField = page.getByTestId('form-contactDetails_formPartial_field-organizationId');
    this.organizationInput = page.locator('//input[@type="organization"]');
    this.tagsInput = page.locator('//*[contains(@data-testid,"tagIds")]//input');
    this.tagBadge = page.locator('//*[contains(@class,"tag-badge")]');
    this.followersField = page.getByTestId('form-contactDetails_formPartial_form-contactFollowers_field-followers');
    this.followersInput = page.locator('//input[@type="followers"]');
    this.timezoneField = page.getByTestId('form-contactDetails_formPartial_field-timezoneId');
    this.listsField = page.getByTestId('form-contactDetails_formPartial_field-listOfContactsIds');
    this.listBadge = page.locator('//*[@data-testid="form-contactDetails_formPartial_field-listOfContactsIds"]//*[contains(@class,"badge")]');
    this.moreBtn = page.getByRole('button', {name:'More'});
    this.deleteBtn = page.getByRole('button', {name: 'Delete'});
    this.editBtn = page.getByRole('button').filter({ hasText: 'edit' });
    this.noOpenActivitiesText = page.getByText('There are no open activities');
    this.activeTab = page.locator('//*[contains(@class, "header-tabs__tab--active")]');
    this.defaultContactTitle = page.locator('//*[contains(@class, "details-hero__title")]//div[contains(text(), "TextMagic Support")]');
    this.collapsedNoteForm = page.getByText('Click to create an internal note');
    this.noteForm = page.locator('//*[contains(@class,"ProseMirror-focused")]');
    this.addNoteBtn = page.getByTestId('form-contactInternalNoteForm_form-contactInternalNoteForm-submit');
    this.note = page.locator('//*[contains(@class, "panel-card panel-card--yellow")]');
    this.noteText = page.locator('//*[contains(@class, "panel-card panel-card--yellow")]//*[contains(@class,"ProseMirror")]//p');
  }

  async loadContactDetailsPage(value: string) {
    await expect(this.page.locator(`div[class*=page-title]:has-text("${value}")`)).toBeVisible();
  }

  async getCurrentContactID(): Promise<string> {
    const id = await this.getCurrentPageURL();
    return id.substring(id.lastIndexOf('/contacts/') + 10, id.indexOf('/activities'));
  }

  async deleteContact() {
   this.moreBtn.click();
   this.deleteBtn.click();
  }
}
