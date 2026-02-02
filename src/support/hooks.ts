import * as fs from "fs";
import * as path from "path";

import { Before, After, setDefaultTimeout } from "@cucumber/cucumber";
import { selectors } from "playwright";

import logger from "../logger/logger";

import { CustomWorld } from "./world";

selectors.setTestIdAttribute("data-id");
setDefaultTimeout(10 * 1000);

Before(async function (this: CustomWorld, scenario) {
  logger.info(`STARTING SCENARIO: ${scenario.pickle.name}`);

  await this.init();
  logger.info("Browser and context initialised");

  const downloadDir = path.resolve(process.cwd(), "downloads");

  if (fs.existsSync(downloadDir)) {
    fs.rmSync(downloadDir, { recursive: true, force: true });
    logger.info("Cleaned downloads directory");
  } else {
    logger.info("Downloads directory not present, skipping cleanup");
  }
});

After(async function (this: CustomWorld, scenario) {
  const status = scenario.result?.status ?? "UNKNOWN";

  if (status === "FAILED") {
    logger.error(`SCENARIO FAILED: ${scenario.pickle.name}`);

    if (this.page) {
      try {
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, "image/png");
        logger.info("Failure screenshot attached to report");
      } catch (error) {
        logger.error(`Failed to capture screenshot: ${error}`);
      }
    } else {
      logger.warn("No page available for screenshot (browser likely failed to launch)");
    }
  } else {
    logger.info(`SCENARIO PASSED: ${scenario.pickle.name}`);
  }

  try {
    await this.close();
  } catch (error) {
    logger.warn(`Error during cleanup/close: ${error}`);
  }

  logger.info("Browser closed");
});
