// src/components/home/TestimonialsSection.tsx
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, X, Star, ChevronLeft, ChevronRight,
  GraduationCap, Briefcase, TrendingUp, Users,
  Clock, Quote, CheckCircle2, ExternalLink, Loader2, RotateCcw
} from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import { apiService } from "@/services/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  companyLogo?: string;
  rating: number;
  videoUrl: string;
  thumbnail: string;
  quote: string;
  duration: string;
  graduationDate: string;
  salaryIncrease: string;
  placementTime: string;
  badges: string[];
  accentColor: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const VIDEOS_PER_PAGE = 6;

const ACCENT_COLORS: Record<string, string> = {
  "Web Development": "#2563EB",
  "Data Science": "#D97706",
  "DevOps": "#0891B2",
  "Cloud Computing": "#0369A1",
  "Cybersecurity": "#DC2626",
  "AI/ML": "#7C3AED",
  "UX Design": "#DB2777",
};

const FILTERS = [
  { value: "all", label: "All" },
  { value: "recent", label: "2024" },
  { value: "developer", label: "Engineering" },
  { value: "data scientist", label: "Data Science" },
  { value: "devops", label: "DevOps" },
  { value: "designer", label: "Design" },
];

const STATS = [
  { icon: GraduationCap, value: "5,000+", label: "Graduates", sub: "since 2018" },
  { icon: Briefcase, value: "94.7%", label: "Placement Rate", sub: "within 3 months" },
  { icon: TrendingUp, value: "↑45%", label: "Avg. Salary Hike", sub: "median across all tracks" },
  { icon: Users, value: "4.9 / 5", label: "Student Rating", sub: "from 3,200+ reviews" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getAccentColor = (category: string) => ACCENT_COLORS[category] ?? "#2563EB";

const getMockTestimonials = (): Testimonial[] => [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Full Stack Engineer",
    company: "Google",
    rating: 5,
    videoUrl: "https://player.vimeo.com/video/824804225?h=0658d46638",
    thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=80",
    quote: "The hands-on projects and dedicated mentorship gave me the skills and confidence I needed to land a role I genuinely love.",
    duration: "2:45",
    graduationDate: "2023",
    salaryIncrease: "85%",
    placementTime: "3 wks",
    badges: ["React", "Node.js", "AWS"],
    accentColor: "#2563EB",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Senior Data Scientist",
    company: "Amazon",
    rating: 5,
    videoUrl: "https://player.vimeo.com/video/824804225?h=0658d46638",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
    quote: "Curriculum was perfectly matched to what hiring managers actually test for. I received three offers in my first two weeks.",
    duration: "3:20",
    graduationDate: "2023",
    salaryIncrease: "120%",
    placementTime: "2 wks",
    badges: ["Python", "TensorFlow", "Spark"],
    accentColor: "#D97706",
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "DevOps Lead",
    company: "Microsoft",
    rating: 5,
    videoUrl: "https://player.vimeo.com/video/824804225?h=0658d46638",
    thumbnail: "https://images.unsplash.com/photo-1494790108755-2616b786d4c0?w=800&auto=format&fit=crop&q=80",
    quote: "Real-world infrastructure projects made technical interviews feel easy. I was prepared for challenges others hadn't even heard of.",
    duration: "4:15",
    graduationDate: "2024",
    salaryIncrease: "95%",
    placementTime: "1 wk",
    badges: ["Kubernetes", "Terraform", "CI/CD"],
    accentColor: "#0891B2",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Product Designer",
    company: "Apple",
    rating: 5,
    videoUrl: "https://player.vimeo.com/video/824804225?h=0658d46638",
    thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80",
    quote: "Portfolio reviews from working designers gave me feedback I couldn't have gotten anywhere else. Changed my career trajectory entirely.",
    duration: "3:45",
    graduationDate: "2024",
    salaryIncrease: "70%",
    placementTime: "4 wks",
    badges: ["Figma", "Design Systems", "Prototyping"],
    accentColor: "#DB2777",
  },
  {
    id: 5,
    name: "Aisha Okonkwo",
    role: "ML Engineer",
    company: "Meta",
    rating: 5,
    videoUrl: "https://player.vimeo.com/video/824804225?h=0658d46638",
    thumbnail: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&auto=format&fit=crop&q=80",
    quote: "From career-changer to ML Engineer at Meta in 6 months. The structured learning path and 1-on-1 mentorship made it possible.",
    duration: "3:10",
    graduationDate: "2024",
    salaryIncrease: "150%",
    placementTime: "2 wks",
    badges: ["PyTorch", "MLOps", "LLMs"],
    accentColor: "#7C3AED",
  },
  {
    id: 6,
    name: "James Okafor",
    role: "Cloud Architect",
    company: "Stripe",
    rating: 5,
    videoUrl: "https://player.vimeo.com/video/824804225?h=0658d46638",
    thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=80",
    quote: "The capstone project I built here is what Stripe's hiring panel kept bringing up during my loop. It genuinely set me apart.",
    duration: "2:55",
    graduationDate: "2023",
    salaryIncrease: "110%",
    placementTime: "3 wks",
    badges: ["AWS", "GCP", "Distributed Systems"],
    accentColor: "#0369A1",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
      />
    ))}
  </div>
);

const Badge = ({ label }: { label: string }) => (
  <span className="inline-block px-2.5 py-1 text-[11px] font-medium tracking-wide text-gray-500 bg-gray-100 rounded-md border border-gray-200/80">
    {label}
  </span>
);

interface VideoCardProps {
  testimonial: Testimonial;
  index: number;
  onClick: (id: number) => void;
}

const VideoCard = ({ testimonial, index, onClick }: VideoCardProps) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer
                 hover:border-gray-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.09)]
                 transition-all duration-300 ease-out"
      onClick={() => onClick(testimonial.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(testimonial.id)}
      aria-label={`Play testimonial from ${testimonial.name}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-900 overflow-hidden">
        {!imgError ? (
          <img
            src={testimonial.thumbnail}
            alt={`${testimonial.name} testimonial thumbnail`}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-4xl font-bold text-gray-600">{testimonial.name[0]}</span>
          </div>
        )}

        {/* Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/95 backdrop-blur-sm shadow-sm"
            style={{ color: testimonial.accentColor }}
          >
            {testimonial.company}
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-[11px] text-white/90">
            <Clock className="w-3 h-3" />
            {testimonial.duration}
          </span>
        </div>

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-14 h-14 rounded-full bg-white/95 shadow-xl flex items-center justify-center
                          transition-transform duration-300 ease-out group-hover:scale-110">
            <Play className="w-5 h-5 text-gray-900 ml-0.5 fill-gray-900" />
          </div>
          {/* Ripple */}
          <div className="absolute w-14 h-14 rounded-full bg-white/30 animate-ping" />
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Person */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm"
              style={{ backgroundColor: testimonial.accentColor }}
            >
              {testimonial.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">{testimonial.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{testimonial.role}</p>
            </div>
          </div>
          <StarRating rating={testimonial.rating} />
        </div>

        {/* Quote */}
        <blockquote className="relative mb-4">
          <Quote className="absolute -top-1 -left-0.5 w-5 h-5 text-gray-200 fill-gray-200" />
          <p className="pl-5 text-[13px] text-gray-600 leading-relaxed line-clamp-3">
            {testimonial.quote}
          </p>
        </blockquote>

        {/* Metrics row */}
        <div className="flex items-center gap-3 mb-4 py-3 border-t border-b border-gray-100">
          <div className="flex-1 text-center">
            <p className="text-sm font-bold text-emerald-600">+{testimonial.salaryIncrease}</p>
            <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">Salary</p>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="flex-1 text-center">
            <p className="text-sm font-bold text-blue-600">{testimonial.placementTime}</p>
            <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">Placed</p>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="flex-1 text-center">
            <p className="text-sm font-bold text-gray-700">'{testimonial.graduationDate.slice(-2)}</p>
            <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">Grad</p>
          </div>
        </div>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-1.5">
          {testimonial.badges.map((b) => (
            <Badge key={b} label={b} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          Verified graduate
        </div>
        <div className="flex items-center gap-1 text-[11px] text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Watch story <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </motion.article>
  );
};

// ─── Video Modal ──────────────────────────────────────────────────────────────
interface ModalProps {
  testimonial: Testimonial;
  onClose: () => void;
}

const VideoModal = ({ testimonial, onClose }: ModalProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm
                     text-white flex items-center justify-center hover:bg-black/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Video */}
        <div className="relative aspect-video bg-black">
          <iframe
            src={`${testimonial.videoUrl}&autoplay=1`}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
            title={`${testimonial.name} testimonial`}
          />
        </div>

        {/* Info */}
        <div className="p-6 md:p-8">
          <div className="flex items-start gap-4 mb-5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
              style={{ backgroundColor: testimonial.accentColor }}
            >
              {testimonial.name[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: `${testimonial.accentColor}15`, color: testimonial.accentColor }}
                >
                  {testimonial.company}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{testimonial.role}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <StarRating rating={testimonial.rating} />
                <span className="text-xs text-gray-400">Verified Graduate</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="hidden sm:flex items-center gap-6 text-center">
              <div>
                <p className="text-lg font-bold text-emerald-600">+{testimonial.salaryIncrease}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Salary</p>
              </div>
              <div>
                <p className="text-lg font-bold text-blue-600">{testimonial.placementTime}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Placed</p>
              </div>
            </div>
          </div>

          <blockquote
            className="relative p-5 rounded-xl text-[15px] text-gray-700 leading-relaxed border-l-4"
            style={{ borderLeftColor: testimonial.accentColor, backgroundColor: `${testimonial.accentColor}08` }}
          >
            <Quote className="absolute top-3 right-4 w-8 h-8 opacity-10" style={{ color: testimonial.accentColor }} />
            "{testimonial.quote}"
          </blockquote>

          <div className="flex flex-wrap gap-2 mt-5">
            {testimonial.badges.map((b) => <Badge key={b} label={b} />)}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");
  const sectionRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getVideoTestimonials(9);
      const mapped: Testimonial[] = response.map((item: any) => ({
        id: item.id,
        name: item.student_name,
        role: item.student_role,
        company: item.student_company,
        rating: item.rating,
        videoUrl: item.video_url,
        thumbnail: item.video_thumbnail || item.student_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.student_name)}&background=random`,
        quote: item.content,
        duration: item.video_duration || "3:00",
        graduationDate: item.completion_year?.toString() || "2023",
        salaryIncrease: item.salary_hike || "85%",
        placementTime: item.placement_time || "3 wks",
        badges: item.badges || [item.category_name].filter(Boolean),
        accentColor: getAccentColor(item.category_name),
      }));
      setTestimonials(mapped);
    } catch {
      setError("Unable to load testimonials right now.");
      setTestimonials(getMockTestimonials());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  const filtered = testimonials.filter((t) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "recent") return ["2023", "2024"].includes(t.graduationDate);
    return t.role.toLowerCase().includes(activeFilter) || t.company.toLowerCase().includes(activeFilter);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / VIDEOS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * VIDEOS_PER_PAGE, currentPage * VIDEOS_PER_PAGE);

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <section className="py-24 bg-white flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="w-7 h-7 animate-spin" />
          <p className="text-sm">Loading success stories…</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        ref={sectionRef}
        className="relative py-20 md:py-28 bg-[#FAFAFA] overflow-hidden"
        aria-label="Student Testimonials"
      >
        {/* Subtle dot grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.45,
          }}
        />
        {/* Soft radial vignette over grid */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_40%,#FAFAFA_100%)]" />

        <div className="relative container mx-auto px-4 max-w-7xl">
          {/* ── Header ── */}
          <div className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full
                               bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold tracking-wider uppercase">
                <GraduationCap className="w-3.5 h-3.5" />
                Verified Outcomes
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
                From classroom to career—<br className="hidden sm:block" />
                <span className="text-blue-600">hear it from our graduates</span>
              </h2>
              <p className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Real results from real people. Every story below is from a verified graduate who completed
                our program and transitioned into a high-impact tech role.
              </p>
            </motion.div>
          </div>

          {/* ── Stats ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-12"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.07 }}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <s.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 leading-none">{s.value}</p>
                </div>
                <p className="text-sm font-semibold text-gray-700">{s.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Filters ── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-10 justify-center"
            role="tablist"
            aria-label="Filter testimonials"
          >
            {FILTERS.map((f) => (
              <button
                key={f.value}
                role="tab"
                aria-selected={activeFilter === f.value}
                onClick={() => handleFilterChange(f.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeFilter === f.value
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>

          {/* ── Error banner (non-blocking) ── */}
          {error && (
            <div className="mb-6 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
              <span>{error} Showing sample data.</span>
              <button onClick={fetchData} className="flex items-center gap-1.5 font-semibold hover:underline shrink-0">
                <RotateCcw className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          )}

          {/* ── Grid ── */}
          {paginated.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mb-12">
              {paginated.map((t, i) => (
                <VideoCard key={t.id} testimonial={t} index={i} onClick={(id) => {
                  const found = testimonials.find((x) => x.id === id);
                  if (found) setSelected(found);
                }} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 mb-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm">No testimonials match this filter.</p>
            </div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mb-16">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center
                           hover:border-blue-400 hover:bg-blue-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  aria-label={`Page ${i + 1}`}
                  aria-current={currentPage === i + 1 ? "page" : undefined}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white shadow-sm"
                      : "border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center
                           hover:border-blue-400 hover:bg-blue-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}

          {/* ── CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl bg-blue-600 overflow-hidden"
          >
            {/* Subtle noise texture overlay */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }}
            />
            <div className="relative px-8 py-12 md:px-16 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Ready to write your own story?
                </h3>
                <p className="text-blue-100 text-sm md:text-base max-w-md">
                  Join 5,000+ graduates who accelerated their tech careers with structured learning and real mentorship.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href="/testimonials"
                  className="px-6 py-3 rounded-xl bg-white text-blue-700 text-sm font-semibold hover:bg-blue-50 transition-colors text-center"
                >
                  View all stories
                </a>
                <a
                  href="/contact"
                  className="px-6 py-3 rounded-xl border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-colors text-center"
                >
                  Book a free call
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Modal ── */}
      <AnimatePresence>
        {selected && (
          <VideoModal
            key="modal"
            testimonial={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default TestimonialsSection;