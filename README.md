# AI-N2N

> Visual Node-to-Node Workflow Builder & Execution Engine

AI-N2N is an interactive, AI-powered Node-to-Node (N2N) workflow builder and execution engine. It enables developers to construct, version, execute, and audit complex pipelines visually via a drag-and-drop canvas.

---

## Features

- **Visual Graph Editor**: An interactive drag-and-drop workspace powered by `@xyflow/react` (React Flow) for visual modeling of logic flows.
- **DAG Execution Engine**: Asynchronous Kahn's Algorithm (topological sort) executor running on an Express.js backend.
- **Diverse Node Ecosystem**:
  - **Input / Starter**: Define trigger schemas, manual trigger inputs, and webhook payload configurations.
  - **AI / Prompt**: Chain and resolve LLM triggers dynamically using models from Google Gemini and Groq.
  - **Logic / Conditional**: Branch sequencing workflows dynamically using conditional evaluation and true/false route handles.
  - **Transform / Delay**: Suspend execution branches or format/restructure outputs.
  - **Integration / HTTP**: Invoke third-party APIs via outbound HTTP GET or POST requests.
  - **Output / Email**: Formulate response payloads and deliver structured outputs.
- **Detailed Execution Logs**: Complete audit logging of workflow executions with step-by-step node outputs, statuses (`SUCCESS`, `FAILED`, `SKIPPED`), errors, execution duration, and timeline tracing.
- **Pre-Built Templates**: Explore, create, and clone workspace templates.
- **User Workspaces**: Segment workflows across multiple user-created workspaces with unique colors and descriptions.

---

## Tech Stack

| Layer                      | Technologies                                                                                                             |
| :---------------------------| :-------------------------------------------------------------------------------------------------------------------------|
| **Frontend**               | React 19, Next.js 16 (App Router), Tailwind CSS v4, TypeScript, Zustand (State Management), `@xyflow/react` (React Flow) |
| **Backend**                | Node.js, Express.js (v5), TypeScript, `tsx` (Watch execution runner)                                                     |
| **Database**               | PostgreSQL, Prisma ORM                                                                                                   |
| **Auth**                   | Clerk Authentication (`@clerk/nextjs`, `@clerk/express`)                                                                 |
| **AI / APIs**              | Vercel AI SDK (`ai`), `@ai-sdk/google` (Gemini), Groq API                                                                |
| **Analytics & Monitoring** | PostHog JS                                                                                                               |

---

## Quick Start

### Prerequisites
- **Node.js** (v18.x or v20.x recommended)
- **pnpm** (preferred) or **npm** / **yarn**
- A **PostgreSQL** database instance (e.g. Neon Postgres)
- A **Clerk** account for user authentication
- A **Groq** API key (for executing AI prompt nodes)

### Step 1: Clone and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/TheVivekRajput002/AI-N2N.git
cd AI-N2N

# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

### Step 2: Set up Environment Variables
In the `backend` directory, create a `.env` file:
```ini
DATABASE_URL="postgresql://<username>:<password>@<host>/<database>?sslmode=require"
PORT=3001
CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
GROQ_FREE_API_KEY="your_groq_api_key"
```

In the `frontend` directory, create a `.env` file:
```ini
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN="your_posthog_token"
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"
MICROSOFT_CLARITY_PROJECT_ID="your_clarity_project_id"
```

### Step 3: Run Database Migrations
Prisma handles schema migration. Run the following command inside the backend folder to set up your PostgreSQL tables:
```bash
cd backend
pnpm prisma migrate dev
```

### Step 4: Run the Application
Start both the backend server and frontend development client:
```bash
# In the backend folder:
pnpm dev

# In a separate terminal, from the frontend folder:
pnpm dev
```
Open `http://localhost:3000` in your browser.

---

## Repository Structure

```
AI-N2N/
├── frontend/                  # Next.js App Router Frontend Client
│   ├── app/                   # Dynamic pages (dashboard, workspaces, templates)
│   ├── components/            # Visual graph workspace, custom Nodes & Edges
│   ├── hooks/                 # Custom utility React hooks
│   ├── public/                # Static assets and images
│   ├── utils/                 # Zustand state stores and Axios API client configs
│   └── package.json           # Frontend dependencies and scripts
│
├── backend/                   # Express.js API & Execution Engine
│   ├── prisma/                # Prisma PostgreSQL schema
│   ├── src/
│   │   ├── app.ts             # Application routing registry and CORS configuration
│   │   ├── config/            # Database configurations & Clerk setups
│   │   ├── controllers/       # Controller logic (workflows, auth, workspaces, templates)
│   │   ├── lib/               # DAG execution engine (Kahn's algorithm execution logic)
│   │   ├── routes/            # Express REST route definitions
│   │   └── types.ts           # Shared TypeScript interfaces
│   └── package.json           # Backend dependencies and scripts
└── README.md                  # Main project documentation
```

---

## Architecture Overview

```mermaid
graph TD
    User([Developer / User]) <-->|Visual Editor| Frontend[Next.js App Router]
    Frontend <-->|REST API / JSON| Backend[Express.js Engine]
    Backend <-->|Prisma ORM| Database[(PostgreSQL Database)]
    Backend -->|Kahn's Algo DAG Engine| Exec[executeGraph.ts]
    Exec -->|Fetch prompts / complete response| AI[Google Gemini / Groq API]
    Frontend -->|Auth sessions| Clerk[Clerk Auth Platform]
    Backend -->|Authenticate requests| Clerk
```

### execution logic:
1. **Interactive Client**: The frontend renders nodes and manages local edges using `@xyflow/react` and updates are synchronized back to the PostgreSQL database.
2. **DAG Evaluation**: Workflows are structured as Directed Acyclic Graphs (DAGs). When executed, the engine in `executeGraph.ts` computes the topological sort via Kahn's algorithm, processing nodes sequentially.
3. **Execution Context**: Outputs from parent nodes are evaluated and fed into children nodes dynamically. If a conditional branch evaluates to false, the downstream subtree is marked as `SKIPPED`.

---

## API Endpoints

### Endpoint Summary
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/auth` | Synchronizes and retrieves the authenticated Clerk user profile | Yes |
| **POST** | `/auth/welcome-seen` | Marks user's welcome walkthrough checklist as completed | Yes |
| **GET** | `/workspaces` | Lists all workspaces owned by the active user | Yes |
| **POST** | `/workspaces` | Creates a new user workspace | Yes |
| **DELETE** | `/workspaces/:id` | Deletes a specified workspace | Yes |
| **GET** | `/workflows/:workspaceId` | Retrieves all workflows in a given workspace | Yes |
| **POST** | `/workflows/:workspaceId` | Creates a new blank workflow inside a workspace | Yes |
| **DELETE** | `/workflows/:workflowId` | Deletes a workflow and its resources | Yes |
| **POST** | `/workflow-version` | Registers a new workflow version (graph snapshot) | Yes |
| **POST** | `/workflow-version/update` | Updates the active version structure | Yes |
| **GET** | `/workflow-version` | Retrieves a specific version graph | Yes |
| **POST** | `/executions/workflow/:workflowId` | Executes the active version of a workflow | Yes |
| **GET** | `/executions/workflow/:workflowId` | Retrieves all historical executions for a workflow | Yes |
| **GET** | `/executions/dashboard/stats` | Computes dashboard analytics, duration averages, and charts data | Yes |
| **GET** | `/executions/:executionId` | Retrieves node-by-node logs of a specific execution run | Yes |
| **GET** | `/templates` | Retrieves preset system workflow templates | Yes |
| **POST** | `/templates/submit` | Promotes a user workflow to a reusable template | Yes |

### Endpoint Example

#### Execute Workflow
**`POST /executions/workflow/:workflowId`**

*Request Headers:*
```http
Authorization: Bearer <clerk_session_token>
Content-Type: application/json
```

*Request Body:*
```json
{
  "input": {
    "topic": "AI Workflow Automation",
    "tone": "professional"
  },
  "triggeredBy": "API"
}
```

*Response Body (SUCCESS):*
```json
{
  "success": true,
  "message": "Workflow executed successfully.",
  "execution": {
    "id": "e8d641ba-10e3-4c9f-b98a-13ab7df64101",
    "status": "SUCCESS",
    "triggeredBy": "API",
    "input": {
      "topic": "AI Workflow Automation",
      "tone": "professional"
    },
    "output": {
      "outputNode-1": {
        "success": true,
        "result": "Response generated: AI Workflow Automation is completed."
      }
    },
    "error": null,
    "totalDuration": 1240,
    "startedAt": "2026-06-11T12:00:00.000Z",
    "finishedAt": "2026-06-11T12:00:01.240Z",
    "workflowId": "w3f542bc-90fa-40bf-9d8e-12ab7df64202",
    "versionId": "v1e431ab-80ef-30cd-8c7a-11bc6df63101",
    "nodeExecutions": [
      {
        "id": "n1-exec-id",
        "nodeId": "inputNode-1",
        "nodeType": "input",
        "status": "SUCCESS",
        "input": {},
        "output": {
          "topic": "AI Workflow Automation",
          "tone": "professional"
        },
        "startedAt": "2026-06-11T12:00:00.010Z",
        "finishedAt": "2026-06-11T12:00:00.020Z"
      },
      {
        "id": "n2-exec-id",
        "nodeId": "aiNode-1",
        "nodeType": "llm",
        "status": "SUCCESS",
        "input": {
          "topic": "AI Workflow Automation",
          "tone": "professional"
        },
        "output": {
          "text": "AI Workflow Automation is completed."
        },
        "startedAt": "2026-06-11T12:00:00.025Z",
        "finishedAt": "2026-06-11T12:00:01.200Z"
      }
    ]
  }
}
```

---

## Environment Variables

### Backend Env Vars (`backend/.env`)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | Connection string for PostgreSQL database | `postgresql://user:pass@host:5432/dbname` |
| `PORT` | Local network port the Express server listens on | `3001` |
| `CLERK_PUBLISHABLE_KEY` | Clerk Publishable API Key | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk Secret Backend Key | `sk_test_...` |
| `FRONTEND_URL` | Origin URL of frontend application for CORS verification | `http://localhost:3000` |
| `GROQ_FREE_API_KEY` | Groq API Key to execute LLM nodes | `gsk_...` |

### Frontend Env Vars (`frontend/.env`)
| Variable                            | Description                                                | Example / Default          |
| :------------------------------------| :-----------------------------------------------------------| :---------------------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Publishable API Key                                  | `pk_test_...`              |
| `CLERK_SECRET_KEY`                  | Clerk Secret Server Key (if server-side auth is triggered) | `sk_test_...`              |
| `NEXT_PUBLIC_API_URL`               | Base endpoint location of Backend Express API              | `http://localhost:3001`    |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | PostHog Client Tracking API Key                            | `phc_...`                  |
| `NEXT_PUBLIC_POSTHOG_HOST`          | PostHog Client host region endpoint                        | `https://us.i.posthog.com` |
| `MICROSOFT_CLARITY_PROJECT_ID`      | Microsoft Clarity session recorder ID                      | `x56vsahqb9`               |

---

## Deployment

| Service      | Hosting Platform                   | Recommended Build Command | Output / Output Dir |
| :-------------| :-----------------------------------| :--------------------------| :--------------------|
| **Frontend** | [Vercel](https://vercel.com)       | `next build`              | `.next`             |
| **Backend**  | [Render](https://render.com)       | `pnpm build`              | `dist`              |
| **Database** | [Neon Postgres](https://neon.tech) |                           |                     |

---

## Contributing

1. **Fork the Repository** to your GitHub profile.
2. **Create a Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: Use clear, semantic commit messages.
4. **Push Branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request** explaining your implementation details.

---

## License

This project is licensed under the **ISC License**.
