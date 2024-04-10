import { expect, request } from '@playwright/test'
import { APIBaseHelper } from '@/helpers/api-helpers/api-base-helper'
import { ContactStatusId } from '@/helpers/api-helpers/contact-status-id'
import { envVars } from '@/helpers/environment-variables-helper'
import { Contact } from '@tests/data/ContactDataProvider'

export class APIContactsHelper extends APIBaseHelper {
    async createNewContact(authorizationToken: string, testData: Contact, contactStatusId: ContactStatusId): Promise<string> {
        const requestContext = await request.newContext()
        const response = await requestContext.post(envVars.baseApiUrl + '/api/contacts',
            {
                data: {
                    firstName: testData['firstName'],
                    lastName: testData['lastName'],
                    emails: [
                        {
                            email: testData['email'],
                            type: 1,
                            isPrimary: true,
                        },
                    ],
                    statusId: contactStatusId,
                },
                headers: {
                    authorization: 'Bearer ' + authorizationToken,
                },
            },
        )
        expect(response.status()).toEqual(201)
        expect(response.statusText()).toEqual('Created')
        return JSON.parse(await response.text())['id']
    }

    async deleteContact(authorizationToken: string, id: string) { 
        const requestContext = await request.newContext()
        const response = await requestContext.delete(envVars.baseApiUrl + '/api/contacts/' + id,
            {
                headers: {
                    authorization: 'Bearer ' + authorizationToken,
                },
            },
        )
        expect(response.status()).toEqual(204)
        expect(response.statusText()).toEqual('No Content')
    }

    async getContactIdByFullName(authorizationToken: string, fullName: any) {
        const body = await this.getAnyItems(authorizationToken, 'contacts')
        let id: any
        for (const i in body.items) {
            if (body.items[i].fullName == fullName) {
                id = body.items[i].id
            }
        }
        return id
    }

    async deleteContactsFromMailosaur(authorizationToken: string) {
        const body = await this.getAnyItems(authorizationToken, 'contacts')
        for (const i in body.items) {
            const currentEmail = body.items[i].emails[0].email
            if (await currentEmail.includes('rbi4rpic.mailosaur.net')) {
                await this.deleteContact(authorizationToken, body.items[i].id)
            }
        }
    }

    async createNewList(authorizationToken: string, listName: string): Promise<string> {
        const requestContext = await request.newContext()
        const response = (await requestContext.post(envVars.baseApiUrl + '/api/lists/contacts', {
            data: {
                name: listName,
                tagIds: [],
            },
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(201)
        expect(response.statusText()).toEqual('Created')
        return JSON.parse(await (response).text())['id']
    }

    async createNewSegment(authorizationToken: string, segmentName: string): Promise<string> {
        const requestContext = await request.newContext()
        const response = (await requestContext.post(envVars.baseApiUrl + '/api/segments', {
            data: {
                name: segmentName,
                tagIds: [],
                conditions: "{}",
            },
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(201)
        expect(response.statusText()).toEqual('Created')
        return JSON.parse(await (response).text())['id']
    }

    async deleteList(authorizationToken: string, id: string) { 
        const requestContext = await request.newContext()
        const response = await requestContext.delete(envVars.baseApiUrl + '/api/lists/contacts/' + id,
            {
                headers: {
                    authorization: 'Bearer ' + authorizationToken,
                },
            },
        )
        expect(response.status()).toEqual(204)
        expect(response.statusText()).toEqual('No Content')
    }

    async deleteSegment(authorizationToken: string, id: string) { 
        const requestContext = await request.newContext()
        const response = await requestContext.delete(envVars.baseApiUrl + '/api/segments/' + id,
            {
                headers: {
                    authorization: 'Bearer ' + authorizationToken,
                },
            },
        )
        expect(response.status()).toEqual(204)
        expect(response.statusText()).toEqual('No Content')
    }
}
