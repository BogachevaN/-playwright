import { test as base} from '@playwright/test'
import { LoginPage } from '@/pages/login-page'
import { TestDataHelper } from '@/helpers/test-data-helper'
import { envVars } from '@/helpers/environment-variables-helper'

type Start = {
    currentPage: LoginPage
    testDataHelper: TestDataHelper
}

export const test = base.extend<Start>({
    currentPage: async ({ browser }, use) => {
        const context = await browser.newContext({
            httpCredentials: {
                username: envVars.basicAuthLogin,
                password: envVars.basicAuthPassword,
            },
        });
        const page = await context.newPage()
        const currentPage = new LoginPage(page)
        await currentPage.open()
        await use(currentPage)
    },
    testDataHelper: new TestDataHelper(),
});
export { expect } from '@playwright/test'
