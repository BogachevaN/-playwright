import { DataProviderInterface, StrategySaltInterface } from '@tests/data/types'
import { faker } from '@faker-js/faker'
import { envVars } from '@/helpers/environment-variables-helper'

export type User = Partial<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    country: string;
    inviteUsers: Array<string>;
    workspaceName: string;
    workspaceUrl: string;
    role: string;
    teams: Array<string>;
    jobTitle: string;
    phone: string;
}>

export class  UserDataProvider implements DataProviderInterface<User> {
    protected saltStrategy: StrategySaltInterface
    protected record: User = {}
    constructor(saltStrategy: StrategySaltInterface) {
    this.saltStrategy = saltStrategy
}

    public init(): User {
        this.record = {}
        this.setField('firstName')
        this.setField('lastName')
        this.setField('email')
        this.setField('password')
        this.setField('country')
        this.setField('inviteUsers')
        this.setField('role')
        this.setField('jobTitle')
        this.setField('phone')
        return this.record
    }

    public export() {
        return this.record
    }

    public setField(name: keyof User, value?: string): void {
        if (value !== undefined) {
            if (name != 'inviteUsers' && name != 'teams') {
                this.record[name] = value
            } else {
                this.record[name] = [value]
            }
            return
        }
        switch (name) {
            case 'firstName': {
                this.record[name] = faker.name.firstName() + this.getSalt()
                break
            }
            case 'lastName': {
                this.record[name] = faker.name.lastName()
                break
            }
            case 'email': {
                this.record[name] = faker.internet.email(this.getField('firstName'), this.getField('lastName') + Math.round(Math.random() * 100), envVars.mailosaurServerDomain)
                break
            }
            case 'password': {
                this.record[name] = faker.internet.password(27, false, /[A-Za-z0-9!@#$%^&_*]+/, 'qQ!1')
                break
            }
            case 'country': {
                this.record[name] = 'Cyprus'
                break
            }
            case 'inviteUsers': {
                this.record[name] = [
                faker.internet.email(faker.name.firstName(), faker.name.lastName() + Math.round(Math.random() * 100),
                envVars.mailosaurServerDomain),
                faker.internet.email(faker.name.firstName(), faker.name.lastName() + Math.round(Math.random() * 100),
                envVars.mailosaurServerDomain),
            ]
                break
            }
            case 'role': {
                this.record[name] = 'Admin'
                break
            }
            case 'jobTitle': {
                this.record[name] = faker.company.bsNoun().replace(/\s/g, '') + this.getSalt()
                break
            }
            case 'phone': {
                this.record[name] = faker.phone.number('+1 758 520 ####')
                break
            }
            default: throw new Error(`unknown name "${name}" for this domain`)
        }
    }

    public getField(name: keyof User): string {
        return this.record[name] + ''
    }

    public clear() {
        this.record = {}
    }

    protected getSalt() {
        return this.saltStrategy.execute()
    }
}
