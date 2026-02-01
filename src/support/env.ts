import * as dotenv from "dotenv";
dotenv.config();

export const env = {
    baseUrl: process.env.BASE_URL || "",
    headless: (process.env.HEADLESS ?? "true").toLowerCase() === "true",
    browser: (process.env.BROWSER ?? "chromium").trim().toLowerCase(),
};
