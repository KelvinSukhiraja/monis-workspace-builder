# Design and implementation plan

## Objective

Make it easy to build a workspace visually, understand its rental cost and review the selection before submitting a demo request.

## Process

1. Discuss the user journey, product scope and technical approach with AI.
2. Explore visual directions before implementation. Select the warm architectural concept with oak, limestone tones, olive accents and bold typography.
3. Build the functional prototype using simple 3D geometry. Validate product replacement, accessories, templates, pricing and checkout before investing in detailed assets.
4. Apply the selected interface direction and refine individual interactions. Keep state and pricing independent from visual components so small adjustments remain straightforward.
5. Verify the complete flow on desktop and mobile layouts, document the limitations and prepare the repository for review.

## Design reference

[Selected concept](design/concept-a.png)

The concept was generated with AI to establish the visual direction. The application uses locally authored procedural geometry and vector product illustrations. The reference image is not used as the interactive scene.

## Current implementation

The MVP includes an empty room, two desks, two chairs, accessories, four editable templates, undo, explicit weekly and monthly rates, saved configurations and a demo rental request. Products occupy fixed positions, and every selection appears in both the room and the itemized summary.

## Future work

The next iteration would focus on movable furniture, more accurate product models, room customization and testing on physical devices. Inventory and booking integration would follow once the product experience is validated.
