# Transcript PDFs

Place public transcript PDFs in this folder so the Education section can link to them next to the GPA and distinction details.

Expected filenames:

- `byu-transcript.pdf` — college transcript link shown on the Brigham Young University graduate education card.
- `gridley-high-school-transcript.pdf` — high school transcript link shown on the Gridley High School education card.

After adding or replacing a transcript PDF:

1. Keep the filename exactly as listed above, or update the matching `href` in `data/education.json`.
2. Commit and push the PDF along with the JSON change.
3. Let GitHub Pages redeploy the site.
4. Open the Education section and test the transcript button.

Privacy note: transcripts often include birthdates, student IDs, addresses, or other sensitive data. Redact anything you do not want public before committing the PDFs to this repository.
