"use client";
import { ReactLenis } from 'lenis/react';
import { useTransform, motion, useScroll, MotionValue } from 'motion/react';
import { useRef, forwardRef } from 'react';

interface ProjectData {
    title: string;
    description: string;
    link: string;
    color: string;
}

interface CardProps {
    i: number;
    title: string;
    description: string;
    url: string;
    color: string;
    progress: MotionValue<number>;
    range: [number, number];
    targetScale: number;
}

export const Card = ({
    i,
    title,
    description,
    url,
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
                className={`flex flex-col relative -top-[25%] h-[600px] w-[90%] md:max-w-6xl rounded-3xl p-10 origin-top shadow-2xl`}
            >
                <h2 className='text-3xl font-serif text-center font-semibold mb-6'>{title}</h2>
                <div className={`flex flex-col md:flex-row h-full gap-8`}>
                    <div className={`w-full md:w-[40%] relative md:top-[10%]`}>
                        <p className='text-base font-merriweather opacity-90'>{description}</p>
                        <span className='flex items-center gap-2 pt-4'>
                            <a
                                href={url}
                                target='_blank'
                                rel="noreferrer"
                                className='underline cursor-pointer font-bold'
                            >
                                Verify Credential
                            </a>
                            <svg
                                width='22'
                                height='12'
                                viewBox='0 0 22 12'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z'
                                    fill='currentColor'
                                />
                            </svg>
                        </span>
                    </div>

                    <div
                        className={`relative w-full md:w-[60%] h-48 md:h-full rounded-2xl overflow-hidden `}
                    >
                        <motion.div
                            className={`w-full h-full`}
                            style={{ scale: imageScale }}
                        >
                            <img src={url} alt='image' className='absolute inset-0 w-full h-full object-cover' />
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
            <div className='bg-paper-light border-t border-navy-700/10' ref={container}>
                <section className='text-navy-700 h-[30vh] w-full grid place-content-center'>
                    <h1 className='text-5xl md:text-7xl font-serif font-semibold text-center tracking-tight'>
                        {title}
                    </h1>
                    <p className="text-center font-merriweather text-navy-700/60 mt-4">
                        {description}
                    </p>
                </section>

                <section className='text-white w-full'>
                    {projects.map((project, i) => {
                        const targetScale = 1 - (projects.length - i) * 0.05;
                        return (
                            <Card
                                key={`p_${i}`}
                                i={i}
                                url={project.link}
                                title={project.title}
                                color={project.color}
                                description={project.description}
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
