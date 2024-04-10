import { APIBaseHelper } from '@/helpers/api-helpers/api-base-helper'
import { expect, request } from '@playwright/test'
import { envVars } from '@/helpers/environment-variables-helper'

export class APIWorkflowHelper extends APIBaseHelper {

    async createNewWorkflow(authorizationToken: string, workflowName: string): Promise<string> {
        const requestContext = await request.newContext()
        const response = (await requestContext.post(envVars.baseApiUrl + '/api/workflows', {
            data: {
                name: workflowName,
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
}
