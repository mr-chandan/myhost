# 🍓 PiDeploy — Mini PaaS

A lightweight Platform-as-a-Service that deploys full-stack apps (React + Node.js) from a GitHub repo URL with one command. Runs on a Raspberry Pi.

## Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ PiDeploy CLI │────▶│  Platform API    │────▶│  Docker + Nginx  │
│  (Ink/React) │     │  (Express + JWT) │     │  (per-app)       │
└──────────────┘     └──────────────────┘     └─────────────────┘
```

## How It Works

1. **User authenticates** via JWT (`/auth/register`, `/auth/login`)
2. **Submits a GitHub repo** URL via CLI or API
3. **Platform clones** the repo, validates the `frontend/` + `backend/` structure
4. **Builds frontend** (`npm run build` → static `dist/`)
5. **Runs backend** in a Docker container (`node:18-alpine`)
6. **Configures Nginx** reverse proxy — serves frontend static files + proxies `/api/` to backend
7. **Returns URLs** for both frontend and backend

## Project Structure

```
pideploy/
├── platform-api/          # Express API server
│   ├── src/
│   │   ├── server.js      # Entry point
│   │   ├── routes/
│   │   │   ├── auth.js    # Register & Login (JWT)
│   │   │   ├── deploy.js  # Deploy pipeline
│   │   │   └── apps.js    # List deployed apps
│   │   ├── services/
│   │   │   ├── git.service.js        # Clone repos
│   │   │   ├── validate.service.js   # Check repo structure
│   │   │   ├── frontend.service.js   # Build frontend
│   │   │   ├── docker.service.js     # Run backend container
│   │   │   ├── nginx.service.js      # Setup reverse proxy
│   │   │   ├── port.service.js       # Backend port allocator
│   │   │   └── frontend-port.service.js  # Frontend port allocator
│   │   └── utils/
│   │       └── auth.js    # JWT helpers & middleware
│   └── data/
│       └── users.json     # User store
│
├── pideploy-cli/          # CLI tool (Ink + React)
│   └── source/
│       ├── cli.js         # Entry point & subcommand routing
│       ├── app.js         # Main component router
│       ├── components/    # Login, Register, Deploy, Apps, Whoami, Header
│       └── utils/         # API client & config store
│
├── apps/                  # Deployed app directories (auto-created)
└── nginx/                 # Per-app Nginx configs (auto-created)
```

## Quick Start

### 1. Start the API

```bash
cd platform-api
npm install
npm run start
```

### 2. Install the CLI

```bash
cd pideploy-cli
npm install
npm run build
npm link
```

### 3. Use it

```bash
pideploy register          # Create an account
pideploy login             # Sign in
pideploy deploy <repo-url> # Deploy a full-stack app
pideploy apps              # List deployed apps
pideploy whoami            # Check current user
pideploy logout            # Sign out
```

## Repo Requirements

Your GitHub repo must have this structure:

```
your-repo/
├── frontend/
│   ├── package.json
│   └── src/
└── backend/
    ├── package.json
    └── server.js       # Must listen on port 4000
```

## Tech Stack

| Component | Tech |
|-----------|------|
| API | Express 5, JWT, bcrypt |
| CLI | Ink (React for CLI), Babel |
| Containers | Docker, Node 18 Alpine |
| Proxy | Nginx (Dockerized) |
| Storage | JSON file (users), filesystem (apps) |

---

*Built with ❤️ as a mini PaaS — designed to run on a Raspberry Pi.*
