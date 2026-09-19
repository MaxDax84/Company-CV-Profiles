// Renders a JSON-LD structured-data block. Plain component (no "use client")
// so it works from server and client trees alike — what matters is that the
// <script> ends up in the server-rendered HTML, which is the only copy a
// crawler or an answer engine reads.
//
// dangerouslySetInnerHTML is the documented way to emit JSON-LD in React:
// putting the JSON in as a child would have React escape it into HTML
// entities, which no parser would then read back as JSON. The data is
// built by us from local constants (never from user input), and the "<"
// replacement below closes the one remaining hole, a "</script>" appearing
// inside a string value.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
