---
cursor:
  subagentId: "bc-4ab746b8-d787-5f6c-bca0-6f618cfbc624"
---

# Unity, for a beginner who will later supervise an LLM

Researched 2026-10-11. This is a supervision brief, not a tutorial. Product surfaces move quickly; where docs disagree, that is called out. Confirm the Editor build in Unity Hub before you install anything.

## Mental model

Unity is a real-time engine for interactive 2D and 3D software: games, and also sims, tools, and other apps that have to respond every frame. Two programs matter:

- **Editor.** The authoring app. You compose a world, attach behavior, press Play, and fix what the Console says.
- **Player (runtime).** The built app. File > Build Profiles produces it. What you ship is this build, not the Editor. [Build Profiles](https://docs.unity3d.com/6/Documentation/Manual/build-profiles.html)

The scene is a hierarchy of **GameObjects**. A GameObject does nothing until you add **components**. Every GameObject has a **Transform** (position, rotation, scale). A mesh, a renderer, a camera, a light, a collider, a rigidbody, and a script are all components. [GameObjects](https://docs.unity3d.com/6/Documentation/Manual/GameObjects.html)

**Scenes** are levels, menus, or any other loaded context. **Assets** in the Project window (scripts, textures, models, prefabs) are files on disk. Dragging an asset into a scene makes an instance. A **prefab** is a reusable GameObject saved as an asset; editing the prefab updates instances, and an instance can override individual values. [Prefabs](https://docs.unity3d.com/6/Documentation/Manual/Prefabs.html)

Behavior is C# that inherits `MonoBehaviour`. Unity calls `Start` once and `Update` every frame. Do not use a constructor to set the object up; the Editor constructs components, and a constructor fights that. [MonoBehaviour](https://docs.unity3d.com/Manual/class-MonoBehaviour.html)

**Edit Mode** is authoring. **Play Mode** runs the game inside the Editor. Changes you make to scene objects during Play are thrown away when you stop, unless you explicitly apply them back to a prefab or scene. That single fact is the most common way an agent “succeeds” and leaves nothing behind.

Version line, as of this date:

- Unity 6 editors are numbered `6000.x`. The download archive lists **6000.6.5f1** (the 6.6 line) on 8 Oct 2026. Unity describes 6.6 as a Supported update, not an LTS, and as a step toward a **6.7 LTS** that is referenced in docs but was not in that archive listing. [Archive](https://unity.com/releases/editor/archive) · [6.6 announcement](https://discussions.unity.com/t/unity-6-6-is-now-available/1735357/1)
- **Unity 6.3 LTS** is the long-term line, supported until December 2027. Unity 6.0 LTS support runs through October 2026. A third-party release index listed 6000.3.26f1 on 8 Oct 2026; treat Hub as the source for the exact patch. [Support policy](https://unity.com/releases/unity-6/support)
- Unity canceled the Runtime Fee. Unity 6 has no runtime fee. [Unity 6 releases](https://unity.com/releases/unity-6)
- New projects should start from a **Universal 3D** or **Universal 2D** template. URP is the default renderer in Unity 6. The Built-in pipeline is deprecated and, per current graphics docs, remains supported through the 6.7 LTS lifecycle. HDRP is a different pipeline and is not compatible with a URP project. [Create a URP project](https://docs.unity3d.com/6/Documentation/Manual/urp/creating-a-new-project-with-urp.html) · [Graphics settings](https://docs.unity3d.com/6000.6/Documentation/Manual/class-GraphicsSettings.html)

Install and switch Editors with **Unity Hub** (or the Unity CLI). Pin the Editor version in the project. Do not let an agent upgrade it.

## Learn by hand first

Do these yourself until you can see a wrong scene without reading the script.

1. Create a Universal 3D project. Learn six windows: **Hierarchy**, **Scene**, **Game**, **Inspector**, **Project**, **Console**. [Key concepts](https://docs.unity.com/en-us/engine/6000.6/manual/get-started/first-time-user/key-concepts)
2. Place a plane, a cube, a light, and the camera. Move them with the Transform tools. Save the scene. Enter Play, then stop, and notice what reverted.
3. Add a **Rigidbody** and a **Collider**. Watch the difference between a visible mesh and a collision shape. One script: read input, move in `Update`, jump or fall with the rigidbody in `FixedUpdate`.
4. Make that object a **prefab**. Place two instances. Change one instance (an override). Change the prefab and see both instances follow, except the override.
5. Read a red Console error, double-click it, and fix a missing reference. A public or `[SerializeField]` field is data the Editor saves; a plain private field is not.
6. Build a Player once with File > Build Profiles and run it outside the Editor. [Build Profiles](https://docs.unity3d.com/6/Documentation/Manual/build-profiles.html)
7. Know the project on disk: `Assets` is yours and belongs in version control, with the `.meta` files (those hold GUIDs). `Library` and `Temp` are generated. `ProjectSettings/ProjectVersion.txt` records the Editor version.

That set is enough to judge an agent’s work: hierarchy, inspector values, prefab vs instance, Console, and one Play session.

## Skip at the start

- **DOTS**: Entities, ECS, Burst, Jobs. A different data model. Agents reach for it when ordinary GameObjects would do.
- **HDRP**, custom render pipelines, Shader Graph, and hand-written shaders. Stay on the URP template.
- **Netcode**, dedicated servers, multiplayer, Vivox, IAP, LevelPlay.
- **Addressables** and asset bundles. Direct references are fine until a build is actually too big.
- **UI Toolkit** (UXML/USS) and a custom editor UI. One world-space or screen-space object is enough. uGUI (Canvas) is the older UI system; pick one later and tell the agent which.
- The **old Input Manager** versus the **Input System**. Unity 6 templates often use the newer Input System. Decide once, write it down, and reject scripts that use the other.
- Animation rigging, Timeline, Cinemachine, NavMesh, joints. Second wave.
- **Unity Muse.** Deprecated. Current editor AI uses third-party models under other names. [Unity AI tools FAQ](https://unity.com/features/ai)
- In-editor **Generators** (sprites, textures, 3D, audio, animation) as your art source. Grok is the creation tool in this workflow. Generators also spend Unity AI credits.
- Writing your own MCP tools, Editor tooling, or `[CliCommand]` extensions. Learn what the stock tools can touch before you add more.

## What you must understand before handing work to an LLM

An agent can edit the scene, the prefabs, and the scripts. It cannot feel the game. You are the judge.

- **Play Mode is not a save.** If the agent enters Play and “adds” an object, stop Play and look again. Durable work is a saved scene, a prefab asset, or a script file.
- **Three different objects share one name.** The prefab asset, the instance in the scene, and a copy spawned at runtime. Overrides live on the instance. Agents often edit the wrong one.
- **Domain reload.** Saving a script recompiles and reloads the Editor’s scripting world. Runtime state dies. Older in-editor MCP connections often dropped here. After any script edit, require a fresh Console read and a new Play, not the agent’s memory of the last run.
- **Serialized vs runtime.** The Inspector shows what will be saved. A value set only in code during Play will not be there next run unless something writes it back.
- **The Console is ground truth** for compile errors. A confident explanation with a red error still in the Console is a failed change.
- **You must open the Editor.** Hierarchy, Inspector, Scene view, and one Play session. A screenshot or a log is not enough, because a cube can exist in the wrong scene, on the wrong prefab, or only while Play is held.
- **Pin the stack.** Editor version, URP, and which input system. Put that in a short project note the agent reads. Otherwise it will mix pipelines and input APIs.
- **Version control before the agent runs.** Scenes and prefabs are YAML and conflict badly. Commit a clean project first. Commit `.meta` files. Do not commit `Library`.
- **Approve the connection yourself.** Official MCP asks you to accept the client the first time. A community server that can run C# inside the Editor is write access to the project. Read the diff.
- **Small tasks.** “Add a cube and a script that rotates it” is reviewable. “Build the game” is not. Reject work you cannot point at in the Inspector.

## Agent, MCP, and automation surfaces

Names and what they enable. No setup exploit detail. These layers overlap, and Unity has been replacing the older one.

**Unity CLI + Pipeline package (current recommended agent path).** A `unity` binary manages Editors, projects, builds, and tests. The `com.unity.pipeline` package runs inside an open Editor and exposes a local HTTP server on localhost, so the scene stays loaded. `unity command` and `unity eval` drive that Editor without MCP. `unity eval` compiles a C# snippet on the Editor’s main thread. `unity mcp` is an MCP mode on the same pipeline, for clients that should not run shell commands. `unity mcp configure <client>` writes client config (`cursor` is one of the named clients). `unity skill install` adds Unity’s agent skills. Driving a live Editor this way needs Unity 6.0 or later. The CLI is free and does not use Unity AI credits. As of Unity’s 17 Sep 2026 guide, CLI was **1.0.0-beta.6** and the pipeline package **0.5.0-exp.1**; those versions will have moved. [CLI replaces in-editor MCP](https://docs.unity.com/en-us/unity-cli/replace-mcp-server-unity-cli) · [Beginner CLI and Pipeline guide](https://unity.com/resources/a-beginners-guide-to-unity-cli-and-the-pipeline-package)

**Official Unity agent plugin.** First-party plugin that bundles those skills, the CLI, and the first-party MCP server. The 17 Sep 2026 guide and the AI-tools page name **Claude Code, Codex, and Grok**, and the page says the agent list is expanding. Skills cover editor tooling, UI (UI Toolkit, uGUI, IMGUI, TextMeshPro), 2D, URP and Shader Graph, audio, scenes and physics, plus areas you should ignore for now (IAP, multiplayer). Install path published for Claude Code: `claude plugin marketplace add Unity-Technologies/unity-agent-plugin`. [AI tools](https://unity.com/features/ai) · [unity-agent-plugin](https://github.com/Unity-Technologies/unity-agent-plugin)

**In-editor Assistant (`com.unity.ai.assistant`).** Chat inside the Editor. **Ask** reads and explains. **Plan** writes a plan you approve. **Agent** creates and edits, gated by permissions. **UI Agent** generates UXML/USS when you are in Agent mode. **Checkpoints** are short-lived git snapshots (Preferences > AI > Assistant), not your real history. **Generators** make images, materials, 3D, sound, and animation inside the project and spend credits. Personal users get a trial that converts to a paid assistant subscription; Pro, Enterprise, and Industry include it. This is not Muse. [Assistant modes](https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.19/manual/about/assistant-modes.html) · [Checkpoints](https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.18/manual/automate/checkpoints.html)

**In-editor MCP server (deprecated).** The May 2026 blog and the Assistant package manual still document an MCP server inside `com.unity.ai.assistant`: Edit > Project Settings > AI > Unity MCP, a relay binary under `~/.unity/relay`, and tools such as `Unity_ManageScene`, `Unity_ManageGameObject`, and `Unity_ReadConsole`. The CLI docs say this server is deprecated and replaced by `unity mcp`. Assistant package **2.13+** fixes a conflict with the CLI. If a tutorial tells you to start the bridge in Project Settings, check the CLI page before you follow it. [May 2026 MCP post](https://unity.com/blog/unity-ai-mcp-how-to-get-started) · [Package manual (2.6 snapshot)](https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.6/manual/integration/unity-mcp-get-started.html)

**AI Gateway.** Unity’s way to attach a verified third-party agent inside the Editor. The FAQ says this path does not consume Unity credits. [AI tools FAQ](https://unity.com/features/ai)

**Sentis** (`com.unity.ai.inference`, display name Sentis; it was briefly called Inference Engine). Runs an ONNX, LiteRT, or supported PyTorch model **in the Player**. That is in-game inference, not an editor agent. Still active. [Sentis](https://docs.unity3d.com/Packages/com.unity.ai.inference@2.6/manual/index.html)

**Pre-agent automation, still how CI works.** `-batchmode` runs the Editor with no dialogs. `-executeMethod` calls a static method in an `Editor` folder. Unity Test Framework adds `-runTests` with `-testPlatform EditMode` or `PlayMode`. [Command line](https://docs.unity3d.com/Manual/EditorCommandLineArguments.html) · [Run tests](https://docs.unity3d.com/6000.7/Documentation/Manual/test-framework/run-tests-from-command-line.html)

**Community MCP servers.** Not Unity products. The CLI docs say third-party packages are unaffected by the official deprecation. **CoplayDev/unity-mcp** (also called MCP for Unity) is MIT-licensed, targets Unity 2021.3 through 6.x, and exposes scene, asset, script, test, and build tools; its repo showed v10.3.0 on 4 Oct 2026. Funplay and KitWright forks advertise larger tool lists, including running code in the Editor and driving Play Mode. Tool counts change weekly; do not memorize them. [CoplayDev/unity-mcp](https://github.com/CoplayDev/unity-mcp)

Uncertainty: the Assistant manual, the May 2026 blog, and the CLI migration page describe different “current” MCP setups at the same time. Prefer the CLI page for anything new. Beta CLI and Pipeline builds can break between weeks.

## Unity next to the other tools

Grok makes the pictures, clips, and additions. Unity is where those become something a person can walk through, click, and break. The other tools feed that runtime. None of them replace it.

| Tool | What it actually produces | What you do with it in Unity |
| --- | --- | --- |
| **Grok** | Images and short video (Grok Imagine: image generation/editing, and video models such as `grok-imagine-video-1.5`), plus, separately, a coding agent Unity’s plugin already lists | Primary source for new stills and motion references. Import a still as a texture, sprite, or UI image. Use a clip as a reference or a linear cutscene. The plugin path is how Grok would later drive the Editor; that is a different job from Imagine. [Imagine](https://docs.x.ai/developers/model-capabilities/imagine) · [Video overview](https://docs.x.ai/developers/model-capabilities/video/overview) |
| **Blender** | Real meshes, UVs, rigs, and authored animation | When you need a game object with clean geometry, not a picture of one. Unity’s primary model format is FBX. Export FBX from Blender into `Assets`. Unity can also import `.blend` by calling Blender’s FBX exporter, which requires Blender on the same machine; exporting FBX yourself is the reliable path. glTF is possible through the glTFast package, and is not the default. [Importing models](https://docs.unity3d.com/6000.5/Documentation/Manual/HOWTO-ImportObjectsFrom3DApps.html) |
| **Dreamina** | ByteDance image and video workspace. Seedance 2.5 launched on Dreamina on 31 Jul 2026: about 30 seconds of video, many reference assets, targeted edits | Same role as a Grok clip when you want a longer generated shot. It is not a scene, has no colliders, and does not take player input. [Seedance 2.5 announcement](https://www.prnewswire.com/news-releases/dreamina-launches-seedance-2-5--the-tool-of-ai-video-generation-that-reduces-clip-stitching-visual-drift-and-rework-302841204.html) |
| **Higgsfield** | Generative image, video, and audio, with a camera-control studio over several models | Optional peer for a specific shot (lens, move, product still). Bring the chosen frame or clip back as reference or media. Do not author the interactive scene there. |
| **World models** | Learned simulators that predict the next view (Google DeepMind Genie 3, World Labs Marble, NVIDIA Cosmos are the names in current comparisons). Some can export geometry or splats. A reported ByteDance real-time world model is press reporting, not a product you can install | A world model can look interactive and still not be a game: no stable object identity, no saved component graph, no build. If one exports a mesh, that mesh still enters Unity as an asset and needs colliders, a prefab, and scripts. Do not treat a world-model session as a Unity scene. |

Practical split: Grok (and, when a shot needs it, Dreamina or Higgsfield) produces pixels and reference motion. Blender produces a mesh when pixels are not enough. Unity assembles those imports into GameObjects, runs your rules every frame, and builds the Player. The LLM you supervise later should be allowed to place, wire, and script those imports. It should not be asked to invent the art pipeline, the render pipeline, or the Editor version.
