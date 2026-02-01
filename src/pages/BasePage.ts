import { expect, Page } from "@playwright/test";

export abstract class BasePage {
    protected constructor(protected page: Page) {}

    async assertUrl(expected: string | RegExp) {
        await expect(this.page).toHaveURL(expected);
    }
}
