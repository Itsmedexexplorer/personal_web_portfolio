
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
        title: "Fintech Dashboard",
        description: "A comprehensive dashboard for tracking financial metrics, featuring real-time data visualization and intuitive user flows. (UI/UX Design • 2024)",
        link: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
        color: "#16213e", // Navy
    },
    {
        title: "E-Commerce App",
        description: "Mobile-first shopping experience optimized for conversion. Includes gesture-based navigation and seamless checkout. (Mobile Design • 2023)",
        link: "https://images.unsplash.com/photo-1472851294608-415522f96319?q=80&w=800&auto=format&fit=crop",
        color: "#c35e3d", // Rust
    },
    {
        title: "Travel Brand Identity",
        description: "Complete visual identity system including logo usage, typography, and color palette for a luxury travel agency. (Branding • 2023)",
        link: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop",
        color: "#262626", // Neutral
    },
    {
        title: "Health Tracker",
        description: "Cross-platform application for monitoring daily health stats. Focus on accessibility and dark mode support. (Product Design • 2022)",
        link: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
        color: "#57534e", // Stone
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
