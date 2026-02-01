import {Given, Then, When} from "@cucumber/cucumber";
import type {CustomWorld} from "../support/world";
import {getPage} from "../utils/PageUtils";
import {readPdfText} from "../utils/PdfUtils";
import {expect} from "@playwright/test";
import path from "node:path";
import {downloadFileViaRequest} from "../utils/DownloadUtils";
import fs from "node:fs";


Given(/^I am on the (.*) page$/, async function (this: CustomWorld, pageName: string) {
    const pageObject = await getPage(pageName, this.page);

    console.log("Resolved Page Object:", pageObject.constructor.name);
    console.log("Base URL from env:", this.baseUrl);
    await pageObject.goto(this.baseUrl);
});

Then(
    /^I verify that the PDF content confirms it is a (.*) plan$/,
    async function (this: CustomWorld, planType: String) {
        const pdfPath = this.getData("downloadedPdfPath");
        if (!pdfPath) throw new Error("No downloadedPdfPath found in World");
        const text = await readPdfText(pdfPath);
        expect(text).toContain(planType.toLowerCase());
    }
);

Then(
    /^Download the PDF to the local file system$/,
    async function (this: CustomWorld) {
        const pdfUrl = this.getData("planPdfUrl");
        const planName = this.getData("selectedPlanName") ?? "plan";

        if (!pdfUrl) throw new Error("No planPdfUrl found in World");

        // Save in origin-pricing/downloads (assuming you run from origin-pricing root)
        const downloadDir = path.resolve(process.cwd(), "downloads");

        const safeName = planName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const fileName = `${safeName}.pdf`;

        const filePath = await downloadFileViaRequest(this.page.request, pdfUrl, downloadDir, fileName);

        // Assertions
        expect(fs.existsSync(filePath)).toBeTruthy();
        expect(fs.statSync(filePath).size).toBeGreaterThan(0);

        this.setData("downloadedPdfPath", filePath);
        console.log("✅ PDF downloaded to:", filePath);
    }
);
