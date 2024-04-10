import { APIBaseHelper } from '@/helpers/api-helpers/api-base-helper'
import { expect, request } from '@playwright/test'
import { envVars } from '@/helpers/environment-variables-helper'

export class APIContactsSettingsHelper extends APIBaseHelper {

    async getStatusIdByStatusName(authorizationToken: string, statusName: string) {
        const body = await this.getAnyItems(authorizationToken, 'contacts/status')
        let id: any
        for (const i in body.items) {
            if (body.items[i].name == statusName) {
                id = body.items[i].id
            }
        }
        return id
    }

    async deleteContactStatus(authorizationToken: string, id: string) { 
        const requestContext = await request.newContext()
        const response = await requestContext.delete(envVars.baseApiUrl + '/api/contacts/status/' + id,
            {
                headers: {
                    authorization: 'Bearer ' + authorizationToken,
                },
            },
        )
        expect(response.status()).toEqual(204)
        expect(response.statusText()).toEqual('No Content')
    }

    async createContactStatus(authorizationToken: string, statusName: string) {
        const requestContext = await request.newContext()
        const response = (await requestContext.post(envVars.baseApiUrl + '/api/contacts/status', {
            data: {
                color: '#75bdbf',
                name: statusName,
                style: 'filled',
            },
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(201)
        expect(response.statusText()).toEqual('Created')
        return JSON.parse(await (response).text())['id']
    }
}
