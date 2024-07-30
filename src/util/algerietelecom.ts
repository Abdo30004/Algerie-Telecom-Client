import axios from "axios";
import { calendar_v3 as calendar, auth } from "@googleapis/calendar";
import credentials from "../secrets/credentials.json";

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

  async createEvent(date: Date) {
    const formatedDate = date.toISOString().split("T")[0];

    const event: calendar.Schema$Event = {
      summary: "Internet Expiry Date",
      description: "Your internet subscription will expire on this date",
      start: {
        date: formatedDate,
      },
      end: {
        date: formatedDate,
      },
    };

    const response = await this.calendar.events.insert({
      calendarId: this.calendarId,
      requestBody: event,
    });

    return response.data;
  }
}
