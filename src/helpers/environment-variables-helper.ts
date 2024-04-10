const envVars: Record<string, any> = {
    baseUrl: process.env.BASE_URL,
    baseApiUrl: process.env.BASE_API_URL,
    basicAuthLogin: process.env.BASIC_AUTH_LOGIN,
    basicAuthPassword: process.env.BASIC_AUTH_PASSWORD,
    mailosaurApiKey: process.env.MAILOSAUR_API_KEY,
    mailosaurServerId: process.env.MAILOSAUR_SERVER_ID,
    mailosaurServerDomain: process.env.MAILOSAUR_SERVER_DOMAIN,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
}
export { envVars }
