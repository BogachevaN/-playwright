import { expect, test } from '@/fixtures/start'
import { DashboardPage } from '@/pages/app/dashboard-page'
import { HomePage } from '@/pages/admin/home-page'
import { SideMenuNavigationComponentAdm } from '@/components/admin/sidemenu-navigation-component-adm'
import { WorkspaceSidebarComponent } from '@/components/admin/workspace-sidebar-component'
import { WorkspaceTeamsPage } from '@/pages/admin/workspace/workspace-teams-page'
import { APIWorkspaceHelper } from '@/helpers/api-helpers/api-workspace-helper'
import { NewTeamModal } from '@/pages/admin/workspace/new-team-modal'
import { DeleteTeamModal } from '@/pages/admin/workspace/delete-team-modal'

let dashboardPage: DashboardPage
let email: string
let password: string
let apiHelper: APIWorkspaceHelper
let authorizationToken: string
let homePage: HomePage
let sideMenuNavigationComponentAdm: SideMenuNavigationComponentAdm
let workspaceSidebarComponent: WorkspaceSidebarComponent
let workspaceTeamsPage: WorkspaceTeamsPage
let teamId: string
let newTeamModal: NewTeamModal
let teamName: string
let deleteTeamModal: DeleteTeamModal

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    dashboardPage = new DashboardPage(currentPage.page)
    apiHelper = new APIWorkspaceHelper()
    homePage = new HomePage(currentPage.page)
    sideMenuNavigationComponentAdm = new SideMenuNavigationComponentAdm(currentPage.page)
    workspaceSidebarComponent = new WorkspaceSidebarComponent(currentPage.page)
    workspaceTeamsPage = new WorkspaceTeamsPage(currentPage.page)
    teamId = ''
    newTeamModal = new NewTeamModal(currentPage.page)
    teamName = 'Test team' + Math.round(Math.random() * 10000)
    deleteTeamModal = new DeleteTeamModal(currentPage.page)

    for (const user of testDataHelper.users) {
        if (user.test == 'contacts_crud') {
            email = user.email
            password = user.password
        }
    }
    authorizationToken = (await apiHelper.getAuthorizationToken(email, password)).toString()
    await currentPage.logIn(email, password)
    await dashboardPage.loadPage([dashboardPage.ticketsBlock])
    await homePage.open(homePage.baseUrl)
    await sideMenuNavigationComponentAdm.workspaceBtn.click()
    await workspaceSidebarComponent.teamsBtn.click()
    await workspaceTeamsPage.loadPage()
})

test.afterEach(async () => {
    if (teamId != '') {
        await apiHelper.deleteTeam(authorizationToken, teamId)
    }
})

test('Create new team @all @smoke @workspaceSettings @createWorkspaceTeam', async () => {
    await workspaceTeamsPage.newTeamBtn.click()
    await newTeamModal.loadModal('New team')
    await newTeamModal.teamNameInput.fill(teamName)
    await newTeamModal.confirmModal()
    await expect.soft(workspaceTeamsPage.teamCreatedMsg).toBeVisible()
    teamId = await apiHelper.getTeamIdByName(authorizationToken, teamName)
    await workspaceTeamsPage.searchTeam(teamName)
    const row = await workspaceTeamsPage.fieldsTable.getRowByText(teamName)
    expect.soft(row).toBeVisible()
})

test('Update team @all @smoke @workspaceSettings @updateWorkspaceTeam', async () => {
    teamId = await apiHelper.createTeam(authorizationToken, teamName)
    await workspaceTeamsPage.searchTeam(teamName)
    let row = await workspaceTeamsPage.fieldsTable.getRowByText(teamName)
    await workspaceTeamsPage.fieldsTable.openMenuInRow(row)
    await workspaceTeamsPage.fieldsTable.selectOptionInDropdownMenu('Edit')
    await newTeamModal.loadModal('Edit team')
    const newTeamName = teamName + '_edit'
    await newTeamModal.teamNameInput.fill(newTeamName)
    await newTeamModal.makeDefaultCheckbox.click()
    await newTeamModal.confirmModal()
    await expect.soft(workspaceTeamsPage.teamUpdatedMsg).toBeVisible()
    await workspaceTeamsPage.searchTeam(newTeamName)
    row = await workspaceTeamsPage.fieldsTable.getRowByText(newTeamName)
    expect.soft(row).toBeVisible()
    expect(await workspaceTeamsPage.getDefaultMarkInRow(row)).toEqual('DEFAULT')
    await apiHelper.updateTeam(authorizationToken, 'General', true, await apiHelper.getTeamIdByName(authorizationToken, 'General'))
})

test('Delete team @all @smoke @workspaceSettings @deleteWorkspaceTeam', async () => {
    teamId = await apiHelper.createTeam(authorizationToken, teamName)
    await workspaceTeamsPage.searchTeam(teamName)
    const row = await workspaceTeamsPage.fieldsTable.getRowByText(teamName)
    await workspaceTeamsPage.fieldsTable.openMenuInRow(row)
    await workspaceTeamsPage.fieldsTable.selectOptionInDropdownMenu('Delete')
    await deleteTeamModal.loadModal('Delete team')
    expect.soft(await deleteTeamModal.getText(teamName)).toBeVisible()
    await deleteTeamModal.confirmModal()
    await expect.soft(workspaceTeamsPage.teamDeletedMsg).toBeVisible()
    await workspaceTeamsPage.searchTeam(teamName)
    await expect(workspaceTeamsPage.fieldsTable.noSearchResultsHeader).toBeVisible()
    teamId = ''
})