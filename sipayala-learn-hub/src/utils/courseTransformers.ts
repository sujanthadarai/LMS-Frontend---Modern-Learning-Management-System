// src/utils/courseTransformers.ts
import { type Course } from '../services/courseService';
import { 
  Code2, Laptop, Database, Globe, 
  type LucideIcon 
} from 'lucide-react';

// Icon mapping based on category
const categoryIconMap: Record<string, LucideIcon> = {
  'Web Development': Code2,
  'Data Science': Database,
  'Machine Learning': Database,
  'Python': Code2,
  'React': Laptop,
  'Full Stack': Globe,
  'Mobile Development': Laptop,
  'DevOps': Globe,
};

// Color mapping based on category
const categoryColorMap: Record<string, { 
  hue: string; 
  accent: string; 
  light: string; 
  border: string;
}> = {
  'Web Development': {
    hue: 'indigo',
    accent: '#3D3F8C',
    light: 'rgba(61,63,140,0.07)',
    border: 'rgba(61,63,140,0.16)',
  },
  'Data Science': {
    hue: 'navy',
    accent: '#1C2151',
    light: 'rgba(28,33,81,0.07)',
    border: 'rgba(28,33,81,0.16)',
  },
  'Python': {
    hue: 'royalBlue',
    accent: '#4A5FA0',
    light: 'rgba(74,95,160,0.07)',
    border: 'rgba(74,95,160,0.16)',
  },
  'React': {
    hue: 'steel',
    accent: '#5F789E',
    light: 'rgba(95,120,158,0.07)',
    border: 'rgba(95,120,158,0.16)',
  },
  'Full Stack': {
    hue: 'indigo',
    accent: '#3D3F8C',
    light: 'rgba(61,63,140,0.07)',
    border: 'rgba(61,63,140,0.16)',
  },
};

// Default colors for uncategorized courses
const defaultColors = {
  hue: 'indigo',
  accent: '#3D3F8C',
  light: 'rgba(61,63,140,0.07)',
  border: 'rgba(61,63,140,0.16)',
};

export const transformCourseForHero = (course: Course) => {
  const categoryName = course.category?.name || 'Web Development';
  const colors = categoryColorMap[categoryName] || defaultColors;
  const Icon = categoryIconMap[categoryName] || Code2;

  // Format start date
  const startDate = course.batch_start_date 
    ? new Date(course.batch_start_date).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      })
    : 'Coming Soon';

  // Calculate seats (mock data - you might want to add these to backend)
  const totalSeats = 30;
  const enrolled = course.students_count || 0;
  const availableSeats = Math.max(0, totalSeats - enrolled);
  const waitlist = enrolled > totalSeats ? enrolled - totalSeats : 0;

  // Calculate pricing
  const originalPrice = course.original_price 
    ? parseFloat(course.original_price) 
    : parseFloat(course.price) * 1.2;
  const discountedPrice = parseFloat(course.price);
  const discountPercentage = course.original_price 
    ? Math.round((1 - discountedPrice / originalPrice) * 100)
    : 0;

  // Early bird (mock data)
  const earlyBirdPrice = discountedPrice * 0.9;
  const earlyBirdDate = new Date();
  earlyBirdDate.setDate(earlyBirdDate.getDate() + 7);
  const earlyBirdDateStr = earlyBirdDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  return {
    id: course.id,
    title: course.title,
    icon: Icon,
    startDate: startDate,
    time: "10:00 AM – 1:00 PM", // Mock - you might want to add to backend
    duration: `${course.duration} hours`,
    mode: "Live Online", // Mock - you might want to add to backend
    seats: totalSeats,
    enrolled: enrolled,
    waitlist: waitlist,
    level: course.level_display || course.level,
    instructor: {
      name: course.instructor?.user?.full_name || 'Expert Instructor',
      title: course.instructor?.title || 'Industry Expert',
      exp: `${course.instructor?.experience_years || 8}+ yrs`,
      rating: course.rating || 4.8,
      students: course.students_count || 0
    },
    price: {
      orig: originalPrice,
      disc: discountedPrice,
      pct: discountPercentage,
      bird: earlyBirdPrice,
      birdDate: earlyBirdDateStr,
    },
    highlights: course.features?.map(f => f.name) || [
      "Hands-on Projects",
      "Expert Mentorship",
      "Career Support",
      "Certificate"
    ],
    ...colors,
  };
};

export const transformHeroStats = (stats: any) => {
  return [
    {
      icon: 'Users',
      val: stats?.total_students || 5000,
      suf: '+',
      label: 'Certified Graduates',
      sub: 'Across 20+ countries'
    },
    {
      icon: 'BookOpen',
      val: stats?.total_courses || 28,
      suf: '',
      label: 'Industry Courses',
      sub: 'Updated quarterly'
    },
    {
      icon: 'Award',
      val: parseFloat(stats?.placement_rate || '94.7'),
      suf: '%',
      label: 'Placement Rate',
      sub: 'Within 6 months'
    },
    {
      icon: 'TrendingUp',
      val: parseFloat(stats?.salary_hike || '45'),
      suf: '%',
      label: 'Avg. Salary Hike',
      sub: 'For placed students'
    }
  ];
};