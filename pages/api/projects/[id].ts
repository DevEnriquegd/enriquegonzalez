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
  const {
    query: { id },
    method,
  } = req;

  const session = await getServerSession(req, res, authOptions as any);
  // DEBUG: log session and cookies to help debug auth issues in dev
  // eslint-disable-next-line no-console
  console.debug("[api/projects/:id] cookies:", req.headers.cookie);
  // eslint-disable-next-line no-console
  console.debug("[api/projects/:id] session:", session);

  if (method === "GET") {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const file = path.resolve(process.cwd(), "data", "projects.json");
      try {
        const raw = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "[]";
        const arr = JSON.parse(raw);
        const found = arr.find((p: any) => String(p.id) === String(id)) || null;
        return res.status(200).json(found);
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }

    const { data, error } = await supabaseServer
      .from("projects")
      .select("*")
      .eq("id", id)
      .limit(1);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data?.[0] || null);
  }

  if (!session || !(session as any).user?.isAdmin) {
    // eslint-disable-next-line no-console
    console.warn("[api/projects/:id] unauthorized attempt", {
      session: session,
      cookies: req.headers.cookie,
    });
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (method === "PUT") {
    const payload = req.body;

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
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const file = path.resolve(process.cwd(), "data", "projects.json");
      try {
        const raw = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "[]";
        const arr = JSON.parse(raw);
        const idx = arr.findIndex((p: any) => String(p.id) === String(id));
        if (idx === -1) return res.status(404).json({ error: "Not found" });
        arr[idx] = { ...arr[idx], ...normalized };
        fs.writeFileSync(file, JSON.stringify(arr, null, 2), "utf8");
        return res.status(200).json(arr[idx]);
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

    // Attempt update; on schema errors strip offending keys and retry.
    const tryUpdate = async (payload: any) => {
      let attempt = 0;
      let current = { ...payload };
      current = pick(current, allowedKeys.concat(Object.keys(payload)));
      while (attempt < 5) {
        const { data, error } = await supabaseServer
          .from("projects")
          .update(current)
          .eq("id", id)
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

    const updateResult = await tryUpdate(normalized);
    if (updateResult.error)
      return res
        .status(500)
        .json({ error: updateResult.error.message || updateResult.error });
    return res.status(200).json(updateResult.data);
  }

  if (method === "DELETE") {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const file = path.resolve(process.cwd(), "data", "projects.json");
      try {
        const raw = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "[]";
        let arr = JSON.parse(raw);
        arr = arr.filter((p: any) => String(p.id) !== String(id));
        fs.writeFileSync(file, JSON.stringify(arr, null, 2), "utf8");
        return res.status(204).end();
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }

    const { error } = await supabaseServer
      .from("projects")
      .delete()
      .eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }

  return res.status(405).end();
}
