export class ImageEncoder {
    static async encodeToBase64String(fileBuffer: Buffer): Promise<string> {
        return fileBuffer.toString("base64")
    }
}