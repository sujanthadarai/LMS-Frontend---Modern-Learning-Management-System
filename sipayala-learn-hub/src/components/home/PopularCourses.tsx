import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Sparkles, TrendingUp, Clock, Users, Star,
  Zap, Award, ChevronRight, Briefcase, GraduationCap,
  ExternalLink, AlertCircle, BookOpen, Code, Shield,
  BarChart, Globe, Brain, Trophy, Rocket, BadgeCheck,
  Flame, Crown, Play, CheckCircle2, ArrowUpRight,
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { usePopularCourses, useDashboardStats, Course } from "@/hooks/useCourses";

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  steel:   "#5F789E",
  indigo:  "#3D3F8C",
  gold:    "#F2C94C",
  charcoal:"#1F2937",
  surface: "#F8F9FB",
};

// ─── Category config ────────────────────────────────────────────────────────
type CatConfig = {
  Icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  accent: string;
  tag: string;
};

const CATEGORY_CONFIG: Record<string, CatConfig> = {
  "Web Development":      { Icon: Globe,   gradient: "from-[#5F789E] to-[#3D3F8C]", accent: "#5F789E", tag: "bg-blue-50 text-[#5F789E]" },
  "Data Science":         { Icon: BarChart, gradient: "from-[#3D3F8C] to-[#5F789E]", accent: "#3D3F8C", tag: "bg-indigo-50 text-[#3D3F8C]" },
  "Cyber Security":       { Icon: Shield,   gradient: "from-[#1F2937] to-[#5F789E]", accent: "#374151", tag: "bg-gray-100 text-[#374151]" },
  "AI & Machine Learning":{ Icon: Brain,    gradient: "from-[#3D3F8C] to-[#8BA0C0]", accent: "#3D3F8C", tag: "bg-indigo-50 text-[#3D3F8C]" },
  "Mobile Development":   { Icon: Code,     gradient: "from-[#5F789E] to-[#8BA0C0]", accent: "#5F789E", tag: "bg-blue-50 text-[#5F789E]" },
  "DevOps":               { Icon: Zap,      gradient: "from-[#1F2937] to-[#3D3F8C]", accent: "#1F2937", tag: "bg-gray-100 text-[#374151]" },
  default:                { Icon: BookOpen, gradient: "from-[#5F789E] to-[#3D3F8C]", accent: "#5F789E", tag: "bg-blue-50 text-[#5F789E]" },
};

const getCatConfig = (name?: string): CatConfig =>
  CATEGORY_CONFIG[name ?? ""] ?? CATEGORY_CONFIG.default;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatNPR = (price: string | number) => {
  const n = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(n) || n === 0) return "Free";
  return new Intl.NumberFormat("en-NP", { style: "currency", currency: "NPR", minimumFractionDigits: 0 }).format(n);
};

const formatCount = (n: number) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
};

// ─── Animation Variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Shimmer skeleton for loading state */
const CardSkeleton = () => (
  <div className="rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm">
    <div className="h-48 bg-slate-200 animate-pulse" />
    <div className="p-5 space-y-3">
      <div className="h-3 w-20 bg-slate-200 rounded-full animate-pulse" />
      <div className="h-5 w-full bg-slate-200 rounded animate-pulse" />
      <div className="h-4 w-4/5 bg-slate-100 rounded animate-pulse" />
      <div className="flex gap-2 pt-1">
        {[1,2,3].map(i => <div key={i} className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />)}
      </div>
      <div className="h-10 w-full bg-slate-200 rounded-xl animate-pulse mt-2" />
    </div>
  </div>
);

/** Single stat pill */
const StatPill = ({
  icon: Icon, value, label, trend,
}: { icon: React.ComponentType<{className?:string}>; value: string; label: string; trend?: string }) => (
  <motion.div
    variants={fadeUp}
    className="flex items-center gap-4 bg-white rounded-2xl px-6 py-5 border border-slate-100 shadow-sm"
  >
    <div className="w-11 h-11 rounded-xl bg-[#5F789E]/10 flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-[#5F789E]" />
    </div>
    <div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-[#1F2937] leading-none">{value}</span>
        {trend && (
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-[12px] text-slate-500 mt-0.5 font-medium">{label}</p>
    </div>
  </motion.div>
);

/** Course card */
const CourseCard = ({ course, index }: { course: Course; index: number }) => {
  const config  = getCatConfig(course.category?.name);
  const { Icon } = config;
  const rating   = Number(course.rating || 4.8).toFixed(1);
  const students = course.students_count || 0;
  const level    = course.level_display || course.level || "Beginner";
  const price    = formatNPR(course.price ?? 0);

  const batchLabel = (() => {
    if (!course.batch_start_date) return null;
    const d = new Date(course.batch_start_date);
    return `Batch: ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  })();

  return (
    <motion.article
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-shadow duration-300 overflow-hidden h-full"
    >
      {/* Thumbnail */}
      <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${config.gradient} flex-shrink-0`}>
        {course.thumbnail ? (
          <img
            src={apiService.fixImageUrl(course.thumbnail)}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-16 h-16 text-white/25" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-start justify-between">
          <span className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-[11px] font-semibold text-[#1F2937] px-2.5 py-1.5 rounded-lg shadow-sm">
            <Icon className="w-3 h-3" style={{ color: config.accent }} />
            {course.category?.name ?? "Development"}
          </span>
          <span className="flex items-center gap-1 bg-[#F2C94C] text-[#1F2937] text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm">
            <Flame className="w-3 h-3" />
            Popular
          </span>
        </div>

        {/* Bottom meta */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between">
          {course.duration ? (
            <span className="flex items-center gap-1 text-[11px] text-white/90 font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg">
              <Clock className="w-3 h-3" /> {course.duration}
            </span>
          ) : <div />}
          <span className="text-[13px] font-bold text-white bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg">
            {price}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Level + batch */}
        <div className="flex items-center justify-between mb-2.5">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${config.tag}`}>
            {level}
          </span>
          {batchLabel && (
            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
              <Clock className="w-3 h-3" /> {batchLabel}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-bold text-[#1F2937] leading-snug line-clamp-2 mb-2 group-hover:text-[#5F789E] transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-[12.5px] text-slate-500 leading-relaxed line-clamp-2 mb-4">
          {course.short_description || "Master industry-relevant skills with hands-on projects and real-world mentoring."}
        </p>

        {/* Includes */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-4">
          {[
            { icon: BadgeCheck, label: "Certificate" },
            { icon: Rocket,     label: "Projects" },
            { icon: Users,      label: "1:1 Mentoring" },
            { icon: Play,       label: "Live Sessions" },
          ].map(({ icon: FeatureIcon, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <FeatureIcon className="w-3.5 h-3.5 text-[#5F789E] flex-shrink-0" />
              <span className="text-[11px] text-slate-500">{label}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 pt-3.5 mt-auto">
          {/* Rating + students */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-3 h-3 ${i <= Math.round(Number(rating)) ? "fill-[#F2C94C] text-[#F2C94C]" : "text-slate-200"}`} />
                ))}
              </div>
              <span className="text-[12px] font-bold text-[#1F2937]">{rating}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <Users className="w-3 h-3" />
              {formatCount(students)}+ enrolled
            </div>
          </div>

          {/* CTA */}
          <Link to={`/courses/${course.slug}`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-10 flex items-center justify-center gap-2 text-[13px] font-semibold text-white rounded-xl transition-all duration-200"
              style={{ background: `linear-gradient(135deg, ${C.steel}, ${C.indigo})` }}
            >
              View Program
              <ArrowUpRight className="w-3.5 h-3.5" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const PopularCourses = () => {
  const { popularCourses = [], isLoading: coursesLoading, error: coursesError } = usePopularCourses(4);
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();

  const [displayedCourses, setDisplayedCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (popularCourses.length > 0) setDisplayedCourses(popularCourses.slice(0, 4));
  }, [popularCourses]);

  // ── Stats derived from API or sensible fallbacks ──────────────────────────
  const stats = [
    { icon: Trophy,       value: dashboardStats?.placement_success_rate ?? "98%", label: "Placement Success",  trend: "+15%" },
    { icon: Briefcase,    value: dashboardStats?.career_hires ?? "1,200+",        label: "Career Hires",       trend: "+25%" },
    { icon: Clock,        value: `${dashboardStats?.total_learning_hours ?? 500}+`, label: "Learning Hours",   trend: "+40h" },
    { icon: Star,         value: dashboardStats?.avg_rating ?? "4.9/5",           label: "Average Rating",     trend: "★ Top" },
  ];

  // ── Loading ───────────────────────────────────────────────────────────────
  if (coursesLoading) {
    return (
      <section className="py-20" style={{ backgroundColor: C.surface }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-10 text-center space-y-3">
            <div className="h-5 w-36 bg-slate-200 rounded-full animate-pulse mx-auto" />
            <div className="h-10 w-80 bg-slate-200 rounded animate-pulse mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (coursesError) {
    return (
      <section className="py-20 flex items-center justify-center" style={{ backgroundColor: C.surface }}>
        <div className="text-center max-w-sm px-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-[#1F2937] mb-2">Couldn't load programs</h2>
          <p className="text-sm text-slate-500 mb-6">Check your connection and try again.</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#5F789E] hover:bg-[#3D3F8C] text-white px-6 py-2.5 rounded-xl"
          >
            Retry
          </Button>
        </div>
      </section>
    );
  }

  // ── Main ──────────────────────────────────────────────────────────────────
  return (
    <section className="py-20 lg:py-28 relative" style={{ backgroundColor: C.surface }}>

      {/* Subtle background texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${C.charcoal} 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">

        {/* ══════ SECTION HEADER ══════════════════════════════════════════════ */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              {/* Eyebrow */}
              <motion.div variants={fadeUp} className="flex items-center gap-2 mb-4">
                <div className="h-px w-8 bg-[#F2C94C]" />
                <span
                  className="text-[11px] font-bold tracking-[0.18em] uppercase"
                  style={{ color: C.steel }}
                >
                  Featured Programs
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                variants={fadeUp}
                custom={1}
                className="text-4xl md:text-5xl font-bold text-[#1F2937] leading-tight"
              >
                Most Popular{" "}
                <span
                  className="relative inline-block"
                  style={{
                    background: `linear-gradient(135deg, ${C.steel}, ${C.indigo})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Certifications
                </span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="mt-3 text-[15px] text-slate-500 max-w-xl leading-relaxed"
              >
                Industry-aligned programs built with Google, Microsoft & AWS. Join 5,000+ professionals who transformed their careers.
              </motion.p>
            </div>

            {/* Trust logos */}
            <motion.div variants={fadeUp} custom={3} className="flex items-center gap-4 flex-shrink-0">
              {["Google", "Microsoft", "AWS", "Meta"].map(co => (
                <div
                  key={co}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg border border-slate-100 shadow-sm"
                >
                  <Briefcase className="w-3 h-3 text-slate-400" />
                  <span className="text-[11px] font-semibold text-slate-500">{co}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* ══════ STATS ROW ════════════════════════════════════════════════════ */}
        {!statsLoading && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14"
          >
            {stats.map(s => (
              <StatPill key={s.label} icon={s.icon} value={s.value} label={s.label} trend={s.trend} />
            ))}
          </motion.div>
        )}

        {/* ══════ COURSE GRID ══════════════════════════════════════════════════ */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          {displayedCourses.length > 0 ? (
            displayedCourses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))
          ) : (
            <div className="col-span-4 py-20 text-center">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No programs available yet.</p>
            </div>
          )}
        </motion.div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <Link to="/courses">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border-2 text-[14px] font-semibold transition-all duration-200 hover:shadow-lg"
              style={{ borderColor: C.steel, color: C.steel }}
            >
              <Rocket className="w-4 h-4" />
              Explore All Programs
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </Link>
        </motion.div>

        {/* ══════ CTA BANNER ═══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${C.charcoal} 0%, ${C.indigo} 60%, ${C.steel} 100%)` }}
        >
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${C.gold}, transparent 70%)`, transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${C.steel}, transparent 70%)`, transform: "translate(-30%, 30%)" }} />

          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "28px 28px",
            }} />

          <div className="relative px-8 py-14 lg:px-16 lg:py-16 z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

              {/* Left: text */}
              <div className="lg:w-3/5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm mb-5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F2C94C]" />
                  <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/80">
                    Limited Seats Available
                  </span>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
                >
                  Ready to Transform
                  <br />
                  <span style={{ color: C.gold }}>Your Career?</span>
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-[15px] text-white/70 max-w-lg mb-8 leading-relaxed"
                >
                  Join 5,000+ professionals who accelerated their careers with our industry-recognised certification programs.
                </motion.p>

                {/* Proof points */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35 }}
                  className="flex flex-wrap gap-x-6 gap-y-2 mb-8"
                >
                  {["98% placement rate", "1:1 mentoring", "Job-ready projects", "Certificate included"].map(p => (
                    <div key={p} className="flex items-center gap-1.5 text-[13px] text-white/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#F2C94C] flex-shrink-0" />
                      {p}
                    </div>
                  ))}
                </motion.div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/courses">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        size="lg"
                        className="h-12 px-8 bg-[#F2C94C] hover:bg-[#E0B83A] text-[#1F2937] font-bold rounded-xl shadow-lg transition-all duration-200"
                      >
                        Browse All Programs
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/consultation">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-12 px-8 border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl transition-all duration-200"
                      >
                        Free Consultation
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </div>

              {/* Right: mini-stat grid */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.55 }}
                className="lg:w-2/5 w-full"
              >
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { Icon: BookOpen, value: "50+",  label: "Programs"  },
                    { Icon: Trophy,   value: "98%",  label: "Placement" },
                    { Icon: Users,    value: "5k+",  label: "Students"  },
                    { Icon: Award,    value: "4.9★", label: "Rating"    },
                  ].map(({ Icon, value, label }) => (
                    <div
                      key={label}
                      className="rounded-2xl p-5 text-center border border-white/10 bg-white/8 backdrop-blur-sm"
                    >
                      <Icon className="w-5 h-5 mx-auto mb-2 text-[#F2C94C]" />
                      <div className="text-2xl font-bold text-white">{value}</div>
                      <div className="text-[11px] text-white/60 mt-0.5 font-medium">{label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularCourses;