# Todos Project
Super Todos SaaS platform - A modern todo management system with free and paid user tiers.

## Features
- Free tier: Basic todo management
- Paid tier: Advanced features including notes and additional metadata
- Docker containerization
- REST API backend with NestJS
- Vue 3 frontend with TypeScript
- In-memory database for quick setup

## System Requirements
- Docker and Docker Compose
- Node.js 18+ (for local development)
- npm (Node package manager)

## Technology Stack
### Backend
- NestJS (v10.4.0)
- TypeScript
- Node Alpine (Docker)
- UUID for ID generation
- In-memory database

### Frontend
- Vue 3 (v5.0.8)
- TypeScript
- Tailwind CSS with Forms plugin
- Axios for API communication

## Project Structure
```
todos/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── modules/
│       │   └── todo/
│       │       └── controllers
│       │       ├── entities
│       │       ├── repositories
│       │       ├── services
│       │       └── todo.module.ts
│       ├── configs/
│       ├── tasks/
│       ├── routes/
│       ├── middleware/
│       └── app.controller.ts
│       └── app.modules.ts
│       └── app.service.ts
│       └── main.ts
│
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── components/
│       │   └── todos/
│       │       ├── TodoList.vue
│       │       ├── TodoItem.vue
│       │       └── TodoForm.vue
│       ├── services/
│       ├── hooks/
│       ├── types/
│       │   └── todo.ts
│       ├── utils/
│       ├── App.vue
│       └── main.ts
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## Setup Instructions

### Using Docker (Recommended)
1. Clone the repository
2. Copy `.env.example` to `.env` and adjust if needed
3. Run the application:
```bash
docker compose up -d
```

### Local Development Setup

#### Backend Setup
1. Install NestJS CLI globally:
```bash
npm i -g @nestjs/cli
```

2. Navigate to backend directory and install dependencies:
```bash
cd backend
npm install
npm install --save-dev uuid
```

3. Important: Add CORS configuration in `main.ts`:
```typescript
app.enableCors();
```

#### Frontend Setup
1. Install Vue CLI globally:
```bash
npm install -g @vue/cli
```

2. Navigate to frontend directory and create new project:
```bash
cd frontend
npm create vue@latest
```

3. Install dependencies:
```bash
npm install axios tailwindcss @tailwindcss/forms
```

4. Initialize Tailwind:
```bash
npx tailwindcss init -p
```

## Running the Application

### Docker Environment
```bash
docker compose up -d
```

### Access the Application

#### Backend API
- Paid user endpoint: http://localhost:3009/todos/?userRole=paid
- Free user endpoint: http://localhost:3009/todos/?userRole=free

#### Frontend Interface
- Paid user interface: http://localhost:8089/?userRole=paid
- Free user interface: http://localhost:8089/?userRole=free

## Development Notes
- The backend uses an in-memory database for simplicity
- CORS is enabled in the backend to allow frontend communication
- User roles are passed via query parameters for demonstration purposes