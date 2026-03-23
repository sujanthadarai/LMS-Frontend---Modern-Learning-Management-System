import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import CTASection from "@/components/common/CTASection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Clock,
  Users,
  Star,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  Award,
  BookOpen,
  Play,
  Loader2,
  AlertCircle,
  Target,
  GraduationCap,
  Briefcase,
  FileText,
  Video,
  Download,
  Code2,
  Cpu,
  Network,
  Shield,
  Database,
  Globe,
  Layers,
  Zap,
  BarChart3,
  GitBranch,
  Smartphone,
  Monitor,
  Cloud,
  Lock,
  Mail,
  MessageSquare,
  PenTool,
  PieChart,
  Rocket,
  Settings,
  Sparkles,
  Timer,
  Trophy,
  UsersRound,
  Wifi,
  BookMarked,
  ClipboardList,
  Coffee,
  Headphones,
  Laptop,
  Bell,
  Megaphone,
  Microscope,
  Puzzle,
  QrCode,
  Radio,
  ScrollText,
  Telescope,
  Umbrella,
  Vote,
  Warehouse,
  XCircle,
  Youtube,
  ZapOff,
  Heart,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Eye,
  DownloadCloud,
  FolderOpen,
  Link2,
  ListChecks,
  MenuSquare,
  Notebook,
  Pencil,
  Printer,
  RefreshCw,
  Repeat,
  Scissors,
  Search,
  Send,
  Server,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  Speaker,
  Square,
  StarHalf,
  Stethoscope,
  Sun,
  Sunrise,
  Sunset,
  Syringe,
  Table,
  Tag,
  Target as TargetIcon,
  Thermometer,
  ThumbsDown,
  Ticket,
  Timer as TimerIcon,
  ToggleLeft,
  Tool,
  Trash2,
  TrendingUp,
  Truck,
  Tv,
  Twitch,
  Twitter,
  Type,
  Umbrella as UmbrellaIcon,
  Underline,
  Undo,
  Ungroup,
  Unlink,
  Unlock,
  Upload,
  Usb,
  User,
  UserCheck,
  UserCog,
  UserMinus,
  UserPlus,
  UserX,
  Users as UsersIcon,
  VenetianMask,
  Video as VideoIcon,
  VideoOff,
  Voicemail,
  Volume1,
  Volume2,
  VolumeX,
  Wallet,
  Wand2,
  Watch,
  Waves,
  Webhook,
  Weight,
  Wheat,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Wind,
  Wine,
  Wrench,
  X,
  XCircle as XCircleIcon,
  XOctagon,
  XSquare,
  Youtube as YoutubeIcon,
  Zap as ZapIcon,
  ZapOff as ZapOffIcon,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { apiService } from "@/services/api";

// Comprehensive types based on your Django models
interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  course_count?: number;
}

interface InstructorUser {
  id: number;
  email: string;
  full_name: string | null;
  role: string;
  phone_number: string | null;
  gender: string;
  avatar: string | null;
  date_joined: string;
}

interface Instructor {
  id: number;
  user: InstructorUser;
  bio: string;
  title: string;
  experience_years: number;
  profile_image: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  is_featured: boolean;
  course_count?: number;
  avg_rating?: number;
}

interface CourseFeature {
  id: number;
  feature: string;
  order: number;
}

interface CourseTool {
  id: number;
  name: string;
  icon: string;
  order: number;
}

interface ModuleTopic {
  id: number;
  title: string;
  description: string;
  order: number;
  duration: number; // in minutes
  video_url: string;
  resources: string[]; // JSON array
}

interface CourseModule {
  id: number;
  title: string;
  description: string;
  order: number;
  duration: number; // in hours
  topics: ModuleTopic[];
}

interface Course {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  detailed_description: string;
  category: Category;
  instructor?: Instructor;
  level: string;
  level_display?: string;
  price: string;
  original_price: string | null;
  is_discounted: boolean;
  discount_percentage: number;
  duration: string;
  total_hours: number;
  thumbnail: string | null;
  video_preview_url: string;
  students_count: number;
  rating: string;
  review_count: number;
  is_popular: boolean;
  is_featured: boolean;
  is_active: boolean;
  batch_start_date: string | null;
  certificate_included: boolean;
  lifetime_access: boolean;
  features: CourseFeature[];
  tools: CourseTool[];
  modules: CourseModule[];
  enrolled_count?: number;
  is_enrolled?: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

interface Enrollment {
  id: number;
  status: string;
  progress_percentage: number;
  certificate_issued: boolean;
  enrolled_at?: string;
}

// Helper Functions
const getInstructorName = (instructor?: Instructor): string => {
  if (!instructor) return "Instructor";
  if (instructor.user?.full_name) return instructor.user.full_name;
  if (instructor.user?.email) return instructor.user.email.split('@')[0];
  return `Instructor ${instructor.id}`;
};

const fixImageUrl = (imageUrl?: string | null): string => {
  if (!imageUrl) return 'https://via.placeholder.com/800x450?text=Course+Image';
  
  // If it's already a full URL
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Remove duplicate slashes except for protocol
  const cleanUrl = imageUrl.replace(/([^:])\/\//g, '$1/');
  
  // If it starts with /media or /uploads, prepend base URL
  if (cleanUrl.startsWith('/media') || cleanUrl.startsWith('/uploads')) {
    return `https://sipalaya-lms-professional-learning.onrender.com/${cleanUrl}`;
  }
  
  // Default case
  return `https://sipalaya-lms-professional-learning.onrender.com//media/${cleanUrl.replace(/^\/+/, '')}`;
};

const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const formatPrice = (price: string) => {
  const num = parseFloat(price);
  return isNaN(num) ? '0' : num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

const getLevelColor = (level: string): string => {
  const colors: Record<string, string> = {
    Beginner: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    Intermediate: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    Advanced: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };
  return colors[level] || "bg-primary/10 text-primary border-primary/20";
};

const getToolIcon = (toolName: string): JSX.Element => {
  const iconMap: Record<string, JSX.Element> = {
    'python': <Code2 className="w-5 h-5" />,
    'javascript': <Code2 className="w-5 h-5" />,
    'react': <Code2 className="w-5 h-5" />,
    'node': <Server className="w-5 h-5" />,
    'django': <Server className="w-5 h-5" />,
    'flask': <Server className="w-5 h-5" />,
    'postgresql': <Database className="w-5 h-5" />,
    'mysql': <Database className="w-5 h-5" />,
    'mongodb': <Database className="w-5 h-5" />,
    'docker': <Cloud className="w-5 h-5" />,
    'kubernetes': <Layers className="w-5 h-5" />,
    'aws': <Cloud className="w-5 h-5" />,
    'azure': <Cloud className="w-5 h-5" />,
    'git': <GitBranch className="w-5 h-5" />,
    'github': <GitBranch className="w-5 h-5" />,
    'gitlab': <GitBranch className="w-5 h-5" />,
    'jenkins': <Settings className="w-5 h-5" />,
    'terraform': <Cloud className="w-5 h-5" />,
    'ansible': <Settings className="w-5 h-5" />,
    'prometheus': <BarChart3 className="w-5 h-5" />,
    'grafana': <PieChart className="w-5 h-5" />,
    'linux': <Monitor className="w-5 h-5" />,
    'nginx': <Globe className="w-5 h-5" />,
    'apache': <Globe className="w-5 h-5" />,
    'redis': <Zap className="w-5 h-5" />,
    'rabbitmq': <MessageSquare className="w-5 h-5" />,
    'elasticsearch': <Search className="w-5 h-5" />,
    'kibana': <PieChart className="w-5 h-5" />,
    'logstash': <Database className="w-5 h-5" />,
    'tableau': <BarChart3 className="w-5 h-5" />,
    'powerbi': <PieChart className="w-5 h-5" />,
    'excel': <Table className="w-5 h-5" />,
    'sql': <Database className="w-5 h-5" />,
    'nosql': <Database className="w-5 h-5" />,
    'tensorflow': <Cpu className="w-5 h-5" />,
    'pytorch': <Cpu className="w-5 h-5" />,
    'scikit-learn': <BarChart3 className="w-5 h-5" />,
    'pandas': <Table className="w-5 h-5" />,
    'numpy': <BarChart3 className="w-5 h-5" />,
    'matplotlib': <PieChart className="w-5 h-5" />,
    'seaborn': <PieChart className="w-5 h-5" />,
    'fastapi': <Zap className="w-5 h-5" />,
    'graphql': <Network className="w-5 h-5" />,
    'rest': <Globe className="w-5 h-5" />,
    'html': <Code2 className="w-5 h-5" />,
    'css': <Code2 className="w-5 h-5" />,
    'tailwind': <Code2 className="w-5 h-5" />,
    'typescript': <Code2 className="w-5 h-5" />,
    'vue': <Code2 className="w-5 h-5" />,
    'angular': <Code2 className="w-5 h-5" />,
    'nextjs': <Code2 className="w-5 h-5" />,
    'nestjs': <Server className="w-5 h-5" />,
    'express': <Server className="w-5 h-5" />,
    'firebase': <Cloud className="w-5 h-5" />,
    'supabase': <Database className="w-5 h-5" />,
    'prisma': <Database className="w-5 h-5" />,
    'typeorm': <Database className="w-5 h-5" />,
    'mongoose': <Database className="w-5 h-5" />,
    'github actions': <GitBranch className="w-5 h-5" />,
    'gitlab ci': <GitBranch className="w-5 h-5" />,
    'gcp': <Cloud className="w-5 h-5" />,
    'digitalocean': <Cloud className="w-5 h-5" />,
    'heroku': <Cloud className="w-5 h-5" />,
    'netlify': <Globe className="w-5 h-5" />,
    'vercel': <Zap className="w-5 h-5" />,
    'cloudflare': <Shield className="w-5 h-5" />,
    'ubuntu': <Monitor className="w-5 h-5" />,
    'centos': <Monitor className="w-5 h-5" />,
    'debian': <Monitor className="w-5 h-5" />,
    'fedora': <Monitor className="w-5 h-5" />,
    'windows': <Monitor className="w-5 h-5" />,
    'macos': <Monitor className="w-5 h-5" />,
    'bash': <Code2 className="w-5 h-5" />,
    'powershell': <Code2 className="w-5 h-5" />,
    'zsh': <Code2 className="w-5 h-5" />,
    'vim': <Code2 className="w-5 h-5" />,
    'vscode': <Code2 className="w-5 h-5" />,
    'intellij': <Code2 className="w-5 h-5" />,
    'pycharm': <Code2 className="w-5 h-5" />,
    'jupyter': <Notebook className="w-5 h-5" />,
    'colab': <Cloud className="w-5 h-5" />,
    'kaggle': <Trophy className="w-5 h-5" />,
    'google sheets': <Table className="w-5 h-5" />,
    'looker': <Eye className="w-5 h-5" />,
    'metabase': <PieChart className="w-5 h-5" />,
    'airflow': <Settings className="w-5 h-5" />,
    'kafka': <MessageSquare className="w-5 h-5" />,
    'spark': <Cpu className="w-5 h-5" />,
    'hadoop': <Database className="w-5 h-5" />,
    'cassandra': <Database className="w-5 h-5" />,
    'dynamodb': <Database className="w-5 h-5" />,
    'snowflake': <Database className="w-5 h-5" />,
    'bigquery': <Database className="w-5 h-5" />,
    'databricks': <Cpu className="w-5 h-5" />,
    'dbt': <Database className="w-5 h-5" />,
    'r': <Code2 className="w-5 h-5" />,
    'grpc': <Network className="w-5 h-5" />,
    'websocket': <Wifi className="w-5 h-5" />,
    'mqtt': <Wifi className="w-5 h-5" />,
  };
  
  const lowerName = toolName.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerName.includes(key)) return icon;
  }
  return <Code2 className="w-5 h-5" />;
};

// Missing icon component
const Infinity = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z" />
  </svg>
);

const CourseDetail = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching course with slug:', slug);
        
        // Fetch single course by slug using the dedicated method
        const response = await apiService.getCourseBySlug(slug);
        
        console.log('API Response:', response);
        
        if (response) {
          setCourse(response);
          
          // Set isEnrolled from the response if available
          if (response.is_enrolled !== undefined) {
            setIsEnrolled(response.is_enrolled);
          }
          
          // Initialize expanded modules - expand first module by default
          if (response.modules && response.modules.length > 0) {
            setExpandedModules([`module-${response.modules[0].id}`]);
          }
        } else {
          setError("Course not found");
        }
      } catch (err: any) {
        console.error('Error fetching course:', err);
        setError(err.message || 'Failed to load course details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [slug]);

  // Debug log to verify modules data
  useEffect(() => {
    if (course) {
      console.log('Course modules:', course.modules);
      console.log('Course features:', course.features);
      console.log('Course tools:', course.tools);
      
      // Verify modules have topics
      if (course.modules && course.modules.length > 0) {
        course.modules.forEach((module, index) => {
          console.log(`Module ${index + 1} (${module.title}) topics:`, module.topics);
        });
      }
    }
  }, [course]);

  // Calculate total course stats
  const totalTopics = course?.modules?.reduce(
    (acc, module) => acc + (module.topics?.length || 0), 
    0
  ) || 0;
  
  const totalVideoMinutes = course?.modules?.reduce(
    (acc, module) => acc + (module.topics?.reduce(
      (topicAcc, topic) => topicAcc + (topic.duration || 0), 0
    ) || 0), 0
  ) || 0;

  // Calculate total downloadable resources
  const totalResources = course?.modules?.reduce(
    (acc, module) => acc + (module.topics?.reduce(
      (topicAcc, topic) => topicAcc + (topic.resources?.length || 0), 0
    ) || 0), 0
  ) || 0;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading course details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !course) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md mx-auto p-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <CardTitle className="text-2xl mb-2">Course Not Found</CardTitle>
              <CardDescription className="mb-6">
                {error || "The course you're looking for doesn't exist or has been removed."}
              </CardDescription>
              <Link to="/courses">
                <Button>Browse All Courses</Button>
              </Link>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  const instructorName = getInstructorName(course.instructor);
  const instructorImage = course.instructor?.profile_image 
    ? fixImageUrl(course.instructor.profile_image)
    : 'https://via.placeholder.com/200x200?text=Instructor';

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-background" />
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumb */}
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Courses
            </Link>

            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Course Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge 
                    variant="outline" 
                    className={cn("border-2", getLevelColor(course.level))}
                  >
                    {course.level_display || course.level}
                  </Badge>
                  
                  <Badge variant="secondary" className="border-2 border-primary/20">
                    {course.category.name}
                  </Badge>
                  
                  {course.is_popular && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                      <Trophy className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  
                  {course.is_featured && (
                    <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
                  {course.title}
                </h1>

                {/* Short Description */}
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {course.short_description}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">
                        {course.students_count?.toLocaleString() || 0}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">students</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">{course.rating || 0}</span>
                      <span className="text-sm text-muted-foreground ml-1">
                        ({course.review_count || 0} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <Clock className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">{course.duration || 'N/A'}</span>
                      <span className="text-sm text-muted-foreground ml-1">weeks</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <BookOpen className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">{totalTopics}</span>
                      <span className="text-sm text-muted-foreground ml-1">lessons</span>
                    </div>
                  </div>
                </div>

                {/* Instructor Preview */}
                {course.instructor && (
                  <div className="flex items-center gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50">
                    <img
                      src={instructorImage}
                      alt={instructorName}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/20"
                    />
                    <div>
                      <p className="text-sm text-muted-foreground">Course Instructor</p>
                      <h4 className="font-semibold text-foreground text-lg">{instructorName}</h4>
                      <p className="text-sm text-muted-foreground">{course.instructor?.title}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Enrollment Card */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="sticky top-24"
                >
                  <Card className="overflow-hidden border-2 shadow-xl">
                    {/* Preview Image/Video */}
                    <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 group">
                      {course.thumbnail ? (
                        <img
                          src={fixImageUrl(course.thumbnail)}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-16 h-16 text-primary/30" />
                        </div>
                      )}
                      
                      {course.video_preview_url && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            size="icon" 
                            className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90"
                            onClick={() => window.open(course.video_preview_url, '_blank')}
                          >
                            <Play className="w-8 h-8 text-white ml-1" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6 space-y-6">
                      {/* Price */}
                      <div className="flex items-baseline justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Course Price</p>
                          <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-foreground">
                              NPR {formatPrice(course.price)}
                            </span>
                            {course.original_price && course.is_discounted && (
                              <>
                                <span className="text-lg text-muted-foreground line-through">
                                  NPR {formatPrice(course.original_price)}
                                </span>
                                <Badge className="bg-green-500">
                                  {course.discount_percentage}% OFF
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Enrollment Status */}
                      {isEnrolled && enrollment && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Your Progress</span>
                            <span className="font-medium">{enrollment.progress_percentage}%</span>
                          </div>
                          <Progress value={enrollment.progress_percentage} className="h-2" />
                          {enrollment.certificate_issued && (
                            <Badge className="bg-green-500 w-full justify-center mt-2">
                              <Award className="w-3 h-3 mr-1" />
                              Certificate Issued
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        {isEnrolled ? (
                          <Button size="lg" className="w-full">
                            <Play className="w-4 h-4 mr-2" />
                            Continue Learning
                          </Button>
                        ) : (
                          <>
                            <Button size="lg" className="w-full">
                              Enroll Now
                            </Button>
                            <Button size="lg" variant="outline" className="w-full">
                              Request Demo Class
                            </Button>
                          </>
                        )}
                      </div>

                      {/* Course Includes */}
                      <div className="pt-4 border-t border-border">
                        <h4 className="font-semibold text-foreground mb-3">This course includes:</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Video className="w-4 h-4 text-primary" />
                            <span>{course.total_hours || 0} hours on-demand video</span>
                          </li>
                          <li className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Download className="w-4 h-4 text-primary" />
                            <span>{totalResources} downloadable resources</span>
                          </li>
                          <li className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Award className="w-4 h-4 text-primary" />
                            <span>Certificate of completion</span>
                          </li>
                          <li className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Smartphone className="w-4 h-4 text-primary" />
                            <span>Access on mobile and TV</span>
                          </li>
                          <li className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Infinity className="w-4 h-4 text-primary" />
                            <span>Full lifetime access</span>
                          </li>
                        </ul>
                      </div>

                      {/* Batch Start Date */}
                      {course.batch_start_date && (
                        <div className="pt-4 border-t border-border">
                          <div className="flex items-center gap-3 text-sm">
                            <Calendar className="w-5 h-5 text-primary" />
                            <div>
                              <p className="text-muted-foreground">Next batch starts</p>
                              <p className="font-semibold text-foreground">
                                {new Date(course.batch_start_date).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 rounded-2xl overflow-x-auto flex-nowrap">
              <TabsTrigger value="overview" className="px-6 py-3 rounded-xl data-[state=active]:bg-background">
                <Eye className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="curriculum" className="px-6 py-3 rounded-xl data-[state=active]:bg-background">
                <BookOpen className="w-4 h-4 mr-2" />
                Curriculum
              </TabsTrigger>
              <TabsTrigger value="instructor" className="px-6 py-3 rounded-xl data-[state=active]:bg-background">
                <GraduationCap className="w-4 h-4 mr-2" />
                Instructor
              </TabsTrigger>
              <TabsTrigger value="reviews" className="px-6 py-3 rounded-xl data-[state=active]:bg-background">
                <Star className="w-4 h-4 mr-2" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="faq" className="px-6 py-3 rounded-xl data-[state=active]:bg-background">
                <MessageCircle className="w-4 h-4 mr-2" />
                FAQ
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-12">
              {/* Detailed Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <FileText className="w-6 h-6 text-primary" />
                      About This Course
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                      {course.detailed_description ? (
                        <p className="whitespace-pre-wrap">{course.detailed_description}</p>
                      ) : (
                        <p className="text-muted-foreground">{course.short_description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* What You'll Learn */}
              {course.features && course.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Target className="w-6 h-6 text-primary" />
                        What You'll Learn
                      </CardTitle>
                      <CardDescription>
                        By the end of this course, you'll be able to:
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {course.features
                          .sort((a, b) => a.order - b.order)
                          .map((feature, index) => (
                            <motion.div
                              key={feature.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10"
                            >
                              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                              <span className="text-foreground">{feature.feature}</span>
                            </motion.div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Tools & Technologies */}
              {course.tools && course.tools.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Wrench className="w-6 h-6 text-primary" />
                        Tools & Technologies
                      </CardTitle>
                      <CardDescription>
                        Master these industry-standard tools and technologies
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {course.tools
                          .sort((a, b) => a.order - b.order)
                          .map((tool) => (
                            <TooltipProvider key={tool.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors cursor-help">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                      {getToolIcon(tool.name)}
                                    </div>
                                    <span className="font-medium text-sm">{tool.name}</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Learn {tool.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Course Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-3">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-2xl font-bold text-foreground">{course.total_hours || 0}+</p>
                      <p className="text-sm text-muted-foreground">Hours of Content</p>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-3">
                        <Video className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-2xl font-bold text-foreground">{totalTopics}</p>
                      <p className="text-sm text-muted-foreground">Video Lessons</p>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-3">
                        <Download className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-2xl font-bold text-foreground">{totalResources}+</p>
                      <p className="text-sm text-muted-foreground">Resources</p>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-3">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-2xl font-bold text-foreground">100%</p>
                      <p className="text-sm text-muted-foreground">Certificate</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>
            {/* Curriculum Tab - Professional Redesign */}
<TabsContent value="curriculum" className="space-y-8">
  {/* Curriculum Header with Stats */}
  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 md:p-8">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
          Course Curriculum
        </h3>
        <p className="text-muted-foreground">
          Comprehensive learning path designed for your success
        </p>
      </div>
      
      {/* Curriculum Stats */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-3 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-border">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-semibold text-foreground">{course.modules?.length || 0}</span>
            <span className="text-sm text-muted-foreground ml-1">Modules</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-border">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Play className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-semibold text-foreground">{totalTopics}</span>
            <span className="text-sm text-muted-foreground ml-1">Lessons</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-border">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="font-semibold text-foreground">{formatDuration(totalVideoMinutes)}</span>
            <span className="text-sm text-muted-foreground ml-1">Total</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Action Buttons */}
    <div className="flex flex-wrap items-center gap-3 mt-6">
      <Button className="gap-2">
        <DownloadCloud className="w-4 h-4" />
        Download Syllabus (PDF)
      </Button>
      <Button variant="outline" className="gap-2">
        <Eye className="w-4 h-4" />
        Preview First Chapter
      </Button>
    </div>
  </div>

  {/* Curriculum Content */}
  <Card className="border-0 shadow-lg overflow-hidden">
    <CardContent className="p-0">
      {course.modules && course.modules.length > 0 ? (
        <div className="divide-y divide-border">
          {course.modules
            .sort((a, b) => a.order - b.order)
            .map((module, moduleIndex) => (
              <div key={module.id} className="bg-card">
                {/* Module Header */}
                <div 
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => {
                    const moduleId = `module-${module.id}`;
                    setExpandedModules(prev => 
                      prev.includes(moduleId)
                        ? prev.filter(id => id !== moduleId)
                        : [...prev, moduleId]
                    );
                  }}
                >
                  <div className="flex items-start gap-4 flex-1">
                    {/* Module Number Badge */}
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-lg transition-colors",
                      expandedModules.includes(`module-${module.id}`)
                        ? "bg-primary text-white"
                        : "bg-primary/10 text-primary group-hover:bg-primary/20"
                    )}>
                      {module.order}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <h4 className="text-lg font-semibold text-foreground">
                          {module.title}
                        </h4>
                        
                        {/* Module Stats */}
                        <div className="flex items-center gap-3 text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Play className="w-3.5 h-3.5" />
                            {module.topics?.length || 0} lessons
                          </span>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            {module.duration} hrs
                          </span>
                        </div>
                      </div>
                      
                      {module.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {module.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Expand/Collapse Icon */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-4 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      const moduleId = `module-${module.id}`;
                      setExpandedModules(prev => 
                        prev.includes(moduleId)
                          ? prev.filter(id => id !== moduleId)
                          : [...prev, moduleId]
                      );
                    }}
                  >
                    <svg
                      className={cn(
                        "w-5 h-5 transition-transform duration-200",
                        expandedModules.includes(`module-${module.id}`) ? "rotate-180" : ""
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>
                </div>
                
                {/* Module Topics */}
                {expandedModules.includes(`module-${module.id}`) && (
                  <div className="bg-muted/30 px-6 py-4 border-t border-border">
                    {module.topics && module.topics.length > 0 ? (
                      <div className="space-y-2">
                        {module.topics
                          .sort((a, b) => a.order - b.order)
                          .map((topic, topicIndex) => (
                            <div
                              key={topic.id}
                              className="group/topic flex items-center justify-between p-4 rounded-xl bg-background hover:shadow-md transition-all border border-border/50 hover:border-primary/30"
                            >
                              <div className="flex items-center gap-4 flex-1">
                                {/* Play Button / Status */}
                                <div className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                  topic.video_url 
                                    ? "bg-primary/10 text-primary group-hover/topic:bg-primary group-hover/topic:text-white cursor-pointer"
                                    : "bg-muted text-muted-foreground"
                                )}>
                                  <Play className="w-4 h-4" />
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                    <div>
                                      <h5 className="font-medium text-foreground">
                                        {topic.order}. {topic.title}
                                      </h5>
                                      {topic.description && (
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                          {topic.description}
                                        </p>
                                      )}
                                    </div>
                                    
                                    {/* Topic Metadata */}
                                    <div className="flex items-center gap-3">
                                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                                        {formatDuration(topic.duration)}
                                      </span>
                                      
                                      {topic.resources && topic.resources.length > 0 && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                                                <FolderOpen className="w-3.5 h-3.5" />
                                                <span>{topic.resources.length}</span>
                                              </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>{topic.resources.length} resources available</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex items-center gap-1 ml-4">
                                {topic.video_url && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="w-8 h-8 p-0 rounded-lg opacity-0 group-hover/topic:opacity-100 transition-opacity"
                                          onClick={() => window.open(topic.video_url, '_blank')}
                                        >
                                          <Eye className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Preview video</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                                
                                {topic.resources && topic.resources.length > 0 && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="w-8 h-8 p-0 rounded-lg opacity-0 group-hover/topic:opacity-100 transition-opacity"
                                        >
                                          <Download className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Download resources</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                          <BookOpen className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground font-medium">Topics coming soon</p>
                        <p className="text-sm text-muted-foreground/60 mt-1">
                          We're preparing engaging content for this module
                        </p>
                      </div>
                    )}
                    
                    {/* Module Progress (if enrolled) */}
                    {isEnrolled && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Module progress</span>
                          <span className="font-medium text-foreground">0%</span>
                        </div>
                        <Progress value={0} className="h-1.5" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-12 h-12 text-primary/40" />
          </div>
          <h3 className="text-2xl font-display font-bold text-foreground mb-2">
            Curriculum Under Development
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Our expert instructors are crafting an exceptional learning experience for you. Check back soon!
          </p>
          <Button variant="outline" className="gap-2">
            <Bell className="w-4 h-4" />
            Notify Me When Ready
          </Button>
        </div>
      )}
    </CardContent>
  </Card>

  {/* Learning Path Timeline (Optional Feature) */}
  {course.modules && course.modules.length > 0 && (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 md:p-8">
      <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        Your Learning Journey
      </h4>
      <div className="flex flex-col md:flex-row items-start gap-4">
        {course.modules.slice(0, 4).map((module, index) => (
          <div key={module.id} className="flex-1 w-full">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm",
                  index === 0 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                )}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className="absolute top-5 left-10 w-full h-0.5 bg-border hidden md:block" 
                       style={{ width: 'calc(100% - 2.5rem)' }} />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{module.title}</p>
                <p className="text-xs text-muted-foreground">{module.topics?.length || 0} lessons</p>
              </div>
            </div>
          </div>
        ))}
        {course.modules.length > 4 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              +{course.modules.length - 4}
            </span>
            <span>more modules</span>
          </div>
        )}
      </div>
    </div>
  )}
</TabsContent>




            {/* Instructor Tab */}
            <TabsContent value="instructor">
              <Card>
                <CardContent className="p-8">
                  {course.instructor ? (
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="md:w-1/3">
                        <div className="sticky top-24">
                          <div className="relative">
                            <img
                              src={instructorImage}
                              alt={instructorName}
                              className="w-full aspect-square rounded-2xl object-cover shadow-xl"
                            />
                            {course.instructor?.is_featured && (
                              <Badge className="absolute top-4 right-4 bg-primary">
                                <Star className="w-3 h-3 mr-1" />
                                Featured Instructor
                              </Badge>
                            )}
                          </div>

                          {/* Social Links */}
                          {(course.instructor?.linkedin_url || course.instructor?.github_url) && (
                            <div className="flex gap-3 mt-6">
                              {course.instructor.linkedin_url && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="rounded-full"
                                  onClick={() => window.open(course.instructor!.linkedin_url!, '_blank')}
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                  </svg>
                                </Button>
                              )}
                              {course.instructor.github_url && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="rounded-full"
                                  onClick={() => window.open(course.instructor!.github_url!, '_blank')}
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.418-1.306.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                  </svg>
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="md:w-2/3 space-y-6">
                        <div>
                          <h2 className="text-3xl font-display font-bold text-foreground mb-2">
                            {instructorName}
                          </h2>
                          <p className="text-lg text-primary">{course.instructor?.title}</p>
                        </div>

                        {course.instructor?.experience_years > 0 && (
                          <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-xl">
                            <Briefcase className="w-5 h-5 text-primary" />
                            <span className="font-medium">
                              {course.instructor.experience_years}+ years of industry experience
                            </span>
                          </div>
                        )}

                        {course.instructor?.bio && (
                          <div>
                            <h3 className="text-xl font-semibold mb-3">About</h3>
                            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                              {course.instructor.bio}
                            </p>
                          </div>
                        )}

                        {/* Instructor Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-4">
                          <div className="text-center p-4 bg-card rounded-xl border border-border">
                            <p className="text-2xl font-bold text-foreground">
                              {course.instructor?.experience_years || 0}+
                            </p>
                            <p className="text-sm text-muted-foreground">Years Experience</p>
                          </div>
                          <div className="text-center p-4 bg-card rounded-xl border border-border">
                            <p className="text-2xl font-bold text-foreground">
                              {course.instructor?.course_count || 1}
                            </p>
                            <p className="text-sm text-muted-foreground">Courses</p>
                          </div>
                          <div className="text-center p-4 bg-card rounded-xl border border-border">
                            <p className="text-2xl font-bold text-foreground">
                              {course.students_count?.toLocaleString() || 0}+
                            </p>
                            <p className="text-sm text-muted-foreground">Students</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Instructor information coming soon!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Star className="w-6 h-6 text-primary" />
                        Student Reviews
                      </CardTitle>
                      <CardDescription>
                        What our students are saying about this course
                      </CardDescription>
                    </div>
                    <Button variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Write a Review
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Review Summary */}
                  <div className="flex items-center gap-8 p-6 bg-primary/5 rounded-xl mb-8">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-foreground">{course.rating || 0}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "w-5 h-5",
                              star <= Math.round(parseFloat(course.rating || '0'))
                                ? "fill-amber-500 text-amber-500"
                                : "text-muted-foreground"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Based on {course.review_count || 0} reviews
                      </p>
                    </div>

                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-sm w-8">{star} star</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{ width: `${Math.random() * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12">
                            {Math.floor(Math.random() * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reviews List - Placeholder */}
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-6 rounded-xl border border-border">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                              <User className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">Student Name {i}</h4>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={cn(
                                        "w-4 h-4",
                                        star <= 5 - i + 1
                                          ? "fill-amber-500 text-amber-500"
                                          : "text-muted-foreground"
                                      )}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">2 months ago</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                        </div>
                        <h5 className="font-medium text-foreground mb-2">Great Course!</h5>
                        <p className="text-muted-foreground">
                          This course exceeded my expectations. The instructor explains complex topics clearly and the hands-on projects helped reinforce my learning.
                        </p>
                      </div>
                    ))}
                  </div>

                  <Button variant="link" className="w-full mt-4">
                    Load More Reviews
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <MessageCircle className="w-6 h-6 text-primary" />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Is this course suitable for beginners?</AccordionTrigger>
                      <AccordionContent>
                        Yes, this course is designed for {course.level.toLowerCase()} level learners. 
                        {course.level === 'Beginner' 
                          ? ' No prior experience is required. We start from the basics and gradually build up to advanced concepts.'
                          : course.level === 'Intermediate'
                          ? ' Basic knowledge of the subject is recommended, but we cover all foundational concepts thoroughly.'
                          : ' This course assumes you have solid foundational knowledge and focuses on advanced topics and real-world applications.'}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger>How long do I have access to the course?</AccordionTrigger>
                      <AccordionContent>
                        You get lifetime access to the course materials. Once enrolled, you can learn at your own pace and revisit the content anytime, even after completing the course.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger>Will I receive a certificate?</AccordionTrigger>
                      <AccordionContent>
                        Yes, upon successful completion of the course, you'll receive a verified certificate that you can share on LinkedIn and add to your resume.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger>What if I have questions during the course?</AccordionTrigger>
                      <AccordionContent>
                        You'll have access to our dedicated Q&A forum where you can ask questions and get help from instructors and fellow students. We typically respond within 24-48 hours.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger>Is there a money-back guarantee?</AccordionTrigger>
                      <AccordionContent>
                        Yes, we offer a 7-day money-back guarantee. If you're not satisfied with the course for any reason, you can request a full refund within 7 days of enrollment.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Courses Section */}
      <section className="py-20 bg-muted/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Related Courses
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Expand your skills with these popular courses in the same category
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for related courses */}
            <Card className="hover:shadow-xl transition-all group">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Related courses coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={`Ready to Master ${course.title}?`}
        subtitle={`Join our next batch and start your journey to becoming a ${course.level} level professional.`}
        primaryText="Enroll Now"
        primaryLink="/contact"
        secondaryText="Request Syllabus"
        secondaryLink={`/courses/${course.slug}/syllabus`}
      />
    </Layout>
  );
};

export default CourseDetail;