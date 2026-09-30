import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  Download,
  Mail,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getJobApplicationsApi, getJobDetailsApi } from "@/api/jobs";
import { Link, Navigate, useParams, useSearchParams } from "react-router";
import { SpinnerButton } from "@/components/ui/SpinnerButton";
import { formatSalary } from "@/utils/formatSalary";
import { updateApplicationStatusApi } from "@/api/applications";
import useAuthStore from "@/store/authStore";

const stageStyles = {
  all: "bg-blue-50 text-blue-700 border-blue-200",
  pending: "bg-blue-50 text-blue-700 border-blue-200",
  reviewed: "bg-amber-50 text-amber-700 border-amber-200",
  hired: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

function JobApplications() {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("All applicants".toLocaleLowerCase());
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);

  // application status
  const [applicationStatus, setApplicationStatus] = useState("pending");

  const [loading, setLoading] = useState(true);

  // check auth & role
  const isAuthenticated = useAuthStore((state) => state.accessToken !== null);
  const isEmployer = useAuthStore((state) => state.role === "employer");

  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />;
  } else if (!isEmployer) {
    return <Navigate to={"/login"} replace />;
  }

  const { jobId } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const params = Object.fromEntries(searchParams.entries());

  // fetch applications
  useEffect(() => {
    const fetchJobApplications = async () => {
      try {
        const response = await getJobApplicationsApi(jobId, {
          ...params,
          status: stage == "all applicants" ? undefined : stage,
        });
        setApplications(response.data.data);
        setJob(response.data.job_data);
      } catch (err) {
        console.error(`Failed to fetch applications :: ${err}`);
        toast.error(err.response?.data?.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchJobApplications();
  }, [jobId, stage]);

  // filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const matchesQuery = `${application.fullname} ${application.email} ${application.location}`
        .toLowerCase()
        .includes(query.toLowerCase());

      return matchesQuery;
    });
  }, [applications, query, stage]);

  // handle stage change
  const handleStageChange = (value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (value === "all applicants") {
        next.delete("status");
      } else {
        next.set("status", value);
      }

      return next;
    });
  };

  // handle application status update
  const handleStatusUpdate = async (applicationId) => {
    try {
      const response = await updateApplicationStatusApi({
        status: applicationStatus,
        applicationId,
      });

      setApplicationStatus(response.data.data.status);

      toast.success(response.message || "Status updated");
    } catch (err) {
      console.error(`Failed to update application status :: ${err}`);
      toast.error(err.response?.data?.message || "Failed to update status");
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
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{job.location}</span>
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              M
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-6">
        <Link to={"/employer/dashboard"}>
          <button className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer">
            <ArrowLeft className="size-4" />
            Back to jobs dashboard
          </button>
        </Link>
        <div className="flex flex-col justify-between gap-5 border-b pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-primary">Applications</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">{job.title}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BriefcaseBusiness className="size-3.5" />
                Full-time
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {job.location}
              </span>
              <span>
                {" "}
                {formatSalary(job.salary_min)} - {formatSalary(job.salary_max)}{" "}
              </span>
            </p>
          </div>
          <Button variant="outline">View job listing</Button>
        </div>

        <section aria-label="Application metrics" className="mt-7 grid gap-4 sm:grid-cols-3">
          <Metric label="Total applications" value={applications.length} icon={<Users />} />
          <Metric
            label="Hired"
            value={applications.filter((application) => application.status == "hired").length}
            icon={<BriefcaseBusiness />}
          />
          <Metric
            label="Reviewed"
            value={applications.filter((application) => application.status == "reviewed").length}
            icon={<CalendarDays />}
          />
        </section>

        <section className="mt-8">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">All applications</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Review candidates who applied for this role.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search applicants"
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon" aria-label="Filter applications">
                <SlidersHorizontal className="size-4" />
              </Button>
            </div>
          </div>
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {["All applicants", "Pending", "Reviewed", "Hired", "Rejected"].map((item) => (
              <Button
                key={item}
                variant={stage === item.toLocaleLowerCase() ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setStage(item.toLocaleLowerCase());
                  handleStageChange(item.toLocaleLowerCase());
                }}
              >
                {item}
              </Button>
            ))}
          </div>
          <div className="space-y-3">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <ApplicantRow
                  key={application.id}
                  application={application}
                  handleStatusUpdate={handleStatusUpdate}
                  setApplicationStatus={setApplicationStatus}
                  applicationStatus={applicationStatus}
                />
              ))
            ) : (
              <Card className="p-10 text-center text-sm text-muted-foreground">
                No applications match your search.
              </Card>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value, icon, accent = false }) {
  return (
    <Card className="p-5">
      <div
        className={`flex size-10 items-center justify-center rounded-lg ${accent ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}
      >
        {icon}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </Card>
  );
}

function ApplicantRow({
  application,
  handleStatusUpdate,
  setApplicationStatus,
  applicationStatus,
}) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-full bg-gray-300 text-sm font-bold ${application.color}`}
          >
            {application.fullname.split(" ").map((name) => name[0])}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{application.fullname}</h3>
              <Badge variant="outline" className={stageStyles[application.status]}>
                {application.status}
              </Badge>
            </div>
            <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="size-3.5" />
                {application.email}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {application.location}
              </span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Applied on {new Date(application.applied_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-t pt-3 lg:border-t-0 lg:pt-0">
          <a href={application.cv_url} target="_blank">
            <Button variant="outline" size="sm" className="cursor-pointer">
              <Download className="mr-2 size-4" />
              CV
            </Button>
          </a>

          <Select
            defaultValue={application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            onValueChange={(value) => setApplicationStatus(value.toLowerCase())}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Reviewed">Reviewed</SelectItem>
              <SelectItem value="Hired">Hired</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="default"
            size="sm"
            onClick={() => handleStatusUpdate(application.id)}
            className="cursor-pointer bg-blue-600 text-white"
          >
            <Check className="mr-2 size-4" />
            Update Status
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default JobApplications;
