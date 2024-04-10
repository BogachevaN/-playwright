import { APIBaseHelper } from '@/helpers/api-helpers/api-base-helper'
import { expect, request } from '@playwright/test'
import { envVars } from '@/helpers/environment-variables-helper'

export class APITicketsSettingsHelper extends APIBaseHelper {

    async addSpamFilters(authorizationToken: string, blackList: Array<string>, whiteList: Array<string>) {
        const requestContext = await request.newContext()
        const response = (await requestContext.post(envVars.baseApiUrl + '/api/spam-filters', {
            data: {
                blacklisted: {
                    emailsAndDomains: blackList, 
                    phrases: [],
                },
                whitelisted: {
                    emailsAndDomains:whiteList,
                },
                inbox: null,
            },
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(200)
    }

    async getIdByStatusName(authorizationToken: string, statusName: string) {
        const body = await this.getAnyItems(authorizationToken, 'ticket-statuses')
        let id: any
        for (const i in body.items) {
            if (body.items[i].name == statusName) {
                id = body.items[i].id
            }
        }
        return id
    }

    async deleteTicketStatus(authorizationToken: string, id: string) { 
        const requestContext = await request.newContext()
        const response = await requestContext.delete(envVars.baseApiUrl + '/api/ticket-statuses/' + id,
            {
                headers: {
                    authorization: 'Bearer ' + authorizationToken,
                },
            },
        )
        expect(response.status()).toEqual(204)
        expect(response.statusText()).toEqual('No Content')
    }

    async createTicketStatus(authorizationToken: string, statusName: string) {
        const requestContext = await request.newContext()
        const response = (await requestContext.post(envVars.baseApiUrl + '/api/ticket-statuses', {
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

    async deleteInbox(authorizationToken: string, id: string) { 
        const requestContext = await request.newContext()
        const response = await requestContext.delete(envVars.baseApiUrl + '/api/inboxes/' + id,
            {
                headers: {
                    authorization: 'Bearer ' + authorizationToken,
                },
            },
        )
        expect(response.status()).toEqual(204)
        expect(response.statusText()).toEqual('No Content')
    }

    async createTouchpointInbox(authorizationToken: string, domain: string, inboxName: string) {
        const requestContext = await request.newContext()
        const response = (await requestContext.post(envVars.baseApiUrl + '/api/inboxes/managed', {
            data: {
                assigneeId: null,
                email: inboxName + domain,
                emailAuthenticationMode: 'none',
                name: inboxName,
            },
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(201)
        expect(response.statusText()).toEqual('Created')
        return JSON.parse(await (response).text())['id']
    }

    async getFilteredViewIdByName(authorizationToken: string, viewName: string) {
        const body = await this.getAnyItems(authorizationToken, 'v2/filtered-views')
        let id: any
        for (const i in body.items) {
            if (body.items[i].name == viewName) {
                id = body.items[i].id
            }
        }
        return id
    }

    async deleteFilteredView(authorizationToken: string, id: string) { 
        const requestContext = await request.newContext()
        const response = await requestContext.delete(envVars.baseApiUrl + '/api/filtered-views/' + id,
            {
                headers: {
                    authorization: 'Bearer ' + authorizationToken,
                },
            },
        )
        expect(response.status()).toEqual(204)
        expect(response.statusText()).toEqual('No Content')
    }

    async createFilteredView(authorizationToken: string, viewName: string) {
        const requestContext = await request.newContext()
        const response = (await requestContext.post(envVars.baseApiUrl + '/api/filtered-views', {
            data: {
                view: '/api/tickets',
                name: viewName,
                body: '{"filter":[{"priority":{"in":["300"]},"isTrash":{"eq":"false"}}],"sort":{"createdAt":"desc"},"groupBy":{}}',
                columns: [
                    {name: "workspaceTicketID", order: 1},
                    {name: "priority", order: 2},
                    {name: "subject", order: 3},
                    {name: "requester", order: 4},
                    {name: "status", order: 5},
                    {name: "assignee", order: 6},
                    {name: "updatedAt", order: 7},
                ],
                sharedWith: 'all',
                viewerIds: [],
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
