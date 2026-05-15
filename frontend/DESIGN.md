# Conance Design System

This document outlines the design principles, tokens, and component patterns used in the Conance application.

## Design Philosophy

Conance is designed with a **Mobile-First** approach, focusing on accessibility, fluid typography, and premium aesthetics. The interface uses a warm, earthy color palette to reflect the "craft" and "artisanal" nature of the services provided.

## Typography

We use **Inter** as our primary font family. Font sizes are implemented using the `clamp` function for fluid scaling across different screen sizes.

### Headings
- **H1**: `--fs-h1` (Largest, used for Hero sections)
- **H2**: `--fs-h2` (Page titles)
- **H3**: `--fs-h3` (Section headers)
- **H4/H5**: Subheaders

### Body
- **B1**: Standard large body text (`1.125rem` - `1.3rem`)
- **B2**: Default body text (`1rem` - `1.125rem`)
- **B3**: Small body text/Metadata (`0.875rem` - `1rem`)
- **B4**: Caption/Micro-text

## Colors

### Brand Colors
- **Primary**: `#8C3118` (Deep Terracotta) - Used for primary actions, branding.
- **Primary2**: `#B84720` (Burnt Orange) - Used for highlights and gradients.

### Semantic Colors
- **Success**: `#12B76A` (Emerald) - Confirmations, completed states.
- **Error**: `#E74C3C` (Ruby) - Alerts, rejections, errors.
- **Warning**: `#F79009` (Amber) - Pending states, cautions.
- **Text Muted**: `#545454` (Grey) - Secondary text, placeholders.

### UI Colors
- **Accent/Border**: `#D9D9D9` (Light Grey) - Divider lines, subtle borders.
- **Background**: `#FFFFFF` (White) with subtle usage of `#F8FAFC` (Slate-50) for layouts.

## Spacing System

We use a 5-step fluid spacing scale (`s1` to `s5`) based on CSS variables.

- **s1 (Small)**: `0.5rem` - `1rem` (Inner component gaps)
- **s2 (Medium)**: `0.5rem` - `1rem` (Standard padding)
- **s3 (Large)**: `1.5rem` - `2.5rem` (Section spacing)
- **s4 (X-Large)**: `2rem` - `4rem` (Page margins)
- **s5 (XX-Large)**: `4rem` - `8rem` (Hero padding)

## UI Patterns & Components

### Buttons
- **Primary**: Rounded (`rounded-full` or `rounded-2xl`), bold typography, primary color background.
- **Active States**: Subtle scale down (`active:scale-95`) for tactile feedback.

### Cards & Containers
- **Border Radius**: Consistent usage of `rounded-2xl` (1rem) or `rounded-[20px]` for a modern, friendly feel.
- **Shadows**: Low-elevation shadows (`shadow-sm`, `shadow-md`) for depth.

### Chat Interface
- **Bubbles**: Rounded corners with role-based coloring (Primary for self, Accent for other).
- **Sticky Headers**: Chat details stay pinned at the top for context.

### Forms & Inputs
- **Inputs**: Large, easily tappable touch targets (`py-4`), rounded corners, and clear focus states.

## Responsive Design

- **Max Width**: The application is constrained to a maximum width of **500px** on all devices to maintain its mobile-app character even on desktop viewports.
- **Centering**: The main container is centered using `mx-auto`.

## Accessibility & UX

- **Loading States**: Pulser/Spinner animations used during API calls.
- **Empty States**: Friendly illustrations and clear "Call to Action" buttons when no data is available (e.g., empty Chat or Jobs list).
- **Haptic Feedback Simulation**: Micro-animations and transitions for button clicks and page changes.
