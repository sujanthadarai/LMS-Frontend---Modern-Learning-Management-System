// src/components/common/CourseCard.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Users, 
  Star, 
  ArrowRight,
  BookOpen,
  TrendingUp,
  Calendar,
  CheckCircle,
  Zap,
  Globe,
  Shield,
  PlayCircle,
  Award
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Define Course interface matching your API response
interface Course {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  category: {
    id: number;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    course_count?: number;
  };
  level: string;
  level_display: string;
  price: string;
  original_price: string | null;
  is_discounted: boolean;
  discount_percentage: number;
  duration: string;
  thumbnail: string | null;
  students_count: number;
  rating: string;
  is_popular: boolean;
  is_featured: boolean;
  instructor?: {
    id: number;
    user: {
      id: number;
      email: string;
      full_name: string | null;
      role: string;
      phone_number: string | null;
      gender: string;
      avatar: string | null;
      date_joined: string;
    };
    bio: string;
    title: string;
    experience_years: number;
    profile_image: string | null;
    linkedin_url: string | null;
    github_url: string | null;
    is_featured: boolean;
  } | null;
  modules_count?: number;
  completion_rate?: number;
  language?: string;
  last_updated?: string;
  batch_start_date?: string | null;
  certificate_included?: boolean;
  lifetime_access?: boolean;
}

interface CourseCardProps {
  course: Course;
  index: number;
  variant?: 'default' | 'compact' | 'featured';
}

const CourseCard = ({ course, index, variant = 'default' }: CourseCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [instructorImageLoaded, setInstructorImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [stats, setStats] = useState({
    students: 0,
    rating: 0
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Animate stats counting
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setStats({
        students: Math.floor(progress * (course.students_count || 0)),
        rating: parseFloat((progress * parseFloat(course.rating || '4.8')).toFixed(1))
      });
      
      if (step >= steps) clearInterval(timer);
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [course.students_count, course.rating]);

  // Process image URL with better error handling
  const getImageUrl = (url: string | null, type: 'course' | 'instructor' = 'course') => {
    if (!url) return null;
    
    let processedUrl = url.trim();
    
    // Check if URL is absolute
    if (processedUrl.startsWith('http://') || processedUrl.startsWith('https://')) {
      return processedUrl;
    }
    
    // Handle different path patterns
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    
    if (processedUrl.startsWith('/')) {
      return `${baseUrl}${processedUrl}`;
    }
    
    if (type === 'instructor') {
      return `${baseUrl}/media/${processedUrl}`;
    }
    
    // For course images
    return `${baseUrl}/media/${processedUrl}`;
  };

  const courseImageUrl = getImageUrl(course.thumbnail, 'course');
  const instructorImageUrl = getImageUrl(
    course.instructor?.profile_image,
    'instructor'
  );

  // Format price with Nepal-specific formatting
  const formatPrice = (price: string) => {
    try {
      const numPrice = parseFloat(price);
      if (isNaN(numPrice)) return "Rs. 0";
      
      if (numPrice >= 100000) {
        return `Rs. ${(numPrice / 100000).toFixed(1)} lakh`;
      }
      
      return new Intl.NumberFormat('en-NP', {
        style: 'currency',
        currency: 'NPR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numPrice).replace('NPR', 'Rs.');
    } catch {
      return `Rs. ${price}`;
    }
  };

  // Get level styling using theme colors
  const getLevelConfig = (level: string) => {
    const levelLower = level.toLowerCase();
    
    if (levelLower.includes('beginner')) {
      return {
        color: 'from-emerald-500 to-emerald-600',
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-700 dark:text-emerald-300',
        icon: '🌱'
      };
    } else if (levelLower.includes('intermediate')) {
      return {
        color: 'from-amber-500 to-amber-600',
        bg: 'bg-amber-500/10',
        text: 'text-amber-700 dark:text-amber-300',
        icon: '⚡'
      };
    } else if (levelLower.includes('advanced')) {
      return {
        color: 'from-rose-500 to-rose-600',
        bg: 'bg-rose-500/10',
        text: 'text-rose-700 dark:text-rose-300',
        icon: '🚀'
      };
    }
    
    return {
      color: 'from-gray-500 to-gray-600',
      bg: 'bg-gray-500/10',
      text: 'text-gray-700 dark:text-gray-300',
      icon: '📚'
    };
  };

  // Get category styling using theme colors
  const getCategoryConfig = (categoryName: string) => {
    const configs: Record<string, any> = {
      'Web Development': {
        color: 'from-steel-blue to-cyan-500',
        bg: 'bg-steel-blue/10',
        icon: '🌐',
        badgeColor: 'bg-steel-blue/20 text-steel-blue dark:text-steel-blue-light'
      },
      'Data Science': {
        color: 'from-indigo-purple to-purple-500',
        bg: 'bg-indigo-purple/10',
        icon: '📊',
        badgeColor: 'bg-indigo-purple/20 text-indigo-purple dark:text-indigo-purple-light'
      },
      'Machine Learning': {
        color: 'from-purple-500 to-indigo-purple',
        bg: 'bg-purple-500/10',
        icon: '🤖',
        badgeColor: 'bg-purple-500/20 text-purple-600 dark:text-purple-300'
      },
      'Cloud Computing': {
        color: 'from-cyan-500 to-steel-blue',
        bg: 'bg-cyan-500/10',
        icon: '☁️',
        badgeColor: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300'
      },
    };
    
    return configs[categoryName] || {
      color: 'from-gray-500 to-gray-600',
      bg: 'bg-gray-500/10',
      icon: '📖',
      badgeColor: 'bg-gray-500/20 text-gray-700 dark:text-gray-300'
    };
  };

  // Get instructor name from API response
  const getInstructorName = (): string => {
    if (!course.instructor) return 'Expert Instructor';
    
    // Check if user has full_name
    if (course.instructor.user?.full_name) {
      return course.instructor.user.full_name;
    }
    
    // Fallback to email username
    if (course.instructor.user?.email) {
      return course.instructor.user.email.split('@')[0];
    }
    
    // Last resort
    return `Instructor ${course.instructor.id}`;
  };

  // Get instructor title/role
  const getInstructorTitle = (): string => {
    if (course.instructor?.title) {
      return course.instructor.title;
    }
    return 'Instructor';
  };

  // Get instructor experience
  const getInstructorExperience = (): string => {
    if (course.instructor?.experience_years && course.instructor.experience_years > 0) {
      return `${course.instructor.experience_years}+ years`;
    }
    return '';
  };

  // Fallback images with realistic course thumbnails
  const getFallbackImage = (categoryName: string) => {
    const fallbacks: Record<string, string> = {
      'Web Development': 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop&auto=format&q=80',
      'Data Science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop&auto=format&q=80',
      'Machine Learning': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop&auto=format&q=80',
      'Cloud Computing': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop&auto=format&q=80',
      'Programming': 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=800&h=450&fit=crop&auto=format&q=80',
    };
    
    return fallbacks[categoryName] || 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=450&fit=crop&auto=format&q=80';
  };

  const finalImageUrl = courseImageUrl || getFallbackImage(course.category.name);

  // Calculate savings
  const calculateSavings = () => {
    if (!course.original_price || !course.is_discounted) return 0;
    const original = parseFloat(course.original_price);
    const current = parseFloat(course.price);
    return original - current;
  };

  const savings = calculateSavings();
  const categoryConfig = getCategoryConfig(course.category.name);
  const levelConfig = getLevelConfig(course.level);
  const instructorName = getInstructorName();
  const instructorTitle = getInstructorTitle();
  const instructorExperience = getInstructorExperience();

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
        scale: { type: "spring", stiffness: 300, damping: 25 }
      }}
      whileHover={{ 
        y: -6,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-steel-blue/20 via-steel-blue/10 to-transparent opacity-0 blur-xl transition-opacity duration-500"
        animate={{ opacity: isHovered ? 0.6 : 0 }}
      />
      
      {/* Floating elements */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-steel-blue to-indigo-purple text-white px-4 py-2 rounded-lg shadow-xl z-20"
          >
            <div
              className={`text-sm font-semibold whitespace-nowrap px-3 py-1 rounded-full
              ${course.is_discounted
                ? 'bg-sky-100 text-sky-700'
                : 'bg-slate-100 text-slate-700'
              }`}
            >
              {course.is_discounted ? (
                <>
                  Save {formatPrice(savings.toString())}
                </>
              ) : (
                'Limited Seats'
              )}
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-steel-blue rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className={cn(
          "relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60",
          "overflow-hidden h-full flex flex-col shadow-lg hover:shadow-xl",
          "transition-all duration-500 backdrop-blur-sm bg-gradient-to-br from-white/95 to-white/90 dark:from-gray-900/95 dark:to-gray-900/90",
          "hover:border-steel-blue/30 dark:hover:border-steel-blue/40",
          variant === 'featured' && "ring-2 ring-steel-blue/20"
        )}
      >
        {/* Image Container with Realistic Overlay */}
        <div className="relative h-56 overflow-hidden">
          {/* Loading shimmer */}
          {!imageLoaded && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800"
              style={{
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s infinite linear'
              }}
            />
          )}
          
          {/* Course Image */}
          <motion.img
            ref={imageRef}
            src={finalImageUrl}
            alt={course.title}
            className={cn(
              "w-full h-full object-cover transition-all duration-700",
              imageLoaded ? 'opacity-100' : 'opacity-0',
              isHovered && "scale-110"
            )}
            onLoad={() => {
              setImageLoaded(true);
              if (imageRef.current) {
                imageRef.current.style.opacity = '1';
              }
            }}
            onError={() => {
              const img = imageRef.current;
              if (img) {
                img.src = getFallbackImage(course.category.name);
              }
            }}
            loading="lazy"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Course Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              <span className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-full backdrop-blur-md",
                "bg-gradient-to-r",
                categoryConfig.color,
                "text-white shadow-lg"
              )}>
                <span className="mr-1">{categoryConfig.icon}</span>
                {course.category.name}
              </span>
              
              {course.is_popular && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="px-3 py-1.5 bg-gradient-to-r from-warm-yellow to-amber-500 text-gray-900 text-xs font-bold rounded-full backdrop-blur-md shadow-lg flex items-center gap-1"
                >
                  <TrendingUp className="w-3 h-3" />
                  Trending
                </motion.span>
              )}
            </motion.div>
            
            {/* Discount Badge */}
            {course.is_discounted && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="relative"
              >
                <div className="px-4 py-2 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white text-sm font-bold rounded-xl shadow-2xl">
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 mr-1" fill="currentColor" />
                    {Math.abs(course.discount_percentage).toFixed(0)}% OFF
                  </div>
                </div>
                <motion.div
                  className="absolute inset-0 rounded-xl bg-red-500/30 blur-md"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            )}
          </div>
          
          {/* Play Button on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                onClick={() => setShowPreview(true)}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 bg-gradient-to-r from-steel-blue to-indigo-purple rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
                >
                  <PlayCircle className="w-10 h-10 text-white" fill="white" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Featured Badge */}
          {course.is_featured && (
            <div className="absolute top-4 right-4">
              <div className="px-3 py-1 bg-gradient-to-r from-warm-yellow via-amber-500 to-warm-yellow text-gray-900 text-xs font-bold rounded-full shadow-lg">
                ⭐ Featured
              </div>
            </div>
          )}
          
          {/* Duration Overlay */}
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full">
            <div className="flex items-center gap-2 text-white text-sm">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{course.duration} weeks</span>
            </div>
          </div>
          
          {/* Level Indicator */}
          <div className="absolute bottom-4 right-4">
            <div className={cn(
              "px-3 py-1.5 rounded-full backdrop-blur-md text-sm font-bold shadow-lg",
              levelConfig.bg,
              levelConfig.text
            )}>
              {levelConfig.icon} {course.level_display || course.level}
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="flex-1 p-5 flex flex-col">
          {/* Course Title and Description */}
          <div className="mb-4">
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-steel-blue transition-colors"
            >
              {course.title}
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4 leading-relaxed"
            >
              {course.short_description}
            </motion.p>
          </div>
          
          {/* Instructor Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-5"
          >
            <div className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
              {/* Instructor Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-md">
                  {instructorImageUrl ? (
                    <img
                      src={instructorImageUrl}
                      alt={instructorName}
                      className={cn(
                        "w-full h-full object-cover transition-opacity duration-300",
                        instructorImageLoaded ? 'opacity-100' : 'opacity-0'
                      )}
                      onLoad={() => setInstructorImageLoaded(true)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = "w-full h-full bg-gradient-to-br from-steel-blue/20 to-indigo-purple/10 flex items-center justify-center";
                          fallback.innerHTML = `<span class="text-lg text-steel-blue font-semibold">${instructorName.charAt(0)}</span>`;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-steel-blue/20 to-indigo-purple/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-steel-blue">
                        {instructorName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                {/* Verified Badge */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" fill="white" />
                </div>
              </div>
              
              {/* Instructor Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 dark:text-white truncate">
                    {instructorName}
                  </span>
                  {instructorTitle && (
                    <span className="text-xs px-2 py-1 bg-steel-blue/10 text-steel-blue rounded-full font-medium whitespace-nowrap">
                      {instructorTitle}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <BookOpen className="w-3 h-3" />
                    <span>Instructor</span>
                  </div>
                  {instructorExperience && (
                    <>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Award className="w-3 h-3" />
                        <span>{instructorExperience}</span>
                      </div>
                    </>
                  )}
                  {course.language && (
                    <>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Globe className="w-3 h-3" />
                        <span>{course.language}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Course Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-5"
          >
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-steel-blue dark:text-steel-blue-light" />
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.students.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Students</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-warm-yellow dark:text-warm-yellow fill-warm-yellow dark:fill-warm-yellow" />
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.rating.toFixed(1)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Rating</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-indigo-purple dark:text-indigo-purple-light" />
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {course.completion_rate || '85'}%
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Success</div>
              </div>
            </div>
          </motion.div>
          
          {/* Price and Action Buttons */}
          <div className="mt-auto">
            {/* Price Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-5"
            >
              <div className="flex items-baseline justify-between">
                <div>
                 <div className="flex items-baseline gap-3">
  <div className="flex items-baseline gap-1">
    <span className="text-base font-medium text-gray-500 uppercase tracking-wide">NPR</span>
    <span className="text-xl font-bold text-gray-900">{formatPrice(course.price)}</span>
  </div>
  {course.original_price && parseFloat(course.original_price) > 0 && (
    <span className="text-base text-gray-400 line-through">
      NPR {formatPrice(course.original_price)}
    </span>
  )}
</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {course.modules_count || '12'} modules • {course.duration} weeks
                  </div>
                </div>
                
                {course.batch_start_date && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Starts {new Date(course.batch_start_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              <Link to={`/courses/${course.slug}`}>
                <Button 
  className={cn(
    "w-full font-semibold py-6 text-base rounded-xl",
    "bg-gradient-to-r from-slate-600 via-indigo-700 to-purple-700",
    "hover:from-slate-700 hover:via-indigo-800 hover:to-purple-800",
    "shadow-md hover:shadow-lg active:scale-[0.98]",
    "text-white",
    "transition-all duration-300 relative overflow-hidden group/btn border-none"
  )}
>
  <span className="relative z-10 flex items-center justify-center tracking-wide">
    View Course Details
    <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-2 transition-transform" />
  </span>
  {/* Subtle shine effect */}
  <div className="absolute inset-0 overflow-hidden rounded-xl">
    <div className="absolute -inset-full top-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover/btn:animate-shine" />
  </div>
</Button>
              </Link>
              
              <div className="grid grid-cols-2 gap-3">
                <Link to={`/courses/${course.slug}/enroll`}>
                  <Button 
                    variant="outline"
                    className={cn(
                      "w-full py-6 rounded-xl border-2 border-steel-blue",
                      "hover:bg-steel-blue hover:text-white hover:border-steel-blue",
                      "text-steel-blue",
                      "transition-all duration-300 group/enroll relative overflow-hidden"
                    )}
                  >
                    <span className="relative z-10">Enroll Now</span>
                    <motion.div
                      className="absolute inset-0 bg-steel-blue opacity-0 group-hover/enroll:opacity-100 transition-opacity duration-300"
                    />
                  </Button>
                </Link>
                
                <Link to={`/courses/${course.slug}#preview`}>
                  <Button 
                    variant="ghost"
                    className="w-full py-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    Preview
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Hover effect border */}
        <motion.div 
          className="absolute inset-0 border-2 border-transparent rounded-2xl pointer-events-none"
          animate={{ 
            borderColor: isHovered ? 'hsl(var(--color-steel-blue) / 0.3)' : 'transparent',
            boxShadow: isHovered ? '0 20px 60px -20px hsl(var(--color-steel-blue) / 0.3)' : 'none'
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

// Add global styles
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes shine {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    100% { transform: translateX(200%) translateY(200%) rotate(45deg); }
  }
  
  .animate-shine {
    animation: shine 1.5s ease-out;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
document.head.appendChild(style);

export default CourseCard;