# Gabriel M. Perry Personal Website

A modular, static personal website designed as an extended resume and research profile. It is ready for GitHub Pages and uses plain HTML, CSS, JavaScript, and JSON—no build step required.

The site is viewable at https://perrygabriel.github.io/resume/

## Launch on GitHub Pages

1. Create a new GitHub repository, for example `gabriel-perry-site`.
2. Copy the contents of this folder into the repository root.
3. Push to the `main` branch.
4. In GitHub repository settings, open **Pages**.
5. Choose either:
   - **Deploy from a branch**: `main` / root, or
   - **GitHub Actions**: the included workflow in `.github/workflows/deploy-pages.yml`.

The site uses relative asset paths, so it works both as a user site and as a project site.

## Local preview

From the repository root:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Content architecture

All editable content is separated into human-readable JSON files in `data/`:

- `site.json` — site title, hero text, CTA buttons, theme metadata
- `profile.json` — name, bio, research areas, external links, highlights
- `contact.json` — public contact links and non-rendered private contact fields
- `research.json` — research roles and projects
- `publications.json` — publications and links
- `projects.json` — selected GitHub/project cards
- `education.json` — degrees and distinctions
- `teaching.json` — TA and mentorship roles
- `skills.json` — grouped skill tags
- `experience.json` — additional professional experience
- `achievements.json` — strengths and distinctions
- `section-order.json` — page section order and sidebar order

`assets/js/site.js` loads those files and renders the page dynamically.

## Privacy note

The resumes supplied for this build contain a phone number and full street address. Those values are preserved in `data/contact.json` for easy editing, but are intentionally **not rendered publicly by default**. Change their `public` flags and the renderer if you truly want them displayed.


## Transcript PDFs

The Education section includes transcript buttons that point to PDFs in `assets/docs/transcripts/`:

- `assets/docs/transcripts/byu-college-transcript.pdf`
- `assets/docs/transcripts/gridley-high-school-transcript.pdf`

To publish transcripts, add redacted PDF copies with those exact filenames, commit them, and push the site. See `assets/docs/transcripts/README.md` for the full checklist and privacy warning.

## Profile photo

The sidebar avatar is driven by the `photo` object in `data/profile.json`. To replace the initials with a headshot:

1. Add a square image file, for example `assets/images/profile.jpg`.
2. Set `photo.src` in `data/profile.json` to that relative path.
3. The site crops the square image with `object-fit: cover` and displays it as a circle. If `photo.src` is blank, the `photo.fallbackText` initials are shown instead.

## Included design features

- BYU-blue and white palette
- Hero banner with call-to-action buttons
- Sticky desktop sidebar and responsive mobile layout
- Section cards, publication links, project cards, and grouped skills
- Browser tab favicon / monogram icon
- Downloadable resume PDF at `assets/docs/gabriel-perry-resume.pdf`
- GitHub Pages deploy workflow and `.nojekyll` support

## Suggested next customizations

- Add a professional headshot or lab photo to `assets/images/`
- Expand `projects.json` with repositories you want to feature prominently
- Add a `news.json` section for talks, awards, or updates
- Replace the current resume PDF whenever you update your CV

## License

MIT License. See `LICENSE`.
