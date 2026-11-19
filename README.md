# davidkalil10.github.io

Catálogo e portfólio estático de projetos de **David Kalil Braga** (`@davidkalil10`): homebrew para Nintendo Switch 2, recompilações multiplataforma (Heroes Lore) e apps Flutter.

## Recursos
- **HTML5 + CSS3 + JavaScript puro** (zero dependências, carregamento instantâneo).
- **Tema escuro e claro** com persistência em `localStorage`.
- **Bilíngue (PT-BR / EN)** com alternância em um clique.
- **Filtros por plataforma, categoria, busca instantânea (`/`) e ordenação** sincronizados na URL.
- **Modal nativo (`<dialog>`)** com detalhes do projeto, múltiplos arquivos de download, notas da versão e links diretos (`#project/<id>`).
- **Atualização automática de estrelas, downloads e releases** via `scripts/update-catalog.mjs` e GitHub Actions (`.github/workflows/update-stats.yml`).

## Como publicar no GitHub Pages
1. Crie um repositório público no GitHub com o nome exato **`davidkalil10.github.io`**.
2. Envie os arquivos desta pasta para a branch `main`.
3. Em **Settings → Pages**, selecione **Deploy from a branch** → `main` / `/ (root)`.
4. Em poucos segundos, o site estará no ar em `https://davidkalil10.github.io/`.

## Como testar localmente
```powershell
python -m http.server 8080
```
Depois abra `http://localhost:8080` no navegador.
