import { Fragment } from "react";

/*
 * Splits a line into words that rise into place one after another as the text
 * scrolls into view. Pure CSS (scroll-driven animation): no JavaScript, and the
 * full sentence stays in the DOM as plain text for search engines and screen readers.
 * Spaces sit between the word boxes, since a space inside an inline-block collapses.
 */
export function Words({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span className="words">
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="word" style={{ "--w": i } as React.CSSProperties}>
            <span>{w}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
