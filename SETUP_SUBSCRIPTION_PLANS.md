# Quick Subscription Plan Setup Guide

## ⚡ 5-Minute Setup

Follow these exact steps to get your subscription system working.

---

## Step 1: Open Supabase Dashboard

1. Go to **[supabase.com](https://supabase.com)** and login
2. Click on your **TiffinXpress project**
3. You should see your project dashboard

---

## Step 2: Create Database Tables

### 2.1 Open SQL Editor

1. In left sidebar, click **"SQL Editor"**
2. Click **"New Query"** button
3. You'll see a blank SQL editor

### 2.2 Copy & Paste SQL Commands

**Copy ONE section at a time. Paste it → Click Run → Wait for green ✓**

---

### 📋 SQL Command 1: Create Profiles Table

Copy this and paste in SQL Editor:

```sql
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text NOT NULL,
  full_name text,
  phone text,
  address text,
  city text,
  state text,
  postal_code text,
  avatar_url text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
```

✅ **Click Run** → Wait for green checkmark

---

### 📋 SQL Command 2: Create Subscription Plans Table

```sql
CREATE TABLE public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  price decimal(10, 2) NOT NULL,
  meals_per_week integer NOT NULL,
  delivery_days text[] DEFAULT '{}',
  features jsonb DEFAULT '{}',
  color text,
  icon text,
  popular boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plans are viewable by everyone." ON public.subscription_plans
  FOR SELECT USING (true);
```

✅ **Click Run** → Wait for green checkmark

---

### 📋 SQL Command 3: Insert Default Plans

```sql
INSERT INTO public.subscription_plans
  (name, description, price, meals_per_week, delivery_days, features, color, icon, popular)
VALUES
  (
    'Basic',
    'Perfect for getting started',
    2500,
    7,
    ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    '["Lunch", "Dinner", "Basic meal options"]'::jsonb,
    '#FFB347',
    '🍜',
    false
  ),
  (
    'Premium',
    'Most popular choice',
    4500,
    7,
    ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    '["Lunch", "Dinner", "Premium meal options", "Choose meals", "Special diets"]'::jsonb,
    '#FF7A00',
    '🍱',
    true
  ),
  (
    'Deluxe',
    'Full meal experience',
    6500,
    7,
    ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    '["Lunch", "Dinner", "Breakfast", "Premium meal options", "Choose meals", "Special diets", "Priority delivery"]'::jsonb,
    '#FF6A00',
    '👑',
    false
  );
```

✅ **Click Run** → Wait for green checkmark

---

### 📋 SQL Command 4: Create User Subscriptions Table

```sql
CREATE TABLE public.user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.subscription_plans(id),
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'expired')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  auto_renew boolean DEFAULT true,
  next_billing_date date,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions." ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions." ON public.user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions." ON public.user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX user_subscriptions_user_id_idx ON public.user_subscriptions(user_id);
CREATE INDEX user_subscriptions_status_idx ON public.user_subscriptions(status);
```

✅ **Click Run** → Wait for green checkmark

---

### 📋 SQL Command 5: Create Orders Table

```sql
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subscription_id uuid NOT NULL REFERENCES public.user_subscriptions(id),
  order_date date NOT NULL DEFAULT CURRENT_DATE,
  delivery_date date NOT NULL,
  meal_lunch text,
  meal_dinner text,
  meal_breakfast text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  special_instructions text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders." ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders." ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders." ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX orders_user_id_idx ON public.orders(user_id);
CREATE INDEX orders_delivery_date_idx ON public.orders(delivery_date);
```

✅ **Click Run** → Wait for green checkmark

---

### 📋 SQL Command 6: Create Payments Table

```sql
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES public.user_subscriptions(id),
  amount decimal(10, 2) NOT NULL,
  payment_method text DEFAULT 'card',
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id text UNIQUE,
  payment_date timestamp DEFAULT now(),
  created_at timestamp DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments." ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX payments_user_id_idx ON public.payments(user_id);
```

✅ **Click Run** → Wait for green checkmark

---

## Step 3: Verify Tables Created

1. Click **"Table Editor"** in left sidebar
2. You should see these 5 tables:

   - ✅ `profiles`
   - ✅ `subscription_plans`
   - ✅ `user_subscriptions`
   - ✅ `orders`
   - ✅ `payments`

3. Click on `subscription_plans` table
4. You should see **3 plans**:
   - 🍜 Basic - ₹2,500/month
   - 🍱 Premium - ₹4,500/month (Popular)
   - 👑 Deluxe - ₹6,500/month

---

## Step 4: Set Environment Variables

1. **In your project folder**, create file `.env.local` (if not exists)
2. Add these lines:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**How to get these values:**

- Go to Supabase → Settings → API
- Copy "Project URL" and "anon public" key
- Paste into `.env.local`

---

## Step 5: Test Your App

1. **Stop dev server** (Ctrl+C)
2. **Start dev server**:
   ```bash
   npm run dev
   ```
3. **Open browser**: `http://localhost:5173`

---

## Step 6: Test the Complete Flow

### 🧪 Test Signup & Subscribe

1. Click **"Get Started"** button (top right)
2. **Fill signup form**:
   - Email: `test@example.com`
   - Password: `Password123`
   - Full Name: `John Doe`
3. Click **"Create Account"**
4. ✅ **Auto-redirects to plans page**
5. Click **"Get Started"** on any plan
6. **Fill address form**:
   - Full Name: `John Doe`
   - Phone: `9876543210`
   - City: `Mumbai`
   - Address: `123 Main Street`
   - State: `Maharashtra`
   - Postal: `400001`
7. Click **"Confirm & Subscribe"**
8. ✅ **Should redirect to home with success message**

### 📋 Test View Subscriptions

1. **Click user avatar** (top right)
2. Click **"📋 My Subscriptions"**
3. ✅ **Should show your current plan details**

### 🎯 Test Manage Subscription

1. On My Subscriptions page:
   - ✅ Try **"Pause Subscription"**
   - ✅ Try **"Resume Subscription"**
   - ✅ Try **"Change Plan"**
   - ✅ Try **"Cancel Subscription"**

---

## ✅ Checklist

- [ ] Created profiles table
- [ ] Created subscription_plans table
- [ ] Created user_subscriptions table
- [ ] Created orders table
- [ ] Created payments table
- [ ] Inserted 3 default plans
- [ ] Set .env.local variables
- [ ] App starts with `npm run dev`
- [ ] Can sign up
- [ ] Auto-redirects to plans
- [ ] Can select and buy plan
- [ ] Can view subscription
- [ ] Can manage subscription
- [ ] No console errors

---

## 🚀 You're Ready!

Your subscription system is now **live and ready to use**!

### Next Steps:

1. Customize plan prices in Supabase
2. Add payment gateway (Razorpay/Stripe)
3. Send confirmation emails
4. Track deliveries
5. Add admin dashboard

---

## 🆘 Troubleshooting

### "Table already exists" error

- You've already created the table
- That's OK! Skip to next SQL command

### "Plans not showing" in app

- Check if you inserted plans (look in table editor)
- Restart dev server

### "Can't subscribe"

- Check .env.local has correct credentials
- Check browser console (F12) for errors
- Check Supabase logs

### Any other issues

- Check SUPABASE_SCHEMA.md for detailed SQL
- Check browser console (F12)
- Check Supabase logs

---

**Done! Your TiffinXpress app is ready to go! 🎉**
