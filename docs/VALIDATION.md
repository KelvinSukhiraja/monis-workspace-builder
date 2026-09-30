# Validation

## Automated checks

The repository checks formatting, TypeScript, configuration behavior, the production build and browser interactions. The GitHub Actions workflow runs these checks for pushes and pull requests.

Configuration tests cover product replacement, template changes, undo, removal, pricing and validation of saved data. Browser tests cover the complete rental journey, desktop and mobile layouts, keyboard navigation, blocked browser storage and unavailable WebGL.

## Visual review

The desktop layout was reviewed at 1440 by 1000 pixels and the mobile layout at 390 by 844 pixels. The checks included room rendering, camera controls, horizontal overflow and checkout layout.

1. [Desktop setup](preview/desktop-founder.png)
2. [Desktop checkout](preview/checkout.png)
3. [Mobile setup](preview/mobile-studio.png)
4. [Mobile checkout](preview/mobile-checkout.png)

## Limitations

Automated rendering uses software WebGL. It verifies functionality rather than performance on physical hardware. Detailed materials, realistic product assets and testing on actual mobile devices remain future work. The checkout is a local demonstration with no booking or payment backend.
