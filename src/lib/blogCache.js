import { api } from "./api";

// Module-level cache. Persists for the lifetime of the SPA session.
let postsCache = null;
const postBySlug = new Map();

let postsPromise = null;
const postPromiseBySlug = new Map();

export const blogCache = {
  getPosts: () => postsCache,
  setPosts: (posts) => {
    postsCache = posts;
  },
  getPost: (slug) => postBySlug.get(slug) ?? null,
  setPost: (slug, post) => {
    postBySlug.set(slug, post);
  },
};

// Fires once even if called many times in parallel; safe to call from hover handlers.
export function prefetchPosts() {
  if (postsCache) return Promise.resolve(postsCache);
  if (postsPromise) return postsPromise;
  postsPromise = api
    .listBlogPosts({ limit: 30 })
    .then((data) => {
      const posts = data.posts ?? [];
      blogCache.setPosts(posts);
      postsPromise = null;
      return posts;
    })
    .catch((err) => {
      postsPromise = null;
      throw err;
    });
  return postsPromise;
}

export function prefetchPost(slug) {
  const cached = postBySlug.get(slug);
  if (cached) return Promise.resolve(cached);
  if (postPromiseBySlug.has(slug)) return postPromiseBySlug.get(slug);
  const p = api
    .getBlogPost(slug)
    .then((data) => {
      blogCache.setPost(slug, data.post);
      postPromiseBySlug.delete(slug);
      return data.post;
    })
    .catch((err) => {
      postPromiseBySlug.delete(slug);
      throw err;
    });
  postPromiseBySlug.set(slug, p);
  return p;
}
