# What is Mini-Z?
Refer to README.md for what Mini-Z is and its purpose.

Keep *ALL* main Mini-Z logic in a single file - mz.js - but divide placement within the file in a way that makes sense.

The main exported element is an object called mz with a number of properties, documented in the type definitions at the end of mz.js.

As of May 2026 we are dividing everything within mz.js as follows: 1. Private global variables, 2. Private functions used by mz object, mostly used by the mz object's parse function, 3. The mz object itself  4. errors - a dictionary of error objects returned by the mz object and its internal functions  4. Type definition comments

Use JavaScript instead of TypeScript for this library.  

The main file is mz.js and the test file is mz.test.js.

Mini-Z uses Bun for testing.  This is the only thing Mini-Z uses Bun for as the point of Mini-Z's existence is to be single-file and dependency-free in all other uses outside testing.  The Bun test runner is as minimal of a testing framework as it gets in the JavaScript/TypeScript ecosystem. 

The main return type is a dataerror return object: 
{ data: T | null, error: ErrorType }
ErrorType: { code: string, message: string, details: string, hint: string }

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Use `bunx <package> <command>` instead of `npx <package> <command>`
- Bun automatically loads .env, so don't use dotenv.

## APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Testing

Use `bun test` to run tests.

```js#index.test.js
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

# Anything below here is not, as of May 2026, relevant to Mini-Z as Mini-Z only uses Bun to run tests in development

## Frontend

Use HTML imports with `Bun.serve()`. Don't use `vite`. HTML imports fully support React, CSS, Tailwind.

Server:

```ts#index.ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  // optional websocket support
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
    close: (ws) => {
      // handle close
    }
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly and Bun's bundler will transpile & bundle automatically. `<link>` tags can point to stylesheets and Bun's CSS bundler will bundle.

```html#index.html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With the following `frontend.tsx`:

```tsx#frontend.tsx
import React from "react";
import { createRoot } from "react-dom/client";

// import .css files directly and it works
import './index.css';

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

Then, run index.ts

```sh
bun --hot ./index.ts
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.mdx`.
