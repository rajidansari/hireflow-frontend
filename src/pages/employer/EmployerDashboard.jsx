"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  Edit,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, Navigate } from "react-router";
import { deletePostedJobApi, getEmployerPostedJobsApi } from "@/api/jobs";
import { toast } from "sonner";
import { SpinnerButton } from "@/components/ui/SpinnerButton";
import useAuthStore from "@/store/authStore";
import NotificationsDrawer from "@/components/NotificationsDrawer";

function EmployerDashboard() {
  const [jobs, setJobs] = useState(null);
  const [loading, setLoading] = useState(true);

  // notifications
  const [open, setOpen] = useState(false);

  // check auth & role
  const isAuthenticated = useAuthStore((state) => state.accessToken !== null);
  const isEmployer = useAuthStore((state) => state.role === "employer");

  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />;
  } else if (!isEmployer) {
    return <Navigate to={"/login"} replace />;
  }

  // fetch employer jobs
  useEffect(() => {
    const fetchPostedJobs = async () => {
      try {
        const response = await getEmployerPostedJobsApi();

        setJobs(response.data.data);
      } catch (err) {
        console.error(`Failed to fetch posted jobs :: ${err}`);
        toast.error(err.response?.data?.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };

    fetchPostedJobs();
  }, []);

  const handleDelete = async (jobId) => {
    setJobs((prev) => prev.filter((job) => job.id !== jobId));

    try {
      const response = await deletePostedJobApi(jobId);
      toast.success(response.data.message || "Job deleted");
    } catch (err) {
      console.error(`Failed to delete job :: ${err}`);
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) {
    return <SpinnerButton />;
  }

  return (
    <main className="min-h-svh bg-muted/30 text-foreground">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
          <div className="flex items-center gap-2 text-sm font-bold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BriefcaseBusiness className="size-4" />
            </span>
            HireFlow
          </div>
          <div className="flex items-center gap-5">
            <Link to={"/employer/me"} className="hidden text-sm sm:inline">
              Profile
            </Link>
            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              className="hidden text-sm sm:inline cursor-pointer"
              title={"Notifications"}
            >
              <Bell />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-primary">Employer workspace</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Jobs dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage your open roles and connect with the right candidates.
            </p>
          </div>
          <Link to={"/employer/jobs/new"}>
            <Button className="cursor-pointer">
              <Plus className="mr-2 size-4" />
              Post a new job
            </Button>
          </Link>
        </div>

        <section aria-label="Job metrics" className="mt-8 grid gap-4 sm:grid-cols-3">
          <MetricCard
            label="Total jobs posted"
            value={jobs.length}
            caption="Across all listings"
            icon={<BriefcaseBusiness />}
          />
          <MetricCard
            label="Active jobs"
            value={jobs.filter((job) => job.status === "active").length}
            caption="Currently accepting applications"
            icon={<CheckCircle2 />}
            accent
          />
          <MetricCard
            label="Total applicants"
            value={jobs.reduce((sum, job) => sum + job.applicants, 0)}
            caption="Across your job listings"
            icon={<Users />}
          />
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">All posted jobs</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Review performance and manage each role.
              </p>
            </div>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              View analytics <ArrowUpRight className="ml-2 size-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobRow key={job.id} job={job} onDelete={() => handleDelete(job.id)} />
            ))}
            {!jobs.length && (
              <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <BriefcaseBusiness className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold">No jobs posted yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create your first listing to start finding candidates.
                </p>
                <Button className="mt-5">
                  <Plus className="mr-2 size-4" />
                  Post a new job
                </Button>
              </Card>
            )}
          </div>
        </section>
      </div>

      {/* Notifications */}
      <NotificationsDrawer open={open} setOpen={setOpen} />
    </main>
  );
}

function MetricCard({ label, value, caption, icon, accent = false }) {
  return (
    <Card className="p-5">
      <div
        className={`flex size-10 items-center justify-center rounded-lg ${accent ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}
      >
        {icon}
      </div>
      <p className="mt-5 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
    </Card>
  );
}

function JobRow({ job, onDelete, onApplications }) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="hidden size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:flex">
            <BriefcaseBusiness className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{job.title}</h3>
              <Badge variant={job.status === "active" ? "default" : "secondary"}>
                {job.status}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {job.location} <span className="mx-1">·</span>
              <span>
                {`${Math.round(job.salary_min / 1000)}k`} -{" "}
                {`${Math.round(job.salary_max / 1000)}k`}
              </span>
            </p>
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              Posted on {new Date(job.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        {/* <div className="grid grid-cols-2 gap-4 border-y py-3 text-sm sm:flex sm:border-y-0 sm:py-0">
          <div>
            <p className="text-xs text-muted-foreground">Applicants</p>
            <p className="mt-1 font-semibold">{job.applicants}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Views</p>
            <p className="mt-1 flex items-center gap-1 font-semibold">
              <Eye className="size-3.5 text-muted-foreground" />
              {job.views}
            </p>
          </div>
        </div> */}
        <div className="flex flex-wrap gap-2">
          <Link to={`/jobs/${job.id}/applications`}>
            <Button
              onClick={onApplications}
              size="sm"
              className="flex-1 sm:flex-none cursor-pointer"
            >
              <Users className="mr-2 size-4" />
              See applications
            </Button>
          </Link>
          <Button
            onClick={onDelete}
            aria-label={`Delete ${job.title}`}
            size="sm"
            variant="outline"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
          >
            <Trash2 className="size-4" />
            Delete job
          </Button>
          <Link to={`/employer/jobs/${job.id}/edit`}>
            <Button
              aria-label={`Edit job`}
              title={"Edit job"}
              size="icon"
              variant="outline"
              className="hidden sm:inline-flex cursor-pointer"
            >
              <Edit className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default EmployerDashboard;
