---
cursor:
  subagentId: "bc-99dda16e-f215-507c-89d9-3bd3277cea10"
---

# Grok as the lead tool (checked 2026-10-11, Imagine and Ultra revised 2026-10-15)

Grok is the place to decide, describe, and draft. It returns text, still images, short videos with sound, and speech. It does not return a Blender mesh or a Unity scene. Later, an LLM can call the same kinds of tools through the xAI API or the Grok CLI. Practice the hand version first so you can tell when that call is wrong.

Sources are official xAI pages unless marked. Product pages and API docs disagree in a few places; those are called out. This note does not re-check Dreamina or Higgsfield feature lists.

## Products that matter

Use the chat app at [grok.com](https://x.ai/grok) (web, iOS, Android) for hand work. Use [docs.x.ai](https://docs.x.ai/developers/models) when you need exact model names. xAI’s current recommendation: **Grok 4.7** for chat and code, **Imagine Image 2.0** for stills, **Imagine Video 1.5** for clips, and the **Voice API** for speech. Grok 4.7’s knowledge cutoff is **May 2026**. It does not know live facts unless search is on.

| Surface | What you put in | What you get out |
| --- | --- | --- |
| Chat (Grok 4.7) | Text, and images it can see (jpg/png, up to 20MiB each) | Text: plans, prompts, checklists, source code. Reasoning you can read. In the app, also files/PDFs, a writing canvas, memory, and custom instructions. |
| Search | A question, with search enabled | An answer plus citations from the web and from X. |
| Multi-agent | A hard question in the app (SuperGrok on the product page) | Several agents in parallel, each showing work, merged into one cited answer. The API also lists a separate model, `grok-4.20-multi-agent-0309`. Whether the app button is that model is not stated. |
| Imagine images | A prompt, or an edit with up to 5 source images | Stills from `grok-imagine-image-2.0`. Generation docs: `1k` (default) or `2k`. Quality `low`, `medium`, or `auto` (`auto` serves `low` on a new image and `medium` on an edit). Up to 10 images in one API request. The pricing table also lists 1.5K as a billed size. |
| Imagine video | Text, a still, references, or an existing clip | `grok-imagine-video-1.5`: text-to-video and image-to-video at native 1080p, 1–15 seconds (default 8), audio on by default with lip-sync. Reference-to-video: up to 14 images, up to 3 voice references, pinned first, last, and up to 4 mid frames, and it tops out at 720p. Edit and extend stay on `grok-imagine-video`. |
| Voice | Speech or text | Spoken audio back, a transcript, or a new voice id. |
| Code tool | A request that needs calculation | Python run in a sandbox, then the result in the reply. Chat can *write* other languages; this tool only *runs* Python. |

### Ultra on The X Subscription

Checked 2026-10-15. There is no separate product named “Grok Imagine Unified Ultra.” The unified plan is [The X Subscription](https://x.ai/news/x-subscription). **Ultra** is its top individual tier. Imagine image and video draw from that plan. They are not a second subscription.

- Price on the docs page: **$200/month**, or **$2,000/year** ($167/month). A team Ultra seat is **$200**. [Pricing](https://docs.x.ai/x-subscription/pricing), [x.ai/pricing](https://x.ai/pricing).
- Ultra includes everything in Super, which includes Premium. Premium’s own feature list says “Make stunning AI images & videos.” Plus lists Grok Chat, Voice, Imagine, and Build. [x.ai/pricing](https://x.ai/pricing).
- Included usage is **50× Plus**. Plus is the base pool. The pool is weekly and shared across eligible first-party Grok and Cursor use for that seat. Inside Grok it covers Chat, Imagine, Voice, and Bot. It is not a separate Imagine quota, and seats on a team do not share one weekly pool. A high-quality video draws more than a chat message. Settings → Usage shows the percentage, the product split (including Imagine), and the next reset. [Usage limits](https://docs.x.ai/x-subscription/usage-limits), [x.ai/pricing](https://x.ai/pricing), [Grok FAQ](https://docs.x.ai/grok/faq).
- xAI does not publish how many images or videos that pool contains. Do not invent a count.
- After the included pool is used, paid features pause until the weekly reset, or you buy Extra Usage Credits. The FAQ says the smallest web purchase is $5, credits are used after the included pool, and they expire one year after purchase unless a note says otherwise. Auto Top Up is optional and has a monthly cap you set. Included plan usage is the better rate per action. [Grok FAQ](https://docs.x.ai/grok/faq).
- A 720p video falls back to 480p after the 720p cap for your tier. The FAQ does not publish the size of that cap. [Grok FAQ](https://docs.x.ai/grok/faq).
- Generated images and videos include a Grok watermark. There is no setting to remove it. [Grok FAQ](https://docs.x.ai/grok/faq).
- The Imagine API is a different bill from this weekly pool. Practice the ceilings in [grok.com/imagine](https://grok.com/imagine). This page does not call the API.

### Imagine images

[Image 2.0](https://x.ai/news/grok-imagine-image-2) is the stills model to learn. Official claims: it follows layout and small text more closely, and it tries to keep what you put in across edits. In the app:

- Magic wand and segmentation change a region and leave the rest.
- Background removal exports a subject on transparency.
- Smart resize picks a new aspect ratio and fills the frame.
- Multi-ref edits take up to 5 images (combine subjects, transfer style).
- Templates include **Character Sprite** and **Props & UI Kit**, plus icons, mascots, and product shots.
- “Build a world for video” means separate images — character, locations, props — held to one style. That is a stack of stills, not a 3D world.

The API image tool inside a chat (`image_generation`) uses Image 2.0. The model writes the image prompt, picks an aspect ratio, and can generate then edit in one turn. You can restrict it to `generate` or `edit`. If you already know the prompt and the exact size, call the image endpoint yourself instead of letting the chat model invent the prompt.

Older image model ids still exist (`grok-imagine-image`, `grok-imagine-image-quality`). Prefer 2.0 unless a doc tells you otherwise.

Image ceiling, from the generation docs read on 2026-10-15: ask for `resolution` `2k` and `quality` `medium` when the screen offers them. `1k` is the default resolution. `auto` quality serves `low` on a new image and `medium` on an edit. One request can return up to 10 images. An edit takes one source image, or up to 5 when you combine subjects or transfer a style. Save the file. API image URLs are temporary. The app should be treated the same way: download the still. [Image generation](https://docs.x.ai/developers/model-capabilities/images/generation), [Image prompting guide](https://docs.x.ai/developers/model-capabilities/images/prompting-guide), [Multi-image editing](https://docs.x.ai/developers/model-capabilities/images/multi-image-editing). The pricing table also lists 1.5K as a billed size; the generation page’s `resolution` values are `1k` and `2k`. [API pricing](https://docs.x.ai/developers/pricing).

### Imagine video

Current API comparison: [Video overview](https://docs.x.ai/developers/model-capabilities/video/overview).

- `grok-imagine-video-1.5` — text-to-video and image-to-video up to native 1080p; up to 14 reference images; up to 3 voice references with lip-sync; pin first frame, last frame, and up to 4 mid-clip frames. Reference-to-video tops out at 720p. Use this when identity or a locked frame matters.
- `grok-imagine-video-1.5-lite` — text-to-video and image-to-video only, cheaper; 1080p is an upscale from 720p.
- `grok-imagine-video` — the older model that **edits** a source clip (up to 8.7s) or **extends** it by 2–10s. The 1.5 models do not edit or extend.

Image-to-video locks the still as frame one and keeps that aspect ratio. Text-to-video on 1.5 secretly makes a first frame, then animates it; you only receive the video. Passing the same image as first and last frame is the documented way to ask for a loop.

Video ceiling for a new clip, read on 2026-10-15 from the [video overview](https://docs.x.ai/developers/model-capabilities/video/overview) and [video generation](https://docs.x.ai/developers/model-capabilities/video/generation): on `grok-imagine-video-1.5`, text-to-video and image-to-video are native 1080p, duration is 1–15 seconds (default 8), and audio is on by default with lip-synced speech. Image-to-video locks the still as frame one and keeps that aspect ratio. Reference-to-video on the same model allows up to 14 images, up to 3 voice references, and pinned first, last, and up to 4 mid frames, and it tops out at 720p. Voice references from your own audio files are available to trusted partners on request. `grok-imagine-video-1.5-lite` is text-to-video and image-to-video only; its 1080p is an upscale from 720p. Edit (source up to 8.7 seconds) and extend (add 2–10 seconds) stay on `grok-imagine-video`, and an edit’s output resolution is capped at 720p.

In the app, do not assume every API field is a visible control. Set the highest duration and resolution the screen offers for the path you chose, then write down what the file actually is. The [Grok FAQ](https://docs.x.ai/grok/faq) says a 720p video falls back to 480p once you hit the 720p cap for your tier. That cap’s size is not published. A [16 Jun 2026 post](https://x.ai/news/grok-imagine-video-1-5) described a faster 6-second 720p path on grok.com/imagine. A later [references post](https://x.ai/news/grok-imagine-video-1-5-references) says text-to-video and native 1080p are on grok.com/imagine, iOS, and Android. If the screen and the docs disagree, believe the file you downloaded.

### Voice

In the app, voice is a live conversation. The [Voice API](https://docs.x.ai/developers/model-capabilities/audio/voice) is three products:

- Speech-to-speech over a websocket (`grok-voice-latest` in the docs), with tool use.
- Text-to-speech, including speech tags (laughter, whisper, pause), to an audio file.
- Speech-to-text (`grok-voice-transcribe-2.0`): timestamps, diarization, 38+ languages.

You can clone a voice from a clip of at most 120 seconds and reuse that `voice_id`. That clone is for the Voice API. It is not the same control as a video model’s voice reference.

### Built-in tools (server-side)

Documented on the [tools overview](https://docs.x.ai/developers/tools/overview). xAI runs these; the model decides when to call them.

- `web_search` — live web, with citations.
- `x_search` — posts on X, with citations.
- `code_execution` in the xAI SDK, `code_interpreter` on the Responses API — Python only, sandbox, no network, no durable files. NumPy, Pandas, Matplotlib, and SciPy are listed as available.
- `image_generation` — stills via Image 2.0, not video. The Vercel AI SDK does not expose this tool yet.
- `collections_search` / `file_search` — search documents you uploaded.

There is no documented server-side tool that emits a video, a mesh, or a Unity scene. Video is a separate Imagine API call.

## What to practice by hand

Do this in the app before anyone wires MCP.

1. One thread for one idea. Ask for a style line, a short asset list (character, prop, location), and a negative list (what must not change). Read the reasoning. Edit the list yourself.
2. Turn search on and ask something that changed after May 2026. Open two citations. If they do not support the sentence, the answer is not done.
3. On grok.com/imagine, Quality Mode: generate a character, one prop, and one location. Run **Character Sprite** and **Props & UI Kit** on the same idea. Save the prompt next to each image.
4. Edit one region with the wand. Remove a background. Make three variations and write one line on what actually changed (pose, palette, identity).
5. “Build a world” as stills only: same character in two places, prop in hand. Reject any frame where the face, costume, or prop design drifts.
6. Animate one keeper still with image-to-video on `grok-imagine-video-1.5`. If the screen allows it, ask for 15 seconds and 1080p with audio on. Say the camera move and name one thing that must stay still. Write down the duration and resolution of the file you saved.
7. Say a scene out loud in voice mode. Make Grok write the prompt back. Compare it with what you meant.
8. Ask chat for a Blender checklist and a Unity import checklist from those stills. Do one real step in each app. The checklist is not the asset.
9. Make one still at the image ceiling: `grok-imagine-image-2.0`, `2k`, quality `medium` if the screen offers it. Save the prompt beside the file. Leave the Grok watermark in place.
10. One reference-to-video, only if you need several images to hold identity. On `grok-imagine-video-1.5` that path is up to 14 images and tops out at 720p. It is not the 1080p image-to-video ceiling.

## How Grok leads, and when to hand off

Grok owns the brief: what the thing is, what it must match, the prompt, the reference stills, and a short motion test. Every other tool receives that package. Grok does not finish the job by describing it.

| Hand to | When | What Grok should already have produced |
| --- | --- | --- |
| Stay in Grok | You still need words, a still, a region edit, a background-free cutout, a sprite or UI mock, or a clip of at most 15 seconds. | The thing itself. |
| Dreamina | You want Dreamina’s image or video model for that shot. This note does not list Dreamina’s controls. | Prompt, style line, reference stills, and a “do not change” list. |
| Higgsfield | The pipeline step is a Higgsfield render (motion or marketing work you have assigned there). This note does not list Higgsfield’s controls. | The same package, plus the camera move and the length you could not get inside 15 seconds. |
| A world model | You need a space you can move through, not a poster and not a short clip. | Concept stills and a layout in words. Imagine’s “world” template is not this. |
| Blender | You need a mesh, UVs, a material, a rig, a camera, or a `.blend`. | Orthographic-style stills if you can get them, names for parts, and a build order. |
| Unity | You are placing finished assets, lights, collisions, or gameplay. | An import list, names, and scale notes. The scene is built in the Editor. |

Community MCP servers can let a model drive Blender by calling Blender’s Python API. That is a third-party bridge, not an xAI file format. No official xAI tool found on 2026-10-11 emits FBX, GLB, or a Unity scene.

## What “additions” means here

An addition is a new piece that feeds the pipeline. It is not the assembled 3D scene.

- **Variations** — same subject, a changed prompt: angle, palette, expression, time of day. Keep the ones that still match the reference.
- **Edits** — a change to an existing still (wand, segmentation, restyle, up to 5 references) or, on `grok-imagine-video` only, a change to a short source clip or a 2–10s extension.
- **New assets** — a new still the game does not have yet: character, prop, sprite, icon, UI kit, location plate, transparent cutout.
- **Prompts** — the text another tool should receive, including what must stay fixed.
- **Scene ideas** — a shot list, a beat, a line of dialogue, a layout described in words.

Final 3D assembly is the step those additions are for: objects with transforms, materials, and colliders in Blender, then placed and scripted in Unity. A 2K still and a 15-second clip can guide that step. They are not a substitute for it.

## MCP and tool use (names only)

Two different surfaces. Both assume you already know what a good result looks like.

**API, so an app or agent can call Grok.** [Remote MCP](https://docs.x.ai/developers/tools/remote-mcp) and [function calling](https://docs.x.ai/developers/tools/function-calling) sit on the Responses API, the xAI SDK, and (for a subset) speech-to-speech.

- Built-in tools above (`web_search`, `x_search`, `code_interpreter` / `code_execution`, `image_generation`, `file_search`). The server runs them.
- `function` — you declare a name and a JSON schema. Grok asks for the call. Your code runs it and sends the result back. Tool choice can be `auto`, `required`, or `none`.
- `mcp` — Grok connects to an MCP server you name. Documented transports are Streaming HTTP and SSE, not local stdio. `allowed_tools` limits which tools the model sees. If you omit it, every tool on that server is in context. Several servers can be attached at once. `require_approval` is not supported.
- Speech-to-speech can use `web_search`, `x_search`, `file_search`, `mcp`, and `function`. The voice page does not list `image_generation`.

**Grok CLI, documented under Build.** [MCP servers](https://docs.x.ai/build/features/mcp-servers).

- `grok mcp add`, `list`, `remove`, `doctor`. Local stdio servers and remote HTTP. OAuth tokens land under `~/.grok/`.
- Also reads `~/.claude.json`, `.cursor/mcp.json`, and project `.mcp.json`, unless you turn that compatibility off.
- Those tools appear beside the CLI’s built-in tools, namespaced by server. This is the surface that could later point at a Blender or Unity MCP server. Connecting one does not make the result correct.

## What you still have to understand

An LLM with tools will sound finished. Your job is to check the artifact against the brief.

- **Cutoff.** Without search, Grok 4.7 is stuck at May 2026. With search, read the citation. A link is not proof the sentence matches it.
- **Who wrote the prompt.** The image tool rewrites your request into its own prompt. Read that prompt when you supervise an agent. In the app, keep the prompt you actually sent.
- **Identity drift.** Edits and “one style across images” are attempts. Faces, costumes, props, and small text still change. Image 2.0’s arena rank is cited as of 7 Aug 2026, not as a permanent fact.
- **Video is a sketch.** The documented new-clip ceiling is 15 seconds at native 1080p for text-to-video and image-to-video on `grok-imagine-video-1.5`, with audio on by default. Reference-to-video on that model tops out at 720p. A 720p app result can fall back to 480p after your tier’s unpublished 720p cap. Physics can still be wrong. Read the file, not the prompt.
- **“World” is a word.** Imagine’s world template outputs stills. A world model outputs a space. Blender outputs a mesh. Unity outputs a running scene.
- **Code is untrusted.** Chat can emit C# or Blender Python that has never been run. The code tool runs Python in a sandbox with no network and no memory of the last call. Paste-and-run only after you can name what the script should change.
- **Tools are permissions.** An empty `allowed_tools` list means all of that server’s tools. A wrong tool call can edit a file or a scene. Prefer read-only tools until you can predict the side effect.
- **Multi-agent is not a review.** Each branch can be wrong. The merged answer can hide which branch you needed.
- **Memory and policy.** The app remembers earlier chats and can refuse a generation. A refusal or a leftover preference is not a fact about your scene.
- **App vs API.** Buttons on grok.com (wand, templates, Fast video, Projects) are not all separate API parameters. The weekly Ultra pool and the Imagine API bill are different. Docs move. Re-open the page for the model id before you let an agent spend a run.
- **The pool is shared.** Imagine, Chat, Voice, Bot, and Cursor first-party use draw from one weekly pool on The X Subscription. Ultra is 50× Plus. A video costs more of that pool than a chat message. Check Settings → Usage before a batch. A fresh yes still covers spending past the included pool.

## Sources

- [The X Subscription](https://x.ai/news/x-subscription) — unified Grok, Cursor, and X plans, including Ultra
- [Subscription pricing](https://docs.x.ai/x-subscription/pricing) and [x.ai/pricing](https://x.ai/pricing) — Ultra at $200/month, 50× Plus, images and videos on the paid tiers that include Premium’s feature list
- [Usage limits](https://docs.x.ai/x-subscription/usage-limits) — one weekly first-party pool, not a separate Imagine quota
- [Grok app FAQ](https://docs.x.ai/grok/faq) — weekly pool, 720p fallback, watermark
- [Grok product page](https://x.ai/grok) — chat, search, multi-agent, Imagine, voice, code, files, vision
- [Models and pricing](https://docs.x.ai/developers/models) — Grok 4.7 cutoff May 2026; Imagine and Voice model ids
- [Imagine overview](https://docs.x.ai/developers/model-capabilities/imagine) — image gen/edit, video gen/edit/extend, references
- [Imagine Image 2.0](https://x.ai/news/grok-imagine-image-2) — Quality Mode, wand, templates, “build a world”
- [Imagine Video 1.5 announcement](https://x.ai/news/grok-imagine-video-1-5) — Fast on grok.com/imagine, 16 Jun 2026
- [Video overview](https://docs.x.ai/developers/model-capabilities/video/overview) — 1.5 vs lite vs edit/extend
- [Voice overview](https://docs.x.ai/developers/model-capabilities/audio/voice) — speech-to-speech, TTS, STT, custom voices
- [Tools overview](https://docs.x.ai/developers/tools/overview) — built-ins vs functions
- [Image generation tool](https://docs.x.ai/developers/tools/image-generation) — `image_generation` inside chat
- [Code execution](https://docs.x.ai/developers/tools/code-execution) — Python sandbox
- [Remote MCP](https://docs.x.ai/developers/tools/remote-mcp) — API `mcp` tool
- [Grok CLI MCP](https://docs.x.ai/build/features/mcp-servers) — `grok mcp`, stdio and HTTP
