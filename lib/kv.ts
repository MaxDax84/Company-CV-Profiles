import { createClient } from "@vercel/kv";

export const kv = createClient({
  url: process.env.KV1_KV_REST_API_URL!,
  token: process.env.KV1_KV_REST_API_TOKEN!,
});
