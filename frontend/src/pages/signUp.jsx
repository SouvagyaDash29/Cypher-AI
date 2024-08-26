import { SignUp } from "@clerk/clerk-react";

const signUp = () => {
  return (
    <div className="h-[100%] flex items-center justify-center">
      <SignUp path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
};

export default signUp;
