import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff, ArrowLeft, Briefcase } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/validators/authSchema";
import { Spinner } from "@/components/ui/spinner";
import { passwordResetApi } from "@/api/auth";
import useAuthStore from "@/store/authStore";

function ResetPassword() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.accessToken !== null);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...payload } = data;
      const response = await passwordResetApi(payload);

      if (response.status === 200) {
        navigate("/login");
      }
    } catch (err) {
      console.error(`Failed to reset password :: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return isAuthenticated ? (
    <Navigate to={"/jobs"} replace />
  ) : (
    <div className="min-h-screen w-full flex justify-center items-center">
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
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-sm text-muted-foreground">Create a new password for your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="text-sm font-semibold block mb-2">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2 text-muted-foreground" />
              <Input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="pl-9 pr-9"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors && <span className="text-xs text-red-500">{errors.password?.message}</span>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-semibold block mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2 text-muted-foreground" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="pl-9 pr-9"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors && (
              <span className="text-xs text-red-500">{errors.confirmPassword?.message}</span>
            )}
          </div>

          <Button
            type={"submit"}
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-base font-semibold cursor-pointer"
          >
            {isSubmitting ? <Spinner /> : `Reset Password`}
          </Button>
        </form>

        {/* Back Link */}
        <div className="text-center">
          <Link to={"/login"}>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80 h-auto p-0 font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Button>
          </Link>
        </div>

        {/* Security Notice */}
        <div className="text-center text-xs text-muted-foreground">
          <p>For your security, your new password will be encrypted and protected.</p>
        </div>
      </Card>
    </div>
  );
}

export default ResetPassword;
