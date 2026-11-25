# Kothakota Rakesh — One-Page Social Hub & Portfolio

A lightweight **single-page link hub** with GitHub, LinkedIn, email, and optional Instagram / WhatsApp / phone buttons. It is also the starting point for my more detailed animated developer portfolio.

## Open the pages

- **My links (main page):** https://kothakotarakesh.github.io/Power2808-tech/
- **Full animated developer portfolio:** https://kothakotarakesh.github.io/Power2808-tech/portfolio.html
- **Source repository:** https://github.com/KothakotaRakesh/Power2808-tech

GitHub Pages builds from the public `main` branch and repository root. If publishing is still running, check **Settings → Pages** or **Actions**.

## Features

### Main link page
- Personal avatar, name, description, animated dark glass-card design
- LinkedIn, GitHub and email buttons
- Optional WhatsApp, Instagram and call buttons (automatically hidden until actual details are provided)
- Share button with native share or copy-link fallback
- Mobile-responsive layout and accessible reduced-motion styles

### Full portfolio
- Animated introduction and decorative background
- Skills, projects, GitHub repositories and contact section
- Advanced mouse-follow hover effects, particles and 3D card tilt with reduced-motion support

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Main, one-page social links hub |
| `assets/links.css` | Hub design, mobile layout and effects |
| `assets/links.js` | Optional contact links and page sharing |
| `portfolio.html` | Original full animated portfolio (preserved) |
| `assets/styles.css`, `assets/app.js` | Full portfolio styling and interaction |
| `assets/advanced-effects.css`, `assets/advanced-effects.js` | Advanced animations for full portfolio |
| `PROFILE_README.md` | GitHub profile README template |
| `assets/favicon.svg` | Site favicon |

## Add Instagram, WhatsApp and phone

Open **`assets/links.js`**, then edit only these fields with information you are comfortable publishing:

```js
const socialConfig = Object.freeze({
  instagram: "https://www.instagram.com/YOUR_USERNAME/",
  whatsapp: "+91XXXXXXXXXX",
  phone: "+91XXXXXXXXXX"
});
```

- Replace the sample strings with **your real profile URL and phone numbers**.
- Numbers must include the country code, e.g. `+91` for India.
- Leave a field as `""` to hide that button.
- Instagram is validated as an HTTPS link on instagram.com.
- WhatsApp uses `https://wa.me/<international-number>`; the number is published in the page source and can be seen by visitors.

**Privacy:** Adding your phone or WhatsApp number to a public page exposes it to everyone, including bots. Consider a separate professional contact number if privacy matters.

The LinkedIn URL and existing academic email are included in `index.html` from the public GitHub profile; verify them if you later change accounts.

## Preview locally

```bash
git clone https://github.com/KothakotaRakesh/Power2808-tech.git
cd Power2808-tech
python -m http.server 8000
```

Open http://localhost:8000 for the social hub or http://localhost:8000/portfolio.html for the full portfolio.

All site files work as static pages on GitHub Pages. No Node.js setup or backend is required.

## New contact page extras

- **QR code:** \`assets/contact-qr.svg\` contains a scannable image for the public contact-page URL, plus a download link on the page.
- **Save contact:** The \`Save my contact\` button downloads \`Kothakota-Rakesh-Contact.vcf\` with the already public name, phone, email, website, and social profiles.
- **WhatsApp quick message:** Opens a WhatsApp draft with a short greeting. Nothing is sent automatically.
- **Light/dark mode:** Visitors can switch the page theme; their preference is saved in their own browser where storage is available.
- **Motion:** Subtle link entrances, hover effects and animated accents are turned off with system \`prefers-reduced-motion\`.
- **Resume:** A disabled \`PDF coming soon\` display avoids a broken link until a genuine resume PDF is supplied.

These enhancements live in \`assets/links-upgrades.css\` and \`assets/links-upgrades.js\` so the original page and links remain easy to maintain. The \`portfolio.html\` page is unchanged.

**Privacy note:** Contact phone and WhatsApp numbers are intentionally public in the page and downloadable vCard. Do not share a private number here.
