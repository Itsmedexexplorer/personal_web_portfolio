
export const NAV_ITEMS = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Project' },
    { id: 'certifications', label: 'Credentials' },
    { id: 'contact', label: 'Hire Me!', isCta: true },
];

export const SKILLS = [
    {
        name: "Python",
        icon: "/skills/python.png",
    },
    {
        name: "C++",
        icon: "/skills/C++.png",
    },
    {
        name: "Web Development",
        icon: "/skills/webdev.png",
    },
    {
        name: "SQL",
        icon: "/skills/SQL.png",
    },
];

export const PROJECTS = [
    {
        title: "Kisan Mitr AI",
        label: "HACKATHON PROJECT",
        badges: "Hackathon Project • Team Project • Contributor",
        description: "AI-powered farming assistant designed to help farmers identify crop diseases, monitor crop health, and access agricultural insights.\n\nBuilt as part of a team during a hackathon. I contributed to product development, implementation, and execution.",
        cta: "Visit Demo →",
        link: "https://kisan-mitra-ai-1.vercel.app/",
        image: "/projects/project1.png",
        color: "#1e392a", // Deep forest green
    },
    {
        title: "Nexa Tech",
        label: "AGENCY WEBSITE",
        badges: "Founder • Agency • Live",
        description: "An AI automation agency helping businesses save time through intelligent systems, workflows, and automations.\n\nPhilosophy:\n\n\"People don't want to be automated.\nThey want to be freed.\"",
        cta: "Visit Website →",
        link: "https://www.nexa-tech.in/",
        image: "/projects/project2.png",
        color: "#0f0f11", // Obsidian black
    },
    {
        title: "WA CRM",
        label: "CLIENT SOLUTION",
        badges: "Client Solution • WhatsApp Automation",
        description: "A WhatsApp-first CRM and automation platform for businesses.\n\nFeatures:\n• Contact Management & Pipelines\n• Broadcasts & Workflow Automation\n\n(Client-focused, not publicly available)",
        cta: "Need something similar? Let's talk →",
        link: "#contact",
        image: "/projects/project3.png",
        color: "#0b1b32", // Deep navy blue
    },
    {
        title: "Cafe Web",
        label: "FRONTEND EXPLORATION",
        badges: "Frontend Project • Live Demo",
        description: "A modern café website built to explore premium UI design, responsiveness, storytelling, and conversion-focused landing page experiences.",
        cta: "View Demo →",
        link: "https://demo-cafeweb.vercel.app/",
        image: "/projects/project4.png",
        color: "#3e2723", // Warm espresso brown
    },
    {
        title: "ANYA CLI",
        label: "OPEN SOURCE TOOL",
        badges: "Currently Building • Open Source",
        description: "A terminal-native AI companion serving as an intelligent operating layer for developers.\n\nVision: \"ChatGPT meets the terminal.\"\n\nFeatures planned:\n• AI workflows & Tool integrations\n• Local-first capabilities\n• Developer-focused automations",
        cta: "Follow Development →",
        link: "https://github.com/Itsmedexexplorer/ANYA",
        image: "/projects/project5.png",
        color: "#121212", // Charcoal black
    }
];



export const CURRENT_ROLES = [
    {
        role: "President",
        organization: "AI & Data Science Department",
        type: "Leadership",
    },
    {
        role: "B.Tech in Computer Science (AI & Data Science)",
        organization: "NIAT",
        type: "Academic",
    },
    {
        role: "Winner",
        organization: "Ideathon By NIAT",
        type: "Global Hackathon",
    },
    {
        role: "AI Automations & Responsive Web Builder",
        organization: "Freelance / Indie",
        type: "Builder",
    },
];

export interface Certificate {
    id: number;
    title: string;
    category: string;
    year: string;
    color: string;
    image: string;
    modalInfo: string;
}

export const CERTIFICATIONS: Certificate[] = [
    {
        id: 1,
        title: "GENAI BUILDATHON",
        category: "GENERATIVE AI",
        year: "Sep 15, 2025",
        color: "bg-neutral-900",
        image: "/Certificates/genai_buildathon.jpeg",
        modalInfo: "OpenAI Academy x NxtWave | Generative AI Mastery Workshop | Sep 15, 2025"
    },
    {
        id: 2,
        title: "GOOGLE FOR STARTUPS",
        category: "STARTUPS",
        year: "Dec 29, 2025",
        color: "bg-neutral-800",
        image: "/Certificates/google_startups.jpeg",
        modalInfo: "Google for Startups | Startup School: Prompt to Prototype | Dec 29, 2025"
    },
    {
        id: 3,
        title: "NASA SPACE APPS",
        category: "HACKATHON",
        year: "Oct 4–5, 2025",
        color: "bg-neutral-900",
        image: "/Certificates/nasa_hackathon.jpeg",
        modalInfo: "NASA International Space Apps Challenge | Galactic Problem Solver | Oct 4–5, 2025"
    },
    {
        id: 4,
        title: "OUTSKILL MASTERMIND",
        category: "AI",
        year: "2025",
        color: "bg-neutral-800",
        image: "/Certificates/outskill.jpeg",
        modalInfo: "Outskill | Generative AI Mastermind | Vaibhav Sisinty, Founder"
    },
    {
        id: 5,
        title: "TEXT EMBEDDINGS",
        category: "LLM SYSTEMS",
        year: "Feb 24, 2026",
        color: "bg-neutral-900",
        image: "/Certificates/Text%20Embeddings.jpeg",
        modalInfo: "NIAT Masterclass | Applying Text Embeddings in LLM Systems | Flipkart Data Scientist | Feb 24, 2026"
    },
];
