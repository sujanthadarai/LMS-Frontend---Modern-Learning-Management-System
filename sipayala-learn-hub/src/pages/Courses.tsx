// src/pages/Courses.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Layout from "@/components/layout/Layout";
import CourseCard from "@/components/common/CourseCard";
import {
  Search,
  Loader2,
  X,
  AlertCircle,
  RefreshCw,
  Network,
  ArrowRight,
  SlidersHorizontal,
  BookOpen,
  Users,
  GraduationCap,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiService } from "@/services/api";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  course_count?: number;
}

interface Instructor {
  id: number;
  user: { id: number; first_name: string; last_name: string; email: string; avatar?: string };
  title: string;
  bio?: string;
}

interface Course {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  long_description?: string;
  category: Category;
  instructor?: Instructor;
  level: string;
  level_display?: string;
  price: string;
  original_price?: string | null;
  is_discounted?: boolean;
  discount_percentage?: number;
  duration: string;
  thumbnail: string;
  students_count?: number;
  rating?: string;
  is_popular?: boolean;
  is_featured?: boolean;
  prerequisites?: string[];
  learning_outcomes?: string[];
  batch_start_date?: string;
  created_at: string;
  updated_at: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const LEVEL_OPTIONS = [
  { value: "", label: "All Levels" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const SORT_OPTIONS = [
  { value: "", label: "Relevance" },
  { value: "-created_at", label: "Newest" },
  { value: "price", label: "Price: Low → High" },
  { value: "-price", label: "Price: High → Low" },
  { value: "-rating", label: "Top Rated" },
  { value: "-students_count", label: "Most Popular" },
];

const HERO_STATS = [
  { icon: BookOpen, value: "30+", label: "Courses" },
  { icon: Users, value: "5,000+", label: "Students" },
  { icon: GraduationCap, value: "20+", label: "Instructors" },
  { icon: TrendingUp, value: "94%", label: "Placement" },
];

const ORDER_MAP: Record<string, string> = {
  price: "price",
  "-price": "-price",
  "-rating": "-rating",
  "-students_count": "-students_count",
  "-created_at": "-created_at",
};

// ─── Helpers ────────────────────────────────────────────────────────────────────
const fixImageUrl = (url?: string | null): string => {
  if (!url) return "https://placehold.co/400x225/1e293b/94a3b8?text=Course";
  const clean = url.replace(/([^:])\/\//g, "$1/");
  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
  if (clean.startsWith("/")) return `http://127.0.0.1:8000${clean}`;
  return `http://127.0.0.1:8000/media/${clean}`;
};

const normalizeArray = <T,>(res: unknown, keys = ["results", "data", "courses", "categories"]): T[] => {
  if (Array.isArray(res)) return res as T[];
  if (res && typeof res === "object") {
    for (const k of keys) {
      const v = (res as Record<string, unknown>)[k];
      if (Array.isArray(v)) return v as T[];
    }
  }
  return [];
};

// ─── Sub-components ─────────────────────────────────────────────────────────────

/** Thin select wrapper that matches the page aesthetic */
const NativeSelect = ({
  value,
  onChange,
  options,
  disabled,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  placeholder?: string;
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="appearance-none h-9 pl-3 pr-8 text-sm bg-white border border-gray-200 rounded-lg
                 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
                 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer
                 transition-colors"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
  </div>
);

/** Pill chip for active filter tags */
const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-100
                   text-blue-700 rounded-lg text-xs font-medium">
    {label}
    <button
      onClick={onRemove}
      aria-label={`Remove ${label} filter`}
      className="hover:text-blue-900 transition-colors"
    >
      <X className="w-3 h-3" />
    </button>
  </span>
);

// ─── Page Component ─────────────────────────────────────────────────────────────
const Courses = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCatsLoading, setIsCatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebounce(searchQuery, 400);

  // ── API availability ──────────────────────────────────────────────────────────
  const checkApi = useCallback(async () => {
    try {
      const r = await fetch("http://127.0.0.1:8000/api/courses/courses/", {
        method: "HEAD",
        headers: { Accept: "application/json" },
      });
      setApiAvailable(r.ok);
      return r.ok;
    } catch {
      setApiAvailable(false);
      return false;
    }
  }, []);

  // ── Fetch categories ──────────────────────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    setIsCatsLoading(true);
    try {
      const res = await apiService.getCategories();
      const data = normalizeArray<Category>(res);
      const all: Category = {
        id: 0,
        name: "All",
        slug: "all",
        course_count: data.reduce((s, c) => s + (c.course_count || 0), 0),
      };
      setCategories([all, ...data]);
    } catch {
      setCategories([]);
    } finally {
      setIsCatsLoading(false);
    }
  }, []);

  // ── Fetch courses ─────────────────────────────────────────────────────────────
  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (activeCategory !== "All") params.category__name = activeCategory;
      if (levelFilter) params.level = levelFilter;
      if (sortBy) params.ordering = ORDER_MAP[sortBy] ?? sortBy;

      const res = await apiService.getCourses(params);
      const data = normalizeArray<Course>(res);

      setCourses(
        data.map((c) => ({
          ...c,
          level_display: c.level_display || c.level || "Not Specified",
          price: c.price || "0",
          original_price: c.original_price ?? null,
          is_discounted: c.is_discounted ?? false,
          discount_percentage: c.discount_percentage ?? 0,
          students_count: c.students_count ?? 0,
          rating: c.rating ?? "0.0",
          is_popular: c.is_popular ?? false,
          is_featured: c.is_featured ?? false,
          thumbnail: fixImageUrl(c.thumbnail),
          category: {
            id: c.category?.id ?? 0,
            name: c.category?.name ?? "Uncategorized",
            slug: c.category?.slug ?? "uncategorized",
            description: c.category?.description,
            icon: c.category?.icon,
            course_count: c.category?.course_count ?? 0,
          },
        }))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load courses.";
      setError(msg);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, activeCategory, levelFilter, sortBy]);

  // ── Init ──────────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const up = await checkApi();
      if (up) await Promise.all([fetchCategories(), fetchCourses()]);
      else {
        setIsLoading(false);
        setIsCatsLoading(false);
        setError("Cannot reach the API server. Start your Django dev server and retry.");
      }
    })();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (apiAvailable) fetchCourses();
  }, [apiAvailable, fetchCourses]);

  const retry = useCallback(async () => {
    const up = await checkApi();
    if (up) {
      setError(null);
      await Promise.all([fetchCategories(), fetchCourses()]);
    }
  }, [checkApi, fetchCategories, fetchCourses]);

  const clearFilters = useCallback(() => {
    setActiveCategory("All");
    setSearchQuery("");
    setLevelFilter("");
    setSortBy("");
  }, []);

  const activeFilterCount = [
    activeCategory !== "All",
    searchQuery.length > 0,
    levelFilter.length > 0,
    sortBy.length > 0,
  ].filter(Boolean).length;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <Layout>
      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative pt-28 pb-24 overflow-hidden bg-gray-950">
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#ffffff 1px,transparent 1px),linear-gradient(to bottom,#ffffff 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow blobs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 right-0 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full
                             bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-semibold uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5" />
              Training programmes
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white leading-[1.1] tracking-tight mb-5">
              Build skills that{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                get you hired.
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-xl mb-10">
              Industry-focused courses taught by working engineers. Every programme ends with a portfolio
              project and a direct line to hiring partners.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8">
              {HERO_STATS.map((s) => (
                <div key={s.label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <s.icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white leading-none">{s.value}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Fade into page background */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* ════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════ */}
      <section className="bg-gray-50 pb-24">
        <div className="container mx-auto px-4 max-w-6xl pt-10">

          {/* ── API status & error banner ── */}
          <AnimatePresence>
            {(error || !apiAvailable) && (
              <motion.div
                key="error-banner"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mb-6 flex items-start gap-3 px-4 py-3.5 rounded-xl
                           bg-amber-50 border border-amber-200 text-amber-800 text-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                <div className="flex-1">
                  <p className="font-medium leading-snug">{error || "API server unreachable."}</p>
                  <p className="text-amber-600 text-[12px] mt-0.5">
                    Run <code className="font-mono bg-amber-100 px-1 rounded">python manage.py runserver</code> to connect.
                  </p>
                </div>
                <button
                  onClick={retry}
                  className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-amber-700
                             hover:text-amber-900 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-amber-100"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Toolbar ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8 overflow-hidden">
            {/* Top row: search + controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search courses, skills, instructors…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isLoading || !apiAvailable}
                  className="w-full h-12 pl-10 pr-10 text-sm bg-transparent text-gray-800
                             placeholder:text-gray-400 focus:outline-none disabled:opacity-40"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(""); searchRef.current?.focus(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full
                               bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                )}
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-2 px-3 h-12">
                <NativeSelect
                  value={sortBy}
                  onChange={setSortBy}
                  options={SORT_OPTIONS}
                  disabled={isLoading || !apiAvailable}
                  placeholder="Sort by"
                />
                <NativeSelect
                  value={levelFilter}
                  onChange={setLevelFilter}
                  options={LEVEL_OPTIONS}
                  disabled={isLoading || !apiAvailable}
                />

                {/* Filter toggle (mobile) */}
                <button
                  onClick={() => setFilterOpen((p) => !p)}
                  className={`sm:hidden ml-1 flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    filterOpen
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-0.5 w-4 h-4 rounded-full bg-white/30 text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Clear — always visible when active */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="hidden sm:flex items-center gap-1 h-9 px-3 rounded-lg text-xs font-medium
                               text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors border border-transparent"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear
                  </button>
                )}

                {/* API dot */}
                <div className="hidden sm:flex items-center gap-1.5 ml-1 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      apiAvailable ? "bg-emerald-500 animate-pulse" : "bg-red-400"
                    }`}
                  />
                  <Network className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Category tabs */}
            <div className="border-t border-gray-100 px-4 py-2.5 flex items-center gap-1.5 flex-wrap">
              {isCatsLoading ? (
                <div className="flex items-center gap-2 py-1 text-xs text-gray-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Loading categories…
                </div>
              ) : (
                categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.name); }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                      activeCategory === cat.name
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {cat.name}
                    {cat.course_count != null && cat.course_count > 0 && (
                      <span className={`ml-1.5 text-[10px] ${activeCategory === cat.name ? "text-blue-100" : "text-gray-400"}`}>
                        {cat.course_count}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ── Active filter chips ── */}
          <AnimatePresence>
            {activeFilterCount > 0 && (
              <motion.div
                key="chips"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-wrap items-center gap-2 mb-6"
              >
                <span className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Filters:</span>
                {activeCategory !== "All" && (
                  <FilterChip label={activeCategory} onRemove={() => setActiveCategory("All")} />
                )}
                {levelFilter && (
                  <FilterChip label={levelFilter} onRemove={() => setLevelFilter("")} />
                )}
                {searchQuery && (
                  <FilterChip label={`"${searchQuery}"`} onRemove={() => setSearchQuery("")} />
                )}
                {sortBy && (
                  <FilterChip
                    label={SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? sortBy}
                    onRemove={() => setSortBy("")}
                  />
                )}
                <button
                  onClick={clearFilters}
                  className="text-[11px] text-gray-400 hover:text-gray-700 underline underline-offset-2 transition-colors"
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Results count ── */}
          {!isLoading && apiAvailable && (
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                {courses.length > 0 ? (
                  <>
                    <span className="font-semibold text-gray-800">{courses.length}</span>
                    {" "}course{courses.length !== 1 ? "s" : ""} found
                  </>
                ) : null}
              </p>
            </div>
          )}

          {/* ── Content ── */}
          {isLoading ? (
            /* Skeleton grid */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                  <div className="h-44 bg-gray-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                    <div className="flex justify-between pt-2">
                      <div className="h-4 bg-gray-100 rounded w-1/4" />
                      <div className="h-4 bg-gray-100 rounded w-1/5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !apiAvailable ? (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-4">
                <Network className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">Server not reachable</h3>
              <p className="text-sm text-gray-400 max-w-xs mb-5">
                Start the Django development server, then click Retry.
              </p>
              <button
                onClick={retry}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry connection
              </button>
            </div>
          ) : courses.length > 0 ? (
            <motion.div
              key={`${activeCategory}-${debouncedSearch}-${levelFilter}-${sortBy}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {courses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">No courses match</h3>
              <p className="text-sm text-gray-400 max-w-xs mb-5">
                Try a broader search term or remove one of the active filters.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA STRIP
      ════════════════════════════════════════ */}
      <section className="bg-white border-t border-gray-200 py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                Not sure which programme fits you?
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Book a free 20-minute call with a course advisor. We'll map your goals to the
                right curriculum and answer every question you have.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                           bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold
                           shadow-sm shadow-blue-200 transition-colors"
              >
                Book a free call
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="tel:+0000000000"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                           border border-gray-200 bg-white text-gray-700 text-sm font-semibold
                           hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Call us now
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Courses;