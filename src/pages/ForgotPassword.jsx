import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, Briefcase } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/validators/authSchema";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { forgotPasswordApi } from "@/api/auth";
import useAuthStore from "@/store/authStore";

function ForgotPassword() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.accessToken !== null);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const response = await forgotPasswordApi(data);

      if (response.status === 200) {
        navigate("/verify-reset-otp", { state: { email: data.email } });
      }
    } catch (err) {
      console.error(`Failed forgot password :: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return isAuthenticated ? (
    <Navigate to={"/jobs"} replace />
  ) : (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto p-8 space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Briefcase className="text-secondary" />
          </div>
          <span className="font-bold text-xl">Hire Flow</span>
        </div>

        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Forgot Password?</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we&apos;ll send you a link to reset your password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-semibold block mb-2">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                {...register("email")}
              />
            </div>
            {errors && <span className="text-xs text-red-500 pl-3">{errors?.email?.message}</span>}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-base font-semibold cursor-pointer"
          >
            {isSubmitting ? <Spinner /> : `Send Reset Link`}
          </Button>
        </form>

        {/* Back Link */}
        <div className="text-center">
          <Link to={"/login"}>
            <Button
              variant="button"
              className="text-primary hover:text-primary/80 h-auto p-0 font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Button>
          </Link>
        </div>

        {/* Security Notice */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Otp will be sent to email associated with your Hire Flow account.</p>
        </div>
      </Card>
    </div>
  );
}

export default ForgotPassword;
