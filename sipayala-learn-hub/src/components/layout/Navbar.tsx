import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu, X, ChevronDown, Bell, Search, User, BookOpen, Users,
  Calendar, Award, HelpCircle, LogOut, Settings, BarChart3,
  FileText, LogIn, UserPlus, Briefcase, Mail, Lock, Eye, EyeOff,
  Github, Loader2, CheckCircle2, AlertCircle, ArrowRight,
  AlertTriangle, Zap, GraduationCap, PlayCircle, ChevronRight,
  TrendingUp, Star, Clock, Flame, Globe, Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const API_BASE = "https://sipalaya-lms-professional-learning.onrender.com/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserData {
  id: number; email: string; full_name: string; role: string;
  avatar?: string; enrolled_courses?: number;
}
interface User { name: string; email: string; avatar: string; role: string; enrolledCourses: number; }
interface AuthState { isAuthenticated: boolean; user: User | null; }

// ─── API Types ────────────────────────────────────────────────────────────────
interface APICourse {
  id: number;
  title: string;
  slug: string;
  short_description?: string;
  students_count: number;
  rating: number | string;
  duration_hours?: number;
  thumbnail?: string;
  is_popular?: boolean;
  is_featured?: boolean;
  badge?: string;
  category?: { name: string; slug: string };
}

interface APICategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  course_count?: number;
}

interface SearchResult {
  id: number;
  title: string;
  slug: string;
  short_description?: string;
  rating: number | string;
  students_count: number;
  thumbnail?: string;
  category?: { name: string };
}

// ─── Category icon map ────────────────────────────────────────────────────────
// Ordered from most-specific to least-specific so the first match wins.
// Both slug AND name are searched (lowercased + joined) for maximum coverage.
const CATEGORY_ICON_MAP: Array<[string, string]> = [
  // AI / ML / Brain
  ["artificial-intelligence", "🤖"], ["artificial intelligence", "🤖"],
  ["machine-learning", "🤖"],        ["machine learning", "🤖"],
  ["deep-learning", "🧠"],           ["deep learning", "🧠"],
  ["brain", "🧠"],                   ["neural", "🧠"],
  ["nlp", "🗣️"],                    ["natural-language", "🗣️"],
  ["generative", "✨"],              ["llm", "✨"],
  // Data
  ["data-science", "📊"],            ["data science", "📊"],
  ["data-analytics", "📈"],          ["analytics", "📈"],
  ["data-engineering", "🔧"],        ["data engineering", "🔧"],
  ["database", "🗄️"],               ["sql", "🗄️"],
  ["big-data", "🗄️"],               ["big data", "🗄️"],
  ["data", "📊"],
  // Development
  ["web-development", "🌐"],         ["web development", "🌐"],
  ["mobile", "📱"],                  ["android", "📱"],       ["ios", "📱"],
  ["react", "⚛️"],                   ["frontend", "🖥️"],
  ["backend", "⚙️"],                 ["api", "⚙️"],
  ["fullstack", "💻"],               ["full-stack", "💻"],
  ["development", "💻"],             ["programming", "💻"],    ["dev", "💻"],
  ["python", "🐍"],                  ["javascript", "🟨"],
  ["java", "☕"],
  // DevOps / Cloud
  ["devops", "🚀"],                  ["cloud", "☁️"],
  ["aws", "☁️"],                     ["azure", "☁️"],
  ["docker", "🐳"],                  ["kubernetes", "⛵"],
  ["it-cloud", "☁️"],               ["infrastructure", "🏗️"],
  // Design
  ["ui-ux", "🎨"],                   ["ux", "🎨"],            ["design", "🎨"],
  ["graphic", "🖌️"],                ["figma", "🎨"],
  // Business / Finance
  ["entrepreneurship", "🚀"],        ["startup", "🚀"],
  ["management", "📋"],              ["leadership", "👥"],
  ["finance", "💰"],                 ["accounting", "💰"],
  ["business", "💼"],
  // Marketing
  ["digital-marketing", "📣"],       ["digital marketing", "📣"],
  ["seo", "🔍"],                     ["social-media", "📱"],
  ["marketing", "📣"],               ["content", "✍️"],
  // Security
  ["cybersecurity", "🔒"],           ["cyber security", "🔒"],
  ["security", "🔒"],                ["ethical-hacking", "🔓"],
  // Other tech
  ["blockchain", "⛓️"],             ["cryptocurrency", "₿"],
  ["game", "🎮"],                    ["ar-vr", "🥽"],
  ["robotics", "🦾"],               ["iot", "📡"],
  ["networking", "🌐"],              ["linux", "🐧"],
  // Soft skills / other
  ["communication", "💬"],          ["writing", "✍️"],
  ["photography", "📷"],             ["video", "🎥"],
  ["music", "🎵"],                   ["language", "🗣️"],
  ["health", "🏥"],                  ["science", "🔬"],
  ["math", "📐"],
];

const getCategoryIcon = (slug: string, name: string): string => {
  const haystack = (slug + " " + name).toLowerCase();
  for (const [keyword, emoji] of CATEGORY_ICON_MAP) {
    if (haystack.includes(keyword)) return emoji;
  }
  return "📚";
};

/**
 * resolveIcon — use this everywhere instead of `cat.icon || getCategoryIcon(...)`.
 *
 * The backend `icon` field may contain:
 *   • a real emoji like "🧠"          → use it directly
 *   • a keyword like "brain", "ai"    → look it up in CATEGORY_ICON_MAP
 *   • null / undefined / empty string → fall back to slug+name lookup
 */
const resolveIcon = (icon: string | undefined, slug: string, name: string): string => {
  if (!icon) return getCategoryIcon(slug, name);

  // An emoji is at most 2 code-points and the first one is > 0xFF
  // (all emoji start above the basic ASCII/Latin range).
  // If the field already looks like an emoji, trust it.
  const firstCP = icon.codePointAt(0) ?? 0;
  if (firstCP > 0xFF && icon.trim().length <= 4) return icon.trim();

  // Otherwise treat it as a keyword — search the map against the value
  const keyword = icon.trim().toLowerCase();
  for (const [k, emoji] of CATEGORY_ICON_MAP) {
    if (keyword === k || keyword.includes(k) || k.includes(keyword)) return emoji;
  }

  // Final fallback: try slug+name
  return getCategoryIcon(slug, name);
};

const formatCount = (n: number) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
};

const getBadgeForCourse = (course: APICourse): { badge: string | null; badgeColor: string } => {
  if (course.badge) return { badge: course.badge, badgeColor: "bg-[#F2C94C] text-[#1a1a2e]" };
  if (course.is_popular) return { badge: "Popular", badgeColor: "bg-orange-500 text-white" };
  if (course.is_featured) return { badge: "Featured", badgeColor: "bg-violet-500 text-white" };
  return { badge: null, badgeColor: "" };
};

// ─── Static data ──────────────────────────────────────────────────────────────
const RESOURCES = [
  { icon: FileText,   label: "Blog & Articles",  desc: "Tech insights & tutorials",  path: "/blog"      },
  { icon: PlayCircle, label: "Free Tutorials",    desc: "Handpicked video content",   path: "/tutorials" },
  { icon: Users,      label: "Community",         desc: "30,000+ active learners",    path: "/community" },
  { icon: Calendar,   label: "Webinars",          desc: "Live expert sessions",       path: "/webinars"  },
  { icon: Globe,      label: "Documentation",     desc: "Guides & references",        path: "/docs"      },
];

const NOTIFICATIONS = [
  { id: 1, icon: "📝", title: "New assignment posted",      sub: "React Hooks – Module 4",     time: "2m",  unread: true  },
  { id: 2, icon: "🏆", title: "Certificate ready",         sub: "Python Fundamentals",        time: "1h",  unread: true  },
  { id: 3, icon: "🎥", title: "Webinar starts in 30 min",  sub: "AI & Machine Learning Live", time: "3h",  unread: false },
  { id: 4, icon: "💬", title: "New reply on your post",    sub: "Django REST API thread",     time: "5h",  unread: false },
];

const USER_MENU = [
  { icon: User,       label: "My Profile",   path: "/profile",     group: 1 },
  { icon: BookOpen,   label: "My Learning",  path: "/my-learning", group: 1 },
  { icon: Award,      label: "Certificates", path: "/certificates",group: 1 },
  { icon: BarChart3,  label: "Progress",     path: "/analytics",   group: 2 },
  { icon: Calendar,   label: "Schedule",     path: "/schedule",    group: 2 },
  { icon: Settings,   label: "Settings",     path: "/settings",    group: 3 },
  { icon: HelpCircle, label: "Help & Support", path: "/help",      group: 3 },
];

const NAV_LINKS = [
  { label: "Courses",     type: "mega" as const },
  { label: "My Team", type: "link" as const, path: "/team" },
  { label: "Resources",   type: "dropdown" as const },
  { label: "Events",      type: "link" as const, path: "/events"      },
  { label: "Enterprise",  type: "link" as const, path: "/enterprise"  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const Navbar = () => {
  // UI state
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [megaOpen, setMegaOpen]             = useState<string | null>(null);
  const [showAuth, setShowAuth]             = useState(false);
  const [authTab, setAuthTab]               = useState<"login" | "register">("login");
  const [searchFocused, setSearchFocused]   = useState(false);
  const [searchQuery, setSearchQuery]       = useState("");
  const [searchResults, setSearchResults]   = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading]   = useState(false);
  const [showSearchDrop, setShowSearchDrop] = useState(false);

  // Dynamic data state
  const [featuredCourses, setFeaturedCourses] = useState<APICourse[]>([]);
  const [categories, setCategories]           = useState<APICategory[]>([]);
  const [coursesLoading, setCoursesLoading]   = useState(true);
  const [catsLoading, setCatsLoading]         = useState(true);

  // Auth state
  const [loading, setLoading]               = useState(false);
  const [refreshTimer, setRefreshTimer]     = useState<NodeJS.Timeout | null>(null);
  const [loginError, setLoginError]         = useState<string | null>(null);
  const [regErrors, setRegErrors]           = useState<Record<string, string>>({});
  const [pwValue, setPwValue]               = useState("");
  const [confirmPw, setConfirmPw]           = useState("");
  const [showPw, setShowPw]                 = useState({ login: false, reg: false, conf: false });
  const [pwStrength, setPwStrength]         = useState({ score: 0, label: "", w: "0%" });
  const [authState, setAuthState]           = useState<AuthState>({ isAuthenticated: false, user: null });

  // Ref + state for mega menu positioning (fixed to viewport)
  const megaTriggerRef = useRef<HTMLDivElement>(null);
  const [megaStyle, setMegaStyle] = useState<React.CSSProperties>({});

  // Recalculate whenever menu opens or window resizes
  useEffect(() => {
    const calculate = () => {
      if (!megaTriggerRef.current) return;
      const GUTTER  = 16;
      const PANEL_W = Math.min(680, window.innerWidth - GUTTER * 2);
      const rect    = megaTriggerRef.current.getBoundingClientRect();
      // Bottom of the trigger button (where the panel should appear)
      const top     = rect.bottom;
      // Ideal: centre under trigger
      let left = rect.left + rect.width / 2 - PANEL_W / 2;
      // Clamp: never go off left or right edge
      left = Math.max(GUTTER, Math.min(left, window.innerWidth - GUTTER - PANEL_W));
      setMegaStyle({
        position: "fixed",
        top,
        left,
        width: PANEL_W,
        zIndex: 9999,
        paddingTop: 12,
      });
    };

    if (megaOpen === "courses") {
      calculate();
      window.addEventListener("resize",  calculate, { passive: true });
      window.addEventListener("scroll",  calculate, { passive: true });
    }
    return () => {
      window.removeEventListener("resize", calculate);
      window.removeEventListener("scroll", calculate);
    };
  }, [megaOpen]);

  const pwMatch    = confirmPw ? pwValue === confirmPw : null;
  const unreadCnt  = NOTIFICATIONS.filter(n => n.unread).length;
  const location   = useLocation();
  const navigate   = useNavigate();
  const searchRef  = useRef<HTMLInputElement>(null);
  const navRef     = useRef<HTMLElement>(null);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const { toast }  = useToast();

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  // ── Fetch categories ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCategories = async () => {
      setCatsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/courses/categories/`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        const items: APICategory[] = Array.isArray(data) ? data : (data.results ?? []);
        setCategories(items);
      } catch {
        // silently fail
      } finally {
        setCatsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // ── Fetch featured/popular courses for mega menu ──────────────────────────
  useEffect(() => {
    const fetchCourses = async () => {
      setCoursesLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/courses/courses/?featured=true&page_size=6`,
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        let items: APICourse[] = Array.isArray(data) ? data : (data.results ?? []);

        if (items.length < 3) {
          const popRes = await fetch(
            `${API_BASE}/courses/courses/?popular=true&page_size=6`,
            { headers: { Accept: "application/json" } }
          );
          if (popRes.ok) {
            const popData = await popRes.json();
            const popItems: APICourse[] = Array.isArray(popData) ? popData : (popData.results ?? []);
            const existingIds = new Set(items.map(c => c.id));
            items = [...items, ...popItems.filter(c => !existingIds.has(c.id))];
          }
        }

        if (items.length === 0) {
          const latestRes = await fetch(
            `${API_BASE}/courses/courses/?page_size=6`,
            { headers: { Accept: "application/json" } }
          );
          if (latestRes.ok) {
            const latestData = await latestRes.json();
            items = Array.isArray(latestData) ? latestData : (latestData.results ?? []);
          }
        }

        setFeaturedCourses(items.slice(0, 6));
      } catch {
        // silently fail
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // ── Live search with debounce ─────────────────────────────────────────────
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchDrop(false);
      return;
    }

    searchDebounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      setShowSearchDrop(true);
      try {
        const res = await fetch(
          `${API_BASE}/courses/courses/?search=${encodeURIComponent(searchQuery.trim())}&page_size=5`,
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        const items: SearchResult[] = Array.isArray(data) ? data : (data.results ?? []);
        setSearchResults(items);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 350);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery]);

  // ── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setMegaOpen(null); }, [location.pathname]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMegaOpen(null);
        setShowSearchDrop(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // ── Password strength ────────────────────────────────────────────────────
  const calcStrength = (p: string) => {
    setPwValue(p);
    let s = 0;
    if (p.length >= 8) s++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^a-zA-Z0-9]/.test(p)) s++;
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    const widths  = ["0%", "25%", "50%", "75%", "100%"];
    setPwStrength({ score: s, label: labels[s] ?? "", w: widths[s] ?? "0%" });
  };

  // ── API helpers ──────────────────────────────────────────────────────────
  const refreshAccessToken = async (): Promise<boolean> => {
    const rt = localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
    if (!rt) return false;
    try {
      const r = await fetch(`${API_BASE}/accounts/token/refresh/`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: rt }),
      });
      const d = await r.json();
      if (r.ok && d.access) {
        (localStorage.getItem("refreshToken") ? localStorage : sessionStorage).setItem("accessToken", d.access);
        return true;
      }
      return false;
    } catch { return false; }
  };

  const fetchUserDetails = async (token: string) => {
    try {
      const r = await fetch(`${API_BASE}/accounts/users/me/`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!r.ok) throw new Error();
      const u: UserData = await r.json();
      setAuthState({
        isAuthenticated: true,
        user: {
          name: u.full_name || u.email.split("@")[0],
          email: u.email, avatar: u.avatar || "",
          role: u.role || "Student", enrolledCourses: u.enrolled_courses || 0,
        },
      });
      toast({ title: "Welcome back 👋", description: `Signed in as ${u.full_name || u.email}`, duration: 3000 });
    } catch {
      setAuthState({ isAuthenticated: true, user: { name: "User", email: "", avatar: "", role: "Student", enrolledCourses: 0 } });
    }
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
      if (!token) return;
      setLoading(true);
      try { await fetchUserDetails(token); }
      catch {
        if (await refreshAccessToken()) {
          const t = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
          if (t) await fetchUserDetails(t);
        } else {
          ["accessToken","refreshToken"].forEach(k => { localStorage.removeItem(k); sessionStorage.removeItem(k); });
        }
      } finally { setLoading(false); }
    };
    init();
  }, []);

  useEffect(() => {
    if (!authState.isAuthenticated) return;
    const t = setInterval(async () => {
      if (!await refreshAccessToken()) {
        handleLogout();
        toast({ title: "Session expired", description: "Please sign in again.", variant: "destructive" });
      }
    }, 4 * 60 * 1000);
    setRefreshTimer(t);
    return () => clearInterval(t);
  }, [authState.isAuthenticated]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleLogout = () => {
    if (!window.confirm("Sign out of your account?")) return;
    ["accessToken","refreshToken"].forEach(k => { localStorage.removeItem(k); sessionStorage.removeItem(k); });
    if (refreshTimer) { clearInterval(refreshTimer); setRefreshTimer(null); }
    setAuthState({ isAuthenticated: false, user: null });
    toast({ title: "Signed out", description: "See you soon!" });
    navigate("/");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setLoginError(null);
    const fd = new FormData(e.target as HTMLFormElement);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    const remember = fd.get("remember") === "on";
    if (!email || !password) { setLoginError("Please fill in all fields."); setLoading(false); return; }
    try {
      const r = await fetch(`${API_BASE}/accounts/login/`, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d = await r.json();
      if (!r.ok) { setLoginError(d.non_field_errors?.[0] || d.detail || "Invalid email or password."); setLoading(false); return; }
      const store = remember ? localStorage : sessionStorage;
      store.setItem("accessToken", d.access); store.setItem("refreshToken", d.refresh);
      await fetchUserDetails(d.access);
      setShowAuth(false); (e.target as HTMLFormElement).reset();
    } catch { setLoginError("Unable to connect. Check your internet connection."); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const pw = fd.get("password") as string;
    const cp = fd.get("confirmPassword") as string;
    if (pw !== cp) { toast({ title: "Passwords don't match", variant: "destructive" }); return; }
    if (!fd.get("terms")) { toast({ title: "Please accept the Terms of Service", variant: "destructive" }); return; }
    setLoading(true); setRegErrors({});
    try {
      const r = await fetch(`${API_BASE}/accounts/users/`, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: fd.get("email"), password: pw,
          full_name: `${fd.get("firstName")} ${fd.get("lastName")}`.trim(),
          role: "STUDENT",
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        const errs: Record<string, string> = {};
        ["email","full_name","password","non_field_errors"].forEach(k => { if (d[k]) errs[k] = Array.isArray(d[k]) ? d[k][0] : d[k]; });
        setRegErrors(errs);
        toast({ title: "Registration failed", description: errs[Object.keys(errs)[0]], variant: "destructive" });
        setLoading(false); return;
      }
      toast({ title: "Account created! 🎉", description: "You can now sign in.", duration: 5000 });
      setShowAuth(false); setPwValue(""); setConfirmPw("");
      setTimeout(() => { setAuthTab("login"); setShowAuth(true); }, 600);
    } catch { toast({ title: "Connection error", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setSearchQuery("");
      setSearchFocused(false);
      setShowSearchDrop(false);
    }
  };

  const handleSearchResultClick = (slug: string) => {
    navigate(`/courses/${slug}`);
    setSearchQuery("");
    setShowSearchDrop(false);
    setSearchFocused(false);
  };

  // ─── Skeleton loader component ────────────────────────────────────────────
  const CourseSkeleton = () => (
    <div className="flex flex-col gap-2 p-4 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-slate-200" />
      <div className="h-3 bg-slate-200 rounded w-3/4" />
      <div className="h-2.5 bg-slate-100 rounded w-1/2" />
    </div>
  );

  const CategorySkeleton = () => (
    <div className="h-7 w-24 bg-white/20 rounded-lg animate-pulse" />
  );



  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ══════════════ ANNOUNCEMENT STRIP */}
      <div
        className="w-full text-center py-[9px] px-4 text-[11.5px] font-medium tracking-wide relative z-50"
        style={{ background: "hsl(var(--color-charcoal))", color: "rgba(255,255,255,0.85)" }}
      >
        🎓 New batch starting{" "}
        <span className="font-bold text-white">Feb 10, 2025</span>
        {" "}— Only 12 seats left.{" "}
        <Link
          to="/courses"
          className="font-bold underline underline-offset-2 hover:text-[#F2C94C] transition-colors"
          style={{ color: "#F2C94C" }}
        >
          Reserve your seat →
        </Link>
      </div>

      {/* ══════════════ MAIN NAVBAR */}
      <header
        ref={navRef}
        className={`sticky top-0 z-40 w-full transition-shadow duration-200 ${
          scrolled ? "shadow-[0_1px_0_0_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.06)]" : ""
        }`}
        style={{ background: "hsl(var(--color-charcoal))" }}
      >
        {/* ── Top bar ─────────────────────────────────────────────────── */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
          <div className="flex items-center gap-2 sm:gap-3 h-[58px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                style={{ background: "var(--gradient-accent)" }}
              >
                <GraduationCap className="w-[17px] h-[17px]" style={{ color: "hsl(var(--color-charcoal))" }} />
              </div>
              <div className="leading-none hidden sm:block">
                <span
                  className="block text-[15px] font-bold tracking-tight text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Sipalaya
                </span>
                <span className="block text-[9px] font-semibold tracking-[0.2em] uppercase mt-[1px]" style={{ color: "#F2C94C" }}>
                  Info Tech
                </span>
              </div>
            </Link>

            {/* Search bar with live dropdown — only on xl+ to avoid overflow */}
            <div className="flex-1 min-w-0 max-w-sm xl:max-w-lg hidden xl:block relative">
              <form onSubmit={handleSearch}>
                <div className={`flex items-center h-[38px] bg-white rounded-lg overflow-hidden transition-all duration-150 ${
                  searchFocused ? "ring-2 ring-[#F2C94C]" : "ring-1 ring-white/10 hover:ring-white/30"
                }`}>
                  <Search className="w-4 h-4 text-slate-400 flex-shrink-0 ml-3.5" />
                  <input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => { setSearchFocused(true); if (searchQuery.trim().length >= 2) setShowSearchDrop(true); }}
                    onBlur={() => setTimeout(() => { setSearchFocused(false); setShowSearchDrop(false); }, 200)}
                    placeholder="Search for courses, skills, instructors…"
                    className="flex-1 h-full px-3 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
                    style={{ fontFamily: "var(--font-sans)" }}
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => { setSearchQuery(""); setShowSearchDrop(false); }}
                      className="mr-1 p-1 text-slate-400 hover:text-slate-600 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button type="submit"
                    className="h-full px-4 text-[12px] font-semibold border-l border-slate-100 text-slate-600 hover:bg-slate-50 transition-colors flex-shrink-0"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Live search dropdown */}
              <AnimatePresence>
                {showSearchDrop && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200/80 overflow-hidden z-50"
                  >
                    {searchLoading ? (
                      <div className="flex items-center justify-center gap-2 py-5 text-[13px] text-slate-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Searching…
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="py-5 text-center text-[13px] text-slate-400">
                        No courses found for "<span className="font-semibold text-slate-600">{searchQuery}</span>"
                      </div>
                    ) : (
                      <>
                        <div className="px-3 pt-2.5 pb-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="divide-y divide-slate-50">
                          {searchResults.map(result => (
                            <button
                              key={result.id}
                              type="button"
                              onMouseDown={() => handleSearchResultClick(result.slug)}
                              className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-slate-50 transition-colors text-left"
                            >
                              {result.thumbnail ? (
                                <img src={result.thumbnail} alt={result.title}
                                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-slate-100" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                  <BookOpen className="w-4 h-4 text-slate-400" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-semibold text-slate-800 truncate" style={{ fontFamily: "var(--font-display)" }}>
                                  {result.title}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {result.category && (
                                    <span className="text-[11px] text-slate-400">{result.category.name}</span>
                                  )}
                                  {result.rating && (
                                    <>
                                      <span className="text-[11px] text-slate-300">·</span>
                                      <span className="flex items-center gap-0.5 text-[11px] text-amber-500 font-semibold">
                                        <Star className="w-2.5 h-2.5 fill-amber-500" />
                                        {Number(result.rating).toFixed(1)}
                                      </span>
                                    </>
                                  )}
                                  {result.students_count > 0 && (
                                    <>
                                      <span className="text-[11px] text-slate-300">·</span>
                                      <span className="text-[11px] text-slate-400">{formatCount(result.students_count)} students</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                            </button>
                          ))}
                        </div>
                        <div className="border-t border-slate-100 p-2">
                          <button
                            type="button"
                            onMouseDown={() => { navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`); setSearchQuery(""); setShowSearchDrop(false); }}
                            className="flex items-center justify-center gap-1.5 w-full py-2 text-[12px] font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                            style={{ color: "hsl(var(--color-indigo-purple))", fontFamily: "var(--font-sans)" }}
                          >
                            See all results for "{searchQuery}" <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-0.5 ml-auto xl:ml-1">
              {NAV_LINKS.map(item => {
                if (item.type === "link") return (
                  <Link key={item.label} to={item.path!}
                    className={`px-3 py-2 text-[13px] font-medium rounded-md transition-colors duration-150 ${
                      isActive(item.path!)
                        ? "text-[#F2C94C]"
                        : "text-white/75 hover:text-white hover:bg-white/8"
                    }`}
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {item.label}
                  </Link>
                );

                if (item.type === "mega") return (
                  <div key={item.label} className="relative" ref={megaTriggerRef}>
                    <button
                      onMouseEnter={() => setMegaOpen("courses")}
                      onMouseLeave={() => setMegaOpen(null)}
                      onClick={() => setMegaOpen(v => v === "courses" ? null : "courses")}
                      className={`flex items-center gap-1 px-3 py-2 text-[13px] font-medium rounded-md transition-colors duration-150 ${
                        megaOpen === "courses" ? "text-[#F2C94C] bg-white/8" : "text-white/75 hover:text-white hover:bg-white/8"
                      }`}
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {item.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 opacity-70 ${megaOpen === "courses" ? "rotate-180" : ""}`} />
                    </button>

                    {/* ── MEGA MENU — fixed to viewport, never overflows ── */}
                    <AnimatePresence>
                      {megaOpen === "courses" && Object.keys(megaStyle).length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          onMouseEnter={() => setMegaOpen("courses")}
                          onMouseLeave={() => setMegaOpen(null)}
                          style={megaStyle}
                        >
                          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden">
                            {/* Header row */}
                            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                              <div>
                                <p className="text-[13px] font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                                  {featuredCourses.length > 0 ? "Most Popular Courses" : "Explore Courses"}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Trusted by 12,000+ students in Nepal</p>
                              </div>
                              <Link to="/courses"
                                className="flex items-center gap-1 text-[12px] font-semibold hover:underline transition-colors flex-shrink-0 ml-4"
                                style={{ color: "hsl(var(--color-indigo-purple))", fontFamily: "var(--font-sans)" }}
                              >
                                All courses <ChevronRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>

                            {/* Course grid */}
                            <div className="grid grid-cols-2 xl:grid-cols-3 gap-0 divide-x divide-slate-100">
                              {coursesLoading
                                ? Array.from({ length: 6 }).map((_, i) => <CourseSkeleton key={i} />)
                                : featuredCourses.length > 0
                                  ? featuredCourses.map(c => {
                                      const { badge, badgeColor } = getBadgeForCourse(c);
                                      return (
                                        <Link key={c.id} to={`/courses/${c.slug}`}
                                          className="flex flex-col gap-2 p-4 hover:bg-slate-50 transition-colors group border-b border-slate-100 last:border-b-0"
                                        >
                                          <div className="flex items-start justify-between gap-2">
                                            {c.thumbnail ? (
                                              <img src={c.thumbnail} alt={c.title}
                                                className="w-10 h-10 rounded-xl object-cover flex-shrink-0 bg-slate-100" />
                                            ) : (
                                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                                                {c.category ? getCategoryIcon(c.category.slug, c.category.name) : "📚"}
                                              </div>
                                            )}
                                            {badge && (
                                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${badgeColor}`}>
                                                {badge}
                                              </span>
                                            )}
                                          </div>
                                          <div>
                                            <p className="text-[12.5px] font-semibold text-slate-800 leading-snug group-hover:text-[hsl(var(--color-indigo-purple))] transition-colors line-clamp-2" style={{ fontFamily: "var(--font-display)" }}>
                                              {c.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                              {c.rating && (
                                                <span className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold">
                                                  <Star className="w-2.5 h-2.5 fill-amber-500" />{Number(c.rating).toFixed(1)}
                                                </span>
                                              )}
                                              {c.students_count > 0 && (
                                                <>
                                                  <span className="text-[10px] text-slate-400">·</span>
                                                  <span className="text-[10px] text-slate-500">{formatCount(c.students_count)} enrolled</span>
                                                </>
                                              )}
                                              {c.duration_hours && (
                                                <>
                                                  <span className="text-[10px] text-slate-400">·</span>
                                                  <span className="flex items-center gap-0.5 text-[10px] text-slate-500">
                                                    <Clock className="w-2.5 h-2.5" />{c.duration_hours}h
                                                  </span>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </Link>
                                      );
                                    })
                                  : (
                                    <div className="col-span-3 py-10 text-center text-[13px] text-slate-400">
                                      No courses available yet.{" "}
                                      <Link to="/courses" className="font-semibold" style={{ color: "hsl(var(--color-indigo-purple))" }}>
                                        Browse all →
                                      </Link>
                                    </div>
                                  )
                              }
                            </div>

                            {/* Category pills footer — dynamic */}
                            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Browse by:</span>
                              {catsLoading
                                ? Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-7 w-20 bg-slate-200 rounded-lg animate-pulse" />
                                  ))
                                : categories.length > 0
                                  ? categories.slice(0, 8).map(cat => (
                                      <Link key={cat.id} to={`/courses?category=${cat.slug}`}
                                        className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600 hover:border-[hsl(var(--color-indigo-purple)/0.4)] hover:text-[hsl(var(--color-indigo-purple))] hover:bg-indigo-50/50 transition-all"
                                        style={{ fontFamily: "var(--font-sans)" }}
                                      >
                                        <span>{resolveIcon(cat.icon, cat.slug, cat.name)}</span>
                                        {cat.name}
                                        {cat.course_count !== undefined && (
                                          <span className="text-[9px] text-slate-400 ml-0.5">({cat.course_count})</span>
                                        )}
                                      </Link>
                                    ))
                                  : null
                              }
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );

                if (item.type === "dropdown") return (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="flex items-center gap-1 px-3 py-2 text-[13px] font-medium text-white/75 hover:text-white hover:bg-white/8 rounded-md transition-colors duration-150 outline-none"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        {item.label}
                        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start" sideOffset={10}
                      className="w-[260px] p-2 rounded-xl shadow-2xl border border-slate-200/80 bg-white"
                    >
                      {RESOURCES.map(r => (
                        <DropdownMenuItem key={r.label} asChild>
                          <Link to={r.path}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-50 group transition-colors"
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                              style={{ background: "hsl(var(--color-indigo-purple)/0.08)" }}
                            >
                              <r.icon className="w-[15px] h-[15px]" style={{ color: "hsl(var(--color-indigo-purple))" }} />
                            </div>
                            <div>
                              <p className="text-[13px] font-semibold text-slate-800" style={{ fontFamily: "var(--font-display)" }}>{r.label}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5" style={{ fontFamily: "var(--font-sans)" }}>{r.desc}</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );

                return null;
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 ml-auto lg:ml-0">

              {/* Search icon — visible on mobile AND lg (when search bar is hidden below xl) */}
              <button
                className="xl:hidden w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
                onClick={() => { setMobileOpen(true); setTimeout(() => searchRef.current?.focus(), 100); }}
              >
                <Search className="w-4 h-4" />
              </button>

              {authState.isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="relative w-8 h-8 hidden lg:flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all">
                        <Bell className="w-4 h-4" />
                        {unreadCnt > 0 && (
                          <span
                            className="absolute top-1 right-1 w-[14px] h-[14px] flex items-center justify-center text-[8px] font-bold text-white rounded-full ring-[1.5px]"
                            style={{ background: "#F2C94C", color: "hsl(var(--color-charcoal))", ringColor: "hsl(var(--color-charcoal))" }}
                          >
                            {unreadCnt}
                          </span>
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={10} className="w-[340px] p-0 rounded-xl shadow-2xl border border-slate-200/80 overflow-hidden bg-white">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Notifications</span>
                          {unreadCnt > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "hsl(var(--color-indigo-purple))" }}>{unreadCnt} new</span>
                          )}
                        </div>
                        <button className="text-[11px] font-semibold hover:underline" style={{ color: "hsl(var(--color-indigo-purple))", fontFamily: "var(--font-sans)" }}>
                          Mark all read
                        </button>
                      </div>
                      <div className="divide-y divide-slate-50">
                        {NOTIFICATIONS.map(n => (
                          <div key={n.id} className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors ${n.unread ? "bg-blue-50/40" : ""}`}>
                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">{n.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-[13px] leading-snug ${n.unread ? "font-semibold text-slate-900" : "font-medium text-slate-700"}`} style={{ fontFamily: "var(--font-sans)" }}>
                                  {n.title}
                                </p>
                                <span className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5">{n.time}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5 truncate" style={{ fontFamily: "var(--font-sans)" }}>{n.sub}</p>
                            </div>
                            {n.unread && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: "hsl(var(--color-indigo-purple))" }} />}
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-slate-100 p-2">
                        <Link to="/notifications"
                          className="flex items-center justify-center gap-1.5 py-2 text-[12px] font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                          style={{ color: "hsl(var(--color-indigo-purple))", fontFamily: "var(--font-sans)" }}
                        >
                          See all notifications <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* User dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1.5 pl-1 pr-1.5 xl:pr-2 py-1 rounded-lg hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
                        <Avatar className="w-7 h-7 ring-2 ring-[#F2C94C]/50 ring-offset-1 ring-offset-[hsl(var(--color-charcoal))]">
                          <AvatarImage src={authState.user?.avatar} />
                          <AvatarFallback className="text-[11px] font-bold" style={{ background: "var(--gradient-accent)", color: "hsl(var(--color-charcoal))" }}>
                            {authState.user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden xl:block text-left leading-none">
                          <p className="text-[12px] font-semibold text-white">{authState.user?.name}</p>
                          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{authState.user?.role}</p>
                        </div>
                        <ChevronDown className="w-3 h-3 text-white/50 hidden xl:block" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={10} className="w-[260px] p-0 rounded-xl shadow-2xl border border-slate-200/80 overflow-hidden bg-white">
                      <div className="px-4 py-4 border-b border-slate-100" style={{ background: "hsl(var(--color-charcoal))" }}>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-11 h-11 ring-2 ring-[#F2C94C]/60">
                            <AvatarImage src={authState.user?.avatar} />
                            <AvatarFallback className="font-bold text-sm" style={{ background: "var(--gradient-accent)", color: "hsl(var(--color-charcoal))" }}>
                              {authState.user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-white truncate" style={{ fontFamily: "var(--font-display)" }}>{authState.user?.name}</p>
                            <p className="text-[11px] truncate mt-0.5" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sans)" }}>{authState.user?.email}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 mt-3">
                          {[
                            { v: authState.user?.enrolledCourses ?? 0, l: "Courses",  c: "#F2C94C" },
                            { v: "4.8",                                 l: "Rating",  c: "#10b981" },
                            { v: "3",                                   l: "Certs",   c: "#818cf8" },
                          ].map(s => (
                            <div key={s.l} className="rounded-lg py-2 text-center" style={{ background: "rgba(255,255,255,0.07)" }}>
                              <p className="text-[15px] font-bold leading-none" style={{ color: s.c, fontFamily: "var(--font-display)" }}>{s.v}</p>
                              <p className="text-[9px] font-semibold uppercase tracking-wider mt-1" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)" }}>{s.l}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-1.5">
                        {[1,2,3].map(g => (
                          <div key={g}>
                            {USER_MENU.filter(m => m.group === g).map(m => (
                              <DropdownMenuItem key={m.label} asChild>
                                <Link to={m.path} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer transition-colors" style={{ fontFamily: "var(--font-sans)" }}>
                                  <m.icon className="w-[14px] h-[14px] text-slate-400 flex-shrink-0" /> {m.label}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                            {g < 3 && <DropdownMenuSeparator className="my-1 bg-slate-100" />}
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-slate-100 p-1.5">
                        <button onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          <LogOut className="w-[14px] h-[14px]" /> Sign out
                        </button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => { setAuthTab("login"); setShowAuth(true); }}
                    className="hidden lg:flex items-center px-3 xl:px-3.5 py-1.5 text-[12px] xl:text-[13px] font-medium text-white/80 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-all whitespace-nowrap"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => { setAuthTab("register"); setShowAuth(true); }}
                    className="flex items-center gap-1 xl:gap-1.5 px-3 xl:px-4 py-1.5 text-[12px] xl:text-[13px] font-bold rounded-lg transition-all hover:opacity-90 hover:shadow-lg active:scale-95 whitespace-nowrap"
                    style={{ background: "var(--gradient-accent)", color: "hsl(var(--color-charcoal))", fontFamily: "var(--font-display)", boxShadow: "0 2px 12px rgba(242,201,76,0.35)" }}
                  >
                    <Zap className="w-3 h-3 xl:w-3.5 xl:h-3.5" />
                    <span className="hidden sm:inline">Get started</span>
                    <span className="sm:hidden">Join</span>
                  </button>
                </div>
              )}

              {/* Mobile/tablet menu toggle */}
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen
                    ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.1 }}><X className="w-5 h-5" /></motion.span>
                    : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.1 }}><Menu className="w-5 h-5" /></motion.span>
                  }
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* ── lg-only search row (lg shows nav but no inline search bar) ── */}
        <div className="hidden lg:block xl:hidden border-t px-6 py-2" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
            <div className={`flex items-center h-[36px] bg-white rounded-lg overflow-hidden transition-all duration-150 ${
              searchFocused ? "ring-2 ring-[#F2C94C]" : "ring-1 ring-white/10"
            }`}>
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0 ml-3" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => { setSearchFocused(true); if (searchQuery.trim().length >= 2) setShowSearchDrop(true); }}
                onBlur={() => setTimeout(() => { setSearchFocused(false); setShowSearchDrop(false); }, 200)}
                placeholder="Search for courses, skills, instructors…"
                className="flex-1 h-full px-3 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
                style={{ fontFamily: "var(--font-sans)" }}
              />
              {searchQuery && (
                <button type="button" onClick={() => { setSearchQuery(""); setShowSearchDrop(false); }}
                  className="mr-1 p-1 text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button type="submit"
                className="h-full px-3 text-[11px] font-semibold border-l border-slate-100 text-slate-600 hover:bg-slate-50 transition-colors flex-shrink-0"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Search
              </button>
            </div>
            {/* Search dropdown for lg row */}
            <AnimatePresence>
              {showSearchDrop && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200/80 overflow-hidden z-50"
                >
                  {searchLoading ? (
                    <div className="flex items-center justify-center gap-2 py-4 text-[13px] text-slate-400">
                      <Loader2 className="w-4 h-4 animate-spin" /> Searching…
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="py-4 text-center text-[13px] text-slate-400">No courses found</div>
                  ) : (
                    <>
                      {searchResults.map(result => (
                        <button key={result.id} type="button" onMouseDown={() => handleSearchResultClick(result.slug)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 text-left"
                        >
                          {result.thumbnail ? (
                            <img src={result.thumbnail} alt={result.title} className="w-9 h-9 rounded-lg object-cover flex-shrink-0 bg-slate-100" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                              <BookOpen className="w-4 h-4 text-slate-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-slate-800 truncate">{result.title}</p>
                            {result.category && <p className="text-[11px] text-slate-400">{result.category.name}</p>}
                          </div>
                        </button>
                      ))}
                      <div className="border-t border-slate-100 p-2">
                        <button type="button"
                          onMouseDown={() => { navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`); setSearchQuery(""); setShowSearchDrop(false); }}
                          className="flex items-center justify-center gap-1.5 w-full py-2 text-[12px] font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                          style={{ color: "hsl(var(--color-indigo-purple))" }}
                        >
                          See all results <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* ── Category bar (desktop) — dynamic ────────────────────────── */}
        <div className="hidden lg:block border-t" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
          <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
            <div className="flex items-center gap-0.5 h-9 overflow-x-auto scrollbar-hide">
              {catsLoading
                ? Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)
                : categories.slice(0, 8).map(cat => (
                    <Link key={cat.id} to={`/courses?category=${cat.slug}`}
                      className="flex items-center gap-1.5 px-3 py-1 text-[11.5px] font-medium rounded-md whitespace-nowrap flex-shrink-0 transition-colors duration-150 text-white/55 hover:text-white hover:bg-white/10"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      <span className="text-sm leading-none">{resolveIcon(cat.icon, cat.slug, cat.name)}</span>
                      {cat.name}
                    </Link>
                  ))
              }
              <div className="h-4 w-px bg-white/10 mx-2 flex-shrink-0" />
              <Link to="/courses?filter=new"
                className="flex items-center gap-1 px-3 py-1 text-[11.5px] font-semibold rounded-md whitespace-nowrap text-[#F2C94C] hover:bg-[#F2C94C]/10 transition-colors flex-shrink-0"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <Flame className="w-3 h-3" /> New & Trending
              </Link>
              <Link to="/learning-paths"
                className="flex items-center gap-1 px-3 py-1 text-[11.5px] font-semibold rounded-md whitespace-nowrap text-emerald-400 hover:bg-emerald-400/10 transition-colors flex-shrink-0"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <TrendingUp className="w-3 h-3" /> Skill Paths
              </Link>
            </div>
          </div>
        </div>

        {/* ── Mobile menu ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t"
              style={{ borderColor: "rgba(255,255,255,0.1)", background: "hsl(var(--color-charcoal))" }}
            >
              {/* Mobile search */}
              <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search courses…"
                    className="w-full h-10 pl-9 pr-4 text-[13px] bg-white text-slate-800 placeholder:text-slate-400 rounded-lg outline-none"
                    style={{ fontFamily: "var(--font-sans)" }}
                  />
                </form>
                {/* Mobile search results */}
                {showSearchDrop && searchQuery.trim().length >= 2 && (
                  <div className="mt-2 bg-white rounded-xl overflow-hidden shadow-lg">
                    {searchLoading ? (
                      <div className="flex items-center justify-center gap-2 py-4 text-[13px] text-slate-400">
                        <Loader2 className="w-4 h-4 animate-spin" /> Searching…
                      </div>
                    ) : searchResults.length === 0 ? (
                      <p className="py-4 text-center text-[13px] text-slate-400">No results found</p>
                    ) : (
                      searchResults.map(r => (
                        <button key={r.id} type="button"
                          onMouseDown={() => { handleSearchResultClick(r.slug); setMobileOpen(false); }}
                          className="flex items-center gap-2.5 w-full px-3 py-2.5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                        >
                          <BookOpen className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-[13px] text-slate-700 text-left truncate">{r.title}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="px-3 py-3 space-y-0.5 max-h-[70vh] overflow-y-auto">
                {NAV_LINKS.map(item => (
                  <div key={item.label}>
                    {item.type !== "link" ? (
                      <details className="group">
                        <summary
                          className="flex items-center justify-between px-3 py-2.5 text-[13px] font-medium rounded-lg cursor-pointer list-none transition-colors text-white/75 hover:text-white hover:bg-white/8"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          {item.label}
                          <ChevronDown className="w-4 h-4 text-white/40 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="ml-4 mt-1 pb-1">
                          {item.type === "mega" && (
                            <div className="grid grid-cols-2 gap-1">
                              {coursesLoading
                                ? Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-10 bg-white/10 rounded-lg animate-pulse" />
                                  ))
                                : featuredCourses.map(c => (
                                    <Link key={c.id} to={`/courses/${c.slug}`}
                                      className="flex items-center gap-2 px-2 py-2.5 rounded-lg transition-colors hover:bg-white/8"
                                      style={{ fontFamily: "var(--font-sans)" }}
                                    >
                                      <span className="text-lg leading-none">
                                        {c.category ? getCategoryIcon(c.category.slug, c.category.name) : "📚"}
                                      </span>
                                      <span className="text-[12px] text-white/70 truncate">{c.title}</span>
                                    </Link>
                                  ))
                              }
                            </div>
                          )}
                          {item.type === "dropdown" && (
                            <div className="space-y-0.5">
                              {RESOURCES.map(r => (
                                <Link key={r.label} to={r.path}
                                  className="flex items-center gap-2 px-3 py-2 text-[12px] text-white/65 hover:text-white rounded-lg hover:bg-white/8 transition-colors"
                                  style={{ fontFamily: "var(--font-sans)" }}
                                >
                                  <r.icon className="w-3.5 h-3.5 text-white/40" /> {r.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </details>
                    ) : (
                      <Link to={item.path!}
                        className={`flex items-center px-3 py-2.5 text-[13px] font-medium rounded-lg transition-all ${
                          isActive(item.path!)
                            ? "text-[#F2C94C]"
                            : "text-white/75 hover:text-white hover:bg-white/8"
                        }`}
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}

                {/* Mobile categories */}
                {categories.length > 0 && (
                  <div className="pt-2 mt-1 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                    <p className="px-3 py-1.5 text-[10px] font-bold text-white/30 uppercase tracking-wider">Categories</p>
                    <div className="grid grid-cols-2 gap-1">
                      {categories.slice(0, 6).map(cat => (
                        <Link key={cat.id} to={`/courses?category=${cat.slug}`}
                          className="flex items-center gap-1.5 px-3 py-2 text-[12px] text-white/65 hover:text-white rounded-lg hover:bg-white/8 transition-colors"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          <span>{resolveIcon(cat.icon, cat.slug, cat.name)}</span>
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mobile auth */}
                {authState.isAuthenticated ? (
                  <div className="pt-3 mt-2 border-t space-y-0.5" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                    <div className="flex items-center gap-3 px-3 py-3">
                      <Avatar className="w-10 h-10 ring-2 ring-[#F2C94C]/50">
                        <AvatarImage src={authState.user?.avatar} />
                        <AvatarFallback className="text-xs font-bold" style={{ background: "var(--gradient-accent)", color: "hsl(var(--color-charcoal))" }}>
                          {authState.user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-[13px] font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>{authState.user?.name}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)" }}>{authState.user?.email}</p>
                      </div>
                    </div>
                    {USER_MENU.map(m => (
                      <Link key={m.label} to={m.path}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-white/65 hover:text-white hover:bg-white/8 rounded-lg transition-colors"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        <m.icon className="w-4 h-4 text-white/40" /> {m.label}
                      </Link>
                    ))}
                    <button onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[13px] text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                ) : (
                  <div className="pt-3 mt-2 border-t space-y-2 pb-2" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                    <button
                      onClick={() => { setAuthTab("login"); setShowAuth(true); setMobileOpen(false); }}
                      className="flex items-center justify-center w-full py-2.5 text-[13px] font-semibold text-white border border-white/20 rounded-xl hover:bg-white/8 transition-all"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => { setAuthTab("register"); setShowAuth(true); setMobileOpen(false); }}
                      className="flex items-center justify-center gap-2 w-full py-2.5 text-[13px] font-bold rounded-xl hover:opacity-90 transition-all"
                      style={{ background: "var(--gradient-accent)", color: "hsl(var(--color-charcoal))", fontFamily: "var(--font-display)" }}
                    >
                      <Zap className="w-4 h-4" /> Get started free
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ══════════════ AUTH MODAL */}
      <Dialog
        open={showAuth}
        onOpenChange={v => { setShowAuth(v); if (!v) { setLoginError(null); setRegErrors({}); } }}
      >
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
          <DialogContent className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-[420px] rounded-2xl shadow-2xl border-0 overflow-hidden max-h-[92vh] overflow-y-auto p-0 focus:outline-none bg-white">

            <div className="h-1 w-full" style={{ background: "var(--gradient-primary)" }} />

            <div className="flex items-center justify-between px-6 pt-5 pb-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-accent)" }}>
                  <GraduationCap className="w-3.5 h-3.5" style={{ color: "hsl(var(--color-charcoal))" }} />
                </div>
                <span className="text-[14px] font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Sipalaya Info Tech</span>
              </div>
              <button onClick={() => setShowAuth(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-0 px-6 pt-4 border-b border-slate-100">
              {(["login","register"] as const).map(tab => (
                <button key={tab} onClick={() => setAuthTab(tab)}
                  className={`relative flex-1 pb-3 text-[13px] font-semibold transition-colors ${authTab === tab ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {tab === "login" ? "Sign In" : "Create Account"}
                  {authTab === tab && (
                    <motion.div
                      layoutId="modal-tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                      style={{ background: "var(--gradient-primary)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {authTab === "login" ? (
                <motion.div key="login" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }} className="px-6 py-6">
                  <p className="text-[22px] font-bold text-slate-900 mb-1" style={{ fontFamily: "var(--font-display)" }}>Welcome back 👋</p>
                  <p className="text-[13px] text-slate-500 mb-5" style={{ fontFamily: "var(--font-sans)" }}>Sign in to continue your learning journey</p>

                  {loginError && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2.5 px-3.5 py-3 mb-5 rounded-xl border"
                      style={{ background: "rgb(254,242,242)", borderColor: "rgb(252,165,165)" }}
                    >
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-[13px] text-red-700" style={{ fontFamily: "var(--font-sans)" }}>{loginError}</p>
                    </motion.div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-2" style={{ fontFamily: "var(--font-sans)" }}>Email address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input name="email" type="email" placeholder="you@example.com" required disabled={loading}
                          onChange={() => setLoginError(null)}
                          className="w-full h-11 pl-10 pr-4 text-[13px] bg-white border border-slate-200 rounded-xl outline-none hover:border-slate-300 focus:border-transparent focus:ring-2 transition-all placeholder:text-slate-400 text-slate-800"
                          style={{ fontFamily: "var(--font-sans)", "--tw-ring-color": "hsl(var(--color-steel-blue)/0.35)" } as React.CSSProperties}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500" style={{ fontFamily: "var(--font-sans)" }}>Password</label>
                        <Link to="/forgot-password" onClick={() => setShowAuth(false)}
                          className="text-[12px] font-semibold hover:underline"
                          style={{ color: "hsl(var(--color-indigo-purple))", fontFamily: "var(--font-sans)" }}
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input name="password" type={showPw.login ? "text" : "password"} placeholder="Your password" required disabled={loading}
                          onChange={() => setLoginError(null)}
                          className="w-full h-11 pl-10 pr-11 text-[13px] bg-white border border-slate-200 rounded-xl outline-none hover:border-slate-300 focus:border-transparent focus:ring-2 transition-all placeholder:text-slate-400 text-slate-800"
                          style={{ fontFamily: "var(--font-sans)", "--tw-ring-color": "hsl(var(--color-steel-blue)/0.35)" } as React.CSSProperties}
                        />
                        <button type="button" tabIndex={-1} onClick={() => setShowPw(p => ({ ...p, login: !p.login }))}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                          {showPw.login ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" name="remember" className="w-3.5 h-3.5 rounded accent-indigo-700" />
                      <span className="text-[12.5px] text-slate-600 select-none" style={{ fontFamily: "var(--font-sans)" }}>Keep me signed in for 30 days</span>
                    </label>

                    <button type="submit" disabled={loading}
                      className="w-full h-11 flex items-center justify-center gap-2 text-[14px] font-bold rounded-xl transition-all hover:opacity-90 hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: "var(--gradient-primary)", color: "white", fontFamily: "var(--font-display)", boxShadow: "0 4px 18px hsl(var(--color-indigo-purple)/0.35)" }}
                    >
                      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : "Sign in to your account"}
                    </button>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-slate-100" />
                      <span className="text-[11px] text-slate-400 font-medium" style={{ fontFamily: "var(--font-sans)" }}>or continue with</span>
                      <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Google", icon: (<svg className="w-[16px] h-[16px]" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>) },
                        { label: "GitHub", icon: <Github className="w-4 h-4" /> },
                      ].map(s => (
                        <button key={s.label} type="button" disabled={loading}
                          className="flex items-center justify-center gap-2 h-10 text-[13px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-60"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          {s.icon} {s.label}
                        </button>
                      ))}
                    </div>

                    <p className="text-center text-[13px] text-slate-500" style={{ fontFamily: "var(--font-sans)" }}>
                      No account?{" "}
                      <button type="button" onClick={() => { setAuthTab("register"); setLoginError(null); }}
                        className="font-bold hover:underline"
                        style={{ color: "hsl(var(--color-indigo-purple))", fontFamily: "var(--font-display)" }}
                      >
                        Create one free →
                      </button>
                    </p>
                  </form>
                </motion.div>
              ) : (
                <motion.div key="register" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} className="px-6 py-6">
                  <p className="text-[22px] font-bold text-slate-900 mb-1" style={{ fontFamily: "var(--font-display)" }}>Start learning today 🚀</p>
                  <p className="text-[13px] text-slate-500 mb-5" style={{ fontFamily: "var(--font-sans)" }}>Join 12,000+ students already learning</p>

                  {Object.keys(regErrors).length > 0 && (
                    <div className="flex items-start gap-2.5 px-3.5 py-3 mb-5 rounded-xl border" style={{ background: "rgb(254,242,242)", borderColor: "rgb(252,165,165)" }}>
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        {Object.entries(regErrors).map(([k, v]) => (
                          <p key={k} className="text-[12px] text-red-700 capitalize" style={{ fontFamily: "var(--font-sans)" }}>{k.replace(/_/g," ")}: {v}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleRegister} className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      {[{ id: "firstName", ph: "First name" }, { id: "lastName", ph: "Last name" }].map(f => (
                        <div key={f.id}>
                          <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-2" style={{ fontFamily: "var(--font-sans)" }}>{f.ph}</label>
                          <input id={f.id} name={f.id} placeholder={f.ph} required disabled={loading}
                            className="w-full h-10 px-3.5 text-[13px] bg-white border border-slate-200 rounded-xl outline-none hover:border-slate-300 focus:border-transparent focus:ring-2 transition-all placeholder:text-slate-400 text-slate-800"
                            style={{ fontFamily: "var(--font-sans)", "--tw-ring-color": "hsl(var(--color-steel-blue)/0.35)" } as React.CSSProperties}
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-2" style={{ fontFamily: "var(--font-sans)" }}>Email address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input name="email" type="email" placeholder="you@example.com" required disabled={loading}
                          className={`w-full h-11 pl-10 pr-4 text-[13px] border rounded-xl outline-none hover:border-slate-300 focus:border-transparent focus:ring-2 transition-all placeholder:text-slate-400 text-slate-800 ${regErrors.email ? "border-red-300 bg-red-50" : "border-slate-200 bg-white"}`}
                          style={{ fontFamily: "var(--font-sans)", "--tw-ring-color": "hsl(var(--color-steel-blue)/0.35)" } as React.CSSProperties}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-2" style={{ fontFamily: "var(--font-sans)" }}>Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input name="password" type={showPw.reg ? "text" : "password"} placeholder="Min. 8 characters" required disabled={loading}
                          onChange={e => calcStrength(e.target.value)}
                          className="w-full h-11 pl-10 pr-11 text-[13px] bg-white border border-slate-200 rounded-xl outline-none hover:border-slate-300 focus:border-transparent focus:ring-2 transition-all placeholder:text-slate-400 text-slate-800"
                          style={{ fontFamily: "var(--font-sans)", "--tw-ring-color": "hsl(var(--color-steel-blue)/0.35)" } as React.CSSProperties}
                        />
                        <button type="button" tabIndex={-1} onClick={() => setShowPw(p => ({ ...p, reg: !p.reg }))}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                          {showPw.reg ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <AnimatePresence>
                        {pwStrength.score > 0 && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-2 space-y-1 overflow-hidden">
                            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: pwStrength.w }} transition={{ duration: 0.3 }}
                                style={{ background: pwStrength.score <= 1 ? "#ef4444" : pwStrength.score === 2 ? "#f59e0b" : pwStrength.score === 3 ? "#eab308" : "hsl(var(--color-steel-blue))" }}
                              />
                            </div>
                            <p className="text-[11px] font-semibold" style={{
                              color: pwStrength.score <= 1 ? "#ef4444" : pwStrength.score === 2 ? "#f59e0b" : pwStrength.score === 3 ? "#ca8a04" : "hsl(var(--color-steel-blue))",
                              fontFamily: "var(--font-sans)"
                            }}>
                              {pwStrength.label} password
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-2" style={{ fontFamily: "var(--font-sans)" }}>Confirm password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input name="confirmPassword" type={showPw.conf ? "text" : "password"} placeholder="Repeat password" required disabled={loading}
                          onChange={e => setConfirmPw(e.target.value)}
                          className={`w-full h-11 pl-10 pr-11 text-[13px] border rounded-xl outline-none focus:border-transparent focus:ring-2 transition-all placeholder:text-slate-400 text-slate-800 ${pwMatch === false ? "border-red-300 bg-red-50" : pwMatch === true ? "border-emerald-400" : "border-slate-200 bg-white hover:border-slate-300"}`}
                          style={{ fontFamily: "var(--font-sans)", "--tw-ring-color": "hsl(var(--color-steel-blue)/0.35)" } as React.CSSProperties}
                        />
                        <button type="button" tabIndex={-1} onClick={() => setShowPw(p => ({ ...p, conf: !p.conf }))}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                          {showPw.conf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {confirmPw && (
                        <p className={`flex items-center gap-1.5 text-[12px] font-semibold mt-1.5 ${pwMatch ? "text-emerald-600" : "text-red-500"}`} style={{ fontFamily: "var(--font-sans)" }}>
                          {pwMatch ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                          {pwMatch ? "Passwords match" : "Passwords don't match"}
                        </p>
                      )}
                    </div>

                    <label className="flex items-start gap-3 p-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors border border-slate-100">
                      <input type="checkbox" name="terms" required className="mt-0.5 w-3.5 h-3.5 rounded accent-indigo-700 flex-shrink-0" />
                      <span className="text-[12.5px] text-slate-600 leading-relaxed select-none" style={{ fontFamily: "var(--font-sans)" }}>
                        I agree to the{" "}
                        <Link to="/terms" onClick={() => setShowAuth(false)} className="font-bold hover:underline" style={{ color: "hsl(var(--color-indigo-purple))" }}>Terms of Service</Link>
                        {" "}and{" "}
                        <Link to="/privacy" onClick={() => setShowAuth(false)} className="font-bold hover:underline" style={{ color: "hsl(var(--color-indigo-purple))" }}>Privacy Policy</Link>
                      </span>
                    </label>

                    <button type="submit" disabled={loading || (!!confirmPw && !pwMatch)}
                      className="w-full h-11 flex items-center justify-center gap-2 text-[14px] font-bold rounded-xl transition-all hover:opacity-90 hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: "var(--gradient-primary)", color: "white", fontFamily: "var(--font-display)", boxShadow: "0 4px 18px hsl(var(--color-indigo-purple)/0.35)" }}
                    >
                      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</> : "Create free account →"}
                    </button>

                    <p className="text-center text-[13px] text-slate-500" style={{ fontFamily: "var(--font-sans)" }}>
                      Already a member?{" "}
                      <button type="button" onClick={() => setAuthTab("login")}
                        className="font-bold hover:underline" style={{ color: "hsl(var(--color-indigo-purple))", fontFamily: "var(--font-display)" }}>
                        Sign in
                      </button>
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};

export default Navbar;