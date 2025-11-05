declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string,
            HASH_PASSWORD_SECRET: string,
        }
    }
}