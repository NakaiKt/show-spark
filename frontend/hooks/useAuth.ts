import googleSignin from "@/lib/api/auth/googleSignin";
import magicLink from "@/lib/api/auth/magicLink";
import { getErrorMessage } from "@/lib/supabase/errors";
import type { SigninSchemaType } from "@/models/Auth";
import { signinSchema } from "@/models/Auth";
import { toast } from "sonner";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninSchemaType>({
    resolver: zodResolver(signinSchema),
  });

  const signInWithGoogle = async () => {
    setIsLoading(true);
    const { error } = await googleSignin();
    if (error) {
      const errorMessage = getErrorMessage(error);
      toast(errorMessage.title ?? "サインインに失敗しました", {
        description: errorMessage.message,
      });
    }
    setIsLoading(false);
  };

  const signInWithMagicLink = async (email: string) => {
    setIsLoading(true);
    const { error } = await magicLink(email);
    if (error) {
      const errorMessage = getErrorMessage(error);
      toast(errorMessage.title ?? "サインインに失敗しました", {
        description: errorMessage.message,
      });
    } else {
      setEmailSent(true);
    }
    setIsLoading(false);
  };

  const resetEmailSent = () => {
    setEmailSent(false);
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
    isLoading,
    emailSent,
    resetEmailSent,
  };
};

export default useAuth;
