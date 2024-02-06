export interface FileUtils {
    getPublicUrl(filename: string, srcDir: string): Promise<string>
    load(filename: string, srcDir: string): Promise<Blob>
    save(file: Express.Multer.File, destDir: string): Promise<string>
    createStoredFileName(originalname: string): string
}