(() => {
  'use strict';

  const I18N = {
    pt: {
      pageTitle: 'David Kalil · Switch 2, Recompilações & Flutter',
      brandSub: 'Switch 2 · Recomps · Flutter',
      statProjects: 'projetos',
      statStars: 'stars',
      statDownloads: 'downloads',
      latestUpdates: 'Últimas atualizações',
      projectsHeading: 'Projetos',
      everything: 'Tudo',
      searchPlaceholder: 'Buscar projetos…',
      sortUpdated: 'Mais recentes',
      sortStars: 'Mais estrelados',
      sortDownloads: 'Mais baixados',
      sortName: 'Nome: A–Z',
      countAll: (n) => `${n} projetos na coleção`,
      countFiltered: (n, label) => `${n} ${n === 1 ? 'projeto' : 'projetos'} em ${label}`,
      countQuery: (n, q) => `${n} ${n === 1 ? 'projeto encontrado' : 'projetos encontrados'} para “${q}”`,
      emptyTitle: 'Nenhum projeto encontrado com os filtros atuais.',
      clearFilters: 'Limpar filtros',
      metaVersion: 'Versão',
      metaUpdated: 'Atualizado em',
      metaStats: 'GitHub',
      sourceCode: 'Código-fonte',
      allReleases: 'Releases',
      otherDownloads: 'Arquivos disponíveis',
      officialStores: 'Lojas oficiais',
      releaseNotes: 'Notas da versão',
      themeToLight: 'Mudar para tema claro',
      themeToDark: 'Mudar para tema escuro',
      downloadsSuffix: 'downloads',
      lastSynced: (dt) => `Última sincronização: ${dt}`
    },
    en: {
      pageTitle: 'David Kalil · Switch 2, Recompilations & Flutter',
      brandSub: 'Switch 2 · Recomps · Flutter',
      statProjects: 'projects',
      statStars: 'stars',
      statDownloads: 'downloads',
      latestUpdates: 'Latest updates',
      projectsHeading: 'Projects',
      everything: 'Everything',
      searchPlaceholder: 'Search projects…',
      sortUpdated: 'Recently updated',
      sortStars: 'Most starred',
      sortDownloads: 'Most downloaded',
      sortName: 'Name: A–Z',
      countAll: (n) => `${n} projects in the collection`,
      countFiltered: (n, label) => `${n} ${n === 1 ? 'project' : 'projects'} in ${label}`,
      countQuery: (n, q) => `${n} ${n === 1 ? 'project' : 'projects'} matching “${q}”`,
      emptyTitle: 'No projects match your current filters.',
      clearFilters: 'Reset filters',
      metaVersion: 'Latest version',
      metaUpdated: 'Updated',
      metaStats: 'GitHub',
      sourceCode: 'Source code',
      allReleases: 'Releases',
      otherDownloads: 'Available downloads',
      officialStores: 'Official stores',
      releaseNotes: 'Release notes',
      themeToLight: 'Switch to light theme',
      themeToDark: 'Switch to dark theme',
      downloadsSuffix: 'downloads',
      lastSynced: (dt) => `Last synced: ${dt}`
    }
  };

  const state = {
    catalog: null,
    lang: 'pt',
    platform: 'all',
    category: 'all',
    q: '',
    sort: 'updated',
    lastFocused: null
  };

  const el = {
    statProjects: document.getElementById('stat-projects'),
    statStars: document.getElementById('stat-stars'),
    statDownloads: document.getElementById('stat-downloads'),
    recentStrip: document.getElementById('recent-strip'),
    platformTabs: document.getElementById('platform-tabs'),
    categoryPills: document.getElementById('category-pills'),
    searchInput: document.getElementById('search-input'),
    sortSelect: document.getElementById('sort-select'),
    resultCount: document.getElementById('result-count'),
    lastSynced: document.getElementById('last-synced'),
    catalogGroups: document.getElementById('catalog-groups'),
    themeToggle: document.getElementById('theme-toggle'),
    langToggle: document.getElementById('lang-toggle'),
    brandHome: document.getElementById('brand-home'),
    dialog: document.getElementById('project-dialog'),
    dialogClose: document.getElementById('dialog-close'),
    dialogCategory: document.getElementById('dialog-category'),
    dialogImage: document.getElementById('dialog-image'),
    dialogTitle: document.getElementById('dialog-title'),
    dialogPlatforms: document.getElementById('dialog-platforms'),
    dialogSummary: document.getElementById('dialog-summary'),
    dialogVersion: document.getElementById('dialog-version'),
    dialogDate: document.getElementById('dialog-date'),
    dialogStars: document.getElementById('dialog-stars'),
    dialogNote: document.getElementById('dialog-note'),
    dialogNoteTitle: document.getElementById('dialog-note-title'),
    dialogNoteBody: document.getElementById('dialog-note-body'),
    dialogPrimaryBtn: document.getElementById('dialog-primary-btn'),
    dialogSourceBtn: document.getElementById('dialog-source-btn'),
    dialogReleaseBtn: document.getElementById('dialog-release-btn'),
    dialogAssetsWrap: document.getElementById('dialog-assets-wrap'),
    dialogAssetsList: document.getElementById('dialog-assets-list'),
    dialogNotesWrap: document.getElementById('dialog-notes-wrap'),
    dialogNotesBody: document.getElementById('dialog-notes-body'),
    dialogRepoLabel: document.getElementById('dialog-repo-label')
  };

  const t = (key) => I18N[state.lang][key];
  const loc = (obj) => (obj && typeof obj === 'object' ? (obj[state.lang] || obj.pt || obj.en || '') : (obj || ''));
  const fmtNum = (n) => new Intl.NumberFormat(state.lang === 'pt' ? 'pt-BR' : 'en-US').format(n || 0);

  function fmtDate(iso) {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return iso;
    const dt = new Date(Date.UTC(y, m - 1, d));
    return new Intl.DateTimeFormat(state.lang === 'pt' ? 'pt-BR' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(dt);
  }

  function fmtShortDate(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return iso;
    const dt = new Date(Date.UTC(y, m - 1, d));
    return new Intl.DateTimeFormat(state.lang === 'pt' ? 'pt-BR' : 'en-US', {
      day: '2-digit',
      month: 'short',
      timeZone: 'UTC'
    }).format(dt);
  }

  function initLang() {
    try {
      const saved = localStorage.getItem('dk-lang');
      if (saved === 'pt' || saved === 'en') state.lang = saved;
    } catch {}
  }

  function applyStaticTranslations() {
    document.documentElement.lang = state.lang === 'pt' ? 'pt-BR' : 'en';
    if (!el.dialog.open) document.title = t('pageTitle');
    el.langToggle.textContent = state.lang.toUpperCase();
    el.searchInput.placeholder = t('searchPlaceholder');

    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.dataset.i18n;
      if (I18N[state.lang][key]) node.textContent = I18N[state.lang][key];
    });

    const opts = el.sortSelect.options;
    opts[0].textContent = t('sortUpdated');
    opts[1].textContent = t('sortStars');
    opts[2].textContent = t('sortDownloads');
    opts[3].textContent = t('sortName');

    updateThemeLabel();
  }

  function updateThemeLabel() {
    const isDark = document.documentElement.dataset.theme !== 'light';
    const label = isDark ? t('themeToLight') : t('themeToDark');
    el.themeToggle.setAttribute('aria-label', label);
    el.themeToggle.title = label;
  }

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = next === 'light' ? '#f5f5f7' : '#1b1d21';
    try { localStorage.setItem('dk-theme', next); } catch {}
    updateThemeLabel();
  }

  function readQueryParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('platform')) state.platform = params.get('platform');
    if (params.get('category')) state.category = params.get('category');
    if (params.get('q')) state.q = params.get('q');
    if (params.get('sort')) state.sort = params.get('sort');
    el.searchInput.value = state.q;
    el.sortSelect.value = state.sort;
  }

  function syncQueryParams() {
    const params = new URLSearchParams();
    if (state.platform !== 'all') params.set('platform', state.platform);
    if (state.category !== 'all') params.set('category', state.category);
    if (state.q.trim()) params.set('q', state.q.trim());
    if (state.sort !== 'updated') params.set('sort', state.sort);
    const qs = params.toString();
    const url = `${window.location.pathname}${qs ? '?' + qs : ''}${window.location.hash}`;
    window.history.replaceState(null, '', url);
  }

  function renderTotals() {
    const projects = state.catalog.projects;
    const stars = projects.reduce((acc, p) => acc + (p.stars || 0), 0);
    const downloads = projects.reduce((acc, p) => acc + (p.downloads || 0), 0);
    el.statProjects.textContent = fmtNum(projects.length);
    el.statStars.textContent = fmtNum(stars);
    el.statDownloads.textContent = fmtNum(downloads);

    if (el.lastSynced && state.catalog.generatedAt) {
      const dt = new Date(state.catalog.generatedAt);
      if (!Number.isNaN(dt.getTime())) {
        const formatted = new Intl.DateTimeFormat(state.lang === 'pt' ? 'pt-BR' : 'en-US', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        }).format(dt);
        el.lastSynced.textContent = I18N[state.lang].lastSynced(formatted);
        el.lastSynced.title = dt.toLocaleString(state.lang === 'pt' ? 'pt-BR' : 'en-US');
        el.lastSynced.hidden = false;
      }
    }
  }

  function renderRecent() {
    const recent = [...state.catalog.projects]
      .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
      .slice(0, 8);

    el.recentStrip.innerHTML = '';
    for (const p of recent) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'recent-card';
      btn.addEventListener('click', () => openProject(p.id, true));

      btn.innerHTML = `
        <img class="recent-art" src="${p.image}" alt="" loading="lazy">
        <span class="recent-name" title="${escapeHtml(p.title)}">${escapeHtml(p.title)}</span>
        <span class="recent-meta">
          <span class="recent-ver">${escapeHtml(p.version || '')}</span>
          <span>${escapeHtml(fmtShortDate(p.updatedAt))}</span>
        </span>
      `;
      el.recentStrip.appendChild(btn);
    }
  }

  function matchesPlatform(p, platformId) {
    return platformId === 'all' || (p.platforms && p.platforms.includes(platformId));
  }

  function renderPlatformTabs() {
    const projects = state.catalog.projects;
    el.platformTabs.innerHTML = '';

    for (const plat of state.catalog.platforms) {
      const count = projects.filter((p) => matchesPlatform(p, plat.id)).length;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.role = 'tab';
      btn.className = 'platform-tab';
      btn.setAttribute('aria-selected', String(state.platform === plat.id));

      const iconId = plat.id === 'switch2' || plat.id === 'switch1' ? '#ic-switch' : (plat.id === 'multi' ? '#ic-devices' : '');
      const iconHtml = iconId ? `<svg width="15" height="15" aria-hidden="true"><use href="${iconId}"/></svg>` : '';

      btn.innerHTML = `${iconHtml}<span>${escapeHtml(loc(plat.label))}</span><span class="tab-count">${count}</span>`;
      btn.addEventListener('click', () => {
        state.platform = plat.id;
        syncQueryParams();
        renderAll();
      });
      el.platformTabs.appendChild(btn);
    }
  }

  function renderCategoryPills() {
    const scoped = state.catalog.projects.filter((p) => matchesPlatform(p, state.platform));
    el.categoryPills.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'pill-btn';
    allBtn.setAttribute('aria-pressed', String(state.category === 'all'));
    allBtn.innerHTML = `<span>${escapeHtml(t('everything'))}</span><span class="pill-count">(${scoped.length})</span>`;
    allBtn.addEventListener('click', () => {
      state.category = 'all';
      syncQueryParams();
      renderAll();
    });
    el.categoryPills.appendChild(allBtn);

    for (const cat of state.catalog.categories) {
      const count = scoped.filter((p) => p.category === cat.id).length;
      if (count === 0 && state.category !== cat.id) continue;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pill-btn';
      btn.setAttribute('aria-pressed', String(state.category === cat.id));
      btn.innerHTML = `<span>${escapeHtml(loc(cat.label))}</span><span class="pill-count">(${count})</span>`;
      btn.addEventListener('click', () => {
        state.category = cat.id;
        syncQueryParams();
        renderAll();
      });
      el.categoryPills.appendChild(btn);
    }
  }

  function getFilteredProjects() {
    const q = state.q.trim().toLowerCase();
    const list = state.catalog.projects.filter((p) => {
      if (!matchesPlatform(p, state.platform)) return false;
      if (state.category !== 'all' && p.category !== state.category) return false;
      if (!q) return true;
      const haystack = [
        p.title,
        p.repo,
        p.version,
        loc(p.summary),
        loc(p.badge),
        ...(p.platformLabels || [])
      ].join(' ').toLowerCase();
      return haystack.includes(q);
    });

    list.sort((a, b) => {
      if (state.sort === 'stars') return (b.stars || 0) - (a.stars || 0) || a.title.localeCompare(b.title);
      if (state.sort === 'downloads') return (b.downloads || 0) - (a.downloads || 0) || (b.stars || 0) - (a.stars || 0);
      if (state.sort === 'name') return a.title.localeCompare(b.title);
      return (b.updatedAt || '').localeCompare(a.updatedAt || '') || (b.stars || 0) - (a.stars || 0);
    });

    return list;
  }

  function renderCatalog() {
    const list = getFilteredProjects();
    const q = state.q.trim();

    if (q) {
      el.resultCount.textContent = I18N[state.lang].countQuery(list.length, q);
    } else if (state.category !== 'all') {
      const cat = state.catalog.categories.find((c) => c.id === state.category);
      el.resultCount.textContent = I18N[state.lang].countFiltered(list.length, cat ? loc(cat.label) : state.category);
    } else if (state.platform !== 'all') {
      const plat = state.catalog.platforms.find((p) => p.id === state.platform);
      el.resultCount.textContent = I18N[state.lang].countFiltered(list.length, plat ? loc(plat.label) : state.platform);
    } else {
      el.resultCount.textContent = I18N[state.lang].countAll(list.length);
    }

    el.catalogGroups.innerHTML = '';

    if (list.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML = `<p>${escapeHtml(t('emptyTitle'))}</p>`;
      const reset = document.createElement('button');
      reset.type = 'button';
      reset.className = 'btn btn-secondary';
      reset.textContent = t('clearFilters');
      reset.addEventListener('click', resetFilters);
      empty.appendChild(reset);
      el.catalogGroups.appendChild(empty);
      return;
    }

    const categoriesToRender = state.category === 'all'
      ? state.catalog.categories
      : state.catalog.categories.filter((c) => c.id === state.category);

    for (const cat of categoriesToRender) {
      const items = list.filter((p) => p.category === cat.id);
      if (items.length === 0) continue;

      const section = document.createElement('section');
      section.className = 'group-section';

      const head = document.createElement('div');
      head.className = 'group-header';
      head.innerHTML = `
        <h2 class="group-title">${escapeHtml(loc(cat.label))}</h2>
        <span class="group-count">${items.length}</span>
      `;

      const grid = document.createElement('div');
      grid.className = 'card-grid';

      for (const p of items) {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'project-card';
        card.addEventListener('click', () => openProject(p.id, true));

        const badgeText = loc(p.badge);
        const badgeHtml = badgeText ? `<span class="card-badge">${escapeHtml(badgeText)}</span>` : '';

        card.innerHTML = `
          <div class="card-art-wrap">
            <img class="card-art" src="${p.image}" alt="" loading="lazy">
            ${badgeHtml}
          </div>
          <span class="card-title">${escapeHtml(p.title)}</span>
          <span class="card-footer">
            <span class="card-version">${escapeHtml(p.version || '')}</span>
            <span class="card-stars" title="GitHub Stars">
              <svg width="11" height="11" aria-hidden="true"><use href="#ic-star"/></svg>
              ${fmtNum(p.stars)}
            </span>
          </span>
        `;
        grid.appendChild(card);
      }

      section.appendChild(head);
      section.appendChild(grid);
      el.catalogGroups.appendChild(section);
    }
  }

  function openProject(id, pushHash) {
    const p = state.catalog.projects.find((item) => item.id === id);
    if (!p) return;

    state.lastFocused = document.activeElement;
    const cat = state.catalog.categories.find((c) => c.id === p.category);

    el.dialogCategory.textContent = cat ? loc(cat.label) : p.category;
    el.dialogImage.src = p.image;
    el.dialogImage.alt = p.title;
    el.dialogTitle.textContent = p.title;
    el.dialogSummary.textContent = loc(p.summary);

    el.dialogPlatforms.innerHTML = '';
    for (const label of (p.platformLabels || [])) {
      const chip = document.createElement('span');
      chip.className = 'platform-chip';
      chip.textContent = label;
      el.dialogPlatforms.appendChild(chip);
    }

    el.dialogVersion.textContent = p.version || '—';
    el.dialogDate.textContent = fmtDate(p.updatedAt);
    const dlText = p.downloads > 0 ? ` · ${fmtNum(p.downloads)} ${t('downloadsSuffix')}` : '';
    el.dialogStars.textContent = `★ ${fmtNum(p.stars)}${dlText}`;

    if (p.note) {
      el.dialogNote.hidden = false;
      el.dialogNoteTitle.textContent = loc(p.note.title);
      el.dialogNoteBody.textContent = loc(p.note.body);
    } else {
      el.dialogNote.hidden = true;
      el.dialogNoteTitle.textContent = '';
      el.dialogNoteBody.textContent = '';
    }

    const action = p.primaryAction || { type: 'link', label: t('sourceCode'), url: p.sourceUrl };
    const iconId = action.type === 'download' ? '#ic-download' : '#ic-external';
    el.dialogPrimaryBtn.href = action.url;
    el.dialogPrimaryBtn.innerHTML = `<svg width="15" height="15" aria-hidden="true"><use href="${iconId}"/></svg><span>${escapeHtml(loc(action.label))}</span>`;

    el.dialogSourceBtn.href = p.sourceUrl;

    if (p.releaseUrl) {
      el.dialogReleaseBtn.hidden = false;
      el.dialogReleaseBtn.href = p.releaseUrl;
    } else {
      el.dialogReleaseBtn.hidden = true;
      el.dialogReleaseBtn.removeAttribute('href');
    }

    el.dialogAssetsList.innerHTML = '';
    const assetsHeading = el.dialogAssetsWrap.querySelector('.assets-heading');
    if (p.stores && p.stores.length > 0) {
      el.dialogAssetsWrap.hidden = false;
      if (assetsHeading) assetsHeading.textContent = t('officialStores');
      for (const store of p.stores) {
        const a = document.createElement('a');
        a.className = 'asset-link';
        a.href = store.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.innerHTML = `<svg width="12" height="12" aria-hidden="true"><use href="#ic-external"/></svg><span>${escapeHtml(store.name)}</span>`;
        el.dialogAssetsList.appendChild(a);
      }
    } else if (p.assets && p.assets.length > 1) {
      el.dialogAssetsWrap.hidden = false;
      if (assetsHeading) assetsHeading.textContent = t('otherDownloads');
      for (const asset of p.assets) {
        const a = document.createElement('a');
        a.className = 'asset-link';
        a.href = asset.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.innerHTML = `<svg width="12" height="12" aria-hidden="true"><use href="#ic-download"/></svg><span>${escapeHtml(asset.name)}</span>`;
        el.dialogAssetsList.appendChild(a);
      }
    } else {
      el.dialogAssetsWrap.hidden = true;
    }

    if (p.releaseNotes) {
      el.dialogNotesWrap.hidden = false;
      el.dialogNotesWrap.open = false;
      el.dialogNotesBody.textContent = p.releaseNotes;
    } else {
      el.dialogNotesWrap.hidden = true;
      el.dialogNotesWrap.open = false;
      el.dialogNotesBody.textContent = '';
    }

    el.dialogRepoLabel.textContent = `github.com/${p.repo}`;
    document.title = `${p.title} · davidkalil10`;

    if (pushHash) {
      const nextHash = `#project/${p.id}`;
      if (window.location.hash !== nextHash) {
        window.history.pushState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`);
      }
    }

    if (!el.dialog.open) el.dialog.showModal();
  }

  function closeProject() {
    if (!el.dialog.open) return;
    el.dialog.close();
  }

  function handleDialogClose() {
    document.title = t('pageTitle');
    if (window.location.hash.startsWith('#project/')) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
    if (state.lastFocused && typeof state.lastFocused.focus === 'function') {
      state.lastFocused.focus();
    }
  }

  function resetFilters() {
    state.platform = 'all';
    state.category = 'all';
    state.q = '';
    state.sort = 'updated';
    el.searchInput.value = '';
    el.sortSelect.value = 'updated';
    syncQueryParams();
    renderAll();
  }

  function checkHash() {
    const match = window.location.hash.match(/^#project\/([a-z0-9-]+)$/i);
    if (match) {
      openProject(match[1], false);
    } else if (el.dialog.open) {
      el.dialog.close();
    }
  }

  function renderAll() {
    renderPlatformTabs();
    renderCategoryPills();
    renderCatalog();
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function bindEvents() {
    el.themeToggle.addEventListener('click', toggleTheme);

    el.langToggle.addEventListener('click', () => {
      state.lang = state.lang === 'pt' ? 'en' : 'pt';
      try { localStorage.setItem('dk-lang', state.lang); } catch {}
      applyStaticTranslations();
      renderTotals();
      renderRecent();
      renderAll();
      if (el.dialog.open) {
        const match = window.location.hash.match(/^#project\/([a-z0-9-]+)$/i);
        if (match) openProject(match[1], false);
      }
    });

    el.brandHome.addEventListener('click', (e) => {
      e.preventDefault();
      resetFilters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    el.searchInput.addEventListener('input', () => {
      state.q = el.searchInput.value;
      syncQueryParams();
      renderCatalog();
    });

    el.sortSelect.addEventListener('change', () => {
      state.sort = el.sortSelect.value;
      syncQueryParams();
      renderCatalog();
    });

    el.dialogClose.addEventListener('click', closeProject);
    el.dialog.addEventListener('close', handleDialogClose);
    el.dialog.addEventListener('click', (e) => {
      if (e.target === el.dialog) closeProject();
    });

    window.addEventListener('hashchange', checkHash);

    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !el.dialog.open && document.activeElement !== el.searchInput &&
          !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
        e.preventDefault();
        el.searchInput.focus();
        el.searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (e.key === 'Escape' && !el.dialog.open && state.q) {
        state.q = '';
        el.searchInput.value = '';
        syncQueryParams();
        renderCatalog();
      }
    });
  }

  async function boot() {
    initLang();
    readQueryParams();
    applyStaticTranslations();
    bindEvents();

    try {
      const res = await fetch('data/catalog.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      state.catalog = await res.json();
      renderTotals();
      renderRecent();
      renderAll();
      checkHash();
    } catch (err) {
      el.catalogGroups.innerHTML = `<div class="empty-state"><p>Erro ao carregar data/catalog.json (${escapeHtml(err.message)}).</p></div>`;
    }
  }

  boot();
})();
