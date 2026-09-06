# Automated asset deployment

Pipeline for `public/` media (logos, Lootzy art, Shoshana Sale video, etc.).

## Local

```bash
# Compress brand images + write public/asset-manifest.json
npm run assets:deploy

# Also git commit + push public/ (triggers Vercel if linked)
npm run assets:deploy -- --push

# Manifest only
npm run assets:manifest
```

## What it does

1. **Compress** `public/brand` (Pillow) — optional skip with `--skip-compress`
2. **Manifest** — `public/asset-manifest.json` with size + sha256 per file
3. **Git** — stage `public/`; with `--push`, commit and `git push origin`

Vercel deploys from the GitHub `main` branch. Once media is pushed, production serves `/brand/...` automatically.

## CI

`.github/workflows/assets.yml` runs on `public/**` pushes: recompress brand images, refresh the manifest, and commit the manifest if it changed.

## Promo video

Prefer a compressed MP4 (`shoshana-sale.mp4`, ~1MB web encode). Re-encode locally:

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -vf "scale='min(1280,iw)':-2" \
  -c:a aac -b:a 96k -movflags +faststart public/brand/shoshana-sale.mp4
```
