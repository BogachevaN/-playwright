import { expect, request } from '@playwright/test';
import { APIBaseHelper } from '@/helpers/api-helpers/api-base-helper'
import { envVars } from '@/helpers/environment-variables-helper'
import { Organization } from '@tests/data/OrganizationDataProvider'

export class APIOrganizationsHelper extends APIBaseHelper {

    async createNewOrganization(authorizationToken: string, testData: Organization): Promise<string> {
        const requestContext = await request.newContext()
        const response = (await requestContext.post(envVars.baseApiUrl + '/api/organizations', {
            data: {
                countryId: 'EE',
                domains: [ testData['domain']],
                email: testData['email'],
                name: testData['name'],
                phone: testData['phone'],
                timezoneId: '146',
            },
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(201)
        expect(response.statusText()).toEqual('Created')
        return JSON.parse(await (response).text())['id']
    }

    async deleteOrganization(authorizationToken: string, id: string) {
        const requestContext = await request.newContext()
        const response = (await requestContext.delete(envVars.baseApiUrl + '/api/organizations/' + id, {
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(204)
        expect(response.statusText()).toEqual('No Content')
    }

    async getOrganizationIdByName(authorizationToken: string, name: any) {
        const body = await this.getAnyItems(authorizationToken, 'organizations')
        let id: any
        for (const i in body.items) {
            if (body.items[i].name.toLowerCase() == name.toLowerCase()) {
                id = body.items[i].id
            }
        }
        return id
    }
}
