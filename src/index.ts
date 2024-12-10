import path from "path";
import { config as dotenvConfig } from "dotenv";
import { AlgerieTelecomClient } from "./util/algerietelecom";
import { formatApiDate } from "./util/functions";
import fs from "fs";
dotenvConfig({
  path: path.resolve(__dirname, "../.env"),
});


async function main() {
  const { PHONE, PASSWORD, CALENDAR_ID } = process.env;

  if (!PHONE || !PASSWORD || !CALENDAR_ID) {
    throw new Error(
      "Please provide your phone number, password and calendar id in the .env file"
    );
  }

  const client = new AlgerieTelecomClient(PHONE, PASSWORD, CALENDAR_ID);

  await client.login();

  await client.scheduleInternetExpiry();
}

main().catch(console.error);
