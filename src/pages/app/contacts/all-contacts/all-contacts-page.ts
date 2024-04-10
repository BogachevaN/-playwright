import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base-page'
import { TableComponent } from '@/components/app/table-component'
import { envVars } from '@/helpers/environment-variables-helper'

export class AllContactsPage extends BasePage {
  readonly allContactsLink: Locator;
  readonly allContactsHeader: Locator;
  readonly newContactBtn: Locator;
  readonly importBtn: Locator;
  readonly downloadBtn: Locator;
  readonly contactsTable: TableComponent;
  readonly contactCreatedMsg: Locator;
  readonly contactDeletedMsg: Locator;
  readonly contactUpdatedMsg: Locator;
  readonly baseUrl: string;
  readonly redirectUrl: string;
  readonly defaultContact: Locator;

  constructor(page: Page) {
    super(page);
    this.allContactsHeader = page.locator('h1:text-is("All contacts")');
    this.newContactBtn = page.locator('span:text-is("New contact")');
    //TODO in PRO-3795
    this.importBtn = page.locator('');
    this.downloadBtn = page.locator('');
    this.contactsTable = new TableComponent(page);
    this.contactCreatedMsg = page.getByText('The contact has been successfully created');
    this.contactDeletedMsg = page.getByText('The contact has been successfully deleted');
    this.contactUpdatedMsg = page.getByText('The contact has been successfully updated');
    this.baseUrl = `${envVars.baseUrl}/contacts`
    this.redirectUrl = `${envVars.baseUrl}/contacts/all?UI.contactsAllWrapper=`
    this.defaultContact = page.getByText('TextMagic Support')
  }

  async openNewContact() {
    await this.newContactBtn.click();
  }

  async searchContact(value: string) {
    await this.contactsTable.searchField.fill(`${value}`);
    await this.page.keyboard.press('Enter');
  }

  async openContactDetails(value: string) {
    await this.page.reload()
    await this.searchContact(value);
    await this.contactsTable.loadTable();
    await this.contactsTable.table.locator('//div[contains(@name, "' + value + '")]').click();
  }
}
