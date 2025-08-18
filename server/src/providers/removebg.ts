import axios from "axios";
import FormData from "form-data";

export async function removeBackground(imageBuffer: Buffer): Promise<Buffer> {
  const apiKey = process.env.REMOVE_BG_API_KEY;
  if (!apiKey) throw new Error("Missing REMOVE_BG_API_KEY");

  const form = new FormData();
  form.append("image_file", imageBuffer, { filename: "upload.png" });
  form.append("size", "auto");

  const res = await axios.post("https://api.remove.bg/v1.0/removebg", form, {
    headers: {
      ...form.getHeaders(),
      "X-Api-Key": apiKey,
    },
    responseType: "arraybuffer",
    maxContentLength: 30 * 1024 * 1024,
  });
  return Buffer.from(res.data);
}
