# RunSynergy - Elite Athlete Dashboard

RunSynergy is a high-performance running analytics dashboard that allows athletes to upload TCX training files to get deep insights into their training load, pace, and heart rate zones.

## 🚀 Features

- **TCX Data Import**: High-fidelity data import from Garmin, Coros, Wahoo, and other training devices.
- **Advanced Analytics**: Tracking of distance, average pace, heart rate zones, and elevation.
- **AI Coaching**: AI-powered workout recommendations and activity summaries.
- **Modern UI**: A sleek, dark-themed dashboard built with Next.js 15 and Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth
- **AI**: Gemini 2.5 Flash via OpenRouter
- **Parsing**: TCX (Training Center XML) via fast-xml-parser

## ⚙️ Setup & Installation

### 1. Clone the Repository
\`\`\`bash
git clone <your-repo-url>
cd "running app"
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Configuration
Create a `.env.local` file in the root directory and add the following variables:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=postgresql://postgres:[password]@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres

# AI Configuration
OPENROUTER_API_KEY=your_openrouter_api_key
\`\`\`

### 4. Database Migration
Push the schema to your Supabase database:
\`\`\`bash
npx drizzle-kit push
\`\`\`

### 5. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`
The app will be available at `http://localhost:3000`.

## 🔐 Security Protocols

To keep your API keys and database credentials safe:

1. **Never commit `.env.local`**: This file is included in `.gitignore` to prevent secrets from being pushed to GitHub.
2. **Use Environment Variables**: When deploying to a platform like Vercel or Netlify, add these keys in the "Environment Variables" section of the project settings.

## 📜 License
MIT
