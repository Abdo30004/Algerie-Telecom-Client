import axios from "axios";
import { calendar_v3 as calendar, auth } from "@googleapis/calendar";
import credentials from "../secrets/credentials.json";
import crypto from "crypto";
import { formatApiDate } from "./functions";
/*
https://mobile-pre.at.dz/api/list_fact_bimestres
https://mobile-pre.at.dz/api/list_fact_dahabia
https://mobile-pre.at.dz/api/list_adsl_dahabia
https://mobile-pre.at.dz/api/list_fact_impaye
https://mobile-pre.at.dz/api/list_slide
https://mobile-pre.at.dz/api/mesBonus
https://mobile-pre.at.dz/api/getOffre
*/
export class AlgerieTelecomClient {
  private token: string | null = null;
  private static readonly eventKey = "internetends";

  private calendar = new calendar.Calendar({
    auth: new auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    }),
  });

  private api = axios.create({
    baseURL: "https://mobile-pre.at.dz/api",
  });

  constructor(
    private phone: string,
    private password: string,
    private calendarId: string
  ) {}

  public async login(): Promise<boolean> {
    const response = await this.api
      .post("/auth/login", {
        nd: this.phone,
        password: this.password,
      })
      .catch(() => null);

    if (!response) return false;

    this.token = response.data.meta_data.original.token || null;

    return Boolean(this.token);
  }

  async getProfile(): Promise<any> {
    const response = await this.api
      .get("/compte_android", {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .catch(() => null);

    if (!response) return null;

    return response.data;
  }

  async existsInternetEvent(date: Date) {
    const response = await this.calendar.events.list({
      calendarId: this.calendarId,
    });
    const formatedDate = date.toISOString().split("T")[0];
    if (!response.data.items) return null;

    response.data.items = response.data.items.filter(
      (event) =>
        event.start?.date === formatedDate &&
        event.id?.includes(AlgerieTelecomClient.eventKey)
    );

    return response.data.items.at(0) || null;
  }

  async createInternetExpiryEvent(date: Date) {
    const formatedDate = date.toISOString().split("T")[0];

    const existsEvent = await this.existsInternetEvent(date);

    if (existsEvent) {
      console.log("Event already exists");
      return existsEvent;
    }

    const randomId = crypto.randomBytes(64).toString("hex");

    const event: calendar.Schema$Event = {
      summary: "Internet Expiry Date",
      description: "Your internet subscription will expire on this date",
      etag: formatedDate,
      start: {
        date: formatedDate,
      },
      end: {
        date: formatedDate,
      },
      id: `${AlgerieTelecomClient.eventKey}${randomId}`,
      reminders: {
        overrides: [
          {
            method: "popup",
            minutes: 60 * 24,
          },
        ],
      },
    };

    const response = await this.calendar.events.insert({
      calendarId: this.calendarId,
      requestBody: event,
    });

    return response.data;
  }

  async scheduleInternetExpiry() {
    const profile = await this.getProfile();

    console.log(profile);

    if (!profile) {
      console.error("Failed to get profile");
      return;
    }

    const experyDate = new Date(formatApiDate(profile.dateexp));

    const event = await this.createInternetExpiryEvent(experyDate);

    console.log(`The expiry date for ${profile.nd} is ${experyDate}\n`);
    console.log(`Event created: ${event.htmlLink}`);
  }
}
