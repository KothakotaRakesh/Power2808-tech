# Rakesh | Animated Developer Portfolio

A responsive, animated developer website for **Kothakota Rakesh**, B.Tech AI/ML student and full-stack developer.

## Features

- Dark futuristic visual design, animated gradient accents and floating code panel
- Dynamic typing effect and decorative star field
- Mobile-friendly navigation and accessible keyboard controls
- Reduced-motion support for visitors who prefer less animation
- Project cards with **All / Featured builds / On GitHub** filters
- Real links to public academic repositories (without pretending that project prototypes are published)

## Site files

- `index.html` — page structure, projects and content
- `assets/styles.css` — visual design, layout, mobile styles and animations
- `assets/app.js` — typed roles, interactive filtering, navigation and editable social links
- `assets/favicon.svg` — R monogram favicon

## Preview locally

Clone the repository and start a static server:

```bash
git clone https://github.com/KothakotaRakesh/Power2808-tech.git
cd Power2808-tech
python -m http.server 8000
```

Visit http://localhost:8000 in your browser.

## Publish with GitHub Pages

1. Open this repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Choose **main** and **/(root)**, then click **Save**.
4. Once GitHub completes publication, your site should be accessible at:
   **https://kothakotarakesh.github.io/Power2808-tech/**

The URL above is the expected Pages URL; it is **not** a claim that Pages is already enabled or live.

## Add your social links

Open `assets/app.js` and find:

```js
const socialLinks={linkedin:"",instagram:"",resume:""};
```

Replace empty strings with your real full HTTPS URLs. The links will appear in the Contact section. Empty fields stay hidden, avoiding broken links.

## GitHub profile README

`PROFILE_README.md` contains a ready-to-use animated GitHub profile README. To activate it:

1. Create a **public** repository named exactly **KothakotaRakesh** under the GitHub account **KothakotaRakesh**.
2. Add a file named `README.md` to that new repository.
3. Copy the contents of this repository's `PROFILE_README.md` into that README and commit.

GitHub will then display the README on the user's profile. Third-party typing/stats widgets may occasionally be unavailable.

## Notes

No tracking scripts, build steps, paid dependencies or API keys are required. External font and GitHub links need internet connectivity. Content and branding can be customized.
