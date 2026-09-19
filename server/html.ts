import "server-only";
import sanitizeHtml from "sanitize-html";

// Rich text is rendered with dangerouslySetInnerHTML on the public site, so it is
// cleaned on the way in. Allow-list mirrors the editor toolbar exactly.
const BASIC_TAGS = ["p", "br", "strong", "em", "s", "u", "ul", "ol", "li", "a"];
const FULL_TAGS = [...BASIC_TAGS, "h2", "h3", "blockquote", "img", "hr", "code", "pre"];

export const cleanHtml = (html: string, basic = false) =>
  sanitizeHtml(html, {
    allowedTags: basic ? BASIC_TAGS : FULL_TAGS,
    allowedAttributes: { a: ["href", "target", "rel"], img: ["src", "alt"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }) },
  });
