// ============================================================================
// REFERENCE ONLY — DO NOT PASTE THIS INTO THE REPO AS-IS.
// This is a React usage snippet for the "AnimatedDock" component (hextaui /
// 21st.dev style). The Asa Fabric site is VANILLA HTML/CSS/JS.
//
// The actual <AnimatedDock> component is NOT included here — this file only
// shows how it is *used*. What matters is the BEHAVIOR to replicate in the
// vanilla nav (.nav-links):
//   - A horizontal row of items.
//   - On hover, the hovered item (and its immediate neighbours, falling off
//     with distance) smoothly scale up / lift — the classic macOS-dock
//     magnification effect.
//   - Smooth spring-like easing on enter and leave.
// Re-create this in CSS + a few lines of vanilla JS in app.js. Do NOT add
// React, framer-motion, or lucide-react to this project.
// ============================================================================

import { Github, Twitter, Youtube, Flower } from "lucide-react";
import { AnimatedDock } from "@/components/ui/animated-dock";

const Demo = () => {
  return (
    <AnimatedDock
      items={[
        { link: "https://github.com/preetsuthar17", target: "_blank", Icon: <Github size={22} /> },
        { link: "https://x.com/preetsuthar17", target: "_blank", Icon: <Twitter size={22} /> },
        { link: "https://www.youtube.com/@preetsuthar17", target: "_blank", Icon: <Youtube size={22} /> },
        { link: "https://github.com/preetsuthar17/hextaui", target: "_blank", Icon: <Flower size={22} /> },
      ]}
    />
  );
};

export { Demo };
