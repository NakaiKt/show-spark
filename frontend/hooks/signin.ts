import googleSignin from "@/lib/api/auth/googleSignin";
import magicLink from "@/lib/api/auth/magicLink";
import { getErrorMessage } from "@/lib/supabase/errors";
import type { SigninSchemaType } from "@/models/Auth";
import { signinSchema } from "@/models/Auth";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const useSignin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninSchemaType>({
    resolver: zodResolver(signinSchema),
  });

  const signInWithGoogle = async () => {
    const { error } = await googleSignin();
    if (error) {
      const errorMessage = getErrorMessage(error);
      toast(errorMessage.title ?? "サインインに失敗しました", {
        description: errorMessage.message,
      });
    }
  };

  const signInWithMagicLink = async (email: string) => {
    const { error } = await magicLink(email);
    if (error) {
      const errorMessage = getErrorMessage(error);
      toast(errorMessage.title ?? "サインインに失敗しました", {
        description: errorMessage.message,
      });
    }
  };

  return {
    form: {
      register,
      handleSubmit,
      errors,
    },
    signIn: {
      signInWithGoogle,
      signInWithMagicLink,
    },
  };
};

export default useSignin;
