const API_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "http://localhost:3000";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.issues = data.issues;
    throw err;
  }
  return data;
}

export const api = {
  listBlogPosts(params = {}) {
    const search = new URLSearchParams();
    if (params.limit) search.set("limit", String(params.limit));
    if (params.offset) search.set("offset", String(params.offset));
    const qs = search.toString();
    return request(`/api/landing/blog${qs ? `?${qs}` : ""}`);
  },

  getBlogPost(slug) {
    return request(`/api/landing/blog/${encodeURIComponent(slug)}`);
  },

  submitDemoRequest(payload) {
    return request("/api/landing/demo-request", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
