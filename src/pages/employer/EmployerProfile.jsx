"use client";

import { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, Check, ExternalLink, Globe2, MapPin, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/store/authStore";
import { Navigate } from "react-router";
import { toast } from "sonner";
import {
  getEmployerProfileApi,
  updateEmployerLogoApi,
  updateEmployerProfileApi,
} from "@/api/employer";
import { Spinner } from "@/components/ui/spinner";
import { SpinnerButton } from "@/components/ui/SpinnerButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employerProfileSchema } from "@/validators/employerProfileSchema";

function EmployerProfile() {
  const fileInput = useRef();
  const [logo, setLogo] = useState(null);

  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // check auth & role
  const isAuthenticated = useAuthStore((state) => state.accessToken !== null);
  const isEmployer = useAuthStore((state) => state.role === "employer");

  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />;
  } else if (!isEmployer) {
    return <Navigate to={"/login"} replace />;
  }

  // validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({
    resolver: zodResolver(employerProfileSchema),
    defaultValues: {
      fullname: "",
      company_name: "",
      website: "",
      industry: "",
      location: "",
      bio: "",
    },
  });

  // fetch employer profile
  useEffect(() => {
    const fetchEmployerProfile = async () => {
      try {
        const response = await getEmployerProfileApi();

        setProfile(response.data);
      } catch (err) {
        console.error(`Failed to fetch employer profile :: ${err}`);
        toast.error(err.response?.data?.message || "Faild to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployerProfile();
  }, []);

  // populate values
  useEffect(() => {
    if (!profile) return;

    reset({
      fullname: profile.fullname ?? "",
      company_name: profile.company_name ?? "",
      industry: profile.industry ?? "",
      website: profile.website ?? "",
      bio: profile.bio ?? "",
      location: profile.location ?? "",
    });
  }, [profile, reset]);

  // update profile
  const onSubmit = async (data) => {
    setSaving(true);

    try {
      const changedData = Object.keys(dirtyFields).reduce((result, key) => {
        result[key] = data[key];
        return result;
      }, {});

      const response = await updateEmployerProfileApi(changedData);
      setProfile(response.data);

      if (logo) {
        const formData = new FormData();
        formData.append("logo", logo);

        const res = await updateEmployerLogoApi(formData);

        setLogo(res.data);
      }

      toast.success("profile updated");
    } catch (err) {
      console.error(`Failed to update :: ${err}`);
      toast.error(err.response?.data?.message || "Failed to update, try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SpinnerButton />;
  }

  return (
    <main className="min-h-svh bg-muted/40 text-foreground">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
          <div className="flex items-center gap-2 text-sm font-bold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BriefcaseBusiness className="size-4" />
            </span>
            HireFlow
          </div>
          <Button variant="outline" size="sm">
            Preview company
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-6">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">Company settings</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Employer profile</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Build a trustworthy company presence that helps great candidates understand who you are.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit space-y-4 lg:sticky lg:top-6">
            <Card className="overflow-hidden py-0">
              <div className="bg-primary/10 px-5 py-7 text-center">
                {/* <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-sm">
                  M
                </div> */}
                <div className="flex justify-center">
                  <img src={profile.logo_url} alt={profile.company_name} height={100} width={100} />
                </div>
                <p className="mt-3 font-semibold">{profile.company_name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{profile.industry}</p>
              </div>
              <div className="space-y-3 p-5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-4 text-primary" />
                  {profile.location}
                </div>
                {profile.website && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe2 className="size-4 text-primary" />
                    {profile.website}
                  </div>
                )}
              </div>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Profile sections
              </p>
              <div className="mt-3 space-y-3 text-sm">
                <p className="font-medium text-primary">Company information</p>
                <p className="text-muted-foreground">Brand & links</p>
                <p className="text-muted-foreground">Public preview</p>
              </div>
            </Card>
          </aside>

          <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card className="p-5 sm:p-7">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold">Company information</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tell candidates about the people and company behind your open roles.
                  </p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name">
                    <Input defaultValue={profile.fullname} {...register("fullname")} />
                  </Field>
                  <Field label="Company name">
                    <Input defaultValue={profile.company_name} {...register("company_name")} />
                  </Field>
                  <Field label="Industry">
                    <Input defaultValue={profile.industry} {...register("industry")} />
                  </Field>
                  <Field label="Location">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        defaultValue={profile.location}
                        {...register("location")}
                      />
                    </div>
                  </Field>
                  <Field label="Bio" className="sm:col-span-2">
                    <textarea
                      defaultValue={profile.bio}
                      {...register("bio")}
                      className="min-h-32 w-full resize-y rounded-md border bg-background px-3 py-2 text-sm leading-6 outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </Field>
                </div>
              </Card>

              <Card className="p-5 sm:p-7">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold">Brand & links</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add the details candidates can use to recognize and explore your company.
                  </p>
                </div>
                <div className="space-y-5">
                  {/* logo */}
                  <div>
                    <Label>Company logo</Label>
                    <div className="mt-2 flex flex-col gap-4 rounded-lg border border-dashed p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground overflow-hidden">
                          <img
                            src={logo ? URL.createObjectURL(logo) : profile.logo_url}
                            alt={profile.company_name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{logo ? logo.name : "Your logo"}</p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, or WEBP recommended
                          </p>
                        </div>
                      </div>

                      <input
                        ref={fileInput}
                        type="file"
                        accept=".png,.jpeg,.webp"
                        className="hidden"
                        onChange={(e) => {
                          const selectedFile = e.target.files?.[0];
                          if (selectedFile) {
                            setLogo(selectedFile);
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
                        {profile.logo_url ? "Replace logo" : "Upload logo"}
                      </Button>
                    </div>
                  </div>

                  {/* webiste */}
                  <Field label="Website">
                    <div className="relative">
                      <ExternalLink className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        defaultValue={profile.website}
                        {...register("website")}
                      />
                    </div>
                  </Field>
                </div>
              </Card>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  Your profile is visible to candidates on your job listings.
                </p>
                <Button type="submit" disabled={saving} className="min-w-32">
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
      </div>
    </main>
  );
}

export default EmployerProfile;

function Field({ label, hint, className = "", children }) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
