import * as fs from "fs";
import * as path from "path";

export function ensureDir(dirPath: string) {
    fs.mkdirSync(dirPath, {recursive: true});
}

export async function downloadFileViaRequest(
    request: any,              // APIRequestContext (type optional to avoid import issues)
    url: string,
    downloadDir: string,
    fileName: string
): Promise<string> {
    ensureDir(downloadDir);

    const response = await request.get(url);
    if (!response.ok()) {
        throw new Error(`Failed to download file. Status: ${response.status()} ${response.statusText()}`);
    }

    const buffer = await response.body();
    const filePath = path.join(downloadDir, fileName);

    fs.writeFileSync(filePath, buffer);
    return filePath;
}
