import { APIBaseHelper } from '@/helpers/api-helpers/api-base-helper'
import { expect, request } from '@playwright/test'
import { CustomField } from '@tests/data/CustomFieldDataProvider'
import { envVars } from '../environment-variables-helper'

export class APICustomFieldsHelper extends APIBaseHelper {

    async createNewCustomField(authorizationToken: string, testData: CustomField): Promise<string> {
        const requestContext = await request.newContext()
        let response
        if (testData['option'] != undefined) {
        response = (await requestContext.post(envVars.baseApiUrl + '/api/custom-fields', {
            data: {
                entityType: testData['entityType'],
                name: testData['name'],
                type: testData['type'],
                description: testData['description'],
                options: [{ value: testData['option']}],
            },
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))} else {
            response = (await requestContext.post(envVars.baseApiUrl + '/api/custom-fields', {
                data: {
                    entityType: testData['entityType'],
                    name: testData['name'],
                    type: testData['type'],
                    description: testData['description'],
                },
                headers: {
                    authorization: 'Bearer ' + authorizationToken,
                },
        }))}
        expect(response.status()).toEqual(201)
        expect(response.statusText()).toEqual('Created')
        return JSON.parse(await (response).text())['id']
    }

    async deleteCustomField(authorizationToken: string, id: string) { 
        const requestContext = await request.newContext()
        const response = await requestContext.delete(envVars.baseApiUrl + '/api/custom-fields/' + id,
            {
                headers: {
                    authorization: 'Bearer ' + authorizationToken,
                },
            },
        )
        expect(response.status()).toEqual(204)
        expect(response.statusText()).toEqual('No Content')
    }

    async deleteAllCustomFields(authorizationToken: string, entityType: string) {
        const body = await this.getCustomFields(authorizationToken, entityType)
        if (body != undefined) {
            for (const i in body.items) {
                const id = body.items[i].id
                await this.deleteCustomField(authorizationToken, id)
            }
        }
    }

    async getCustomFields(authorizationToken: string, entityType: string) {
        const requestContext = await request.newContext()
        const response = (await requestContext.get(envVars.baseApiUrl + `/api/custom-fields?filter%5B0%5D%5BentityType%5D%5Beq%5D=${entityType}&perPage=100`, {
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(200)
        expect(response.statusText()).toEqual('OK')
        return JSON.parse(await response.text())
    }
    
    async getIdByName(authorizationToken: string, fieldName: string, entityType: string) {
        const body = await this.getCustomFields(authorizationToken, entityType)
        let id: any
        for (const i in body.items) {
            if (body.items[i].name == fieldName) {
                id = body.items[i].id
            }
        }
        return id
    }
}
