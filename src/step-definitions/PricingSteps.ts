import {Then, When} from "@cucumber/cucumber";
import type {CustomWorld} from "../support/world";
import {PricingPage} from "../pages/PricingPage";
import * as path from "node:path";
import {downloadFileViaRequest} from "../utils/DownloadUtils";
import {readPdfText} from "../utils/PdfUtils";
import {expect} from "@playwright/test";
import * as fs from "node:fs";

When(/^I search for an address "(.*)"$/, async function (this: CustomWorld, address: string) {
    await this.po(PricingPage).searchForAddress(address);
});

Then(/^I verify the plans list is (?:still )?displayed$/, async function (this: CustomWorld) {
    await this.po(PricingPage).verifyPlansList();
});

Then(/^I (check|uncheck) the (.+) checkbox$/, async function (
        this: CustomWorld, action: "check" | "uncheck", label: string) {

        const isChecked = action === "check";

        await this.po(PricingPage).setCheckbox(isChecked, label);
    }
);

Then(
    /^I click on the (.+) plan link in the (.+) column$/,
    async function (this: CustomWorld, planName: string, columnName: string) {
        this.setData("selectedPlanName", planName);

        const {newTab, pdfUrl} = await this.po(PricingPage).clickPlanLinkInColumn(planName, columnName);

        this.setData("planDetailsTab", newTab);
        this.setData("planPdfUrl", pdfUrl);
    }
);
Then(/^Verify that the plan details page opens in a new tab$/, async function (this: CustomWorld) {
        const newTab = this.getData("planDetailsTab");
        const planName = this.getData("selectedPlanName");
        await this.po(PricingPage).verifyPlanDetailsOpenedInNewTab(newTab, planName);
    }
);


