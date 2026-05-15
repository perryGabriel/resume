const DATA_FILES = {
  site: "data/site.json",
  profile: "data/profile.json",
  contact: "data/contact.json",
  education: "data/education.json",
  research: "data/research.json",
  publications: "data/publications.json",
  teaching: "data/teaching.json",
  experience: "data/experience.json",
  skills: "data/skills.json",
  achievements: "data/achievements.json",
  projects: "data/projects.json",
  order: "data/section-order.json"
};

const SECTION_LABELS = {
  about: "About",
  research: "Research",
  publications: "Publications",
  projects: "Projects",
  education: "Education",
  teaching: "Teaching",
  skills: "Skills",
  experience: "Experience",
  achievements: "Distinctions",
  contact: "Contact"
};

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Unable to load ${path}: ${response.status}`);
  return response.json();
}

function renderHero(site) {
  const hero = document.querySelector("#hero");
  hero.innerHTML = `
    <div class="hero-inner">
      <p class="eyebrow">${escapeHtml(site.hero.eyebrow)}</p>
      <h2>${escapeHtml(site.hero.title)}</h2>
      <p>${escapeHtml(site.hero.subtitle)}</p>
      <div class="button-row">
        <a class="button primary" href="${escapeHtml(site.hero.primaryCta.href)}">${escapeHtml(site.hero.primaryCta.label)}</a>
        <a class="button secondary" href="${escapeHtml(site.hero.secondaryCta.href)}">${escapeHtml(site.hero.secondaryCta.label)}</a>
      </div>
    </div>`;
}

function renderLinks(links = []) {
  if (!links.length) return "";
  return `
    <div class="link-row">
      ${links.map((link) => `<a class="inline-link" href="${escapeHtml(link.href)}" target="_blank" rel="noreferrer noopener">${escapeHtml(link.label)}</a>`).join("")}
    </div>`;
}

function renderAvatar(profile) {
  const avatar = document.querySelector("#profile-avatar");
  const fallbackText = profile.photo?.fallbackText ?? profile.shortName?.split(" ").map((part) => part[0]).join("") ?? "GP";

  if (profile.photo?.src) {
    avatar.innerHTML = `<img src="${escapeHtml(profile.photo.src)}" alt="${escapeHtml(profile.photo.alt ?? profile.name)}" />`;
    avatar.classList.add("has-photo");
    avatar.removeAttribute("aria-hidden");
  } else {
    avatar.textContent = fallbackText;
    avatar.classList.remove("has-photo");
    avatar.setAttribute("aria-hidden", "true");
  }
}

function renderSidebar(profile, sectionOrder) {
  document.querySelector("#sidebar-name").textContent = profile.name;
  document.querySelector("#sidebar-headline").textContent = profile.headline;
  renderAvatar(profile);

  const nav = document.querySelector("#sidebar-nav");
  nav.innerHTML = sectionOrder.sections.map((section) => `
    <a href="#${escapeHtml(section)}"><span>${escapeHtml(SECTION_LABELS[section] ?? section)}</span><span aria-hidden="true">↗</span></a>
  `).join("");

  const links = document.querySelector("#sidebar-links");
  links.innerHTML = profile.links.map((link) => `
    <a href="${escapeHtml(link.href)}" target="_blank" rel="noreferrer noopener">
      <span>${escapeHtml(link.label)}</span><span aria-hidden="true">↗</span>
    </a>
  `).join("");
}

function renderHighlights(profile) {
  const container = document.querySelector("#highlights");
  container.innerHTML = profile.highlights.map((item) => `
    <article class="fact-card">
      <strong>${escapeHtml(item.value)}</strong>
      <span>${escapeHtml(item.label)}</span>
    </article>
  `).join("");
}

function panel(id, title, body, intro = "") {
  const introMarkup = intro ? `<p>${escapeHtml(intro)}</p>` : "";
  return `
    <section id="${escapeHtml(id)}" class="panel">
      <div class="section-header">
        <h2>${escapeHtml(title)}</h2>
        ${introMarkup}
      </div>
      ${body}
    </section>`;
}

function renderAbout(profile) {
  const paragraphs = profile.about.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  const pills = profile.researchAreas.map((area) => `<span class="pill">${escapeHtml(area)}</span>`).join("");
  return panel("about", "About", `
    <div class="rich-copy">${paragraphs}</div>
    <div class="pill-row">${pills}</div>
  `);
}

function renderTimelineSection(id, title, items) {
  const cards = items.map((item) => `
    <article class="timeline-card">
      <h3>${escapeHtml(item.role ?? item.degree)}</h3>
      <p class="timeline-meta">
        ${escapeHtml(item.organization ?? item.institution)}
        ${item.location ? ` · ${escapeHtml(item.location)}` : ""}
        ${item.dates ? ` · ${escapeHtml(item.dates)}` : ""}
      </p>
      ${item.summary ? `<p>${escapeHtml(item.summary)}</p>` : ""}
      ${item.details?.length ? `<ul class="clean-list">${item.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}</ul>` : ""}
      ${item.bullets?.length ? `<ul class="clean-list">${item.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>` : ""}
      ${renderLinks(item.links)}
    </article>
  `).join("");
  return panel(id, title, `<div class="timeline-grid">${cards}</div>`);
}

function renderPublications(publications) {
  const cards = publications.items.map((item) => `
    <article class="publication-card">
      <h3>${escapeHtml(item.title)}</h3>
      <p><strong>${escapeHtml(item.authors)}</strong></p>
      <p class="publication-meta">${escapeHtml(item.venue)} · ${escapeHtml(item.year)}</p>
      ${renderLinks(item.links)}
    </article>
  `).join("");
  return panel("publications", publications.sectionTitle, `<div class="publication-list">${cards}</div>`);
}

function renderProjects(projects) {
  const cards = projects.items.map((project) => `
    <article class="project-card">
      <span class="tag">${escapeHtml(project.tag)}</span>
      <h3><a class="project-title" href="${escapeHtml(project.href)}" target="_blank" rel="noreferrer noopener">${escapeHtml(project.name)}</a></h3>
      <p>${escapeHtml(project.description)}</p>
      ${renderLinks([{ label: "Open repository", href: project.href }, ...(project.links ?? [])])}
    </article>
  `).join("");
  return panel("projects", projects.sectionTitle, `<div class="project-grid">${cards}</div>`, projects.intro);
}

function renderSkills(skills) {
  const groups = skills.groups.map((group) => `
    <article class="skill-group">
      <h3>${escapeHtml(group.name)}</h3>
      <ul>${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </article>
  `).join("");
  return panel("skills", skills.sectionTitle, `<div class="skill-grid">${groups}</div>`);
}

function renderAchievements(achievements) {
  const cards = achievements.items.map((item) => `
    <article class="achievement-card">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
      ${renderLinks(item.links)}
    </article>
  `).join("");
  return panel("achievements", achievements.sectionTitle, `<div class="achievement-grid">${cards}</div>`);
}

function renderContact(contact) {
  const visibleContacts = contact.publicContact.filter((entry) => entry.public !== false);
  const cards = visibleContacts.map((entry) => `
    <article class="contact-card">
      <p class="timeline-meta">${escapeHtml(entry.label)}</p>
      <p><a href="${escapeHtml(entry.href)}">${escapeHtml(entry.value)}</a></p>
    </article>
  `).join("");
  return panel("contact", "Contact", `
    <div class="contact-grid">${cards}</div>
    ${contact.note ? `<div class="note-card">${escapeHtml(contact.note)}</div>` : ""}
  `);
}

function buildSections(data) {
  const renderers = {
    about: () => renderAbout(data.profile),
    research: () => renderTimelineSection("research", data.research.sectionTitle, data.research.items),
    publications: () => renderPublications(data.publications),
    projects: () => renderProjects(data.projects),
    education: () => renderTimelineSection("education", data.education.sectionTitle, data.education.items),
    teaching: () => renderTimelineSection("teaching", data.teaching.sectionTitle, data.teaching.items),
    skills: () => renderSkills(data.skills),
    experience: () => renderTimelineSection("experience", data.experience.sectionTitle, data.experience.items),
    achievements: () => renderAchievements(data.achievements),
    contact: () => renderContact(data.contact)
  };

  document.querySelector("#sections").innerHTML = data.order.sections
    .filter((section) => renderers[section])
    .map((section) => renderers[section]())
    .join("");
}

async function init() {
  try {
    const entries = await Promise.all(Object.entries(DATA_FILES).map(async ([key, path]) => [key, await loadJson(path)]));
    const data = Object.fromEntries(entries);
    document.title = data.site.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute("content", data.site.description);
    renderHero(data.site);
    renderSidebar(data.profile, data.order);
    renderHighlights(data.profile);
    buildSections(data);
  } catch (error) {
    console.error(error);
    document.querySelector("#sections").innerHTML = panel("load-error", "Site data could not be loaded", `<p>${escapeHtml(error.message)}</p>`);
  }
}

init();
