import { APIBaseHelper } from '@/helpers/api-helpers/api-base-helper'
import { expect, request } from '@playwright/test'
import { envVars } from '../environment-variables-helper'

export class APIWorkspaceHelper extends APIBaseHelper {

    async getCountryNameByCountryId(authorizationToken: string, countryId: any) {
        const countries = await this.getAnyItems(authorizationToken, 'dictionaries/countries')
        let name: any
        for (const i in countries) {
            if (countries[i].id == countryId) {
                name = countries[i].name
                break
            }
        }
        return name
    }

    async getInboxEmailByName(authorizationToken: string, name: any) {
        const body = await this.getAnyItems(authorizationToken, 'inboxes')
        let email: any
        for (const i in body.items) {
            if (body.items[i].name == name) {
                email = body.items[i].email
            }
        }
        return email
    }

    async deleteTeam(authorizationToken: string, id: any) {
        const requestContext = await request.newContext()
        const response = (await requestContext.delete(envVars.baseApiUrl + '/api/teams/' + id, {
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(204)
        expect(response.statusText()).toEqual('No Content')
    }

    async getTeamIdByName(authorizationToken: string, teamName: string) {
        const body = await this.getAnyItems(authorizationToken, 'teams')
        let id: any
        for (const i in body.items) {
            if (body.items[i].name == teamName) {
                id = body.items[i].id
            }
        }
        return id
    }

    async createTeam(authorizationToken: string, teamName: any): Promise<string> {
        const requestContext = await request.newContext()
        const response = (await requestContext.post(envVars.baseApiUrl + '/api/teams', {
            data: {
                name: teamName,
            },
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(201)
        expect(response.statusText()).toEqual('Created')
        return JSON.parse(await (response).text())['id']
    }

    async updateTeam(authorizationToken: string, teamName: any, isDefault: boolean, id: any)   {
        const requestContext = await request.newContext()
        const response = (await requestContext.put(envVars.baseApiUrl + '/api/teams/' + id, {
            data: {
                name: teamName,
                isDefault,
            },
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(200)
    }

    async deleteTag(authorizationToken: string, id: any) {
        const requestContext = await request.newContext()
        const response = (await requestContext.delete(envVars.baseApiUrl + '/api/tags/' + id, {
            headers: {
                authorization: 'Bearer ' + authorizationToken,
            },
        }))
        expect(response.status()).toEqual(204)
        expect(response.statusText()).toEqual('No Content')
    }
}
