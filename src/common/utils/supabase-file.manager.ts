import { Injectable } from "@nestjs/common"
import { createClient } from "@supabase/supabase-js"
import { v4 as uuid } from "uuid"
import { FileDownloadException } from "../exceptions/file-download.exception"
import { FileManager } from "./file.manager"

@Injectable()
export class SupabaseFileUtils implements FileManager {
  private readonly supabaseUrl = "https://bkaladzoyjtogjraspqj.supabase.co"
  private readonly supabaseKey = process.env.SUPABASE_KEY
  private readonly supabase = createClient(this.supabaseUrl, this.supabaseKey)

  async save(file: Express.Multer.File, destDir: string): Promise<string> {
    const storedFileName = this.createStoredFileName(file.originalname)
    const { data, error } = await this.supabase.storage
      .from("photo")
      .upload(`${destDir}/${storedFileName}`, file.buffer, {
        contentType: file.mimetype,
        cacheControl: "3600",
        upsert: false,
      })

    console.log("upload error: ", error)
    return storedFileName
  }

  async getPublicUrl(filename: string, srcDir: string): Promise<string> {
    const { data } = this.supabase.storage
      .from("photo")
      .getPublicUrl(`${srcDir}/${filename}`)

    return data.publicUrl
  }

  async load(filename: string, srcDir: string): Promise<Blob> {
    const { data, error } = await this.supabase.storage
      .from("photo")
      .download(`${srcDir}/${filename}`)

    if (error) throw new FileDownloadException()

    return data
  }

  createStoredFileName(originalname: string): string {
    const ext = originalname.split(".")[1]

    return `${uuid()}.${ext}`
  }
}
