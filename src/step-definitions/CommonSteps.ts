import {Given, Then} from "@cucumber/cucumber";
import type {CustomWorld} from "../support/world";
import {getPage} from "../utils/PageUtils";
import {readPdfText} from "../utils/PdfUtils";
import {expect} from "@playwright/test";
import path from "node:path";
import {downloadFileViaRequest} from "../utils/DownloadUtils";
import fs from "node:fs";
import logger from "../logger/logger";

Given(/^I am on the (.*) page$/, async function (this: CustomWorld, pageName: string) {
    logger.info(`Resolving page object for: ${pageName}`);

    const pageObject = await getPage(pageName, this.page);

    logger.info(`Resolved Page Object: ${pageObject.constructor.name}`);
    logger.info(`Base URL: ${this.baseUrl}`);

    await pageObject.goto(this.baseUrl);

    logger.info(`Navigated to: ${this.page.url()}`);
});

Then(
    /^I verify that the PDF content confirms it is a (.*) plan$/,
    async function (this: CustomWorld, planType: string) {
        const pdfPath = this.getData("downloadedPdfPath");
        if (!pdfPath) {
            logger.error("No downloadedPdfPath found in World");
            throw new Error("No downloadedPdfPath found in World");
        }

        logger.info(`Reading PDF content from: ${pdfPath}`);

        const text = await readPdfText(pdfPath);

        logger.info(`Asserting PDF contains plan type: ${planType.toLowerCase()}`);
        expect(text).toContain(planType.toLowerCase());
    }
);

Then(
    /^Download the PDF to the local file system$/,
    async function (this: CustomWorld) {
        const pdfUrl = this.getData("planPdfUrl");
        const planName = this.getData("selectedPlanName") ?? "plan";

        if (!pdfUrl) {
            logger.error("No planPdfUrl found in World");
            throw new Error("No planPdfUrl found in World");
        }

        const downloadDir = path.resolve(process.cwd(), "downloads");

        const safeName = String(planName)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const fileName = `${safeName}.pdf`;

        logger.info(`Downloading PDF via request...`);
        logger.info(`PDF URL: ${pdfUrl}`);
        logger.info(`Download dir: ${downloadDir}`);
        logger.info(`File name: ${fileName}`);

        const filePath = await downloadFileViaRequest(
            this.page.request,
            pdfUrl,
            downloadDir,
            fileName
        );

        const exists = fs.existsSync(filePath);
        const size = exists ? fs.statSync(filePath).size : 0;

        logger.info(`Download complete. Path: ${filePath}`);
        logger.info(`File exists: ${exists}, size: ${size} bytes`);

        expect(exists).toBeTruthy();
        expect(size).toBeGreaterThan(0);

        this.setData("downloadedPdfPath", filePath);
    }
);
