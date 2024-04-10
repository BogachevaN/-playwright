import { APIBaseHelper } from '@/helpers/api-helpers/api-base-helper'

export class APIUsersHelper extends APIBaseHelper {

    async getUserIdByInboxName(authorizationToken: string, inboxName: any) {
        const body = await this.getAnyItems(authorizationToken, 'users')
        let id: any
        for (const i in body.items) {
            if (body.items[i].email == inboxName) {
                id = body.items[i].id
            }
        }
        return id
    }

    async getCountryIdByUserInboxName(authorizationToken: string, inboxName: any) {
        const body = await this.getAnyItems(authorizationToken, 'users')
        let countryId: any
        for (const i in body.items) {
            if (body.items[i].email == inboxName) {
                countryId = body.items[i].countryId
            }
        }
        return countryId
    }
}
