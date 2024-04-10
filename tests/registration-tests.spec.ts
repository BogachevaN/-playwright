import { SignUpPage } from '@/pages/registration/sign-up-page'
import { EmailConfirmationPage } from '@/pages/registration/email-confirmation-page'
import { CreateWorkspacePage } from '@/pages/registration/create-workspace-page'
import { CompanyInfoPage } from '@/pages/registration/company-info-page'
import { InviteTeamPage } from '@/pages/registration/invite-team-page'
import { HomePage } from '@/pages/admin/home-page'
import { WorkspaceGeneralPage } from '@/pages/admin/workspace/workspace-general-page'
import { WorkspaceUsersPage } from '@/pages/admin/workspace/workspace-users-page'
import { SideMenuNavigationComponentAdm } from '@/components/admin/sidemenu-navigation-component-adm'
import Mailosaur from 'mailosaur'
import { APIUsersHelper } from '@/helpers/api-helpers/api-users-helper'
import { APIWorkspaceHelper } from '@/helpers/api-helpers/api-workspace-helper'
import { faker } from '@faker-js/faker'
import { envVars } from '@/helpers/environment-variables-helper'
import { test } from '@/fixtures/start'
import { getConfirmationCode, getLastLetter } from '@/helpers/email-helper'
import { expect } from '@playwright/test'
import { InviteUserByLinkModal } from '@/pages/admin/workspace/invite-user-by-link-modal'
import { HeaderActionsComponent } from '@/components/admin/header-actions-component'
import { UserMenuComponent } from '@/components/admin/user-menu-component'
import { User } from './data/UserDataProvider'
import { DataProviderInterface } from './data/types'
import { dataProviderManager } from './data/DataManager'
import { DashboardPage } from '@/pages/app/dashboard-page'
import { HeaderActionsComponentApp } from '@/components/app/header-actions-component-app'
import { MyAccountPage } from '@/pages/admin/my-account/my-account-page'

let signUpPage: SignUpPage
let emailConfirmationPage: EmailConfirmationPage
let createWorkspacePage: CreateWorkspacePage
let companyInfoPage: CompanyInfoPage
let inviteTeamPage: InviteTeamPage
let homePage: HomePage
let myAccountPage: MyAccountPage
let workspaceGeneralPage: WorkspaceGeneralPage
let workspaceUsersPage: WorkspaceUsersPage
let sidemenuNavigationComponentAdm: SideMenuNavigationComponentAdm
let mailClient: Mailosaur
let apiUsersHelper: APIUsersHelper
let apiWorkspaceHelper: APIWorkspaceHelper
let email: string
let password: string
let newUserModal: InviteUserByLinkModal
let userMenuComponent: UserMenuComponent
let headerActionsComponent: HeaderActionsComponent
let userDataProvider: DataProviderInterface<User>
let dashboardPage: DashboardPage
let headerActionsComponentApp:HeaderActionsComponentApp

test.beforeEach(async ({ currentPage, testDataHelper }) => {
    signUpPage = new SignUpPage(currentPage.page)
    emailConfirmationPage = new EmailConfirmationPage(currentPage.page)
    createWorkspacePage = new CreateWorkspacePage(currentPage.page)
    companyInfoPage = new CompanyInfoPage(currentPage.page)
    inviteTeamPage = new InviteTeamPage(currentPage.page)
    
    mailClient = new Mailosaur(envVars.mailosaurApiKey)
    apiUsersHelper = new APIUsersHelper()
    apiWorkspaceHelper = new APIWorkspaceHelper()
    
    userDataProvider = dataProviderManager.createProvider<User>('user')
    dashboardPage = new DashboardPage(currentPage.page)
    headerActionsComponentApp = new HeaderActionsComponentApp(currentPage.page)

    for (const user of testDataHelper.users) {
        if (user.test == 'authorization') {
            email = user.email
            password = user.password
        }
    }
    await currentPage.startFreeTrialLink.click()
    await signUpPage.loadPage()
})

test.afterEach(async () => {
    userDataProvider.clear()
})

test('User is created successfully using valid non-existing credentials @all @smoke @registration @createUserSuccess', async ({ currentPage }) => {
    await signUpPage.enterValidDataSignupPage(userDataProvider)
    await emailConfirmationPage.loadPage()
    const letter = await getLastLetter(mailClient, userDataProvider.getField('email'))
    await emailConfirmationPage.enterConfirmationCode(getConfirmationCode(letter))

    await createWorkspacePage.loadPage()
    userDataProvider.setField('workspaceName', await createWorkspacePage.workspaceNameInput.inputValue())
    userDataProvider.setField('workspaceUrl', await createWorkspacePage.workspaceUrlInput.inputValue())
    await createWorkspacePage.continueBtn.click()
    await companyInfoPage.loadPage()
    await companyInfoPage.companySizeList.click()
    await companyInfoPage.selectValueInDropdown('Medium (10-100)')
    await companyInfoPage.industryList.click()
    await companyInfoPage.selectValueInDropdown('Biotechnology')
    await companyInfoPage.continueBtn.click()
    await inviteTeamPage.loadPage()
    const inviteUsers = userDataProvider.getField('inviteUsers').split(',')
    inviteUsers.forEach(user => {
        inviteTeamPage.inviteUsersByEmailBox.fill(user + ' ')
        inviteTeamPage.page.keyboard.press('Enter')
    })
    await inviteTeamPage.userRoleList.click()
    await inviteTeamPage.selectValueInDropdown('Agent')
    await inviteTeamPage.sendInvitesBtn.click()

    // assertions
    await dashboardPage.loadPage([dashboardPage.ticketsBlock])
    //new tab - new page
    const pagePromise = currentPage.page.context().waitForEvent('page')
    await headerActionsComponentApp.navigateToAdmin()
    const newPage = await pagePromise
    homePage = new HomePage(newPage)
    await homePage.loadPage([homePage.myAccountBtn])
    sidemenuNavigationComponentAdm = new SideMenuNavigationComponentAdm(newPage)
    myAccountPage = new MyAccountPage(newPage)
    workspaceGeneralPage = new WorkspaceGeneralPage(newPage)
    workspaceUsersPage = new WorkspaceUsersPage(newPage)
    // user info
    await sidemenuNavigationComponentAdm.myAccountBtn.click()
    await myAccountPage.loadPage([myAccountPage.userFullNameText])
    expect.soft(await myAccountPage.firstNameInput.inputValue()).toEqual(userDataProvider.getField('firstName'))
    expect.soft(await myAccountPage.lastNameInput.inputValue()).toEqual(userDataProvider.getField('lastName'))
    expect.soft(await myAccountPage.emailInput.inputValue()).toEqual(userDataProvider.getField('email'))
    const authorizationToken = (await apiUsersHelper.getAuthorizationToken(userDataProvider.getField('email'), userDataProvider.getField('password'))).toString()
    const countryId = await apiUsersHelper.getCountryIdByUserInboxName(authorizationToken, userDataProvider.getField('email'))
    expect.soft(await apiWorkspaceHelper.getCountryNameByCountryId(authorizationToken, countryId)).toEqual(userDataProvider.getField('country'))
    // workspace info
    await sidemenuNavigationComponentAdm.workspaceBtn.click()
    await workspaceGeneralPage.loadPage([workspaceGeneralPage.editWorkspaceNameAndUrlBtn])
    expect.soft(await workspaceGeneralPage.isContainValue(userDataProvider.getField('workspaceName'))).toBeTruthy()
    expect.soft(await workspaceGeneralPage.isContainValue(userDataProvider.getField('workspaceUrl'))).toBeTruthy()
    await workspaceUsersPage.open(workspaceUsersPage.baseUrl)
    await workspaceUsersPage.loadPage([workspaceUsersPage.addUserBtn])
    for (const user of inviteUsers) {
        expect.soft(await workspaceUsersPage.tableOfUsersContains(user)).toBeTruthy()
    }
})

const incorrectEmail = ['testEmail+n@test.', 'testEmail+ntest.com', 'testEmail+n.com',
    'тест@mail.ru', 'test@мейл.ру']
for (const email of incorrectEmail) {
    test(`Enter incorrect email address: ${email} @all @regress @registration @registrationIncorrectEmail`, async () => {
        await signUpPage.emailInput.fill(email)
        await signUpPage.firstNameInput.fill(userDataProvider.getField('firstName'))
        await signUpPage.lastNameInput.fill(userDataProvider.getField('lastName'))
        await signUpPage.passwordInput.click()
        expect.soft(await signUpPage.getErrorMessage(signUpPage.emailInput)).toEqual('Please enter a valid email address')
        expect.soft(await signUpPage.emailInput.getAttribute('errorstate')).toEqual('true')
        expect.soft(signUpPage.checkRedFrame(signUpPage.emailInput)).toBeTruthy()
    })
}

test('Maximum length of  "Email address" field @all @regress @registration @registrationMaxEmailLength', async () => {
    const randomString = faker.random.alphaNumeric(246);
    const longEmailAddress = randomString + '@gmail.com'
    await signUpPage.emailInput.fill(longEmailAddress)
    await signUpPage.passwordInput.click()
    expect.soft(await signUpPage.emailInput.getAttribute('errorstate')).toEqual('false')
    expect.soft(await signUpPage.getErrorMessage(signUpPage.emailInput)).toEqual('')
    const actualValueInEmail = await signUpPage.emailInput.inputValue()
    const expectedValueInEmail = randomString + '@gmail.co'
    expect.soft(actualValueInEmail).toEqual(expectedValueInEmail)
    expect.soft(actualValueInEmail.length).toEqual(255)
})

test('"Email address" already in use @all @regress @registration @registrationExistingEmail', async () => {
    const authorizationToken = (await apiUsersHelper.getAuthorizationToken(email, password)).toString()
    const allUsers = await  apiUsersHelper.getAnyItems(authorizationToken, 'users')
    const alreadyInUseEmail = allUsers.items[0].email

    await signUpPage.emailInput.fill(alreadyInUseEmail)
    await signUpPage.firstNameInput.fill(userDataProvider.getField('firstName'))
    await signUpPage.lastNameInput.fill(userDataProvider.getField('lastName'))
    await signUpPage.passwordInput.fill(userDataProvider.getField('password'))
    await signUpPage.startFreeTrialBtn.click()
    expect.soft(await signUpPage.getErrorMessage(signUpPage.emailInput)).toEqual('This email is already in use by another user.')
    expect.soft(await signUpPage.emailInput.getAttribute('errorstate')).toEqual('true')
    expect.soft(await signUpPage.checkRedFrame(signUpPage.emailInput)).toBeTruthy()
})

test('Password rules. Check password rules names @all @regress @registration @registrationPasswordRules', async () => {
    await signUpPage.passwordInput.click()
    const count = await signUpPage.passwordRulesPlaceholder.count()
    const rules = new Array(count)
    for (let i = 0; i < count; ++i) {
        const textRule = await signUpPage.page.locator('.password-validation > div').nth(i).locator('span').innerHTML()
        rules[i] = textRule
    }
    expect.soft(rules[0]).toEqual('8 to 48 characters')
    expect.soft(rules[1]).toEqual('One special character')
    expect.soft(rules[2]).toEqual('One number')
    expect.soft(rules[3]).toEqual('Lower and uppercase')
})

const validPasswords = ['qQ!12345', 'qQ!123456', '8HlP4cGDWSI(IyAAWdgB2gp9L%qg^6nMwjpn5L8yPCCOkxDr']
for (const password of validPasswords) {
    test(`Password rules. Valid password: ${password} @all @regress @registration @registrationValidPassword`, async () => {
        await signUpPage.passwordInput.fill(password)
        const count = await signUpPage.passwordRulesPlaceholder.count()
        for (let i = 0; i < count; ++i) {
            const classValue = await signUpPage.passwordRulesPlaceholder.nth(i).locator('i').getAttribute('class')
            expect.soft(classValue).toContain('success--text')
        }
        signUpPage.firstNameInput.click()
        let n = 0
        //wait half a second for the rules to hide
        while (await signUpPage.passwordRulesPlaceholder.nth(1).isVisible() && n!=5) {
            await emailConfirmationPage.page.waitForTimeout(100)
            n++
        }
        expect.soft(await signUpPage.passwordRulesPlaceholder.isHidden()).toBeTruthy()
    })
}

const incorrectPasswordLength = ['qQ!1234', '8HlP4cGDWSI(IyAAWdgB2gp9L%qg^6nMwjpn5L8yPCCOkxDrn']
for (const password of incorrectPasswordLength) {
    test(`Password rules. Password with incorrect length: ${password} @all @regress @registration @registrationIncorrectPasswordLength`, async () => {
        await signUpPage.passwordInput.fill(password)
        await signUpPage.emailInput.fill(userDataProvider.getField('email'))
        const error = await signUpPage.passwordRulesPlaceholder.nth(0).locator('i').innerText()
        expect.soft(error).toEqual('close')
        expect.soft(await signUpPage.checkRedFrame(signUpPage.passwordInput)).toBeTruthy()
    })
}

test('Password rules. One number @all @regress @registration @registrationIncorrectPasswordNumber', async () => {
    await signUpPage.passwordInput.fill('qQ!dfg%)')
    await signUpPage.emailInput.fill(userDataProvider.getField('email'))
    const error = await signUpPage.passwordRulesPlaceholder.nth(2).locator('i').innerText()
    expect.soft(error).toEqual('close')
    expect.soft(await signUpPage.checkRedFrame(signUpPage.passwordInput)).toBeTruthy()
})

const lowerUppercaseRule = ['3Q!12345', 'qw!12345']
for (const password of lowerUppercaseRule) {
    test(`Password rules. Lower and uppercase: ${password} @all @regress @registration @registrationIncorrectPasswordCase`, async () => {
        await signUpPage.passwordInput.fill(password)
        await signUpPage.emailInput.fill(userDataProvider.getField('email'))
        const error = await signUpPage.passwordRulesPlaceholder.nth(3).locator('i').innerText()
        expect.soft(error).toEqual('close')
        expect.soft(await signUpPage.checkRedFrame(signUpPage.passwordInput)).toBeTruthy()
    })
}

test('Password rules. One special character @all @regress @registration @registrationIncorrectPasswordSpecialSymbol', async () => {
    await signUpPage.passwordInput.fill('qQw12345')
    await signUpPage.emailInput.fill(userDataProvider.getField('email'))
    const error = await signUpPage.passwordRulesPlaceholder.nth(1).locator('i').innerText()
    expect.soft(error).toEqual('close')
    expect.soft(await signUpPage.checkRedFrame(signUpPage.passwordInput)).toBeTruthy()
})

const passwordWithSpace = ['qQ!1 345', 'qQ!1234 ']
for (const password of passwordWithSpace) {
    test(`Password rules. Spaces should be trimmed: ${password} @all @regress @registration @registrationIncorrectPasswordSpace`, async () => {
        await signUpPage.passwordInput.fill(password)
        await signUpPage.emailInput.fill(userDataProvider.getField('email'))
        const error = await signUpPage.passwordRulesPlaceholder.nth(0).locator('i').innerText()
        expect.soft(error).toEqual('close')
        const actualValue = await signUpPage.passwordInput.inputValue()
        const expectedValue = password.replace(/\s+/g, '')
        expect.soft(actualValue).toEqual(expectedValue)
    })
}

test('Password rules. All rules are red @all @regress @registration @registrationIncorrectPasswordAllRules', async () => {
    await signUpPage.passwordInput.fill('qwertyu')
    await signUpPage.emailInput.fill(userDataProvider.getField('email'))
    const count = await signUpPage.passwordRulesPlaceholder.count()
    for (let i = 0; i < count; ++i) {
        const error = await signUpPage.passwordRulesPlaceholder.nth(i).locator('i').innerText()
        expect.soft(error).toEqual('close')
    }
    expect.soft(await signUpPage.checkRedFrame(signUpPage.passwordInput)).toBeTruthy()
})

test('SignUp page. Required fields @all @regress @registration @registrationRequiredFields', async () => {
    await signUpPage.startFreeTrialBtn.click()
    expect.soft(await signUpPage.getErrorMessage(signUpPage.firstNameInput)).toEqual('Please enter your first name')
    expect.soft(await signUpPage.checkRedFrame(signUpPage.firstNameInput)).toBeTruthy()
    expect.soft(await signUpPage.getErrorMessage(signUpPage.lastNameInput)).toEqual('Please enter your last name')
    expect.soft(await signUpPage.checkRedFrame(signUpPage.lastNameInput)).toBeTruthy()
    expect.soft(await signUpPage.getErrorMessage(signUpPage.emailInput)).toEqual('Please enter your email address')
    expect.soft(await signUpPage.checkRedFrame(signUpPage.emailInput)).toBeTruthy()
    expect.soft(await signUpPage.checkRedFrame(signUpPage.passwordInput)).toBeTruthy()
})

test('SignUp page. Too long values in fields @all @regress @registration @registrationLongValueInFields', async () => {
    //check first name
    const longFirstName = faker.random.alpha(256)
    await signUpPage.firstNameInput.fill(longFirstName)
    expect.soft(await signUpPage.firstNameInput.inputValue()).toEqual(longFirstName.slice(0, -1))
    //check last name
    const longLastName = faker.random.alpha(256)
    await signUpPage.lastNameInput.fill(longLastName)
    expect.soft(await signUpPage.lastNameInput.inputValue()).toEqual(longLastName.slice(0, -1))
    //check email
    const longEmail = faker.random.alpha(247)
    await signUpPage.emailInput.fill(`${longEmail}@mail.com`)
    expect.soft(await signUpPage.emailInput.inputValue()).toEqual(`${longEmail}@mail.co`)

    await signUpPage.passwordInput.fill(userDataProvider.getField('password'));
    await signUpPage.startFreeTrialBtn.click()
    await emailConfirmationPage.loadPage()
})

test('Page "email-confirmation". Incorrect confirmation code @all @regress @registration @registrationWrongConfirmationCode', async () => {
    await signUpPage.enterValidDataSignupPage(userDataProvider)
    await emailConfirmationPage.loadPage()
    await emailConfirmationPage.confirmationCodeInput.fill('111111')
    expect(await emailConfirmationPage.getErrorMessageFromConfirmationPage())
        .toEqual('The code is not valid. Please try again.')
})

test('Page "email-confirmation". Resend code after 60 seconds have passed @all @regress @registration @registrationResendCode', async () => {
    await signUpPage.enterValidDataSignupPage(userDataProvider)
    await emailConfirmationPage.loadPage()
    test.setTimeout(80000)
    await emailConfirmationPage.page.waitForTimeout(61000)
    await emailConfirmationPage.resendLink.click()
    await expect(emailConfirmationPage.successResendCodeMsg).toBeVisible()
})

test('Registration by invitation link @all @regress @registration @registrationByLink', async ({ currentPage }) => {
    await signUpPage.logInLink.click()
    await currentPage.logIn(email, password)
    await dashboardPage.loadPage([dashboardPage.ticketsBlock])
    //new tab - new page
    let pagePromise = currentPage.page.context().waitForEvent('page')
    await headerActionsComponentApp.navigateToAdmin()
    let newPage = await pagePromise
    homePage = new HomePage(newPage)
    await homePage.loadPage([homePage.myAccountBtn])
    sidemenuNavigationComponentAdm = new SideMenuNavigationComponentAdm(newPage)
    workspaceGeneralPage = new WorkspaceGeneralPage(newPage)
    workspaceUsersPage = new WorkspaceUsersPage(newPage)
    newUserModal = new InviteUserByLinkModal(newPage)
    headerActionsComponent = new HeaderActionsComponent(newPage)
    userMenuComponent = new UserMenuComponent(newPage)

    await sidemenuNavigationComponentAdm.workspaceBtn.click()
    await workspaceGeneralPage.loadPage([workspaceGeneralPage.editWorkspaceNameAndUrlBtn])
    await workspaceUsersPage.open(workspaceUsersPage.baseUrl)
    await workspaceUsersPage.loadPage([workspaceUsersPage.addUserBtn])
    await workspaceUsersPage.shareInviteLinkBtn.click()
    await newUserModal.loadPage()
    await newUserModal.expirationDateList.click()
    await newUserModal.selectValueInDropdown('in 7 days')
    await newUserModal.copyBtn.click()
    const link = await newUserModal.inviteLink.innerHTML()
    await newUserModal.saveChangesBtn.click()
    await headerActionsComponent.userMenuBtn.click()
    await userMenuComponent.logOutBtn.click()
    
    await currentPage.page.reload()
    await currentPage.loadPage()
    await currentPage.page.goto(link)
    await signUpPage.firstNameInput.fill(userDataProvider.getField('firstName'));
    await signUpPage.lastNameInput.fill(userDataProvider.getField('lastName'));
    await signUpPage.emailInput.fill(userDataProvider.getField('email'));
    await signUpPage.passwordInput.fill(userDataProvider.getField('password'));
    await signUpPage.joinWorkspaceBtn.click()
    await emailConfirmationPage.loadPage()
    const letter = await getLastLetter(mailClient, userDataProvider.getField('email'))
    await emailConfirmationPage.enterConfirmationCode(getConfirmationCode(letter))
    await dashboardPage.loadPage([dashboardPage.ticketsBlock])
    //new tab - new page
    pagePromise = currentPage.page.context().waitForEvent('page')
    await headerActionsComponentApp.navigateToAdmin()
    newPage = await pagePromise
    homePage = new HomePage(newPage)
    await homePage.loadPage([homePage.myAccountBtn])
    sidemenuNavigationComponentAdm = new SideMenuNavigationComponentAdm(newPage)
    myAccountPage = new MyAccountPage(newPage)

    await sidemenuNavigationComponentAdm.myAccountBtn.click()
    await myAccountPage.loadPage([myAccountPage.userFullNameText])
    expect.soft(await myAccountPage.firstNameInput.inputValue()).toEqual(userDataProvider.getField('firstName'))
    expect.soft(await myAccountPage.lastNameInput.inputValue()).toEqual(userDataProvider.getField('lastName'))
    expect.soft(await myAccountPage.emailInput.inputValue()).toEqual(userDataProvider.getField('email'))
})
