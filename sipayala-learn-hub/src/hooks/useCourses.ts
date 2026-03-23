// src/hooks/useCourses.ts
import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import { mockPopularCourses } from '@/store/api/mockCourseApi';

// Types matching your Django API
export interface Course {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  detailed_description?: string;
  category: {
    id: number;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
  } | null;
  level: string;
  level_display: string;
  price: string;
  original_price: string | null;
  is_discounted: boolean;
  discount_percentage: number;
  duration: string;
  total_hours?: number;
  thumbnail: string | null;
  video_preview_url?: string;
  students_count: number;
  rating: string;
  review_count?: number;
  is_popular: boolean;
  is_featured: boolean;
  is_active?: boolean;
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
  batch_start_date?: string | null;
  certificate_included?: boolean;
  lifetime_access?: boolean;
  created_at?: string;
  updated_at?: string;
  published_at?: string | null;
}

export interface DashboardStats {
  total_courses: number;
  total_students: number;
  total_revenue?: number;
  active_enrollments?: number;
  placement_success_rate: string;
  career_hires: string;
  total_learning_hours: number;
  avg_rating: string;
  recent_courses?: Course[];
  popular_courses?: Course[];
}

// Helper function to get instructor full name
export const getInstructorFullName = (instructor?: Course['instructor'] | null): string => {
  if (!instructor) return 'Instructor';
  
  // Check if user has full_name
  if (instructor.user?.full_name) {
    return instructor.user.full_name;
  }
  
  // Fallback to email username
  if (instructor.user?.email) {
    return instructor.user.email.split('@')[0];
  }
  
  // Last resort
  return `Instructor ${instructor.id}`;
};

// Helper function to get instructor display name (with title if needed)
export const getInstructorDisplayName = (instructor?: Course['instructor'] | null): string => {
  if (!instructor) return 'Instructor';
  
  const fullName = getInstructorFullName(instructor);
  
  // Add title if available and not already in the name
  if (instructor.title && !fullName.includes(instructor.title)) {
    return `${fullName} (${instructor.title})`;
  }
  
  return fullName;
};

// ============ POPULAR COURSES HOOK ============
export const usePopularCourses = (limit: number = 4) => {
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  const fetchPopularCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setUseMockData(false);
      
      console.log('========== START: usePopularCourses ==========');
      console.log(`Fetching from: /api/courses/courses/popular/?limit=${limit}`);
      
      const data = await apiService.getPopularCourses(limit);
      
      console.log('========== RAW API RESPONSE ==========');
      console.log('Response:', data);
      
      let coursesData: Course[] = [];
      
      // Handle different response structures
      if (Array.isArray(data)) {
        console.log('✅ Response is an array with length:', data.length);
        coursesData = data;
      } else if (data && typeof data === 'object') {
        console.log('Response is an object with keys:', Object.keys(data));
        
        if (Array.isArray(data.results)) {
          console.log('✅ Found results array with length:', data.results.length);
          coursesData = data.results;
        } else if (Array.isArray(data.data)) {
          console.log('✅ Found data array with length:', data.data.length);
          coursesData = data.data;
        } else {
          console.log('❌ No array found in response object');
          coursesData = [];
        }
      }
      
      console.log('========== PROCESSED COURSES ==========');
      console.log('Courses data length:', coursesData.length);
      
      if (coursesData.length > 0) {
        console.log('First course sample:', {
          id: coursesData[0].id,
          title: coursesData[0].title,
          slug: coursesData[0].slug,
          price: coursesData[0].price,
          rating: coursesData[0].rating,
          category: coursesData[0].category,
          instructor: coursesData[0].instructor ? {
            id: coursesData[0].instructor.id,
            full_name: coursesData[0].instructor.user?.full_name,
            email: coursesData[0].instructor.user?.email,
            title: coursesData[0].instructor.title
          } : null
        });
      }
      
      // Process courses to ensure all fields exist
      const processedCourses = coursesData.slice(0, limit).map(course => ({
        id: course.id || 0,
        slug: course.slug || '',
        title: course.title || 'Untitled Course',
        short_description: course.short_description || course.description || '',
        detailed_description: course.detailed_description || '',
        category: course.category ? {
          id: course.category.id || 0,
          name: course.category.name || 'Uncategorized',
          slug: course.category.slug || 'uncategorized',
          description: course.category.description,
          icon: course.category.icon
        } : null,
        level: course.level || 'Beginner',
        level_display: course.level_display || course.level || 'Beginner',
        price: course.price?.toString() || '0',
        original_price: course.original_price?.toString() || null,
        is_discounted: course.is_discounted || false,
        discount_percentage: course.discount_percentage || 0,
        duration: course.duration || 'N/A',
        total_hours: course.total_hours || 0,
        thumbnail: apiService.fixImageUrl(course.thumbnail),
        video_preview_url: course.video_preview_url || '',
        students_count: course.students_count || 0,
        rating: course.rating?.toString() || '4.5',
        review_count: course.review_count || 0,
        is_popular: true, // Force to true since these are from popular endpoint
        is_featured: course.is_featured || false,
        is_active: course.is_active !== undefined ? course.is_active : true,
        instructor: course.instructor ? {
          id: course.instructor.id || 0,
          user: {
            id: course.instructor.user?.id || 0,
            email: course.instructor.user?.email || '',
            full_name: course.instructor.user?.full_name || null,
            role: course.instructor.user?.role || '',
            phone_number: course.instructor.user?.phone_number || null,
            gender: course.instructor.user?.gender || '',
            avatar: course.instructor.user?.avatar || null,
            date_joined: course.instructor.user?.date_joined || ''
          },
          bio: course.instructor.bio || '',
          title: course.instructor.title || 'Instructor',
          experience_years: course.instructor.experience_years || 0,
          profile_image: course.instructor.profile_image || null,
          linkedin_url: course.instructor.linkedin_url || null,
          github_url: course.instructor.github_url || null,
          is_featured: course.instructor.is_featured || false
        } : null,
        batch_start_date: course.batch_start_date || null,
        certificate_included: course.certificate_included || false,
        lifetime_access: course.lifetime_access || false,
        created_at: course.created_at || '',
        updated_at: course.updated_at || '',
        published_at: course.published_at || null
      }));
      
      console.log('Final processed courses count:', processedCourses.length);
      console.log('========== END: usePopularCourses ==========');
      
      setPopularCourses(processedCourses);
      
    } catch (err: any) {
      console.error('========== ERROR in usePopularCourses ==========');
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      
      setError(err.message || 'Failed to fetch popular courses from API');
      console.log('Falling back to mock data');
      
      // Use mock data as fallback
      const mockProcessed = mockPopularCourses.slice(0, limit).map(course => ({
        ...course,
        thumbnail: apiService.fixImageUrl(course.thumbnail),
        price: course.price?.toString() || '0',
        rating: course.rating?.toString() || '4.5'
      })) as Course[];
      
      setPopularCourses(mockProcessed);
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchPopularCourses();
  }, [fetchPopularCourses]);

  return { 
    popularCourses, 
    isLoading, 
    error,
    useMockData,
    refetch: fetchPopularCourses 
  };
};

// ============ DASHBOARD STATS HOOK ============
export const useDashboardStats = () => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching dashboard stats from: /api/courses/dashboard/');
      
      const dashboardData = await apiService.getDashboardStats();
      console.log('Dashboard stats response:', dashboardData);
      
      setData({
        total_courses: dashboardData?.total_courses || 50,
        total_students: dashboardData?.total_students || 5000,
        total_revenue: dashboardData?.total_revenue || 10000000,
        active_enrollments: dashboardData?.active_enrollments || 1200,
        placement_success_rate: "98%",
        career_hires: "1200+",
        total_learning_hours: 500,
        avg_rating: dashboardData?.avg_rating || "4.9/5",
        recent_courses: dashboardData?.recent_courses || [],
        popular_courses: dashboardData?.popular_courses || []
      });
      
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message || 'Failed to fetch dashboard stats');
      
      // Set default stats as fallback
      setData({
        total_courses: 50,
        total_students: 5000,
        total_revenue: 10000000,
        active_enrollments: 1200,
        placement_success_rate: "98%",
        career_hires: "1200+",
        total_learning_hours: 500,
        avg_rating: "4.9/5"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { 
    data, 
    isLoading, 
    error, 
    refetch: fetchStats 
  };
};

// ============ FEATURED COURSES HOOK ============
export const useFeaturedCourses = (limit: number = 3) => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Fetching featured courses from: /api/courses/courses/featured/?limit=${limit}`);
      
      const data = await apiService.getFeaturedCourses(limit);
      
      let coursesData: Course[] = [];
      
      if (Array.isArray(data)) {
        coursesData = data;
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.results)) {
          coursesData = data.results;
        } else if (Array.isArray(data.data)) {
          coursesData = data.data;
        }
      }
      
      const processed = coursesData.slice(0, limit).map(course => ({
        ...course,
        thumbnail: apiService.fixImageUrl(course.thumbnail),
        level_display: course.level_display || course.level || 'Not Specified',
        price: course.price?.toString() || '0',
        rating: course.rating?.toString() || '4.5',
        category: course.category ? {
          id: course.category.id || 0,
          name: course.category.name || 'Uncategorized',
          slug: course.category.slug || 'uncategorized'
        } : null,
        instructor: course.instructor ? {
          ...course.instructor,
          user: {
            ...course.instructor.user,
            full_name: course.instructor.user?.full_name || null
          }
        } : null
      }));
      
      setFeaturedCourses(processed);
      console.log(`Loaded ${processed.length} featured courses`);
      
    } catch (err: any) {
      console.error('Error fetching featured courses:', err);
      setError(err.message || 'Failed to fetch featured courses');
      setFeaturedCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchFeaturedCourses();
  }, [fetchFeaturedCourses]);

  return { 
    featuredCourses, 
    isLoading, 
    error, 
    refetch: fetchFeaturedCourses 
  };
};

// ============ SINGLE COURSE HOOK ============
export const useCourse = (slug: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(async () => {
    if (!slug) {
      setError('Course slug is required');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Fetching course details for slug: ${slug}`);
      const data = await apiService.getCourseBySlug(slug);
      
      if (data) {
        const processedCourse: Course = {
          id: data.id || 0,
          slug: data.slug || '',
          title: data.title || 'Untitled Course',
          short_description: data.short_description || '',
          detailed_description: data.detailed_description || '',
          category: data.category ? {
            id: data.category.id || 0,
            name: data.category.name || 'Uncategorized',
            slug: data.category.slug || 'uncategorized',
            description: data.category.description,
            icon: data.category.icon
          } : null,
          level: data.level || 'Beginner',
          level_display: data.level_display || data.level || 'Beginner',
          price: data.price?.toString() || '0',
          original_price: data.original_price?.toString() || null,
          is_discounted: data.is_discounted || false,
          discount_percentage: data.discount_percentage || 0,
          duration: data.duration || 'N/A',
          total_hours: data.total_hours || 0,
          thumbnail: apiService.fixImageUrl(data.thumbnail),
          video_preview_url: data.video_preview_url || '',
          students_count: data.students_count || 0,
          rating: data.rating?.toString() || '0.0',
          review_count: data.review_count || 0,
          is_popular: data.is_popular || false,
          is_featured: data.is_featured || false,
          is_active: data.is_active !== undefined ? data.is_active : true,
          instructor: data.instructor ? {
            id: data.instructor.id || 0,
            user: {
              id: data.instructor.user?.id || 0,
              email: data.instructor.user?.email || '',
              full_name: data.instructor.user?.full_name || null,
              role: data.instructor.user?.role || '',
              phone_number: data.instructor.user?.phone_number || null,
              gender: data.instructor.user?.gender || '',
              avatar: data.instructor.user?.avatar || null,
              date_joined: data.instructor.user?.date_joined || ''
            },
            bio: data.instructor.bio || '',
            title: data.instructor.title || 'Instructor',
            experience_years: data.instructor.experience_years || 0,
            profile_image: data.instructor.profile_image || null,
            linkedin_url: data.instructor.linkedin_url || null,
            github_url: data.instructor.github_url || null,
            is_featured: data.instructor.is_featured || false
          } : null,
          batch_start_date: data.batch_start_date || null,
          certificate_included: data.certificate_included || false,
          lifetime_access: data.lifetime_access || false,
          created_at: data.created_at || '',
          updated_at: data.updated_at || '',
          published_at: data.published_at || null
        };
        
        setCourse(processedCourse);
        console.log('Course details loaded:', {
          title: processedCourse.title,
          instructor: processedCourse.instructor ? {
            full_name: processedCourse.instructor.user?.full_name,
            email: processedCourse.instructor.user?.email,
            title: processedCourse.instructor.title
          } : null
        });
      }
      
    } catch (err: any) {
      console.error('Error fetching course:', err);
      setError(err.message || 'Failed to fetch course details');
      setCourse(null);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchCourse();
    }
  }, [slug, fetchCourse]);

  return { 
    course, 
    isLoading, 
    error, 
    refetch: fetchCourse 
  };
};

// ============ ALL COURSES HOOK ============
export const useCourses = (params?: ApiParams) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching courses with params:', params);
      const response = await apiService.getCourses(params);
      
      let coursesData: Course[] = [];
      let count = 0;
      
      if (Array.isArray(response)) {
        coursesData = response;
        count = response.length;
      } else if (response && typeof response === 'object') {
        coursesData = response.results || response.data || [];
        count = response.count || coursesData.length;
      }
      
      const processed = coursesData.map(course => ({
        ...course,
        thumbnail: apiService.fixImageUrl(course.thumbnail),
        level_display: course.level_display || course.level || 'Not Specified',
        price: course.price?.toString() || '0',
        rating: course.rating?.toString() || '4.5',
        category: course.category ? {
          id: course.category.id || 0,
          name: course.category.name || 'Uncategorized',
          slug: course.category.slug || 'uncategorized',
          description: course.category.description,
          icon: course.category.icon
        } : null,
        instructor: course.instructor ? {
          ...course.instructor,
          user: {
            ...course.instructor.user,
            full_name: course.instructor.user?.full_name || null
          }
        } : null
      }));
      
      setCourses(processed);
      setTotalCount(count);
      console.log(`Loaded ${processed.length} courses`);
      
    } catch (err: any) {
      console.error('Error fetching courses:', err);
      setError(err.message || 'Failed to fetch courses');
      setCourses([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { 
    courses, 
    totalCount, 
    isLoading, 
    error, 
    refetch: fetchCourses 
  };
};

export type { ApiParams };
