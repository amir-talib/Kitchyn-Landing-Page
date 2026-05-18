import { useGSAP } from "@gsap/react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { marked } from "marked";
import { api } from "../lib/api";

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
        y: -40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
      gsap.from(".post-meta > *", {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.2,
      });
      gsap.from(".post-title", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.4,
      });
      gsap.from(".post-cover", {
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.7,
      });
      gsap.from(".post-body", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.9,
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
      className="bg-main-bg text-milk min-h-screen relative overflow-x-hidden"
    >
      <div className="absolute top-[5%] left-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#7b2cbf] to-[#c77dff] opacity-15 blur-[120px] pointer-events-none" />
      <div className="absolute top-[45%] right-[5%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[#5a189a] to-[#3c096c] opacity-20 blur-[120px] pointer-events-none" />

      <nav className="post-nav fixed top-0 left-0 right-0 z-50 flex items-center justify-between md:px-12 px-5 py-6 backdrop-blur-md bg-[#10002b]/40">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src="/images/logokitchyn.png" alt="Kitchyn" className="md:w-28 w-20" />
        </Link>
        <Link
          to="/blog"
          className="flex items-center gap-2 text-milk hover:gap-3 transition-all font-paragraph md:text-base text-sm border border-milk/30 rounded-full md:px-6 px-4 md:py-3 py-2 hover:bg-milk/10"
        >
          <span>← All stories</span>
        </Link>
      </nav>

      {post === null && !error && (
        <section className="relative md:px-12 px-5 pt-40 pb-32 text-center font-paragraph text-milk/60">
          Loading…
        </section>
      )}

      {error && (
        <section className="relative md:px-12 px-5 pt-40 pb-32 text-center">
          <p className="font-paragraph md:text-xl text-base text-milk/70 max-w-md mx-auto mb-6">
            We couldn&apos;t find that story.
          </p>
          <Link
            to="/blog"
            className="inline-block bg-milk text-[#10002b] font-paragraph font-bold uppercase tracking-wider rounded-full px-6 py-3 hover:bg-[#e0aaff] transition-colors"
          >
            Back to stories
          </Link>
        </section>
      )}

      {post && (
        <>
          <section className="relative md:px-12 px-5 md:pt-40 pt-32 md:pb-12 pb-10 max-w-4xl mx-auto">
            <div className="post-meta flex items-center gap-3 md:mb-10 mb-6 flex-wrap font-paragraph text-sm text-milk/70">
              <span className="inline-block bg-milk/10 border border-milk/20 backdrop-blur-md rounded-full px-3 py-1.5 uppercase tracking-widest text-xs font-semibold">
                {post.author_name}
              </span>
              <span>{formatDate(post.published_at)}</span>
              {post.read_minutes && (
                <>
                  <span className="w-1 h-1 rounded-full bg-milk/40" />
                  <span>{post.read_minutes} min read</span>
                </>
              )}
            </div>

            <h1 className="post-title md:text-6xl text-3xl font-bold uppercase leading-[100%] tracking-tight md:mb-8 mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="font-paragraph md:text-2xl text-lg text-milk/80 leading-relaxed md:mb-12 mb-8">
                {post.excerpt}
              </p>
            )}
          </section>

          {post.cover_image_url && (
            <section className="relative md:px-12 px-5 md:pb-16 pb-10 max-w-5xl mx-auto">
              <img
                src={post.cover_image_url}
                alt=""
                className="post-cover w-full aspect-[16/9] object-cover rounded-3xl border border-milk/10"
              />
            </section>
          )}

          <section className="relative md:px-12 px-5 md:pb-32 pb-20 max-w-3xl mx-auto">
            <article
              className="post-body prose-blog"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </section>

          <section className="relative md:px-12 px-5 md:pb-32 pb-20 max-w-3xl mx-auto text-center">
            <div className="border-t border-milk/10 pt-12">
              <p className="font-paragraph text-milk/60 mb-6">
                Ready to run your own kitchyn?
              </p>
              <Link
                to="/"
                className="inline-block bg-milk text-[#10002b] font-paragraph font-bold uppercase tracking-wider rounded-full md:px-8 px-6 md:py-4 py-3 hover:bg-[#e0aaff] transition-colors"
              >
                Book a demo
              </Link>
            </div>
          </section>
        </>
      )}

      <footer className="relative md:px-12 px-5 md:py-12 py-8 border-t border-milk/10">
        <div className="flex md:flex-row flex-col md:justify-between justify-center items-center gap-4 font-paragraph text-milk/50 text-sm">
          <p>Copyright © 2026 Kitchyn — All Rights Reserved</p>
          <Link to="/blog" className="hover:text-milk transition-colors">
            ← All stories
          </Link>
        </div>
      </footer>
    </main>
  );
};

export default BlogPostPage;
