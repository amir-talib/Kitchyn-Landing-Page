import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import { api } from "../lib/api";

gsap.registerPlugin(ScrollTrigger);

const GRADIENTS = [
  "from-[#5a189a] via-[#7b2cbf] to-[#c77dff]",
  "from-[#3c096c] to-[#9d4edd]",
  "from-[#7b2cbf] to-[#c77dff]",
  "from-[#240046] to-[#5a189a]",
  "from-[#10002b] to-[#7b2cbf]",
  "from-[#5a189a] to-[#10002b]",
  "from-[#9d4edd] to-[#3c096c]",
];

function gradientFor(index) {
  return GRADIENTS[index % GRADIENTS.length];
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const BlogPage = () => {
  const containerRef = useRef(null);
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .listBlogPosts({ limit: 30 })
      .then((data) => {
        if (!cancelled) setPosts(data.posts ?? []);
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

      const heroSplit = SplitText.create(".blog-hero-title", { type: "chars,words" });
      const subSplit = SplitText.create(".blog-hero-sub", { type: "words,lines" });

      gsap.from(heroSplit.chars, {
        yPercent: 120,
        opacity: 0,
        stagger: 0.02,
        ease: "power3.out",
        duration: 1,
        delay: 0.3,
      });

      gsap.from(subSplit.words, {
        yPercent: 100,
        opacity: 0,
        stagger: 0.02,
        ease: "power2.out",
        duration: 0.8,
        delay: 1,
      });

      gsap.from(".blog-nav", {
        y: -40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.from(".blog-meta-pill", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        delay: 1.4,
      });

      gsap.utils.toArray(".float-blob").forEach((blob, i) => {
        gsap.to(blob, {
          y: i % 2 === 0 ? -40 : 40,
          x: i % 2 === 0 ? 20 : -20,
          duration: 6 + i,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      gsap.from(".featured-card", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".featured-section", start: "top 80%" },
      });

      gsap.utils.toArray(".post-card").forEach((card, i) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 0.8,
          delay: (i % 3) * 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 85%" },
        });
      });

      gsap.from(".section-label", {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: ".section-label", start: "top 90%" },
      });

      gsap.from(".newsletter-card", {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".newsletter-card", start: "top 85%" },
      });
    },
    { scope: containerRef, dependencies: [posts] }
  );

  const featured = posts && posts.length > 0 ? posts[0] : null;
  const rest = posts && posts.length > 1 ? posts.slice(1) : [];

  return (
    <main
      ref={containerRef}
      className="bg-main-bg text-milk min-h-screen relative overflow-x-hidden"
    >
      <div className="float-blob absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#7b2cbf] to-[#c77dff] opacity-20 blur-[100px] pointer-events-none" />
      <div className="float-blob absolute top-[40%] right-[8%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#5a189a] to-[#3c096c] opacity-30 blur-[120px] pointer-events-none" />
      <div className="float-blob absolute bottom-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-[#9d4edd] to-[#240046] opacity-25 blur-[100px] pointer-events-none" />
      <div className="float-blob absolute bottom-[5%] right-[15%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[#c77dff] to-[#5a189a] opacity-20 blur-[90px] pointer-events-none" />

      <nav className="blog-nav fixed top-0 left-0 right-0 z-50 flex items-center justify-between md:px-12 px-5 py-6 backdrop-blur-md bg-[#10002b]/30">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src="/images/logokitchyn.png" alt="Kitchyn" className="md:w-28 w-20" />
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2 text-milk hover:gap-3 transition-all font-paragraph md:text-base text-sm border border-milk/30 rounded-full md:px-6 px-4 md:py-3 py-2 hover:bg-milk/10"
        >
          <span>← Back to home</span>
        </Link>
      </nav>

      <section className="relative min-h-[90vh] flex flex-col items-center justify-center md:px-12 px-5 pt-32 pb-20 text-center">
        <div className="flex gap-3 md:mb-10 mb-6 flex-wrap justify-center">
          <span className="blog-meta-pill text-xs md:text-sm font-paragraph font-semibold uppercase tracking-widest bg-milk/10 border border-milk/20 backdrop-blur-md rounded-full px-4 py-2">
            Stories
          </span>
          <span className="blog-meta-pill text-xs md:text-sm font-paragraph font-semibold uppercase tracking-widest bg-milk/10 border border-milk/20 backdrop-blur-md rounded-full px-4 py-2">
            Playbooks
          </span>
          <span className="blog-meta-pill text-xs md:text-sm font-paragraph font-semibold uppercase tracking-widest bg-milk/10 border border-milk/20 backdrop-blur-md rounded-full px-4 py-2">
            Growth tactics
          </span>
        </div>

        <h1 className="blog-hero-title text-[14vw] md:text-[10vw] font-bold uppercase leading-[95%] tracking-[-.4vw] text-milk">
          What&apos;s<br />
          <span className="bg-gradient-to-r from-[#c77dff] via-[#e0aaff] to-[#9d4edd] bg-clip-text text-transparent">
            Cooking
          </span>
        </h1>

        <p className="blog-hero-sub md:mt-10 mt-6 font-paragraph md:text-2xl text-base max-w-2xl text-milk/80 leading-relaxed">
          Stories, playbooks, and growth tactics from the kitchens that stopped renting their customers and started owning them.
        </p>
      </section>

      {posts === null ? (
        <section className="relative md:px-12 px-5 py-32 text-center font-paragraph text-milk/60">
          Loading stories…
        </section>
      ) : posts.length === 0 ? (
        <section className="relative md:px-12 px-5 py-32 text-center">
          <p className="font-paragraph md:text-xl text-base text-milk/70 max-w-md mx-auto">
            {error
              ? "We couldn't reach the kitchen right now. Try again in a moment."
              : "The first stories are coming soon. Check back shortly."}
          </p>
        </section>
      ) : (
        <>
          {featured && (
            <section className="featured-section relative md:px-12 px-5 md:py-20 py-12">
              <div className="section-label flex items-center gap-4 md:mb-10 mb-6">
                <span className="w-12 h-[2px] bg-milk/50" />
                <span className="font-paragraph text-sm uppercase tracking-widest text-milk/60">
                  Featured
                </span>
              </div>

              <Link
                to={`/blog/${featured.slug}`}
                className={`featured-card relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradientFor(0)} md:p-16 p-8 cursor-pointer group block transition-transform hover:scale-[1.01] duration-500`}
              >
                {featured.cover_image_url && (
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: `url(${featured.cover_image_url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                )}
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-black/20 blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-3xl">
                  <span className="inline-block text-xs font-paragraph font-bold uppercase tracking-widest bg-milk/20 backdrop-blur-md border border-milk/30 rounded-full px-4 py-2 mb-6">
                    Featured
                  </span>
                  <h2 className="md:text-6xl text-3xl font-bold uppercase leading-[105%] tracking-tight mb-6">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="font-paragraph md:text-lg text-base text-milk/85 leading-relaxed md:mb-8 mb-6 max-w-2xl">
                      {featured.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-6 font-paragraph text-sm text-milk/70 flex-wrap">
                    <span>{formatDate(featured.published_at)}</span>
                    {featured.read_minutes && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-milk/40" />
                        <span>{featured.read_minutes} min read</span>
                      </>
                    )}
                    <span className="ml-auto inline-flex items-center gap-2 text-milk font-semibold group-hover:gap-4 transition-all">
                      Read story →
                    </span>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {rest.length > 0 && (
            <section className="relative md:px-12 px-5 md:py-20 py-12">
              <div className="section-label flex items-center gap-4 md:mb-12 mb-8">
                <span className="w-12 h-[2px] bg-milk/50" />
                <span className="font-paragraph text-sm uppercase tracking-widest text-milk/60">
                  Latest stories
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post, i) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className={`post-card relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradientFor(i + 1)} md:p-10 p-7 cursor-pointer group transition-transform hover:scale-[1.02] hover:-translate-y-1 duration-300 min-h-[400px] flex flex-col`}
                  >
                    {post.cover_image_url && (
                      <div
                        aria-hidden
                        className="absolute inset-0 opacity-25"
                        style={{
                          backgroundImage: `url(${post.cover_image_url})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    )}
                    <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none transition-opacity group-hover:opacity-60" />

                    <div className="relative z-10 flex flex-col h-full">
                      <span className="inline-block self-start text-xs font-paragraph font-bold uppercase tracking-widest bg-milk/20 backdrop-blur-md border border-milk/30 rounded-full px-3 py-1.5 mb-5">
                        {post.author_name}
                      </span>
                      <h3 className="md:text-2xl text-xl font-bold uppercase leading-[110%] tracking-tight mb-4">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="font-paragraph text-sm text-milk/80 leading-relaxed mb-6 flex-1">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between font-paragraph text-xs text-milk/60">
                        <span>{formatDate(post.published_at)}</span>
                        <span className="inline-flex items-center gap-1 text-milk font-semibold group-hover:gap-2 transition-all">
                          Read →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <section className="relative md:px-12 px-5 md:py-24 py-16">
        <div className="newsletter-card relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#10002b] via-[#240046] to-[#3c096c] border border-milk/20 md:p-16 p-8 text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#9d4edd] to-[#c77dff] opacity-20 blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-paragraph font-bold uppercase tracking-widest bg-milk/10 border border-milk/30 rounded-full px-4 py-2 mb-6">
              Get the next one first
            </span>
            <h2 className="md:text-5xl text-3xl font-bold uppercase leading-[105%] tracking-tight md:mb-6 mb-4">
              Stories that pay rent
            </h2>
            <p className="font-paragraph md:text-lg text-base text-milk/80 leading-relaxed md:mb-10 mb-6">
              One email a week. Real numbers from real restaurants. No fluff.
            </p>
            <div className="flex md:flex-row flex-col items-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-milk/10 border border-milk/30 rounded-full md:px-6 px-4 md:py-4 py-3 font-paragraph text-milk placeholder:text-milk/40 focus:outline-none focus:border-milk/60 transition-colors"
              />
              <button className="w-full md:w-auto bg-milk text-[#10002b] font-paragraph font-bold uppercase tracking-wider rounded-full md:px-8 px-6 md:py-4 py-3 hover:bg-[#e0aaff] transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative md:px-12 px-5 md:py-12 py-8 border-t border-milk/10">
        <div className="flex md:flex-row flex-col md:justify-between justify-center items-center gap-4 font-paragraph text-milk/50 text-sm">
          <p>Copyright © 2026 Kitchyn — All Rights Reserved</p>
          <Link to="/" className="hover:text-milk transition-colors">
            ← Back to home
          </Link>
        </div>
      </footer>
    </main>
  );
};

export default BlogPage;
