import { AlgerieTelecomClient } from "./util/algerietelecom";
import "dotenv/config";
import { formatApiDate } from "./util/functions";

async function main() {
  const { PHONE, PASSWORD, CALENDAR_ID } = process.env;

  if (!PHONE || !PASSWORD || !CALENDAR_ID) {
    throw new Error(
      "Please provide your phone number, password and calendar id in the .env file"
    );
  }

  const client = new AlgerieTelecomClient(PHONE, PASSWORD, CALENDAR_ID);

  await client.login();

  const profile = await client.getProfile();

  const experyDate = formatApiDate(profile.dateexp);

  const event = await client.createEvent(experyDate);

  console.log(`Event created successfully ${event.htmlLink}`);
}

main().catch(console.error);
