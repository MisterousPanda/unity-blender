---
cursor:
  subagentId: "bc-a98d635f-6eb4-59b3-ab09-f41a6f3c349b"
---

# Higgsfield brief

Researched 2026-10-11 from public Higgsfield and Dreamina pages. Catalogs, clip lengths, credit rules, and model names move. Treat this as a map, then check the live screen before relying on a number.

## What it is for

Higgsfield is a web creative suite for generating and editing images and video, with marketing production and a newer 3D path. It is a workspace and a router across its own models and other companies' models, not a 3D application and not a game engine. Product home: [higgsfield.ai](https://higgsfield.ai/). Image studio: [AI Image](https://higgsfield.ai/ai-image). Video studio: [AI Video](https://higgsfield.ai/ai-video).

Main creation surfaces, from the help center's tool guide ([which tool](https://higgsfield.ai/creator-hub/help-center/tools/which-higgsfield-tool-should-i-use)):

- **Image.** Text-to-image and editing in one studio. The image page lists native 4K, Soul ID character consistency, and several hosted models (Soul, Seedream, FLUX, and others). [AI Image](https://higgsfield.ai/ai-image).
- **Soul and Soul Cinema.** Soul is Higgsfield's own image family. Soul Cinema is the cinematic variant: texture and film-still look, Soul ID and Soul HEX color, no preset panel. Frames are meant as keyframes for video. [Soul Cinema](https://higgsfield.ai/soul-cinema), [how to use Soul Cinema](https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-use-soul-cinema).
- **DoP.** Higgsfield's own image-to-video model, aimed at directed shots (motion, lighting, lens, framing) rather than a still that merely moves. [How to use DoP](https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-use-dop).
- **Video models in one place.** The video page names Seedance, Kling, Veo, Wan, and Sora among hosted models, with camera, motion, style, first/last frame, and character consistency as product claims. [AI Video](https://higgsfield.ai/ai-video).
- **Cinema Studio.** Film-style video: optics, camera moves, Soul Cast actors, Elements (reusable characters, locations, props), native audio, and color. Version 4.0 is the default and is documented as running on Seedance 2.5, with a Director's Panel, up to 50 references, and clips up to 30 seconds. [How to use Cinema Studio](https://higgsfield.ai/creator-hub/help-center/tools/how-do-i-use-cinema-studio).
- **Marketing Studio.** Product ads and UGC-style clips from a product URL or image, with lip sync. Help center limit: 15 seconds per generation. Template-based Marketing Studio is documented as not available through Supercomputer, MCP, or other agent channels yet. [How to use Marketing Studio](https://higgsfield.ai/creator-hub/help-center/tools/how-do-i-use-marketing-studio-to-create-video-ads).
- **AI Influencer.** A UI builder for a reusable virtual character, including non-human characters, instead of prompt-only identity. [Which tool](https://higgsfield.ai/creator-hub/help-center/tools/which-higgsfield-tool-should-i-use).
- **Canvas.** A node board: prompt to image to video to edit. Building the graph is free; credits spend when a node generates. [Canvas](https://higgsfield.ai/creator-hub/help-center/tools-and-workflows/how-do-i-use-canvas).
- **Supercomputer.** A paid agent that plans a brief, picks models, and can schedule recurring jobs. [Which tool](https://higgsfield.ai/creator-hub/help-center/tools/which-higgsfield-tool-should-i-use).
- **3D Jutsu.** A browser scene workspace. A prompt or reference becomes editable geometry, lights, and cameras (blocking / previz), then can render to video. Export is an animated MP4, a still, or a GLB. GLB import keeps animation. It is not the Blender plugin. [3D Jutsu](https://higgsfield.ai/blog/higgsfield-3d-jutsu).
- **Audio.** Cinema Studio versions 2.5 through 4.0 generate sound, speech, and music in the same pass as the picture. MCP also exposes Higgsfield Audio. [Cinema Studio](https://higgsfield.ai/creator-hub/help-center/tools/how-do-i-use-cinema-studio), [MCP](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-higgsfield-mcp).

Official plugins exist for Figma, Photoshop, Premiere Pro, After Effects, DaVinci Resolve, Blender, and Minecraft, plus a browser game builder (Higgsfield Gaming). The integrations page does not list Unity. [External integrations](https://higgsfield.ai/creator-hub/help-center/integrations/external-integrations-higgsfield).

## What a beginner needs to understand

**Prompts describe the shot, not every dial.** Write subject, action, place, and mood. In Cinema Studio, genre, era, tempo, camera body, lens, aperture, palette, and lighting live on the Director's Panel (4.0) or the equivalent panels in earlier versions. The prompt carries the scene. [Cinema Studio](https://higgsfield.ai/creator-hub/help-center/tools/how-do-i-use-cinema-studio). A first-party 3.5 tutorial says the same split: settings hold the visual logic; the prompt holds the scene. [Cinema Studio 3.5 tutorial](https://higgsfield.ai/blog/cinema-studio-3.5-full-tutorial).

**Consistency is a system, and it is approximate.**

- A single reference image anchors one generation and drifts across later ones.
- **Soul ID** trains on 20 to 80 photos of one person (permission required), then reuses that face inside Soul and, as an Element, in Seedance. Expect "clearly the same person," not a pixel-identical face. Extreme style or odd angles still drift. The trained identity is not a downloadable file. [Soul ID](https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-create-and-use-a-soul-id-character).
- More than one character, or a reusable place or prop, uses **Elements**. Cinema Studio's own advice for cross-shot consistency is to save characters and locations as Elements. [Cinema Studio](https://higgsfield.ai/creator-hub/help-center/tools/how-do-i-use-cinema-studio).
- **Soul Cast** (inside Cinema Studio) invents actors from parameters. That is a different tool from Soul ID, which copies a known face from photos.

**Camera and motion are controls, and they still lie.** Cinema Studio exposes named moves, lenses, focal lengths, and apertures, and 4.0 can extend a clip forward or backward or edit a region. 3.0 is the version the help center points to for "physics-accurate" motion (weight, momentum, fabric). That is a look inside a generated clip. It is not a physics simulation you can scrub as objects in Blender. DoP is the native image-to-video route when you already have a keyframe. [DoP](https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-use-dop).

**Limits that matter early.**

- Cinema Studio 4.0: up to 30-second clips and 30-second uploads. 3.0 and 3.5 accept uploads up to 15 seconds. 2.5 does not accept video uploads. [Cinema Studio](https://higgsfield.ai/creator-hub/help-center/tools/how-do-i-use-cinema-studio).
- Marketing Studio: 15 seconds; UGC voice and pacing vary; most categories are regenerated rather than edited. [Marketing Studio](https://higgsfield.ai/creator-hub/help-center/tools/how-do-i-use-marketing-studio-to-create-video-ads).
- 3D Jutsu scene duration is documented as 1 to 60 seconds, default 15. Manual edits are move, primitive, light, and camera. [3D Jutsu](https://higgsfield.ai/blog/higgsfield-3d-jutsu).
- Cinema Studio 3.0 can block a generation for a real face or protected IP. [Cinema Studio](https://higgsfield.ai/creator-hub/help-center/tools/how-do-i-use-cinema-studio).
- On the website, some plans include "Unlimited" models. Unlimited and free generations apply only on higgsfield.ai. MCP, CLI, Canvas, Supercomputer, plugins, and other automated paths deduct credits. [MCP vs web](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-higgsfield-mcp).
- API output is kept at least seven days, then may disappear. Download it. [Billing and retention](https://docs.higgsfield.ai/docs/concepts/billing-and-retention).

In Cinema Studio 3.5, the built-in Claude director can fill settings and prompts. It does not press Generate. You review first. [Cinema Studio](https://higgsfield.ai/creator-hub/help-center/tools/how-do-i-use-cinema-studio). 3D Jutsu has an explicit "ask before generating" mode. [3D Jutsu](https://higgsfield.ai/blog/higgsfield-3d-jutsu).

## How it sits next to the other tools

**Grok is the primary tool for creations and additions.** Use Grok to decide what the shot is for, write and revise the prompt, compare options, and make the small additions (a prop note, a wardrobe change, a second angle described in words). Higgsfield is the supporting studio you open when Grok's answer needs a picture, a directed clip, a consistent character, an ad variant, or a blockout mesh.

Higgsfield also hosts xAI's **Grok Imagine** as models inside its catalog, including Grok Imagine Video 1.5 (text, image, and reference to video; documented duration 1–15 seconds) and Grok Imagine image. [Grok Imagine Video 1.5](https://docs.higgsfield.ai/docs/models/grok-video-1-5), [playground pricing snapshot](https://open.higgsfield.ai/models/xai/grok-imagine-video/v1.5/reference-to-video/playground). That endpoint is one model among many. It does not replace Grok as the place you think. Whether Higgsfield's hosted Grok Imagine matches Grok's own product feature for feature was not verified here.

Use Higgsfield for the jobs its panels actually do:

- A keyframe or style frame (Soul, Soul Cinema, or another image model), then image-to-video (DoP or a hosted video model).
- A multi-shot clip where camera, lens, and Elements matter (Cinema Studio).
- Short product or UGC ads (Marketing Studio).
- A grey-box scene, a GLB, or a previz camera move (3D Jutsu or the Blender add-on).

**Dreamina** is a separate CapCut product for images, video, and talking avatars. Its own pages say it hosts Seedance, Seedream, and other models, and that it connects to CapCut. [Dreamina](https://dreamina.capcut.com/), [Dreamina video](https://dreamina.capcut.com/tools/ai-video-generator). Higgsfield also hosts Seedance and Seedream. They overlap as generators. They are not the same app. Dreamina is the simpler path when the next step is a CapCut edit. Higgsfield is the path when you need its camera panels, Soul ID, Marketing Studio, or Blender/GLB tools. No public page reviewed here establishes that the Seedance build on one site is identical to the other.

**Blender** is where the geometry becomes yours. Higgsfield's add-on (Blender 5.1 or later, Windows or macOS) puts a bar over the viewport: Scene Builder, 3D Model, Character Animation, Image, Video, Camera, and Asset. Scene Builder is documented as editable objects in the open `.blend`, not a flat render. The plugin page names Meshy 5 for 3D meshes. [Blender plugin](https://higgsfield.ai/plugins/blender), [install and tabs](https://higgsfield.ai/creator-hub/help-center/integrations/external-integrations-higgsfield). Linux support is not stated. 3D Jutsu stays in the browser and can export GLB for a later Blender import. [3D Jutsu](https://higgsfield.ai/blog/higgsfield-3d-jutsu).

**Unity** has no plugin on the official integrations list. The handoff is files: GLB from 3D Jutsu or the Blender add-on, or images and video used as reference, UI, or texture planes. Higgsfield Gaming builds browser games through Supercomputer or MCP. That is a different runtime from a Unity project. [Integrations](https://higgsfield.ai/creator-hub/help-center/integrations/external-integrations-higgsfield).

**World models.** In this learning path, a world model is a scene that keeps objects, space, and change, so a later system can reason about them. Higgsfield's video models, including the page's "Sora 2 world simulation" wording, produce pixels of a world. [AI Video](https://higgsfield.ai/ai-video). They do not give Unity a persistent simulation, collision set, or action log. The closer tools are 3D Jutsu and Blender Scene Builder, which emit editable layout. Even those are blockouts and previz, not a trained world model. Use a clip as camera and motion reference. Use a GLB only after the checks below. Build gameplay, collisions, and lighting in Blender and Unity.

## Automation a learner should know exists

Names and capabilities only. Do not treat an agent call as free, and do not let it write into a Blender or Unity scene unattended.

| Surface | What it is | What it can do |
| --- | --- | --- |
| **Higgsfield MCP** | Connector at `https://mcp.higgsfield.ai/mcp`. OAuth to your account. No API key. | Generate images, video, characters, and audio; check credits. Results land in Assets. Any MCP client can use the URL; ChatGPT uses the official plugin instead. [MCP](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-higgsfield-mcp), [connect](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-connect-higgsfield-to-ai-agent). |
| **CLI + skills** | `@higgsfield/cli`, then `npx skills add higgsfield-ai/skills`. For coding agents (the help page names Claude Code, Cursor, Codex). Account login, no API key. | Generate from the agent using plan credits. [Connect](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-connect-higgsfield-to-ai-agent). |
| **Higgsfield Bridge** | `https://bridge.higgsfield.ai/mcp`, with the Blender add-on installed. | An agent acts on the open Blender scene (blockouts, meshes, renders), not only on cloud assets. [Blender plugin](https://higgsfield.ai/plugins/blender). |
| **Higgsfield API** | Separate developer product. Base `https://api.higgsfield.ai`. Key auth. Python and TypeScript SDKs. | Async image, video, and related generation: submit, poll or webhook, cancel while queued. Official docs index image and video families including Genjutsu, Soul, Cinema Studio, Seedance, Kling, Marketing Studio, and Grok. The model index said 17 image and 67 video entries when fetched; access depends on the account. [API overview](https://docs.higgsfield.ai/docs), [models](https://docs.higgsfield.ai/docs/models). |

MCP is not the API. MCP spends plan credits. The API is for putting generation inside your own product, with its own key and billing. [API blog](https://higgsfield.ai/blog/higgsfield-api). You are responsible for what an agent generates on your account. [MCP](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-higgsfield-mcp).

When you later supervise an LLM, the safe pattern is the one Cinema Studio already uses for its director: the model may draft the prompt and the settings; a person approves Generate. On 3D Jutsu, prefer "ask before generating" until you trust the brief.

## What a person must judge before Blender or Unity

1. **File type.** A video or image is reference, a texture, or a plane. It is not a prop. Only GLB, or objects the Blender add-on actually inserted, are scene data.
2. **Identity.** Soul ID and Elements reduce drift. They do not guarantee the same face, costume, or prop across shots. Compare frames before you model from them.
3. **Mesh quality.** Check scale, origin, normals, holes, and whether materials are real maps or a baked look. "Clean topology" on the plugin page is a claim to verify in Edit Mode. [Blender plugin](https://higgsfield.ai/plugins/blender).
4. **Rig and motion.** The add-on describes a weighted rig on standard Blender bones with keys on the timeline. Before Unity, check bone names, scale, weight spills, and that the action is one cycle you can retarget. Mixamo characters inside 3D Jutsu are library assets, not automatically game-ready. [3D Jutsu](https://higgsfield.ai/blog/higgsfield-3d-jutsu).
5. **Physics and camera.** A clip can show a collision or a 360-degree move that the mesh does not contain. Recreate collisions, constraints, and cameras in Blender or Unity. Do not trace bad anatomy, sliding feet, or warped perspective into the model.
6. **Rights.** Soul ID requires photos of yourself or someone who allowed the likeness. Cinema Studio can refuse real faces and protected IP. Commercial use follows the plan terms; the Blender page says to check those terms. [Soul ID](https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-create-and-use-a-soul-id-character), [Blender plugin](https://higgsfield.ai/plugins/blender).
7. **Keep the file.** API results can expire after seven days. Plugin and web assets should be saved into the `.blend` or the Unity project, not left as a remote URL. [Retention](https://docs.higgsfield.ai/docs/concepts/billing-and-retention).

## Uncertainty

- Model lists, prices, and "Unlimited" inclusion change by plan and by week. The API count of 84 catalog entries is a snapshot from the docs index, not a promise.
- Feature parity between Grok's own Imagine tools and Higgsfield's hosted Grok Imagine endpoints was not checked side by side.
- Seedance and Seedream appear on both Higgsfield and Dreamina. Same name does not prove the same checkpoint or the same controls.
- No Unity plugin showed up on the official integrations page. Absence there is strong, not a proof that none exists under another name.
- The Blender add-on is documented for Windows and macOS, Blender 5.1+. Linux was not mentioned.
- Third-party writeups that name Meshy, SAM, or Tripo under the API were not used as fact. Meshy 5 is named on Higgsfield's own Blender plugin page only.
