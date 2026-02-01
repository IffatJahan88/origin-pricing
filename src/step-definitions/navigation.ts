import {Given} from "@cucumber/cucumber";
import type {CustomWorld} from "../support/world";

Given(/^I am on the (.*) page$/, {timeout: 30000}, async function (this: CustomWorld, pageName: string) {

    await this.page.goto("https://www.originenergy.com.au/pricing.html");
    await this.page.waitForTimeout(5000)


    console.log(this.page.url())
    console.log(await this.page.title())

});
