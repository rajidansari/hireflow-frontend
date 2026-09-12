"use client";

import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
  MoreHorizontal,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getMyApplicationsApi, withdrawApplicationApi } from "@/api/applications";
import { toast } from "sonner";
import { Link, Navigate, useNavigate } from "react-router";
import { SpinnerButton } from "@/components/ui/SpinnerButton";
import useAuthStore from "@/store/authStore";

const statusStyles = {
  pending: "bg-blue-50 text-blue-700 border-blue-200",
  reviewed: "bg-amber-50 text-amber-700 border-amber-200",
  hired: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-muted text-muted-foreground border-border",
};

function MyApplications() {
  const [withdrawn, setWithdrawn] = useState([]);
  const [applications, setApplications] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.accessToken !== null);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />;
  }

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const response = await getMyApplicationsApi();

        setApplications(response.data.data);
      } catch (err) {
        console.error(`Failed to fetch my applications :: ${err}`);

        if (err.response.status == 403) {
          navigate("/login");
        }

        toast.error(err.response?.data?.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchMyApplications();
  }, [applications]);

  // handle application withdraw
  const handleWithdrawApplication = async (id) => {
    try {
      const response = await withdrawApplicationApi(id);
      toast.success(response.data.message || "Application withdraw success");
    } catch (err) {
      console.error(`Failed to withdraw application :: ${err}`);

      if (err.response.status == 403) {
        navigate("/login");
        toast.info(err.response?.data?.message || `Login to continue`);
      }

      if (err.response.status == 404) {
        toast.info(err.response?.data?.message || `Application not found!!`);
      }
    }
  };

  if (loading) {
    return <SpinnerButton />;
  }

  return (
    <div className="min-h-screen bg-muted/40 text-foreground">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
          <Link to={"/jobs"} className="flex items-center gap-2 text-sm font-bold tracking-tight">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <BriefcaseBusiness className="size-4" />
            </span>
            HireFlow
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            <Link to={"/my-applications"} className="font-semibold text-primary">
              My applications
            </Link>
            <Link to="/me" className="hover:text-foreground">
              Profile
            </Link>
          </nav>
          <Link to={"/jobs"}>
            <Button variant="outline" size="sm" className="text-sm cursor-pointer">
              Browse jobs
            </Button>
          </Link>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-6xl px-4 py-8 lg:px-6 lg:py-12">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Badge
              variant="secondary"
              className="mb-3 rounded-full px-3 py-1 text-[11px] text-primary"
            >
              Candidate dashboard
            </Badge>
            <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              My applications
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Keep track of every opportunity and stay close to your next role.
            </p>
          </div>
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <input
              placeholder="Search applications"
              className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryCard label="Total applications" value={String(applications.length)} />
          <SummaryCard
            label="Pending"
            value={applications.filter((a) => a.status == "pending").length}
            accent="text-primary"
          />
          <SummaryCard
            label="Reviewed"
            value={applications.filter((a) => a.status == "reviewed").length}
            accent="text-emerald-600"
          />
          <SummaryCard
            label="Rejected"
            value={applications.filter((a) => a.status == "rejected").length}
            accent="text-emerald-600"
          />
        </div>

        <div
          id="applications"
          className="grid gap-6 lg:grid-cols-[minmax(1fr)_330px] lg:items-start"
        >
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Recent applications</h2>
              <span className="text-xs text-muted-foreground">
                {applications.length} applications
              </span>
            </div>
            {applications.map((application) => {
              const isWithdrawn = withdrawn.includes(application.id);
              return (
                <Card
                  key={application.id}
                  className={`cursor-pointer p-4 transition-all hover:border-primary/40 sm:p-5`}
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <BriefcaseBusiness className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                        <div>
                          <h3 className="truncate text-sm font-semibold sm:text-base">
                            {application.title}
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {application.company_name}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`w-fit text-[10px] ${application.status == `pending` ? statusStyles.pending : application.status == `reviewed` ? statusStyles.reviewed : application.status == `hired` ? statusStyles.hired : statusStyles.rejected}`}
                        >
                          {application.status}
                        </Badge>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 items-center justify-between text-[11px] text-muted-foreground">
                        <div className="flex gap-x-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3.5" />
                            {application.location}
                          </span>
                          <span>
                            Applied on - {new Date(application.applied_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <Button
                            onClick={() => handleWithdrawApplication(application.id)}
                            variant="outline"
                            className="w-full text-xs text-destructive hover:bg-destructive/5 hover:text-destructive cursor-pointer"
                          >
                            <X className="mr-2 size-3.5" />
                            Withdraw application
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </section>
        </div>
      </main>
    </div>
  );
}

export default MyApplications;

function SummaryCard({ label, value, accent = "" }) {
  return (
    <Card className="p-4">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${accent}`}>{value}</p>
    </Card>
  );
}
