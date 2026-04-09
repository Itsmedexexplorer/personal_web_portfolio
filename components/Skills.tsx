"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  HoverSlider,
  HoverSliderImage,
  HoverSliderImageWrap,
  TextStaggerHover,
} from "@/components/ui/animated-slideshow";

const SKILL_SLIDES = [
  { id: "slide-1", title: "Python", imageUrl: "/skills/python.png" },
  { id: "slide-2", title: "C++", imageUrl: "/skills/c++.png" },
  { id: "slide-3", title: "SQL", imageUrl: "/skills/sql.png" },
  { id: "slide-4", title: "Web Dev", imageUrl: "/skills/webdev.png" },
];

export function Skills() {
    return (
        <section id="skills" className="scroll-mt-32 w-full max-w-7xl mx-auto py-20 px-8 bg-[#FAFAFA]">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16 text-center"
            >
                <h2 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-6">
                    Skills
                </h2>
                <p className="font-sans text-neutral-500 max-w-xl mx-auto text-lg mb-8">
                    Technologies I work with
                </p>
            </motion.div>

            <HoverSlider className="w-full py-8 md:py-16">
              <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
                
                {/* LEFT: Skill names */}
                <div className="flex flex-col space-y-4 md:space-y-6 text-neutral-800">
                  {SKILL_SLIDES.map((slide, index) => (
                    <TextStaggerHover
                      key={slide.id}
                      index={index}
                      text={slide.title}
                      className="cursor-pointer text-4xl md:text-5xl font-sans font-bold uppercase tracking-tighter hover:text-black transition-colors"
                    />
                  ))}
                </div>

                {/* RIGHT: Images */}
                <HoverSliderImageWrap className="w-[420px] h-[320px] rounded-2xl overflow-hidden flex-shrink-0">
                  {SKILL_SLIDES.map((slide, index) => (
                    <div key={slide.id} className="w-full h-full">
                      <HoverSliderImage
                        index={index}
                        imageUrl={slide.imageUrl}
                        src={slide.imageUrl}
                        alt={slide.title}
                        className="w-full h-full object-cover rounded-2xl"
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                  ))}
                </HoverSliderImageWrap>

              </div>
            </HoverSlider>
        </section>
    );
}
