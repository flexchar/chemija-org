# Homepage practice preview

`phone-frame-generated.png` was generated with the built-in `image_gen.imagegen` tool from `prompt.txt`. The tool did not expose a model identity. The frame has a transparent display opening.

`actual-app-screenshot.png` is a headless Chrome screenshot of the real React practice client, loaded from a local Wrangler worker with a synthetic paid session and a local D1 fixture. The one question is `2024-vbe-main-q02`, already one of the three intentionally public guest samples in `question-bank/app/src/server/discovery.ts`. It asks for the general oxide formula of IIA metals, and the displayed `MeO` answer and explanation came from the app after submitting the correct choice. The preview excludes the synthetic session banner and account details.

`render.html` layers the unmodified UI screenshot crop beneath the generated frame and adds the site's selected test-tube SVG and the existing app brand text. Headless Chrome renders that DOM composition to the standalone public asset `astro-app/public/images/practice-phone-preview.png`. This keeps Lithuanian text and chemical notation from the actual client crisp and accurate. The frame is illustrative; the question and feedback are a real app state. Regenerate with headless Chrome at 1024 × 1536 using `render.html` and `--allow-file-access-from-files`.
