# DDLC Sense Stand

Telescopic MS floor stand for the DDLC Sense R1: 120–300 cm height, 360° lockable rotation, −45° to +90° tilt, 450 × 450 base with levelling feet. Mount plate 120 × 35 mm.

- `index.html`: interactive 3D model (open in a browser). Sliders for height, rotation and tilt, plus a cut list with mass estimate.
- `ddlc-sense-stand-1200mm.stl`: stand collapsed (120 cm), mm, Z up.
- `ddlc-sense-stand-3000mm.stl`: stand fully extended (300 cm), mm, Z up.
- `tools/export-stl.js`: regenerates the STLs from `index.html`.

Regenerate an STL:

```sh
npm i three@0.128.0
node tools/export-stl.js _ index.html out.stl 1800   # height in mm (1200–3000)
```
