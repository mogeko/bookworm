import { Suspense } from "react";

import { UserSigninForm } from "@/app/login/(signin)/signin-form";

const SigninPage: React.FC<{
  searchParams: { from?: string };
}> = ({ searchParams }) => {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Sign in to Bookwarm
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and password to continue
        </p>
      </div>
      <Suspense fallback={<UserSigninFormFallback />}>
        <UserSigninForm redirectTo={searchParams.from ?? "/"} />
      </Suspense>
    </>
  );
};

const UserSigninFormFallback: React.FC = () => {
  return null;
};

export default SigninPage;
