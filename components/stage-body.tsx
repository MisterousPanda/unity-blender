"use client";

import { stageComplete } from "@/lib/gates";
import { buildBrief } from "@/lib/message";
import type { Choice, SimCall, StageNode, StageView } from "@/lib/types";
import { LessonCard } from "./lesson-card";
import { useLearn } from "./learn-context";
import { Checkpoint, CheckRow, CopyButton, Fold, SlotView } from "./widgets";

const CHOICES: Choice[] = ["Allow", "Ask me first", "Refuse"];

export function StageBody({ stage }: { stage: StageView }) {
  const lessons = stage.nodes.flatMap((node) => (node.type === "lesson" ? [node.lesson] : []));
  return (
    <div id="stage-top">
      <header className="stage-head">
        <p className="kicker">Stage {stage.index}</p>
        <h2>{stage.name}</h2>
        <p className="good-enough">{stage.goodEnough}</p>
      </header>
      {lessons.length > 1 ? (
        <nav className="jump" aria-label="Lessons in this stage">
          {lessons.map((lesson) => (
            <a key={lesson.id} href={`#lesson-${lesson.id}`}>
              {lesson.kicker}
            </a>
          ))}
        </nav>
      ) : null}
      <div className="stack">
        {stage.nodes.map((node, index) => (
          <StageNodeView key={`${stage.id}-${index}`} node={node} />
        ))}
      </div>
    </div>
  );
}

function StageNodeView({ node }: { node: StageNode }) {
  const { course } = useLearn();
  if (node.type === "lesson") return <LessonCard lesson={node.lesson} />;
  if (node.type === "pointer") return <p className="pointer">{node.text}</p>;
  if (node.type === "perishable") return <p className="perishable">{course.perishable}</p>;
  if (node.type === "gate") {
    return (
      <section className="gate">
        <h3>Stage check</h3>
        <Checkpoint item={node.checkpoint} />
      </section>
    );
  }
  if (node.type === "fold") {
    if (node.slots.length === 0) return null;
    return (
      <Fold summary={node.summary}>
        {node.slots.map((slot, index) => (
          <SlotView key={`${node.summary}-${index}`} slot={slot} />
        ))}
      </Fold>
    );
  }
  if (node.type === "keep") return <Keep />;
  if (node.type === "judge-table") return <JudgeTable />;
  if (node.type === "heading") {
    return (
      <header className="lesson-head">
        <p className="kicker">{node.kicker}</p>
        <h3>{node.title}</h3>
      </header>
    );
  }
  if (node.type === "catch") return <CatchList />;
  if (node.type === "brief") return <BriefForm />;
  if (node.type === "simulator") return <Simulator />;
  if (node.type === "agent") {
    return (
      <Fold summary="What an agent can touch">
        {node.slots.map((slot, index) => (
          <SlotView key={`agent-${index}`} slot={slot} />
        ))}
      </Fold>
    );
  }
  if (node.type === "capstone") return <Capstone />;
  return null;
}

function Keep() {
  const { course } = useLearn();
  return (
    <section className="panel">
      <h3>What you keep</h3>
      <p>You keep these.</p>
      <ul>
        {course.keep.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>{course.pasteRule}</p>
      <p>{course.mayLead}</p>
      <ul>
        {course.may.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>{course.waitsLead}</p>
      <ul>
        {course.waits.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function JudgeTable() {
  const { course } = useLearn();
  return (
    <section className="panel">
      <h3>After each stage</h3>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>After</th>
              <th>You can judge</th>
              <th>Grok may be asked to</th>
            </tr>
          </thead>
          <tbody>
            {course.judgeRows.map((row) => (
              <tr key={row.after}>
                <th scope="row">{row.after}</th>
                <td>{row.judge}</td>
                <td>{row.ask}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CatchList() {
  const { course } = useLearn();
  return (
    <section className="panel">
      <h3>I can catch this</h3>
      {course.catchList.map((item) => (
        <CheckRow key={item.id} id={item.id} label="I can catch this" text={item.text} />
      ))}
    </section>
  );
}

function BriefForm() {
  const { course, progress, setDraft, saveBrief, setRisky } = useLearn();
  const stored = progress.drafts["standing-brief"];
  const values = Object.fromEntries(course.briefFields.map((field) => [field.id, stored?.[field.id] ?? field.initial]));
  const message = buildBrief({
    goal: values.goal ?? "",
    allowed: values.allowed ?? "",
    pipeline: values.pipeline ?? "",
    done: values.done ?? "",
    notice: values.notice ?? "",
    stop: values.stop ?? "",
    fresh: values.fresh ?? "",
  });

  function edit(id: string, value: string) {
    setDraft("standing-brief", { ...values, [id]: value });
  }

  return (
    <section className="panel">
      <h3>Standing brief</h3>
      {course.briefFields.map((field) => (
        <label key={field.id} className="field">
          <span>{field.label}</span>
          <textarea rows={field.id === "pipeline" ? 5 : 3} value={values[field.id] ?? ""} onChange={(event) => edit(field.id, event.target.value)} />
        </label>
      ))}
      <label className="check">
        <input type="checkbox" checked={Boolean(progress.risky.brief)} onChange={(event) => setRisky("brief", event.target.checked)} />
        <span>
          <span className="check-label">{course.chrome.risky}</span>
        </span>
      </label>
      <div className="prompt">
        <div>
          <p className="eyebrow">Standing brief</p>
          {message ? <pre>{message}</pre> : <p className="missing">Fill every line of the brief.</p>}
        </div>
        <CopyButton text={message ?? ""} disabled={!message} />
      </div>
      <button type="button" className="button" disabled={!message} onClick={() => message && saveBrief(message)}>
        Save to my notes
      </button>
      {progress.briefSaved ? <p className="saved-flag">In My notes</p> : null}
    </section>
  );
}

function Simulator() {
  const { course } = useLearn();
  return (
    <section className="panel">
      <h3>Seven calls</h3>
      {course.calls.map((call) => (
        <CallCard key={call.id} call={call} />
      ))}
      <h3>One more if you want</h3>
      {course.optionalCalls.map((call) => (
        <CallCard key={call.id} call={call} />
      ))}
    </section>
  );
}

function CallCard({ call }: { call: SimCall }) {
  const { course, progress, setChoice, setRisky } = useLearn();
  const current = progress.simulator[call.id];
  return (
    <article className="call">
      <p className="kicker">{call.title}</p>
      <p>{call.text}</p>
      <div className="choice-row" role="radiogroup" aria-label={call.title}>
        {CHOICES.map((choice) => (
          <label key={choice} className={current === choice ? "choice is-on" : "choice"}>
            <input
              type="radio"
              name={call.id}
              value={choice}
              checked={current === choice}
              onChange={() => setChoice(call.id, choice)}
            />
            {choice}
          </label>
        ))}
      </div>
      {current ? (
        <div className="recommendation" aria-live="polite">
          <p>
            <strong>Recommended: {call.decision}</strong>
          </p>
          <p>{call.reason}</p>
          {current !== call.decision ? (
            <p>Yours is different from the recommendation. You can change it. The answer still counts.</p>
          ) : null}
          {call.risky ? (
            <label className="check">
              <input type="checkbox" checked={Boolean(progress.risky[call.id])} onChange={(event) => setRisky(call.id, event.target.checked)} />
              <span>
                <span className="check-label">{course.chrome.risky}</span>
              </span>
            </label>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function Capstone() {
  const { course, progress } = useLearn();
  const stage = course.stages.find((item) => item.id === "supervise");
  const done = stage ? stageComplete(stage, progress, course) : false;
  return (
    <section className={done ? "capstone is-complete" : "capstone"}>
      <h3>Capstone</h3>
      <p>{course.capstone}</p>
    </section>
  );
}
