import { useMediaQuery } from "react-responsive";
import { cards } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const TestimonialSection = () => {
  const isTablet = useMediaQuery({
    query: "(max-width: 1024px)",
  });

  useGSAP(() => {
    if (isTablet) return;

    gsap.set(".testimonials-section", {
      marginTop: "-140vh",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".testimonials-section",
        start: "top bottom",
        end: "200% top",
        scrub: true,
      },
    });

    tl.to(".testimonials-section .first-title", {
      xPercent: 70,
    })
      .to(
        ".testimonials-section .sec-title",
        {
          xPercent: 25,
        },
        "<"
      )
      .to(
        ".testimonials-section .third-title",
        {
          xPercent: -50,
        },
        "<"
      );

    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".testimonials-section",
        start: "10% top",
        end: "200% top",
        scrub: 1.5,
        pin: true,
      },
    });

    pinTl.from(".vd-card", {
      yPercent: 150,
      stagger: 0.2,
      ease: "power1.inOut",
    });
  });

  return (
    <section className="testimonials-section">
      <div className="absolute size-full flex flex-col items-center pt-[5vw]">
        <h1 className="text-black first-title">Don&apos;t take</h1>
        <h1 className="text-light-brown sec-title">our</h1>
        <h1 className="text-black third-title">word for it.</h1>
      </div>

      <div className="pin-box">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`vd-card ${card.translation ?? ""} ${card.rotation}`}
            style={{ backgroundColor: card.bg }}
          >
            <div className="size-full flex flex-col justify-between p-7 lg:p-[1.5vw]">
              <span
                className="font-sans font-bold leading-none select-none"
                style={{
                  fontSize: "clamp(4rem, 8vw, 7rem)",
                  color: card.accent,
                  opacity: 0.25,
                  lineHeight: 1,
                }}
              >
                &ldquo;
              </span>

              <p
                className="font-paragraph leading-[130%] text-white"
                style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.15rem)" }}
              >
                {card.quote}
              </p>

              <div
                className="flex flex-col gap-1 border-t pt-4"
                style={{ borderColor: card.accent + "40" }}
              >
                <span
                  className="font-sans font-bold uppercase tracking-widest text-sm"
                  style={{ color: card.accent }}
                >
                  {card.name}
                </span>
                <span
                  className="font-paragraph text-xs"
                  style={{ color: card.accent, opacity: 0.6 }}
                >
                  {card.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
