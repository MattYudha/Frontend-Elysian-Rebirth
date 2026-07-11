import React from 'react';

export default function CodeBlock({ children, language }: { children: string; language?: string }) {
  return (
    <div className="relative rounded-lg bg-zinc-950 p-5 border border-zinc-800 font-mono text-sm overflow-x-auto text-zinc-100 my-4 text-left">
      <div className="absolute top-3 right-3 text-xs text-zinc-500 uppercase font-semibold tracking-wider">{language}</div>
      <pre><code className="block leading-relaxed">{children}</code></pre>
    </div>
  );
}
