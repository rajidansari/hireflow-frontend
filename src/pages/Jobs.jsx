import { useState, useMemo } from "react";
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
  Clock,
  Users,
  Bookmark,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

const JOBS_DATA = [
  {
    id: 1,
    company: "Apex Studio",
    title: "Senior Product Designer",
    location: "Remote",
    type: "Full-time",
    salary: 140000,
    salaryMax: 180000,
    experience: "5+ years",
    applicants: 128,
    postedDays: 2,
    featured: true,
    skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
    about:
      "We are looking for a senior product designer to shape intuitive experiences across our hiring platform. You will collaborate with product, engineering, and marketing to build polished interfaces that help millions of candidates discover meaningful work.",
    responsibilities: [
      "Lead end-to-end product design from discovery to delivery.",
      "Design scalable systems and reusable components.",
      "Partner with engineers to ship high-quality experiences.",
    ],
    remoteFriendly: true,
    deadline: "March 28, 2026",
  },
  {
    id: 2,
    company: "Northstar Labs",
    title: "Frontend Engineer",
    location: "San Francisco",
    type: "Full-time",
    salary: 130000,
    salaryMax: 160000,
    experience: "3+ years",
    applicants: 89,
    postedDays: 5,
    featured: false,
    skills: ["React", "TypeScript", "Next.js"],
    about: "Join our frontend team to build beautiful, performant web applications.",
    responsibilities: [
      "Build and maintain frontend components",
      "Optimize application performance",
      "Collaborate with design team",
    ],
    remoteFriendly: false,
    deadline: "April 5, 2026",
  },
  {
    id: 3,
    company: "Orbit Commerce",
    title: "Growth Marketing Manager",
    location: "New York",
    type: "Full-time",
    salary: 100000,
    salaryMax: 130000,
    experience: "4+ years",
    applicants: 56,
    postedDays: 7,
    featured: false,
    skills: ["Marketing", "Analytics", "Growth Strategy"],
    about: "Lead growth initiatives for our e-commerce platform.",
    responsibilities: [
      "Develop growth strategies",
      "Manage marketing campaigns",
      "Track and optimize metrics",
    ],
    remoteFriendly: true,
    deadline: "April 10, 2026",
  },
  {
    id: 4,
    company: "Brightline Health",
    title: "UX Writer",
    location: "Remote",
    type: "Contract",
    salary: 80000,
    salaryMax: 110000,
    experience: "2+ years",
    applicants: 34,
    postedDays: 10,
    featured: false,
    skills: ["Content Design", "Healthcare", "UX Writing"],
    about: "Write compelling copy for healthcare products.",
    responsibilities: [
      "Create user-focused copy",
      "Improve user experience through writing",
      "Collaborate with design team",
    ],
    remoteFriendly: true,
    deadline: "April 15, 2026",
  },
];

function Jobs() {
  const [selectedJobId, setSelectedJobId] = useState(1);
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

  const selectedJob = JOBS_DATA.find((j) => j.id === selectedJobId);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = JOBS_DATA.filter((job) => {
      const titleMatch = job.title.toLowerCase().includes(searchTitle.toLowerCase());
      const locationMatch = job.location.toLowerCase().includes(searchLocation.toLowerCase());

      const salaryMin = filterSalaryMin ? parseInt(filterSalaryMin) : 0;
      const salaryMax = filterSalaryMax ? parseInt(filterSalaryMax) : Infinity;
      const salaryMatch = job.salary >= salaryMin && job.salary <= salaryMax;

      const skillsMatch =
        filterSkills.length === 0 ||
        filterSkills.some((skill) =>
          job.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
        );

      return titleMatch && locationMatch && salaryMatch && skillsMatch;
    });

    // Sort
    if (sortBy === "recent") {
      result.sort((a, b) => a.postedDays - b.postedDays);
    } else if (sortBy === "salary-high") {
      result.sort((a, b) => b.salary - a.salary);
    } else if (sortBy === "salary-low") {
      result.sort((a, b) => a.salary - b.salary);
    }

    return result;
  }, [searchTitle, searchLocation, filterSkills, filterSalaryMin, filterSalaryMax, sortBy]);

  const handleJobSelect = (jobId) => {
    setSelectedJobId(jobId);
    setShowDetailsMobile(true);
  };

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg hidden sm:inline">JobBoard</span>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              <button className="text-sm font-medium hover:text-primary">Jobs</button>
              <button className="text-sm font-medium hover:text-primary">Companies</button>
              <button className="text-sm font-medium hover:text-primary">Messages</button>
              <button className="text-sm font-medium hover:text-primary">Profile</button>
            </nav>

            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Sparkles className="size-3" /> Discover top roles
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 p-6">
          {/* Sidebar - Search & Jobs List */}
          <div className="col-span-1 space-y-4">
            {/* Search Filters */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Find your next role</h2>
              <p className="text-sm text-muted-foreground">
                Browse curated opportunities from fast-growing companies.
              </p>

              <div>
                <label className="text-sm font-medium mb-2 block">Job title</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Product Designer, Frontend Engineer"
                    className="pl-9"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Remote, New York, London"
                    className="pl-9"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-primary hover:bg-primary/90">
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

            {/* Job Count */}
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm font-medium">Showing {filteredJobs.length} jobs</span>
            </div>

            {/* Job Listings */}
            <div className="space-y-2">
              {filteredJobs.map((job) => (
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
                        <p className="text-xs text-muted-foreground">{job.company}</p>
                      </div>
                      <Bookmark className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>

                    {job.featured && (
                      <Badge variant="secondary" className="text-xs w-fit">
                        Featured
                      </Badge>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                      <Clock className="w-3 h-3" />
                      <span>{job.type}</span>
                      <span>•</span>
                      <span>${(job.salary / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Content - Job Details */}
          <div className="col-span-2">{selectedJob && <JobDetailsView job={selectedJob} />}</div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden p-4 space-y-4">
          {/* Search Filters */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Find your next role</h2>

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
              <Button className="flex-1 bg-primary hover:bg-primary/90 text-sm">
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

          {/* Job Count */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Showing {filteredJobs.length} jobs</span>
          </div>

          {/* Job Listings */}
          <div className="space-y-2">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                onClick={() => handleJobSelect(job.id)}
                className="p-4 cursor-pointer hover:border-primary hover:shadow-sm transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm line-clamp-2">{job.title}</h3>
                      <p className="text-xs text-muted-foreground">{job.company}</p>
                    </div>
                  </div>

                  {job.featured && (
                    <Badge variant="secondary" className="text-xs w-fit">
                      Featured
                    </Badge>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                    <Clock className="w-3 h-3" />
                    <span>{job.type}</span>
                    <span>•</span>
                    <span>${(job.salary / 1000).toFixed(0)}k</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Details Sheet */}
      <Sheet open={showDetailsMobile} onOpenChange={setShowDetailsMobile}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto rounded-t-3xl p-4 sm:p-6">
          <SheetHeader className="mb-4">
            <SheetTitle>Job Details</SheetTitle>
          </SheetHeader>
          {selectedJob && <JobDetailsView job={selectedJob} mobile />}
        </SheetContent>
      </Sheet>

      {/* Filters Dialog */}
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
                      .filter((s) => s)
                  )
                }
              />
            </div>

            {/* Salary Min */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Salary</label>
              <Input
                type="number"
                placeholder="e.g. 80000"
                value={filterSalaryMin}
                onChange={(e) => setFilterSalaryMin(e.target.value)}
              />
            </div>

            {/* Salary Max */}
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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="salary-high">Highest Salary</SelectItem>
                  <SelectItem value="salary-low">Lowest Salary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Per Page */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Results Per Page</label>
              <Select value={String(limit)} onValueChange={(v) => setLimit(parseInt(v))}>
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
                onChange={(e) => setPage(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setSearchTitle("");
                setSearchLocation("");
                setFilterSkills([]);
                setFilterSalaryMin("");
                setFilterSalaryMax("");
                setSortBy("recent");
              }}
            >
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
              className={`flex flex-wrap items-center gap-3 ${mobile ? "text-xs" : "text-sm"} text-muted-foreground`}
            >
              <span className="font-medium">{job.company}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {job.type}
              </div>
              <span>•</span>
              <span>Posted {job.postedDays} days ago</span>
            </div>
          </div>
          {!mobile && (
            <div className="flex gap-2 flex-shrink-0">
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

      {/* Key Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-1">SALARY</p>
          <p className="font-bold">
            ${(job.salary / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-1">EXPERIENCE</p>
          <p className="font-bold">{job.experience}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-1">APPLICANTS</p>
          <p className="font-bold flex items-center gap-1">
            <Users className="w-4 h-4" />
            {job.applicants}
          </p>
        </Card>
      </div>

      {/* About */}
      <div>
        <h2 className={`font-bold mb-3 ${mobile ? "text-lg" : "text-xl"}`}>About the role</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{job.about}</p>
      </div>

      {/* Responsibilities */}
      <div>
        <h2 className={`font-bold mb-3 ${mobile ? "text-lg" : "text-xl"}`}>Responsibilities</h2>
        <ul className="space-y-2">
          {job.responsibilities.map((resp, idx) => (
            <li key={idx} className="flex gap-3 text-sm text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>{resp}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Skills */}
      <div>
        <h2 className={`font-bold mb-3 ${mobile ? "text-lg" : "text-xl"}`}>Required skills</h2>
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <Badge key={skill} className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Remote Friendly */}
      {job.remoteFriendly && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Remote-friendly</p>
              <p className="text-xs text-muted-foreground">Worldwide applicants welcome</p>
            </div>
          </div>
        </Card>
      )}

      {/* Deadline */}
      <Card className="p-4 bg-orange-50 border-orange-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Application deadline</p>
            <p className="text-xs text-muted-foreground">{job.deadline}</p>
          </div>
        </div>
      </Card>

      {/* CTA Buttons */}
      <div className="space-y-2">
        <Button className="w-full bg-primary hover:bg-primary/90">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Apply now
        </Button>
        <Button variant="outline" className="w-full">
          <MessageSquare className="w-4 h-4 mr-2" />
          Message recruiter
        </Button>
      </div>
    </div>
  );
}

export default Jobs;
