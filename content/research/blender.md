---
cursor:
  subagentId: "bc-b8033e82-a65f-57f8-9a94-07b9b04bd801"
---

# Blender, for a beginner who will later supervise an LLM

Checked against public docs on 2026-10-11. Current stable long-term release found: **Blender 5.2.2 LTS** (initial 5.2.0 on 2026-07-14, supported through July 2028). **Blender 4.5 LTS** is still maintained (4.5.14 on 2026-09-15, through July 2027). A newer patch may exist if the download index moved after those pages.

Sources: [5.2 LTS](https://www.blender.org/releases/5-2/), [LTS program](https://www.blender.org/download/lts/), [5.2 feature recap](https://www.blender.org/download/releases/5-2/), [5.0 release](https://www.blender.org/press/blender-5-0-release/), [5.1 release](https://www.blender.org/releases/5-1/).

## Mental model

Blender is a free, open-source 3D creation suite (GPL), run by the Blender Foundation. One application covers modeling, sculpting, rigging, animation, simulation, rendering, compositing, motion tracking, video editing, and game-asset export. Python scripting is part of the product, not an add-on you have to invent. [About](https://www.blender.org/about/), [Features](https://www.blender.org/features/).

Think of a `.blend` file as a database, not a single mesh:

- A **data-block** is a named thing in that database: scene, object, mesh, material, image, node tree, action. Names are unique per type. Data-blocks can be shared. [Data-blocks](https://docs.blender.org/manual/en/5.2/files/data_blocks.html), [file intro](https://docs.blender.org/manual/en/5.2/files/introduction.html).
- An **object** is a transform (location, rotation, scale) plus a link to **object data**. Two objects can share one mesh. A light’s data is the lamp; a camera’s data is focal length and sensor. [Objects](https://docs.blender.org/manual/en/5.2/scene_layout/object/introduction.html).
- A **scene** is one setup of visible objects, camera, lights, and render settings. One file can hold several scenes that share data. [Scenes](https://docs.blender.org/manual/en/5.2/scene_layout/scene/introduction.html).
- **Collections** group objects. They are how you organize a shot and how you re-export the same asset. [Collections](https://docs.blender.org/manual/en/5.2/scene_layout/collections/collections.html).
- The **Outliner** is the file’s table of contents. Use it before you trust a screenshot.

Three render engines ship with 5.2. **Workbench** is a fast modeling preview. **EEVEE** is real-time rasterization. **Cycles** is a path tracer for final lighting. The same material can look different in each. [Render engines](https://docs.blender.org/manual/en/5.2/render/render_engines.html), [Rendering features](https://www.blender.org/features/rendering/).

You work in **modes**. Object Mode moves whole objects. Edit Mode changes the mesh (vertices, edges, faces). Other modes (sculpt, weight paint, pose) are separate tools with their own rules. An LLM that runs a tool in the wrong mode will fail or edit the wrong thing.

## Learn by hand first

Do these on a default cube before any agent is connected. The 5.2 manual map is the syllabus: [manual index](https://docs.blender.org/manual/en/latest/index.html).

**Modeling.** Add primitives. Move, rotate, scale. In Edit Mode: extrude, inset, loop cut, merge, delete. Set the object origin. Learn one modifier stack and leave it live: Mirror, then Subdivision Surface, and know what Apply does (it bakes the result into the mesh and removes the live modifier). Shade smooth versus flat. Check face normals (blue out, red in).

**Materials.** Open the Shader Editor. The default surface is **Principled BSDF**: base color, metallic, roughness, and a few extras cover most starter looks. Plug an image into Base Color. Unwrap a simple mesh (Smart UV Project is enough at first) and confirm the texture lands where you expect. Viewport display color and the shader are different settings. 5.2 adds a Thin Wall mode on Principled BSDF for paper, leaves, and thin glass; skip it until a normal opaque material makes sense. [5.2 recap](https://www.blender.org/download/releases/5-2/).

**Lighting.** Place a Sun, an Area, and a Point, and see what each does. Add a camera and frame the object (numpad 0 in the default keymap). Set a World color, then try one HDRI as the world so you can see image-based lighting. Render once in EEVEE and once in Cycles on the same scene.

**Animation.** Set the frame range. Insert location and rotation keyframes. Scrub the Timeline. Open the Graph Editor and move one key so you see interpolation. Parent an object to another (or to an Empty) and animate the parent. That is the whole idea: properties change over frames, and parents carry children.

**Export.** Save the `.blend` first. Export is a copy, not the source. Formats documented for 5.2 include Alembic, USD, OBJ, FBX, PLY, and STL, plus the bundled glTF 2.0 add-on. [Import/export](https://docs.blender.org/manual/en/5.2/files/import_export/index.html), [glTF 2.0](https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html).

- **glTF Binary (`.glb`)** is the first export to learn. One file, meshes and textures packed, used on the web and supported by Unity, Unreal, and Godot. Enable the glTF 2.0 add-on if File → Export does not list it. Turn on **Y Up** (glTF’s convention) and **Apply Modifiers** when you want the baked mesh.
- **FBX** is the older game-engine path. Axis and scale options matter; embedded textures are off unless you ask.
- **OBJ** is a static mesh. **STL** is for printing. **USD** and **Alembic** are pipeline formats; recognize the names, do not start there.

After each export, open the file in a viewer or in Unity. If it is the wrong size, on its side, black, or missing UVs, fix it in Blender and export again.

## Skip at the start

The suite is large. These are real features, and they are the wrong first week:

- Sculpting, retopology, and multiresolution.
- Rigging, weight painting, shape keys, constraints, drivers, and the NLA editor. Pose a cube with keyframes before you build an armature.
- Geometry Nodes as a language. In 5.2 they also drive cloth and hair through an XPBD solver, effectors, and bundles. Powerful, and opaque until modifiers make sense. [5.2 recap](https://www.blender.org/download/releases/5-2/).
- Fluid, smoke, particles, and rigid-body sims.
- Compositor, motion tracking, and the Video Sequencer. Blender can edit video; that is a different job.
- Grease Pencil, Freestyle, and color-management pipelines (ACES landed as a 5.0 theme; treat it as production setup).
- Writing add-ons, custom render engines, or UI panels.
- Chasing 5.2-only nodes (sound sockets, Mesh Bevel node, online Essentials libraries) before the default cube is boring.

## What you must understand before an LLM drives Blender

The model will call Python against a live file. Your job is to notice a wrong scene, not to type the script.

1. **Object versus data.** “Delete the cube” can delete the object and leave the mesh, or the reverse. Shared meshes mean an edit hits every object that uses them.
2. **Mode and context.** Operators (`bpy.ops`) only run when Blender’s poll check passes: right mode, right selection, sometimes the mouse in the 3D View. The official error is `poll() failed, context is incorrect`. Data edits through `bpy.data` do not need that context and are the sturdier path. [Python quickstart](https://docs.blender.org/api/5.2/info_quickstart.html).
3. **Selection is not a name.** Scripts often use the active object. If the wrong object is active, the script succeeds on the wrong thing.
4. **Transforms.** Unapplied scale makes shading, physics, and export look wrong. Apply scale (and usually rotation) before you hand a mesh to a game engine. Blender’s default up axis is Z. glTF export with **Y Up** converts to the glTF convention. [glTF transform](https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html).
5. **Modifiers are non-destructive until applied or exported with Apply Modifiers.** A viewport can show a subdivided mesh while the saved mesh is still a cube.
6. **Materials are node trees.** Setting a viewport color does not paint the render. Principled BSDF inputs are the values that travel through glTF, and only a subset of Blender nodes survive that export.
7. **Normals, manifold-ness, and poly count.** Flipped normals look black. Holes and interior faces break print and game collision. A Subsurf level of 4 can turn a small prop into an unusable file. Ask for a face count.
8. **Units and names.** Agree on meters and on names (`GEO_`, `LGT_`, `CAM_`) before the agent renames the file. Data-block names in current Blender can be long (5.0 raised the limit to 255 bytes). [5.0 notes](https://developer.blender.org/docs/release_notes/5.0/).
9. **Animation API drift.** `keyframe_insert` is the simple call. The 5.2 low-level action API uses slots, layers, strips, and channelbags. Older tutorials that only do `action.fcurves.new(...)` are suspect on 5.x until you check the [5.2 quickstart](https://docs.blender.org/api/5.2/info_quickstart.html).
10. **Save, then let it run, then look.** There is no general undo across an MCP session you can trust as a safety net. Save a copy. Judge the result in the viewport and in an exported `.glb`, not from the model’s summary. The official lab server will run model-written code with no sandbox. [Lab warning](https://www.blender.org/lab/mcp-server/).

A useful supervision prompt is a checklist: which object, which mode, applied scale, modifier state, material on Principled BSDF, face count, and a `.glb` that reimports at the right size.

## MCP, Python, and agent surfaces

Blender has **no built-in LLM connection**. Anything that “talks to Blender” is Python, an add-on, or both. [Lab MCP page](https://www.blender.org/lab/mcp-server/).

**Python, the real surface.** Blender embeds Python. `bpy` reads and writes the file, `bpy.ops` runs tools, `bmesh` edits mesh topology, `mathutils` does vectors and matrices. You run code from the Scripting workspace (Text Editor or Python Console) or from the command line in background mode. Enable Developer Extras and Python tooltips so a button shows the property a script would set. The API is described as generally stable, with areas still changing. Same quickstart link as above. Background execution is `blender --background file.blend --python script.py` (standard documented CLI pattern; exact flags are in the manual’s command-line section).

**Blender Lab MCP (official experiment, not a built-in feature).** Docs: [blender.org/lab/mcp-server](https://www.blender.org/lab/mcp-server/). Source: [projects.blender.org/lab/blender_mcp](https://projects.blender.org/lab/blender_mcp). Requires **Blender 5.1 or newer**, a separate add-on inside Blender, an MCP server process, and an MCP client. Flow: client over stdio to the `blender-mcp` process, then a TCP socket to the add-on, which runs the request. The package also ships API and manual excerpts for the model. The lab page’s own examples are inspection and cleanup: poly-count versus screen size, renaming data-blocks, “which objects use this material,” and explaining a Geometry Nodes tree. It also shows the model missing a modifier and under-counting polygons, which is why a human still checks.

Tagged **v0.3.0** documents these tools ([readme at that tag](https://projects.blender.org/lab/blender_mcp/src/tag/v0.3.0/readme.rst)). Several have a `_for_cli` twin that opens a file in background Blender:

- `execute_blender_code` — run Python in the live session
- blend-file summaries: data-block counts, missing files, linked libraries, path and save state, a guessed use
- `get_objects_summary`, `get_object_detail_summary`
- screenshots of an area or the whole window, plus a JSON description of the window layout
- jump to a workspace tab or frame an object in the 3D View
- `render_thumbnail_to_path`, `render_viewport_to_path`

The live tree says the tool list is generated into `readme_tools.rst`. Treat the v0.3.0 names as a snapshot, not a frozen API.

**Community MCP, widely documented: [ahujasid/mcp-for-blender](https://github.com/ahujasid/mcp-for-blender).** The README says the PyPI name moved from `blender-mcp` to `mcp-for-blender`, and that `uvx blender-mcp` still starts it. An add-on listens in Blender; the MCP server speaks stdio and forwards to that socket (default host `localhost`, port `9876`). The README’s tool set, as fetched:

- `execute_blender_code` — arbitrary Python in the live file
- `look` — viewport, camera, multi-angle sheet, or animation frames, in solid, material, rendered, wireframe, or x-ray
- `get_scene_info` — compact per-object summary
- `generate_3d` — import a generated model via Tripo, Hunyuan3D, or Hyper3D Rodin (needs those accounts)
- `search_assets` / `import_asset` — Poly Haven, Sketchfab, Poly Pizza
- `get_addon_status`
- `disable_telemetry`, `record_trajectory_feedback`

`BLENDER_MCP_SAFE_MODE=1` is described as rejecting scripts that leave `bpy` / `bmesh` / `mathutils` / the stdlib, including `eval`, file and network access. Rendering, saving, and import/export operators are still allowed. Safe mode is optional and off by default. This description is the project’s; it is not Blender Foundation software.

Other community servers exist and do not match each other. Examples seen in search: [RFingAdam/mcp-blender](https://github.com/RFingAdam/mcp-blender) (advertises a very large tool list) and [zorak1103/blender-mcp](https://github.com/zorak1103/blender-mcp) (an HTTP endpoint inside an add-on). Tool names and counts there were not re-checked line by line. Do not write a supervisor prompt against “the Blender MCP.” Name the server and the Blender version.

## Where Blender sits next to the other tools

Grok is the primary tool for creations and additions: new stills, edits, and short clips. Blender is the DCC tool that turns a result into a shaped, named, exportable 3D asset. The others sit on different sides of that line.

| Tool | What it actually is | What you use it for | What you still do in Blender |
| --- | --- | --- | --- |
| **Grok Imagine** | xAI image and video API. Image generation and edits (up to 5 source images). Video from text or a still, edits, extension. On `grok-imagine-video-1.5`, reference-to-video with up to 14 images and 3 voice references, and pinned frames. Clips up to 15 seconds at 480p, 720p, or 1080p, with generated audio. [Imagine overview](https://docs.x.ai/developers/model-capabilities/imagine), [API page](https://x.ai/api/imagine) | First picture, a variation, a reference board, a short motion test | Rebuild or clean the 3D asset those images depict. Grok does not hand you an editable mesh, UVs, or a `.blend` |
| **Dreamina** | ByteDance creative app on Seed models. Seed’s site points image work at **Seedream 5.0 Pro** and video at **Seedance 2.5**. BytePlus describes Seedance 2.5 as 30-second generations, up to 50 image/video/audio references, in-place edits, and synced audio. Those figures are vendor product copy. [Seed](https://seed.bytedance.com/en/models), [BytePlus Seedance](https://ai.byteplus.com/en/product/seedance) | Alternate generator for stills and longer reference-heavy clips | Same as Grok: pixels in, mesh work out |
| **Higgsfield** | AI video and image platform that hosts many models and adds its own production tools (Cinema Studio, Genjutsu motion/object edits, ads tools). The homepage names Seedance 2.5 and a long list of other models; that roster is marketing copy and was not verified model by model. [higgsfield.ai](https://higgsfield.ai/) | Shot design, camera-style variation, and generated clips when you want a studio UI over several models | Layout, scale, materials, and export if any of that footage has to become a real-time asset |
| **World models** | Systems that generate an explorable world, not a DCC scene. **Genie 3** (Google DeepMind) builds a photorealistic environment from text that you move through in real time. **Marble** (World Labs) builds a persistent 3D world from text, images, video, panoramas, or a coarse layout, and says you can export “various 2D and 3D formats.” Exact Marble formats were not listed on the page fetched. [Genie 3](https://deepmind.google/models/genie/), [World Labs](https://www.worldlabs.ai/) | Block out a place, a camera path, or a spatial idea | When you need a durable asset: retopology, scale, collision, UVs, materials, LODs. A world-model export is a starting mesh, if it is a mesh at all. Genie 3’s public description is an interactive video world |
| **Unity** | Real-time 3D engine for games, apps, and experiences. The current manual line found is **Unity 6.5**. It imports prepared assets and runs them with physics, lighting, and gameplay. Unity’s own AI tools (Assistant, Generators, Sentis) live in the engine, separate from Blender MCP. [Unity 6.5 manual](https://docs.unity.com/en-us/engine/6000.5/manual), [Unity docs](https://docs.unity.com/) | The place the asset is used | Author and repair the asset, then export `.glb` (or FBX if a project already requires it) |

Practical order for this stack: Grok (or Dreamina or Higgsfield) makes the picture or the clip. You decide what must exist as 3D. Blender builds or cleans that asset. Unity consumes the export. A world model can suggest the space; it does not replace the `.blend`.

## Short path

1. Install Blender 5.2 LTS. Learn the default keymap on one scene: model, Principled material, three lights, ten keyframes, one `.glb`.
2. Read the Outliner until object versus mesh is obvious.
3. Only then attach an MCP server, on a copy of the file, preferably on a machine without personal data. Prefer the Lab server if you want the Foundation experiment, or `mcp-for-blender` if you want viewport screenshots and asset import. Pin the Blender version in the prompt so the model stops copying 3.x scripts.
