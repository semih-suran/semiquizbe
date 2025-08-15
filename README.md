# SemiQuiz Backend

## 📜 Overview
SemiQuiz Backend is a **TypeScript + Node.js** application built with:
- **Express** for the HTTP API
- **TypeORM** for database ORM and migrations
- **PostgreSQL** as the main datastore
- **Redis** for caching & session management
- **Docker Compose** for local development orchestration

It is designed for **high-volume quiz data**, supporting multiple countries, categories, and difficulty levels.  
The backend includes tooling to **bulk-import questions** from structured JSON files.

---

## 🏗 Architecture

```

src/
config/            # Environment config, DB & Redis setup
entities/          # TypeORM entity definitions
migrations/        # Database migrations
routes/            # Express route handlers
services/          # Business logic
scripts/           # Data import & utility scripts

```

**Data Flow:**
1. JSON question files → validated via script → inserted into `questions` table
2. API endpoints retrieve questions with filters & pagination
3. Redis used for hot data caching and session storage

---

## 📊 Database Schema

```

## questions

id (varchar, PK)
country\_code (varchar)
question (varchar)
options\_json (jsonb)
correct\_option\_id (varchar)
explanation (text)
source\_url\_json (jsonb)
category (varchar)
difficulty (varchar)
time\_limit\_seconds (int)
language (text)
tags\_json (jsonb)
created\_by (text)
created\_at (timestamp)
updated\_at (timestamp)
version (int)
usage\_count (int)
correct\_count (int)
avg\_response\_ms (int)
flag\_count (int)
review\_status (varchar)

## migrations

id (int, PK)
timestamp (bigint)
name (varchar)

````

---

## 🚀 Getting Started

### **1. Clone & Install**
```bash
git clone <your_repo_url>
cd SemiQuizBE
npm install
````

---

### **2. Environment Variables**

Create a `.env` file in the project root:

```env
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=quizuser
DB_PASS=quizpass
DB_NAME=quizdb

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# App
PORT=3000
NODE_ENV=development
```

---

### **3. Start Local Services**

Using Docker Compose:

```bash
docker compose up -d
```

This launches:

* `postgres:15` on port 5432
* `redis:7` on port 6379

---

### **4. Database Migrations**

```bash
# Generate a new migration
npm run typeorm -- migration:generate ./src/migrations/YourMigrationName -d src/data-source.ts

# Run migrations
npm run typeorm -- migration:run -d src/data-source.ts
```

---

### **5. Start the Backend**

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Test with:

```bash
curl http://localhost:3000/ping
# Should return: pong
```

---

## 📦 Data Import

### **1. Prepare Question Files**

Place `.json` files in:

```
data/questions_raw/
```

Each file should be named like:

```
Questions_USA.json
Questions_TR.json
```

And contain an array of objects:

```json
[
  {
    "id": "usa_q001",
    "country_code": "USA",
    "question": "Who was the first president of the USA?",
    "options": [
      { "id": "usa_q001_o1", "text": "George Washington" },
      { "id": "usa_q001_o2", "text": "John Adams" }
    ],
    "correct_option_id": "usa_q001_o1",
    "category": "History",
    "difficulty": "Easy",
    "time_limit_seconds": 30
  }
]
```

---

### **2. Import Command**

```bash
npm run import:questions
```

This will:

* Validate each question
* Skip duplicates
* Output import summary

---

### **3. Verify Data**

```sql
SELECT country_code, COUNT(*)
FROM questions
GROUP BY country_code;
```

---

## 🛠 Useful Commands

**Run TypeORM CLI**

```bash
npm run typeorm -- migration:run -d src/data-source.ts
npm run typeorm -- migration:revert -d src/data-source.ts
```

**Connect to Postgres**

```bash
docker exec -it semiquizbe-db-1 psql -U quizuser -d quizdb
```

**View Redis**

```bash
docker exec -it semiquizbe-redis-1 redis-cli
```

---

## 📈 Index Recommendations

For production performance:

```sql
CREATE INDEX idx_questions_country_code ON questions(country_code);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
```

---

## 🔒 License

Currently private — see `LICENSE` file.
