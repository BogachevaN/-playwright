import { expect, request } from '@playwright/test'
import { envVars } from '../environment-variables-helper'

export class APIBaseHelper {

    async getAuthorizationToken(email: string, password: string): Promise<string> {
        const requestContext = await request.newContext()
        const response = (await requestContext.post(envVars.baseApiUrl + '/api/login', {
            data: {
                email,
                password,
            },
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }))
        expect(response.status()).toEqual(200)
        expect(response.statusText()).toEqual('OK')
        return JSON.parse(await (response).text())['token']
    }

    async getAnyItems(authorizationToken: string, items: string) {
        const requestContext = await request.newContext()
        const response = (await requestContext.get(envVars.baseApiUrl + `/api/${items}`, {
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(200)
        expect(response.statusText()).toEqual('OK')
        return JSON.parse(await response.text())
    }

    async getFilteredViewIdByName(authorizationToken: string, viewName: any) {
        const body = await this.getAnyItems(authorizationToken, 'filtered-views')
        let id: any
        for (const i in body.items) {
            if (body.items[i].name == viewName) {
                id = body.items[i].id
            }
        }
        return id
    }
}
