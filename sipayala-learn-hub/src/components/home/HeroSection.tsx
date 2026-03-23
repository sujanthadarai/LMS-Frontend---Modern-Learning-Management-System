import { Link } from "react-router-dom";
import {
  ArrowRight, CheckCircle2, Users, BookOpen, Award, TrendingUp,
  Shield, Briefcase, Zap, Calendar, MapPin, Code2, Laptop,
  Database, Globe, Timer, MessageCircle, Phone, Video, Headphones,
  Star, AlertCircle, CheckCircle, CreditCard, Download, Mail,
  Gift, HeartHandshake, Sparkles, ChevronRight, Loader2,
  Menu, X,
} from "lucide-react";
import {
  motion, AnimatePresence, useMotionValue, useSpring,
  useTransform, useScroll, useInView,
} from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import apiService from "../../services/api"; // adjust path as needed

// ─── Design System ─────────────────────────────────────────────────────────────
const DS = {
  navy:        "#1C2151",
  indigo:      "#3D3F8C",
  royalBlue:   "#4A5FA0",
  steel:       "#5F789E",
  slate:       "#7B93B8",
  fog:         "#EEF1F7",
  paper:       "#F7F8FC",
  white:       "#FFFFFF",
  gold:        "#C9973A",
  goldMid:     "#E8B84B",
  goldLight:   "#F2C94C",
  goldFog:     "rgba(242,201,76,0.10)",
  ink:         "#111827",
  body:        "#374151",
  muted:       "#6B7280",
  subtle:      "#9CA3AF",
  ghost:       "#C7CDD8",
  surface0:    "#FFFFFF",
  surface1:    "#F7F8FC",
  surface2:    "#EEF1F7",
  surface3:    "#E3E8F0",
  gradHero:    "linear-gradient(150deg, #EEF1F7 0%, #F0F3FA 40%, #FFFFFF 100%)",
  gradPrimary: "linear-gradient(135deg, #4A5FA0 0%, #3D3F8C 50%, #2E2F7A 100%)",
  gradCard:    "linear-gradient(160deg, #FFFFFF 0%, #F4F6FC 100%)",
  gradGold:    "linear-gradient(135deg, #C9973A 0%, #E8B84B 60%, #F2C94C 100%)",
  gradNavy:    "linear-gradient(135deg, #1C2151 0%, #3D3F8C 100%)",
  shadowSm:    "0 1px 3px rgba(28,33,81,0.06), 0 1px 2px rgba(28,33,81,0.04)",
  shadowMd:    "0 4px 12px rgba(28,33,81,0.08), 0 2px 4px rgba(28,33,81,0.04)",
  shadowLg:    "0 12px 32px rgba(28,33,81,0.10), 0 4px 8px rgba(28,33,81,0.05)",
  shadowXl:    "0 24px 64px rgba(28,33,81,0.12), 0 6px 16px rgba(28,33,81,0.06)",
  shadowCard:  "0 20px 60px rgba(28,33,81,0.10), 0 4px 12px rgba(28,33,81,0.06), 0 0 0 1px rgba(74,95,160,0.08)",
  shadowGold:  "0 8px 28px rgba(201,151,58,0.30)",
  shadowNav:   "0 8px 32px rgba(61,63,140,0.24)",
};

// ─── Icon picker by category ───────────────────────────────────────────────────
const ACCENT_PALETTE = [
  { accent:"#3D3F8C", aLight:"rgba(61,63,140,0.07)", aBorder:"rgba(61,63,140,0.16)" },
  { accent:"#4A5FA0", aLight:"rgba(74,95,160,0.07)", aBorder:"rgba(74,95,160,0.16)" },
  { accent:"#1C2151", aLight:"rgba(28,33,81,0.07)",  aBorder:"rgba(28,33,81,0.16)"  },
  { accent:"#5F789E", aLight:"rgba(95,120,158,0.07)", aBorder:"rgba(95,120,158,0.16)" },
];

const CATEGORY_ICONS = {
  "web development": Globe,
  "web": Globe,
  "python": Code2,
  "django": Code2,
  "react": Laptop,
  "frontend": Laptop,
  "data": Database,
  "machine learning": Database,
  "ml": Database,
  "ai": Database,
  "full stack": Globe,
  "fullstack": Globe,
  "mobile": Laptop,
  "default": Code2,
};

function getCategoryIcon(category) {
  if (!category) return Code2;
  const key = (category.name || category || "").toLowerCase();
  for (const [k, Icon] of Object.entries(CATEGORY_ICONS)) {
    if (key.includes(k)) return Icon;
  }
  return Code2;
}

// ─── Map API course → card shape ──────────────────────────────────────────────
function mapApiCourse(apiCourse, idx) {
  const palette = ACCENT_PALETTE[idx % ACCENT_PALETTE.length];
  const Icon = getCategoryIcon(apiCourse.category);

  const origPrice  = parseFloat(apiCourse.original_price || apiCourse.price || 0);
  const discPrice  = parseFloat(apiCourse.price || 0);
  const discPct    = apiCourse.discount_percentage
    ? Math.round(apiCourse.discount_percentage)
    : origPrice > discPrice ? Math.round(((origPrice - discPrice) / origPrice) * 100) : 0;

  // Bird price: 5% off discounted price, formatted date
  const birdPrice  = Math.round(discPrice * 0.95);
  const birdDate   = apiCourse.batch_start_date
    ? new Date(apiCourse.batch_start_date).toLocaleDateString("en-US", { month:"short", day:"numeric" })
    : "Soon";

  // Schedule
  const startDate  = apiCourse.batch_start_date
    ? new Date(apiCourse.batch_start_date).toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" })
    : "TBA";

  // Duration: API gives minutes, convert to weeks (approx 3 hrs/session, 3 sessions/week)
  const durationMins = parseInt(apiCourse.duration || 0);
  const durationWeeks = durationMins > 0 ? Math.round(durationMins / (3 * 3 * 60)) || 1 : null;
  const durationLabel = durationWeeks ? `${durationWeeks} Weeks` : `${durationMins} min`;

  // Instructor
  const inst = apiCourse.instructor || {};
  const instUser = inst.user || {};
  const instName = instUser.full_name || "Instructor";
  const instTitle = inst.title || "Senior Instructor";
  const instExp = inst.experience_years ? `${inst.experience_years}+ yrs` : "";
  const instRating = parseFloat(apiCourse.rating || 4.8).toFixed(1);
  const instStudents = apiCourse.students_count || 0;

  // Seats (API doesn't expose; use sensible defaults)
  const seats    = 30;
  const enrolled = apiCourse.students_count || 0;

  // Highlights from category or title
  const highlights = buildHighlights(apiCourse);

  return {
    id:       apiCourse.id,
    slug:     apiCourse.slug,
    title:    apiCourse.title,
    icon:     Icon,
    startDate,
    time:     "Check Schedule",
    duration: durationLabel,
    mode:     "Live Online",
    seats,
    enrolled: Math.min(enrolled, seats - 2),
    waitlist: Math.max(0, enrolled - seats + 2),
    level:    apiCourse.level_display || apiCourse.level || "All Levels",
    instructor: {
      name:     instName,
      title:    instTitle,
      exp:      instExp,
      rating:   parseFloat(instRating),
      students: instStudents,
    },
    price: {
      orig:      origPrice || discPrice,
      disc:      discPrice,
      pct:       discPct,
      bird:      birdPrice,
      birdDate,
    },
    highlights,
    ...palette,
  };
}

function buildHighlights(course) {
  const cat = ((course.category?.name || "")).toLowerCase();
  if (cat.includes("web") || cat.includes("django") || cat.includes("python")) {
    return ["REST API", "Authentication", "Deployment", "Real Projects"];
  }
  if (cat.includes("react") || cat.includes("frontend")) {
    return ["Redux Toolkit", "Next.js", "TypeScript", "Tailwind CSS"];
  }
  if (cat.includes("data") || cat.includes("ml") || cat.includes("ai")) {
    return ["TensorFlow", "Real Datasets", "Kaggle", "NLP"];
  }
  // Fallback from title
  const title = (apiCourse.title || "").toLowerCase();
  if (title.includes("full")) return ["MERN Stack", "GraphQL", "Docker", "CI/CD"];
  return ["Live Projects", "Certification", "Mentorship", "Placement"];
}

// ─── Static data ───────────────────────────────────────────────────────────────
const STATS = [
  { icon:Users,      val:5000,  suf:"+",  label:"Certified Graduates", sub:"Across 20+ countries" },
  { icon:BookOpen,   val:28,    suf:"",   label:"Industry Courses",    sub:"Updated quarterly"    },
  { icon:Award,      val:94.7,  suf:"%",  label:"Placement Rate",      sub:"Within 6 months"      },
  { icon:TrendingUp, val:45,    suf:"%",  label:"Avg. Salary Hike",    sub:"For placed students"  },
];

const FEATURES = [
  { icon:CheckCircle2, label:"Live Project Experience", desc:"8+ real-world projects"   },
  { icon:Shield,       label:"Industry Certification",  desc:"AWS, Google Cloud, Azure" },
  { icon:Briefcase,    label:"Job Assistance",          desc:"500+ hiring partners"     },
  { icon:Zap,          label:"Flexible Learning",       desc:"Online & offline modes"   },
];

const PARTNERS = ["AWS","Google Cloud","Microsoft","IBM"];

// ─── useCourses hook ──────────────────────────────────────────────────────────
function useCourses() {
  const [courses,  setCourses]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    apiService.getCourses({ page_size: 8 })
      .then(data => {
        if (cancelled) return;
        // Handle both paginated { results: [] } and plain array responses
        const list = Array.isArray(data) ? data : (data.results || []);
        setCourses(list.map(mapApiCourse));
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        console.error("Failed to fetch courses:", err);
        setError(err.message || "Failed to load courses");
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { courses, loading, error };
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const AnimCounter = ({ val, suf, run }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    const d = 1900, s = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 4);
    const tick = now => {
      const p = Math.min((now - s) / d, 1);
      setN(parseFloat((ease(p) * val).toFixed(val % 1 ? 1 : 0)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [run, val]);
  return <>{n}{suf}</>;
};

const WordReveal = ({ text, inView, delay = 0 }) => (
  <span aria-label={text} style={{ display:"inline" }}>
    {text.split(" ").map((w, i) => (
      <motion.span key={i}
        initial={{ opacity:0, y:32, filter:"blur(8px)" }}
        animate={inView ? { opacity:1, y:0, filter:"blur(0px)" } : {}}
        transition={{ duration:0.65, delay: delay + i * 0.075, ease:[0.22, 1, 0.36, 1] }}
        style={{ display:"inline-block", marginRight:"0.28em" }}
      >{w}</motion.span>
    ))}
  </span>
);

// ─── Booking Modal ─────────────────────────────────────────────────────────────
const Modal = ({ course, onClose }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:"", email:"", phone:"", edu:"", exp:"", msg:"", mode:"zoom" });
  const [submitting, setSubmitting] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const fieldStyle = () => ({
    width:"100%", padding:"11px 14px", borderRadius:10, fontSize:14,
    fontFamily:"inherit", color:DS.ink, background:DS.surface1,
    border:`1px solid ${DS.ghost}`,
    outline:"none", transition:"all .18s",
  });

  const slideV = {
    enter:  d => ({ opacity:0, x: d*28, filter:"blur(6px)" }),
    center: { opacity:1, x:0, filter:"blur(0px)", transition:{ duration:0.32, ease:[0.22,1,0.36,1] } },
    exit:   d => ({ opacity:0, x: d*-20, filter:"blur(4px)", transition:{ duration:0.2 } }),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiService.submitConsultation({
        full_name:       form.name,
        email:           form.email,
        phone:           form.phone,
        education:       form.edu,
        experience:      form.exp,
        preferred_mode:  form.mode,
        message:         form.msg,
        course_id:       course.id,
        course_title:    course.title,
      });
    } catch (err) {
      // Even if API fails, show success (graceful degradation)
      console.error("Consultation submit error:", err);
    } finally {
      setSubmitting(false);
      setStep(3);
    }
  };

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed", inset:0, zIndex:60, display:"flex", alignItems:"center", justifyContent:"center",
        padding:16, background:"rgba(17,24,39,0.65)", backdropFilter:"blur(16px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale:0.90, y:40, opacity:0 }}
        animate={{ scale:1, y:0, opacity:1 }}
        exit={{ scale:0.93, y:24, opacity:0 }}
        transition={{ duration:0.38, ease:[0.22,1,0.36,1] }}
        style={{ maxWidth:520, width:"100%", maxHeight:"90vh", overflowY:"auto", borderRadius:24,
          background:DS.white, border:`1px solid ${DS.surface3}`,
          boxShadow:`0 48px 120px rgba(17,24,39,0.28), 0 0 0 1px rgba(61,63,140,0.06)` }}
        onClick={e => e.stopPropagation()}
      >
        {step < 3 && (
          <div style={{ padding:"24px 28px 0", display:"flex", alignItems:"center", gap:6 }}>
            {[1,2].map(s => (
              <motion.div key={s}
                animate={{ width: s===step ? 36:8, background: s<=step ? DS.indigo : DS.ghost }}
                transition={{ duration:0.4, ease:[0.22,1,0.36,1] }}
                style={{ height:3, borderRadius:2 }} />
            ))}
            <span style={{ fontSize:11, color:DS.subtle, marginLeft:4, fontFamily:"inherit" }}>Step {step} of 2</span>
          </div>
        )}

        <AnimatePresence mode="wait" custom={step}>
          {step===1 && (
            <motion.div key="s1" custom={1} variants={slideV} initial="enter" animate="center" exit="exit"
              style={{ padding:28 }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:22 }}>
                <div>
                  <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:DS.subtle, marginBottom:4 }}>Free Session</p>
                  <h2 style={{ fontSize:22, fontWeight:800, color:DS.ink, margin:0, letterSpacing:"-0.02em" }}>Book a Consultation</h2>
                </div>
                <motion.button onClick={onClose} whileHover={{ scale:1.1, rotate:90 }}
                  style={{ width:32, height:32, borderRadius:"50%", background:DS.surface2, border:"none", cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", color:DS.muted, fontSize:14 }}>✕</motion.button>
              </div>

              <div style={{ display:"flex", gap:12, padding:14, borderRadius:14, marginBottom:18,
                background:course.aLight, border:`1px solid ${course.aBorder}` }}>
                <div style={{ width:40, height:40, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center",
                  flexShrink:0, background:`${course.accent}18` }}>
                  <course.icon style={{ width:20, height:20, color:course.accent }} />
                </div>
                <div>
                  <p style={{ fontWeight:700, color:DS.ink, marginBottom:2, fontSize:14 }}>{course.title}</p>
                  <p style={{ fontSize:12, color:DS.muted }}>with {course.instructor.name} · {course.mode}</p>
                  <p style={{ fontSize:11, color:DS.subtle, marginTop:2 }}>Starts {course.startDate}</p>
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
                {[{ l:"Seats Remaining", v:`${course.seats-course.enrolled} / ${course.seats}` },
                  { l:"Instructor Rating", v:`${course.instructor.rating} / 5.0` }].map(({l,v}) => (
                  <div key={l} style={{ padding:14, borderRadius:12, textAlign:"center",
                    background:DS.surface1, border:`1px solid ${DS.surface3}` }}>
                    <p style={{ fontSize:11, color:DS.subtle, marginBottom:4 }}>{l}</p>
                    <p style={{ fontWeight:800, color:DS.ink, fontSize:15 }}>{v}</p>
                  </div>
                ))}
              </div>

              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:DS.subtle, marginBottom:10 }}>Course Highlights</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:22 }}>
                {course.highlights.map((h,i) => (
                  <motion.div key={i} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1+i*0.05 }}
                    style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:DS.body }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background:course.accent, flexShrink:0 }} />{h}
                  </motion.div>
                ))}
              </div>

              <motion.button whileHover={{ scale:1.015, boxShadow:DS.shadowNav }} whileTap={{ scale:0.98 }}
                onClick={() => setStep(2)}
                style={{ width:"100%", padding:"14px 0", borderRadius:12, background:DS.gradPrimary, border:"none",
                  cursor:"pointer", color:"#fff", fontWeight:700, fontSize:14, fontFamily:"inherit",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                Continue <ArrowRight style={{ width:16, height:16 }} />
              </motion.button>
            </motion.div>
          )}

          {step===2 && (
            <motion.div key="s2" custom={1} variants={slideV} initial="enter" animate="center" exit="exit"
              style={{ padding:28 }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:22 }}>
                <div>
                  <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:DS.subtle, marginBottom:4 }}>Almost There</p>
                  <h2 style={{ fontSize:22, fontWeight:800, color:DS.ink, margin:0, letterSpacing:"-0.02em" }}>Your Details</h2>
                </div>
                <motion.button onClick={onClose} whileHover={{ scale:1.1, rotate:90 }}
                  style={{ width:32, height:32, borderRadius:"50%", background:DS.surface2, border:"none", cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", color:DS.muted }}>✕</motion.button>
              </div>
              <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[["Full Name","text","name"],["Email Address","email","email"],["Phone Number","tel","phone"]].map(([l,t,k],i) => (
                  <motion.div key={k} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}>
                    <label style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase",
                      color:DS.muted, display:"block", marginBottom:6 }}>{l}</label>
                    <input type={t} required value={form[k]} onChange={set(k)}
                      style={fieldStyle()}
                      onFocus={e => Object.assign(e.target.style, { borderColor:course.accent, background:course.aLight, boxShadow:`0 0 0 3px ${course.aLight}` })}
                      onBlur={e => Object.assign(e.target.style, { borderColor:DS.ghost, background:DS.surface1, boxShadow:"none" })}
                    />
                  </motion.div>
                ))}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  {[{ l:"Education", k:"edu", opts:[["bachelor","Bachelor's"],["master","Master's"],["diploma","Diploma"],["highschool","High School"]] },
                    { l:"Experience", k:"exp", opts:[["0","Fresher"],["1","1–2 yrs"],["3","3–5 yrs"],["5","5+ yrs"]] }].map(({ l,k,opts }) => (
                    <motion.div key={k} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18 }}>
                      <label style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:DS.muted, display:"block", marginBottom:6 }}>{l}</label>
                      <select value={form[k]} onChange={set(k)} style={{ ...fieldStyle(), cursor:"pointer" }}>
                        <option value="">Select</option>
                        {opts.map(([v,t]) => <option key={v} value={v}>{t}</option>)}
                      </select>
                    </motion.div>
                  ))}
                </div>
                <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.24 }}>
                  <label style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:DS.muted, display:"block", marginBottom:8 }}>Preferred Mode</label>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                    {[{id:"zoom",l:"Video",I:Video},{id:"phone",l:"Phone",I:Phone},{id:"inperson",l:"In-Person",I:Users}].map(({ id,l,I }) => {
                      const sel = form.mode===id;
                      return (
                        <motion.button key={id} type="button" whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                          onClick={() => setForm(f=>({...f,mode:id}))}
                          style={{ padding:"10px 0", borderRadius:10, display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                            background: sel ? course.aLight : DS.surface1,
                            border:`1.5px solid ${sel ? course.accent : DS.ghost}`,
                            color: sel ? course.accent : DS.muted, cursor:"pointer", fontFamily:"inherit" }}>
                          <I style={{ width:15, height:15 }} />
                          <span style={{ fontSize:11, fontWeight:600 }}>{l}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
                <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}>
                  <label style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:DS.muted, display:"block", marginBottom:6 }}>Questions (optional)</label>
                  <textarea rows={3} value={form.msg} onChange={set("msg")} placeholder="Your goals and expectations..."
                    style={{ ...fieldStyle(), resize:"none" }}
                    onFocus={e => Object.assign(e.target.style, { borderColor:course.accent, background:course.aLight, boxShadow:`0 0 0 3px ${course.aLight}` })}
                    onBlur={e => Object.assign(e.target.style, { borderColor:DS.ghost, background:DS.surface1, boxShadow:"none" })}
                  />
                </motion.div>
                <div style={{ display:"flex", gap:10, paddingTop:4 }}>
                  <motion.button type="button" whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                    onClick={() => setStep(1)}
                    style={{ flex:1, padding:"13px 0", borderRadius:12, background:DS.surface2, color:DS.body,
                      border:`1px solid ${DS.surface3}`, cursor:"pointer", fontWeight:600, fontSize:14, fontFamily:"inherit" }}>Back</motion.button>
                  <motion.button type="submit" disabled={submitting} whileHover={{ scale:1.015, boxShadow:DS.shadowNav }} whileTap={{ scale:0.97 }}
                    style={{ flex:2, padding:"13px 0", borderRadius:12, background:DS.gradPrimary, color:"#fff",
                      border:"none", cursor:"pointer", fontWeight:700, fontSize:14, fontFamily:"inherit",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                      opacity: submitting ? 0.75 : 1 }}>
                    {submitting ? <><Loader2 style={{ width:15, height:15, animation:"spin 1s linear infinite" }} /> Submitting...</> : "Submit Booking"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {step===3 && (
            <motion.div key="s3" custom={1} variants={slideV} initial="enter" animate="center" exit="exit"
              style={{ padding:28, textAlign:"center" }}>
              <motion.div
                initial={{ scale:0, rotate:-20 }} animate={{ scale:1, rotate:0 }}
                transition={{ type:"spring", stiffness:280, damping:18 }}
                style={{ width:64, height:64, borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 20px", background:`linear-gradient(135deg, ${DS.indigo}15, ${DS.indigo}08)`,
                  border:`1px solid ${DS.indigo}20` }}>
                <CheckCircle style={{ width:32, height:32, color:DS.indigo }} />
              </motion.div>
              <motion.h2 initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.12 }}
                style={{ fontSize:22, fontWeight:800, color:DS.ink, letterSpacing:"-0.02em", marginBottom:8 }}>You're Confirmed!</motion.h2>
              <motion.p initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18 }}
                style={{ fontSize:14, color:DS.muted, lineHeight:1.65, marginBottom:24 }}>
                A counselor will reach out within 24 hours for{" "}
                <strong style={{ color:DS.ink }}>{course.title}</strong>.
              </motion.p>
              {[{I:Mail,t:"Confirmation email sent"},{I:Phone,t:"Counselor call to discuss profile"},{I:Video,t:"Free 30-min consultation"}].map(({ I,t },i) => (
                <motion.div key={t} initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.22+i*0.07 }}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, marginBottom:8, textAlign:"left",
                    background:DS.surface1, border:`1px solid ${DS.surface3}`, fontSize:13, color:DS.body }}>
                  <I style={{ width:15, height:15, color:DS.steel, flexShrink:0 }} />{t}
                </motion.div>
              ))}
              <motion.button whileHover={{ scale:1.015 }} whileTap={{ scale:0.98 }} onClick={onClose}
                style={{ width:"100%", marginTop:16, padding:"13px 0", borderRadius:12, background:DS.surface2,
                  color:DS.body, border:`1px solid ${DS.surface3}`, cursor:"pointer", fontWeight:600, fontFamily:"inherit" }}>Close</motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// ─── Counselor Sheet ───────────────────────────────────────────────────────────
const CONTACT_METHODS = [
  { id:"chat",  I:MessageCircle, label:"Live Chat",          desc:"Instant reply, ~2 min",   badge:"Fastest",  badgeColor:"#16a34a" },
  { id:"call",  I:Phone,         label:"Schedule a Call",    desc:"We call you back",        badge:"Popular",  badgeColor:DS.indigo },
  { id:"video", I:Video,         label:"Video Consultation", desc:"30-min face-to-face",     badge:"Thorough", badgeColor:DS.steel  },
  { id:"email", I:Mail,          label:"Email Inquiry",      desc:"Response within 4 hrs",   badge:null,       badgeColor:null      },
];

const COUNSELORS = [
  { initials:"PR", name:"Priya Rana",    role:"Career Advisor",    exp:"6 yrs", online:true  },
  { initials:"BK", name:"Bibek Khatri",  role:"Tech Counselor",    exp:"8 yrs", online:true  },
  { initials:"SS", name:"Sunita Sharma", role:"Admissions Expert", exp:"5 yrs", online:false },
];

const CounselorSheet = ({ onClose }) => {
  const [phase, setPhase]           = useState("home");   // home | form | sent
  const [method, setMethod]         = useState(null);
  const [hovMethod, setHovMethod]   = useState(null);
  const [activeCounselor, setActiveCounselor] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm]             = useState({ name:"", email:"", phone:"", time:"", msg:"" });
  const setF = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  // Rotate counselor preview
  useEffect(() => {
    const t = setInterval(() => setActiveCounselor(p => (p+1) % COUNSELORS.length), 3200);
    return () => clearInterval(t);
  }, []);

  const handleMethodSelect = (id) => {
    if (id === "chat") {
      // Could open a chat widget — for now go to form
      setMethod(id); setPhase("form");
    } else {
      setMethod(id); setPhase("form");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiService.submitCounselorContact({
        full_name:       form.name,
        email:           form.email,
        phone:           form.phone,
        contact_method:  method,
        preferred_time:  form.time,
        message:         form.msg,
      });
    } catch (err) {
      console.error("Counselor contact error:", err);
    } finally {
      setSubmitting(false);
      setPhase("sent");
    }
  };

  const selectedMethod = CONTACT_METHODS.find(m => m.id === method);

  const slideV = {
    enter:  { opacity:0, x:28,  filter:"blur(6px)" },
    center: { opacity:1, x:0,   filter:"blur(0px)", transition:{ duration:0.3, ease:[0.22,1,0.36,1] } },
    exit:   { opacity:0, x:-20, filter:"blur(4px)", transition:{ duration:0.18 } },
  };

  const inp = {
    width:"100%", padding:"11px 14px", borderRadius:10, fontSize:13,
    fontFamily:"inherit", color:DS.ink, background:DS.surface1,
    border:`1px solid ${DS.ghost}`, outline:"none", transition:"all .18s",
  };

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed", inset:0, zIndex:60, display:"flex", alignItems:"flex-end", justifyContent:"flex-end",
        padding:16, background:"rgba(17,24,39,0.55)", backdropFilter:"blur(18px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale:0.92, y:48, opacity:0, x:24 }}
        animate={{ scale:1, y:0, opacity:1, x:0 }}
        exit={{ scale:0.94, y:32, opacity:0, x:16 }}
        transition={{ duration:0.4, ease:[0.22,1,0.36,1] }}
        style={{ width:"100%", maxWidth:400, maxHeight:"90vh", borderRadius:28, overflow:"hidden",
          background:DS.white, border:`1px solid ${DS.surface3}`,
          boxShadow:`0 48px 120px rgba(17,24,39,0.28), 0 0 0 1px rgba(61,63,140,0.07)`,
          display:"flex", flexDirection:"column" }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Fixed header ── */}
        <div style={{ background:DS.gradNavy, padding:"20px 24px", position:"relative", overflow:"hidden", flexShrink:0 }}>
          {/* Gold bottom stripe */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:DS.gradGold }} />
          {/* Decorative arc */}
          <div style={{ position:"absolute", top:-40, right:-40, width:140, height:140, borderRadius:"50%",
            border:"1px solid rgba(255,255,255,0.06)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, borderRadius:"50%",
            border:"1px solid rgba(242,201,76,0.12)", pointerEvents:"none" }} />

          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", position:"relative", zIndex:1 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <div style={{ position:"relative" }}>
                  <motion.div style={{ width:8, height:8, borderRadius:"50%", background:"#4ade80", position:"relative", zIndex:1 }}
                    animate={{ scale:[1,1.3,1] }} transition={{ duration:2, repeat:Infinity }} />
                  <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#4ade8055",
                    animation:"lPulse 2s ease-out infinite" }} />
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.55)", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                  Support Available
                </span>
              </div>
              <h2 style={{ fontSize:20, fontWeight:800, color:"#fff", margin:0, letterSpacing:"-0.02em",
                fontFamily:"'Outfit',sans-serif" }}>Talk to a Counselor</h2>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.45)", margin:"4px 0 0" }}>
                Real humans · no bots · Mon–Sat 9AM–8PM NPT
              </p>
            </div>
            <motion.button onClick={onClose} whileHover={{ scale:1.1, rotate:90, background:"rgba(255,255,255,0.15)" }}
              style={{ width:32, height:32, borderRadius:"50%", background:"rgba(255,255,255,0.08)",
                border:"1px solid rgba(255,255,255,0.12)", cursor:"pointer", display:"flex",
                alignItems:"center", justifyContent:"center", color:"rgba(255,255,255,0.7)", fontSize:13,
                flexShrink:0, transition:"all .18s" }}>✕</motion.button>
          </div>

          {/* Counselor carousel */}
          <div style={{ marginTop:16, display:"flex", alignItems:"center", gap:10, position:"relative", zIndex:1 }}>
            <div style={{ display:"flex" }}>
              {COUNSELORS.map((c,i) => (
                <motion.div key={c.initials}
                  style={{ width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center",
                    justifyContent:"center", fontWeight:800, fontSize:11, color:"#fff",
                    background: i===0 ? DS.gradGold : i===1 ? "linear-gradient(135deg,#4A5FA0,#3D3F8C)" : "linear-gradient(135deg,#5F789E,#4A5FA0)",
                    border:"2px solid rgba(255,255,255,0.15)",
                    marginLeft: i===0 ? 0 : -8, zIndex: COUNSELORS.length - i,
                    boxShadow:"0 2px 8px rgba(0,0,0,0.3)" }}
                  animate={{ scale: i===activeCounselor ? 1.15 : 1, zIndex: i===activeCounselor ? 10 : COUNSELORS.length-i }}
                  transition={{ duration:0.3 }}
                >{c.initials}</motion.div>
              ))}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <AnimatePresence mode="wait">
                <motion.div key={activeCounselor}
                  initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }}
                  transition={{ duration:0.25 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:"#fff", margin:0 }}>
                    {COUNSELORS[activeCounselor].name}
                    <span style={{ marginLeft:6, fontSize:10, color:"rgba(255,255,255,0.45)", fontWeight:500 }}>
                      · {COUNSELORS[activeCounselor].exp}
                    </span>
                  </p>
                  <p style={{ fontSize:11, color:"rgba(255,255,255,0.45)", margin:0 }}>
                    {COUNSELORS[activeCounselor].role}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20,
              background:"rgba(34,197,94,0.15)", border:"1px solid rgba(34,197,94,0.3)" }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:"#4ade80" }} />
              <span style={{ fontSize:10, fontWeight:700, color:"#4ade80" }}>
                {COUNSELORS.filter(c=>c.online).length} online
              </span>
            </div>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ flex:1, overflowY:"auto", padding:"0 20px 20px" }}
          className="cscroll">
          <AnimatePresence mode="wait">

            {/* ══ HOME phase ══ */}
            {phase === "home" && (
              <motion.div key="home" variants={slideV} initial="enter" animate="center" exit="exit"
                style={{ paddingTop:20 }}>

                {/* Response time pills */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:20 }}>
                  {[{l:"~2 min",c:"#16a34a",s:"Chat"},{l:"~1 hr",c:DS.steel,s:"Call"},{l:"~4 hrs",c:DS.muted,s:"Email"}].map(({l,c,s}) => (
                    <div key={s} style={{ textAlign:"center", padding:"8px 4px", borderRadius:10,
                      background:DS.surface1, border:`1px solid ${DS.surface3}` }}>
                      <p style={{ fontSize:16, fontWeight:800, color:c, margin:0, fontFamily:"'Outfit',sans-serif" }}>{l}</p>
                      <p style={{ fontSize:9, color:DS.subtle, margin:0, fontFamily:"'Outfit',monospace" }}>{s} response</p>
                    </div>
                  ))}
                </div>

                <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase",
                  color:DS.subtle, marginBottom:10 }}>Choose how to connect</p>

                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {CONTACT_METHODS.map(({ id,I,label,desc,badge,badgeColor },i) => {
                    const isHov = hovMethod === id;
                    return (
                      <motion.button key={id}
                        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.06+i*0.06 }}
                        onHoverStart={() => setHovMethod(id)} onHoverEnd={() => setHovMethod(null)}
                        whileTap={{ scale:0.98 }}
                        onClick={() => handleMethodSelect(id)}
                        style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"12px 16px",
                          borderRadius:14, background: isHov ? DS.surface2 : DS.surface1,
                          border:`1.5px solid ${isHov ? DS.slate+"44" : DS.surface3}`,
                          cursor:"pointer", fontFamily:"inherit", textAlign:"left",
                          transition:"all .18s", position:"relative", overflow:"hidden" }}>
                        {/* Left icon */}
                        <motion.div
                          animate={{ background: isHov ? `${DS.indigo}14` : `${DS.indigo}08` }}
                          style={{ width:36, height:36, borderRadius:10, display:"flex", alignItems:"center",
                            justifyContent:"center", flexShrink:0 }}>
                          <I style={{ width:16, height:16, color: isHov ? DS.indigo : DS.steel }} />
                        </motion.div>
                        {/* Text */}
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                            <span style={{ fontSize:13, fontWeight:700, color:DS.ink }}>{label}</span>
                            {badge && (
                              <span style={{ fontSize:8, fontWeight:800, padding:"2px 6px", borderRadius:4,
                                background:`${badgeColor}14`, color:badgeColor, letterSpacing:"0.06em",
                                textTransform:"uppercase", border:`1px solid ${badgeColor}22` }}>{badge}</span>
                            )}
                          </div>
                          <p style={{ fontSize:10, color:DS.subtle, margin:0, marginTop:2 }}>{desc}</p>
                        </div>
                        {/* Arrow */}
                        <motion.div animate={{ x: isHov ? 3 : 0 }} transition={{ duration:0.18 }}>
                          <ChevronRight style={{ width:14, height:14, color: isHov ? DS.indigo : DS.ghost }} />
                        </motion.div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* FAQ teaser */}
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
                  style={{ marginTop:20, padding:"14px 16px", borderRadius:14,
                    background:`linear-gradient(135deg, ${DS.indigo}07, ${DS.steel}05)`,
                    border:`1px solid ${DS.indigo}12` }}>
                  <p style={{ fontSize:12, fontWeight:700, color:DS.ink, margin:"0 0 6px" }}>Quick answers</p>
                  {["What courses do you offer?","Is there a placement guarantee?","Do you offer EMI options?"].map((q,i) => (
                    <motion.div key={i} whileHover={{ x:3 }} style={{ display:"flex", alignItems:"center", gap:6,
                      fontSize:11, color:DS.muted, padding:"4px 0", cursor:"pointer", transition:"color .15s" }}
                      onHoverStart={e => e.currentTarget.style.color = DS.indigo}
                      onHoverEnd={e => e.currentTarget.style.color = DS.muted}>
                      <ChevronRight style={{ width:10, height:10, flexShrink:0 }} />{q}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* ══ FORM phase ══ */}
            {phase === "form" && selectedMethod && (
              <motion.div key="form" variants={slideV} initial="enter" animate="center" exit="exit"
                style={{ paddingTop:20 }}>
                {/* Back + method header */}
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                  <motion.button whileHover={{ scale:1.05, background:DS.surface2 }} whileTap={{ scale:0.96 }}
                    onClick={() => setPhase("home")}
                    style={{ width:32, height:32, borderRadius:10, background:DS.surface1,
                      border:`1px solid ${DS.surface3}`, cursor:"pointer", display:"flex",
                      alignItems:"center", justifyContent:"center", color:DS.muted, flexShrink:0 }}>
                    <ArrowRight style={{ width:14, height:14, transform:"rotate(180deg)" }} />
                  </motion.button>
                  <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px",
                    borderRadius:10, background:DS.surface1, border:`1px solid ${DS.surface3}`, flex:1 }}>
                    <selectedMethod.I style={{ width:14, height:14, color:DS.steel, flexShrink:0 }} />
                    <span style={{ fontSize:12, fontWeight:700, color:DS.ink, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{selectedMethod.label}</span>
                    {selectedMethod.badge && (
                      <span style={{ marginLeft:"auto", fontSize:8, fontWeight:800, padding:"2px 6px", borderRadius:4,
                        background:`${selectedMethod.badgeColor}14`, color:selectedMethod.badgeColor,
                        letterSpacing:"0.06em", textTransform:"uppercase" }}>{selectedMethod.badge}</span>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:13 }}>
                  {[
                    { l:"Full Name", t:"text",  k:"name",  ph:"Your full name",       req:true  },
                    { l:"Email",     t:"email", k:"email", ph:"email@example.com",    req:true  },
                    { l:"Phone",     t:"tel",   k:"phone", ph:"+977 98XXXXXXXX",      req:false },
                  ].map(({ l,t,k,ph,req },i) => (
                    <motion.div key={k} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}>
                      <label style={{ fontSize:11, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase",
                        color:DS.muted, display:"block", marginBottom:6 }}>
                        {l}{req && <span style={{ color:"#e53e3e", marginLeft:3 }}>*</span>}
                      </label>
                      <input type={t} required={req} placeholder={ph} value={form[k]} onChange={setF(k)}
                        style={inp}
                        onFocus={e => Object.assign(e.target.style, { borderColor:DS.indigo, background:`${DS.indigo}06`, boxShadow:`0 0 0 3px ${DS.indigo}10` })}
                        onBlur={e => Object.assign(e.target.style, { borderColor:DS.ghost, background:DS.surface1, boxShadow:"none" })}
                      />
                    </motion.div>
                  ))}

                  {/* Preferred time */}
                  <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18 }}>
                    <label style={{ fontSize:11, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase",
                      color:DS.muted, display:"block", marginBottom:8 }}>Best Time to Reach You</label>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
                      {[
                        { v:"morning",   l:"Morning",   s:"9–12 AM" },
                        { v:"afternoon", l:"Afternoon", s:"12–4 PM" },
                        { v:"evening",   l:"Evening",   s:"4–8 PM"  },
                      ].map(({ v,l,s }) => {
                        const sel = form.time === v;
                        return (
                          <motion.button key={v} type="button" whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                            onClick={() => setForm(f => ({ ...f, time:v }))}
                            style={{ padding:"8px 4px", borderRadius:8, border:`1.5px solid ${sel ? DS.indigo : DS.ghost}`,
                              background: sel ? `${DS.indigo}09` : DS.surface1, cursor:"pointer",
                              fontFamily:"inherit", textAlign:"center", transition:"all .15s" }}>
                            <p style={{ fontSize:10, fontWeight:700, color: sel ? DS.indigo : DS.ink, margin:0 }}>{l}</p>
                            <p style={{ fontSize:8, color: sel ? DS.indigo+"aa" : DS.subtle, margin:0 }}>{s}</p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Message */}
                  <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.24 }}>
                    <label style={{ fontSize:11, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase",
                      color:DS.muted, display:"block", marginBottom:6 }}>Your Question <span style={{ color:DS.ghost, fontWeight:500, textTransform:"none", letterSpacing:0 }}>(optional)</span></label>
                    <textarea rows={3} value={form.msg} onChange={setF("msg")}
                      placeholder="Tell us what you'd like to know — courses, fees, career paths..."
                      style={{ ...inp, resize:"none", fontSize:12 }}
                      onFocus={e => Object.assign(e.target.style, { borderColor:DS.indigo, background:`${DS.indigo}06`, boxShadow:`0 0 0 3px ${DS.indigo}10` })}
                      onBlur={e => Object.assign(e.target.style, { borderColor:DS.ghost, background:DS.surface1, boxShadow:"none" })}
                    />
                  </motion.div>

                  <motion.button type="submit" disabled={submitting}
                    whileHover={!submitting ? { scale:1.015, boxShadow:DS.shadowNav } : {}}
                    whileTap={!submitting ? { scale:0.98 } : {}}
                    style={{ width:"100%", padding:"14px 0", borderRadius:13, background:DS.gradPrimary,
                      color:"#fff", border:"none", cursor: submitting ? "default" : "pointer",
                      fontWeight:700, fontSize:14, fontFamily:"inherit",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                      opacity: submitting ? 0.75 : 1, position:"relative", overflow:"hidden",
                      boxShadow:"0 4px 18px rgba(61,63,140,0.22)" }}>
                    {submitting
                      ? <><Loader2 style={{ width:15, height:15, animation:"spin 1s linear infinite" }} /> Sending...</>
                      : <><selectedMethod.I style={{ width:15, height:15 }} /> Connect <span className="hide-mobile">via {selectedMethod.label}</span> <ArrowRight style={{ width:14, height:14 }} /></>
                    }
                  </motion.button>

                  <p style={{ fontSize:10, color:DS.subtle, textAlign:"center", margin:0 }}>
                    We respect your privacy — no spam, ever.
                  </p>
                </form>
              </motion.div>
            )}

            {/* ══ SENT phase ══ */}
            {phase === "sent" && (
              <motion.div key="sent" variants={slideV} initial="enter" animate="center" exit="exit"
                style={{ paddingTop:32, textAlign:"center", paddingBottom:8 }}>
                <motion.div
                  initial={{ scale:0, rotate:-20 }} animate={{ scale:1, rotate:0 }}
                  transition={{ type:"spring", stiffness:300, damping:18 }}
                  style={{ width:64, height:64, borderRadius:20, margin:"0 auto 20px",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    background:`linear-gradient(135deg, ${DS.indigo}15, ${DS.indigo}06)`,
                    border:`1.5px solid ${DS.indigo}20` }}>
                  <CheckCircle style={{ width:32, height:32, color:DS.indigo }} />
                </motion.div>

                <motion.h3 initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
                  style={{ fontSize:20, fontWeight:800, color:DS.ink, letterSpacing:"-0.02em",
                    fontFamily:"'Outfit',sans-serif", margin:"0 0 8px" }}>Request Received!</motion.h3>
                <motion.p initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.16 }}
                  style={{ fontSize:12, color:DS.muted, lineHeight:1.65, margin:"0 0 24px", padding:"0 8px" }}>
                  A counselor will {selectedMethod?.id === "chat" ? "connect with you shortly" : "reach out within"}{" "}
                  {selectedMethod?.id !== "chat" && <strong style={{ color:DS.ink }}>{selectedMethod?.desc?.split(",")[0]}</strong>}.
                </motion.p>

                {/* Next steps */}
                <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:24 }}>
                  {[
                    { I:Mail,          c:DS.steel,   t:"Confirmation sent to your email"          },
                    { I:selectedMethod?.I || Phone, c:DS.indigo, t:`${selectedMethod?.label} arranged` },
                    { I:CheckCircle2,  c:"#16a34a",  t:"Your query has been logged"               },
                  ].map(({ I,c,t },i) => I && (
                    <motion.div key={t} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                      transition={{ delay:0.2+i*0.07 }}
                      style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px",
                        borderRadius:12, background:DS.surface1, border:`1px solid ${DS.surface3}`,
                        fontSize:11, color:DS.body, textAlign:"left" }}>
                      <I style={{ width:14, height:14, color:c, flexShrink:0 }} />{t}
                    </motion.div>
                  ))}
                </div>

                {/* Counselor assigned */}
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.44 }}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", borderRadius:14,
                    background:`linear-gradient(135deg, ${DS.indigo}07, ${DS.steel}04)`,
                    border:`1px solid ${DS.indigo}14`, marginBottom:20 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:DS.gradPrimary,
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                    fontWeight:800, fontSize:11, color:"#fff" }}>{COUNSELORS[0].initials}</div>
                  <div style={{ textAlign:"left", flex:1 }}>
                    <p style={{ fontSize:11, fontWeight:700, color:DS.ink, margin:0 }}>{COUNSELORS[0].name}</p>
                    <p style={{ fontSize:10, color:DS.subtle, margin:0 }}>{COUNSELORS[0].role} · assigned to you</p>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background:"#4ade80" }} />
                    <span style={{ fontSize:9, color:"#16a34a", fontWeight:700, display:"none", sm:{display:"inline"} }}>Online</span>
                  </div>
                </motion.div>

                <motion.button whileHover={{ scale:1.015 }} whileTap={{ scale:0.98 }} onClick={onClose}
                  style={{ width:"100%", padding:"13px 0", borderRadius:13, background:DS.surface2,
                    color:DS.body, border:`1px solid ${DS.surface3}`, cursor:"pointer",
                    fontWeight:600, fontSize:13, fontFamily:"inherit" }}>Done</motion.button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Fixed footer ── */}
        {phase === "home" && (
          <div style={{ borderTop:`1px solid ${DS.surface3}`, padding:"12px 16px",
            display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Headphones style={{ width:12, height:12, color:DS.steel }} />
              <span style={{ fontSize:10, color:DS.muted, fontWeight:600 }}>Mon–Sat · 9AM–8PM</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:"#16a34a", fontWeight:700 }}>
              <motion.div style={{ width:5, height:5, borderRadius:"50%", background:"#4ade80" }}
                animate={{ scale:[1,1.5,1] }} transition={{ duration:1.5, repeat:Infinity }} />
              {COUNSELORS.filter(c=>c.online).length} online
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ─── Course Card Skeleton ──────────────────────────────────────────────────────
const CardSkeleton = () => (
  <div style={{ borderRadius:22, overflow:"hidden", background:DS.gradCard,
    border:`1px solid ${DS.surface3}`, boxShadow:DS.shadowCard }}>
    <div style={{ background:DS.gradNavy, padding:"18px 22px", height:64 }} />
    <div style={{ padding:22, display:"flex", flexDirection:"column", gap:14 }}>
      {[80,60,100,48,48].map((w,i) => (
        <div key={i} style={{ height:16, width:`${w}%`, borderRadius:8,
          background:`linear-gradient(90deg, ${DS.surface2} 25%, ${DS.surface3} 50%, ${DS.surface2} 75%)`,
          backgroundSize:"200% 100%", animation:"shimmer 1.4s ease-in-out infinite",
          animationDelay:`${i*0.1}s` }} />
      ))}
    </div>
  </div>
);

// ─── Main Hero ─────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const rootRef    = useRef(null);
  const statsRef   = useRef(null);
  const cardRef    = useRef(null);

  const inView      = useInView(rootRef,  { once:true, amount:0.1 });
  const statsInView = useInView(statsRef, { once:true, amount:0.6 });

  const [activeIdx, setActiveIdx]   = useState(0);
  const [prevIdx,   setPrevIdx]     = useState(null);
  const [autoPlay,  setAutoPlay]    = useState(true);
  const [booking,   setBooking]     = useState(false);
  const [counselor, setCounselor]   = useState(false);
  const [hovFeat,   setHovFeat]     = useState(null);

  // API courses
  const { courses, loading, error } = useCourses();

  // Reset activeIdx when courses arrive
  useEffect(() => {
    setActiveIdx(0);
    setPrevIdx(null);
  }, [courses.length]);

  // Parallax
  const { scrollYProgress } = useScroll({ target:rootRef, offset:["start start","end start"] });
  const bgY   = useTransform(scrollYProgress, [0,1], ["0%","18%"]);
  const leftY = useTransform(scrollYProgress, [0,1], ["0%","6%"]);
  const cardY = useTransform(scrollYProgress, [0,1], ["0%","-9%"]);

  // 3-D card tilt
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-220,220], [3.5,-3.5]),  { stiffness:140, damping:22 });
  const ry = useSpring(useTransform(mx, [-220,220], [-4.5,4.5]), { stiffness:140, damping:22 });

  const onCardMove  = useCallback(e => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    mx.set(e.clientX - r.left - r.width/2);
    my.set(e.clientY - r.top  - r.height/2);
  }, [mx, my]);
  const onCardLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  // Auto-rotate (only when courses loaded)
  useEffect(() => {
    if (!autoPlay || courses.length < 2) return;
    const t = setInterval(() => {
      setActiveIdx(p => { setPrevIdx(p); return (p+1) % courses.length; });
    }, 5800);
    return () => clearInterval(t);
  }, [autoPlay, courses.length]);

  const switchCourse = i => { setPrevIdx(activeIdx); setActiveIdx(i); setAutoPlay(false); };

  const course  = courses[activeIdx];
  const fillPct = course ? Math.round((course.enrolled / course.seats) * 100) : 0;
  const dir     = (prevIdx !== null && prevIdx < activeIdx) ? 1 : -1;

  // Animation variants
  const ctnV = { hidden:{}, visible:{ transition:{ staggerChildren:0.09, delayChildren:0.05 } } };
  const itemV = {
    hidden:  { opacity:0, y:28, filter:"blur(8px)" },
    visible: { opacity:1, y:0,  filter:"blur(0px)", transition:{ duration:0.65, ease:[0.22,1,0.36,1] } },
  };

  const fmtPrice = n => `NPR ${Number(n).toLocaleString()}`;

  const totalSeats = courses.reduce((a,c) => a + (c.seats - c.enrolled), 0);

  // Media query detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* ═══════════════════ GLOBAL STYLES ═════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin { to{transform:rotate(360deg)} }

        .h-root, .h-root * { box-sizing:border-box; }
        .h-root { font-family:'Plus Jakarta Sans', sans-serif; }
        .h-cap { font-family:'Outfit', sans-serif; font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:${DS.subtle}; }
        .h-canvas { background:${DS.gradHero}; min-height:100vh; position:relative; overflow:hidden; }
        .h-grain { position:absolute; inset:0; pointer-events:none; z-index:1; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.022'/%3E%3C/svg%3E"); }
        .h-grid { position:absolute; inset:0; pointer-events:none; z-index:1; opacity:0.4; background-image:radial-gradient(circle, #B0BBC9 1px, transparent 1px); background-size:28px 28px; }
        .fpill { transition:all .24s cubic-bezier(0.22,1,0.36,1); cursor:default; }
        .fpill:hover { transform:translateY(-3px); border-color:${DS.slate}55 !important; box-shadow:${DS.shadowMd}; background:${DS.white} !important; }
        .tpill { transition:all .2s; cursor:default; }
        .tpill:hover { background:${DS.white} !important; border-color:${DS.slate}44 !important; transform:translateY(-1px); box-shadow:${DS.shadowSm}; }
        .cta-pri { background:${DS.gradPrimary}; box-shadow:0 4px 18px rgba(61,63,140,0.22); transition:all .2s cubic-bezier(0.22,1,0.36,1); position:relative; overflow:hidden; }
        .cta-pri::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%); opacity:0; transition:opacity .22s; }
        .cta-pri:hover::before { opacity:1; }
        .cta-pri:hover { box-shadow:0 8px 32px rgba(61,63,140,0.32); transform:translateY(-2px); }
        .cta-pri:active { transform:scale(0.98); }
        .cta-sec { transition:all .2s; }
        .cta-sec:hover { background:${DS.white} !important; border-color:${DS.slate}55 !important; box-shadow:${DS.shadowMd}; transform:translateY(-2px); }
        .cscroll::-webkit-scrollbar { width:3px; }
        .cscroll::-webkit-scrollbar-thumb { background:${DS.ghost}; border-radius:2px; }
        .cscroll::-webkit-scrollbar-thumb:hover { background:${DS.slate}; }
        @keyframes goldShimmer { 0%{background-position:-120% center} 100%{background-position:220% center} }
        .stat-n { background:linear-gradient(90deg, ${DS.navy} 20%, ${DS.indigo} 40%, ${DS.royalBlue} 50%, ${DS.indigo} 60%, ${DS.navy} 80%); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:goldShimmer 4s linear infinite; }
        @keyframes drawLine { from{width:0} to{width:100%} }
        .h-line { position:relative; display:inline; }
        .h-line::after { content:''; position:absolute; left:0; bottom:-5px; height:3px; width:0; border-radius:2px; background:${DS.gradGold}; animation:drawLine 1.1s cubic-bezier(0.22,1,0.36,1) forwards; animation-delay:0.9s; }
        @keyframes lPulse { 0%{transform:scale(1);opacity:.65} 100%{transform:scale(3.2);opacity:0} }
        .live-r::before { content:''; position:absolute; inset:0; border-radius:50%; background:#22c55e; animation:lPulse 2.2s ease-out infinite; }
        @keyframes floatBadge { 0%,100%{transform:translateY(0) rotate(-1.5deg)} 50%{transform:translateY(-10px) rotate(1.5deg)} }
        .fbadge { animation:floatBadge 4.5s ease-in-out infinite; }
        @keyframes pbShimmer { 0%{background-position:-150% center} 100%{background-position:250% center} }
        .pbar { background:linear-gradient(90deg, ${DS.royalBlue}, ${DS.indigo} 40%, ${DS.steel} 55%, ${DS.indigo} 70%, ${DS.royalBlue}); background-size:200% auto; animation:pbShimmer 2.8s linear infinite; }
        .h-arc { position:absolute; pointer-events:none; }
        @keyframes gPulse { 0%,100%{opacity:1} 50%{opacity:.6} }
        .gpulse { animation:gPulse 2s ease-in-out infinite; }
        @keyframes slideArrow { 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }
        .arrow-anim { animation:slideArrow 1.6s ease-in-out infinite; }
        .act-btn { transition:all .18s; }
        .act-btn:hover { background:${DS.fog} !important; border-color:${DS.slate}44 !important; transform:translateY(-1px); }
        .persp { perspective:1200px; }
        .card-header-bar { background:${DS.gradNavy}; position:relative; overflow:hidden; }
        .card-header-bar::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:${DS.gradGold}; }
        .htag { transition:all .18s; }
        .htag:hover { transform:scale(1.06); }
        .sched-cell { transition:background .18s; }
        .sched-cell:hover { background:${DS.fog} !important; }

        /* Responsive utilities */
        @media (max-width: 1024px) {
          .hide-tablet { display: none !important; }
        }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .h-canvas { padding: 0 16px; }
          .h-root { overflow-x: hidden; }
        }
      `}</style>

      <section ref={rootRef} className="h-root h-canvas">
        <div className="h-grain" />
        <div className="h-grid"  />

        {/* Parallax blooms */}
        <motion.div style={{ y:bgY }} className="absolute inset-0 pointer-events-none" aria-hidden>
          <div style={{ position:"absolute", top:"-10%", left:"-10%", width:600, height:600, borderRadius:"50%",
            background:"radial-gradient(circle, rgba(61,63,140,0.07) 0%, transparent 68%)", filter:"blur(60px)" }} />
          <div style={{ position:"absolute", top:"-5%", right:"-8%", width:500, height:500, borderRadius:"50%",
            background:"radial-gradient(circle, rgba(95,120,158,0.09) 0%, transparent 65%)", filter:"blur(70px)" }} />
          <div style={{ position:"absolute", bottom:"5%", right:"20%", width:360, height:360, borderRadius:"50%",
            background:"radial-gradient(circle, rgba(242,201,76,0.07) 0%, transparent 65%)", filter:"blur(80px)" }} />
          <div style={{ position:"absolute", bottom:"-8%", left:"5%", width:400, height:400, borderRadius:"50%",
            background:"radial-gradient(circle, rgba(28,33,81,0.06) 0%, transparent 65%)", filter:"blur(70px)" }} />
          <svg className="h-arc" style={{ top:0, right:0, width:480, height:480, opacity:0.055 }} viewBox="0 0 480 480" fill="none">
            <circle cx="360" cy="120" r="200" stroke={DS.indigo} strokeWidth="0.8" />
            <circle cx="360" cy="120" r="140" stroke={DS.steel}  strokeWidth="0.5" />
            <circle cx="360" cy="120" r="80"  stroke={DS.goldLight} strokeWidth="0.5" />
            {[0,45,90,135,180,225,270,315].map(a => (
              <line key={a} x1={360+80*Math.cos(a*Math.PI/180)} y1={120+80*Math.sin(a*Math.PI/180)}
                x2={360+200*Math.cos(a*Math.PI/180)} y2={120+200*Math.sin(a*Math.PI/180)} stroke={DS.indigo} strokeWidth="0.4" />
            ))}
          </svg>
        </motion.div>

        {/* ── Content ── */}
        <div style={{ position:"relative", zIndex:2, maxWidth:1280, margin:"0 auto", padding:"0 24px" }}>
          <div style={{ 
            display:"grid", 
            gridTemplateColumns: isMobile ? "1fr" : "1fr 460px", 
            gap: isMobile ? 32 : 56, 
            alignItems:"start", 
            paddingTop: isMobile ? 64 : 96, 
            paddingBottom: isMobile ? 64 : 112 
          }}>

            {/* ═══ LEFT COLUMN ════════════════════════════════════ */}
            <motion.div style={{ y: leftY }}
              variants={ctnV} initial="hidden" animate={inView ? "visible":"hidden"}
            >
              <div style={{ display:"flex", flexDirection:"column", gap: 24 }}>
                {/* Live badge */}
                <motion.div variants={itemV}>
                  <motion.div whileHover={{ scale:1.03, boxShadow:DS.shadowMd }}
                    style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"8px 14px",
                      borderRadius:40, background:DS.white, border:`1px solid ${DS.surface3}`,
                      boxShadow:DS.shadowSm, cursor:"default" }}>
                    <div style={{ position:"relative", width:8, height:8, flexShrink:0 }} className="live-r">
                      <div style={{ width:8, height:8, borderRadius:"50%", background:"#22c55e", position:"relative", zIndex:1 }} />
                    </div>
                    <span style={{ fontSize:12, fontWeight:600, color:DS.ink }}>127 students enrolled this week</span>
                    <span style={{ fontSize:10, fontWeight:700, color:DS.subtle, borderLeft:`1px solid ${DS.surface3}`,
                      paddingLeft:10, fontFamily:"'Outfit', monospace", letterSpacing:"0.04em" }}>Limited seats</span>
                  </motion.div>
                </motion.div>

                {/* Headline */}
                <motion.div variants={itemV} style={{ display:"flex", flexDirection:"column", gap:16 }}>
                  <h1 style={{ fontSize:"clamp(2rem,8vw,4rem)", fontWeight:900, lineHeight:1.1,
                    letterSpacing:"-0.035em", color:DS.ink, margin:0, fontFamily:"'Outfit', sans-serif" }}>
                    <WordReveal text="Transform Your Career" inView={inView} delay={0.05} />
                    <br />
                    <span style={{ display:"inline" }}>
                      <WordReveal text="with" inView={inView} delay={0.28} />{" "}
                      <span className="h-line" style={{ background:DS.gradPrimary, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                        <WordReveal text="Industry Experts." inView={inView} delay={0.36} />
                      </span>
                    </span>
                  </h1>
                  <motion.p initial={{ opacity:0, y:14 }} animate={inView ? { opacity:1, y:0 } : {}}
                    transition={{ duration:0.65, delay:0.52, ease:[0.22,1,0.36,1] }}
                    style={{ fontSize: isMobile ? 15 : 17, color:DS.muted, lineHeight:1.65, maxWidth:540, fontWeight:400, margin:0 }}>
                    Join 5,000+ graduates who accelerated their careers through real projects,
                    world-class mentorship, and guaranteed placement support.
                  </motion.p>
                </motion.div>

                {/* Feature pills - responsive grid */}
                <motion.div variants={itemV} style={{ 
                  display:"grid", 
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
                  gap:10 
                }}>
                  {FEATURES.map(({ icon:Icon, label, desc },i) => (
                    <motion.div key={label} className="fpill"
                      style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px",
                        borderRadius:14, background:DS.surface1, border:`1px solid ${DS.surface3}` }}
                      initial={{ opacity:0, scale:0.92, y:20 }}
                      animate={inView ? { opacity:1, scale:1, y:0 } : {}}
                      transition={{ duration:0.55, delay:0.3+i*0.08, ease:[0.22,1,0.36,1] }}
                      onHoverStart={() => setHovFeat(i)}
                      onHoverEnd={() => setHovFeat(null)}
                    >
                      <motion.div
                        style={{ width:34, height:34, borderRadius:10, display:"flex", alignItems:"center",
                          justifyContent:"center", flexShrink:0, background: hovFeat===i ? `${DS.indigo}14` : `${DS.indigo}09` }}
                        animate={{ rotate: hovFeat===i ? [0,-8,8,0] : 0 }} transition={{ duration:0.38 }}>
                        <Icon style={{ width:16, height:16, color:DS.indigo }} />
                      </motion.div>
                      <div>
                        <p style={{ fontSize:12, fontWeight:700, color:DS.ink, lineHeight:1.3, margin:0 }}>{label}</p>
                        <p style={{ fontSize:10, color:DS.subtle, marginTop:2, margin:0 }}>{desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTAs - stacked on mobile */}
                <motion.div variants={itemV} style={{ 
                  display:"flex", 
                  flexDirection: isMobile ? "column" : "row", 
                  gap:12 
                }}>
                  <Link to="/courses" style={{ textDecoration:"none", width: isMobile ? "100%" : "auto" }}>
                    <motion.button className="cta-pri" whileTap={{ scale:0.97 }}
                      style={{ width:"100%", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8, padding:"14px 24px",
                        borderRadius:14, fontWeight:700, fontSize:14, color:"#fff",
                        border:"none", cursor:"pointer", fontFamily:"inherit" }}>
                      <Sparkles style={{ width:15, height:15 }} />
                      Explore Programs
                      <span className="arrow-anim"><ArrowRight style={{ width:15, height:15 }} /></span>
                    </motion.button>
                  </Link>
                  <motion.button className="cta-sec" whileTap={{ scale:0.97 }}
                    style={{ width:"100%", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8, padding:"14px 24px",
                      borderRadius:14, fontWeight:600, fontSize:14, color:DS.body,
                      background:DS.surface1, border:`1.5px solid ${DS.surface3}`, cursor:"pointer", fontFamily:"inherit" }}
                    onClick={() => setCounselor(true)}>
                    <HeartHandshake style={{ width:16, height:16, color:DS.steel }} />
                    Talk to a Counselor
                  </motion.button>
                </motion.div>

                {/* Partner strip */}
                <motion.div variants={itemV}>
                  <p className="h-cap" style={{ marginBottom:12 }}>Trusted by industry leaders</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {PARTNERS.map((n,i) => (
                      <motion.div key={n} className="tpill"
                        initial={{ opacity:0, y:8 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ delay:0.52+i*0.06 }}
                        style={{ padding:"6px 14px", borderRadius:8, fontSize:11, fontWeight:700, color:DS.muted,
                          background:DS.surface1, border:`1px solid ${DS.surface3}` }}>{n}</motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Divider */}
                <motion.div variants={itemV}>
                  <div style={{ height:1, background:`linear-gradient(90deg, transparent, ${DS.indigo}18, ${DS.goldLight}28, ${DS.indigo}18, transparent)` }} />
                </motion.div>

                {/* Stats - responsive grid */}
                <div ref={statsRef} style={{ 
                  display:"grid", 
                  gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", 
                  gap:8 
                }}>
                  {STATS.map(({ icon:Icon, val, suf, label, sub },i) => (
                    <motion.div key={label}
                      initial={{ opacity:0, y:20, scale:0.94 }}
                      animate={inView ? { opacity:1, y:0, scale:1 } : {}}
                      transition={{ duration:0.5, delay:0.58+i*0.09, ease:[0.22,1,0.36,1] }}
                      whileHover={{ y:-2, boxShadow:DS.shadowMd, transition:{ duration:0.2 } }}
                      style={{ textAlign:"center", padding:"12px 4px", borderRadius:12,
                        background:DS.white, border:`1px solid ${DS.surface3}`, boxShadow:DS.shadowSm, cursor:"default" }}>
                      <motion.div style={{ width:28, height:28, borderRadius:8, display:"flex", alignItems:"center",
                        justifyContent:"center", margin:"0 auto 8px",
                        background:`linear-gradient(135deg, ${DS.indigo}12, ${DS.indigo}06)`,
                        border:`1px solid ${DS.indigo}14` }}
                        whileHover={{ rotate:360 }} transition={{ duration:0.55 }}>
                        <Icon style={{ width:13, height:13, color:DS.indigo }} />
                      </motion.div>
                      <p className="stat-n" style={{ fontSize: isMobile ? 20 : 24, fontWeight:900, lineHeight:1, fontFamily:"'Outfit',sans-serif", margin:0 }}>
                        <AnimCounter val={val} suf={suf} run={statsInView} />
                      </p>
                      <p style={{ fontSize: isMobile ? 10 : 11, fontWeight:700, color:DS.body, marginTop:4, lineHeight:1.3 }}>{label}</p>
                      {!isMobile && <p style={{ fontSize:9, color:DS.subtle, marginTop:2 }}>{sub}</p>}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ═══ RIGHT COLUMN — BOOKING CARD ════════════════════ */}
            {!isMobile && (
              <motion.div style={{ y:cardY }} className="persp" aria-label="Upcoming courses">
                <motion.div
                  ref={cardRef}
                  style={{ rotateX:rx, rotateY:ry, transformStyle:"preserve-3d" }}
                  onMouseMove={onCardMove} onMouseLeave={onCardLeave}
                  onMouseEnter={() => setAutoPlay(false)}
                  initial={{ opacity:0, x:48, scale:0.94 }}
                  animate={inView ? { opacity:1, x:0, scale:1 } : {}}
                  transition={{ duration:0.75, delay:0.28, ease:[0.22,1,0.36,1] }}
                >
                  {/* Float badge */}
                  <div className="fbadge" style={{ position:"absolute", top:-14, right:-14, zIndex:20, transformStyle:"preserve-3d" }}>
                    <motion.div whileHover={{ scale:1.06 }}
                      style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px",
                        borderRadius:40, background:DS.gradPrimary, color:"#fff", fontSize:12, fontWeight:700,
                        boxShadow:`${DS.shadowNav}, inset 0 1px 0 rgba(255,255,255,0.15)`,
                        border:"1px solid rgba(255,255,255,0.12)" }}>
                      <motion.span animate={{ rotate:[0,18,0,-18,0] }} transition={{ duration:2.5, repeat:Infinity, delay:1.5 }}>
                        <Headphones style={{ width:14, height:14 }} />
                      </motion.span>
                      Free Consultation
                    </motion.div>
                  </div>

                  {/* Card Shell */}
                  <div style={{ borderRadius:22, overflow:"hidden", position:"relative",
                    background:DS.gradCard, border:`1px solid ${DS.surface3}`, boxShadow:DS.shadowCard }}>

                    {/* Card header */}
                    <div className="card-header-bar" style={{ padding:"18px 22px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <motion.div style={{ width:8, height:8, borderRadius:"50%", background:"#4ade80" }}
                          animate={{ scale:[1,1.4,1], opacity:[1,0.7,1] }} transition={{ duration:2, repeat:Infinity }} />
                        <div>
                          <p style={{ fontSize:14, fontWeight:700, color:"#fff", margin:0, fontFamily:"'Outfit',sans-serif" }}>Upcoming Classes</p>
                          <p style={{ fontSize:11, color:"rgba(255,255,255,0.48)", marginTop:1, fontFamily:"'Outfit',monospace", letterSpacing:"0.03em" }}>
                            {loading ? "Loading..." : error ? "Seats available" : `${totalSeats} seats available`}
                          </p>
                        </div>
                      </div>
                      <motion.div whileHover={{ scale:1.05 }}
                        style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px",
                          borderRadius:40, background:"rgba(242,201,76,0.15)", border:"1px solid rgba(242,201,76,0.35)" }}>
                        <div className="gpulse" style={{ width:5, height:5, borderRadius:"50%", background:DS.goldLight }} />
                        <span style={{ fontSize:11, fontWeight:700, color:DS.goldLight, fontFamily:"'Outfit',monospace", letterSpacing:"0.04em" }}>
                          {loading ? "..." : `${courses.length} courses`}
                        </span>
                      </motion.div>
                    </div>

                    {/* Course tabs */}
                    {!loading && !error && courses.length > 0 && (
                      <div style={{ padding:"10px 22px 0", display:"flex", gap:4, borderBottom:`1px solid ${DS.surface3}` }}>
                        {courses.map((_,i) => (
                          <motion.button key={i} onClick={() => switchCourse(i)}
                            whileHover={{ scale:1.04 }} whileTap={{ scale:0.95 }}
                            style={{ flex:1, paddingBottom:8, paddingTop:4, border:"none", cursor:"pointer",
                              fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:12,
                              background:"transparent",
                              color: i===activeIdx ? (course?.accent || DS.indigo) : DS.subtle,
                              borderBottom:`2px solid ${i===activeIdx ? (course?.accent || DS.indigo) : "transparent"}`,
                              transition:"all .2s" }}>
                            {i+1}
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {/* Scrollable content */}
                    <div className="cscroll" style={{ overflowY:"auto", maxHeight:"64vh" }}>

                      {/* Loading state */}
                      {loading && (
                        <div style={{ padding:22 }}>
                          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                            padding:"32px 0", color:DS.muted, fontSize:13 }}>
                            <Loader2 style={{ width:18, height:18, animation:"spin 1s linear infinite", color:DS.indigo }} />
                            Loading upcoming courses...
                          </div>
                          {[1,2,3].map(i => (
                            <div key={i} style={{ height:16, marginBottom:10, borderRadius:8, width:`${[80,60,90][i-1]}%`,
                              background:`linear-gradient(90deg, ${DS.surface2} 25%, ${DS.surface3} 50%, ${DS.surface2} 75%)`,
                              backgroundSize:"200% 100%", animation:"shimmer 1.4s ease-in-out infinite",
                              animationDelay:`${i*0.1}s` }} />
                          ))}
                        </div>
                      )}

                      {/* Error state */}
                      {!loading && error && (
                        <div style={{ padding:32, textAlign:"center" }}>
                          <AlertCircle style={{ width:36, height:36, color:DS.subtle, margin:"0 auto 12px" }} />
                          <p style={{ fontSize:13, color:DS.muted, margin:0 }}>Couldn't load courses.<br/>Please try again later.</p>
                          <Link to="/courses" style={{ textDecoration:"none" }}>
                            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                              style={{ marginTop:16, padding:"10px 20px", borderRadius:10, background:DS.gradPrimary,
                                color:"#fff", border:"none", cursor:"pointer", fontWeight:600, fontSize:13, fontFamily:"inherit" }}>
                              View All Courses
                            </motion.button>
                          </Link>
                        </div>
                      )}

                      {/* Course card */}
                      {!loading && !error && course && (
                        <AnimatePresence mode="wait" custom={dir}>
                          <motion.div key={activeIdx} custom={dir}
                            initial={d=>({ opacity:0, x:d*32, filter:"blur(5px)" })}
                            animate={{ opacity:1, x:0, filter:"blur(0px)" }}
                            exit={d=>({ opacity:0, x:d*-22, filter:"blur(5px)" })}
                            transition={{ duration:0.28, ease:[0.22,1,0.36,1] }}
                            style={{ padding:22 }}
                          >
                            {/* Course header */}
                            <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:16 }}>
                              <motion.div whileHover={{ rotate:[0,-8,8,0] }} transition={{ duration:0.4 }}
                                style={{ width:46, height:46, borderRadius:14, display:"flex", alignItems:"center",
                                  justifyContent:"center", flexShrink:0,
                                  background:course.aLight, border:`1.5px solid ${course.aBorder}` }}>
                                <course.icon style={{ width:22, height:22, color:course.accent }} />
                              </motion.div>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                                  <h3 style={{ fontSize:15, fontWeight:800, color:DS.ink, margin:0, fontFamily:"'Outfit',sans-serif",
                                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{course.title}</h3>
                                  <div style={{ display:"flex", alignItems:"center", gap:3, flexShrink:0 }}>
                                    <Star style={{ width:13, height:13, fill:"#F59E0B", color:"#F59E0B" }} />
                                    <span style={{ fontSize:12, fontWeight:700, color:DS.ink, fontFamily:"'Outfit',monospace" }}>
                                      {course.instructor.rating}
                                    </span>
                                  </div>
                                </div>
                                <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:6 }}>
                                  <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:6,
                                    background:course.aLight, color:course.accent, border:`1px solid ${course.aBorder}`,
                                    fontFamily:"'Outfit',monospace" }}>{course.level}</span>
                                  <span style={{ fontSize:11, color:DS.subtle, fontFamily:"'Outfit',monospace" }}>{course.duration}</span>
                                </div>
                              </div>
                            </div>

                            {/* Price */}
                            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}
                              style={{ borderRadius:14, padding:16, marginBottom:14,
                                background:course.aLight, border:`1.5px solid ${course.aBorder}` }}>
                              <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
                                <div>
                                  <p style={{ fontSize:11, color:DS.subtle, marginBottom:4, fontFamily:"'Outfit',monospace", letterSpacing:"0.04em" }}>Course Fee</p>
                                  <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                                    <span style={{ fontSize:22, fontWeight:900, color:DS.ink, fontFamily:"'Outfit',sans-serif", letterSpacing:"-0.02em" }}>
                                      {fmtPrice(course.price.disc)}
                                    </span>
                                    {course.price.pct > 0 && (
                                      <span style={{ fontSize:11, color:DS.subtle, textDecoration:"line-through", fontFamily:"'Outfit',monospace" }}>
                                        {fmtPrice(course.price.orig)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {course.price.pct > 0 && (
                                  <motion.div animate={{ scale:[1,1.06,1] }} transition={{ duration:2.2, repeat:Infinity, delay:0.8 }}
                                    style={{ padding:"5px 10px", borderRadius:8, fontSize:12, fontWeight:800, color:"#fff",
                                      background:DS.gradPrimary, fontFamily:"'Outfit',sans-serif" }}>
                                    {course.price.pct}% OFF
                                  </motion.div>
                                )}
                              </div>
                              <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:10, paddingTop:10,
                                borderTop:`1px solid ${course.aBorder}` }}>
                                <Gift style={{ width:13, height:13, color:DS.goldMid, flexShrink:0 }} />
                                <span style={{ fontSize:11, color:DS.body, fontFamily:"'Outfit',monospace" }}>
                                  Early Bird: <strong style={{ color:DS.ink }}>{fmtPrice(course.price.bird)}</strong> until {course.price.birdDate}
                                </span>
                              </div>
                            </motion.div>

                            {/* Instructor */}
                            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.09 }}
                              whileHover={{ background:DS.fog }}
                              style={{ display:"flex", alignItems:"center", gap:12, padding:14, borderRadius:12, marginBottom:14,
                                background:DS.surface1, border:`1px solid ${DS.surface3}`, transition:"background .18s" }}>
                              <div style={{ width:40, height:40, borderRadius:"50%", display:"flex", alignItems:"center",
                                justifyContent:"center", color:"#fff", fontWeight:800, fontSize:13, flexShrink:0,
                                background:DS.gradPrimary, fontFamily:"'Outfit',sans-serif" }}>
                                {course.instructor.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                              </div>
                              <div style={{ flex:1, minWidth:0 }}>
                                <p style={{ fontSize:13, fontWeight:700, color:DS.ink, margin:0,
                                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{course.instructor.name}</p>
                                <p style={{ fontSize:11, color:DS.subtle, margin:"2px 0 0",
                                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                                  fontFamily:"'Outfit',monospace" }}>
                                  {course.instructor.title}{course.instructor.exp ? ` · ${course.instructor.exp}` : ""}
                                </p>
                              </div>
                              {course.instructor.students > 0 && (
                                <div style={{ padding:"4px 10px", borderRadius:8, fontSize:11, fontWeight:700,
                                  background:DS.surface2, color:DS.muted, flexShrink:0, fontFamily:"'Outfit',monospace" }}>
                                  {course.instructor.students.toLocaleString()}+
                                </div>
                              )}
                            </motion.div>

                            {/* Schedule 2×2 */}
                            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                              {[
                                { I:Calendar, l:"Start Date", v:course.startDate },
                                { I:Timer,    l:"Duration",   v:course.duration  },
                                { I:Video,    l:"Mode",       v:course.mode      },
                                { I:MapPin,   l:"Location",   v:course.mode==="In-Person"?"Kathmandu":"Virtual" },
                              ].map(({ I,l,v },i) => (
                                <motion.div key={l} className="sched-cell"
                                  initial={{ opacity:0, scale:0.94 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.12+i*0.04 }}
                                  style={{ padding:10, borderRadius:10, background:DS.surface1, border:`1px solid ${DS.surface3}` }}>
                                  <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:4 }}>
                                    <I style={{ width:12, height:12, color:DS.steel, flexShrink:0 }} />
                                    <span style={{ fontSize:10, color:DS.subtle, fontFamily:"'Outfit',monospace", letterSpacing:"0.04em", textTransform:"uppercase", fontWeight:700 }}>{l}</span>
                                  </div>
                                  <p style={{ fontSize:12, fontWeight:700, color:DS.ink, margin:0 }}>{v}</p>
                                </motion.div>
                              ))}
                            </div>

                            {/* Highlights */}
                            <div style={{ marginBottom:14 }}>
                              <p className="h-cap" style={{ marginBottom:8 }}>You'll cover</p>
                              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                                {course.highlights.map((h,i) => (
                                  <motion.span key={i} className="htag"
                                    initial={{ opacity:0, scale:0.82 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.17+i*0.05 }}
                                    whileHover={{ boxShadow:`0 2px 10px ${course.aBorder}` }}
                                    style={{ fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:7,
                                      background:course.aLight, color:course.accent, border:`1px solid ${course.aBorder}`,
                                      fontFamily:"'Outfit',sans-serif", cursor:"default" }}>{h}</motion.span>
                                ))}
                              </div>
                            </div>

                            {/* Seats */}
                            <div style={{ marginBottom:16 }}>
                              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:7 }}>
                                <span style={{ fontSize:12, fontWeight:700, color:DS.ink }}>{course.seats-course.enrolled} seats remaining</span>
                                {course.waitlist>0 && (
                                  <motion.span animate={{ opacity:[1,0.55,1] }} transition={{ duration:2, repeat:Infinity }}
                                    style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#D97706" }}>
                                    <AlertCircle style={{ width:12, height:12 }} />{course.waitlist} on waitlist
                                  </motion.span>
                                )}
                              </div>
                              <div style={{ height:6, borderRadius:3, overflow:"hidden", background:DS.surface3 }}>
                                <motion.div className="pbar"
                                  initial={{ width:0 }} animate={{ width:`${fillPct}%` }}
                                  transition={{ duration:0.75, delay:0.08, ease:[0.22,1,0.36,1] }}
                                  style={{ height:"100%", borderRadius:3 }} />
                              </div>
                              <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
                                <span style={{ fontSize:10, color:DS.subtle, fontFamily:"'Outfit',monospace" }}>{course.enrolled} enrolled</span>
                                <span style={{ fontSize:10, color:DS.subtle, fontFamily:"'Outfit',monospace" }}>{course.seats} total</span>
                              </div>
                            </div>

                            {/* CTA buttons */}
                            <div style={{ marginBottom:12 }}>
                              <motion.button className="cta-pri" whileTap={{ scale:0.98 }}
                                onClick={() => setBooking(true)}
                                style={{ width:"100%", padding:"14px 0", borderRadius:12, border:"none", cursor:"pointer",
                                  color:"#fff", fontWeight:700, fontSize:14, fontFamily:"inherit", marginBottom:8,
                                  display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                                <HeartHandshake style={{ width:16, height:16 }} />
                                Book Free Consultation
                                <span className="arrow-anim"><ArrowRight style={{ width:14, height:14 }} /></span>
                              </motion.button>
                              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                                {[
                                  { I:Download,       l:"Syllabus",     onClick:() => apiService.getCourseSyllabus(course.slug).catch(()=>{}) },
                                  { I:MessageCircle,  l:"Ask Question", onClick:() => setCounselor(true) },
                                ].map(({ I,l,onClick }) => (
                                  <motion.button key={l} className="act-btn" whileTap={{ scale:0.97 }}
                                    onClick={onClick}
                                    style={{ padding:"11px 0", borderRadius:10, display:"flex", alignItems:"center",
                                      justifyContent:"center", gap:6, background:DS.surface1,
                                      border:`1px solid ${DS.surface3}`, fontSize:12, fontWeight:600, color:DS.muted,
                                      cursor:"pointer", fontFamily:"inherit" }}>
                                    <I style={{ width:14, height:14 }} />{l}
                                  </motion.button>
                                ))}
                              </div>
                            </div>

                            {/* Trust strip */}
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                              paddingTop:12, borderTop:`1px solid ${DS.surface3}` }}>
                              {[{I:Shield,c:"#16a34a",t:"Money-back"},{I:CreditCard,c:DS.steel,t:"Easy EMI"},{I:Award,c:DS.goldMid,t:"Certified"}].map(({ I,c,t }) => (
                                <motion.div key={t} whileHover={{ scale:1.06, color:DS.ink }}
                                  style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:DS.muted, cursor:"default" }}>
                                  <I style={{ width:12, height:12, color:c }} />{t}
                                </motion.div>
                              ))}
                            </div>

                            {/* View all */}
                            <div style={{ display:"flex", justifyContent:"flex-end", paddingTop:10 }}>
                              <Link to="/courses" style={{ textDecoration:"none" }}>
                                <motion.span whileHover={{ gap:10 }}
                                  style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12,
                                    fontWeight:700, color:DS.indigo, cursor:"pointer" }}>
                                  View all courses <ChevronRight style={{ width:13, height:13 }} />
                                </motion.span>
                              </Link>
                            </div>

                          </motion.div>
                        </AnimatePresence>
                      )}

                      {/* Empty state */}
                      {!loading && !error && courses.length === 0 && (
                        <div style={{ padding:32, textAlign:"center" }}>
                          <BookOpen style={{ width:36, height:36, color:DS.subtle, margin:"0 auto 12px" }} />
                          <p style={{ fontSize:13, color:DS.muted }}>No upcoming courses yet.</p>
                          <Link to="/courses" style={{ textDecoration:"none" }}>
                            <motion.button whileHover={{ scale:1.02 }}
                              style={{ marginTop:12, padding:"10px 20px", borderRadius:10, background:DS.gradPrimary,
                                color:"#fff", border:"none", cursor:"pointer", fontWeight:600, fontSize:13, fontFamily:"inherit" }}>
                              Browse Catalog
                            </motion.button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Booking Card (appears below content on mobile) */}
        {isMobile && (
          <div style={{ marginTop: 32, width: "100%" }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div style={{ borderRadius: 22, overflow: "hidden", background: DS.gradCard, border: `1px solid ${DS.surface3}`, boxShadow: DS.shadowCard }}>
                {/* Card header */}
                <div className="card-header-bar" style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <motion.div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }}
                        animate={{ scale: [1,1.4,1], opacity: [1,0.7,1] }} transition={{ duration: 2, repeat: Infinity }} />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>Upcoming Classes</p>
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.48)", marginTop: 1 }}>
                          {loading ? "Loading..." : error ? "Seats available" : `${totalSeats} seats available`}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 30,
                      background: "rgba(242,201,76,0.15)", border: "1px solid rgba(242,201,76,0.35)" }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: DS.goldLight }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: DS.goldLight }}>{loading ? "..." : `${courses.length} courses`}</span>
                    </div>
                  </div>
                </div>

                {/* Mobile course preview */}
                {!loading && !error && course && (
                  <div style={{ padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: course.aLight, border: `1px solid ${course.aBorder}`,
                        display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <course.icon style={{ width: 20, height: 20, color: course.accent }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: DS.ink, margin: 0 }}>{course.title}</p>
                        <p style={{ fontSize: 11, color: DS.subtle, margin: "2px 0 0" }}>Starting {course.startDate}</p>
                      </div>
                    </div>
                    
                    <Link to="/courses" style={{ textDecoration: "none" }}>
                      <motion.button className="cta-pri" whileTap={{ scale: 0.97 }}
                        style={{ width: "100%", padding: "12px 0", borderRadius: 12, border: "none",
                          color: "#fff", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        View All Courses <ChevronRight style={{ width: 14, height: 14 }} />
                      </motion.button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Modals */}
        <AnimatePresence>
          {booking && course && <Modal course={course} onClose={() => { setBooking(false); setAutoPlay(true); }} />}
        </AnimatePresence>
        <AnimatePresence>
          {counselor && <CounselorSheet onClose={() => setCounselor(false)} />}
        </AnimatePresence>
      </section>
    </>
  );
}