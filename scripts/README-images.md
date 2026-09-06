# Image compression pipeline

Optimizes raster assets under `public/` (PNG, JPEG, WebP; optional animated GIF).

## Requirements

- Python 3.10+
- Pillow (`pip install Pillow`)

## Commands

```bash
# Dry run (no writes)
npm run images:compress:dry

# Compress all of public/
npm run images:compress

# Brand assets + WebP sidecars for large PNG/JPEG
npm run images:compress:brand

# Direct Python
python3 scripts/compress-images.py --root public --webp
python3 scripts/compress-images.py --gif   # include animated GIFs (slow)
```

## Behaviour

- Resizes oversized images (logos ≤900px edge by path hint; photos higher)
- Recompresses JPEG (default quality 82) and PNG (`optimize=True`)
- Optional palette reduction for opaque PNGs
- Optional `.webp` sidecars (`--webp`) for files ≥30KB
- Skips `node_modules`, `.git`, `__grok`, etc.
- Animated GIFs skipped unless `--gif`

## CI / prebuild

Not hooked into `vite build` by default (keeps deploys fast and deterministic).
Run `npm run images:compress` when adding new heavy assets under `public/`.
