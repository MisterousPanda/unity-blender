---
cursor:
  subagentId: "bc-c88a8e9b-39fc-5d21-8191-3d72dc56d3a8"
---

# World models, for a Unity and Blender beginner

Checked 2026-10-11 from vendor docs, release notes, and papers. These products were not run in this pass. Where two official pages disagree, both are noted.

## Plain-language definition

A world model is an AI that keeps a place in mind. You give it a prompt, a picture, or a short clip, and it predicts what you would see if you moved, and sometimes what would change if you acted.

The word "world" in a demo is loose. The file you can download is the real product. In 2026 that file is one of four things:

| Output | What you hold | After you close the website |
| --- | --- | --- |
| Video | Frames in a clip | The clip plays forward. The place is gone. |
| Gaussian splat | A cloud of soft colored blobs, usually `.ply` or `.spz` | You can orbit it in a viewer. You cannot grab one chair and reshape it. |
| Mesh | Triangles in a `.glb`, sometimes with a texture | Blender and Unity can place it, after cleanup. |
| Playable session | Live frames driven by your keys or steering | Only while the session is open. The download, when one exists, is a video. |

A mesh is a surface. A splat is a photograph broken into blobs so you can look around it. A video is a shot. A Unity scene is objects you add colliders, lights, a camera, and scripts to. Those are different jobs.

## What is actually shipping

### A file you can open in Blender or Unity

**World Labs Marble** is the consumer product with a documented export path. It has been a public web app at [marble.worldlabs.ai](https://marble.worldlabs.ai) since 12 November 2025. You start from text, one image, several images, a short video, or a coarse blockout (their Chisel tool: boxes and planes, plus a style prompt). The result is a persistent 3D world you can edit, expand, and stitch to other worlds.

Exports, from their [file specs](https://docs.worldlabs.ai/marble/export/specs):

- Gaussian splats in SPZ or PLY, about 2 million splats or about 500 thousand. This is the sharpest look.
- A collider mesh: one GLB, about 100–200 thousand triangles, meant for rough physics.
- A high-quality mesh: one GLB around 600 thousand triangles with textures, or around 1 million with vertex colors. Docs say this can take up to an hour, is limited to 4 requests an hour, and only for worlds you own.
- A video of a camera path through the world. An "enhanced" pass can add motion (smoke, fire, water) on top of that camera.
- A 360° panorama PNG, 2560×1280.

Their [export page](https://docs.worldlabs.ai/marble/export/gaussian-splat/index) says export needs a paid plan: Standard covers splats, panoramas, and collider meshes; Pro covers the high-quality mesh and commercial rights; Free can generate and cannot export. Confirm the live pricing page before paying. Plan names move.

Marble is a scene you orbit and edit. Their November 2025 post treats people and agents *acting inside* the world as later work. It is not a character game.

**Atlas** (World Labs, [1 September 2026](https://www.worldlabs.ai/blog/atlas)) is the next model, trained on text, images, video, and 3D together. They say it will power later versions of Marble and can emit images, video, point clouds, and splats. The app a beginner opens is still Marble.

### Playable, and the souvenir is video

**Genie 3 / Project Genie (Google DeepMind).** The [5 August 2025 research post](https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/) describes Genie 3 as text in, then a world you move through at about 24 frames per second and 720p, staying roughly consistent for a few minutes. There is no game engine underneath: the network paints the next frame from your actions and the frames so far.

The public product is **Project Genie**, a Google Labs prototype. It [launched 29 January 2026](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/project-genie/) for Google AI Ultra subscribers in the US, age 18+. On [19 May 2026](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/project-genie-expands/) access widened to eligible Ultra subscribers globally, and a Maps pin can start a world from US Street View imagery. You sketch with text and images (the prototype also uses Nano Banana Pro and Gemini), walk, fly, or drive, remix, and download a video. Product sessions are capped at about 60 seconds. Google’s own list of problems: latency, streams that darken, worlds that miss the prompt, physics that slip. Promptable events (change the world with a sentence while you walk) were in the research post and were absent from the January prototype. No October 2026 note turned up that they shipped. There is no mesh or splat download. A Genie video cannot be imported as a Unity level.

**Decart Oasis 3** is a hosted driving model, with a [browser preview](https://oasis3-preview.decart.ai/) and an [API](https://docs.platform.decart.ai/models/realtime/oasis-3). A text prompt sets the scene; throttle and steering return live camera frames (docs: three views, 768×512; the product page says about 22 fps and under 200 ms). It is a simulator for driving policies. It does not export a Blender scene.

**NVIDIA Cosmos 3** ([31 May 2026](https://nvidianews.nvidia.com/news/nvidia-launches-cosmos-3-the-open-frontier-foundation-model-for-physical-ai)) is an open model family for physical AI: robots and vehicles, not a beginner art app. Super (64B) and Nano (16B) shipped at the announcement. Current [docs](https://docs.nvidia.com/cosmos/latest/cosmos3/model_matrix.html) also list Edge (4B); the May press note had called Edge "coming soon," so treat Edge as documented now and check Hugging Face before you assume a checkpoint. Inputs can include text, an image, video, and actions. Outputs are text, images, video, sound mixed into that video, and action values. No mesh or splat. Super is aimed at data-center GPUs. Leave it until the task is synthetic training video.

### Real research, not a beginner app

Demos in this group are lab results. Code or a paper exists. A polished signup with a download button does not.

- **Tencent HY-World 2.0** ([paper](https://arxiv.org/html/2604.14268v1), [GitHub](https://github.com/Tencent-Hunyuan/HY-World-2.0)): text or one image goes through panorama, a camera path, extra views, then a 3D Gaussian splat and a mesh. Several photos or a video can be reconstructed instead. The README says those assets can go into Unity, Unreal, or Isaac. It is a multi-stage GPU pipeline. A third-party page mentions a hosted "HY World 2.1" in July 2026. That hosted update was not confirmed on a Tencent product page in this pass.
- **WorldPlay** ([paper](https://arxiv.org/html/2512.14614)): video you steer, about 720p at 24 fps, plus a reconstruction path to a 3D scene.
- **AlayaWorld** ([code, July 2026](https://github.com/alayalab/alayaworld)): an image plus a camera path becomes video chunks at about 24 fps. The file written is an mp4.
- **Wonder** ([paper](https://arxiv.org/pdf/2607.26037)): camera-controllable video at about 16 fps, on the order of a minute.
- **WorldGen** ([CVPR 2026 paper](https://openaccess.thecvf.com/content/CVPR2026/papers/Wang_WorldGen_From_Text_to_Traversable_and_Interactive_3D_Worlds_CVPR_2026_paper.pdf)): text to a traversable textured mesh, via a layout and an image model. No public product found.

## What you learn, and what you hand to the model

Learn the parts you will use to catch a bad export. That is the same skill as supervising an LLM later: you name what is wrong.

- Which file you asked for, and which file came back.
- Blender: orbit, move, rotate, scale, import a GLB, and notice scale and which way is up.
- Unity: import that GLB, drop it in a scene, add a collider and a light, press Play.
- A door is about 2 meters tall. If the room imports the size of a coin, the export is wrong even when it looks pretty.
- Holes, a floor you fall through, inside-out faces, a chair fused into a wall.

Hand the model the first look. One sentence, or a still you already like, can become a room or a street you would not model by hand yet. Also hand it the sides of the room you never drew, and a preview camera move.

Keep the decisions the model guesses:

- What is solid, and where a player can walk.
- Names, and which object is which.
- Lights and materials that match the rest of the scene.
- Anything that happens when a key is pressed. No current world model writes that Unity script.

A Marble high-quality mesh is on the order of 600 thousand triangles. Treat it as a backdrop or as a reference you rebuild with a few simple shapes. Cleaning every triangle by hand can wait.

## How the files enter Blender and Unity

**Video** (Grok, Dreamina, a Genie download, a Marble camera render, Oasis): keep it next to the project as reference. In Blender, one frame can sit behind the view while you model. Importing the mp4 does not build a level.

**GLB mesh** is the path that works on today’s stable tools.

- Stable Blender as of this date is **5.2.2 LTS** ([5.2.0 shipped 14 July 2026](https://www.blender.org/releases/5-2/)). It imports GLB. World Labs uses an OpenCV-style axis. If the world comes in upside down, scale Y and Z by −1 and leave X alone ([their note](https://docs.worldlabs.ai/marble/export/specs)).
- Unity imports GLB. Put a mesh collider on the coarse collider file. Use the high-quality mesh as the visible object when you have it.
- You still add the player, lights, and scripts.

**Gaussian splat** is a visual shell.

- Unity has no built-in splat renderer. World Labs’ [Unity page](https://docs.worldlabs.ai/marble/export/gaussian-splat/unity) points at the free aras-p UnityGaussianSplatting plugin, says it works on Unity 6.1, and recommends a fork because the main branch has had trouble with some Marble SPZ files and with draw order. Their notes: a 2M SPZ can import; a 500k SPZ may need a convert-to-PLY step; Unity cannot turn a splat into a collider. Headset VR is a separate, fragile setup. Get a desktop view working first.
- [Blender 5.3](https://developer.blender.org/docs/release_notes/5.3/rendering/) adds PLY and SPZ import and can draw splats in Workbench, EEVEE, and Cycles. Import only: there is no splat export. Splats land as a point cloud, so you still cannot edit them like a mesh. 5.3 is in beta until 4 November 2026, with a stable release planned for [10 November 2026](https://projects.blender.org/blender/blender/milestone/34). On Blender 5.2 LTS, use the GLB.
- The practical pair is a splat for the look and the collider GLB for the floor.

**A playable session** (Project Genie, Oasis) stays in the browser. Download or record video, then rebuild the part you want with simple meshes.

## Dreamina, Higgsfield, and Grok

These three make shots. Marble and HY-World make a place you can export. Genie and Oasis make a place that exists while you hold the keys.

| Tool | What comes out | A 3D file for Blender or Unity | You walk around inside it |
| --- | --- | --- | --- |
| Grok Imagine | Stills and clips up to 15 seconds | No mesh or splat in the official docs | No |
| Dreamina | Stills (Seedream) and clips (Seedance) | No mesh or splat export found | No |
| Higgsfield video suite | Clips, with camera and lens controls, across several video models | The suite’s output is video | No |
| Higgsfield 3D Jutsu | A browser scene, then MP4, a still, or GLB | GLB, according to their blog | You orbit a scene an agent built. It is layout, not Genie. |
| Marble | Splat, mesh, panorama, video | Yes | Orbit and edit. Character play is future work. |
| Project Genie | Live frames, plus a downloaded video | No | Yes, about 60 seconds per session |
| Cosmos 3, Oasis 3 | Video, sound, and actions or driving controls | No | Yes, aimed at robots and cars |

**Grok Imagine** is documented as image and video. The [Imagine overview](https://docs.x.ai/developers/model-capabilities/imagine), dated last updated 8 October 2026, lists `grok-imagine-image-2.0` for stills and edits (up to 5 reference images in that overview) and `grok-imagine-video-1.5` for clips. The [video overview](https://docs.x.ai/developers/model-capabilities/video/overview) says 1.5 does text-to-video and image-to-video at up to 1080p, clips of 1–15 seconds, reference-to-video with up to 14 images and 3 voice references, and pinned first, last, and mid frames. An older `grok-imagine-video` model edits and extends. Audio is generated with the picture. The docs describe shots. They do not describe a mesh, a splat, or a live walkable world.

**Dreamina** is ByteDance’s app for Seedance video and Seedream images, and it hands off toward CapCut. The [Seedance 2.5 launch note](https://dreamina.capcut.com/resource/seedance-2-5-launch) describes clips guided by up to 50 references (images, video, audio, text) and edits aimed at one moment or one object inside a clip. Their own pages disagree on the longest clip (30 seconds in some places, longer "ultra-long" numbers in others), so treat the cap as unconfirmed. "3D" on Dreamina marketing pages checked for this brief means a picture or a video that looks dimensional.

**Higgsfield** as a video studio is camera language: named cameras, lenses, and several generators under one subscription, including Seedance. **3D Jutsu** is a separate workspace. Their [blog post](https://higgsfield.ai/blog/higgsfield-3d-jutsu) describes an LLM agent that blocks a scene from primitives, a GLB library, and Mixamo characters, which you then edit by hand and export as an animated MP4, a still, or a GLB. That GLB can enter Blender the same way any other GLB can. It is a layout pass driven by chat. It does not build a Marble-style photographed room, and it does not run a Genie-style frame-by-frame world. The post names the LLMs behind the agent; that list is Higgsfield’s claim.

## Grok stays the main tool

World models do not take over this project. Grok stays where you invent, vary, and finish pictures and short clips, and where you practice telling a model what is wrong. A world model is an extra step for the day you need geometry.

1. Make the still in Grok Imagine. Keep the frame you actually like.
2. If you need a place you can orbit, send that still to Marble. Their own write-up describes this: make the image in another tool, then lift it. Use Chisel when the walls have to sit in a specific place.
3. Export a collider GLB, and a high-quality GLB if the plan allows. Import into Blender 5.2, fix scale and up-axis, delete junk, keep a shell you understand.
4. Import the cleaned GLB into Unity. Add a collider, a light, and a camera. Press Play. That scene is the lesson.
5. When the place should move, render a frame or a short camera move and hand it back to Grok Imagine to animate, extend, or restyle. The world model supplied the layout. Grok supplies the shot.

Ask Grok (the chat model) to explain a Blender or Unity step in plain language. You still click the step and decide whether the result is right.

Project Genie is optional inspiration: walk for about a minute, download the video, then rebuild the piece you liked as simple meshes or as a Grok shot. Cosmos and Oasis are for robot and driving work. They are not the next button after a Grok still.

## Uncertainty

- Pages were fetched on 11 October 2026. Export rights and prices change. Read them inside the app before paying.
- Blender and Unity import steps are from release notes and World Labs’ docs, not a fresh import test in this pass.
- Genie promptable events: left out of the January 2026 prototype; no later confirmation found.
- A hosted HY-World 2.1 was not verified on an official Tencent page.
- Dreamina’s maximum clip length is inconsistent across Dreamina’s own pages.
- Higgsfield 3D Jutsu is described from Higgsfield’s blog, not an independent run.
