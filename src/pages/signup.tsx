import AuthLayout from "@/layouts/auth-layout";
import FormSignup from "@/layouts/form/auth/form-signup";

const Page = () => {
  return (
    <AuthLayout 
      textMore="Already have an account? Sign in" 
      type="register" 
      title="Join Us Today! Create Your Account"
    >
      <FormSignup />
    </AuthLayout>
  );
};

export default Page;
