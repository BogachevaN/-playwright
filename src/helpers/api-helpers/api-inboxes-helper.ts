import { APIBaseHelper } from '@/helpers/api-helpers/api-base-helper'

export class APIInboxesHelper extends APIBaseHelper {

    async getInboxIdByName(authorizationToken: string, inboxName: any) {
        const body = await this.getAnyItems(authorizationToken, 'inboxes')
        let id: any
        for (const i in body.items) {
            if (body.items[i].email == inboxName) {
                id = body.items[i].id
            }
        }
        return id
    }

    async getSupportEmail(authorizationToken: string) {
        const body = await this.getAnyItems(authorizationToken, 'inboxes')
        let email: any
        for (const i in body.items) {
            if (body.items[i].name == 'Support') {
                email = body.items[i].email
            }
        }
        return email
    }
}
