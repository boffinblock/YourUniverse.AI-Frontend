/**
 * High-level export utilities for entities (Characters, Lorebooks, Personas)
 */
import { injectPngTextChunk } from "./png-metadata";

/**
 * Exports data to a PNG file with embedded metadata
 * @param data - The entity data to embed (will be JSON stringified)
 * @param fileName - Base name for the file
 * @param imageUrl - Optional image URL to fetch
 * @param defaultImageUrl - Fallback image if imageUrl fails or is missing
 */
export async function exportToPng(
    data: any,
    fileName: string,
    imageUrl?: string,
    defaultImageUrl: string = "/logo1.png"
): Promise<void> {
    try {
        let response;

        // 1. Try to fetch the provided imageUrl
        if (imageUrl) {
            try {
                response = await fetch(imageUrl);
            } catch (fetchError) {
                console.warn("Failed to fetch primary image, falling back to default:", fetchError);
            }
        }

        // 2. If fetch failed or no imageUrl, use defaultImageUrl
        if (!response || !response.ok) {
            response = await fetch(defaultImageUrl);
            if (!response.ok) throw new Error("Failed to fetch even the default image");
        }

        const blob = await response.blob();

        // 2. Convert to PNG if it's not already
        let pngBlob: Blob = blob;
        if (blob.type !== "image/png") {
            pngBlob = await convertToPng(blob);
        }

        // 3. Read as ArrayBuffer and inject metadata
        const arrayBuffer = await pngBlob.arrayBuffer();
        const jsonString = JSON.stringify(data);

        // Use 'chara' as the key for metadata (consistent with SillyTavern/V2)
        const enrichedBuffer = injectPngTextChunk(arrayBuffer, "chara", jsonString);

        // 4. Trigger download
        const finalBlob = new Blob([enrichedBuffer], { type: "image/png" });
        const url = URL.createObjectURL(finalBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error("PNG conversion/export failed:", error);
        throw error;
    }
}

/**
 * Helper to convert any image blob to PNG via Canvas
 */
async function convertToPng(blob: Blob): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Could not get canvas context"));
                return;
            }
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((result) => {
                if (result) resolve(result);
                else reject(new Error("Canvas toBlob failed"));
            }, "image/png");
        };
        img.onerror = () => reject(new Error("Failed to load image for conversion"));
        img.src = URL.createObjectURL(blob);
    });
}
