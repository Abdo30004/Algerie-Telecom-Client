import path from "path";
import { config as dotenvConfig } from "dotenv";
import { AlgerieTelecomClient } from "./util/algerietelecom";
import Schdule from "node-schedule";

dotenvConfig({
  path: path.resolve(__dirname, "../.env"),
});

async function main() {
  const { PHONE, PASSWORD, CALENDAR_ID } = process.env; // Get the environment variables (phone number, password and google calendar id)

  if (!PHONE || !PASSWORD || !CALENDAR_ID) {
    throw new Error(
      "Please provide your phone number, password and calendar id in the .env file"
    );
  }

  const client = new AlgerieTelecomClient(PHONE, PASSWORD, CALENDAR_ID); // Create a new instance of the client

  const logged = await client.login(); // Login to the algerie telecom account

  if (!logged) {
    throw new Error("Failed to login");
  }

  console.log("Logged in successfully");
  await client.scheduleInternetExpiry(); // Schedule the internet expiry event

  //schedule the internet expiry event to run every day at 00:00
  Schdule.scheduleJob("0 0 * * *", async () => {
    await client.login(); // Make sure the client is logged in (refresh the token)

    await client.scheduleInternetExpiry(); // Schedule the internet expiry event
  });
}

main().catch(console.error);
