import { DataProviderInterface, StrategySaltInterface } from '@tests/data/types'
import { faker } from '@faker-js/faker'

export type Ticket = Partial<{
    subject: string
    requester: string
    inbox: string
    assignee: string
    priority: string
}>

export class TicketDataProvider implements DataProviderInterface<Ticket> {
    protected saltStrategy: StrategySaltInterface
    protected record: Ticket = {}
    constructor(saltStrategy: StrategySaltInterface) {
        this.saltStrategy = saltStrategy
    }

    init(): Ticket {
        this.record = {}
        this.setField('subject')
        this.setField('requester')
        this.setField('inbox')
        this.setField('assignee')
        this.setField('priority')
        return this.record
    }
    
    export() {
        return this.record
    }

    public setField(name: keyof Ticket, value?: string): void {
        if (value !== undefined) {
            this.record[name] = value
            return
        }
        switch (name) {
            case 'subject': {
                this.record[name] = 'Autotest ticket ' + faker.name.jobArea() + this.getSalt()
                break
            }
            case 'requester': {
                this.record[name] = 'Ivan Bubnov'
                break
            }
            case 'inbox': {
                this.record[name] = 'support@test-workspace-257.touchpointtesting.com'
                break
            }
            case 'assignee': {
                this.record[name] = 'firstName257 lastName257'
                break
            }
            case 'priority': {
                this.record[name] = 'Normal'
                break
            }
            default:
                throw new Error(`unknown name "${name}" for this domain`)
        }
    }

    getField(name: keyof Ticket): string {
        return this.record[name] + ''
    }

    clear() {
        this.record = {}
    }

    protected getSalt() {
        return this.saltStrategy.execute()
    }
}