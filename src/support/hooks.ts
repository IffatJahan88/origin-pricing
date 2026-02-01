import {Before, After, setDefaultTimeout} from '@cucumber/cucumber';
import {selectors} from 'playwright';
import {CustomWorld} from './world';
import * as fs from "fs";
import * as path from "path";

selectors.setTestIdAttribute('data-id');
setDefaultTimeout(10 * 1000);

Before(async function (this: CustomWorld) {
    await this.init();
    const downloadDir = path.resolve(process.cwd(), "downloads");
    if (fs.existsSync(downloadDir)) fs.rmSync(downloadDir, {recursive: true, force: true});
});

After(async function (this: CustomWorld, scenario) {

    if (scenario.result?.status === 'FAILED') {
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
    }

    await this.close();
});
