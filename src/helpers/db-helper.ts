import { Client } from "pg";
import { envVars } from "./environment-variables-helper";
import { DBQueries } from "./db-queries";

export class DBHelper {
    readonly dbQueries: DBQueries
    protected pgClient: Client

    constructor() {
        this.dbQueries = new DBQueries()
        this.pgClient = new Client({
            user: envVars.dbUser,
            host: envVars.dbHost,
            database: envVars.dbName,
            password: envVars.dbPassword,
            port: envVars.dbPort,
        })
    }

    async connectDB() {
        await this.pgClient.connect();
    }

    async query(queryString: string) {
        return this.pgClient.query(queryString);
    }

    async closeConnection() {
        this.pgClient.end()
    }

    async getSingleResult(query: string, tableColumnName: string) {
        const data = await this.getAllRows(query)
        return data[0][tableColumnName]
    }

    async getAllRows(query: string) {
        let data: any[] = []
        await this.query(query).then(res => {
            data = res.rows
        })
        return data
    }

    async getContactIdByFullName(fullName: any) {
       return this.getSingleResult(this.dbQueries.GET_CONTACT_BY_FULL_NAME(fullName), 'id')
    }

    async getInboxIdByName(inbox: any) {
        return this.getSingleResult(this.dbQueries.GET_INBOX_ID_BY_NAME(inbox), 'id')
    }

    async getUserIdByName(user: any) {
        const userNameInDB = String(user).replace(/ /g, '-')
        return this.getSingleResult(this.dbQueries.GET_USER_ID_BY_NAME(userNameInDB), 'id')
    }

    async getCountryByWorkspaceId(value: any) {
        return this.getSingleResult(this.dbQueries.GET_COUNTRY_BY_USER_EMAIL(value), 'name')
    }

    async getAlreadyInUseEmail() {
        return this.getSingleResult(this.dbQueries.GET_ALREADY_IN_USE_EMAIL, 'email')
    }

    async getSupportEmail(value: any) {
        return this.getSingleResult(this.dbQueries.GET_SUPPORT_EMAIL(value), 'email')
    }

}


