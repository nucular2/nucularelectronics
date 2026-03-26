import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

export const CMS_BUCKET = process.env.CMS_BUCKET || 'cms';

export async function ensureCmsBucket() {
  const { data, error } = await supabaseService.storage.listBuckets();
  if (error) return;
  const exists = (data || []).some((b) => b.name === CMS_BUCKET);
  if (exists) return;
  await supabaseService.storage.createBucket(CMS_BUCKET, { public: true });
}

export async function readJson<T>(path: string): Promise<T | null> {
  await ensureCmsBucket();
  const { data, error } = await supabaseService.storage.from(CMS_BUCKET).download(path);
  if (error || !data) return null;
  const ab = await data.arrayBuffer();
  const text = Buffer.from(ab).toString('utf-8');
  return JSON.parse(text) as T;
}

export async function writeJson(path: string, payload: unknown) {
  await ensureCmsBucket();
  const body = Buffer.from(JSON.stringify(payload, null, 2), 'utf-8');
  const { error } = await supabaseService.storage
    .from(CMS_BUCKET)
    .upload(path, body, { contentType: 'application/json', upsert: true });
  if (error) throw new Error(error.message);
}

export async function uploadFile(params: { path: string; contentType: string; data: Buffer }) {
  await ensureCmsBucket();
  const { error } = await supabaseService.storage
    .from(CMS_BUCKET)
    .upload(params.path, params.data, { contentType: params.contentType, upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabaseService.storage.from(CMS_BUCKET).getPublicUrl(params.path);
  return data.publicUrl;
}

