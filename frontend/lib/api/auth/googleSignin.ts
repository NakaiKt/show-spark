import { supabaseClient } from "@/lib/supabase/client";

const googleSignin = async () => {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
  });
  return { data, error };
};

export default googleSignin;
