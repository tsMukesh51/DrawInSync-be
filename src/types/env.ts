declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string,
            USER_JWT_SECRET: string,
            HASH_PASSWORD_SECRET: string,
        }
    }
}