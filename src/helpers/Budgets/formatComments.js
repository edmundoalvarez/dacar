// helpers/Budgets/formatComments.js
import DOMPurify from "dompurify";

export function formatComments(html = "") {
  if (!html) return "";

  let sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "b",
      "strong",
      "i",
      "em",
      "u",
      "h1",
      "h2",
      "p",
      "br",
      "hr",
      "ul",
      "ol",
      "li",
      "span",
    ],
    ALLOWED_ATTR: ["class", "style"],
  });

  // 1) Eliminar clases de Quill
  sanitized = sanitized.replace(/\sclass="ql-[^"]*"/g, "");

  // 2) Normalizar listas (<ul>)
  sanitized = sanitized
    .replace(
      /<ul([^>]*class=")([^"]*)(")/g,
      "<ul$1list-disc list-inside ml-4 text-left $2$3"
    )
    .replace(
      /<ul(?![^>]*class=)/g,
      '<ul class="list-disc list-inside ml-4 text-left"'
    );

  // 2.1) Normalizar headings
  sanitized = sanitized
    .replace(
      /<h1([^>]*class=")([^"]*)(")/g,
      '<h1$1text-xl font-semibold text-left $2$3'
    )
    .replace(
      /<h2([^>]*class=")([^"]*)(")/g,
      '<h2$1text-lg font-semibold text-left $2$3'
    )
    .replace(/<h1(?![^>]*class=)/g, '<h1 class="text-xl font-semibold text-left"')
    .replace(/<h2(?![^>]*class=)/g, '<h2 class="text-lg font-semibold text-left"');

  // 3) Forzar que <li> siempre esté alineado a la izquierda
  sanitized = sanitized.replace(/<li([^>]*)>/g, '<li$1 class="text-left">');

  // 4) Arreglar posibles ">>"
  sanitized = sanitized.replace(/>+(\s*)<li/g, "><li");

  return sanitized;
}
