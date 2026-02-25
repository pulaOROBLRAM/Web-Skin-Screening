## No direct push, runs eslint, and test
## Setup for Team Members

Husky hooks are automatically installed by running:
```bash
npm install
```

This triggers the `prepare` script in `package.json` which runs `husky install`.

## Manual Installation

If hooks aren't working, manually install them:
```bash
npm run prepare
```

Or directly:
```bash
husky install
```