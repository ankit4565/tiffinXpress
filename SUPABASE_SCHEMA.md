# Supabase Database Schema Setup

Copy and paste these SQL commands into your Supabase SQL Editor to set up the database.

## 1. Create Profiles Table

```sql
-- Create profiles table to store user data
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

-- Set up Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view all profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
```

## 2. Create Subscription Plans Table

```sql
-- Create subscription plans
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

-- Set up RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Anyone can view plans
CREATE POLICY "Plans are viewable by everyone." ON public.subscription_plans
  FOR SELECT USING (true);

-- Insert default plans
INSERT INTO public.subscription_plans (name, description, price, meals_per_week, delivery_days, features, color, icon, popular) VALUES
  ('Basic', 'Perfect for getting started', 2500, 7, ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], '["Lunch","Dinner","Basic meal options"]', '#FFB347', '🍜', false),
  ('Premium', 'Most popular choice', 4500, 7, ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], '["Lunch","Dinner","Premium meal options","Choose meals","Special diets"]', '#FF7A00', '🍱', true),
  ('Deluxe', 'Full meal experience', 6500, 7, ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], '["Lunch","Dinner","Breakfast","Premium meal options","Choose meals","Special diets","Priority delivery"]', '#FF6A00', '👑', false);
```

## 3. Create User Subscriptions Table

```sql
-- Create user subscriptions table
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

-- Set up RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view their own subscriptions." ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own subscriptions
CREATE POLICY "Users can insert their own subscriptions." ON public.user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscriptions
CREATE POLICY "Users can update their own subscriptions." ON public.user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX user_subscriptions_user_id_idx ON public.user_subscriptions(user_id);
CREATE INDEX user_subscriptions_status_idx ON public.user_subscriptions(status);
```

## 4. Create Orders/Deliveries Table

```sql
-- Create orders table for tracking deliveries
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

-- Set up RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view their own orders." ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own orders
CREATE POLICY "Users can insert their own orders." ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own orders
CREATE POLICY "Users can update their own orders." ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX orders_user_id_idx ON public.orders(user_id);
CREATE INDEX orders_delivery_date_idx ON public.orders(delivery_date);
```

## 5. Create Payments Table (Optional)

```sql
-- Create payments table for transaction history
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

-- Set up RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments
CREATE POLICY "Users can view their own payments." ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

-- Create index
CREATE INDEX payments_user_id_idx ON public.payments(user_id);
```

## Setup Instructions

1. **Open Supabase Dashboard**

   - Go to your project
   - Click "SQL Editor" in the left sidebar

2. **Create Tables**

   - Copy each SQL section above
   - Paste into SQL Editor
   - Click "Run" (or Cmd+Enter)
   - Verify success (green checkmark)

3. **Verify Tables**

   - Click "Table Editor" in left sidebar
   - You should see:
     - `profiles`
     - `subscription_plans`
     - `user_subscriptions`
     - `orders`
     - `payments`

4. **Check Data**
   - Click on `subscription_plans` table
   - You should see 3 plans (Basic, Premium, Deluxe)

## Next Steps

After running these SQL commands:

1. Create a subscription context to manage state
2. Build subscription management page
3. Connect Login flow to subscription page
4. Store user data in profiles table
5. Save subscription choices to user_subscriptions table

Your subscription system is now ready to use in your React app! 🚀
