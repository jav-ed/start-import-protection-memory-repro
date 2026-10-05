# Start import protection keeps an AST per module in development

In development, TanStack Start's import protection keeps one parsed AST for every module it analyses, for as long as the dev server runs. In a large app this is hundreds of MB of live heap.

This project generates 1,500 ordinary TypeScript modules (about 6 MB of source), starts the dev server twice (import protection on, then off), loads the page once and prints the live heap after a forced GC.

```sh
npm install
npm run measure
```

Result on Node 26.7.0, Linux x64, `@tanstack/react-start` 1.168.60 (`@tanstack/start-plugin-core` 1.171.49), Vite 7.3.6:

```
live heap after the first page, import protection on:  474.4 MB
live heap after the first page, import protection off: 157.5 MB
difference: 316.9 MB
```

Set `MODULES=3000` before `npm run measure` to see the difference grow with the module count.
