declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PUSHER_APPID: string;
      PUSHER_KEY: string;
      PUSHER_SECRET: string;
      DATABASE_URL: string;
      ACCESS_TOKEN_SECRET: string;
    }
  }
}
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
