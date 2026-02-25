import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

/**
 * Extracts plain text from a PDF or DOCX file buffer
 * @param {Express.Multer.File} file
 * @returns {Promise<string>}
 */
export const extractText = async (file) => {
  if (file.mimetype === "application/pdf") {
    const pdf = await pdfjsLib
      .getDocument({ data: new Uint8Array(file.buffer) })
      .promise;

    const pages = await Promise.all(
      Array.from({ length: pdf.numPages }, async (_, i) => {
        const page = await pdf.getPage(i + 1);
        const content = await page.getTextContent();
        return content.items.map((item) => item.str).join(" ");
      })
    );

    return pages.join("\n").trim();
  }

  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value.trim();
  }

  throw new Error("Unsupported file type. Please upload a PDF or DOCX.");
};
