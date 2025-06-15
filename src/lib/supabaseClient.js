import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sfjcnvphsubsqeoefikk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmamNudnBoc3Vic3Flb2VmaWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MDk0MjEsImV4cCI6MjA2NTQ4NTQyMX0.UZRt4PiDAi7GcalffHQRHbZdZmDTtBfC-mzsOqGsWkE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadJumpScore(nickname, score) {
  return await supabase.from('scores_jump').insert({ nickname, score });
}

export async function getTopJumpScores(limit = 10) {
  return await supabase
    .from('scores_jump')
    .select('nickname, score')
    .order('score', { ascending: false })
    .limit(limit);
}
