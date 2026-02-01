import {Then, When} from "@cucumber/cucumber";
import type {CustomWorld} from "../support/world";
import {PricingPage} from "../pages/PricingPage";
import {expect} from "@playwright/test";
import logger from "../logger/logger";

When(/^I search for an address "(.*)"$/, async function (this: CustomWorld, address: string) {
    logger.info(`Searching for address: "${address}"`);
    await this.po(PricingPage).searchForAddress(address);
    logger.info(`Address search completed`);
});

Then(/^I verify the plans list is (?:still )?displayed$/, async function (this: CustomWorld) {
    logger.info(`Verifying plans list is displayed`);
    await this.po(PricingPage).verifyPlansList();
    logger.info(`Plans list verified`);
});

Then(
    /^I (check|uncheck) the (.+) checkbox$/,
    async function (this: CustomWorld, action: "check" | "uncheck", label: string) {
        const isChecked = action === "check";
        logger.info(`${action.toUpperCase()} checkbox: "${label}"`);

        await this.po(PricingPage).setCheckbox(isChecked, label);

        logger.info(`Checkbox updated: "${label}" -> ${isChecked ? "checked" : "unchecked"}`);
    }
);

Then(
    /^I click on the (.+) plan link in the (.+) column$/,
    async function (this: CustomWorld, planName: string, columnName: string) {
        logger.info(`Clicking plan link: "${planName}" in column: "${columnName}"`);

        this.setData("selectedPlanName", planName);

        const {newTab, pdfUrl} =
            await this.po(PricingPage).clickPlanLinkInColumn(planName, columnName);

        this.setData("planDetailsTab", newTab);
        this.setData("planPdfUrl", pdfUrl);

        logger.info(`Plan details opened in new tab for: "${planName}"`);
        logger.info(`Captured PDF URL: ${pdfUrl}`);
    }
);

Then(/^Verify that the plan details page opens in a new tab$/, async function (this: CustomWorld) {
    const newTab = this.getData("planDetailsTab");
    const planName = this.getData("selectedPlanName");

    logger.info(`Verifying plan details opened in new tab for: "${planName}"`);

    await this.po(PricingPage).verifyPlanDetailsOpenedInNewTab(newTab, planName);

    logger.info(`Verified new tab opened correctly for: "${planName}"`);
});
