import { useEffect, useState } from "react";
import { refreshApi } from "./api/auth";
import { jwtDecode } from "jwt-decode";
import useAuthStore from "./store/authStore";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Jobs from "./pages/Jobs";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyResetOtp from "./pages/VerifyResetOtp";
import { SpinnerButton } from "./components/ui/SpinnerButton";
import { Toaster } from "./components/ui/sonner";
import JobApply from "./pages/JobApply";
import MyApplications from "./pages/MyApplications";
import CandidateProfile from "./pages/CandidateProfile";
import EmployerProfile from "./pages/employer/EmployerProfile";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import JobApplications from "./pages/employer/JobApplications";
import CreateJob from "./pages/employer/CreateJob";
import EditJob from "./pages/employer/EditJob";

function App() {
  const [loader, setLoader] = useState(true);

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setRole = useAuthStore((state) => state.setRole);
  const setUserId = useAuthStore((state) => state.setUserId);

  useEffect(() => {
    (async () => {
      try {
        const response = await refreshApi();

        const accessToken = response.data.accessToken;

        const decoded = jwtDecode(accessToken);

        setAccessToken(accessToken);
        setRole(decoded.role);
        setUserId(decoded.userId);
      } catch (err) {
        console.error(`Refresh :: ${err}`);
      } finally {
        setLoader(false);
      }
    })();
  }, [setAccessToken, setRole, setUserId]);

  return (
    <>
      <Toaster />
      {loader ? (
        <SpinnerButton />
      ) : (
        <Routes>
          <Route index element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />

          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:jobId/apply" element={<JobApply />} />

          {/* candidate's applications */}
          <Route path="/my-applications" element={<MyApplications />} />

          {/* candiate profile */}
          <Route path="/me" element={<CandidateProfile />} />

          {/* employer */}
          <Route path="/employer/me" element={<EmployerProfile />} />
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />

          {/* job's applications */}
          <Route path="/jobs/:jobId/applications" element={<JobApplications />} />

          {/* post job */}
          <Route path="/employer/jobs/new" element={<CreateJob />} />

          {/* edit job */}
          <Route path="/employer/jobs/:jobId/edit" element={<EditJob />} />
        </Routes>
      )}
    </>
  );
}

export default App;
