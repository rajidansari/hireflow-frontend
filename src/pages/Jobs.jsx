import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Briefcase,
  Heart,
  Share2,
  Search,
  MapPin,
  Bookmark,
  CheckCircle2,
  SlidersHorizontal,
  Sparkles,
  Bell,
} from "lucide-react";

import { getJobDetailsApi, getJobsApi } from "@/api/jobs";
import { toast } from "sonner";
import { Link, Navigate } from "react-router";
import { formatSalary } from "@/utils/formatSalary";
import useAuthStore from "@/store/authStore";
import NotificationsDrawer from "@/components/NotificationsDrawer";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  const [selectedJobId, setSelectedJobId] = useState(null);

  const [showDetailsMobile, setShowDetailsMobile] = useState(false);
  const [showFiltersDialog, setShowFiltersDialog] = useState(false);

  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const [filterSkills, setFilterSkills] = useState([]);
  const [filterSalaryMin, setFilterSalaryMin] = useState("");
  const [filterSalaryMax, setFilterSalaryMax] = useState("");

  const [sortBy, setSortBy] = useState("newest");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  const [loading, setLoading] = useState(true);

  // job details
  const [selectedJob, setSelectedJob] = useState(null);

  // notification drawer
  const [open, setOpen] = useState(false);

  // role redirect
  const isAuthenticated = useAuthStore((state) => state.accessToken !== null);
  const isEmployer = useAuthStore((state) => state.role === "employer");

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const response = await getJobsApi();

        setJobs(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch jobs ::", err);

        toast.error(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      const titleMatch = job.title?.toLowerCase().includes(searchTitle.toLowerCase());

      const locationMatch = job.location?.toLowerCase().includes(searchLocation.toLowerCase());

      const salaryMin = filterSalaryMin ? Number(filterSalaryMin) : 0;

      const salaryMax = filterSalaryMax ? Number(filterSalaryMax) : Infinity;

      const salaryMatch = job.salary_min >= salaryMin && job.salary_max <= salaryMax;

      const skillsMatch =
        filterSkills.length === 0 ||
        filterSkills.some((skill) =>
          job.skills?.some((jobSkill) => jobSkill.toLowerCase().includes(skill.toLowerCase()))
        );

      return titleMatch && locationMatch && salaryMatch && skillsMatch;
    });

    // Sort using fields that actually exist in your API response.
    if (sortBy === "salary-high") {
      result.sort((a, b) => b.salary_max - a.salary_max);
    } else if (sortBy === "salary-low") {
      result.sort((a, b) => a.salary_min - b.salary_min);
    }

    return result;
  }, [jobs, searchTitle, searchLocation, filterSkills, filterSalaryMin, filterSalaryMax, sortBy]);

  // Select the first job when jobs become available.
  useEffect(() => {
    if (filteredJobs.length === 0) {
      setSelectedJobId(null);
      return;
    }

    const selectedStillExists = filteredJobs.some((job) => job.id === selectedJobId);

    if (!selectedStillExists) {
      setSelectedJobId(filteredJobs[0].id);
    }
  }, [filteredJobs, selectedJobId]);

  // selectedJob is derived from selectedJobId.
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!selectedJobId) {
        setSelectedJobId(null);
        return;
      }

      try {
        const response = await getJobDetailsApi(selectedJobId);
        setSelectedJob(response.data.data);
      } catch (err) {
        console.error(err.response?.data?.message);
        toast("Failed to fetch job details");
      }
    };

    fetchJobDetails();
  }, [selectedJobId]);

  const handleJobSelect = (jobId) => {
    setSelectedJobId(jobId);
    setShowDetailsMobile(true);
  };

  const clearFilters = () => {
    setSearchTitle("");
    setSearchLocation("");
    setFilterSkills([]);
    setFilterSalaryMin("");
    setFilterSalaryMax("");
    setSortBy("newest");
    setPage(1);
  };

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>

              <span className="font-bold text-lg hidden sm:inline">HireFlow</span>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              <Link to={"/my-applications"} className="text-sm font-medium hover:text-primary">
                My Applications
              </Link>

              <Link to={"/me"} className="text-sm font-medium hover:text-primary">
                Profile
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="hidden text-sm sm:inline cursor-pointer"
                title={"Notifications"}
              >
                <Bell />
              </Button>

              <Link>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm cursor-pointer">
                  <Sparkles className="size-3" />
                  Discover top roles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {/* ================= DESKTOP ================= */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 p-6">
          {/* Sidebar */}
          <div className="col-span-1 space-y-4">
            {/* Search */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Find your next role</h2>

              <p className="text-sm text-muted-foreground">
                Browse curated opportunities from fast-growing companies.
              </p>

              {/* Job title */}
              <div>
                <label className="text-sm font-medium mb-2 block">Job title</label>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />

                  <Input
                    placeholder="Product Designer, Frontend Engineer"
                    className="pl-9"
                    value={searchTitle}
                    onChange={(e) => {
                      setSearchTitle(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>

                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />

                  <Input
                    placeholder="Remote, New York, London"
                    className="pl-9"
                    value={searchLocation}
                    onChange={(e) => {
                      setSearchLocation(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => setPage(1)}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowFiltersDialog(true)}
                  className="flex-1"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Job count */}
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm font-medium">Showing {filteredJobs.length} jobs</span>
            </div>

            {/* Job listings */}
            <div className="space-y-2">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading jobs...</p>
              ) : filteredJobs.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="font-medium">No jobs found</p>
                  <p className="text-sm text-muted-foreground mt-1">Try changing your filters.</p>
                </Card>
              ) : (
                filteredJobs.map((job) => (
                  <Card
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedJobId === job.id
                        ? "border-primary border-2 bg-primary/5"
                        : "hover:border-primary hover:shadow-sm"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm line-clamp-2">{job.title}</h3>

                          <p className="text-xs text-muted-foreground">{job.company_name}</p>
                        </div>

                        <Bookmark className="w-4 h-4 text-muted-foreground shrink-0" />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                        <MapPin className="w-3 h-3" />

                        <span>{job.location}</span>

                        <span>•</span>

                        <span>
                          {formatSalary(job.salary_min)} - {formatSalary(job.salary_max)}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Details */}
          <div className="col-span-2">
            {selectedJob ? (
              <JobDetailsView job={selectedJob} />
            ) : (
              <Card className="p-8 text-center">
                <p className="font-medium">No job selected</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Select a job to view its details.
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* ================= MOBILE ================= */}
        <div className="md:hidden p-4 space-y-4">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Find your next role</h2>

            {/* Job title */}
            <div>
              <label className="text-sm font-medium mb-2 block">Job title</label>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />

                <Input
                  placeholder="Product Designer, Frontend Engineer"
                  className="pl-9 text-sm"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>

              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />

                <Input
                  placeholder="Remote, New York, London"
                  className="pl-9 text-sm"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-sm"
                onClick={() => setPage(1)}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowFiltersDialog(true)}
                className="flex-1 text-sm"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Job count */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Showing {filteredJobs.length} jobs</span>
          </div>

          {/* Job listings */}
          <div className="space-y-2">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading jobs...</p>
            ) : filteredJobs.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="font-medium">No jobs found</p>
                <p className="text-sm text-muted-foreground mt-1">Try changing your filters.</p>
              </Card>
            ) : (
              filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  onClick={() => handleJobSelect(job.id)}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedJobId === job.id
                      ? "border-primary border-2 bg-primary/5"
                      : "hover:border-primary hover:shadow-sm"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm line-clamp-2">{job.title}</h3>

                        <p className="text-xs text-muted-foreground">{job.company_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                      <MapPin className="w-3 h-3" />

                      <span>{job.location}</span>

                      <span>•</span>

                      <span>
                        {formatSalary(job.salary_min)} - {formatSalary(job.salary_max)}
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ================= MOBILE DETAILS ================= */}
      <Sheet open={showDetailsMobile} onOpenChange={setShowDetailsMobile}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto rounded-t-3xl p-4 sm:p-6">
          <SheetHeader className="mb-4">
            <SheetTitle>Job Details</SheetTitle>
          </SheetHeader>

          {selectedJob && <JobDetailsView job={selectedJob} mobile />}
        </SheetContent>
      </Sheet>

      {/* ================= FILTER DIALOG ================= */}
      <Dialog open={showFiltersDialog} onOpenChange={setShowFiltersDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Jobs</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Skills */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Skills</label>

              <Input
                placeholder="Enter skills (comma separated)"
                value={filterSkills.join(", ")}
                onChange={(e) =>
                  setFilterSkills(
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
              />
            </div>

            {/* Salary min */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Salary</label>

              <Input
                type="number"
                placeholder="e.g. 80000"
                value={filterSalaryMin}
                onChange={(e) => setFilterSalaryMin(e.target.value)}
              />
            </div>

            {/* Salary max */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Maximum Salary</label>

              <Input
                type="number"
                placeholder="e.g. 180000"
                value={filterSalaryMax}
                onChange={(e) => setFilterSalaryMax(e.target.value)}
              />
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sorting" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>

                  <SelectItem value="salary-high">Highest Salary</SelectItem>

                  <SelectItem value="salary-low">Lowest Salary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results per page */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Results Per Page</label>

              <Select value={String(limit)} onValueChange={(value) => setLimit(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Page */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Page</label>

              <Input
                type="number"
                min="1"
                value={page}
                onChange={(e) => setPage(Math.max(1, Number(e.target.value) || 1))}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={clearFilters}>
              Clear All
            </Button>

            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => setShowFiltersDialog(false)}
            >
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications */}
      <NotificationsDrawer open={open} setOpen={setOpen} />
    </div>
  );
}

function JobDetailsView({ job, mobile = false }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${!mobile ? "border-b pb-6" : ""}`}>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h1 className={`font-bold ${mobile ? "text-2xl" : "text-3xl"} mb-2`}>{job.title}</h1>

            <div
              className={`flex flex-wrap items-center gap-3 ${
                mobile ? "text-xs" : "text-sm"
              } text-muted-foreground`}
            >
              <span className="font-medium">{job.company_name}</span>

              <span>•</span>

              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </div>

              <span>•</span>

              <span className="capitalize">{job.status}</span>
            </div>
          </div>

          {!mobile && (
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>

              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-1">SALARY</p>

          <p className="font-bold">
            {formatSalary(job.salary_min)} - {formatSalary(job.salary_max)}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-1">LOCATION</p>

          <p className="font-bold flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {job.location}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-1">COMPANY</p>

          <p className="font-bold">{job.company_name}</p>
        </Card>
      </div>

      {/* Skills */}
      <div>
        <h2 className={`font-bold mb-3 ${mobile ? "text-lg" : "text-xl"}`}>Required skills</h2>

        <div className="flex flex-wrap gap-2">
          {job.skills?.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Job Description */}
      <div>
        <h2 className={`font-bold mb-3 ${mobile ? "text-lg" : "text-xl"}`}>About the role</h2>

        <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
      </div>

      {/* Job information */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />

            <div>
              <p className="font-semibold text-sm">Job location</p>
              <p className="text-xs text-muted-foreground">{job.location}</p>
            </div>
          </div>

          <div>
            <p className="font-semibold text-sm">Status</p>
            <p className="text-xs text-muted-foreground capitalize">{job.status}</p>
          </div>

          <div>
            <p className="font-semibold text-sm">Posted on</p>
            <p className="text-xs text-muted-foreground">
              {new Date(job.created_at).toLocaleDateString()}
            </p>
          </div>

          {job.website && (
            <div>
              <p className="font-semibold text-sm">Company website</p>

              <a
                href={job.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Visit website
              </a>
            </div>
          )}
        </div>
      </Card>

      {/* CTA */}
      <div className="space-y-2">
        <Link to={`/jobs/${job.id}/apply`}>
          <Button className="w-full bg-primary hover:bg-primary/90 cursor-pointer">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Apply now
          </Button>
        </Link>

        {/* <Button variant="outline" className="w-full cursor-pointer">
          <MessageSquare className="w-4 h-4 mr-2" />
          Message recruiter
        </Button> */}
      </div>
    </div>
  );
}

export default Jobs;
