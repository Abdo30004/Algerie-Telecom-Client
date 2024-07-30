# Algerie Telecom API Client (Unofficial)

This is an unofficial API client for Algerie Telecom services. It is a Typescript library that provides a simple client class to interact with the API and perform various operations such as checking the subscription status, unpaid bills, and more.

It also offers a way to set reminders for subscription renewals using google calendar.

## Configuration

## .env file

- PHONE - Your phone number
- PASSWORD - Your password (client space password)
- CALENDAR_ID - Google calendar ID

## credentials.json

You need to create a google cloud project and enable the google calendar API. Then create a service account and download the credentials.json file.put it in the secrets folder (
./src/secrets/credentials.json
) .

## Run

```bash
npm install
npm run build
```
