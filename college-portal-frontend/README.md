# College Portal Frontend (Student Management System)

A responsive, pixel-accurate web frontend replicating the **College Portal Login Page** from the Google Stitch design canvas.

## Features & Highlights

1. **Exact Visual Match to Stitch Design System**:
   - **Color Palette**: Warm sand background (`#FAF7EE`), institutional yellow highlights (`#FFD233`), deep charcoal typography, emerald operational indicators, and subtle warm borders.
   - **Typography & Components**: Modern geometric sans-serif, custom badges, persona pills, and clear layout hierarchy.

2. **Full Dynamic Interactions**:
   - **Portal Persona Switcher**: Seamlessly toggle between **Student**, **Faculty**, and **Admin / IT**.
     - Dynamic field labels, custom format placeholders (`STU-2024-0041`, `FAC-BIO-8902`, `ADM-SEC-0112`), helper text, and CTA buttons update on the fly.
   - **Password Visibility**: Interactive show/hide toggle.
   - **Format ID Dialog**: Modal displaying identity syntax rules for matriculation cards and barcode badges.
   - **Live Inactive Session Countdown**: Live 15-minute countdown clock reflecting institutional security timeout rules.
   - **Self-Recovery & Enrollment Activation**: Interactive modals for PIN verification and 2FA self-service.
   - **Simulated Authentication**: Loading state on submit button followed by feedback toast.

3. **Dual Preview Modes (Desktop & Mobile)**:
   - Includes a top switcher to toggle between **Desktop Canvas** and the exact **Mobile Preview frame** as designed in the Stitch project.

## Project Structure

```
college-portal-frontend/
├── index.html       # Semantic HTML markup and layout
├── styles.css       # Custom design tokens, transitions, and component styles
├── app.js           # Client-side interactions and state management
└── README.md        # Documentation and guide
```

## How to Run

Double click `index.html` in File Explorer or open it in any browser (Chrome, Edge, Firefox). No build step, Node.js, or server installation required!
