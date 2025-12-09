# tsconfig

## Install

Automatic

```bash
pnpm i -d @code-essentials/tsconfig
pnpm dlx setup-tsconfig
```

Manual install

```bash
pnpm i -d @code-essentials/tsconfig
cp -r node_modules/@code-essentials/tsconfig/template/* .
```

1. Install `@code-essentials/tsconfig`.

2. Copy [tsconfig.json.template](./tsconfig.json.template), [tsconfig.prod.json.template](./tsconfig.prod.json.template), and [tsconfig.debug.json.template](./tsconfig.debug.json.template) into project root, removing `.template`.

3. Write the following scripts in your `package.json`

```json
{
    "clean": "rm -rf dist",
    "prebuild": "npm run clean",
    "prebuild:debug": "npm run clean",
    "build": "tsc -p tsconfig.prod.json",
    "build:debug": "tsc -p tsconfig.debug.json",
}
```

## License

MIT
