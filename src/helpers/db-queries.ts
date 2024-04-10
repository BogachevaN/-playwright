export class DBQueries {
    GET_COUNTRY_BY_USER_EMAIL = (email: string) => {
        return `select * from countries c inner join users u on c.id = u.country_id where u.email = '${email}'`
    }

    GET_ALREADY_IN_USE_EMAIL = 'select first_name, last_name, email, country_id, workspace_id from users'

    GET_CONTACT_BY_FULL_NAME = (fullName: string) => {
        return `select * from contacts c where full_name  = '${fullName}' and is_deleted = false`
    }

    GET_INBOX_ID_BY_NAME = (inbox: string) => {
        return `select * from inboxes i where email = '${inbox}'`
    }

    GET_USER_ID_BY_NAME = (user: string) => {
        return `select * from  users u where username = '${user}'`
    }

    GET_SUPPORT_EMAIL = (userEmail: string) => {
        return `select i.* from inboxes i inner join users u on i.workspace_id = u.workspace_id where u.email = '${userEmail}' and "name" = 'Support'`
    }
}