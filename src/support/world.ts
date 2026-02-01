import {setWorldConstructor, World, IWorldOptions} from "@cucumber/cucumber";
import {Browser, BrowserContext, Page, chromium, firefox, webkit} from "playwright";
import {env} from "./env";

type PageObjectCtor<T> = new (page: Page) => T;

export class CustomWorld extends World {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;

    baseUrl = env.baseUrl;
    scenarioData: Record<string, any> = {};

    // ✅ generic cache (per scenario)
    private poCache = new Map<Function, any>();

    constructor(options: IWorldOptions) {
        super(options);
    }

    async init() {
        const browserName = env.browser;
        const headless = env.headless;

        const browserType =
            browserName === "firefox" ? firefox :
                browserName === "webkit" ? webkit :
                    chromium;

        this.browser = await browserType.launch({headless});

        this.context = await this.browser.newContext({
            viewport: {width: 1920, height: 1080},
            ignoreHTTPSErrors: true,
        });

        this.page = await this.context.newPage();

        // ✅ reset per scenario
        this.poCache.clear();
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

    // ✅ The only thing you need forever:
    po<T>(Ctor: PageObjectCtor<T>): T {
        const cached = this.poCache.get(Ctor);
        if (cached) return cached as T;

        const instance = new Ctor(this.page);
        this.poCache.set(Ctor, instance);
        return instance;
    }
}

setWorldConstructor(CustomWorld);
