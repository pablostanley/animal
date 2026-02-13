# @vercel/animal

Opinionated animation presets for React and Next.js, with an agent-readable manifest.

## React

```tsx
"use client";

import { A, Presence } from "@vercel/animal/react";

export function Example() {
  return (
    <>
      <A.button an="hover:lift press:compress duration-180 ease-out">Button</A.button>

      <Presence present={true}>
        <A.div an="enter:fade-up exit:fade-down duration-240 ease-in-out">Hello</A.div>
      </Presence>
    </>
  );
}
```

## Agent Manifest

```ts
import { ANIMAL_MANIFEST } from "@vercel/animal";
```

