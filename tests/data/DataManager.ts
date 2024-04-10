import { OrganizationDataProvider } from '@tests/data/OrganizationDataProvider'
import { DataSaltRandomStrategy } from '@tests/data/strategies/DataSaltRandomStrategy'
import { DataManagerInterface, DataProviderInterface, StrategySaltInterface } from '@tests/data/types'
import { ContactDataProvider } from '@tests/data/ContactDataProvider'
import { TicketDataProvider } from '@tests/data/TicketDataProvider'
import { UserDataProvider } from '@tests/data/UserDataProvider'
import { ChatDataProvider } from '@tests/data/ChatDataProvider'
import { CustomFieldDataProvider } from '@tests/data/CustomFieldDataProvider'

const providers = {
  organization: OrganizationDataProvider,
  contact: ContactDataProvider,
  ticket: TicketDataProvider,
  user: UserDataProvider,
  chat: ChatDataProvider,
  customField: CustomFieldDataProvider,
} as const
type DataProvidersType = keyof typeof providers

class DataProviderManager implements DataManagerInterface {
  protected vault: Partial<Record<DataProvidersType, DataProviderInterface<any>>> = {}
  public createProvider<T extends Record<string, any>=Record<string, any>>(domain: DataProvidersType, force = false, strategy: StrategySaltInterface=new DataSaltRandomStrategy()): DataProviderInterface<T> {
    if (!(domain in providers)) {
      throw new Error(`Domain ${domain} is not registered, please add it to providers map in @tests/data/DataManager.ts`)
    }
    this.vault[domain] = new providers[domain](strategy)
    this.vault[domain]!.init()
    return this.vault[domain]!
  }
}

export const dataProviderManager = new DataProviderManager()