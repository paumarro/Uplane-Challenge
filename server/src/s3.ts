import {
  S3Client,
  HeadBucketCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.S3_ENDPOINT!; // e.g., https://<ACCOUNT_ID>.r2.cloudflarestorage.com
const region = process.env.S3_REGION || "us-east-1";
const accessKeyId = process.env.S3_ACCESS_KEY_ID!; // note the _ID suffix
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY!; // note the _ACCESS_KEY suffix
export const bucket = process.env.S3_BUCKET!;
const forcePathStyle = (process.env.S3_FORCE_PATH_STYLE || "false") === "true"; // false for R2

// Single client is enough; presigned URLs work against the same endpoint
export const s3 = new S3Client({
  endpoint,
  region,
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle
});

// R2 buckets must be created in the dashboard; just check existence
export async function ensureBucket() {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }));
  } catch (e) {
    // Do not attempt CreateBucket on R2. If this fails, ensure the bucket exists
    // and the token has permission. You can log a warning:
    console.warn("HeadBucket failed. Ensure the R2 bucket exists and permissions are correct.", e);
  }
}

export async function putObject(key: string, body: Buffer, contentType: string) {
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }));
}

export async function deleteObject(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export async function getPresignedUrl(key: string, expiresInSec: number) {
  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: expiresInSec }
  );
  return url;
}
