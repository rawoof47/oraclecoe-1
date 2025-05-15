# Oracle COE – Job Portal

> An AI-powered job platform tailored for Oracle professionals, built with Angular, NestJS, FastAPI, and MySQL.

---

## 🔁 Git Branching Strategy

We follow a Git Flow-inspired branching model:

```
main
│
├── develop
│   ├── feature/<feature-name>
│   ├── bugfix/<issue-name>
│   └── hotfix/<critical-fix>
└── release/vX.Y.Z
```

---

## 🛠 Branch Types

| Branch Type | Example                        | Description                        |
|-------------|--------------------------------|------------------------------------|
| `main`      | `main`                         | Production-ready, stable code      |
| `develop`   | `develop`                      | Base for ongoing feature work      |
| `feature`   | `feature/job-matching-engine`  | New modules or feature dev         |
| `bugfix`    | `bugfix/api-error`             | QA/staging issue fixes             |
| `hotfix`    | `hotfix/broken-auth`           | Critical fix on `main`             |
| `release`   | `release/v1.0.0`               | Freeze for deployment staging      |

---

## ✍️ Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org):

```
<type>(<scope>): <message>
```

### Examples:
- `feat(ai): add job-candidate match scoring`
- `fix(ui): broken layout in job details`
- `chore(schema): normalize skills table`

---

## 🚀 Git Workflow

```bash
# Step 1: Branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/job-matching

# Step 2: Commit changes
git add .
git commit -m "feat(ai): add job-candidate scoring engine"

# Step 3: Push to remote
git push origin feature/job-matching

# Step 4: Create Pull Request → Base: develop
```

---

## 🧱 Folder Structure

```
apps/
  ├── frontend      # Angular frontend
  ├── backend-api   # NestJS backend
  └── ai-engine     # FastAPI microservice

libs/
  └── shared        # DTOs, utils, constants

prisma/
  └── schema.prisma

docker/
  ├── postgres/
  └── nginx/
```

---

## 🛡 Best Practices

- Keep feature branches short and scoped
- Use UUIDs for all table IDs
- Maintain .env.sample for config sharing
- Enforce commit rules with Husky + commitlint
- Protect `main` & `release/*` branches
- Every DB change → commit migration
- Pull Request reviews are mandatory

---

## 🧪 Testing & Linting

```bash
npm run format     # Format code
npm run lint       # Run linter
npm run test       # Run unit tests
```

---

## 🧪 .env Management

Use `.env.sample` for environment variables.  
❌ Never commit real credentials.

---

## 📦 Versioning & Release

```bash
git checkout release/v1.0.0
# Final test and merge into main
git tag -a v1.0.0 -m "Phase 1 Release"
git push origin --tags
```

---

## 👥 Contributors

- Rajasekhar – Solution Architect  
- Pinkesh – Fullstack Developer  
- Keerthi – Fullstack Developer  
- Kiran – UI Designer  
