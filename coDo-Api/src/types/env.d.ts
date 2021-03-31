declare namespace NodeJS {
  export interface ProcessEnv {
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    JWT_SECRET: string;
    POSGRESS_DB_USERNAME: string;
    POSGRESS_DB_PASSWORD: string;
  }
}
