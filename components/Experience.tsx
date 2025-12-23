import { Timeline } from "@/components/ui/timeline";

export function Experience() {
    const data = [
        {
            title: "Computer Science Student @ NIAT",
            date: "Present",
            image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop", // Student/University
            link: "https://linkedin.com",
            content: (
                <p>
                    Currently pursuing Computer Science at NIAT Kolhapur in collaboration with Sanjay Ghodawat University.
                    Focusing on Agentic Intelligence, Human-AI Synergy, and building robust software solutions.
                </p>
            ),
        },
        {
            title: "Hackathon Winner",
            date: "2024",
            image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop", // Hackathon
            link: "https://linkedin.com",
            content: (
                <p>
                    Built an innovative AI-powered tool for accessibility. Led the team in design and development,
                    securing 1st place among 500+ participants.
                </p>
            ),
        },
        {
            title: "AI & Open Source Contributor",
            date: "2023",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop", // Collaboration
            link: "https://github.com",
            content: (
                <p>
                    Actively exploring agentic workflows and contributing to open-source AI projects.
                    Passionate about bridging the gap between theoretical AI models and practical applications.
                </p>
            ),
        },
    ];

    return (
        <div className="w-full bg-paper-light">
            <Timeline data={data} />
        </div>
    );
}
