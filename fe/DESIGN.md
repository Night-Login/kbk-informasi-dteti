---
name: KBK Informasi discovery surfaces
description: User-directed low-fidelity landing and event revamp; scoped to / and /events.
colors:
  ink: "#202124"
  background: "#ffffff"
  hero: "#707070"
  card: "#d9d9d9"
  media: "#ececec"
typography:
  display:
    fontFamily: "Public Sans, Arial, sans-serif"
    fontSize: "clamp(28px, 3.15vw, 48px)"
    fontWeight: 750
    lineHeight: 1.18
    letterSpacing: "-0.025em"
rounded:
  card: "8px"
  button: "6px"
spacing:
  card: "16px"
  grid: "24px"
---
# Design System: KBK Informasi discovery surfaces

## Overview
The supplied grayscale wireframes govern the landing and event surfaces. This is an intentional low-fidelity phase, not a replacement institutional palette for all routes. Other pages retain their existing blue/yellow system.

## Colors
White canvas, #707070 hero, #d9d9d9 cards, #ececec solid media placeholders, #202124 ink. Placeholder areas are deliberately solid rather than checkerboards or photographs.

## Typography
Retain Public Sans. Hero uses the display token; card headings are 19–23px, body 14–15px, metadata 12px. Mobile hero is 31px at widths up to 700px.

## Layout
Container width min(90%, 1440px). Article feed max-width 760px; event/news grids have four columns, two at 1050px and one at 480px. Featured news uses two columns until 700px. Footer uses three, two, then one column. Header switches to a mobile menu at 700px.

## Elevation & Depth
Flat tonal surfaces with no card shadows. Selected tabs use an underline; focus uses a 2px outline.

## Shapes
Cards use 6–8px corners; media 3px. UGM mark comes from the user-supplied PNG. The editorial avatar uses a circular placeholder.

## Components
Hero uses a dedicated inline search component with results below its input. The header search opens the separate shared modal. Rotating search prompts run for 16 seconds; cluster marquee runs for 40 seconds, stops on hover/focus. Reduced motion shows static text and wrapped cluster links. Tabs support arrows/Home/End. Events retain date, duration, location, description disclosure and calendar. Loading, error, retry and empty states use plain text. Explicit ?preview=1 fixtures carry a notice and never replace live API failures. Article and News currently share the existing news API model; no social counts are fabricated.

## Do's and Don'ts
- Do preserve user-directed low-fidelity placeholder blocks.
- Do keep database content and labeled preview fixtures distinct.
- Do keep this system scoped to landing and events.
- Do not infer final brand colors or a new content model from the wireframe.

English is the interface language; official proper names remain unchanged. Shared search uses a plain white dialog, gray border, one input and compact text-only results. It has no popular-topic chips, imagery or badges. The native modal handles focus containment and Escape, and search requests discard aborted responses.

Navigation stays fixed and transitions from a spacious transparent header to a compact white bar after 80px of scrolling, with dark text and logo. Returning to the top restores the initial state. Desktop uses text links; the original dropdown menu is mobile-only. Footer social links use icons. Hero and cluster pause/resume buttons are removed.
