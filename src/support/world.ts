import {setWorldConstructor, World, IWorldOptions} from '@cucumber/cucumber';
import {Browser, BrowserContext, Page, chromium, firefox, webkit} from 'playwright';

export class CustomWorld extends World {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;
    scenarioData: Record<string, any> = {};

    constructor(options: IWorldOptions) {
        super(options);
    }

    async init() {

        const browserName = process.env.BROWSER ? process.env.BROWSER : 'chromium'
        // console.log("⁠ "Browser name: ${browserName} ⁠);

        switch (browserName.trim().toLowerCase()) {

            case 'chromium':
            case 'chrome':
                this.browser = await chromium.launch({
                    headless: true,
                    // args: ['--start-maximized'],
                });
                break;

            case 'firefox':
                this.browser = await firefox.launch({
                    headless: true,
                    // args: ['--width=1920', '--height=1080']
                });
                break;
            case 'webkit':
                this.browser = await webkit.launch({
                    headless: true,
                    // args: ['--start-maximized'],
                });
                break;
            default:
                throw new Error('Unsupported browser!');
        }
        this.context = await this.browser.newContext({viewport: {width: 1920, height: 1080}, ignoreHTTPSErrors: true},);
        this.page = await this.context.newPage();
    }

    async close() {
        await this.page?.close();
        await this.context?.close();
        await this.browser?.close();
    }

    setData(key: string, value: any) {
        this.scenarioData[key] = value;
    }

    getData(key: string) {
        return this.scenarioData[key];
    }
}

setWorldConstructor(CustomWorld);