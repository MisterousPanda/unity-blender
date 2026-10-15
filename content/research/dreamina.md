---
cursor:
  subagentId: "bc-b37494c2-07c2-55a2-a8ee-21524ed0aae0"
---

# Dreamina brief

Researched 2026-10-11. Model names, clip length, resolution, and which country can open which model move. Check the live picker before relying on a number.

**Name.** “dreaminai” matches **Dreamina**, ByteDance’s international image-and-video app at [dreamina.capcut.com](https://dreamina.capcut.com/). No separate current product under that spelling turned up. The China app is **Jimeng** (即梦), [jimeng.jianying.com](https://jimeng.jianying.com/ai-tool/home). **Seedance** is the video model. **Seedream** is the image model. Dreamina often prefixes those names (“Dreamina Seedance”, “Dola Seedream”). They are not three different companies.

## What it is and what it outputs

Dreamina is a browser creative app. Its own description: cinematic images, dynamic videos, and talking avatars from text, photos, or audio. [Dreamina](https://dreamina.capcut.com/). It hosts ByteDance’s Seed models and, on the pages below, some other companies’ image models. It is not a 3D application, a game engine, or an interactive world model.

What a generation actually returns:

- **Still images.** Posters, stickers, product-style “3D renders,” and text-heavy layouts. Those “3D” results are pictures of a render, not meshes. [Dreamina](https://dreamina.capcut.com/).
- **Video with audio.** Seedance 2.5 is a joint audio-video model: one generation can include picture and sound. [Seedance 2.5](https://seed.bytedance.com/en/seedance2_5).
- **Separate audio on the canvas.** Dreamina’s canvas page names **Seedaudio 2.0** for voices and music next to image and video nodes. [AI Canvas](https://dreamina.capcut.com/ai-video/ai-canvas).
- **Talking avatars.** Stated in the Dreamina FAQ. The FAQ does not name the avatar model. Do not assume that is the separate BytePlus OmniHuman or DreamActor APIs. [Dreamina](https://dreamina.capcut.com/).

**Not an output found in these sources:** a mesh, a rig, a camera solve, a Unity scene, or a persistent world. Clay renders and green screen are **inputs** the video model follows. [Seedance 2.5 launch note](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5).

The current flagship pair, both announced 31 Jul 2026:

- **Seedance 2.5.** Up to 30 seconds in one pass. Reference cap on the Seed post: 30 images, 10 video clips, and 10 audio clips. Timestamp edits, green-screen replacement, camera-move edits, and clay-render (white-model) control for layout, blocking, and camera. Extensions of an existing clip are supported. The Seed model page says you can extend twice. Dreamina’s 3 Aug press release says a **Long Video Mode** up to three minutes. Those two length claims are not the same sentence; treat “3 minutes” as a Dreamina product mode, not as a number the Seed post itself uses. [Seed post](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5), [model page](https://seed.bytedance.com/en/seedance2_5), [Dreamina press release](https://www.prnewswire.com/news-releases/creating-longer-ai-videos-is-still-difficult-dreamina-the-tool-of-ai-video-maker-launches-seedance-2-5-with-30-second-generation-and-50-reference-inputs-302841251.html).
- **Seedream 5.0 Pro** (Dreamina’s label: Dola Seedream 5.0 Pro). Still images. Stronger text, charts, diagrams, and presentation pages. Interactive edits by point, lasso, sketch, color or material change, and layer split. The Seed post describes those layers as design layers you can keep editing, not as geometry. Multilingual prompt and text rendering, including Arabic. [Seedream 5.0 Pro](https://seed.bytedance.com/en/seedream5_0_Pro), [Seedream post](https://seed.bytedance.com/en/blog/beyond-generation-it-understands-design-introducing-seedream-5-0-pro), [Dreamina model note](https://dreamina.capcut.com/resource/seedance-2-5-launch).

Dreamina’s 31 Jul note said Seedance 2.5 would roll out first to subscribers 16+ in Europe, Asia, the Middle East, and South America, and that Seedream 5.0 Pro was already open to paying subscribers in those regions plus the United States. The 3 Aug press release says Seedance 2.5 is global, and that access, resolution, and price vary by market. [Dreamina model note](https://dreamina.capcut.com/resource/seedance-2-5-launch), [press release](https://www.prnewswire.com/news-releases/creating-longer-ai-videos-is-still-difficult-dreamina-the-tool-of-ai-video-maker-launches-seedance-2-5-with-30-second-generation-and-50-reference-inputs-302841251.html).

Safeguards Dreamina states for these models: invisible watermarks, C2PA Content Credentials, visible AI labels, and blocks on harmful content, non-consensual likeness, and unauthorized intellectual property. [Dreamina model note](https://dreamina.capcut.com/resource/seedance-2-5-launch).

A Dreamina marketing page advertises Seedance 2.5 at 4K. The Seed team post and the BytePlus Seedance product page read for this brief do not state 4K as a model guarantee. Resolution is plan- and market-dependent until you see it on the result. [Seedance 2.5 marketing page](https://dreamina.capcut.com/seedance/seedance-2-5).

## What a beginner needs to understand

The **model picker is the product.** The homepage FAQ still describes Seedance 2.0, Seedream 5.0 Lite, and Nano Banana Pro. The canvas page names Seedream 5.0 Pro, Seedance 2.5, Seedaudio 2.0, and GPT Image 2. Same app, different models, different failure modes. [Dreamina](https://dreamina.capcut.com/), [AI Canvas](https://dreamina.capcut.com/ai-video/ai-canvas).

A useful first session is four jobs, not a film:

1. One still from a sentence (Seedream).
2. The same still sent to image-to-video (Seedance).
3. One clip that uses a reference image for a face or a product, and a second clip without it, so you can see drift.
4. One edit of a timestamp or a region, instead of regenerating the whole clip.

References are how you steer. Seedance can take images, video, and audio and be told which one controls identity, which one controls camera and blocking, and which one is a green screen. Clay-render reference means a textureless 3D playblast: the model is supposed to follow path, pose, and framing, then invent materials and light. It does not return the scene. [Seed post](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5).

Other named areas on Dreamina’s tools index, not separate products: **AI Canvas** (nodes for prompts, images, video, audio, and “principal” references reused with @), **Cinema Studio**, **Marketing Studio**, and **Trends Studio**. Canvas agent control is described as planned, not as something already shipping: a sidebar agent and CLI operation of nodes, including Codex, are listed as future. [AI Canvas](https://dreamina.capcut.com/ai-video/ai-canvas), [tools index](https://dreamina.capcut.com/tools).

Free daily credits exist. Paid use is credits or a subscription, and Seedance 2.5 launch pricing was quoted from $0.097 per second, varying by plan and region. [Dreamina](https://dreamina.capcut.com/), [press release](https://www.prnewswire.com/news-releases/creating-longer-ai-videos-is-still-difficult-dreamina-the-tool-of-ai-video-maker-launches-seedance-2-5-with-30-second-generation-and-50-reference-inputs-302841251.html).

The Seed team says complex motion physics and multi-person interaction are still weak. Believe a contact, a landing, or a handoff only after you watch it. [Seed post](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5).

## How it complements the other tools

**Grok is the primary tool for creations and additions.** Grok decides what the shot is for, writes and revises the prompt, chooses the reference, and makes the next addition (a prop note, a second angle, a line of scene description, a change to the Unity or Blender file). Dreamina is the supporting renderer. Open it when the missing piece is pixels: a still, a talking-avatar clip, or a short audiovisual shot. Bring the file back to Grok and to a person. Dreamina does not decide the pipeline and does not edit the 3D project.

**Higgsfield** is a different app that also hosts Seedance and Seedream inside its own studios. Cinema Studio there is documented as running on Seedance 2.5. Overlap is the model, not the workspace. Use Dreamina when you want ByteDance’s own app, CapCut-family account, clay-render or green-screen reference, talking avatars, or the Dreamina CLI. Use Higgsfield when the job needs that suite’s camera panels, character system, ad studio, or a GLB. Nothing reviewed here shows the two Seedance deployments are the same build. No official Dreamina–Higgsfield bridge turned up.

**Blender** stays the geometry tool. Seedance’s clay-render path is the practical link: render a textureless playblast, upload it as the camera and blocking reference, and optionally pair it with a style or character still. The result is a video. Chinese coverage of the 31 Jul Jimeng launch says Jimeng also shipped Maya and Blender uploaders for that white-model handoff. A reprinted manual describes export from Blender or Maya, then a jump to the Jimeng website. An English Dreamina page documenting that plugin was not found in this pass, and a claim that the finished video writes itself back into Blender as a scene was not treated as fact. [Leiphone, 31 Jul 2026](https://www.leiphone.com/category/industrynews/ME02O5J26zzAWXeo.html), [plugin manual reprint](https://www.blenderx.cn/blog/seedance25).

**Unity** has no Dreamina plugin in the sources checked. The handoff is the same file exchange: a clay or lookdev playblast out, a video or still back, used as reference, a texture card, or a UI plate. Dreamina does not create GameObjects, prefabs, colliders, or lights.

**World models.** Here, a world model keeps objects, space, and change so a later system can reason about them. Dreamina does not publish one. Seedance paints a clip of a world. The Seed post also describes using it to synthesize footage for robot training, industrial demos, and rare driving scenes. That is generated video for someone else’s dataset, not a simulator you can step through. Layout and continuity belong to Blender, Unity, or a real world model. Dreamina can preview how a blocked scene might look in motion.

## What a person must judge before a 3D pipeline

Watch the file. Do not promote it because the prompt asked for the right thing.

- It is a picture or a movie. It has no units, no pivot, no UVs, and no rig. Seedream “layers” are flat design layers.
- Identity: face, costume, product silhouette, and limb count across the whole clip, not one frame.
- Whether the clay reference was actually obeyed. Camera, pacing, and contact often drift. Generated light is not a light rig you can reuse.
- Physics you would trust in a sim: feet on the ground, object weight, two bodies interacting. The model authors say this is unfinished.
- Text in frame, flicker, and warped perspective if a frame will become a texture or a projection card.
- Audio is part of the generation. It is not game audio, and lip sync is a look, not a facial rig.
- Rights and labels: likeness permission, blocked IP, C2PA, invisible watermark, and any visible AI label that has to stay on the asset.
- Length and resolution on the file you downloaded, not the number in the ad. A preview is not a plate until a person accepts it.

## Public API, MCP, and automation

Names and capabilities only. Consumer web credits and enterprise API access are different products.

| Surface | Who runs it | What it can do |
| --- | --- | --- |
| **Dreamina CLI** | ByteDance, documented on the Dreamina site | Local `dreamina` command for agents. Text-to-image, image-to-image, text-to-video, image-to-video, frames-to-video, and multimodal video, using current web models including Seedream 5.0 Pro and Seedance 2.5. Async submit, query, download, task history, sessions, and account credit check. An agent skill file is installed with the CLI. [Dreamina CLI](https://dreamina.capcut.com/tools/dreamina-cli) |
| **BytePlus ModelArk — Dreamina Seedance 2.5 and 2.0** | ByteDance international API | Create video-generation tasks. Product page: about 4–30 seconds, multimodal references (marketed as up to 50), edits that keep the surrounding frame, synchronized audio and video, aspect ratio and camera style. The 31 Jul Seed post said this API was “coming soon”; BytePlus pages later call it available (activation doc updated 31 Aug 2026, tutorial updated 28 Sep 2026). This brief did not place a live call. [Product](https://www.byteplus.com/en/product/Seedance), [activation](https://docs.byteplus.com/en/docs/ModelArk/2637911), [tutorial](https://docs.byteplus.com/en/docs/modelark/seedance-2-5) |
| **Volcengine Ark — Doubao Seedance 2.5** | ByteDance China API | Same model family under the Doubao name. Official tutorial covers creating a video task from text and reference media, including edit and extend. [Volcengine Seedance 2.5](https://docs.volcengine.com/docs/ark/seedance-2-5) |
| **BytePlus Vision — Dreamina 4.6 API** and **Dreamina Creative Upscale API** | ByteDance | Separate Vision AI docs, last updated 24 Apr 2026 and 17 Jun 2026. Page bodies did not load in this pass, so treat them as named image-side APIs, not as proof of what Seedance 2.5 can do. [Dreamina 4.6](https://docs.byteplus.com/en/docs/byteplus-vision/dreamina_4_6), [Creative Upscale](https://docs.byteplus.com/en/docs/byteplus-vision/dreamina-ultra-hd) |
| **In-app AI Agent** | Dreamina product mode | Chat plus attachments to plan and generate images and video inside the site. Not an external API. [AI Agent page](https://dreamina.capcut.com/resource/ai-agent) |
| **Canvas agent / CLI-on-canvas** | Dreamina, stated as planned | Future: create and edit canvas nodes from a sidebar agent or from a general agent through the CLI. Not documented as shipped. [AI Canvas](https://dreamina.capcut.com/ai-video/ai-canvas) |

No first-party Dreamina MCP server showed up. Third-party servers do, and they are not ByteDance: **dreamina-mcp** (SeedFlow) drives the Dreamina website through a Chrome extension; **jimeng-web-mcp** / **dreamina-web-mcp** calls the Jimeng or Dreamina site with a logged-in session. Their own pages disagree with BytePlus about whether “there is a public API,” because they mean the consumer website, not ModelArk. Do not treat them as supported automation. [SeedFlow](https://glama.ai/mcp/servers/DanikVR/dreamina-seedance-mcp).

CapCut is the sibling editor on the same domain family. This pass did not re-verify a one-click “drop onto the timeline” handoff.
