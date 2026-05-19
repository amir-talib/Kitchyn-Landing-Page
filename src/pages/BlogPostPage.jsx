import { useGSAP } from "@gsap/react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { marked } from "marked";
import { api } from "../lib/api";
import BookDemoModal from "../components/BookDemoModal";

marked.setOptions({ gfm: true, breaks: true });

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const BlogPostPage = () => {
  const { slug } = useParams();
  const containerRef = useRef(null);
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPost(null);
    setError("");
    api
      .getBlogPost(slug)
      .then((data) => {
        if (!cancelled) setPost(data.post);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useGSAP(
    () => {
      if (!post) return;
      gsap.from(".post-nav", {
        y: -24,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      });
      gsap.from(".post-eyebrow", {
        y: 12,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.05,
      });
      gsap.from(".post-title", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.15,
      });
      gsap.from(".post-excerpt", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.3,
      });
      gsap.from(".post-meta > *", {
        y: 12,
        opacity: 0,
        stagger: 0.06,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.45,
      });
      gsap.from(".post-cover", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.55,
      });
      gsap.from(".post-body", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.7,
      });
      gsap.from(".post-cta", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.85,
      });
    },
    { scope: containerRef, dependencies: [post] }
  );

  const html = useMemo(
    () => (post?.content ? marked.parse(post.content) : ""),
    [post?.content]
  );

  return (
    <main
      ref={containerRef}
      className="blog-typography bg-white min-h-screen relative"
      style={{ color: "#10002b" }}
    >
      {/* NAV */}
      <nav className="post-nav sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#10002b]/[0.06]">
        <div className="max-w-6xl mx-auto flex items-center justify-between md:px-10 px-5 md:py-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img
              src="/images/logokitchyn.png"
              alt="Kitchyn"
              className="md:w-24 w-20"
            />
          </Link>
          <div className="flex items-center md:gap-2 gap-1">
            <Link
              to="/blog"
              className="hidden sm:inline-flex items-center gap-1.5 text-[#240046]/70 hover:text-[#240046] transition-colors text-sm font-medium px-3 py-2 rounded-full"
            >
              <span aria-hidden>←</span>
              <span>All stories</span>
            </Link>
            <button
              type="button"
              onClick={() => setDemoOpen(true)}
              className="inline-flex items-center gap-2 bg-[#5a189a] hover:bg-[#3c096c] text-white text-sm font-semibold rounded-full md:px-5 px-4 md:py-2.5 py-2 transition-colors"
            >
              Book a demo
            </button>
          </div>
        </div>
      </nav>

      {/* LOADING SKELETON */}
      {post === null && !error && (
        <section className="max-w-3xl mx-auto md:px-10 px-5 md:pt-20 pt-12 md:pb-32 pb-20">
          <div className="animate-pulse space-y-5">
            <div className="h-3 w-32 bg-[#f5f0ff] rounded" />
            <div className="h-10 w-3/4 bg-[#f5f0ff] rounded" />
            <div className="h-10 w-2/3 bg-[#f5f0ff] rounded" />
            <div className="h-4 w-full bg-[#f5f0ff] rounded mt-6" />
            <div className="h-4 w-5/6 bg-[#f5f0ff] rounded" />
            <div className="h-72 w-full bg-[#f5f0ff] rounded-2xl mt-8" />
          </div>
        </section>
      )}

      {/* ERROR STATE */}
      {error && (
        <section className="max-w-2xl mx-auto md:px-10 px-5 md:pt-24 pt-16 md:pb-32 pb-20 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-[#7b2cbf] mb-4">
            Not found
          </span>
          <h1
            className="font-semibold text-[#10002b] tracking-tight"
            style={{
              fontFamily: "var(--font-editorial)",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              lineHeight: 1.2,
            }}
          >
            We couldn&apos;t reach the kitchen right now.
          </h1>
          <p
            className="mt-3 text-[#240046]/65"
            style={{ fontFamily: "var(--font-editorial)" }}
          >
            The story you&apos;re looking for may have moved. Browse the latest
            stories or get in touch.
          </p>
          <div className="mt-7 flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 bg-[#10002b] hover:bg-[#240046] text-white text-sm font-semibold rounded-full px-5 py-3 transition-colors"
            >
              Back to stories
            </Link>
            <button
              type="button"
              onClick={() => setDemoOpen(true)}
              className="inline-flex items-center gap-2 text-[#5a189a] hover:text-[#3c096c] text-sm font-semibold px-3 py-3 transition-colors"
            >
              Book a demo
              <span aria-hidden>→</span>
            </button>
          </div>
        </section>
      )}

      {/* POST */}
      {post && (
        <>
          <article>
            <header className="max-w-3xl mx-auto md:px-10 px-5 md:pt-16 pt-10 md:pb-10 pb-8">
              <span className="post-eyebrow inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7b2cbf] mb-5">
                <Link
                  to="/blog"
                  className="hover:text-[#5a189a] transition-colors"
                >
                  The Kitchyn Journal
                </Link>
              </span>

              <h1
                className="post-title font-semibold text-[#10002b] tracking-[-0.03em]"
                style={{
                  fontFamily: "var(--font-editorial)",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  lineHeight: 1.08,
                }}
              >
                {post.title}
              </h1>

              {post.excerpt && (
                <p
                  className="post-excerpt mt-5 text-[#240046]/70"
                  style={{
                    fontFamily: "var(--font-editorial)",
                    fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)",
                    lineHeight: 1.55,
                  }}
                >
                  {post.excerpt}
                </p>
              )}

              <div
                className="post-meta mt-8 flex items-center gap-3 flex-wrap text-sm text-[#240046]/60"
                style={{ fontFamily: "var(--font-editorial)" }}
              >
                {post.author_name && (
                  <span className="font-semibold text-[#240046]/80">
                    {post.author_name}
                  </span>
                )}
                {post.author_name && post.published_at && (
                  <span className="w-1 h-1 rounded-full bg-[#240046]/30" />
                )}
                {post.published_at && (
                  <span>{formatDate(post.published_at)}</span>
                )}
                {post.read_minutes && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-[#240046]/30" />
                    <span>{post.read_minutes} min read</span>
                  </>
                )}
              </div>
            </header>

            {post.cover_image_url && (
              <div className="max-w-5xl mx-auto md:px-10 px-5 md:pb-14 pb-10">
                <div className="post-cover relative overflow-hidden rounded-2xl bg-[#f5f0ff] aspect-[16/9] ring-1 ring-[#10002b]/[0.06]">
                  <img
                    src={post.cover_image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="max-w-2xl mx-auto md:px-10 px-5 md:pb-20 pb-16">
              <div
                className="post-body prose-blog"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </article>

          {/* INLINE CTA → opens modal */}
          <section className="max-w-3xl mx-auto md:px-10 px-5 md:pb-24 pb-16">
            <div className="post-cta relative overflow-hidden rounded-2xl bg-[#f5f0ff] ring-1 ring-[#10002b]/[0.06] md:p-10 p-7 text-center">
              <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#c77dff]/30 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#9d4edd]/20 blur-3xl pointer-events-none" />
              <div className="relative">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b2cbf]">
                  See it in action
                </span>
                <h3
                  className="mt-3 font-semibold text-[#10002b] tracking-tight"
                  style={{
                    fontFamily: "var(--font-editorial)",
                    fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
                    lineHeight: 1.18,
                  }}
                >
                  Ready to run your own Kitchyn?
                </h3>
                <p
                  className="mt-3 text-[#240046]/65 max-w-md mx-auto"
                  style={{
                    fontFamily: "var(--font-editorial)",
                    fontSize: "1rem",
                    lineHeight: 1.55,
                  }}
                >
                  Book a quick walkthrough. We&apos;ll show you how operators
                  own their customers and grow without renting traffic.
                </p>
                <button
                  type="button"
                  onClick={() => setDemoOpen(true)}
                  className="mt-6 inline-flex items-center gap-2 bg-[#10002b] hover:bg-[#240046] text-white text-sm font-semibold rounded-full px-6 py-3 transition-colors"
                >
                  Book a demo
                  <span aria-hidden>→</span>
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* FOOTER */}
      <footer className="mt-4 border-t border-[#10002b]/[0.08]">
        <div
          className="max-w-6xl mx-auto md:px-10 px-5 md:py-10 py-8 flex md:flex-row flex-col md:items-center md:justify-between gap-4 text-sm text-[#240046]/55"
          style={{ fontFamily: "var(--font-editorial)" }}
        >
          <p>© 2026 Kitchyn — Stories from the kitchen.</p>
          <div className="flex items-center gap-5">
            <Link
              to="/"
              className="hover:text-[#5a189a] transition-colors"
            >
              Home
            </Link>
            <Link
              to="/blog"
              className="hover:text-[#5a189a] transition-colors"
            >
              All stories
            </Link>
            <button
              type="button"
              onClick={() => setDemoOpen(true)}
              className="hover:text-[#5a189a] transition-colors"
            >
              Book a demo
            </button>
          </div>
        </div>
      </footer>

      <BookDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </main>
  );
};

export default BlogPostPage;
