// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sfjcnvphsubsqeoefikk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmamNudnBoc3Vic3Flb2VmaWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MDk0MjEsImV4cCI6MjA2NTQ4NTQyMX0.UZRt4PiDAi7GcalffHQRHbZdZmDTtBfC-mzsOqGsWkE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ------------------ 用户注册 & 登录 ------------------
export async function signUpWithEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
}

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export function getCurrentUser() {
  return supabase.auth.getUser();
}

// ------------------ 跳一跳排行榜 ------------------
export async function uploadJumpScore(score) {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();
  if (userError || !user) return;

  await supabase.from('scores_jump').insert({
    user_id: user.id,
    score,
  });
}

export async function getTopJumpScores(limit = 10) {
  const { data, error } = await supabase
    .from('scores_jump')
    .select('score, created_at, user_id, user:user_profiles(nickname)')
    .order('score', { ascending: false })
    .limit(limit);

  return { data, error };
}

