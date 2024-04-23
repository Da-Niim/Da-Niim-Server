import { registerAs } from "@nestjs/config";

export default registerAs("s3Config", () => ({
    region: process.env.AWS_REGION,
    accessKey: process.env.AWS_S3_ACCESS_KEY,
    secretKey: process.env.AWS_S3_SECRET_ACCESS_KEY, 
}))