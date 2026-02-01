import {PageName} from "./PageNameEnums";

export interface NavigablePage {
    goto(baseUrl: string): Promise<void>;
}

type PageCtor = new (page: any) => NavigablePage;

function normalize(value: string) {
    return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function assertValidPageName(pageText: string): asserts pageText is PageName {
    const valid = Object.values(PageName).map(normalize);
    if (!valid.includes(normalize(pageText))) {
        throw new Error(
            `Unknown page "${pageText}". Valid pages: ${Object.values(PageName).join(", ")}`
        );
    }
}

function toPascalCase(text: string) {
    return normalize(text)
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join("");
}

export async function getPage(pageTextFromFeature: string, pwPage: any): Promise<NavigablePage> {
    assertValidPageName(pageTextFromFeature);

    // "pricing" -> "PricingPage"
    const pageClassName = `${toPascalCase(pageTextFromFeature)}Page`;

    try {
        const mod: any = await import(`../pages/${pageClassName}`);

        const PageClass = mod[pageClassName] as PageCtor | undefined;

        if (!PageClass) {
            throw new Error(
                `Loaded "./${pageClassName}" but could not find named export "${pageClassName}". ` +
                `Exports found: ${Object.keys(mod).join(", ")}`
            );
        }

        return new PageClass(pwPage);
    } catch (err: any) {
        throw new Error(
            `Couldn't load "${pageClassName}.ts". ` +
            `Make sure  "${pageTextFromFeature}" is a valid (enum) in src/pages/PageName.ts, and src/pages/${pageClassName}.ts exists and exports "export class ${pageClassName}". ` +
            `Original error: ${err?.message ?? err}`
        );
    }
}
