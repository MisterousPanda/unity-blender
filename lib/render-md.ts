import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

export function renderMarkdown(markdown: string): string {
  const html = marked.parse(markdown, { async: false }) as string;
  return html
    .replaceAll("<h3", "<h4")
    .replaceAll("</h3", "</h4")
    .replaceAll("<h2", "<h3")
    .replaceAll("</h2", "</h3")
    .replaceAll("<table>", '<div class="table-scroll"><table>')
    .replaceAll("</table>", "</table></div>")
    .replaceAll("<a href=", '<a target="_blank" rel="noopener noreferrer" href=');
}
