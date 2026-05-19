import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import { api } from "../lib/api";
import { blogCache, prefetchPosts, prefetchPost } from "../lib/blogCache";
import BookDemoModal from "../components/BookDemoModal";

gsap.registerPlugin(ScrollTrigger);

const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg, #240046 0%, #5a189a 55%, #9d4edd 100%)",
  "linear-gradient(135deg, #3c096c 0%, #7b2cbf 100%)",
  "linear-gradient(135deg, #5a189a 0%, #c77dff 100%)",
  "linear-gradient(135deg, #10002b 0%, #5a189a 60%, #7b2cbf 100%)",
  "linear-gradient(135deg, #7b2cbf 0%, #9d4edd 50%, #c77dff 100%)",
  "linear-gradient(135deg, #240046 0%, #3c096c 100%)",
];

function placeholderFor(index) {
  return PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const CoverImage = ({ url, alt, fallbackIndex = 0, className = "" }) => {
  if (url) {
    return (
      <img
        src={url}
        alt={alt || ""}
        loading="lazy"
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      aria-hidden
      className={`w-full h-full ${className}`}
      style={{ backgroundImage: placeholderFor(fallbackIndex) }}
    />
  );
};

const BlogPage = () => {
  const containerRef = useRef(null);
  // Hydrate synchronously from cache so revisits skip the loading flash entirely.
  const [posts, setPosts] = useState(() => blogCache.getPosts());
  const [error, setError] = useState("");
  const [demoOpen, setDemoOpen] = useState(false);
  // Track whether the first render had data — if so, skip entrance animations.
  const skipAnimations = useRef(blogCache.getPosts() !== null);

  useEffect(() => {
    if (blogCache.getPosts()) return;
    let cancelled = false;
    prefetchPosts()
      .then((fresh) => {
        if (!cancelled) setPosts(fresh ?? []);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setPosts([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useGSAP(
    () => {
      if (posts === null) return;
      if (skipAnimations.current) return;

      gsap.from(".blog-nav", {
        y: -24,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      });

      const heroSplit = SplitText.create(".blog-hero-title", {
        type: "chars,words,lines",
      });
      const subSplit = SplitText.create(".blog-hero-sub", {
        type: "words,lines",
      });

      gsap.from(heroSplit.chars, {
        yPercent: 110,
        opacity: 0,
        stagger: 0.015,
        ease: "power3.out",
        duration: 0.9,
        delay: 0.15,
      });

      gsap.from(subSplit.words, {
        yPercent: 80,
        opacity: 0,
        stagger: 0.015,
        ease: "power2.out",
        duration: 0.7,
        delay: 0.6,
      });

      gsap.from(".blog-hero-eyebrow", {
        y: 12,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.05,
      });

      gsap.from(".blog-hero-cta > *", {
        y: 16,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.9,
      });

      gsap.from(".featured-card", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".featured-section", start: "top 85%" },
      });

      gsap.utils.toArray(".post-card").forEach((card, i) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.7,
          delay: (i % 3) * 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
      });

      gsap.utils.toArray(".section-label").forEach((label) => {
        gsap.from(label, {
          x: -24,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: label, start: "top 92%" },
        });
      });

      gsap.from(".inline-cta", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".inline-cta", start: "top 88%" },
      });
    },
    { scope: containerRef, dependencies: [posts] }
  );

  const featured = posts && posts.length > 0 ? posts[0] : null;
  const rest = posts && posts.length > 1 ? posts.slice(1) : [];

  return (
    <main
      ref={containerRef}
      className="blog-typography bg-white min-h-screen relative"
      style={{ color: "#10002b" }}
    >
      {/* NAV */}
      <nav className="blog-nav sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#10002b]/[0.06]">
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
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-[#240046]/70 hover:text-[#240046] transition-colors text-sm font-medium px-3 py-2 rounded-full"
            >
              <span aria-hidden>←</span>
              <span>Back to home</span>
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

      {/* HERO — compact, editorial */}
      <section className="relative max-w-5xl mx-auto md:px-10 px-5 md:pt-20 pt-12 md:pb-14 pb-10">
        <span className="blog-hero-eyebrow inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7b2cbf] mb-6">
          <span className="w-6 h-px bg-[#9d4edd]" />
          The Kitchyn Journal
        </span>

        <h1
          className="blog-hero-title font-semibold leading-[1.02] tracking-[-0.035em] text-[#10002b]"
          style={{
            fontFamily: "var(--font-editorial)",
            fontSize: "clamp(2.25rem, 6vw, 4.75rem)",
          }}
        >
          What&apos;s Cooking{" "}
          <span className="text-[#7b2cbf]">in the Kitchyn</span>
        </h1>

        <p
          className="blog-hero-sub mt-6 text-[#240046]/70 max-w-2xl"
          style={{
            fontFamily: "var(--font-editorial)",
            fontSize: "clamp(1rem, 1.4vw, 1.18rem)",
            lineHeight: 1.55,
          }}
        >
          Stories, playbooks, and growth tactics from the kitchens that stopped
          renting their customers and started owning them.
        </p>

        <div className="blog-hero-cta mt-8 flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setDemoOpen(true)}
            className="inline-flex items-center gap-2 bg-[#10002b] hover:bg-[#240046] text-white text-sm font-semibold rounded-full px-5 py-2.5 transition-colors"
          >
            Book a demo
            <span aria-hidden>→</span>
          </button>
          <a
            href="#latest"
            className="inline-flex items-center gap-2 text-[#5a189a] hover:text-[#3c096c] text-sm font-semibold px-2 py-2.5 transition-colors"
          >
            Browse stories
          </a>
        </div>
      </section>

      <div className="max-w-5xl mx-auto md:px-10 px-5">
        <div className="h-px bg-[#10002b]/[0.08]" />
      </div>

      {/* CONTENT */}
      {posts === null ? (
        <section className="max-w-5xl mx-auto md:px-10 px-5 py-20">
          <div className="animate-pulse space-y-10">
            <div className="h-72 rounded-2xl bg-[#f5f0ff]" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="h-44 rounded-xl bg-[#f5f0ff]" />
                  <div className="h-4 w-24 bg-[#f5f0ff] rounded" />
                  <div className="h-5 w-3/4 bg-[#f5f0ff] rounded" />
                  <div className="h-4 w-full bg-[#f5f0ff] rounded" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : posts.length === 0 ? (
        <section className="max-w-2xl mx-auto md:px-10 px-5 md:py-28 py-20 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-[#7b2cbf] mb-4">
            {error ? "Something went wrong" : "Coming soon"}
          </span>
          <h2
            className="text-[#10002b] font-semibold tracking-tight"
            style={{
              fontFamily: "var(--font-editorial)",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              lineHeight: 1.2,
            }}
          >
            {error
              ? "We couldn't reach the kitchen right now."
              : "The first stories are coming soon."}
          </h2>
          <p
            className="mt-3 text-[#240046]/65"
            style={{ fontFamily: "var(--font-editorial)" }}
          >
            {error
              ? "Give it a moment and try again — or get in touch with us directly."
              : "Sign up for a demo and we'll share what we're learning along the way."}
          </p>
          <button
            type="button"
            onClick={() => setDemoOpen(true)}
            className="mt-7 inline-flex items-center gap-2 bg-[#5a189a] hover:bg-[#3c096c] text-white text-sm font-semibold rounded-full px-6 py-3 transition-colors"
          >
            Book a demo
            <span aria-hidden>→</span>
          </button>
        </section>
      ) : (
        <>
          {/* FEATURED */}
          {featured && (
            <section className="featured-section max-w-6xl mx-auto md:px-10 px-5 md:pt-16 pt-10 md:pb-10 pb-8">
              <div className="section-label flex items-center gap-3 mb-6">
                <span className="w-6 h-px bg-[#9d4edd]" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b2cbf]">
                  Featured story
                </span>
              </div>

              <Link
                to={`/blog/${featured.slug}`}
                onMouseEnter={() => prefetchPost(featured.slug).catch(() => {})}
                onFocus={() => prefetchPost(featured.slug).catch(() => {})}
                onTouchStart={() => prefetchPost(featured.slug).catch(() => {})}
                className="featured-card group grid md:grid-cols-12 gap-8 md:gap-10 items-center"
              >
                <div className="md:col-span-7 relative overflow-hidden rounded-2xl bg-[#f5f0ff] aspect-[16/10] ring-1 ring-[#10002b]/[0.06]">
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]">
                    <CoverImage
                      url={featured.cover_image_url}
                      alt={featured.title}
                      fallbackIndex={0}
                    />
                  </div>
                </div>

                <div className="md:col-span-5">
                  <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b2cbf] mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9d4edd]" />
                    Featured
                  </span>
                  <h2
                    className="font-semibold text-[#10002b] tracking-[-0.025em] group-hover:text-[#5a189a] transition-colors"
                    style={{
                      fontFamily: "var(--font-editorial)",
                      fontSize: "clamp(1.625rem, 3.2vw, 2.5rem)",
                      lineHeight: 1.12,
                    }}
                  >
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p
                      className="mt-4 text-[#240046]/70"
                      style={{
                        fontFamily: "var(--font-editorial)",
                        fontSize: "1.0625rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {featured.excerpt}
                    </p>
                  )}
                  <div
                    className="mt-6 flex items-center gap-3 text-sm text-[#240046]/55 flex-wrap"
                    style={{ fontFamily: "var(--font-editorial)" }}
                  >
                    {featured.author_name && (
                      <span className="font-medium text-[#240046]/75">
                        {featured.author_name}
                      </span>
                    )}
                    {featured.author_name && featured.published_at && (
                      <span className="w-1 h-1 rounded-full bg-[#240046]/30" />
                    )}
                    {featured.published_at && (
                      <span>{formatDate(featured.published_at)}</span>
                    )}
                    {featured.read_minutes && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-[#240046]/30" />
                        <span>{featured.read_minutes} min read</span>
                      </>
                    )}
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-[#5a189a] font-semibold text-sm group-hover:gap-3 transition-all">
                    Read the story
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </section>
          )}

          {/* INLINE CTA */}
          <section className="max-w-6xl mx-auto md:px-10 px-5 md:py-12 py-8">
            <div className="inline-cta relative overflow-hidden rounded-2xl bg-[#f5f0ff] ring-1 ring-[#10002b]/[0.06] md:p-8 p-6 flex md:flex-row flex-col md:items-center md:justify-between gap-5">
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#c77dff]/30 blur-3xl pointer-events-none" />
              <div className="relative">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b2cbf]">
                  See it in action
                </span>
                <h3
                  className="mt-2 font-semibold text-[#10002b] tracking-tight"
                  style={{
                    fontFamily: "var(--font-editorial)",
                    fontSize: "clamp(1.25rem, 2.2vw, 1.625rem)",
                    lineHeight: 1.2,
                  }}
                >
                  Ready to run your own Kitchyn?
                </h3>
                <p
                  className="mt-1.5 text-[#240046]/65 text-sm max-w-md"
                  style={{ fontFamily: "var(--font-editorial)" }}
                >
                  Book a quick walkthrough — we&apos;ll show you how operators
                  own their customers and grow without renting traffic.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDemoOpen(true)}
                className="relative shrink-0 inline-flex items-center gap-2 bg-[#10002b] hover:bg-[#240046] text-white text-sm font-semibold rounded-full px-5 py-3 transition-colors"
              >
                Book a demo
                <span aria-hidden>→</span>
              </button>
            </div>
          </section>

          {/* LATEST STORIES GRID */}
          {rest.length > 0 && (
            <section
              id="latest"
              className="max-w-6xl mx-auto md:px-10 px-5 md:py-14 py-10"
            >
              <div className="section-label flex items-center gap-3 mb-8">
                <span className="w-6 h-px bg-[#9d4edd]" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b2cbf]">
                  Latest stories
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 gap-x-6 md:gap-y-14 gap-y-10">
                {rest.map((post, i) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    onMouseEnter={() => prefetchPost(post.slug).catch(() => {})}
                    onFocus={() => prefetchPost(post.slug).catch(() => {})}
                    onTouchStart={() => prefetchPost(post.slug).catch(() => {})}
                    className="post-card group flex flex-col"
                  >
                    <div className="relative overflow-hidden rounded-xl bg-[#f5f0ff] aspect-[16/10] ring-1 ring-[#10002b]/[0.06] group-hover:ring-[#9d4edd]/40 transition-all">
                      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]">
                        <CoverImage
                          url={post.cover_image_url}
                          alt={post.title}
                          fallbackIndex={i + 1}
                        />
                      </div>
                    </div>

                    <div className="mt-5">
                      <div
                        className="flex items-center gap-2 text-xs text-[#240046]/55"
                        style={{ fontFamily: "var(--font-editorial)" }}
                      >
                        {post.author_name && (
                          <span className="font-semibold text-[#7b2cbf] uppercase tracking-[0.12em]">
                            {post.author_name}
                          </span>
                        )}
                        {post.author_name && post.published_at && (
                          <span className="w-1 h-1 rounded-full bg-[#240046]/30" />
                        )}
                        {post.published_at && (
                          <span>{formatDate(post.published_at)}</span>
                        )}
                      </div>

                      <h3
                        className="mt-2.5 font-semibold text-[#10002b] tracking-[-0.018em] group-hover:text-[#5a189a] transition-colors"
                        style={{
                          fontFamily: "var(--font-editorial)",
                          fontSize: "1.25rem",
                          lineHeight: 1.25,
                        }}
                      >
                        {post.title}
                      </h3>

                      {post.excerpt && (
                        <p
                          className="mt-2.5 text-[#240046]/65 text-[15px]"
                          style={{
                            fontFamily: "var(--font-editorial)",
                            lineHeight: 1.55,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {post.excerpt}
                        </p>
                      )}

                      {post.read_minutes && (
                        <p
                          className="mt-4 text-xs text-[#240046]/45"
                          style={{ fontFamily: "var(--font-editorial)" }}
                        >
                          {post.read_minutes} min read
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* FOOTER */}
      <footer className="mt-10 border-t border-[#10002b]/[0.08]">
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

export default BlogPage;
