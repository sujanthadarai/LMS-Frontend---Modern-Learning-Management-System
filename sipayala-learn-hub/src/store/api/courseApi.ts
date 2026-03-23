import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  course_count: number;
}

export interface Instructor {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  bio: string;
  title: string;
  experience_years: number;
  profile_image: string;
  linkedin_url: string;
  github_url: string;
  is_featured: boolean;
  course_count: number;
  avg_rating: number;
}

export interface CourseList {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  detailed_description?: string;
  category: Category;
  instructor: Instructor;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  level_display: string;
  price: string;
  original_price: string | null;
  is_discounted: boolean;
  discount_percentage: number;
  duration: string;
  thumbnail: string;
  video_preview_url?: string;
  students_count: number;
  rating: string;
  review_count?: number;
  is_popular: boolean;
  is_featured: boolean;
  is_active?: boolean;
  batch_start_date?: string | null;
  certificate_included?: boolean;
  lifetime_access?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CourseDetail extends CourseList {
  features: Array<{ id: number; feature: string; order: number }>;
  tools: Array<{ id: number; name: string; icon: string; order: number }>;
  modules: Array<{
    id: number;
    title: string;
    description: string;
    order: number;
    duration: number;
    topics: Array<{
      id: number;
      title: string;
      description: string;
      order: number;
      duration: number;
      video_url: string;
      resources: string[];
    }>;
  }>;
  enrolled_count: number;
  is_enrolled: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface FilterParams {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  level?: string;
  min_price?: number;
  max_price?: number;
  is_popular?: boolean;
  is_featured?: boolean;
  ordering?: string;
}

export const courseApi = createApi({
  reducerPath: 'courseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://sipalaya-lms-professional-learning.onrender.com/api/', // Your Django backend
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Course', 'Courses'],
  endpoints: (builder) => ({
    // Get all courses with pagination
    getCourses: builder.query<PaginatedResponse<CourseList>, FilterParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.page_size) queryParams.append('page_size', params.page_size.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.category) queryParams.append('category', params.category);
        if (params.level) queryParams.append('level', params.level);
        if (params.min_price) queryParams.append('min_price', params.min_price.toString());
        if (params.max_price) queryParams.append('max_price', params.max_price.toString());
        if (params.is_popular) queryParams.append('is_popular', 'true');
        if (params.is_featured) queryParams.append('is_featured', 'true');
        if (params.ordering) queryParams.append('ordering', params.ordering);
        
        const queryString = queryParams.toString();
        return {
          url: `courses/courses/${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: ['Courses'],
    }),

    // Get featured courses
    getFeaturedCourses: builder.query<CourseList[], void>({
      query: () => 'courses/featured/',
      transformResponse: (response: any) => {
        // Handle different response formats
        if (Array.isArray(response)) return response;
        if (response?.results) return response.results;
        return [];
      },
    }),

    // Get popular courses
    getPopularCourses: builder.query<CourseList[], void>({
      query: () => 'courses/popular/',
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response?.results) return response.results;
        return [];
      },
    }),

    // Get course by slug
    getCourseBySlug: builder.query<CourseDetail, string>({
      query: (slug) => `courses/${slug}/`,
      providesTags: (result, error, slug) => [{ type: 'Course', id: slug }],
    }),

    // Get all categories
    getCategories: builder.query<Category[], void>({
      query: () => 'categories/',
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response?.results) return response.results;
        return [];
      },
    }),

    // Get dashboard stats
    getDashboardStats: builder.query<any, void>({
      query: () => 'dashboard/',
    }),

    // Search courses
    searchCourses: builder.query<PaginatedResponse<CourseList>, { query: string; page?: number }>({
      query: ({ query, page = 1 }) => ({
        url: `courses/courses/`,
        params: { search: query, page },
      }),
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useLazyGetCoursesQuery,
  useGetFeaturedCoursesQuery,
  useGetPopularCoursesQuery,
  useGetCourseBySlugQuery,
  useGetCategoriesQuery,
  useGetDashboardStatsQuery,
  useSearchCoursesQuery,
  useLazySearchCoursesQuery,
} = courseApi;