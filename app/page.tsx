import { LearnApp } from "@/components/learn-app";
import { loadCourse } from "@/lib/assemble";

export default function Page() {
  const course = loadCourse();
  return <LearnApp course={course} />;
}
