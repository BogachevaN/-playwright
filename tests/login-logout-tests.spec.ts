import { UserMenuComponent } from "@/components/admin/user-menu-component"
import { test } from '@/fixtures/start'
import { DashboardPage } from '@/pages/app/dashboard-page'
import { HeaderActionsComponentApp } from "@/components/app/header-actions-component-app"


let dashboardPage: DashboardPage
let userMenuComponent: UserMenuComponent
let headerActionsComponent: HeaderActionsComponentApp
let email: string
let password: string

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    dashboardPage = new DashboardPage(currentPage.page)
    userMenuComponent = new UserMenuComponent(currentPage.page)
    headerActionsComponent = new HeaderActionsComponentApp(currentPage.page)
    for (const user of testDataHelper.users) {
        if (user.test == 'authorization') {
            email = user.email
            password = user.password
        }
    }
})

test('Success log in @all @smoke @login', async ({ currentPage }) => {
    await currentPage.logIn(email, password)
    await dashboardPage.loadPage([dashboardPage.ticketsBlock])
})

test('Success log out @all @smoke @logout', async ({ currentPage }) => {
    await currentPage.logIn(email, password)
    await headerActionsComponent.userMenuBtn.click()
    await userMenuComponent.logOutBtn.click()
    await currentPage.loadPage()
})
