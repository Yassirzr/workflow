# DeployLab — mini-projet d'atelier CI/CD

Un petit site responsive HTML/CSS/JavaScript. **Aucun framework Angular**, aucune dépendance npm : les tests utilisent les modules natifs Node.js. Le workflow GitHub Actions fait une vraie intégration continue (syntaxe, tests, build) et livre une **image Docker dans GHCR**.

## Contenu

```text
mini-projet-cicd/
├── index.html
├── style.css
├── pipeline.js
├── script.js
├── package.json
├── package-lock.json
├── Dockerfile
├── .dockerignore
├── .gitignore
├── tools/
│   ├── build.cjs
│   └── dev-server.cjs
├── tests/
│   └── pipeline.test.cjs
└── .github/workflows/
    └── ci.yml
```

## Tester le projet sur Windows

Le site s'ouvre aussi en double-cliquant `index.html`. Pour utiliser le serveur Node.js (Node >=20 installé) :

```bash
npm ci
npm run lint
npm test
npm run build
npm run dev
```

Ouvrir http://localhost:3000 (Ctrl+C pour fermer le serveur).

## Publier dans le dépôt existant `Yassirzr/workflow`

1. Faire une **copie de sauvegarde** des anciens fichiers. Le nouveau `index.html`, `style.css` et `.github/workflows/ci.yml` remplacent les anciens.
2. Extraire le ZIP et **copier son contenu**, y compris le dossier `.github`, dans `C:\Users\yassi\Downloads\workflow` (pas un sous-dossier).
3. Dans Git Bash :

```bash
cd ~/Downloads/workflow
git status
git add -A
git commit -m "Atelier CI-CD : tests build et publication Docker"
git pull --rebase origin main
git push -u origin main
```

**Si `git pull --rebase` signale des conflits, s'arrêter et les résoudre avant de pousser.** Ne pas utiliser `git push --force`.

4. Aller sur https://github.com/Yassirzr/workflow/actions ; ouvrir la dernière exécution.
5. Les étapes attendues : installation Node.js, `npm ci`, lint, tests, build, construction Docker, publication GHCR.

### Registre GHCR

Le workflow utilise le token GitHub automatique `${{ secrets.GITHUB_TOKEN }}` et l'autorisation `packages: write`, sans mot de passe à ajouter.
L'image créée sur `main` a le nom `ghcr.io/yassirzr/workflow:latest`. Le dépôt doit autoriser GitHub Actions à publier un package; les règles d'organisation ou les paramètres du dépôt peuvent le limiter.

Le push GHCR **publie une image** : il ne rend **pas automatiquement le site accessible sur une URL web**.
Pour vérifier le déploiement du conteneur si Docker Desktop est installé :

```bash
docker pull ghcr.io/yassirzr/workflow:latest
docker run --rm -p 8080:80 ghcr.io/yassirzr/workflow:latest
```

Puis ouvrir http://localhost:8080. Si l'image est privée, une authentification GHCR est nécessaire avant `docker pull` ; rendre le package public dans les paramètres GitHub pour faciliter cette démonstration.

## À présenter pendant l'atelier

- Problème initial : `setup-node` avec cache npm sans `package-lock.json`.
- Correction : projet Node.js minimal avec `package-lock.json` valide.
- CI : lint + 9 tests Node natifs + génération de `dist/`.
- CD : image Docker contenant le site, envoyée à GHCR lors d'un push sur `main`.
- Démonstration : simulation sur le site (purement locale) et **véritables résultats** visibles dans GitHub Actions.

Si l'enseignant exige spécifiquement Angular, ce mini-projet ne remplace pas un projet Angular : il valide une chaîne CI/CD générique pour site statique.
