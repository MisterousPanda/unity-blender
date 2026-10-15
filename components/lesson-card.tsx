"use client";

import { lessonComplete } from "@/lib/gates";
import type { LessonView } from "@/lib/types";
import { RIGHTS } from "@/lib/verbatim";
import { Composer } from "./composer";
import { useLearn } from "./learn-context";
import { CheckRow, Checkpoint, Fold, HandoffCard, PromptBox, SlotView } from "./widgets";

export function LessonCard({ lesson }: { lesson: LessonView }) {
  const { course, progress } = useLearn();
  const done = lessonComplete(lesson, progress);
  const pageNotices = lesson.notices.filter((notice) => notice.source === "page");
  const noteNotices = lesson.notices.filter((notice) => notice.source === "notes");
  const promptLabel =
    lesson.promptLabel === "send"
      ? course.chrome.send
      : lesson.promptLabel === "tool"
        ? course.chrome.tool
        : lesson.promptTitle;

  return (
    <article className="lesson" id={`lesson-${lesson.id}`}>
      <header className="lesson-head">
        <p className="kicker">{lesson.kicker}</p>
        <h3>{lesson.title}</h3>
        {done ? <p className="pill">complete</p> : null}
      </header>

      <section className="beat">
        <h4>
          <span>1</span> Explain
        </h4>
        <p>{lesson.explain}</p>
        {lesson.explainNotes.map((slot, index) => (
          <SlotView key={`${lesson.id}-explain-${index}`} slot={slot} />
        ))}
        {lesson.rights ? <p className="rights">{RIGHTS}</p> : null}
      </section>

      {lesson.toolPrompt || lesson.explainRequest || lesson.composer ? (
        <section className="beat">
          <h4>
            <span>2</span> Try this prompt
          </h4>
          {lesson.toolPrompt && promptLabel ? <PromptBox label={promptLabel} text={lesson.toolPrompt} /> : null}
          {lesson.explainRequest ? <PromptBox label={course.chrome.explain} text={lesson.explainRequest} /> : null}
          {lesson.composer ? <Composer form={lesson.composer} /> : null}
          {lesson.afterNotes.map((slot, index) => (
            <SlotView key={`${lesson.id}-after-${index}`} slot={slot} />
          ))}
        </section>
      ) : null}

      {lesson.practiceFinish || lesson.practice || lesson.practiceChecks || lesson.repId || lesson.sort ? (
        <section className="beat">
          <h4>
            <span>3</span> Practice
          </h4>
          {lesson.practiceFinish ? <p className="finish">Done looks like this: {lesson.practiceFinish}</p> : null}
          {lesson.practiceNote ? <p>{lesson.practiceNote}</p> : null}
          {lesson.practice ? <SlotView slot={lesson.practice} /> : null}
          {lesson.aside ? (
            <div className="aside">
              <h5>{lesson.aside.summary}</h5>
              <SlotView slot={lesson.aside.slot} />
            </div>
          ) : null}
          {lesson.sort ? <Checkpoint item={lesson.sort} confirmable={false} /> : null}
          {lesson.practiceChecks ? (
            <ol className="practice-list">
              {lesson.practiceChecks.map((item) => (
                <li key={item.id} value={item.n}>
                  <p>{item.text}</p>
                  {item.required ? (
                    <CheckRow id={item.id} label={course.chrome.rep} />
                  ) : (
                    <p className="quiet">This one stays on the page. It does not open the next stage.</p>
                  )}
                </li>
              ))}
            </ol>
          ) : null}
          {lesson.repId ? <CheckRow id={lesson.repId} label={course.chrome.rep} /> : null}
        </section>
      ) : null}

      {pageNotices.length || noteNotices.length || lesson.noticeSlot ? (
        <section className="beat">
          <h4>
            <span>4</span> What you should notice
          </h4>
          {pageNotices.map((notice) => (
            <CheckRow key={notice.id} id={notice.id} label={course.chrome.looked} text={notice.text} />
          ))}
          {lesson.noticeHeading ? <h5>{lesson.noticeHeading}</h5> : null}
          {lesson.noticeLead ? <p>{lesson.noticeLead}</p> : null}
          {lesson.noticeSlot ? <SlotView slot={lesson.noticeSlot} /> : null}
          {noteNotices.map((notice) => (
            <CheckRow key={notice.id} id={notice.id} label={course.chrome.looked} text={notice.text} />
          ))}
        </section>
      ) : null}

      {lesson.checkpoints.length > 0 ? (
        <section className="beat">
          <h4>
            <span>5</span> Checkpoint
          </h4>
          {lesson.checkpoints.map((item) => (
            <Checkpoint key={item.id} item={item} />
          ))}
        </section>
      ) : null}

      {lesson.handoff || lesson.handoffNote || lesson.composer ? (
        <section className="beat">
          <h4>
            <span>6</span> Hand this to an LLM later
          </h4>
          {lesson.handoffNote ? <SlotView slot={lesson.handoffNote} /> : null}
          {lesson.handoff ? <HandoffCard card={lesson.handoff} /> : null}
          {lesson.composer === "creation" ? <p>The card title is Creation: crate.</p> : null}
          {lesson.composer === "addition" ? (
            <p>The Blender and Unity tabs are handoffs. The Imagine addition is the one that opens the next stage. The card title is Addition: crate.</p>
          ) : null}
        </section>
      ) : null}

      {lesson.folds.map((fold) => (
        <Fold key={fold.summary} summary={fold.summary}>
          <SlotView slot={fold.slot} />
        </Fold>
      ))}
    </article>
  );
}
