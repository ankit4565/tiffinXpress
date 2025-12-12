# System Architecture & Flow Diagram

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     TiffinXpress App                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐         ┌─────────────────────┐      │
│  │   React App      │         │   React Router      │      │
│  │   (main.jsx)     │────────▶│   (App.jsx)         │      │
│  └──────────────────┘         └─────────────────────┘      │
│           │                            │                    │
│           ▼                            ▼                    │
│  ┌──────────────────┐         ┌─────────────────────┐      │
│  │ AuthProvider     │         │ SubscriptionProvider│      │
│  │ (AuthContext)    │         │ (SubscriptionCtx)   │      │
│  └──────────────────┘         └─────────────────────┘      │
│           │                            │                    │
│           ▼                            ▼                    │
│  ┌──────────────────┐         ┌─────────────────────┐      │
│  │  useAuth Hook    │         │ useSubscription Hook│      │
│  │                  │         │                     │      │
│  └──────────────────┘         └─────────────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
          ┌──────────────────────────────────┐
          │      Supabase Backend            │
          │  (PostgreSQL + Auth)             │
          └──────────────────────────────────┘
                    │
        ┌───────────┼───────────┬──────────────┬──────────┐
        ▼           ▼           ▼              ▼          ▼
    ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐
    │profiles│ │plans   │ │subsc   │ │  orders  │ │ payments │
    │        │ │        │ │riptions│ │          │ │          │
    └────────┘ └────────┘ └────────┘ └──────────┘ └──────────┘
```

## 📱 Page Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│              Home Page (Public)                     │
│                                                     │
│  Header with:                                      │
│  - Logo                                            │
│  - Navigation                                      │
│  - "Get Started" Button  ◄───────────────┐         │
│  - User Avatar (if logged in)             │        │
└─────────────────────────────────────────────────────┘
                    │                                 │
         ┌──────────▼─────────────┐                   │
         │                        │                   │
         ▼                        │                   │
    ┌─────────────┐               │                   │
    │ Logged In?  │               │                   │
    └─────────────┘               │                   │
       │         │                │                   │
    YES│         │NO              │                   │
       │         │                │                   │
       │    ┌────▼──────────────────────┐            │
       │    │    /signup (Public)       │            │
       │    │    /login (Public)        │────┐       │
       │    └─────────────┬──────────────────┤       │
       │                  │                  │       │
       │            ┌─────▼──────┐          │       │
       │            │   Sign Up   │          │       │
       │            │   or        │          │       │
       │            │   Log In    │          │       │
       │            └─────┬───────┘          │       │
       │                  │                  │       │
       │            ┌─────▼──────────────┐   │       │
       │            │ Create Profile     │   │       │
       │            └─────┬──────────────┘   │       │
       │                  │                  │       │
       │            ┌─────▼──────────────┐   │       │
       │            │ Save to Database   │   │       │
       │            └─────┬──────────────┘   │       │
       │                  │                  │       │
       │            ┌─────▼───────────────────┤      │
       │            │ /subscription-          │      │
       │            │ management (Protected)  │      │
       │            │ Auto-Redirect           │      │
       │            └─────┬─────────────────┬─┘      │
       │                  │                 │        │
       │            ┌─────▼──────────┐     │        │
       │            │  Show Plans    │     │        │
       │            │  (Basic,       │     │        │
       │            │   Premium,     │     │        │
       │            │   Deluxe)      │     │        │
       │            └─────┬──────────┘     │        │
       │                  │                 │        │
       │            ┌─────▼──────────┐     │        │
       │            │ Click Plan     │     │        │
       │            │ Modal Form     │     │        │
       │            └─────┬──────────┘     │        │
       │                  │                 │        │
       │            ┌─────▼──────────────┐ │        │
       │            │ Fill Address      │ │         │
       │            │ Details           │ │         │
       │            └─────┬──────────────┘ │        │
       │                  │                 │        │
       │            ┌─────▼──────────────┐ │        │
       │            │ Confirm Subscribe │ │         │
       │            └─────┬──────────────┘ │        │
       │                  │                 │        │
       │            ┌─────▼──────────────┐ │        │
       │            │ Save to Database  │ │         │
       │            │ (Subscription)    │ │         │
       │            └─────┬──────────────┘ │        │
       │                  │                 │        │
       │            ┌─────▼──────────────┐ │        │
       │            │ Redirect to Home   │ │        │
       │            │ Success Message    │ │        │
       │            └─────┬──────────────┘ │        │
       │                  │                 │        │
       │                  ▼                 │        │
       │            ┌──────────────┐        │        │
       │            │  Home Page   │        │        │
       │            └──────────────┘        │        │
       │                  ▲                 │        │
       └──────────────────┼─────────────────┘        │
                          │                           │
       ┌──────────────────┘                          │
       │                                             │
       ▼                                             │
    ┌───────────────────────┐                      │
    │ Click User Avatar      │                      │
    │ Dropdown Menu:         │                      │
    │ - My Subscriptions ◄────┼──────────────────────┤
    │ - My Profile          │                      │
    │ - Settings            │                      │
    │ - Logout              │                      │
    └───────────────────────┘                      │
            │                                      │
            ▼                                      │
    ┌──────────────────────┐                      │
    │ /my-subscriptions    │                      │
    │ (Protected Route)    │                      │
    │                      │                      │
    │ Show:                │                      │
    │ - Current Plan       │                      │
    │ - Billing Info       │                      │
    │ - Renewal Date       │                      │
    │                      │                      │
    │ Actions:             │                      │
    │ - Pause              │                      │
    │ - Resume             │                      │
    │ - Change Plan        │                      │
    │ - Cancel             │                      │
    │                      │                      │
    │ Quick Links:         │                      │
    │ - Browse Tiffins     │                      │
    │ - All Plans          │                      │
    │ - Back Home ──────────────────────────────────┘
    └──────────────────────┘
```

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────┐
│           User Signup & Subscription Flow           │
└─────────────────────────────────────────────────────┘

1. SIGNUP
   ┌──────────────┐
   │ User fills:  │
   │ - Email      │
   │ - Password   │
   │ - Name       │
   └──────┬───────┘
          │
   ┌──────▼──────────────────┐
   │ supabase.auth.signUp()   │
   │                          │
   │ → Calls Supabase Auth    │
   └──────┬───────────────────┘
          │
   ┌──────▼─────────────────────┐
   │ Creates auth user record    │
   │ (auth.users table)          │
   └──────┬──────────────────────┘
          │
   ┌──────▼──────────────────────┐
   │ Redirect to Plans Page       │
   │ /subscription-management    │
   └──────┬───────────────────────┘

2. SELECT PLAN & FILL DETAILS
   ┌──────────────────────┐
   │ User selects plan    │
   │ (Basic/Premium/      │
   │  Deluxe)             │
   └──────┬───────────────┘
          │
   ┌──────▼──────────────────┐
   │ Modal form appears       │
   │ User fills:             │
   │ - Full Name             │
   │ - Phone                 │
   │ - Address               │
   │ - City                  │
   │ - State                 │
   │ - Postal Code           │
   └──────┬──────────────────┘

3. SAVE DATA TO DATABASE
   ┌──────▼──────────────────────────┐
   │ Save User Profile               │
   │                                 │
   │ supabase.from("profiles")       │
   │   .upsert({                     │
   │     id: user.id,                │
   │     full_name: data.full_name,  │
   │     phone: data.phone,          │
   │     address: data.address,      │
   │     city: data.city             │
   │   })                            │
   │                                 │
   │ ✓ Data saved to profiles table  │
   └──────┬───────────────────────────┘
          │
   ┌──────▼──────────────────────────┐
   │ Create Subscription Record      │
   │                                 │
   │ supabase.from(                  │
   │   "user_subscriptions"          │
   │ ).insert({                      │
   │   user_id: user.id,             │
   │   plan_id: selected_plan.id,    │
   │   status: "active",             │
   │   start_date: today,            │
   │   next_billing_date: +30 days   │
   │ })                              │
   │                                 │
   │ ✓ Data saved to subscriptions   │
   └──────┬───────────────────────────┘
          │
   ┌──────▼──────────────────────────┐
   │ Create Payment Record           │
   │                                 │
   │ supabase.from("payments")       │
   │   .insert({                     │
   │     user_id: user.id,           │
   │     subscription_id: sub.id,    │
   │     amount: plan.price,         │
   │     status: "completed"         │
   │   })                            │
   │                                 │
   │ ✓ Data saved to payments table  │
   └──────┬───────────────────────────┘
          │
   ┌──────▼──────────────┐
   │ Redirect to Home     │
   │ Success Message      │
   └──────────────────────┘

4. VIEW SUBSCRIPTION
   ┌──────────────┐
   │ User clicks  │
   │ avatar → My  │
   │ Subscriptions│
   └──────┬───────┘
          │
   ┌──────▼────────────────────────┐
   │ Fetch subscription data:       │
   │                               │
   │ supabase.from(                │
   │   "user_subscriptions"        │
   │ ).select(                     │
   │   "*, subscription_plans(*)"  │
   │ ).eq("user_id", user.id)      │
   │                               │
   │ ✓ Get plan + details          │
   └──────┬────────────────────────┘
          │
   ┌──────▼──────────────────┐
   │ Display:                │
   │ - Current Plan          │
   │ - Billing Date          │
   │ - Features              │
   │ - Action Buttons        │
   └──────────────────────────┘

5. MANAGE SUBSCRIPTION
   ┌──────────────────┐
   │ User chooses:    │
   │ - Pause          │
   │ - Resume         │
   │ - Change Plan    │
   │ - Cancel         │
   └──────┬───────────┘
          │
   ┌──────▼─────────────────────┐
   │ Update subscription record  │
   │                             │
   │ supabase.from(              │
   │   "user_subscriptions"      │
   │ ).update({                  │
   │   status: "paused/active/   │
   │           cancelled"        │
   │ })                          │
   │                             │
   │ ✓ Status updated            │
   └──────┬──────────────────────┘
          │
   ┌──────▼──────────────┐
   │ Show confirmation   │
   │ Refresh page data   │
   └──────────────────────┘
```

## 🗄️ Database Schema

```
┌─────────────────────────────────────────────┐
│            Supabase Database                │
│          (PostgreSQL)                       │
└─────────────────────────────────────────────┘
       │        │         │       │      │
       ▼        ▼         ▼       ▼      ▼

   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌────────┐
   │      │ │      │ │      │ │      │ │        │
   │auth. │ │      │ │      │ │      │ │        │
   │users │ │      │ │      │ │      │ │        │
   │      │ │      │ │      │ │      │ │        │
   └──────┘ └──────┘ └──────┘ └──────┘ └────────┘
      ▲        ▲        ▲        ▲         ▲
      │        │        │        │         │
      │   ┌────┴──────┬─┴──────┬─┴─┐      │
      │   │           │        │   │      │
      │   ▼           ▼        ▼   ▼      │
      │  ┌─────────────────────────────┐  │
      │  │  profiles                   │  │
      │  │  ─────────────────────────  │  │
      │  │  id (FK→auth.users.id) ─────┼──┘
      │  │  email                      │
      │  │  full_name                  │
      │  │  phone                      │
      │  │  address                    │
      │  │  city, state, postal_code   │
      │  │  created_at, updated_at     │
      │  └──────┬──────────────────────┘
      │         │
      │         │ 1:Many
      │         │
      │    ┌────▼────────────────────────┐
      │    │ user_subscriptions          │
      │    │ ─────────────────────────── │
      │    │ id                          │
      │    │ user_id (FK→profiles.id) ───┼──┐
      │    │ plan_id (FK→sub_plans.id) ──┼──┼──┐
      │    │ status (active/paused/      │  │  │
      │    │         cancelled)          │  │  │
      │    │ start_date, next_billing    │  │  │
      │    │ created_at, updated_at      │  │  │
      │    └─────────────┬────────────────┘  │  │
      │                  │                   │  │
      │         1:Many   │                   │  │
      │                  │                   │  │
      │            ┌─────▼──────────────┐    │  │
      │            │ orders             │    │  │
      │            │ ────────────────── │    │  │
      │            │ id                 │    │  │
      │            │ user_id ───────────┼────┘  │
      │            │ subscription_id ───┼──┐    │
      │            │ delivery_date      │  │    │
      │            │ meals (L/D/B)      │  │    │
      │            │ status             │  │    │
      │            └────────────────────┘  │    │
      │                                    │    │
      │  ┌─────────────────────────────────┘    │
      │  │                                      │
      │  ▼                                      │
      │ ┌──────────────────────────────────┐   │
      │ │ subscription_plans               │   │
      │ │ ────────────────────────────     │   │
      │ │ id                               │   │
      │ │ name (Basic/Premium/Deluxe) ────┼───┤
      │ │ description                      │   │
      │ │ price (2500/4500/6500)           │   │
      │ │ meals_per_week (3/5/7)           │   │
      │ │ delivery_days (array)            │   │
      │ │ features (jsonb array)           │   │
      │ │ icon (emoji)                     │   │
      │ │ popular (boolean)                │   │
      │ └──────────────────────────────────┘   │
      │                                        │
      └────────────┐                           │
                   │                           │
                   ▼                           │
    ┌─────────────────────────────────────┐  │
    │ payments                             │  │
    │ ─────────────────────────────────── │  │
    │ id                                   │  │
    │ user_id ────────────────────────────┼──┘
    │ subscription_id ─────────────────────┼──┐
    │ amount                               │  │
    │ payment_method (card/upi/etc)       │  │
    │ status (pending/completed/failed)   │  │
    │ transaction_id                       │  │
    │ payment_date                         │  │
    │ created_at                           │  │
    │ ─────────────────────────────────── │  │
    │ (transaction history tracking)       │  │
    └─────────────────────────────────────┘  │
                                             │
    ┌────────────────────────────────────────┘
    │
    └─ All tables have RLS (Row Level Security) enabled
```

## 🔐 Security Flow

```
┌──────────────────────────────────────────┐
│      Request from Frontend               │
└──────────────────────────────────────────┘
            ▼
┌──────────────────────────────────────────┐
│    Supabase Auth Check                   │
│    - Is user logged in?                  │
│    - Is JWT token valid?                 │
└──────────────────────────────────────────┘
            ▼
      ┌─────────────┐
      │   Valid?    │
      └─────────────┘
       │           │
      YES          NO
       │           │
       │      ┌────▼─────────┐
       │      │ Deny Access  │
       │      │ Return 401   │
       │      └──────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│   Check RLS Policy                       │
│   - Does user own this record?           │
│   - Is policy satisfied?                 │
└──────────────────────────────────────────┘
            ▼
      ┌──────────┐
      │ Policy   │
      │ OK?      │
      └──────────┘
       │       │
      YES     NO
       │       │
       │   ┌───▼──────────┐
       │   │ Deny Access  │
       │   │ Return 403   │
       │   └──────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│   Execute Query                          │
│   - Only user's own data returned        │
│   - Can't access other users' data       │
└──────────────────────────────────────────┘
            ▼
┌──────────────────────────────────────────┐
│      Return Data to Frontend             │
│      (Only user's data)                  │
└──────────────────────────────────────────┘
```

---

This architecture ensures:

- ✅ Secure authentication
- ✅ Data isolation
- ✅ Proper error handling
- ✅ Scalable design
- ✅ Performance optimization
