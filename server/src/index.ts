import type { Request, Response } from "express";

import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { PrismaClient, ImageStatus } from "@prisma/client";
import { ensureBucket, putObject, getPresignedUrl, deleteObject } from "./s3.js";
import { removeBackground } from "./providers/removebg.js";
import sharp from "sharp";

const prisma = new PrismaClient();
const app = express();
const upload = multer({ limits: { fileSize: 20 * 1024 * 1024 } });

const port = Number(process.env.PORT || 8080);
const presignExpires = Number(process.env.PRESIGNED_URL_EXPIRES || 604800);

// Normalize configured origins (comma-separated, trim + no trailing slash)
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean)
  .map(s => s.replace(/\/+$/, "")); // remove trailing slashes

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server or same-origin requests with no Origin header
      if (!origin) return callback(null, true);
      const normalized = origin.replace(/\/+$/, "");
      if (allowedOrigins.includes(normalized)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: false, // set true only if you use cookies/auth headers across origins
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Explicit preflight for all routes
app.options("*", cors());

app.use(express.json());

async function processImage(fileBuffer: Buffer, originalKey: string, processedKey: string) {
  // Upload original (normalize to PNG)
  const normalized = await sharp(fileBuffer).png().toBuffer();
  await putObject(originalKey, normalized, "image/png");

  // Background removal via provider
  const bgRemoved = await removeBackground(normalized);

  // Horizontal flip (mirror)
  const flipped = await sharp(bgRemoved).flop().png().toBuffer();

  // Upload processed
  await putObject(processedKey, flipped, "image/png");
}

app.post("/api/images", upload.single("image"), async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const mime = req.file.mimetype || "";
    if (!mime.startsWith("image/")) return res.status(400).json({ error: "Invalid file type" });

    const rec = await prisma.image.create({
      data: { status: ImageStatus.PROCESSING, originalKey: "", processedKey: null }
    });
    const id = rec.id;
    const originalKey = `original/${id}.png`;
    const processedKey = `processed/${id}.png`;

    await prisma.image.update({ where: { id }, data: { originalKey } });

    try {
      await processImage(req.file.buffer, originalKey, processedKey);
      await prisma.image.update({ where: { id }, data: { processedKey, status: ImageStatus.DONE } });
      const url = await getPresignedUrl(processedKey, presignExpires);
      return res.json({ id, status: "DONE", url });
    } catch (err: any) {
      console.error(err);
      await prisma.image.update({ where: { id }, data: { status: ImageStatus.ERROR } });
      return res.status(500).json({ id, status: "ERROR", error: err?.message || "Processing failed" });
    }
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message || "Unexpected error" });
  }
});

app.get("/api/images", async (_req: Request, res: Response) => {
  const items = await prisma.image.findMany({ orderBy: { createdAt: "desc" } });
  const out = await Promise.all(
    items.map(async it => ({
      id: it.id,
      status: it.status,
      originalKey: it.originalKey,
      processedUrl: it.processedKey ? await getPresignedUrl(it.processedKey, presignExpires) : null,
      createdAt: it.createdAt
    }))
  );
  res.json(out);
});

app.get("/api/images/:id", async (req: Request, res: Response) => {
  const it = await prisma.image.findUnique({ where: { id: req.params.id } });
  if (!it) return res.status(404).json({ error: "Not found" });
  const processedUrl = it.processedKey ? await getPresignedUrl(it.processedKey, presignExpires) : null;
  res.json({ id: it.id, status: it.status, processedUrl });
});

app.delete("/api/images/:id", async (req: Request, res: Response) => {
  const it = await prisma.image.findUnique({ where: { id: req.params.id } });
  if (!it) return res.status(404).json({ error: "Not found" });
  try {
    if (it.originalKey) await deleteObject(it.originalKey);
    if (it.processedKey) await deleteObject(it.processedKey);
  } catch (e) {
    console.warn("Delete objects warning:", e);
  }
  await prisma.image.delete({ where: { id: it.id } });
  res.json({ ok: true });
});

app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));

app.listen(port, async () => {
  await ensureBucket();
  console.log(`Backend listening on :${port}`);
});
