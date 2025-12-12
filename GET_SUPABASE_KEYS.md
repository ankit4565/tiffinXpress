# 🔑 How to Get Supabase Credentials

This guide shows you exactly where to find your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## Step 1: Create a Supabase Account (if you don't have one)

1. Go to **[https://supabase.com](https://supabase.com)**
2. Click **"Sign Up"** in the top right
3. Choose your sign-up method:
   - Email & password
   - GitHub
   - Google
4. Verify your email
5. You're in! ✅

## Step 2: Create a New Project

1. After logging in, you'll see your **Dashboard**
2. Click **"New Project"** button (usually in the top right)
3. Fill in the form:
   - **Project name**: `tiffin-connect` (or any name)
   - **Database password**: Create a strong password (save it!)
   - **Region**: Choose closest to your location
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to initialize ⏳

## Step 3: Find Your Credentials

### Method 1: From Settings (RECOMMENDED)

1. **Click your project name** in the sidebar (on the left)
2. Look for **⚙️ Settings** at the bottom left
3. Click **Settings**
4. Click **"API"** in the left menu
5. **Under "Project API keys" section, you'll see:**

```
Project URL
┌─────────────────────────────────────────────────┐
│ https://YOUR-PROJECT-ID.supabase.co             │ ← Copy this
└─────────────────────────────────────────────────┘

anon (public)
┌─────────────────────────────────────────────────┐
│ eyJhbGc... (very long string)                   │ ← Copy this
└─────────────────────────────────────────────────┘
```

### Method 2: From Welcome Screen

If you just created the project, you might see a **"Getting started"** screen:

- It shows both keys right there
- Look for **"Project URL"** and **"anon public"** key
- Copy both

## Step 4: Add to Your `.env.local` File

1. **Open your project** in VS Code
2. **Create a file** named `.env.local` in the **root folder** (same level as `package.json`)
3. **Copy this template:**

```bash
VITE_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY-HERE
```

4. **Replace with your actual values:**
   - Replace `YOUR-PROJECT-ID` with your project ID from the URL
   - Replace `YOUR-ANON-KEY-HERE` with the anon public key

### Example:

```bash
# ❌ WRONG - Still has placeholders
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# ✅ CORRECT - With real credentials
VITE_SUPABASE_URL=https://jjsuqhccwfakyyhfhksz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqc3VxaGNjd2Zha3l5aGZoa3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5OTk5OTksImV4cCI6MTk5OTk5OTk5OX0.abcdefghijklmnopqrstuvwxyz1234567890
```

## Step 5: Test It Works

1. **Save** the `.env.local` file
2. **Stop** your dev server (if running): Press `Ctrl+C` in terminal
3. **Start** your dev server: `npm run dev`
4. **Try signing up** at `http://localhost:5173/signup`
5. If it works → You're all set! 🎉

## 🔍 Where to Find Each Key

### Project URL

**In Supabase Dashboard:**

```
Settings → API → Project URL
```

**Looks like:**

```
https://jjsuqhccwfakyyhfhksz.supabase.co
```

### Anon Public Key

**In Supabase Dashboard:**

```
Settings → API → Project API keys → anon (public)
```

**Looks like:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqc3VxaGNjd2Zha3l5aGZoa3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5OTk5OTksImV4cCI6MTk5OTk5OTk5OX0.abcdefghijklmnopqrstuvwxyz1234567890
```

**It's very long (usually 200+ characters)**

## ❌ Common Mistakes

| Mistake                              | Problem                   | Fix                                 |
| ------------------------------------ | ------------------------- | ----------------------------------- |
| Using `secret` key instead of `anon` | App won't work            | Use the `anon (public)` key         |
| Typo in URL                          | Connection fails          | Copy-paste carefully                |
| Leaving placeholder text             | App crashes               | Replace with real values            |
| Not saving `.env.local`              | Dev server doesn't see it | Save the file!                      |
| Wrong file location                  | Env vars not loaded       | `.env.local` must be in root folder |

## ✅ Verification Checklist

- [ ] Have Supabase account
- [ ] Created a project in Supabase
- [ ] Found "Settings → API" in project
- [ ] Copied the Project URL
- [ ] Copied the anon public key
- [ ] Created `.env.local` file
- [ ] Pasted both values correctly
- [ ] Saved the file
- [ ] Restarted dev server
- [ ] Tested signup page

## 🎯 Quick Summary

1. **Go to:** `supabase.com` → Login → Your Project → Settings → API
2. **Copy:** Project URL + anon public key
3. **Create:** `.env.local` file in root
4. **Paste:** The values into the file
5. **Save** and **restart** dev server
6. **Done!** ✅

## 🚨 Security Tips

- **Never share** your `.env.local` file
- **Never commit** `.env.local` to GitHub (it's already in `.gitignore`)
- **Never post** your keys in public (Slack, Discord, etc.)
- **The anon key is semi-public** (safe to expose in frontend)
- **The service role key is SECRET** (never use in frontend)

## 🆘 Still Confused?

### Visual Walkthrough

```
1. Go to supabase.com
   ↓
2. Click your project
   ↓
3. Click Settings (bottom left, gear icon ⚙️)
   ↓
4. Click "API" in left menu
   ↓
5. See "Project URL" - COPY THIS
   ↓
6. See "anon (public)" - COPY THIS
   ↓
7. Create .env.local in your project root
   ↓
8. Paste both values
   ↓
9. Save file
   ↓
10. Restart: npm run dev
    ↓
Done! ✅
```

### Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Getting Started**: https://supabase.com/docs/guides/getting-started
- **Video Tutorial**: Search "Supabase getting started" on YouTube
