import { expect } from '@/fixtures/start'
import { APIBaseHelper } from '@/helpers/api-helpers/api-base-helper'
import { APIInboxesHelper } from '@/helpers/api-helpers/api-inboxes-helper'
import { APIContactsHelper } from '@/helpers/api-helpers/api-contacts-helper'
import { APIUsersHelper } from '@/helpers/api-helpers/api-users-helper'
import { request } from '@playwright/test'
import { envVars } from '@/helpers/environment-variables-helper'
import { Ticket } from '@tests/data/TicketDataProvider'

export class APITicketsHelper extends APIBaseHelper {
    readonly apiInboxesHelper: APIInboxesHelper
    readonly apiContactsHelper: APIContactsHelper
    readonly apiUsersHelper: APIUsersHelper

    constructor() {
        super();
        this.apiInboxesHelper = new APIInboxesHelper()
        this.apiContactsHelper = new APIContactsHelper()
        this.apiUsersHelper = new APIUsersHelper()
    }

    async markTrashTicket(authorizationToken: string, id: string) {
        const requestContext = await request.newContext()
        const response = (await requestContext.post(envVars.baseApiUrl + '/api/tickets/' + id + '/mark-trash', {
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(204)
        expect(response.statusText()).toEqual('No Content')
    }

    async deleteTicket(authorizationToken: string, id: string) {
        const requestContext = await request.newContext()
        const response = (await requestContext.delete(envVars.baseApiUrl + '/api/tickets/' + id, {
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(204)
        expect(response.statusText()).toEqual('No Content')
    }

    async createNewTicket(authorizationToken: string, testData: Ticket) {
        const requestContext = await request.newContext()
        const inboxId = await this.apiInboxesHelper.getInboxIdByName(authorizationToken, testData['inbox'])
        const requesterId = await this.apiContactsHelper.getContactIdByFullName(authorizationToken, testData['requester'])
        let priority: number
        switch (testData['priority']) {
            case 'Normal':
                priority = 200;
                break;
            default:
                priority = 200;
                break;
        }
        const assigneeId = await this.apiUsersHelper.getUserIdByInboxName(authorizationToken, testData['assignee'])
        const response = (await requestContext.post(envVars.baseApiUrl + '/api/tickets', {
            data: {
                subject: testData['subject'],
                requesterId,
                priority,
                inboxId,
                assigneeId,
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
