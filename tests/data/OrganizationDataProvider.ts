import { DataProviderInterface, StrategySaltInterface } from '@tests/data/types'
import { faker } from '@faker-js/faker'
import { envVars } from '@/helpers/environment-variables-helper'

export type Organization = Partial<{
  name: string;
  domain: string;
  country: string;
  assignee: string;
  email: string;
  phone: string;
  timezone: string;
}>

export class OrganizationDataProvider implements DataProviderInterface<Organization> {
  protected saltStrategy: StrategySaltInterface
  protected record: Organization = {}
  constructor(saltStrategy: StrategySaltInterface) {
    this.saltStrategy = saltStrategy
  }

  public init(): Organization {
    this.record = {}
    this.setField('name')
    this.setField('domain')
    this.setField('country')
    this.setField('assignee')
    this.setField('email')
    this.setField('phone')
    this.setField('timezone')
    return this.record
  }

  public export() {
    return this.record
  }

  public setField(name: keyof Organization, value?: string): void {
    if (value !== undefined) {
      this.record[name] = value
      return
    }
    switch (name) {
      case 'name': {
        this.record[name] = faker.name.jobTitle() + this.getSalt()
        break
      }
      case 'domain': {
        this.record[name] = (this.getField('name') ?? '').split(/\s+/).join('') + '.biz'
        break
      }
      case 'country': {
        this.record[name] = 'Estonia'
        break
      }
      case 'assignee': {
        this.record[name] = 'Unassigned'
        break
      }
      case 'email': {
        this.record[name] = faker.internet.email(this.getField('name'), this.getField('domain'), envVars.mailosaurServerDomain)
        break
      }
      case 'phone': {
        this.record[name] = faker.phone.number('+372 5### ####')
        break
      }
      case 'timezone': {
        this.record[name] = 'Europe/Tallinn'
        break
      }
      default: throw new Error(`unknown name "${name}" for this domain`)
    }

  }

  public getField(name: keyof Organization): string {
    return this.record[name] + ''
  }

  public clear() {
    this.record = {}
  }

  protected getSalt() {
    return this.saltStrategy.execute()
  }
}
