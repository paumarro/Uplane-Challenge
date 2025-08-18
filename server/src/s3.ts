import {
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.S3_ENDPOINT || "http://localhost:9000";              // internal (container-to-MinIO)
const publicEndpoint = process.env.S3_PUBLIC_ENDPOINT || "http://localhost:9000"; // browser-accessible
const region = process.env.S3_REGION || "us-east-1";
const accessKeyId = process.env.S3_ACCESS_KEY || "minioadmin";
const secretAccessKey = process.env.S3_SECRET_KEY || "minioadmin";
export const bucket = process.env.S3_BUCKET || "images";
const forcePathStyle = (process.env.S3_FORCE_PATH_STYLE || "true") === "true";

// Internal client for server->MinIO operations
export const s3 = new S3Client({
  endpoint,
  region,
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle,
});

// Public client used only to presign URLs for the exact origin browsers will call
const s3Public = new S3Client({
  endpoint: publicEndpoint,
  region,
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle,
});

// Middleware to enforce UNSIGNED-PAYLOAD and path-style across both clients
for (const client of [s3, s3Public]) {
  client.middlewareStack.add(
    (next) => async (args) => {
      const req: any = args.request;
      if (req && typeof req === "object") {
        if (!req.headers) req.headers = {};
        // Help MinIO avoid payload hash mismatches on GET
        req.headers["x-amz-content-sha256"] = "UNSIGNED-PAYLOAD";
        // Ensure path-style: /bucket/key
        if (typeof req.path === "string") {
          if (req.path && !req.path.startsWith(`/${bucket}/`)) {
            if (req.path === "/" || req.path === `/${bucket}`) {
              req.path = `/${bucket}/`;
            } else if (!req.path.startsWith(`/${bucket}`)) {
              req.path = `/${bucket}${req.path.startsWith("/") ? "" : "/"}${req.path.replace(/^\//, "")}`;
            }
          }
        }
      }
      return next(args);
    },
    { step: "build" }
  );
}

export async function ensureBucket() {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }));
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: bucket }));
  }
}

export async function putObject(key: string, body: Buffer, contentType: string) {
  await s3.send(
    new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType })
  );
}

export async function deleteObject(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export async function getPresignedUrl(key: string, expiresInSec: number) {
  // Presign using the public client so the signed origin matches the browser’s origin
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  const url = await getSignedUrl(s3Public, cmd, { expiresIn: expiresInSec });

  // Ensure URL path is /bucket/key (path-style) for consistency
  const u = new URL(url);
  u.pathname = `/${bucket}/${key}`;
  return u.toString();
}
