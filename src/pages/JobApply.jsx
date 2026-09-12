"use client";

import { useEffect, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  FileText,
  MapPin,
  Upload,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, replace, useNavigate, useParams } from "react-router";
import { getJobDetailsApi } from "@/api/jobs";
import { SpinnerButton } from "@/components/ui/SpinnerButton";
import { formatSalary } from "@/utils/formatSalary";
import { applyJobApi } from "@/api/applications";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

function JobApply() {
  const inputRef = useRef();
  const [file, setFile] = useState(null);
  const [coverNote, setCoverNote] = useState("");
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);

  const { jobId } = useParams();

  const navigate = useNavigate();

  const onSubmitApplication = async () => {
    setLoading(true);
    const formData = new FormData();

    formData.append("coverNote", coverNote);

    if (file) {
      formData.append("cv", file);
    }

    try {
      await applyJobApi(jobId, formData);

      toast.success("Application submitted");

      navigate("/jobs");
    } catch (err) {
      console.error(`Job application failed :: ${err}`);

      if (err.response.status == 403) {
        navigate("/login");
      }

      toast.error(err.response?.data?.message || "Job application failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      const response = await getJobDetailsApi(jobId);
      setJob(response.data.data);
    };

    fetchJobDetails();
  }, [jobId]);

  if (!job) {
    return <SpinnerButton />;
  }

  return (
    <div className="min-h-screen bg-muted/40 text-foreground">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
          <Link to="/jobs" className="flex items-center gap-2 text-sm font-bold tracking-tight">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <BriefcaseBusiness className="size-4" />
            </span>
            HireFlow
          </Link>
          <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
            <span>Application</span>
            <span className="text-border">/</span>
            <span className="font-medium text-foreground">{job.title}</span>
          </div>
          <Link to={"/jobs"}>
            <Button variant="ghost" size="sm" className="text-xs cursor-pointer">
              <ChevronLeft className="mr-1 size-3" /> Back to jobs
            </Button>
          </Link>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-6xl px-4 py-8 lg:px-6 lg:py-12">
        <div className="mb-8 max-w-2xl">
          <Badge
            variant="secondary"
            className="mb-3 rounded-full px-3 py-1 text-[11px] text-primary"
          >
            Complete your application
          </Badge>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Apply for this role
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Share a little about yourself and attach your CV to send a strong application.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
          <Card className="p-5 shadow-sm sm:p-7">
            <div className="mb-7 flex items-center gap-3 border-b pb-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="size-5" />
              </span>
              <div>
                <h2 className="text-base font-semibold">Your application</h2>
                <p className="text-xs text-muted-foreground">
                  Required fields are marked with an asterisk.
                </p>
              </div>
            </div>

            <div className="space-y-7">
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <Label htmlFor="cv">CV or resume (optional)</Label>
                  <span className="text-[11px] text-muted-foreground">PDF</span>
                </div>
                <input
                  ref={inputRef}
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="sr-only"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                {file ? (
                  <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/[.04] p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <FileText className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">Ready to upload</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove CV"
                      onClick={() => {
                        setFile(null);
                        inputRef.current.value = "";
                      }}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-5 py-8 text-center transition-colors hover:border-primary hover:bg-primary/[.03]"
                  >
                    <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Upload className="size-5" />
                    </span>
                    <span className="text-sm font-medium">Upload your CV</span>
                    <span className="mt-1 text-xs text-muted-foreground">
                      Click to browse or drag and drop your file here
                    </span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <Label htmlFor="cover-note">
                    Cover note <span className="">(optional)</span>
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    {coverNote.length}/1,000
                  </span>
                </div>
                <textarea
                  id="cover-note"
                  value={coverNote}
                  onChange={(event) => setCoverNote(event.target.value.slice(0, 1000))}
                  placeholder="Tell the hiring team why you are a great fit for this role..."
                  className="min-h-48 w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm leading-6 outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
                <p className="text-xs text-muted-foreground">
                  Keep it concise and highlight the experience most relevant to this role.
                </p>
              </div>

              <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  By applying, you agree to HireFlow&apos;s application terms.
                </p>
                <Button
                  disabled={loading}
                  onClick={onSubmitApplication}
                  className="h-11 w-full sm:w-auto sm:min-w-40 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Spinner /> Submitting...
                    </>
                  ) : (
                    <>
                      Submit application <CheckCircle2 className="ml-2 size-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden shadow-sm lg:sticky lg:top-24">
            <div className="bg-primary/[.04] p-5">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[.16em] text-primary">
                Selected job
              </p>
              <h2 className="text-xl font-bold tracking-tight">{job.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{job.company_name}</p>
            </div>
            <div className="space-y-5 p-5">
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="space-y-3 border-y py-5 text-sm">
                <div className="flex items-center gap-3">
                  <MapPin className="size-4 text-primary" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock3 className="size-4 text-primary" />
                  <span>Posted on - {new Date(job.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="size-4 text-center text-primary">₹</span>
                  <span>
                    {formatSalary(job.salary_min)} - {formatSalary(job.salary_max)} annually
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold">About the role</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{job.description}</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default JobApply;
