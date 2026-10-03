import { useState } from "react";
import { ChevronLeft, Clock, Briefcase } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { verifyEmail } from "@/api/auth";
import { Link, useLocation, useNavigate } from "react-router";
import useAuthStore from "@/store/authStore";
import { jwtDecode } from "jwt-decode";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const email = useLocation().state?.email;

  const navigate = useNavigate();

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setRole = useAuthStore((state) => state.setRole);
  const setUserId = useAuthStore((state) => state.setUserId);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!otp) {
      setIsSubmitting(false);
      setError("Enter otp");
      return;
    }

    try {
      const response = await verifyEmail({ email, otp });

      if (response.status === 200) {
        setAccessToken(response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);

        setRole(decoded.role);
        setUserId(decoded.userId);

        if (decoded.role === "candidate") {
          navigate("/jobs", { replace: true });
        } else if (decoded.role === "employer") {
          navigate("/employer/dashboard", { replace: true });
        }
      }
    } catch (err) {
      console.error(`Failed to verify email :: ${err}`);
      setError("Invalid otp");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Brand */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Briefcase className="size-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">Hire Flow</span>
          </div>
        </div>

        {/* Heading */}
        <div className="mt-6 text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Verify your email address
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Check your inbox</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            We sent a 6-digit verification otp to email. Enter it below to activate your account.
          </p>
        </div>

        {/* Otp input section */}
        <div className="mt-4 space-y-4">
          {/* Otp input boxes */}
          <div className="flex items-center flex-col gap-2 sm:gap-3">
            <Input
              type="text"
              maxLength={6}
              inputMode="numeric"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-lg border border-input bg-background text-center text-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-2/3 tracking-[16px] py-5"
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
          </div>
        </div>

        {/* Timer and resend */}
        <div className="mt-6 space-y-3">
          <div className="rounded-lg border border-input bg-muted/30 p-3">
            <div className="flex items-start gap-3">
              <Clock className="size-4 flex-shrink-0 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Otp expires in 01:59</p>
                <p className="text-xs text-muted-foreground">
                  Didn&apos;t receive it? Check spam or resend.
                </p>
              </div>
              <button className="text-xs font-semibold text-primary hover:underline whitespace-nowrap cursor-pointer">
                Resend
              </button>
            </div>
          </div>
        </div>

        {/* Verify button */}
        <Button
          onClick={handleVerifyEmail}
          disabled={isSubmitting}
          className="mt-6 w-full font-semibold cursor-pointer"
          size="lg"
        >
          {isSubmitting ? <Spinner /> : `Verify Email`}
        </Button>

        {/* Back to sign in */}
        <Link
          to={"/register"}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ChevronLeft className="size-4" />
          Back to Sign In
        </Link>

        {/* Security footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          For your security, verification helps protect your Hire Flow account.
        </p>
      </Card>
    </main>
  );
}

export default VerifyEmail;
