export interface FileManager {
    getPublicUrl(filename: string, pathDir: string): string
    load(filename: string, srcDir: string): Promise<Blob>
    save(file: Express.Multer.File, destDir: string): Promise<string>
    createStoredFileName(originalname: string): string
    parseExt(filename: string): string
    getPresignedUrl(filename: string): Promise<{presignedUrl: string, key: string}>
}