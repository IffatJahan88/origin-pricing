import * as fs from "fs";

import pdfParse from "pdf-parse";

export async function readPdfText(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);

  return String(data?.text ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
