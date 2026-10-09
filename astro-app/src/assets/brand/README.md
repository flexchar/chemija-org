# Chemija.org mark

The website and practice app share the tilted test tube with level Lithuanian yellow, green and red liquid bands. `chemija-mark.svg` is the production source: a transparent, flat-color vector reproduction of the selected concept. `build-favicons.mjs` rasterizes it with `rsvg-convert`, packages the 16 and 32 px PNGs into `favicon.ico`, and writes identical SVG, PNG and ICO assets to both apps. Regenerate from the repository root with `bun astro-app/src/assets/brand/build-favicons.mjs`.

`chemija-tube-generated.png` preserves the selected generated image. Its original, [prompt](concepts/astra-3/refined/prompt.txt), and [provenance](concepts/astra-3/refined/provenance.json) remain in `concepts/astra-3/refined/`. The image was produced with `image_gen.imagegen`; that tool exposed no model identity. The original four explorations and two refinements remain under `concepts/`.

`chemija-mark-generated.png` preserves the earlier flask image. It is retained for provenance and is no longer a live asset. The current SVG uses dark emerald `#064E3B` for the tube and flat `#FDBF22`, `#007C59`, and `#CE2733` for the liquid.
