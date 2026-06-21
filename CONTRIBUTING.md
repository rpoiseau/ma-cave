# Contribution & gouvernance du dépôt

Ce dépôt est public et déployé sur GitHub Pages. Pour éviter que le comportement du
site change sans contrôle, les modifications passent par des pull requests vérifiées.

## Flux de travail

1. Crée une branche depuis `main`.
2. Ouvre une **pull request**. Le titre suit les [Conventional Commits](https://www.conventionalcommits.org/)
   (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `feat!:` pour un changement cassant).
3. La **CI** (`.github/workflows/ci.yml`) lance `type-check` + `vite build`. Elle doit être verte.
4. La PR requiert la revue du **CODEOWNER** (`.github/CODEOWNERS`).
5. Après fusion dans `main`, le site est **redéployé automatiquement** (`deploy.yml`).

## Releases (automatisées)

`release-please` (`.github/workflows/release-please.yml`) observe `main` et **maintient une
PR de release** : il calcule le prochain numéro de version et met à jour `CHANGELOG.md` à
partir des commits conventionnels. Fusionner cette PR crée le **tag git + la GitHub Release**.

- `feat:` → bump mineur · `fix:` → bump patch · `feat!:`/`BREAKING CHANGE:` → (pré-1.0) bump mineur.
- Config : `release-please-config.json` · version courante : `.release-please-manifest.json`.
- Pré-requis repo : **Settings → Actions → General → Workflow permissions** →
  cocher *« Allow GitHub Actions to create and approve pull requests »* (sinon release-please ne peut pas ouvrir sa PR).

## Protection de la branche `main` (à activer une fois, côté GitHub)

Ces réglages ne sont pas versionnables — active-les dans **Settings → Branches → Add branch
ruleset** (ou *Branch protection rules*) sur `main` :

- ✅ Require a pull request before merging
  - ✅ Require approvals (1) · ✅ Require review from Code Owners
- ✅ Require status checks to pass before merging
  - ajouter le check **`Vérification (type-check + build)`** (job de `ci.yml`)
  - ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings (ou restreindre aux admins seulement)
- ✅ Block force pushes

Avec ça, **personne ne peut pousser directement sur `main` ni fusionner sans CI verte + revue**.

### En une commande (si tu installes la CLI `gh`)

```bash
gh api -X PUT repos/rpoiseau/ma-cave/branches/main/protection \
  -F required_status_checks.strict=true \
  -F 'required_status_checks.contexts[]=Vérification (type-check + build)' \
  -F enforce_admins=true \
  -F required_pull_request_reviews.required_approving_review_count=1 \
  -F required_pull_request_reviews.require_code_owner_reviews=true \
  -F restrictions=
```
