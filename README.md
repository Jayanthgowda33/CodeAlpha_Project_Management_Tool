# TaskFlow — Project Management Tool

A Trello-style project management tool built as part of the CodeAlpha Full Stack Development internship. Simulates a company workflow where a CEO assigns projects to team leads (Frontend, Backend, DevOps, AI Engineer, QA), who then manage tasks on a Kanban board.

## Features
- Role-based accounts: CEO and 5 team lead roles
- CEO can create and assign projects to specific teams with due dates
- Team leads see only projects assigned to their team
- Kanban board with drag-and-drop task cards (To Do / In Progress / Done)
- Task comments
- Real-time updates via Socket.io

## Tech Stack
- **Frontend:** React (Vite), React Router, Axios, @dnd-kit, Socket.io-client
- **Backend:** Node.js, Express.js, Socket.io
- **Database:** MongoDB (Atlas)
- **Auth:** JWT, bcrypt

## How to Run Locally

### Backend

cd backend
npm install
npm run dev

Create a `.env` file in `backend/` with:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5002


### Frontend

cd frontend
npm install
npm run dev


## Author
Built by Jayanth as part of the CodeAlpha internship program.