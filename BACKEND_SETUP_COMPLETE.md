# GreenWatch Backend Setup - COMPLETE! 🎉

Your GreenWatch application now has a **full backend** powered by Supabase and PostgreSQL!

## ✅ What's Been Completed

### 1. **Supabase Connection**
- Connected to your Supabase project
- Project ID: `dhwoadncdzhflgtsdciv`

### 2. **PostgreSQL Database**
- Created comprehensive database schema with:
  - `profiles` table (user accounts with email and role)
  - `incidents` table (all incident reports with location coordinates)
  - `notifications` table (automatic notifications for new incidents)
- Row Level Security (RLS) enabled for data protection
- Automatic triggers for timestamps and notifications

### 3. **Backend API Server**
- Built REST API with Hono framework
- Running on Supabase Edge Functions
- Endpoints for:
  - **Auth**: Register, Login
  - **Incidents**: Create, Read, Update status
  - **Notifications**: Read, Mark as read

### 4. **Frontend Integration**
- Updated all React contexts to use the API
- Async authentication with proper error handling
- Real-time data fetching from PostgreSQL
- All localStorage usage replaced with database calls

---

## 🚀 NEXT STEP: Set Up the Database

**You need to run the SQL schema to create your database tables.**

### Instructions:

1. **Open your Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/dhwoadncdzhflgtsdciv

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Database Setup SQL**
   - Open the file: `supabase/SETUP_DATABASE.md`
   - Copy ALL the SQL code from that file
   - Paste it into the Supabase SQL Editor
   - Click "Run" or press Cmd/Ctrl + Enter

4. **Verify Success**
   - You should see a success message
   - Go to "Table Editor" in Supabase to see your new tables:
     - `profiles`
     - `incidents`
     - `notifications`

5. **Deploy the Edge Function**
   - The server code is in `/supabase/functions/server/index.tsx`
   - In Supabase Dashboard, go to "Edge Functions"
   - If prompted to deploy, click "Deploy" for the `server` function
   - Or it may deploy automatically

---

## 🧪 Testing Your Backend

After running the SQL, test the application:

1. **Register a new account**
   - Go to the login page
   - Click "Register"
   - Create a citizen or authority account
   - This will save to PostgreSQL!

2. **Report an incident** (as citizen)
   - Login as a citizen
   - Create a new incident report
   - This saves to the database

3. **Manage incidents** (as authority)
   - Register/login as an authority user
   - View all incidents from the database
   - Approve or resolve incidents
   - Changes update in real-time!

---

## 📊 Database Features

Your PostgreSQL database includes:

- **User Authentication**: Secure account creation and login via Supabase Auth
- **Incident Management**: Full CRUD operations with status tracking
- **Automatic Notifications**: New incidents trigger notifications for authorities
- **Location Storage**: Latitude/longitude coordinates for mapping
- **File Attachments**: Store evidence photos/videos as base64 data URLs
- **Audit Trail**: Automatic `created_at` and `updated_at` timestamps

---

## 🔍 Monitoring Your Data

View your data in Supabase:

- **Table Editor**: Browse all database records
- **SQL Editor**: Run custom queries
- **Logs**: See API requests and errors
- **Auth**: View registered users

---

## 🛠️ Troubleshooting

**If registration/login doesn't work:**
1. Make sure you ran the SQL setup
2. Check Supabase Edge Function logs for errors
3. Check browser console for API errors

**If incidents don't save:**
1. Verify the `incidents` table exists in Table Editor
2. Check that the Edge Function is deployed
3. Look for errors in browser console

**Need to reset?**
- You can delete all data from tables in Supabase Table Editor
- Or drop and recreate tables by running the SQL again

---

## 📝 What Changed From Before

**Before (localStorage):**
- Data only on your browser
- Lost when clearing cache
- No real authentication
- No sharing between devices

**After (PostgreSQL):**
- Real database in the cloud
- Data persists forever
- Secure authentication with Supabase Auth
- Access from any device
- Multi-user support

---

**Ready to test!** Run the SQL in Supabase, then start using your fully backend-powered environmental monitoring platform! 🌱
