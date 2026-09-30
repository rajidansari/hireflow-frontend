import { useEffect, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, MapPin, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/store/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createJobSchema } from "@/validators/createJobSchema";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { createJobApi, getJobDetailsApi, updateJobApi } from "@/api/jobs";
import { Spinner } from "@/components/ui/spinner";
import { SpinnerButton } from "@/components/ui/SpinnerButton";

function EditJob() {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [updating, setUpdating] = useState(false);

  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      salary_min: null,
      salary_max: null,
    },
  });

  const { jobId } = useParams();

  const navigate = useNavigate();

  // check auth & role
  const isAuthenticated = useAuthStore((state) => state.accessToken !== null);
  const isEmployer = useAuthStore((state) => state.role === "employer");

  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />;
  } else if (!isEmployer) {
    return <Navigate to={"/login"} replace />;
  }

  function addSkill() {
    const skill = skillInput.trim();
    if (skill && !skills.some((item) => item.toLowerCase() === skill.toLowerCase())) {
      setSkills((current) => [...current, skill]);
      setSkillInput("");
    }
  }

  function removeSkill(skillToRemove) {
    setSkills((current) => current.filter((skill) => skill !== skillToRemove));
  }

  // fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await getJobDetailsApi(jobId);
        setJob(response.data.data);
      } catch (err) {
        console.error(`Failed to fetch job details :: ${err}`);
        toast.error(err.response?.data?.message || "Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, []);

  const onSubmit = async (data) => {
    setUpdating(true);
    try {
      const response = await updateJobApi(jobId, { ...data, skills });

      setJob(response.data);

      toast.success("Job Updated");

      reset();
      navigate("/employer/dashboard");
    } catch (err) {
      console.error(`Failed to update job :: ${err}`);

      if (skills.length == 0) {
        toast.error("Add atleast 1 skill to update");
      } else {
        toast.error("Failed to update job");
      }
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (!job) return;

    reset({
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      salary_min: job.salary_min || null,
      salary_max: job.salary_max || null,
    });

    setSkills(job?.skills);
  }, [reset, job]);

  if (loading) {
    return <SpinnerButton />;
  }

  return (
    <main className="min-h-svh bg-muted/40 px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <BriefcaseBusiness className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary">HireFlow for employers</p>
            <Link to={"/employer/dashboard"}>
              <button className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer mt-5">
                <ArrowLeft className="size-4" />
                Back to jobs dashboard
              </button>
            </Link>

            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Create a new job</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Share the role details candidates need to discover and apply to your opportunity.
            </p>
          </div>
        </div>

        <Card className="overflow-hidden border-border/70 shadow-sm">
          <CardHeader className="border-b bg-card px-5 py-5 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold">Job details</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fields marked with an asterisk are required.
                </p>
              </div>
              <span className="hidden rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:inline-flex">
                Draft
              </span>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="grid gap-6 px-5 py-6 sm:px-8">
              {/* title */}
              <div className="grid gap-2">
                <Label htmlFor="title">
                  Job title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Senior Product Designer"
                  {...register("title")}
                />
                {errors.title && (
                  <span className="text-xs text-red-500">{errors?.title?.message}</span>
                )}
              </div>

              {/* description */}
              <div className="grid gap-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the role, team, and what success looks like..."
                  className="min-h-32 w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                  {...register("description")}
                />
                {errors.description && (
                  <span className="text-xs text-red-500">{errors?.description?.message}</span>
                )}
                <p className="text-xs text-muted-foreground">
                  Give candidates enough context to understand the opportunity.
                </p>
              </div>

              {/* skills */}
              <div className="grid gap-2">
                <Label htmlFor="skills">
                  Required skills <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="skills"
                    value={skillInput}
                    onChange={(event) => setSkillInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.nativeEvent.isComposing &&
                        event.keyCode !== 229
                      ) {
                        event.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add a skill"
                    aria-describedby="skills-help"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={addSkill}
                    aria-label="Add skill"
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
                <div
                  className="flex min-h-9 flex-wrap gap-2 rounded-md border border-dashed border-border p-2.5"
                  aria-live="polite"
                >
                  {skills?.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="gap-1 rounded-full px-2.5 py-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        aria-label={`Remove ${skill}`}
                        className="rounded-full outline-none hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                {skills?.length == 0 && (
                  <span className="text-xs text-red-500">Mention atleast 1 skill to proceed</span>
                )}
                <p id="skills-help" className="text-xs text-muted-foreground">
                  Press Enter or use the plus button to add skills.
                </p>
              </div>

              {/* location */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="location">
                    Location <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="location"
                      name="location"
                      className="pl-9"
                      placeholder="e.g. Pune or Remote"
                      {...register("location")}
                    />
                  </div>
                  {errors.location && (
                    <span className="text-xs text-red-500">{errors?.location?.message}</span>
                  )}
                </div>

                {/* salary */}
                <div className="grid gap-2">
                  <Label>
                    Salary range <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* salary min */}
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/3 size-4 -translate-y-1/2 text-muted-foreground">
                        ₹
                      </span>
                      <Input
                        name="salary_min"
                        type="number"
                        min={0}
                        className="pl-9"
                        placeholder="Minimum"
                        aria-label="Minimum salary"
                        {...register("salary_min")}
                      />
                      {errors.salary_min && (
                        <span className="text-xs text-red-500">{errors?.salary_min?.message}</span>
                      )}
                    </div>

                    {/* salary max */}
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/3 size-4 -translate-y-1/2 text-muted-foreground">
                        ₹
                      </span>
                      <Input
                        name="salary_max"
                        type="number"
                        min={0}
                        className="pl-9"
                        placeholder="Maximum"
                        aria-label="Maximum salary"
                        {...register("salary_max")}
                      />
                      {errors.salary_max && (
                        <span className="text-xs text-red-500">{errors?.salary_max?.message}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <div className="flex flex-col-reverse gap-3 border-t bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="text-xs text-muted-foreground">
                You can edit these details after publishing.
              </p>
              <div className="flex gap-3 sm:ml-auto">
                {/* <Button type="submit" variant="outline">
									Save draft
								</Button> */}
                <Button type="submit" disabled={updating} className="min-w-36 cursor-pointer">
                  {updating ? (
                    <>
                      <Spinner /> Updating...
                    </>
                  ) : (
                    `Update Job`
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}

export default EditJob;
