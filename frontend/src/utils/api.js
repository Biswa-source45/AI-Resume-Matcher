import { supabase } from "./supabaseClient";

const API_BASE = import.meta.env.VITE_API_URL || "https://resume-matcher-backend-zpt3.onrender.com";
const REQUEST_TIMEOUT_MS = 30000; // 30 second timeout

async function getSupabaseAccessToken() {
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token || null;
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const token = await getSupabaseAccessToken();
  const headers = { ...(options.headers || {}) };

  // Don't set Content-Type for FormData
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // Always send Authorization as fallback for mobile (where cookies may be blocked)
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Add timeout handling
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      credentials: "include", // try cookies first
      ...options,
      headers,
      signal: controller.signal,
    });

    if (res.status === 204) return null;

    const ct = res.headers.get("content-type") || "";
    const body = ct.includes("application/json") ? await res.json() : await res.text();

    if (!res.ok) {
      const err = new Error(body?.detail || body?.message || (typeof body === "string" ? body : "API Error"));
      err.status = res.status;
      err.body = body;
      throw err;
    }

    return body;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  async setCookie(sessionData) {
    return request("/set-cookie", {
      method: "POST",
      body: JSON.stringify({
        session: sessionData?.session || sessionData,
        access_token: sessionData?.access_token,
        user: sessionData?.user,
      }),
    });
  },

  async analyzeResume(file) {
    const form = new FormData();
    form.append("file", file);
    return request("/analyze-resume", {
      method: "POST", 
      body: form,
    });
  },

  async getSummaries() {
    return request("/summaries");
  },

  async sendChatMessage(message) {
    return request("/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },

  async logout() {
    return request("/logout", { method: "POST" });
  },
};

export default api;