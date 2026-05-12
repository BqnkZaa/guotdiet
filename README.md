# Gout Diet Control Platform 🥦

A lightweight, clean, and mobile-friendly health utility website designed to help users calculate and manage purine intake from various food ingredients. Built with modern web technologies, prioritizing ease of use and simple maintenance.

## Features ✨
- **Ingredient Database:** Search and browse nutritional information for hundreds of raw ingredients.
- **Purine Calculator:** Add multiple ingredients to a virtual meal and calculate the total purine load instantly.
- **Medical Recommendations:** Receive rule-based health guidance according to the calculated purine levels.
- **Admin Management:** Hidden lightweight CRUD interface to manage food database records.

---

## Tech Stack 🛠️
- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database:** PostgreSQL via [Supabase](https://supabase.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Deployment:** [Vercel](https://vercel.com)

---

## Local Development Setup 🚀

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Clone and Install
```bash
git clone https://github.com/your-username/goutdiet.git
cd goutdiet
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env` and fill in your database details:
```bash
cp .env.example .env
```
Ensure you set your `DATABASE_URL` (Supabase Transaction Pooler URL) and `ADMIN_PASSWORD` (used to access the hidden `/manage` route).

### 4. Database Setup
Push the schema to your database and seed the initial ingredients:
```bash
npx prisma db push
npx prisma db seed
```

### 5. Run the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Supabase Setup Guide 🗄️

1. Create a new project on [Supabase](https://supabase.com/).
2. Go to **Project Settings > Database**.
3. Under **Connection string > URI**, make sure "Use connection pooling" is checked and mode is "Transaction".
4. Copy the connection string and paste it into your `.env` file as `DATABASE_URL`.
   - *Example:* `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`

---

## Vercel Deployment Guide 🌐

1. Push your code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com/) and click **Add New > Project**.
3. Import your GitHub repository.
4. Open the **Environment Variables** section and add:
   - `DATABASE_URL` (Your Supabase connection string)
   - `ADMIN_PASSWORD` (Your chosen password for the admin route)
5. Click **Deploy**. Vercel will automatically run `npm run build` and deploy your app!

---

## Admin Management 🔒
To add, edit, or delete ingredients from the database:
1. Navigate to `/manage` on your deployed site (e.g., `https://your-site.vercel.app/manage`).
2. Enter the `ADMIN_PASSWORD` you configured in your environment variables.
3. Use the simple dashboard to manage the ingredient database.

---

## Architecture Note 📝
This project was intentionally downscaled to remove unnecessary enterprise abstractions (like NextAuth, Recharts, Docker standalone builds) to ensure the codebase remains **beginner-friendly, lightweight, and incredibly fast**. It functions entirely as a stateless utility app.
