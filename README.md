# Immersia Monorepo

## 📦 Workspace Structure

```
immersia/
├── apps/
│   ├── backend/          # Express.js backend application
│   └── web/              # Web frontend application
├── packages/
│   ├── config/           # Shared configuration (ESLint)
│   └── shared/           # Shared utilities and code
└── package.json          # Root workspace configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (v7 or higher for workspace support)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Immersia
```

2. Install all dependencies (root + all workspaces):
```bash
npm install
```

This will install dependencies for:
- Root workspace
- apps/backend
- apps/web
- All packages in `packages/*`

## 🛠️ Development

### Run All Applications

Start all apps in development mode simultaneously:
```bash
npm run dev
```

### Run Individual Applications

**Backend:**
```bash
npm run dev -w @app/backend
```

**Web:**
```bash
npm run dev -w @app/web
```

### Environment Variables

**Backend** requires a `.env` file in `apps/backend`:

```env
NODE_ENV=development
PORT=3005
```

Copy from `.env.example` if available.

## 📝 Available Scripts

### Root Level

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start all workspaces in dev mode |
| `lint` | `npm run lint` | Lint all files in workspace |

### Backend (`@app/backend`)

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev -w @app/backend` | Start backend with nodemon |
| `start` | `npm run start -w @app/backend` | Start backend in production |
| `lint` | `npm run lint -w @app/backend` | Lint backend code |

### Web (`@app/web`)

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev -w @app/web` | Start web app in dev mode |

## 📦 Managing Dependencies

### Add Dependency to Specific Workspace

**Backend:**
```bash
npm install <package-name> -w @app/backend
```

**Web:**
```bash
npm install <package-name> -w @app/web
```

**Shared package:**
```bash
npm install <package-name> -w @repo/shared
```

### Add Dev Dependency to Root

```bash
npm install <package-name> -D
```

### Remove Dependency

```bash
npm uninstall <package-name> -w <workspace-name>
```

## 🔗 Working with Internal Packages

### Using `@repo/shared` Package

Internal packages are referenced with `"*"` version in package.json:

```json
{
  "dependencies": {
    "@repo/shared": "*"
  }
}
```

**Import in your code:**
```javascript
import { sharedHello } from '@repo/shared';
```

### Adding New Shared Code

1. Add your code to `packages/shared/src/`
2. Export from `packages/shared/src/index.js`
3. Use in any app with `import { yourFunction } from '@repo/shared'`

No rebuild needed - changes are live!

## 🏗️ Creating New Workspaces

### New Application

1. Create directory: `apps/your-app/`
2. Create `package.json`:
```json
{
  "name": "@app/your-app",
  "private": true,
  "scripts": {
    "dev": "your-dev-command"
  },
  "dependencies": {
    "@repo/shared": "*"
  }
}
```
3. Run `npm install` from root

### New Shared Package

1. Create directory: `packages/your-package/`
2. Create `package.json`:
```json
{
  "name": "@repo/your-package",
  "version": "0.0.1",
  "type": "module",
  "exports": {
    ".": "./src/index.js"
  }
}
```
3. Create `src/index.js`
4. Run `npm install` from root

## 🧹 Code Quality

### Linting

The workspace uses ESLint with:
- Modern JavaScript support
- Prettier integration
- Import/export validation
- Architectural boundaries enforcement

**Run linter:**
```bash
npm run lint
```

**Fix auto-fixable issues:**
```bash
npx eslint . --fix
```

### Boundaries

The `eslint-plugin-boundaries` enforces:
- ✅ Apps can import from packages
- ✅ Packages can import from other packages
- ❌ Packages cannot import from apps
- ❌ Apps cannot import from other apps

## 🏢 Workspace Architecture

### Apps (`apps/*`)

Application-specific code. Each app is independent and can use shared packages.

- **Backend**: Express.js API server with Zod validation
- **Web**: Frontend application

### Packages (`packages/*`)

Reusable code shared across applications.

- **`@repo/shared`**: Common utilities and functions
- **`@repo/config`**: ESLint configuration