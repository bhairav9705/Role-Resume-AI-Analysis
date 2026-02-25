# AI Resume-JD Analysis

A full-stack application that analyzes resumes against job descriptions using AI (Groq LLaMA), providing match scores, skill gap analysis, and career insights.

## Stack

- **Frontend**: React + Vite + React Router
- **Backend**: Node.js + Express 5 + Prisma (PostgreSQL) + Mongoose (MongoDB)
- **AI**: Groq SDK (LLaMA 3.1)
- **Auth**: JWT (cookie) + Google OAuth (Passport.js)

## Project Structure

```
ai-resume-analysis/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/         # db.js, passport.js, groq.js
│   │   ├── controllers/    # auth, resume, jd, match, career
│   │   ├── middleware/     # auth.middleware.js, error.middleware.js
│   │   ├── models/         # resume, jdAnalysis, match (Mongoose)
│   │   ├── routes/         # auth, resume, jd, match, career
│   │   ├── services/       # business logic + AI calls
│   │   ├── utils/          # fileUpload, textExtractor, skillNormalizer, jdPromptBuilder
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/            # axios.js, auth.js, resume.js, jd.js, match.js, career.js
    │   ├── components/
    │   │   ├── charts/     # ScoreRing.jsx, ScoreChart.jsx
    │   │   ├── history/    # MatchHistory.jsx
    │   │   └── skillgap/   # SkillChip.jsx, SkillGapSection.jsx, SkillList.jsx
    │   ├── context/        # AuthContext.jsx
    │   ├── pages/          # Signup.jsx, Login.jsx, Dashboard.jsx, Analyze.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    └── package.json
```

## Setup

### Backend

```bash
cd backend
cp .env.example .env   # fill in your values
npm install
npm run db:migrate     # run Prisma migrations
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Route                | Description              |
| ------ | -------------------- | ------------------------ |
| POST   | /api/auth/signup     | Register                 |
| POST   | /api/auth/login      | Login                    |
| GET    | /api/auth/me         | Get current user         |
| POST   | /api/auth/logout     | Logout                   |
| GET    | /api/auth/google     | Google OAuth             |
| POST   | /api/resume/upload   | Upload resume (PDF/DOCX) |
| POST   | /api/jd/analyze      | Analyze job description  |
| POST   | /api/match           | Create resume-JD match   |
| GET    | /api/match/:matchId  | Get match result         |
| GET    | /api/match/history   | Get user's match history |
| POST   | /api/career/insights | Generate career roadmap  |
