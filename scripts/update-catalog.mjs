#!/usr/bin/env node
/**
 * Updates stars, downloads, latest release version, date, and assets
 * in data/catalog.json using the GitHub REST API (no dependencies).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.resolve(__dirname, '../data/catalog.json');

const token = process.env.GITHUB_TOKEN || '';
const headers = {
  'User-Agent': 'davidkalil10-portfolio-updater',
  'Accept': 'application/vnd.github+json',
  ...(token ? { Authorization: `Bearer ${token}` } : {})
};

async function ghJson(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) return null;
  return res.json();
}

async function main() {
  const raw = await fs.readFile(catalogPath, 'utf8');
  const catalog = JSON.parse(raw);

  for (const project of catalog.projects) {
    if (!project.repo) continue;
    const repo = await ghJson(`https://api.github.com/repos/${project.repo}`);
    if (!repo) {
      console.warn(`Skipped ${project.repo} (repo fetch failed)`);
      continue;
    }

    project.stars = repo.stargazers_count ?? project.stars;
    if (repo.pushed_at) {
      project.updatedAt = repo.pushed_at.slice(0, 10);
    }

    const releases = await ghJson(`https://api.github.com/repos/${project.repo}/releases?per_page=10`);
    if (Array.isArray(releases) && releases.length > 0) {
      let totalDownloads = 0;
      for (const rel of releases) {
        for (const asset of rel.assets || []) {
          totalDownloads += asset.download_count || 0;
        }
      }
      project.downloads = totalDownloads;

      const latest = releases[0];
      if (latest.tag_name) project.version = latest.tag_name;
      if (latest.html_url) project.releaseUrl = latest.html_url;
      if (latest.published_at && latest.published_at.slice(0, 10) > project.updatedAt) {
        project.updatedAt = latest.published_at.slice(0, 10);
      }
      if (Array.isArray(latest.assets) && latest.assets.length > 0) {
        const usable = latest.assets.filter((a) => !a.name.endsWith('.sha256') && a.name !== 'SHA256SUMS.txt');
        const list = (usable.length > 0 ? usable : latest.assets).slice(0, 6);
        project.assets = list.map((a) => ({ name: a.name, url: a.browser_download_url }));
        if (project.primaryAction?.type === 'download' && list[0]) {
          project.primaryAction.url = list[0].browser_download_url;
          project.primaryAction.label = {
            pt: `Baixar ${list[0].name}`,
            en: `Download ${list[0].name}`
          };
        }
      }
    }
    console.log(`Updated ${project.repo}: ★${project.stars}, ↓${project.downloads}, ${project.version}`);
  }

  catalog.generatedAt = new Date().toISOString();
  await fs.writeFile(catalogPath, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
  console.log('Saved data/catalog.json');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
