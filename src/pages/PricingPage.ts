import { expect, type Locator, type Page } from "@playwright/test";

import { BasePage } from "./BasePage";

export class PricingPage extends BasePage {
  private readonly aboutEnergyPricesText: Locator;
  private readonly addressInputBox: Locator;
  private readonly addressOption: Locator;
  private readonly plansTable: Locator;
  private readonly electricityCheckbox: Locator;
  private readonly gasCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    this.aboutEnergyPricesText = page.getByText("About energy prices");
    this.addressInputBox = page.getByRole("combobox", { name: "Your address" });
    this.addressOption = page.getByRole("option");
    this.plansTable = page.getByTestId("plan-info-table-desktop");
    this.electricityCheckbox = page.getByTestId("elc-checkbox-checkbox-base").nth(0);
    this.gasCheckbox = page.getByTestId("gas-checkbox-checkbox-base").nth(0);
  }

  async goto(baseUrl: string) {
    // ✅ ensure baseUrl has protocol and no trailing slash issues
    const normalizedBaseUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
    const expectedUrl = new URL("/pricing.html", normalizedBaseUrl).toString();

    console.log("Navigating to:", expectedUrl);

    await this.page.goto(expectedUrl, { waitUntil: "domcontentloaded" });

    // ✅ More resilient: assert path, not exact full string (redirects can add params)
    await expect(this.page).toHaveURL(/\/pricing\.html/i);

    console.log("Page Title:", await this.page.title());

    await expect(this.aboutEnergyPricesText).toBeVisible();
  }

  async searchForAddress(address: string) {
    await expect(this.addressInputBox).toBeVisible();
    await this.addressInputBox.fill(address);
    const addressSuggested = (await this.addressOption.innerText())
      .replace(/,/g, "")
      .trim()
      .toLowerCase();
    expect(addressSuggested).toBe(address.replace(/,/g, "").trim().toLowerCase());
    await this.addressOption.click();
  }

  async verifyPlansList() {
    await expect(this.plansTable).toBeVisible();
  }

  async setCheckbox(isChecked: boolean, label: string) {
    const checkbox = this.getCheckboxByLabel(label);
    const currentlyChecked = await checkbox.evaluate((el) => el.hasAttribute("fill"));

    if (currentlyChecked === isChecked) {
      await checkbox.scrollIntoViewIfNeeded();
      await checkbox.click();
      expect(currentlyChecked).toBe(isChecked);
    }
  }

  async clickPlanLinkInColumn(
    planName: string,
    columnName: string,
  ): Promise<{ newTab: Page; pdfUrl: string }> {
    await expect(this.plansTable).toBeVisible();

    const normalize = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

    // 1) Find column index from header text
    const headers = this.plansTable.locator("thead tr th");
    const headerCount = await headers.count();

    const targetColumn = normalize(columnName);
    let columnIndex = -1;

    for (let i = 0; i < headerCount; i++) {
      const headerText = normalize(await headers.nth(i).innerText());
      if (headerText === targetColumn) {
        columnIndex = i;
        break;
      }
    }

    if (columnIndex === -1) {
      throw new Error(`Column "${columnName}" not found in plans table`);
    }

    // 2) Find row by plan name (NO tbody in the DOM)
    const rows = this.plansTable.locator('tr[data-id^="row-"]');
    const rowCount = await rows.count();
    await expect(rowCount, "Expected at least 1 plan row").toBeGreaterThan(0);

    const targetPlan = normalize(planName);
    let foundRowIndex = -1;

    for (let i = 0; i < rowCount; i++) {
      const rowText = normalize(await rows.nth(i).innerText());
      if (rowText.includes(targetPlan)) {
        foundRowIndex = i;
        break;
      }
    }

    if (foundRowIndex === -1) {
      throw new Error(`Plan "${planName}" not found in plans table`);
    }

    // 3) Locate link in target cell
    const targetRow = rows.nth(foundRowIndex);
    const cell = targetRow.locator("td").nth(columnIndex);
    const link = cell.locator("a").first();

    await expect(link).toBeVisible();

    // Capture the pdf URL directly from href (best source of truth)
    const pdfUrl = await link.getAttribute("href");
    if (!pdfUrl) throw new Error("Plan link has no href (pdf url missing)");

    // 4) Click and capture new tab opened by target="_blank"
    const [newTab] = await Promise.all([this.page.context().waitForEvent("page"), link.click()]);

    await newTab.waitForLoadState("domcontentloaded");

    return { newTab, pdfUrl };
  }

  async verifyPlanDetailsOpenedInNewTab(newTab: Page, planName: string) {
    if (!newTab) {
      throw new Error("No new tab page was provided (planDetailsTab is missing).");
    }

    await newTab.waitForLoadState("domcontentloaded");

    // ✅ This is the real expectation for your app: a PDF opens in a new tab
    await expect(newTab).toHaveURL(/\.pdf(\?|$)/i);

    // ✅ Optional sanity: correct domain
    await expect(newTab).toHaveURL(/originenergy\.com\.au/i);
  }

  private getCheckboxByLabel(label: string): Locator {
    const normalized = label.trim().toLowerCase();

    if (normalized.includes("electricity")) {
      return this.electricityCheckbox.getByLabel("Electricity", { exact: true });
    }

    if (normalized.includes("gas")) {
      return this.gasCheckbox.getByLabel("Natural gas", { exact: true });
    }

    throw new Error(`Unknown checkbox label: "${label}"`);
  }
}
