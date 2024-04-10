import { APIBaseHelper } from '@/helpers/api-helpers/api-base-helper'
import { expect, request } from '@playwright/test'
import { envVars } from '@/helpers/environment-variables-helper'
import { Chat } from '@tests/data/ChatDataProvider'

interface ReturnedChatData {
    chatId: string;
    token: string;
}

export class APIMessengerHelper extends APIBaseHelper {

    async getWidgetByName(authorizationToken: string, widgetName: any) {
        const body = await this.getAnyItems(authorizationToken, 'messenger-widget')
        let id: any
        for (const i in body.items) {
            if (body.items[i].name == widgetName) {
                id = body.items[i].id
            }
        }
        return id
    }

    async createNewChat(authorizationToken: string, testData: Chat): Promise<ReturnedChatData> {
        const requestContext = await request.newContext()
        const response = (await requestContext.post(envVars.baseApiUrl + '/api/external/chats', {
            data: {
                email: testData['email'],
                message: testData['message'],
                name: testData['name'],
                timezoneId: testData['timezoneId'],
                widgetId: testData['widgetId'],
            },
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(201)
        expect(response.statusText()).toEqual('Created')
        const returnedChatData: ReturnedChatData = JSON.parse(await (response).text());
        return returnedChatData
    }

    async takeChat(authorizationToken: string, chatId: any) {
        const requestContext = await request.newContext()
        const response = await requestContext.put(envVars.baseApiUrl + `/api/chats/${chatId}/take`,
            {
                headers: {
                    authorization: 'Bearer ' + authorizationToken,
                },
            },
        )
        expect(response.status()).toEqual(200)
    }

    async getFirstAvailablePoolNumberId(authorizationToken: string) {
        const body = await this.getAnyItems(authorizationToken, 'pool-numbers')
        const id = body.items[0].id
        return id
    }

    async buyNewNumberFromPool(authorizationToken: string, id: any): Promise<string> {
        const requestContext = await request.newContext()
        const response = (await requestContext.post(envVars.baseApiUrl + '/api/phone-numbers/buy', {
            data: {
                poolItemId: id,
            },
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(201)
        expect(response.statusText()).toEqual('Created')
        return JSON.parse(await (response).text())['phone']
    }

    async cancelBoughtPoolNumber(authorizationToken: string, id: any) {
        const requestContext = await request.newContext()
        const response = (await requestContext.delete(envVars.baseApiUrl + '/api/phone-numbers/' + id, {
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(204)
        expect(response.statusText()).toEqual('No Content')
    }

    async deleteWidget(authorizationToken: string, id: any) {
        const requestContext = await request.newContext()
        const response = (await requestContext.delete(envVars.baseApiUrl + '/api/messenger-widget/' + id, {
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(204)
        expect(response.statusText()).toEqual('No Content')
    }

    async createNewWidget(authorizationToken: string, widgetName: any, domainName?: any): Promise<string> {
        const requestContext = await request.newContext()
        const response = (await requestContext.post(envVars.baseApiUrl + '/api/messenger-widget', {
            data: {
                name: widgetName,
                domain: {"data":domainName},
            },
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(201)
        expect(response.statusText()).toEqual('Created')
        return JSON.parse(await (response).text())['id']
    }

    async getWidgetIdByWidgetName(authorizationToken: string, widgetName: string) {
        const body = await this.getAnyItems(authorizationToken, 'messenger-widget')
        let id: any
        for (const i in body.items) {
            if (body.items[i].name == widgetName) {
                id = body.items[i].id
            }
        }
        return id
    }

    async rejectChat(authorizationToken: string, id: any) {
        const requestContext = await request.newContext()
        const response = (await requestContext.put(envVars.baseApiUrl + '/api/chats/' + id + '/reject', {
            data: {
                blockIp: false,
                reason: "test",
            },
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(204)
        expect(response.statusText()).toEqual('No Content')
    }

    async deleteChat(authorizationToken: string, id: any) {
        const requestContext = await request.newContext()
        const response = (await requestContext.delete(envVars.baseApiUrl + '/api/chats/' + id, {
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(204)
        expect(response.statusText()).toEqual('No Content')
    }

    async closeChat(authorizationToken: string, id: string) {
        const requestContext = await request.newContext()
        const response = (await requestContext.post(envVars.baseApiUrl + `/api/external/chats/${id}/close`, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(204)
        expect(response.statusText()).toEqual('No Content')
    }

    async solveChat(authorizationToken: string, id: any) {
        const requestContext = await request.newContext()
        const response = (await requestContext.put(envVars.baseApiUrl + '/api/chats/' + id + '/solve', {
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(204)
        expect(response.statusText()).toEqual('No Content')
    }
}