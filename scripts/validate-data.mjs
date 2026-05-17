import { readFile } from "node:fs/promises";
import { join } from "node:path";

const DATA_FILES = [
  "site.json",
  "profile.json",
  "contact.json",
  "education.json",
  "research.json",
  "publications.json",
  "teaching.json",
  "experience.json",
  "skills.json",
  "achievements.json",
  "projects.json",
  "section-order.json"
];

const dataDir = new URL("../data/", import.meta.url);
const parsedData = new Map();
const errors = [];

for (const fileName of DATA_FILES) {
  const fileUrl = new URL(fileName, dataDir);
  try {
    const contents = await readFile(fileUrl, "utf8");
    parsedData.set(fileName, JSON.parse(contents));
  } catch (error) {
    errors.push(`${join("data", fileName)}: ${error.message}`);
  }
}

const profile = parsedData.get("profile.json");
if (profile) {
  if (!Array.isArray(profile.links)) {
    errors.push("data/profile.json: profile.links must be an array");
  } else {
    profile.links.forEach((link, index) => {
      if (!link || typeof link !== "object") {
        errors.push(`data/profile.json: profile.links[${index}] must be an object`);
        return;
      }

      if (typeof link.label !== "string" || link.label.trim() === "") {
        errors.push(`data/profile.json: profile.links[${index}].label must be a non-empty string`);
      }

      if (typeof link.href !== "string" || link.href.trim() === "") {
        errors.push(`data/profile.json: profile.links[${index}].href must be a non-empty string`);
      }
    });
  }
}

if (errors.length) {
  console.error("Site data validation failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Validated ${DATA_FILES.length} data files.`);
}
