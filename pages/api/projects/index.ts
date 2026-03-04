import type { NextApiRequest, NextApiResponse } from "next";
import supabaseServer from "@/lib/supabaseServer";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/authOptions";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions as any);
  // DEBUG: log session and cookie header to diagnose auth issues in dev
  // (remove these logs before production)
  // eslint-disable-next-line no-console
  console.debug("[api/projects] cookies:", req.headers.cookie);
  // eslint-disable-next-line no-console
  console.debug("[api/projects] session:", session);

  if (req.method === "GET") {
    // If Supabase not configured, fallback to local JSON file
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const file = path.resolve(process.cwd(), "data", "projects.json");
      try {
        const raw = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "[]";
        const data = JSON.parse(raw);
        return res.status(200).json(data.reverse());
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }

    const { data, error } = await supabaseServer
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // Protect write operations: only admin users
  if (!session || !(session as any).user?.isAdmin) {
    // eslint-disable-next-line no-console
    console.warn("[api/projects] unauthorized POST/PUT attempt", {
      session: session,
      cookies: req.headers.cookie,
    });
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    const payload = req.body;

    // Normalize incoming payload to match DB schema
    const normalizePayload = (p: any) => {
      const out = { ...p };
      out.businessVision = out.businessVision || {
        problem: "",
        decision: "",
        impact: "",
      };
      out.technicalDetail = out.technicalDetail || {
        architecture: "",
        stack: "",
        dataFlow: "",
      };

      if (typeof out.technologies === "string") {
        try {
          out.technologies = JSON.parse(out.technologies);
        } catch (e) {
          out.technologies = out.technologies
            ? out.technologies.split(/\s*,\s*/).filter(Boolean)
            : [];
        }
      }
      out.technologies = Array.isArray(out.technologies)
        ? out.technologies
        : [];

      // map `image` -> `image_url` if needed
      if (
        (out.image_url === null ||
          out.image_url === undefined ||
          out.image_url === "") &&
        out.image
      ) {
        out.image_url = out.image;
      }

      out.githubUrl = out.githubUrl || out.github || "";
      out.ecosystem = out.ecosystem || null;
      out.pipeline = out.pipeline || null;

      return out;
    };

    const normalized = normalizePayload(payload);
    // Local-file fallback
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const file = path.resolve(process.cwd(), "data", "projects.json");
      try {
        const raw = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "[]";
        const arr = JSON.parse(raw);
        arr.push(normalized);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, JSON.stringify(arr, null, 2), "utf8");
        return res.status(201).json(normalized);
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }

    // Determine allowed keys from a sample row in the DB (fallback to known list)
    const defaultAllowed = [
      "id",
      "title",
      "description",
      "tags",
      "url",
      "image_url",
      "created_at",
      "businessVision",
      "technicalDetail",
      "technologies",
      "githubUrl",
      "ecosystem",
      "pipeline",
    ];

    let allowedKeys: string[] = [];
    try {
      const { data: sample, error: sampleError } = await supabaseServer
        .from("projects")
        .select()
        .limit(1);
      if (!sampleError && Array.isArray(sample) && sample.length > 0) {
        allowedKeys = Object.keys(sample[0]);
      }
    } catch (e) {
      // ignore
    }
    if (!allowedKeys || allowedKeys.length === 0) allowedKeys = defaultAllowed;

    const pick = (obj: any, keys: string[]) => {
      const o: any = {};
      keys.forEach((k) => {
        if (Object.prototype.hasOwnProperty.call(obj, k)) o[k] = obj[k];
      });
      return o;
    };

    // Attempt insert; on schema errors strip offending keys and retry.
    const tryInsert = async (payload: any) => {
      let attempt = 0;
      let current = { ...payload };
      // initially filter to allowed keys (and keep any provided keys to be safe)
      current = pick(current, allowedKeys.concat(Object.keys(payload)));
      while (attempt < 5) {
        const { data, error } = await supabaseServer
          .from("projects")
          .insert([current])
          .select();
        if (!error) return { data: data?.[0], error: null };
        const msg = error.message || "";
        const m = msg.match(/Could not find the '([^']+)' column/);
        if (m && m[1]) {
          const col = m[1];
          if (Object.prototype.hasOwnProperty.call(current, col))
            delete current[col];
          attempt++;
          continue;
        }
        return { data: null, error };
      }
      return {
        data: null,
        error: { message: "Could not adapt to schema after retries" },
      };
    };

    const insertResult = await tryInsert(normalized);
    if (insertResult.error)
      return res
        .status(500)
        .json({ error: insertResult.error.message || insertResult.error });
    return res.status(201).json(insertResult.data);
  }

  return res.status(405).end();
}
