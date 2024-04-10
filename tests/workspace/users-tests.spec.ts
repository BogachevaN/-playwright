import { expect, test } from '@/fixtures/start'
import { DashboardPage } from '@/pages/app/dashboard-page'
import { HomePage } from '@/pages/admin/home-page'
import { SideMenuNavigationComponentAdm } from '@/components/admin/sidemenu-navigation-component-adm'
import { WorkspaceSidebarComponent } from '@/components/admin/workspace-sidebar-component'
import { WorkspaceUsersPage } from '@/pages/admin/workspace/workspace-users-page'
import { DataProviderInterface } from '@tests/data/types'
import { User } from '@tests/data/UserDataProvider'
import { APIUsersHelper } from '@/helpers/api-helpers/api-users-helper'
import { dataProviderManager } from '@tests/data/DataManager'
import { InviteUserByEmailModal } from '@/pages/admin/workspace/invite-user-by-email-modal'
import { EditUserDetailsModal } from '@/pages/admin/workspace/edit-user-details-modal'

let dashboardPage: DashboardPage
let email: string
let password: string
let apiHelper: APIUsersHelper
let authorizationToken: string
let homePage: HomePage
let sideMenuNavigationComponentAdm: SideMenuNavigationComponentAdm
let workspaceSidebarComponent: WorkspaceSidebarComponent
let workspaceUsersPage: WorkspaceUsersPage
let userDataProvider: DataProviderInterface<User>
let inviteUserByEmailModal: InviteUserByEmailModal
let editUserDetailsModal: EditUserDetailsModal

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    dashboardPage = new DashboardPage(currentPage.page)
    apiHelper = new APIUsersHelper()
    homePage = new HomePage(currentPage.page)
    sideMenuNavigationComponentAdm = new SideMenuNavigationComponentAdm(currentPage.page)
    workspaceSidebarComponent = new WorkspaceSidebarComponent(currentPage.page)
    workspaceUsersPage = new WorkspaceUsersPage(currentPage.page)
    userDataProvider = dataProviderManager.createProvider<User>('user')
    inviteUserByEmailModal = new InviteUserByEmailModal(currentPage.page)
    editUserDetailsModal = new EditUserDetailsModal(currentPage.page)

    for (const user of testDataHelper.users) {
        if (user.test == 'users_crud') {
            email = user.email
            password = user.password
        }
    }
    authorizationToken = (await apiHelper.getAuthorizationToken(email, password)).toString()
    await currentPage.logIn(email, password)
    await dashboardPage.loadPage([dashboardPage.ticketsBlock])
    await homePage.open(homePage.baseUrl)
    await sideMenuNavigationComponentAdm.workspaceBtn.click()
    await workspaceSidebarComponent.usersBtn.click()
    await workspaceUsersPage.loadPage()
})

test.afterEach(async () => {
    userDataProvider.clear()
})

//PRO-8360
test.skip('Invite new user by email @all @smoke @workspaceSettings @inviteUserByEmail', async () => {
    await inviteByEmailDefault()
    await expect.soft(workspaceUsersPage.page.getByText('1 user have been invited.')).toBeVisible()
    await workspaceUsersPage.searchUser(userDataProvider.getField('email'))
    const row = await workspaceUsersPage.fieldsTable.getRowByText(userDataProvider.getField('email'))
    expect.soft(row).toBeVisible()
    expect.soft(await workspaceUsersPage.getRoleInRow(row)).toEqual('Admin')
    expect.soft(await workspaceUsersPage.getStatusInRow(row)).toEqual('INVITED')
    expect.soft(await workspaceUsersPage.getTeamInRow(row)).toEqual('General')
})

//PRO-8360
test.skip('Update user @all @smoke @workspaceSettings @updateWorkspaceUser', async () => {
    await inviteByEmailDefault()
    await expect.soft(workspaceUsersPage.page.getByText('1 user have been invited.')).toBeVisible()
    await workspaceUsersPage.searchUser(userDataProvider.getField('email'))
    let row = await workspaceUsersPage.fieldsTable.getRowByText(userDataProvider.getField('email'))
    await workspaceUsersPage.fieldsTable.openMenuInRow(row)
    await workspaceUsersPage.fieldsTable.selectOptionInDropdownMenu('Edit')
    await editUserDetailsModal.loadModal('Edit user details')
    await editUserDetailsModal.firstNameInput.fill(userDataProvider.getField('firstName'))
    await editUserDetailsModal.lastNameInput.fill(userDataProvider.getField('lastName'))
    await editUserDetailsModal.jobTitleInput.fill(userDataProvider.getField('jobTitle'))
    await editUserDetailsModal.phoneInput.fill(userDataProvider.getField('phone'))
    await editUserDetailsModal.firstNameInput.click()
    await editUserDetailsModal.roleList.click()
    await editUserDetailsModal.selectValueInDropdown('Agent')
    await editUserDetailsModal.teamInput.click()
    await editUserDetailsModal.clearTeam.click()
    await editUserDetailsModal.selectValueInDropdown('Marketing')
    await editUserDetailsModal.confirmModal()
    await expect.soft(workspaceUsersPage.page.getByText('The user has been successfully updated')).toBeVisible()
    await workspaceUsersPage.searchUser(userDataProvider.getField('email'))
    row = await workspaceUsersPage.fieldsTable.getRowByText(userDataProvider.getField('email'))
    expect.soft(row).toBeVisible()
    expect.soft(await workspaceUsersPage.getRoleInRow(row)).toEqual('Agent')
    expect.soft(await workspaceUsersPage.getTeamInRow(row)).toEqual('Marketing')
})

async function inviteByEmailDefault() {
    await workspaceUsersPage.addUserBtn.click()
    await inviteUserByEmailModal.loadModal('Invite users via email')
    await inviteUserByEmailModal.fillUserRow(1, userDataProvider.getField('email'))
    await inviteUserByEmailModal.confirmModal()
}

