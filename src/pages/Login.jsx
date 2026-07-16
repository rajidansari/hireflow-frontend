import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, Briefcase } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validators/authSchema";
import { Spinner } from "@/components/ui/spinner";
import { loginApi } from "@/api/auth";
import { jwtDecode } from "jwt-decode";
import useAuthStore from "@/store/authStore";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.accessToken !== null);
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/jobs");
    }
  }, [isAuthenticated, navigate]);

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setRole = useAuthStore((state) => state.setRole);
  const setUserId = useAuthStore((state) => state.setUserId);

  const onSubmit = async (data) => {
    console.log("first");
    try {
      setIsSubmitting(true);

      const response = await loginApi(data);

      if (response.status === 200) {
        setAccessToken(response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);

        setRole(decoded.role);
        setUserId(decoded.userId);

        navigate("/jobs");
      }
    } catch (err) {
      console.error(`Failed to login :: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-full max-w-md bg-white p-8 shadow-lg">
        {/* Logo */}
        <div className="flex items-center justify-center mb-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
            <Briefcase className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">JobBoard</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-foreground leading-none">
          Welcome Back
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">Find your next opportunity</p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-foreground block mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-9 bg-muted border-0 text-sm"
                {...register("email")}
              />
            </div>
            {errors && <span className="text-red-500 text-xs pl-3">{errors?.email?.message}</span>}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="text-sm font-semibold text-foreground block mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-9 pr-9 bg-muted border-0 text-sm"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to={"/forgot-password"}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Log In Button */}
          <Button
            type={"submit"}
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 text-sm cursor-pointer"
          >
            {isSubmitting ? <Spinner /> : "Log In"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-border flex-1" />
          <span className="text-xs text-muted-foreground font-medium">OR</span>
          <div className="h-px bg-border flex-1" />
        </div>

        {/* Sign Up Link */}
        <p className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link to={"/register"} className="font-normal text-primary hover:underline">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Login;
