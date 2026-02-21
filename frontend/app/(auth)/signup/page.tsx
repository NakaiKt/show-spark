"use client";

import useAuth from "@/hooks/useAuth";
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

const SignupPage = () => {
  const { form, signIn, isLoading, emailSent, resetEmailSent } = useAuth();

  const handleSignupWithMagicLink = form.handleSubmit(async (data) => {
    await signIn.signInWithMagicLink(data.email);
  });

  if (emailSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>メールを確認してください</CardTitle>
          <CardDescription>
            入力されたメールアドレスに登録用リンクを送信しました。
            メールに記載されたリンクをクリックして登録を完了してください。
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={resetEmailSent}>
            別のメールアドレスで試す
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>新規登録</CardTitle>
        <CardDescription>
          <Link href="/signin" className="text-primary hover:underline">
            すでにアカウントをお持ちの方はこちら
          </Link>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSignupWithMagicLink}>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                type="email"
                id="email"
                placeholder="you@example.com"
                {...form.register("email")}
              />
              {form.errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {form.errors.email.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "送信中..." : "メールで登録"}
          </Button>
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                または
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={signIn.signInWithGoogle}
            disabled={isLoading}
          >
            Googleで登録
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SignupPage;
