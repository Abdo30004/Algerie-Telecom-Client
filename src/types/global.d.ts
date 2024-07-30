declare namespace NodeJS {
  interface ProcessEnv {
    PHONE: string;
    PASSWORD: string;
    CALENDAR_ID: string;
    [key: string]: string | undefined;
  }
}
