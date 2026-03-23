// src/services/api.ts
const API_BASE_URL = 'http://127.0.0.1:8000';

interface ApiParams {
  search?: string;
  category?: string;
  level?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  popular?: boolean;
  featured?: boolean;
  limit?: number;
  // Testimonial specific params
  rating?: number;
  category_slug?: string;
  is_featured?: boolean;
  status?: string;
  testimonial?: number;
  has_video?: boolean;
}

// Booking related interfaces
interface ConsultationBooking {
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

interface CounselorContact {
  full_name: string;
  email: string;
  phone: string;
  contact_method?: 'chat' | 'call' | 'video' | 'email';
  preferred_time?: string;
  message?: string;
}

// Auth related interfaces
interface AuthTokens {
  access: string;
  refresh: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  full_name: string;
  password: string;
  phone_number?: string;
  gender?: string;
}

interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  phone_number?: string;
  gender?: string;
  avatar?: string;
  date_joined: string;
}

class ApiService {
  private baseUrl: string;
  private tokens: AuthTokens | null = null;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.loadTokensFromStorage();
  }

  // ============ AUTHENTICATION ============

  private loadTokensFromStorage() {
    try {
      const storedTokens = localStorage.getItem('auth_tokens');
      if (storedTokens) {
        this.tokens = JSON.parse(storedTokens);
      }
    } catch {
      this.tokens = null;
    }
  }

  private saveTokensToStorage(tokens: AuthTokens) {
    this.tokens = tokens;
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
  }

  clearTokens() {
    this.tokens = null;
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('auth_user');
  }

  setTokens(access: string, refresh: string) {
    this.saveTokensToStorage({ access, refresh });
  }

  getAccessToken(): string | null {
    return this.tokens?.access || null;
  }

  isAuthenticated(): boolean {
    return !!this.tokens?.access;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  private async refreshToken(): Promise<boolean> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        if (!this.tokens?.refresh) {
          return false;
        }

        const response = await fetch(`${this.baseUrl}/api/accounts/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: this.tokens.refresh }),
        });

        if (!response.ok) {
          this.clearTokens();
          return false;
        }

        const data = await response.json();
        this.tokens.access = data.access;
        localStorage.setItem('auth_tokens', JSON.stringify(this.tokens));
        return true;
      } catch {
        this.clearTokens();
        return false;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async fetchApi<T>(
    endpoint: string, 
    options: RequestInit = {},
    requiresAuth: boolean = false
  ): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    // Add auth token if required and available
    if (requiresAuth || (this.tokens?.access && endpoint.includes('/api/accounts/'))) {
      if (this.tokens?.access) {
        // Check if token is expired and try to refresh
        if (this.isTokenExpired(this.tokens.access)) {
          const refreshed = await this.refreshToken();
          if (!refreshed) {
            throw new Error('Authentication failed');
          }
        }
        headers['Authorization'] = `Bearer ${this.tokens.access}`;
      } else {
        throw new Error('Authentication required');
      }
    }

    console.log(`API Call: ${url}`);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized - try to refresh token once
      if (response.status === 401 && this.tokens?.refresh && !options.headers?.['X-Retry']) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the request with new token
          return this.fetchApi(endpoint, {
            ...options,
            headers: {
              ...options.headers,
              'X-Retry': 'true', // Prevent infinite retry loop
            },
          }, requiresAuth);
        }
      }

      console.log(`Response Status: ${response.status} ${response.statusText}`);

      // Handle empty responses
      if (response.status === 204) {
        return {} as T;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.warn('Response is not JSON:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (!response.ok) {
        // Format error message from Django REST framework
        const errorMessage = this.formatErrorMessage(data);
        throw new Error(errorMessage);
      }

      console.log('API Response:', data);
      return data;

    } catch (error) {
      console.error(`API call failed for ${url}:`, error);
      throw error;
    }
  }

  private formatErrorMessage(data: any): string {
    if (typeof data === 'string') return data;
    if (data.detail) return data.detail;
    if (data.email) return Array.isArray(data.email) ? data.email[0] : data.email;
    if (data.password) return Array.isArray(data.password) ? data.password[0] : data.password;
    if (data.full_name) return Array.isArray(data.full_name) ? data.full_name[0] : data.full_name;
    if (data.non_field_errors) return data.non_field_errors[0];
    
    // Extract first error from any field
    for (const key in data) {
      if (Array.isArray(data[key]) && data[key].length > 0) {
        return `${key}: ${data[key][0]}`;
      }
    }
    
    return 'An error occurred';
  }

  // ============ AUTH ENDPOINTS ============

  async login(credentials: LoginCredentials): Promise<{ access: string; refresh: string }> {
    const data = await this.fetchApi<{ access: string; refresh: string }>(
      '/api/accounts/login/',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );
    
    this.saveTokensToStorage(data);
    return data;
  }

  async register(userData: RegisterData): Promise<User> {
    return this.fetchApi<User>('/api/accounts/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.fetchApi<User>('/api/accounts/users/me/', {}, true);
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const user = await this.getCurrentUser();
    return this.fetchApi<User>(`/api/accounts/users/${user.id}/`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    }, true);
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return this.fetchApi('/api/accounts/users/change_password/', {
      method: 'POST',
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    }, true);
  }

  async requestPasswordReset(email: string): Promise<void> {
    return this.fetchApi('/api/accounts/users/reset_password/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async confirmPasswordReset(uid: string, token: string, newPassword: string): Promise<void> {
    return this.fetchApi('/api/accounts/users/reset_password_confirm/', {
      method: 'POST',
      body: JSON.stringify({
        uid,
        token,
        new_password: newPassword,
      }),
    });
  }

  // ============ COURSE ENDPOINTS ============
  
  async getCourses(params?: ApiParams) {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.level) queryParams.append('level', params.level);
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.popular) queryParams.append('popular', 'true');
    if (params?.featured) queryParams.append('featured', 'true');

    const queryString = queryParams.toString();
    const endpoint = `/api/courses/courses/${queryString ? `?${queryString}` : ''}`;
    
    console.log('Fetching courses from:', endpoint);
    return this.fetchApi<any>(endpoint);
  }

  async getCourseBySlug(slug: string) {
    const endpoint = `/api/courses/courses/${slug}/`;
    return this.fetchApi<any>(endpoint);
  }

  async getPopularCourses(limit: number = 8) {
    console.log(`Fetching popular courses with limit: ${limit}`);
    const endpoint = `/api/courses/courses/popular/?limit=${limit}`;
    return this.fetchApi<any>(endpoint);
  }

  async getFeaturedCourses(limit: number = 8) {
    console.log(`Fetching featured courses with limit: ${limit}`);
    const endpoint = `/api/courses/courses/featured/?limit=${limit}`;
    return this.fetchApi<any>(endpoint);
  }

  async getCourseLevels() {
    console.log('Fetching course levels...');
    const endpoint = '/api/courses/courses/levels/';
    return this.fetchApi<any>(endpoint);
  }

  async getCourseReviews(courseSlug: string, params?: { page?: number, page_size?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `/api/courses/courses/${courseSlug}/reviews/${queryString ? `?${queryString}` : ''}`;
    return this.fetchApi<any>(endpoint);
  }

  async addCourseReview(courseSlug: string, reviewData: { rating: number; title: string; comment: string }) {
    console.log(`Adding review for course: ${courseSlug}`);
    return this.fetchApi<any>(`/api/courses/courses/${courseSlug}/add_review/`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }, true);
  }

  async getCourseSyllabus(courseSlug: string) {
    console.log(`Fetching syllabus for course: ${courseSlug}`);
    return this.fetchApi<any>(`/api/courses/courses/${courseSlug}/syllabus/`);
  }

  async enrollInCourse(courseSlug: string) {
    console.log(`Enrolling in course: ${courseSlug}`);
    return this.fetchApi<any>(`/api/courses/courses/${courseSlug}/enroll/`, {
      method: 'POST',
    }, true);
  }

  // ============ BOOKING & CONSULTATION ENDPOINTS ============
  
  /**
   * Submit a consultation booking (no auth required)
   */
  async submitConsultation(bookingData: ConsultationBooking) {
    console.log('Submitting consultation booking...');
    // Try different possible endpoints
    const endpoints = [
      '/api/courses/consultations/',
      '/api/courses/bookings/consultation/',
      '/api/bookings/consultation/'
    ];
    
    let lastError: any = null;
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const response = await this.fetchApi<any>(endpoint, {
          method: 'POST',
          body: JSON.stringify(bookingData),
        }, false); // No auth required
        console.log(`Success with endpoint: ${endpoint}`);
        return response;
      } catch (error) {
        console.log(`Endpoint ${endpoint} failed:`, error);
        lastError = error;
        // Continue to next endpoint
      }
    }
    
    // If all endpoints fail, throw the last error
    throw lastError || new Error('Failed to submit consultation booking');
  }

  /**
   * Submit counselor contact form (no auth required)
   */
  async submitCounselorContact(contactData: CounselorContact) {
    console.log('Submitting counselor contact...');
    // Try different possible endpoints
    const endpoints = [
      '/api/courses/counselor-contacts/',
      '/api/courses/contact/counselor/',
      '/api/contact/counselor/'
    ];
    
    let lastError: any = null;
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const response = await this.fetchApi<any>(endpoint, {
          method: 'POST',
          body: JSON.stringify(contactData),
        }, false); // No auth required
        console.log(`Success with endpoint: ${endpoint}`);
        return response;
      } catch (error) {
        console.log(`Endpoint ${endpoint} failed:`, error);
        lastError = error;
        // Continue to next endpoint
      }
    }
    
    // If all endpoints fail, throw the last error
    throw lastError || new Error('Failed to submit counselor contact');
  }

  // ============ CATEGORY ENDPOINTS ============
  
  async getCategories() {
    console.log('Fetching categories...');
    return this.fetchApi<any>('/api/courses/categories/');
  }

  async getCategoryBySlug(slug: string) {
    return this.fetchApi<any>(`/api/courses/categories/${slug}/`);
  }

  async getCategoryCourses(slug: string, params?: ApiParams) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `/api/courses/categories/${slug}/courses/${queryString ? `?${queryString}` : ''}`;
    return this.fetchApi<any>(endpoint);
  }

  // ============ INSTRUCTOR ENDPOINTS ============
  
  async getInstructors() {
    console.log('Fetching instructors...');
    return this.fetchApi<any>('/api/courses/instructors/');
  }

  async getInstructorById(id: number) {
    return this.fetchApi<any>(`/api/courses/instructors/${id}/`);
  }

  async getInstructorCourses(instructorId: number, params?: ApiParams) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `/api/courses/instructors/${instructorId}/courses/${queryString ? `?${queryString}` : ''}`;
    return this.fetchApi<any>(endpoint);
  }

  // ============ ENROLLMENT ENDPOINTS ============
  
  async getMyEnrollments() {
    console.log('Fetching user enrollments...');
    return this.fetchApi<any>('/api/courses/enrollments/my_courses/', {}, true);
  }

  async getEnrollment(id: number) {
    return this.fetchApi<any>(`/api/courses/enrollments/${id}/`, {}, true);
  }

  async updateEnrollmentProgress(id: number, progress: number) {
    return this.fetchApi<any>(`/api/courses/enrollments/${id}/update_progress/`, {
      method: 'PATCH',
      body: JSON.stringify({ progress_percentage: progress }),
    }, true);
  }

  // ============ DASHBOARD ENDPOINTS ============
  
  async getDashboardStats() {
    console.log('Fetching dashboard stats from courses app...');
    try {
      const endpoint = '/api/courses/dashboard/';
      return await this.fetchApi<any>(endpoint, {}, true);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default stats instead of throwing
      return {
        total_students: 5000,
        total_courses: 50,
        total_instructors: 25,
        placement_rate: 94.7,
        average_rating: 4.8,
      };
    }
  }

  // ============ TESTIMONIAL ENDPOINTS ============
  
  /**
   * Get all testimonials with optional filtering
   */
  async getTestimonials(params?: ApiParams) {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.rating) queryParams.append('rating', params.rating.toString());
    if (params?.category_slug) queryParams.append('course_category__slug', params.category_slug);
    if (params?.is_featured !== undefined) queryParams.append('is_featured', params.is_featured.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.ordering) queryParams.append('ordering', params.ordering);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.has_video) queryParams.append('has_video', params.has_video.toString());

    const queryString = queryParams.toString();
    const endpoint = `/api/core/testimonials/${queryString ? `?${queryString}` : ''}`;
    
    console.log('Fetching testimonials from:', endpoint);
    return this.fetchApi<any>(endpoint);
  }

  /**
   * Get a single testimonial by ID
   */
  async getTestimonialById(id: number) {
    const endpoint = `/api/core/testimonials/${id}/`;
    return this.fetchApi<any>(endpoint);
  }

  /**
   * Get featured testimonials
   */
  async getFeaturedTestimonials(limit: number = 6) {
    console.log(`Fetching featured testimonials with limit: ${limit}`);
    const endpoint = `/api/core/testimonials/featured/?limit=${limit}`;
    return this.fetchApi<any>(endpoint);
  }

  /**
   * Get recent testimonials
   */
  async getRecentTestimonials(limit: number = 9) {
    console.log(`Fetching recent testimonials with limit: ${limit}`);
    const endpoint = `/api/core/testimonials/recent/?limit=${limit}`;
    return this.fetchApi<any>(endpoint);
  }

  /**
   * Get testimonials by rating
   */
  async getTestimonialsByRating(rating: number, limit?: number) {
    const queryParams = new URLSearchParams();
    queryParams.append('rating', rating.toString());
    if (limit) queryParams.append('limit', limit.toString());
    
    const endpoint = `/api/core/testimonials/by_rating/?${queryParams.toString()}`;
    return this.fetchApi<any>(endpoint);
  }

  /**
   * Get video testimonials - testimonials that have video_url
   */
  async getVideoTestimonials(limit: number = 9) {
    console.log(`Fetching video testimonials with limit: ${limit}`);
    
    try {
      // Try dedicated endpoint first (if your backend has it)
      const endpoint = `/api/core/testimonials/?has_video=true&limit=${limit}`;
      return await this.fetchApi<any>(endpoint);
    } catch (error) {
      console.log('Using fallback: fetching and filtering testimonials with videos');
      
      // Fallback: get featured testimonials
      const featuredTestimonials = await this.getFeaturedTestimonials(limit * 2);
      
      // Filter to only those with video_url
      const videoTestimonials = featuredTestimonials.filter((t: any) => t.video_url);
      
      // If we don't have enough featured ones with videos, get recent ones
      if (videoTestimonials.length < limit) {
        const recentTestimonials = await this.getRecentTestimonials(limit * 2);
        
        const moreVideoTestimonials = recentTestimonials.filter(
          (t: any) => t.video_url && !videoTestimonials.some((v: any) => v.id === t.id)
        );
        
        videoTestimonials.push(...moreVideoTestimonials);
      }
      
      // Limit and return
      return videoTestimonials.slice(0, limit);
    }
  }

  /**
   * Get testimonial statistics
   */
  async getTestimonialStats() {
    console.log('Fetching testimonial statistics...');
    const endpoint = '/api/core/testimonials/stats/';
    return this.fetchApi<any>(endpoint);
  }

  /**
   * Submit a new testimonial (public)
   */
  async submitTestimonial(testimonialData: {
    student_name: string;
    student_email: string;
    student_role: string;
    student_company?: string;
    student_location?: string;
    rating: number;
    title: string;
    content: string;
    course_name: string;
    course_category?: number;
    completion_year?: number;
    before_outcome?: string;
    after_outcome?: string;
    salary_hike?: string;
    linkedin_url?: string;
    github_url?: string;
    portfolio_url?: string;
    video_url?: string;
  }) {
    console.log('Submitting testimonial...');
    return this.fetchApi<any>('/api/core/testimonials/', {
      method: 'POST',
      body: JSON.stringify(testimonialData),
    });
  }

  // ============ TESTIMONIAL CATEGORY ENDPOINTS ============
  
  /**
   * Get all testimonial categories
   */
  async getTestimonialCategories(params?: { search?: string; is_active?: boolean }) {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());

    const queryString = queryParams.toString();
    const endpoint = `/api/core/testimonial-categories/${queryString ? `?${queryString}` : ''}`;
    
    console.log('Fetching testimonial categories from:', endpoint);
    return this.fetchApi<any>(endpoint);
  }

  /**
   * Get a single testimonial category by slug
   */
  async getTestimonialCategoryBySlug(slug: string) {
    const endpoint = `/api/core/testimonial-categories/${slug}/`;
    return this.fetchApi<any>(endpoint);
  }

  /**
   * Get testimonials by category slug
   */
  async getTestimonialsByCategory(slug: string, params?: ApiParams) {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.rating) queryParams.append('rating', params.rating.toString());
    if (params?.ordering) queryParams.append('ordering', params.ordering);

    const queryString = queryParams.toString();
    const endpoint = `/api/core/testimonial-categories/${slug}/testimonials/${queryString ? `?${queryString}` : ''}`;
    return this.fetchApi<any>(endpoint);
  }

  // ============ TESTIMONIAL HIGHLIGHT ENDPOINTS ============
  
  /**
   * Get highlights for a specific testimonial
   */
  async getTestimonialHighlights(testimonialId: number) {
    const endpoint = `/api/core/testimonial-highlights/?testimonial=${testimonialId}`;
    return this.fetchApi<any>(endpoint);
  }

  /**
   * Get all highlights (admin only)
   */
  async getAllHighlights(params?: { testimonial?: number; ordering?: string }) {
    const queryParams = new URLSearchParams();
    
    if (params?.testimonial) queryParams.append('testimonial', params.testimonial.toString());
    if (params?.ordering) queryParams.append('ordering', params.ordering);

    const queryString = queryParams.toString();
    const endpoint = `/api/core/testimonial-highlights/${queryString ? `?${queryString}` : ''}`;
    return this.fetchApi<any>(endpoint, {}, true); // Requires auth
  }

  // ============ ADMIN/STAFF TESTIMONIAL ACTIONS ============
  
  /**
   * Approve a testimonial (admin only)
   */
  async approveTestimonial(id: number) {
    console.log(`Approving testimonial: ${id}`);
    return this.fetchApi<any>(`/api/core/testimonials/${id}/approve/`, {
      method: 'POST',
    }, true);
  }

  /**
   * Feature a testimonial (admin only)
   */
  async featureTestimonial(id: number) {
    console.log(`Featuring testimonial: ${id}`);
    return this.fetchApi<any>(`/api/core/testimonials/${id}/feature/`, {
      method: 'POST',
    }, true);
  }

  /**
   * Verify a testimonial (admin only)
   */
  async verifyTestimonial(id: number) {
    console.log(`Verifying testimonial: ${id}`);
    return this.fetchApi<any>(`/api/core/testimonials/${id}/verify/`, {
      method: 'POST',
    }, true);
  }

  /**
   * Update testimonial (admin only)
   */
  async updateTestimonial(id: number, data: any) {
    console.log(`Updating testimonial: ${id}`);
    return this.fetchApi<any>(`/api/core/testimonials/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, true);
  }

  /**
   * Delete testimonial (admin only)
   */
  async deleteTestimonial(id: number) {
    console.log(`Deleting testimonial: ${id}`);
    return this.fetchApi<any>(`/api/core/testimonials/${id}/`, {
      method: 'DELETE',
    }, true);
  }

  // ============ HELPER METHODS ============
  
  fixImageUrl(imageUrl?: string | null): string {
    if (!imageUrl) {
      return 'https://via.placeholder.com/400x225?text=Course+Image';
    }
    
    const cleanUrl = imageUrl.replace(/([^:])\/\//g, '$1/');
    
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }
    
    if (cleanUrl.startsWith('/')) {
      return `${this.baseUrl}${cleanUrl}`;
    }
    
    return `${this.baseUrl}/media/${cleanUrl}`;
  }

  /**
   * Format testimonial data for display
   */
  formatTestimonialForDisplay(testimonial: any) {
    return {
      ...testimonial,
      student_avatar: testimonial.student_avatar ? this.fixImageUrl(testimonial.student_avatar) : null,
      video_thumbnail: testimonial.video_thumbnail ? this.fixImageUrl(testimonial.video_thumbnail) : null,
      formatted_date: testimonial.published_at 
        ? new Date(testimonial.published_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : null,
      rating_stars: Array.from({ length: 5 }, (_, i) => i + 1 <= testimonial.rating),
    };
  }

  // Utility method to check if user has specific role
  async hasRole(role: 'ADMIN' | 'TEACHER' | 'STUDENT'): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user.role === role;
    } catch {
      return false;
    }
  }

  /**
   * Check if current user can manage testimonials (admin only)
   */
  async canManageTestimonials(): Promise<boolean> {
    return this.hasRole('ADMIN');
  }
}

export const apiService = new ApiService();
export default apiService;