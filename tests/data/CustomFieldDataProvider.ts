import { DataProviderInterface, StrategySaltInterface } from '@tests/data/types'

export type CustomField = Partial<{
    entityType: string
    name: string
    type: string
    description: string
    option: string
}>

export class CustomFieldDataProvider implements DataProviderInterface<CustomField> {
    protected saltStrategy: StrategySaltInterface
    protected record: CustomField = {}
    constructor(saltStrategy: StrategySaltInterface) {
        this.saltStrategy = saltStrategy
    }

    init(): CustomField {
        this.record = {}
        this.setField('entityType')
        this.setField('name')
        this.setField('type')
        return this.record
    }
    
    export() {
        return this.record
    }

    public setField(name: keyof CustomField, value?: string): void {
        if (value !== undefined) {
            this.record[name] = value
            return
        }
        switch (name) {
            case 'entityType': {
                this.record[name] =  'ticket'
                break
            }
            case 'name': {
                this.record[name] = 'Test custom field' + this.getSalt()
                break
            }
            case 'type': {
                this.record[name] = 'text'
                break
            }
            default:
                throw new Error(`unknown name "${name}" for this domain`)
        }
    }

    getField(name: keyof CustomField): string {
        return this.record[name] + ''
    }

    clear() {
        this.record = {}
    }

    protected getSalt() {
        return this.saltStrategy.execute()
    }
}