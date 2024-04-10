import { DataProviderInterface, StrategySaltInterface } from '@tests/data/types'
import { faker } from '@faker-js/faker'

export type Contact = Partial<{
    firstName: string
    lastName: string
    organization: string
    domain: string
    email: string
    phone: string
    socialMedia: string
    country: string
    assignee: string
    status: string
    timezone: string
}>

export class ContactDataProvider implements DataProviderInterface<Contact> {
    protected saltStrategy: StrategySaltInterface
    protected record: Contact = {}
    constructor(saltStrategy: StrategySaltInterface) {
        this.saltStrategy = saltStrategy
    }

    init(): Contact {
        this.record = {}
        this.setField('firstName')
        this.setField('lastName')
        this.setField('organization')
        this.setField('domain')
        this.setField('email')
        this.setField('phone')
        this.setField('socialMedia')
        this.setField('country')
        this.setField('assignee')
        this.setField('status')
        this.setField('timezone')
        return this.record
    }

    export() {
        return this.record
    }

    public setField(name: keyof Contact, value?: string): void {
        if (value !== undefined) {
            this.record[name] = value
            return
        }
        switch (name) {
            case 'firstName': {
                this.record[name] = faker.name.firstName() + this.getSalt()
                break
            }
            case 'lastName': {
                this.record[name] = faker.name.lastName() + this.getSalt()
                break
            }
            case 'organization': {
                this.record[name] =
                    faker.company.bsNoun().replace(/\s/g, '') + this.getSalt()
                break
            }
            case 'domain': {
                this.record[name] = this.getField('organization') + '.biz'
                break
            }
            case 'email': {
                this.record[name] = (
                    this.getField('lastName') +
                    '@' +
                    this.getField('domain')
                ).toLowerCase()
                break
            }
            case 'phone': {
                this.record[name] = faker.phone.number('+1 758 520 ####')
                break
            }
            case 'socialMedia': {
                this.record[name] = 'facebook.com'
                break
            }
            case 'country': {
                this.record[name] = 'Kazakhstan'
                break
            }
            case 'assignee': {
                this.record[name] = 'Unassigned'
                break
            }
            case 'status': {
                this.record[name] = 'Lead'
                break
            }
            case 'timezone': {
                this.record[name] = 'Pacific/Midway'
                break
              }
            default:
                throw new Error(`unknown name "${name}" for this domain`)
        }
    }

    getField(name: keyof Contact): string {
        return this.record[name] + ''
    }

    clear() {
        this.record = {}
    }

    protected getSalt() {
        return this.saltStrategy.execute()
    }
}
