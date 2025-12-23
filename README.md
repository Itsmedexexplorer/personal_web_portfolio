# Portfolio 2025 - Fluid & Reactive

A highly interactive, premium personal portfolio website exploring the concepts of **Agentic Intelligence** and **Human-AI Synergy**. Built with modern web technologies to deliver a "fluid" and "reactive" user experience.

## 🚀 Technical Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion v12](https://www.framer.com/motion/)
- **Smooth Scroll**: [Lenis](https://lenis.studio/)
- **Language**: TypeScript

## ✨ Key Features & "Juice"

This portfolio was designed to feel alive. Every interaction provides feedback, and navigation feels continuous rather than abrupt.

### Core Experience
- **Momentum Scrolling**: Integrated `Lenis` for silky-smooth, inertial scrolling that completely transforms the browsing feel.
- **Custom Magnetic Cursor**: A custom trailing cursor that snaps to interactive elements (buttons, links) with a magnetic pull effect.
- **Global Texture**: A subtle noise/grain overlay that adds depth and a "film" visual quality to the digital interface.

### Component Highlights

#### 1. Hero Section
- **Staggered Text Reveal**: The main headline animates letter-by-letter on load for a dramatic entrance.
- **Magnetic Buttons**: Call-to-action buttons physically pull towards your cursor when you hover near them.

#### 2. Selected Works (Projects)
- **Stacking Cards Layout**: Projects are presented as a vertical stack of large, immersive cards.
- **Parallax Scroll**: As you scroll, cards stack on top of each other with a subtle scale effect, creating a feeling of depth.
- **Rich Details**: Visual focus on high-quality imagery with context-rich descriptions.

#### 3. Credentials (Certifications)
- **Expand-on-Hover Accordion**: A reactive horizontal layout that expands the hovered item to reveal details.
- **Responsive Design**: Gracefully transforms into a clean vertical stack on mobile devices.
- **Visual Feedback**: Hover states trigger immediate expansion and opacity changes for non-focused items.

#### 4. Intelligent Navbar
- **Active State Tracking**: The navbar uses an `IntersectionObserver` to track which section is currently in view.
- **Floating Pill Animation**: A white "pill" background smoothly glides behind the active link, visualizing your journey through the page.
- **Glassmorphism**: The navbar sits on a blurred, semi-transparent background that separates it from the content.

## 🔄 Development Iterations

The development of this portfolio progressed through several focused phases:

### Version 1.0: Foundation
- Project scaffolding with Next.js and Tailwind CSS.
- Basic component architecture (Hero, About, Projects, Contact).
- Implementation of the "Paper & Ink" aesthetic color palette.

### Version 2.0: Content & Structure
- Population of real data (Experience, Certifications, Bio).
- Refinement of typography using *Merriweather* and *Playfair Display*.
- Implementation of the "Timeline" component for the Experience section.

### Version 3.0: "The Fluidity Update" (Current)
- **Objective**: Make it "Fluid & Reactive".
- **Infrastructure**: Added `Lenis` smooth scroll and global noise.
- **Interaction**: Built `Magnetic` button wrappers and `CustomCursor`.
- **Layout Swap**: Swapped the UI patterns for "Projects" and "Credentials" based on content density:
    *   *Projects* moved to **Stacking Cards** (better for storytelling).
    *   *Credentials* moved to **Expand-on-Hover** (better for scanning).

## 🛠️ Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/YourUsername/personal-web-portfolio.git
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open**: [http://localhost:3000](http://localhost:3000)

## 📄 License
[MIT](LICENSE)
