import { useGSAP } from "@gsap/react";
import ClipPathTitle from "../components/ClipPathTitle";
import gsap from "gsap";
import VideoPinSection from "../components/VideoPinSection";

const BenefitSection = () => {
  useGSAP(() => {
    const revealTl = gsap.timeline({
      delay: 1,
      scrollTrigger: {
        trigger: ".benefit-section",
        start: "top 60%",
        end: "top top",
        scrub: 1.5,
      },
    });

    revealTl
      .to(".benefit-section .first-title", {
        duration: 1,
        opacity: 1,
        clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
        ease: "circ.out",
      })
      .to(".benefit-section .second-title", {
        duration: 1,
        opacity: 1,
        clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
        ease: "circ.out",
      })
      .to(".benefit-section .third-title", {
        duration: 1,
        opacity: 1,
        clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
        ease: "circ.out",
      })
      .to(".benefit-section .fourth-title", {
        duration: 1,
        opacity: 1,
        clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
        ease: "circ.out",
      });
  });

  return (
    <section className="benefit-section">
      <div className="container mx-auto pt-20">
        <div className="col-center">
          <p>Here's what you get.</p>

          <div className="mt-20 col-center">
            <ClipPathTitle
              title={"1% commission. Full stop."}
              color={"#f5f0ff"}
              bg={"#5a189a"}
              className={"first-title"}
              borderColor={"#10002b"}
            />
            <ClipPathTitle
              title={"Live in 24 hours."}
              color={"#10002b"}
              bg={"#f5f0ff"}
              className={"second-title"}
              borderColor={"#10002b"}
            />
            <ClipPathTitle
              title={"Your customers, always."}
              color={"#f5f0ff"}
              bg={"#240046"}
              className={"third-title"}
              borderColor={"#10002b"}
            />
            <ClipPathTitle
              title={"Built to scale"}
              color={"#10002b"}
              bg={"#c77dff"}
              className={"fourth-title"}
              borderColor={"#10002b"}
            />
          </div>

          <div className="md:mt-0 mt-10">
            <p>And much more ...</p>
          </div>
        </div>
      </div>

      <div className="relative overlay-box">
        <VideoPinSection />
      </div>
    </section>
  );
};

export default BenefitSection;
