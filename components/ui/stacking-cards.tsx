"use client";
import { ReactLenis } from 'lenis/react';
import { useTransform, motion, useScroll, MotionValue } from 'motion/react';
import { useRef, forwardRef } from 'react';

interface ProjectData {
    title: string;
    label: string;
    badges: string;
    description: string;
    cta: string;
    link: string;
    image: string;
    color: string;
}

interface CardProps {
    i: number;
    title: string;
    label: string;
    badges: string;
    description: string;
    cta: string;
    url: string;
    image: string;
    color: string;
    progress: MotionValue<number>;
    range: [number, number];
    targetScale: number;
}

export const Card = ({
    i,
    title,
    label,
    badges,
    description,
    cta,
    url,
    image,
    color,
    progress,
    range,
    targetScale,
}: CardProps) => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start'],
    });

    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
    const scale = useTransform(progress, range, [1, targetScale]);

    return (
        <div
            ref={container}
            className='h-screen flex items-center justify-center sticky top-0'
        >
            <motion.div
                style={{
                    backgroundColor: color,
                    scale,
                    top: `calc(-5vh + ${i * 25}px)`,
                }}
                className={`flex flex-col relative -top-[25%] md:-top-[25%] h-[550px] md:h-[600px] w-[90%] md:max-w-5xl rounded-3xl md:rounded-[2.5rem] p-6 md:p-14 origin-top shadow-2xl text-white border border-white/10 overflow-hidden`}
            >
                <div className={`flex flex-col md:flex-row h-full gap-6 md:gap-12`}>
                    <div className={`w-full md:w-[45%] flex flex-col justify-between`}>
                        <div>
                            <p className="text-[10px] md:text-xs font-sans tracking-[0.2em] uppercase text-white/60 mb-4 md:mb-6 flex items-center">
                                {label}
                                <span className="mx-2 opacity-40">•</span>
                                0{i + 1}
                            </p>
                            <h2 className='text-3xl md:text-5xl font-serif font-semibold mb-4 md:mb-6 leading-tight'>{title}</h2>
                            <p className="text-[10px] md:text-xs font-sans tracking-wider uppercase text-white/80 mb-4 md:mb-8 border-l-2 border-white/20 pl-3 md:pl-4 py-0.5 md:py-1">
                                {badges}
                            </p>
                            <p className='text-xs md:text-base font-sans opacity-80 leading-relaxed whitespace-pre-wrap'>
                                {description}
                            </p>
                        </div>
                        <span className='flex items-center gap-3 pt-6 md:pt-8 mt-2 md:mt-auto'>
                            <a
                                href={url}
                                target='_blank'
                                rel="noreferrer"
                                className='inline-flex items-center justify-center gap-2 bg-white text-black px-5 md:px-6 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-medium hover:scale-105 transition-transform w-max max-w-full text-center'
                            >
                                {cta}
                            </a>
                        </span>
                    </div>

                    <div
                        className={`relative w-full md:w-[55%] h-48 sm:h-64 md:h-full rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl bg-black/20 shrink-0 mt-4 md:mt-0`}
                    >
                        <motion.div
                            className={`w-full h-full`}
                            style={{ scale: imageScale }}
                        >
                            <img src={image} alt={title} className='absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity' />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

interface ComponentRootProps {
    projects: ProjectData[];
    title: string;
    description: string;
}

const StackingCards = forwardRef<HTMLElement, ComponentRootProps>(({ projects, title, description }, ref) => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end'],
    });

    return (
        <ReactLenis root>
            <div className='bg-[#FAFAFA] pt-20' ref={container}>
                <section className='text-neutral-900 h-[30vh] w-full flex flex-col items-center justify-center mb-10'>
                    <h1 className='text-5xl md:text-7xl font-serif mb-6 text-center tracking-tight'>
                        {title}
                    </h1>
                    <p className="text-center font-sans text-neutral-500 text-lg">
                        {description}
                    </p>
                </section>

                <section className='w-full'>
                    {projects.map((project, i) => {
                        const targetScale = 1 - (projects.length - i) * 0.04;
                        return (
                            <Card
                                key={`p_${i}`}
                                i={i}
                                url={project.link}
                                image={project.image}
                                title={project.title}
                                label={project.label}
                                badges={project.badges}
                                color={project.color}
                                description={project.description}
                                cta={project.cta}
                                progress={scrollYProgress}
                                range={[i * 0.25, 1]}
                                targetScale={targetScale}
                            />
                        );
                    })}
                </section>
            </div>
        </ReactLenis>
    );
});

StackingCards.displayName = 'StackingCards';

export default StackingCards;
