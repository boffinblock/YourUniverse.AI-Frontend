/**
 * Utility for PNG metadata manipulation
 * Specifically for injecting tEXt chunks into PNG files
 */

/**
 * Injects a tEXt chunk into a PNG buffer
 * @param buffer - The original PNG buffer
 * @param key - The metadata key (e.g., 'chara')
 * @param value - The metadata value (e.g., JSON string)
 * @returns A new buffer with the injected chunk
 */
export function injectPngTextChunk(buffer: ArrayBuffer, key: string, value: string): ArrayBuffer {
    const view = new DataView(buffer);

    // Check PNG signature
    if (view.getUint32(0) !== 0x89504e47 || view.getUint32(4) !== 0x0d0a1a0a) {
        throw new Error("Invalid PNG signature");
    }

    // Create the tEXt chunk data: key + null terminator + value
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const valueData = encoder.encode(value);
    const chunkData = new Uint8Array(keyData.length + 1 + valueData.length);
    chunkData.set(keyData);
    chunkData[keyData.length] = 0; // Null separator
    chunkData.set(valueData, keyData.length + 1);

    // Chunk header (length + type)
    const chunkFullLength = 4 + 4 + chunkData.length + 4;
    const newBuffer = new ArrayBuffer(buffer.byteLength + chunkFullLength);
    const newView = new DataView(newBuffer);
    const newArray = new Uint8Array(newBuffer);
    const oldArray = new Uint8Array(buffer);

    // Find IEND chunk to insert before it
    let pos = 8; // Skip signature
    let iendPos = -1;

    while (pos < buffer.byteLength) {
        const length = view.getUint32(pos);
        const type = view.getUint32(pos + 4);

        if (type === 0x49454e44) { // IEND
            iendPos = pos;
            break;
        }
        pos += length + 12; // Length + Type + Data + CRC
    }

    if (iendPos === -1) {
        // Fallback: append before the end if IEND not found (unlikely for valid PNG)
        iendPos = buffer.byteLength;
    }

    // Copy everything up to IEND
    newArray.set(oldArray.slice(0, iendPos), 0);

    // Insert new chunk at iendPos
    let currentPos = iendPos;

    // 1. Length
    newView.setUint32(currentPos, chunkData.length);
    currentPos += 4;

    // 2. Type (tEXt)
    newView.setUint32(currentPos, 0x74455874);
    currentPos += 4;

    // 3. Data
    newArray.set(chunkData, currentPos);
    currentPos += chunkData.length;

    // 4. CRC
    const crc = calculateCrc(newArray.slice(iendPos + 4, currentPos));
    newView.setUint32(currentPos, crc);
    currentPos += 4;

    // Copy the rest (IEND and after)
    newArray.set(oldArray.slice(iendPos), currentPos);

    return newBuffer;
}

/**
 * Character card chunk keys in order of preference (V3 > V2 > V1)
 */
export const CHARACTER_CARD_KEYS = ['ccv3', 'chara_card_v2', 'chara'] as const;

/**
 * Extracts a tEXt chunk from a PNG buffer by key
 * @param buffer - The PNG buffer
 * @param key - The metadata key to look for (or use CHARACTER_CARD_KEYS for auto-detect)
 * @returns The metadata value string or null if not found
 */
export function extractPngMetadata(buffer: ArrayBuffer, key: string): string | null {
    const view = new DataView(buffer);

    // Check PNG signature
    if (view.getUint32(0) !== 0x89504e47 || view.getUint32(4) !== 0x0d0a1a0a) {
        throw new Error("Invalid PNG signature");
    }

    let pos = 8; // Skip signature
    const decoder = new TextDecoder();

    while (pos < buffer.byteLength) {
        const length = view.getUint32(pos);
        const type = view.getUint32(pos + 4);

        if (type === 0x74455874) { // tEXt
            const data = new Uint8Array(buffer, pos + 8, length);
            // tEXt format: key + null + value
            let nullPos = -1;
            for (let i = 0; i < data.length; i++) {
                if (data[i] === 0) {
                    nullPos = i;
                    break;
                }
            }

            if (nullPos !== -1) {
                const chunkKey = decoder.decode(data.slice(0, nullPos));
                if (chunkKey === key) {
                    return decoder.decode(data.slice(nullPos + 1));
                }
            }
        }

        if (type === 0x49454e44) break; // IEND
        pos += length + 12; // Length + Type + Data + CRC
    }

    return null;
}

/**
 * Extracts character card metadata from PNG (tries V3, V2, V1 keys)
 * @param buffer - The PNG buffer
 * @returns The metadata value string or null if no character card found
 */
export function extractCharacterCardMetadata(buffer: ArrayBuffer): string | null {
    for (const k of CHARACTER_CARD_KEYS) {
        const value = extractPngMetadata(buffer, k);
        if (value) return value;
    }
    return null;
}

/**
 * Simple CRC32 implementation for PNG chunks
 */
function calculateCrc(data: Uint8Array): number {
    let crc = 0xffffffff;
    for (let i = 0; i < data.length; i++) {
        crc ^= data[i];
        for (let j = 0; j < 8; j++) {
            crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
        }
    }
    return (crc ^ 0xffffffff) >>> 0;
}
