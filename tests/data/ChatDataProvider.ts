import { DataProviderInterface, StrategySaltInterface } from '@tests/data/types'
import { faker } from '@faker-js/faker'
import { envVars } from '@/helpers/environment-variables-helper'

export type Chat = Partial<{
    email: string
    message: string
    name: string
    timezoneId: any
    widgetId: string
}>

export class ChatDataProvider implements DataProviderInterface<Chat> {
    protected saltStrategy: StrategySaltInterface
    protected record: Chat = {}
    constructor(saltStrategy: StrategySaltInterface) {
        this.saltStrategy = saltStrategy
    }

    init(): Chat {
        this.record = {}
        this.setField('name')
        this.setField('message')
        this.setField('email')
        this.setField('timezoneId')
        return this.record
    }
    
    export() {
        return this.record
    }

    public setField(name: keyof Chat, value?: string): void {
        if (value !== undefined) {
            this.record[name] = value
            return
        }
        switch (name) {
            case 'name': {
                this.record[name] =  faker.name.firstName() + this.getSalt() + ' ' + faker.name.lastName() + this.getSalt()
                break
            }
            case 'message': {
                this.record[name] = faker.random.alpha(20) 
                break
            }
            case 'email': {
                this.record[name] = faker.internet.email(this.getField('name'), this.getSalt(), envVars.mailosaurServerDomain)
                break
            }
            case 'timezoneId': {
                this.record[name] = 134
                break
            }
            default:
                throw new Error(`unknown name "${name}" for this domain`)
        }
    }

    getField(name: keyof Chat): string {
        return this.record[name] + ''
    }

    clear() {
        this.record = {}
    }

    protected getSalt() {
        return this.saltStrategy.execute()
    }
}