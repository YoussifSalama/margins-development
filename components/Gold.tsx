import { Fragment } from "react";

// CMS headings mark highlighted words as <gold>…</gold> and use a line break for a new line —
// the same convention the translation files used with t.rich(). Anything else is plain text.
export default function Gold({ text, className = "text-accent" }: { text: string; className?: string }) {
  return (
    <>
      {text.split("\n").map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {lineIndex > 0 && <br />}
          {line.split(/(<gold>.*?<\/gold>)/g).map((part, index) => {
            const match = part.match(/^<gold>(.*)<\/gold>$/);
            return match ? <span key={index} className={className}>{match[1]}</span> : <Fragment key={index}>{part}</Fragment>;
          })}
        </Fragment>
      ))}
    </>
  );
}
