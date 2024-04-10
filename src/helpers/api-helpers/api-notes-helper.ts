import { APIBaseHelper } from "@/helpers/api-helpers/api-base-helper";
import { expect, request } from '@playwright/test'
import { envVars } from '@/helpers/environment-variables-helper'

export class APINotesHelper extends APIBaseHelper {
      
    async createNewNote(authorizationToken: string, id: string, 
        entityType: string, noteText: string): Promise<string> {
        const requestContext = await request.newContext()
        const response = (await requestContext.post(envVars.baseApiUrl + '/api/notes', {
            data: {
                entityId: id,
                type: entityType,
                content: noteText,
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