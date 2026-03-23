// src/services/courseService.ts
import apiService from './api';

export interface Course {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  detailed_description: string;
  price: string;
  original_price: string | null;
  duration: string;
  total_hours: number;
  level: string;
  level_display?: string;
  students_count: number;
  rating: number;
  review_count: number;
  is_popular: boolean;
  is_featured: boolean;
  thumbnail: string | null;
  batch_start_date: string | null;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  instructor: {
    id: number;
    user: {
      id: number;
      full_name: string;
      email: string;
    };
    title: string;
    experience_years: number;
    profile_image: string | null;
  } | null;
  features?: Array<{ name: string }>;
}

export interface ConsultationBooking {
  full_name: string;
  email: string;
  phone: string;
  education?: string;
  experience?: string;
  preferred_mode?: 'zoom' | 'phone' | 'inperson';
  message?: string;
  course_id?: number;
  course_title?: string;
}

export interface CounselorContact {
  full_name: string;
  email: string;
  phone: string;
  contact_method?: 'chat' | 'call' | 'video' | 'email';
  preferred_time?: string;
  message?: string;
}

class CourseService {
  // Get featured/popular courses for hero section
  async getHeroCourses(limit: number = 4): Promise<Course[]> {
    try {
      // Try to get featured courses first
      const featured = await apiService.getFeaturedCourses(limit);
      if (featured && featured.length > 0) {
        return featured;
      }
      
      // Fallback to popular courses
      const popular = await apiService.getPopularCourses(limit);
      if (popular && popular.length > 0) {
        return popular;
      }
      
      // Final fallback to regular courses with featured filter
      const courses = await apiService.getCourses({ 
        featured: true,
        page_size: limit 
      });
      
      return courses.results || [];
    } catch (error) {
      console.error('Error fetching hero courses:', error);
      return [];
    }
  }

  // Get dashboard stats
  async getHeroStats() {
    try {
      const stats = await apiService.getDashboardStats();
      return {
        total_students: stats.total_students || 5000,
        total_courses: stats.total_courses || 28,
        placement_rate: stats.placement_success_rate || '94.7',
        salary_hike: '45', // You might want to add this to your backend
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return null;
    }
  }

  // Submit consultation booking (no auth required)
  async submitConsultation(data: ConsultationBooking): Promise<any> {
    // You'll need to create this endpoint in your backend
    return apiService.fetchApi('/api/bookings/consultation/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Submit counselor contact (no auth required)
  async submitCounselorContact(data: CounselorContact): Promise<any> {
    // You'll need to create this endpoint in your backend
    return apiService.fetchApi('/api/contact/counselor/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const courseService = new CourseService();