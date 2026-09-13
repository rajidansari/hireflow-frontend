import { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, Check, FileText, Link2, MapPin, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  getCandidateProfileApi,
  updateCandidateCvApi,
  updateCandidateProfileApi,
} from "@/api/candidate";
import { toast } from "sonner";
import { SpinnerButton } from "@/components/ui/SpinnerButton";
import { Link, Navigate, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { candidateProfileSchema } from "@/validators/candidateProfileSchema";
import { Spinner } from "@/components/ui/spinner";
import useAuthStore from "@/store/authStore";

function CandidateProfile() {
  const fileInput = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [cv, setCv] = useState(null);
  const [saving, setSaving] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.accessToken !== null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({
    resolver: zodResolver(candidateProfileSchema),
    defaultValues: {
      fullname: "",
      headline: "",
      description: "",
      location: "",
      portfolioUrl: "",
    },
  });

  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />;
  }

  // update profile
  const onSubmit = async (data) => {
    try {
      setSaving(true);

      const changedData = Object.keys(dirtyFields).reduce((result, key) => {
        result[key] = data[key];
        return result;
      }, {});

      const response = await updateCandidateProfileApi({ ...changedData, skills });
      setProfile(response.data);

      // check for cv update
      if (cv) {
        const formData = new FormData();
        formData.append("cv", cv);

        const res = await updateCandidateCvApi(formData);
        setCv(res.data);
      }

      toast.success("Profile updated");
    } catch (err) {
      console.error(`Failed to update profile :: ${err}`);
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  // fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getCandidateProfileApi();

        setProfile(response.data);
        setSkills(response.data.skills ?? []);
      } catch (err) {
        console.error(`Failed to fetch profile :: ${err}`);
        toast.error(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (!profile) return;

    reset({
      fullname: profile.fullname ?? "",
      headline: profile.headline ?? "",
      description: profile.description ?? "",
      location: profile.location ?? "",
      portfolioUrl: profile.portfolio_url ?? "",
    });
  }, [profile, reset]);

  if (loading) {
    return <SpinnerButton />;
  }

  // extract initials of fullname
  const initials = profile.fullname
    ?.split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleAddSkill = () => {
    const value = skillInput.trim();

    if (!value || skills.includes(value)) {
      return;
    }

    setSkills((current) => [...current, value]);
    setSkillInput("");
  };

  const handleRemoveSkill = (skill) => {
    setSkills((current) => current.filter((item) => item !== skill));
  };

  const handleSkillKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <main className="min-h-svh bg-muted/30 text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-2 text-sm font-bold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BriefcaseBusiness className="size-4" />
            </span>
            HireFlow
          </div>

          <Link to="/jobs">
            <Button variant="outline" size="sm">
              Back to jobs
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-6 lg:py-10">
        {/* Page heading */}
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">Profile settings</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">Your candidate profile</h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Keep your profile up to date so employers can quickly understand your experience and
            skills.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="h-fit lg:sticky lg:top-24">
            <Card className="overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold">{profile?.fullname}</p>
                    <p className="truncate text-xs text-muted-foreground">{profile?.email}</p>
                  </div>
                </div>

                {/* profile completion percentage */}
                {/* <div className="mt-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Profile completion</span>
                    <span className="font-medium">{completion}%</span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full w-[${completion}%] rounded-full bg-primary`} />
                  </div>
                </div> */}
              </div>
            </Card>
          </aside>

          {/* Main form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal information */}
            <Card className="p-5 sm:p-7">
              <SectionHeader
                title="Personal information"
                description="Tell employers who you are and how they can reach you."
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Full name" required error={null}>
                  <Input {...register("fullname")} placeholder="Your full name" />
                  {errors.fullname && (
                    <span className="text-xs pl-2 text-red-500">{errors.fullname.message}</span>
                  )}
                </FormField>

                <FormField label="Email" hint="Email cannot be changed">
                  <Input value={profile?.email ?? ""} disabled className="bg-muted/50" />
                </FormField>

                <FormField
                  label="Headline"
                  hint="A short professional introduction"
                  className="sm:col-span-2"
                >
                  <Input
                    {...register("headline")}
                    placeholder="e.g. Full-stack developer building web applications"
                  />
                  {errors.headline && (
                    <span className="text-xs pl-2 text-red-500">{errors.headline.message}</span>
                  )}
                </FormField>

                <FormField
                  label="About you"
                  hint="Briefly describe your experience and what you do"
                  className="sm:col-span-2"
                >
                  <textarea
                    {...register("description")}
                    placeholder="Tell employers a little about yourself..."
                    rows={5}
                    className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {errors.description && (
                    <span className="text-xs pl-2 text-red-500">{errors.description.message}</span>
                  )}
                </FormField>
              </div>
            </Card>

            {/* Skills */}
            <Card className="p-5 sm:p-7">
              <SectionHeader
                title="Skills & location"
                description="Add skills and your current location to help employers find a better match."
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <Label>Skills</Label>

                  <div className="mt-2 rounded-md border bg-background p-2 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                          {skill}

                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="size-3" />
                            <span className="sr-only">Remove {skill}</span>
                          </button>
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        value={skillInput}
                        onChange={(event) => setSkillInput(event.target.value)}
                        onKeyDown={handleSkillKeyDown}
                        placeholder="Add a skill..."
                        className="h-8 border-0 px-1 shadow-none focus-visible:ring-0"
                      />

                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="size-8 shrink-0"
                        onClick={handleAddSkill}
                        disabled={!skillInput.trim()}
                      >
                        <span className="sr-only">Add skill</span>
                        <Upload className="hidden" />+
                      </Button>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">Press Enter to add a skill.</p>
                </div>

                <FormField label="Location" hint="Where you're currently based">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      {...register("location")}
                      placeholder="e.g. New Delhi, India"
                      className="pl-9"
                    />
                  </div>
                  {errors.location && (
                    <span className="text-xs pl-2 text-red-500">{errors.location.message}</span>
                  )}
                </FormField>
              </div>
            </Card>

            {/* Documents */}
            <Card className="p-5 sm:p-7">
              <SectionHeader
                title="Documents & links"
                description="Give employers everything they need to learn more about you."
              />

              <div className="space-y-6">
                {/* CV */}
                <div>
                  <Label>CV / resume</Label>

                  <div className="mt-2 rounded-lg border border-dashed bg-muted/20 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <FileText className="size-5" />
                        </div>

                        <a
                          href={cv ? cv.default_cv_url : profile.default_cv_url}
                          target="_blank"
                          className="truncate text-sm font-medium hover:underline"
                        >
                          {cv?.name || "your_cv.pdf"}
                          <div className="min-w-0 ">
                            <p className="text-xs text-muted-foreground">
                              Click here to see <br /> PDF or DOCX · Maximum 5 MB
                            </p>
                          </div>
                        </a>
                      </div>

                      <input
                        ref={fileInput}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(event) => {
                          const selectedFile = event.target.files?.[0];

                          if (selectedFile) {
                            setCv(selectedFile);
                          }
                        }}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInput.current?.click()}
                      >
                        <Upload className="mr-2 size-4" />
                        {profile.default_cv_url ? "Replace CV" : "Upload CV"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Portfolio */}
                <FormField label="Portfolio">
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      {...register("portfolioUrl")}
                      placeholder="https://yourportfolio.com"
                      className="pl-9"
                    />
                  </div>
                  {errors.portfolioUrl && (
                    <span className="text-xs pl-2 text-red-500">{errors.portfolioUrl.message}</span>
                  )}
                </FormField>
              </div>
            </Card>

            {/* Footer actions */}
            <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Your profile is only visible to employers through your applications.
              </p>

              <Button type="submit" className="min-w-32" disabled={saving}>
                {saving ? (
                  <>
                    <Spinner className="mr-2 size-4" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>

      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function FormField({ label, hint, required = false, error, className = "", children }) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-2">
        <Label>
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>

        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>

      <div className="mt-2">{children}</div>

      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default CandidateProfile;
