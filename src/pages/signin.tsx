import AuthLayout from "@/layouts/auth-layout";
import FormSignin from "@/layouts/form/auth/form-signin";

const Page = () => {
  return (
    <AuthLayout
      textMore="Don't have an account? Sign up"
      type="signin"
      title="Welcome Back! Let's Get You Signed In"
    >
      
      <FormSignin />
    </AuthLayout>
  );
};

export default Page;
