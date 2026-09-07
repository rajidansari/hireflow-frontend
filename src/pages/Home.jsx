import useAuthStore from "@/store/authStore";
import { Link, Navigate } from "react-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  CircleUserRound,
  Compass,
  Heart,
  MapPin,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const categories = [
  { name: "Technology", count: "4,820", icon: "</>" },
  { name: "Design & Creative", count: "1,260", icon: "✦" },
  { name: "Marketing", count: "2,140", icon: "▥" },
  { name: "Healthcare", count: "980", icon: "♧" },
];

const companies = [
  {
    name: "Northstar Labs",
    role: "Technology · 42 open roles",
    icon: "N",
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Apex Studio",
    role: "Design · 19 open roles",
    icon: "A",
    color: "bg-amber-100 text-amber-600",
  },
  {
    name: "Vertex Health",
    role: "Healthcare · 26 open roles",
    icon: "V",
    color: "bg-sky-100 text-sky-600",
  },
  {
    name: "Pulse Finance",
    role: "Finance · 31 open roles",
    icon: "P",
    color: "bg-purple-100 text-purple-600",
  },
];

const Home = () => {
  const isAuthenticated = useAuthStore((state) => state.accessToken !== null);

  return isAuthenticated ? <Navigate to={"/jobs"} replace /> : <LandingPage />;
};

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 lg:px-6">
          <a href="#top" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <BriefcaseBusiness className="size-4" />
            </span>
            HireFlow
          </a>

          <div className="flex items-center gap-2">
            <Link to={"login"}>
              <Button
                variant="ghost"
                size="sm"
                className="hidden text-xs sm:inline-flex cursor-pointer"
              >
                Sign in
              </Button>
            </Link>
            <Link to={"register"}>
              <Button size="sm" className="text-xs cursor-pointer">
                Post a job <ArrowRight className="ml-1 size-3" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="border-b bg-[linear-gradient(110deg,oklch(1_0_0)_0%,oklch(.98_.01_250)_55%,oklch(.95_.025_235)_100%)]">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1fr_390px] lg:items-center lg:px-6 lg:py-20">
            <div>
              <Badge
                variant="secondary"
                className="mb-5 gap-1 rounded-full px-3 py-1 text-[11px] font-medium text-primary"
              >
                <Sparkles className="size-3" /> Find work that moves you forward
              </Badge>
              <h1 className="max-w-xl text-balance text-4xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                Your next great opportunity starts here.
              </h1>
              <p className="mt-5 max-w-lg text-pretty text-sm leading-6 text-muted-foreground">
                Discover meaningful work at ambitious companies. Search thousands of roles and find
                the one that fits your future.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to={"/jobs"}>
                  <Button className="cursor-pointer">
                    Explore jobs <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link to={"/login"}>
                  <Button variant="outline" className={`cursor-pointer`}>
                    For employers
                  </Button>
                </Link>
              </div>
            </div>
            <Card className="overflow-hidden border-primary/10 bg-background p-4 shadow-lg shadow-primary/5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium">Recommended for you</p>
                  <p className="text-[9px] text-muted-foreground">Based on your profile</p>
                </div>
                <Heart className="size-4 text-muted-foreground" />
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/[.03] p-3">
                <div className="flex items-start gap-3">
                  <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Compass className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold">Senior Product Designer</p>
                    <p className="text-[10px] text-muted-foreground">Apex Studio · Remote</p>
                  </div>
                  <Heart className="ml-auto size-3 text-muted-foreground" />
                </div>
              </div>
              <div className="mt-2 rounded-lg border p-3">
                <div className="flex items-start gap-3">
                  <span className="flex size-8 items-center justify-center rounded-md bg-muted">
                    <CodeIcon />
                  </span>
                  <div>
                    <p className="text-xs font-semibold">Frontend Engineer</p>
                    <p className="text-[10px] text-muted-foreground">Northstar Labs · Hybrid</p>
                  </div>
                  <Heart className="ml-auto size-3 text-muted-foreground" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-[10px] text-muted-foreground">
                <span>12,480 new jobs this week</span>
                <ArrowRight className="size-3 text-primary" />
              </div>
            </Card>
          </div>
        </section>

        <section id="jobs" className="mx-auto max-w-6xl px-4 py-6 lg:px-6">
          <Card className="grid gap-3 p-3 shadow-md sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <SearchField
              label="WHAT ARE YOU LOOKING FOR?"
              placeholder="Job title, keyword, or company"
              icon={<Search className="size-3" />}
            />
            <SearchField
              label="WHERE?"
              placeholder="City, state, or remote"
              icon={<MapPin className="size-3" />}
            />
            <Button className="h-10">
              Search jobs <ArrowRight className="ml-1 size-3" />
            </Button>
          </Card>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
          <SectionHeading eyebrow="EXPLORE OPPORTUNITIES" title="Popular job categories" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {categories.map((category) => (
              <Card key={category.name} className="p-4 transition-shadow hover:shadow-md">
                <span className="mb-4 flex size-8 items-center justify-center rounded-md bg-primary/10 font-mono text-xs text-primary">
                  {category.icon}
                </span>
                <p className="text-xs font-semibold">{category.name}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-5 lg:px-6">
          <div className="flex flex-col gap-5 rounded-xl bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/20 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Ready to find your next role?</h2>
              <p className="mt-1 text-xs text-primary-foreground/75">
                Create your profile and let the right opportunities come to you.
              </p>
            </div>
            <Link to={"/login"}>
              <Button variant="secondary" size="sm" className="w-fit cursor-pointer">
                Create free profile <ArrowRight className="ml-1 size-3" />
              </Button>
            </Link>
          </div>
        </section>

        <section id="companies" className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
          <SectionHeading eyebrow="BUILD YOUR FUTURE" title="Featured companies" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {companies.map((company) => (
              <Card key={company.name} className="p-4">
                <div
                  className={`mb-5 flex size-8 items-center justify-center rounded-md font-bold ${company.color}`}
                >
                  {company.icon}
                </div>
                <p className="text-xs font-semibold">{company.name}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{company.role}</p>
                <div className="mt-4 flex items-center gap-1 text-[9px] text-muted-foreground">
                  <MapPin className="size-3" /> Remote-first team
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-primary/5">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:px-6">
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-primary">Why HireFlow</p>
              <h2 className="mt-2 max-w-sm text-2xl font-bold leading-tight tracking-tight">
                A simpler way to move your career forward.
              </h2>
              <p className="mt-3 max-w-lg text-xs leading-5 text-muted-foreground">
                Everything you need to discover better work, connect with great teams, and make your
                next move with confidence.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Stat icon={<BriefcaseBusiness />} value="48K+" label="Open positions" />
              <Stat icon={<Building2 />} value="3,200+" label="Hiring companies" />
              <Stat icon={<UsersRound />} value="92%" label="Candidate satisfaction" />
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="border-t">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:grid-cols-[1fr_auto_auto_auto] lg:px-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="flex size-6 items-center justify-center rounded bg-primary text-primary-foreground">
                <BriefcaseBusiness className="size-3" />
              </span>
              HireFlow
            </div>
            <p className="mt-3 max-w-xs text-[10px] leading-4 text-muted-foreground">
              Find meaningful work and build the future with companies that care.
            </p>
          </div>
          <FooterColumn
            title="For job seekers"
            items={["Find jobs", "Explore companies", "Create a profile"]}
          />
          <FooterColumn title="Company" items={["About", "Careers", "Help center"]} />
          <FooterColumn title="Resources" items={["Privacy", "Terms", "Contact us"]} />
        </div>
      </footer>
    </div>
  );
}

function CodeIcon() {
  return <span className="font-mono text-[10px]">&lt;/&gt;</span>;
}
function SearchField({ label, placeholder, icon }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[9px] font-semibold tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="relative">
        <span className="absolute left-3 top-3 text-muted-foreground">{icon}</span>
        <Input className="h-10 pl-8 text-xs" placeholder={placeholder} />
      </div>
    </label>
  );
}
function SectionHeading({ eyebrow, title, link }) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <div>
        <p className="text-[9px] font-semibold tracking-widest text-primary">{eyebrow}</p>
        <h2 className="mt-1 text-lg font-bold tracking-tight">{title}</h2>
      </div>
      <a href="#jobs" className="flex items-center text-[10px] font-medium text-primary">
        {link}
        <ChevronRight className="ml-1 size-3" />
      </a>
    </div>
  );
}
function Stat({ icon, value, label }) {
  return (
    <Card className="p-3">
      <span className="text-primary [&>svg]:size-3">{icon}</span>
      <p className="mt-2 text-sm font-bold">{value}</p>
      <p className="mt-1 text-[9px] text-muted-foreground">{label}</p>
    </Card>
  );
}
function FooterColumn({ title, items }) {
  return (
    <div>
      <p className="text-[10px] font-semibold">{title}</p>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <a
            key={item}
            href="#top"
            className="block text-[10px] text-muted-foreground hover:text-foreground"
          >
            {item}
          </a>
        ))}
      </div>
    </div>
  );
}

export default Home;
