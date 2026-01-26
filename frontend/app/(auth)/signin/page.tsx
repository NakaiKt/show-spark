"use client";

import useSignin from "@/hooks/signin";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { form, signIn } = useSignin();

  // メール認証サインイン
  const handleSigninWithMagicLink = form.handleSubmit(async (data) => {
    setLoading(true);
    await signIn.signInWithMagicLink(data.email);
    setLoading(false);
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>サインイン</CardTitle>
        <CardDescription>
          <Link href="/signup">新規登録はこちら</Link>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSigninWithMagicLink}>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">メールアドレス 必須</Label>
              <Input type="email" id="email" {...form.register("email")} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "送信中..." : "メールを送信"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={signIn.signInWithGoogle}
          >
            Googleでサインイン
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginPage;
