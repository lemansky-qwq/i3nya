import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sfjcnvphsubsqeoefikk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR...（略）...OqGsWkE';

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
