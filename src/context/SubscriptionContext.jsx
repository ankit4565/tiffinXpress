import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../utils/supabaseClient";

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subscription plans
  useEffect(() => {
    fetchPlans();
  }, []);

  // Fetch user subscription and profile when user is authenticated
  useEffect(() => {
    if (user) {
      fetchUserSubscription();
      fetchUserProfile();
    } else {
      setCurrentSubscription(null);
      setUserProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .order("price", { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError(err.message);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
      setUserProfile(data || null);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const fetchUserSubscription = async () => {
    setLoading(true);
    try {
      console.log("Fetching subscription for user:", user?.id);
      
      // First, try to get the subscription without the join to see if it exists
      const { data: subData, error: subError } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      console.log("Raw subscription data:", subData);
      console.log("Raw subscription error:", subError);

      if (subError && subError.code !== "PGRST116") {
        throw subError;
      }

      if (!subData) {
        console.log("No active subscription found");
        setCurrentSubscription(null);
        setLoading(false);
        return;
      }

      // Now fetch the plan details separately
      console.log("Fetching plan with ID:", subData.plan_id);
      
      const { data: planData, error: planError } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("id", subData.plan_id)
        .single();

      console.log("Plan data fetched:", planData);
      console.log("Plan fetch error:", planError);

      if (planError) {
        console.error("Plan fetch error details:", planError);
        throw planError;
      }

      // Combine the data
      const combinedData = {
        ...subData,
        subscription_plans: planData,
      };

      console.log("Combined subscription data:", combinedData);
      setCurrentSubscription(combinedData);
    } catch (err) {
      console.error("Error fetching subscription:", err);
      setError(err.message);
      setCurrentSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateProfile = async (profileData) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email,
          ...profileData,
          updated_at: new Date(),
        })
        .select()
        .single();

      if (error) throw error;
      setUserProfile(data);
      return { data, error: null };
    } catch (err) {
      console.error("Error updating profile:", err);
      return { data: null, error: err };
    }
  };

  const subscribeToPlan = async (planId, profileData = {}) => {
    try {
      // First, update or create user profile
      if (Object.keys(profileData).length > 0) {
        await createOrUpdateProfile(profileData);
      }

      // Create subscription
      const { data, error } = await supabase
        .from("user_subscriptions")
        .insert({
          user_id: user.id,
          plan_id: planId,
          status: "active",
          start_date: new Date().toISOString().split("T")[0],
          next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        })
        .select(
          `
          *,
          subscription_plans:plan_id (*)
        `
        )
        .single();

      if (error) throw error;

      setCurrentSubscription(data);

      // Log payment (if you want to track it)
      await supabase.from("payments").insert({
        user_id: user.id,
        subscription_id: data.id,
        amount: data.subscription_plans.price,
        payment_method: "card",
        status: "completed",
      });

      return { data, error: null };
    } catch (err) {
      console.error("Error subscribing to plan:", err);
      return { data: null, error: err };
    }
  };

  const updateSubscription = async (newPlanId) => {
    try {
      // Cancel current subscription
      if (currentSubscription) {
        await supabase
          .from("user_subscriptions")
          .update({ status: "cancelled" })
          .eq("id", currentSubscription.id);
      }

      // Create new subscription
      const { data, error } = await supabase
        .from("user_subscriptions")
        .insert({
          user_id: user.id,
          plan_id: newPlanId,
          status: "active",
          start_date: new Date().toISOString().split("T")[0],
          next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        })
        .select(
          `
          *,
          subscription_plans:plan_id (*)
        `
        )
        .single();

      if (error) throw error;

      setCurrentSubscription(data);

      // Log new payment
      await supabase.from("payments").insert({
        user_id: user.id,
        subscription_id: data.id,
        amount: data.subscription_plans.price,
        payment_method: "card",
        status: "completed",
      });

      return { data, error: null };
    } catch (err) {
      console.error("Error updating subscription:", err);
      return { data: null, error: err };
    }
  };

  const pauseSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .update({ status: "paused" })
        .eq("id", currentSubscription.id)
        .select()
        .single();

      if (error) throw error;
      setCurrentSubscription(data);
      return { data, error: null };
    } catch (err) {
      console.error("Error pausing subscription:", err);
      return { data: null, error: err };
    }
  };

  const resumeSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .update({ status: "active" })
        .eq("id", currentSubscription.id)
        .select()
        .single();

      if (error) throw error;
      setCurrentSubscription(data);
      return { data, error: null };
    } catch (err) {
      console.error("Error resuming subscription:", err);
      return { data: null, error: err };
    }
  };

  const cancelSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .update({ status: "cancelled" })
        .eq("id", currentSubscription.id)
        .select()
        .single();

      if (error) throw error;
      setCurrentSubscription(null);
      return { data, error: null };
    } catch (err) {
      console.error("Error cancelling subscription:", err);
      return { data: null, error: err };
    }
  };

  const value = {
    plans,
    currentSubscription,
    userProfile,
    loading,
    error,
    subscribeToPlan,
    updateSubscription,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    createOrUpdateProfile,
    refetchSubscription: fetchUserSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
}
