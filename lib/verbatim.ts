export const PENDING =
  "The notes for this part are not in yet. The idea below is enough for the checkpoint. Practice steps show up when the matching research file has this section.";

export const WELCOME = [
  "You are learning to direct a set of tools. Unity runs interactive scenes. Blender makes the 3D assets. Grok is where you decide, and where stills and short clips start. Dreamina and Higgsfield are studios you open when a shot needs what they specifically do. A world model sometimes gives you a clip, and sometimes a file you can place in Blender or Unity. You will decide when the work is good enough, and you will approve the actions Grok takes in those tools.",
  "Six stages. A stage is done when you can direct the work and check it.",
];

export const GROK_LINE =
  "Grok writes creations and additions once you reach stage 5. Until then, Grok only explains.";

export const CHROME = {
  copy: "Copy",
  copied: "Copied",
  explain: "Ask Grok to explain this",
  tool: "In the tool",
  send: "Send this to Grok",
  looked: "I looked",
  rep: "I did the rep",
  confirm: "This matches what I meant",
  notes: "My notes",
  copyNotes: "Copy all my notes",
  risky: "This needs a fresh yes from me",
  reset: "Reset my progress",
} as const;

export const CHOOSE_RULE =
  "Use Grok Imagine for a still, an edit, or a short clip. Open Dreamina or Higgsfield when the notes name a job those studios do, such as a long reference-heavy shot, a clay-render reference, camera panels, an ad, a GLB, or a mesh written into Blender. Use Blender when you need an editable model. Use Unity when the result has to respond to someone. A world-model video is a reference. A mesh or a splat can enter Blender or Unity after you check scale and which way is up. Collision, score, and what the player can do live in Unity.";

export const RIGHTS =
  "Use the output only in ways you are allowed to. Read Rights and accounts in the notes before you publish anything.";

export const POINTER = "The full split is stage 3.";

export const PERISHABLE =
  "Model names, prices, and clip lengths in the notes are perishable.";

export const HANDOFF_NOT_ADDITION = "Handoff, not an addition.";

export const CAPSTONE =
  "You can supervise this project. Grok may draft and, inside your standing brief, call the tools. You still own the goal, the checks, and every fresh yes.";

export const MCP_EXPLAIN =
  "MCP is a way for Grok to call a tool with a named action and arguments, instead of only describing the action in chat. Your job is the same either way: see which tool, see what will change, and allow it, ask first, or refuse it. This page shows the actions in plain language. It does not connect to your tools.";

export const PAIR = `Plain: Add a RotateSlowly component to the object named Crate. Do not enter Play mode yet.

Compact:
Tool: unity
Action: add_component
Object: Crate
Component: RotateSlowly`;

export const STAGE4_CARD = `Grok Imagine is the default for stills, edits, and short clips.
Dreamina returns pictures and video, not a mesh. I open it when the notes name that job.
Higgsfield video is reference. A GLB or a Blender insert is scene data only after the checks in the notes.
A world-model video is reference. A mesh or a splat can be placed after I check size and up-axis.
I check subject, extras, and identity across motion.
Unity keeps collision and player rules. Blender keeps the editable crate.`;

export const CREATION = `Goal: One still of a small closed wooden crate I can reuse as reference.
Tool: Grok Imagine.
Constraints: One crate, about the size of a cardboard moving box, three-quarter view, soft daylight, plain gray background. No text. No people. No extra objects.
Done when: I have one still, the crate is fully in frame, and I saved the prompt next to it.
Notice: The crate is one object. Nothing I excluded appeared. I can say what I would change in one phrase.
Stop if: The image is a mesh claim, a Unity scene, or a file I cannot open as a picture.
Do not spend, delete, overwrite source files, publish, send messages, or change accounts.`;

export const CREATION_BLENDER = `Goal: A small closed wooden crate I can edit as 3D.
Tool: Blender.
Constraints: One crate, real-world size next to a 1 meter cube. No characters. Keep a camera that sees the whole crate. Save the .blend before any export.
Done when: I can orbit the crate in Object Mode, and I have one rendered still with the crate fully in frame.
Notice: I know which mode I am in. The crate is one object. Scale is applied. The still matches the camera.
Stop if: The crate is open, there are extra objects, or the source file was not saved.
Do not spend, delete, overwrite source files, publish, send messages, or change accounts.`;

export const ADDITION = `Goal: A second angle of the same crate.
Tool: Grok Imagine.
Already exists: The crate still from the creation message, and the prompt saved beside it.
Keep unchanged: One closed wooden crate, the same proportions, no text, no people.
Done when: I have a new still from another angle, and one sentence on what changed (angle, light, or crop) and what stayed.
Notice: The crate still reads as the same crate. No extra objects arrived.
Stop if: The design drifts, or the result claims to be a mesh or a Unity scene.
Do not spend, delete, overwrite source files, publish, send messages, or change accounts.`;

export const HANDOFF_BLENDER = `Goal: Add a lid that sits on the crate mesh.
Tool: Blender.
Already exists: The closed crate in the current Blender file.
Keep unchanged: The crate body, its size, and the camera angle.
Done when: The lid is a separate object resting on top, and a new still shows both.
Notice: The lid does not intersect the body. The body's scale is still applied. The .blend was copied before the edit.
Stop if: The body was rebuilt from scratch or the old file was overwritten without a copy.
Do not spend, delete, overwrite source files, publish, send messages, or change accounts.`;

export const HANDOFF_UNITY = `Goal: Make the imported crate turn slowly while Play mode runs.
Tool: Unity.
Already exists: The crate imported into the scene, upright, about the size of a 1 meter cube.
Keep unchanged: The crate mesh and its scale. The Blender source file.
Done when: In Play mode the crate rotates. After I stop, the editing scene matches the saved scene. The Console has no red line from this change.
Notice: I exited Play mode before any further edits. I know whether I edited the prefab asset or the scene instance.
Stop if: The change exists only while Play mode is running, or anyone proposes deleting the Blender file.
Do not spend, delete, overwrite source files, publish, send messages, or change accounts.`;

export const STANDING_BRIEF = `Goal: A crate in a Unity scene that rotates in Play mode, plus one mood still for reference.
Allowed tools: Grok Imagine, Blender, Unity.
Pipeline: Grok Imagine makes the mood still. Blender makes the crate at real size. Export FBX, or GLB if this Unity project uses glTFast. Import. I check upright, size against a 1 meter cube, and material. Then add the rotate component in Unity. The still is reference only.
Done when: Play mode shows a slow rotation, Stop returns me to the saved scene, the Console is clear, the Blender file still exists, and the still matches the crate.
Notice: Upright, 1 meter scale, material either survived or is queued for a rebuild, subject stays the crate, no extra objects. I know prefab asset versus scene instance.
Stop if: A check fails, a tool outside this list is proposed, or a call wants a fresh yes.
Fresh yes required for: spend, delete, overwrite source files, publish, send messages, change accounts.`;

export const PAGE_DOES_NOT_CALL =
  "Sending it to a live Grok chat is encouraged and is the same tick; the page itself does not call Grok.";
