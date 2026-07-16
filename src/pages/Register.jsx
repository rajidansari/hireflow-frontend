import { useState } from "react";
import {
  Briefcase,
  Building2,
  Eye,
  EyeOff,
  Landmark,
  Lock,
  Mail,
  MapPin,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { registerApi } from "@/api/auth";
import { useForm, Controller } from "react-hook-form";
import { registerSchema } from "@/validators/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";

function Register() {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "candidate",
    },
  });

  const [role, setRole] = useState("candidate");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await registerApi(data);

      if (response.status === 201) {
        navigate("/verify-email", { state: { email: data.email } });
      }
    } catch (err) {
      console.error(`Register failed :: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card className="w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Briefcase className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">Hire Flow</span>
        </div>

        {/* Heading */}
        <div className="mt-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Create an Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Join thousands of job seekers and employers
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          {/* Full name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="fullname"
                type="text"
                placeholder="Enter your fullname"
                className="bg-muted/50 pl-9 py-5"
                {...register("fullname", { required: true })}
              />
            </div>
            {errors.fullname && (
              <span className="text-xs text-red-500 pl-3">{errors.fullname?.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="bg-muted/50 pl-9 py-5"
                {...register("email", { required: true })}
              />
            </div>
            {errors.email && (
              <span className="text-xs text-red-500 pl-3">{errors.email?.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="bg-muted/50 px-9 py-5"
                {...register("password", { required: true })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-red-500 pl-3">{errors.password?.message}</span>
            )}
          </div>

          {/* Role toggle */}
          <div className="space-y-2">
            <Label>I am</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setRole("candidate");
                  setValue("role", "candidate");
                }}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors cursor-pointer",
                  role === "candidate"
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-input bg-secondary text-secondary-foreground hover:bg-accent"
                )}
              >
                <User className="size-4" />
                Candidate
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole("employer");
                  setValue("role", "employer");
                }}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors cursor-pointer",
                  role === "employer"
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-input bg-secondary text-secondary-foreground hover:bg-accent"
                )}
              >
                <Building2 className="size-4" />
                Employer
              </button>
            </div>
          </div>

          {/* Company details (employer only) */}
          {role === "employer" && (
            <div className="space-y-4 rounded-xl border-l-4 border-primary bg-primary/5 p-4">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Building2 className="size-4" />
                </span>
                <span className="text-sm font-semibold">Company Details</span>
              </div>

              {/*Company name  */}
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <div className="relative">
                  <Landmark className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="company"
                    placeholder="Enter your company name"
                    className="bg-background pl-9 py-5"
                    {...register("companyName", { required: true })}
                  />
                </div>
                {errors.companyName && (
                  <span className="text-xs text-red-500 pl-3">{errors.companyName?.message}</span>
                )}
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Controller
                  name="industry"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="industry" className="w-full bg-background">
                        <div className="flex items-center gap-2">
                          <Briefcase className="size-4 text-muted-foreground" />
                          <SelectValue placeholder="Select your industry" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.industry && (
                  <span className="text-xs text-red-500 pl-3">{errors.industry?.message}</span>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Enter your location"
                    className="bg-background pl-9 py-5"
                    {...register("location", { required: true })}
                  />
                </div>
                {errors.location && (
                  <span className="text-xs text-red-500 pl-3">{errors.location?.message}</span>
                )}
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full font-semibold py-5 cursor-pointer"
          >
            {isSubmitting ? <Spinner /> : "Register"}
          </Button>
        </form>
        <p className="text-center">
          Already have an account?{" "}
          <Link to={"/login"} className="text-primary font-normal">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Register;
