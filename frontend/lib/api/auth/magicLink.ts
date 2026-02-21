import { supabaseClient } from "@/lib/supabase/client";

const magicLink = async (email: string) => {
  const { data, error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
};

export default magicLink;
