// src/services/eventsApi.ts - COMPLETE FIXED VERSION
const API_BASE_URL = 'https://sipalaya-lms-professional-learning.onrender.com/';

interface ApiParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  event_type?: string;
  status?: string;
  featured?: boolean;
  popular?: boolean;
  price_type?: string;
  start_date_gte?: string;
  start_date_lte?: string;
  location?: string;
}

interface EventType {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description?: string;
  event_count: number;
  created_at: string;
  updated_at: string;
}

interface EventSpeaker {
  id: number;
  full_name: string;
  title: string;
  bio?: string;
  experience?: string;
  company?: string;
  avatar_url?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Event {
  id: number;
  slug: string;
  title: string;
  description: string;
  short_description: string;
  event_type: EventType;
  speaker?: EventSpeaker;
  start_date: string;
  end_date: string;
  duration: string;
  formatted_time: string;
  location: string;
  venue?: string;
  online_link?: string;
  is_online: boolean;
  is_hybrid: boolean;
  total_seats: number;
  available_seats: number;
  registered_count: number;
  registration_percentage: number;
  price_type: 'free' | 'paid';
  price: string;
  current_price: string;
  early_bird_price?: string;
  early_bird_deadline?: string;
  is_early_bird_available: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  is_featured: boolean;
  is_popular: boolean;
  thumbnail?: string;
  cover_image?: string;
  thumbnail_url?: string;
  cover_image_url?: string;
  prerequisites?: string;
  learning_outcomes?: string;
  what_to_bring?: string;
  tags?: string;
  tags_list: string[];
  resources?: EventResource[];
  is_registered?: boolean;
  created_at: string;
  updated_at: string;
}

interface EventResource {
  id: number;
  title: string;
  description?: string;
  resource_type: string;
  file_url?: string;
  url?: string;
  is_public: boolean;
  download_count: number;
  created_at: string;
}

interface EventRegistration {
  id: number;
  event: Event;
  user: number;
  registration_date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'attended';
  check_in_time?: string;
  feedback?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

class EventsApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log(`Events API Call: ${url}`);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error(`Events API call failed for ${url}:`, error);
      throw error;
    }
  }

  // Event Types
  async getEventTypes(): Promise<EventType[]> {
    try {
      const data = await this.fetchApi<EventType[]>('/api/events/event-types/');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching event types:', error);
      return [];
    }
  }

  // Events - Main method with image debugging
  async getEvents(params?: ApiParams): Promise<Event[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params?.search) queryParams.append('search', params.search || '');
      if (params?.ordering) queryParams.append('ordering', params.ordering || 'start_date');
      if (params?.event_type) queryParams.append('event_type', params.event_type);
      if (params?.status) queryParams.append('status', params.status || 'upcoming');
      if (params?.featured) queryParams.append('featured', 'true');
      if (params?.popular) queryParams.append('popular', 'true');
      if (params?.price_type) queryParams.append('price_type', params.price_type);
      if (params?.start_date_gte) queryParams.append('start_date_gte', params.start_date_gte);
      if (params?.start_date_lte) queryParams.append('start_date_lte', params.start_date_lte);
      if (params?.location) queryParams.append('location', params.location);

      const queryString = queryParams.toString();
      const endpoint = `/api/events/events/${queryString ? `?${queryString}` : ''}`;
      
      console.log('Fetching events from:', endpoint);
      
      const response = await this.fetchApi<any>(endpoint);
      
      // Handle different response formats
      let events: Event[] = [];
      
      if (Array.isArray(response)) {
        console.log('Response is array, length:', response.length);
        events = response;
      } else if (response && typeof response === 'object') {
        if (Array.isArray(response.results)) {
          console.log('Response has results array, length:', response.results.length);
          events = response.results;
        } else if (Array.isArray(response.data)) {
          console.log('Response has data array, length:', response.data.length);
          events = response.data;
        } else if (Array.isArray(response.events)) {
          console.log('Response has events array, length:', response.events.length);
          events = response.events;
        }
      }
      
      // Process image URLs for all events with debugging
      events = events.map(event => {
        const processed = this.processEventImages(event);
        
        // DEBUG: Log the image URLs
        console.log(`=== DEBUG: Event "${processed.title}" ===`);
        console.log('Before processing:', {
          thumbnail: event.thumbnail,
          thumbnail_url: event.thumbnail_url,
          cover_image: event.cover_image,
          cover_image_url: event.cover_image_url
        });
        
        console.log('After processing:', {
          thumbnail: processed.thumbnail,
          thumbnail_url: processed.thumbnail_url,
          cover_image: processed.cover_image,
          cover_image_url: processed.cover_image_url
        });
        
        // Get the final image URL
        const imageInfo = this.getEventImage(processed);
        console.log('Final image URL from getEventImage:', imageInfo.url);
        
        return processed;
      });
      
      console.log('Processed events:', events.length);
      return events;
      
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  // Process event images to ensure proper URLs
  private processEventImages(event: Event): Event {
    const processedEvent = { ...event };
    
    // Log image data for debugging
    console.log(`Processing images for event: ${event.title}`, {
      thumbnail: event.thumbnail,
      thumbnail_url: event.thumbnail_url,
      cover_image: event.cover_image,
      cover_image_url: event.cover_image_url
    });
    
    // Ensure we have thumbnail_url field (use thumbnail if thumbnail_url doesn't exist)
    if (!processedEvent.thumbnail_url && processedEvent.thumbnail) {
      processedEvent.thumbnail_url = processedEvent.thumbnail;
    }
    
    // Ensure we have cover_image_url field (use cover_image if cover_image_url doesn't exist)
    if (!processedEvent.cover_image_url && processedEvent.cover_image) {
      processedEvent.cover_image_url = processedEvent.cover_image;
    }
    
    return processedEvent;
  }

  // FIXED: Helper to fix image URLs
  fixImageUrl(imageUrl?: string | null): string {
    console.log('=== fixImageUrl START ===');
    console.log('Input:', imageUrl);
    
    // If no image URL, return placeholder
    if (!imageUrl || imageUrl.trim() === '' || imageUrl === 'null' || imageUrl === 'undefined') {
      console.log('No valid image URL, returning placeholder');
      return this.getPlaceholderImage();
    }
    
    const cleanUrl = imageUrl.trim();
    console.log('Cleaned URL:', cleanUrl);
    
    // Already a full URL
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      console.log('Already full URL, returning as-is');
      return cleanUrl;
    }
    
    // Django media URLs starting with /media/
    if (cleanUrl.startsWith('/media/')) {
      const fullUrl = `${this.baseUrl}${cleanUrl}`;
      console.log('Media URL detected, constructed:', fullUrl);
      console.log('=== fixImageUrl END ===');
      return fullUrl;
    }
    
    // Relative paths without leading slash but containing events/
    if (cleanUrl.includes('events/')) {
      const fullUrl = `${this.baseUrl}/media/${cleanUrl}`;
      console.log('Events path detected, constructed:', fullUrl);
      console.log('=== fixImageUrl END ===');
      return fullUrl;
    }
    
    // Just a filename with image extension
    if (cleanUrl.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i)) {
      const isThumbnail = cleanUrl.toLowerCase().includes('thumbnail') || cleanUrl.toLowerCase().includes('thumb');
      const folder = isThumbnail ? 'events/thumbnails/' : 'events/covers/';
      const fullUrl = `${this.baseUrl}/media/${folder}${cleanUrl}`;
      console.log('Filename detected, constructed:', fullUrl);
      console.log('=== fixImageUrl END ===');
      return fullUrl;
    }
    
    // If we can't determine, try as a direct media path
    console.warn('Could not determine image URL format, trying as media path');
    const fallbackUrl = `${this.baseUrl}/media/${cleanUrl}`;
    console.log('Fallback URL:', fallbackUrl);
    console.log('=== fixImageUrl END ===');
    return fallbackUrl;
  }

  // Get best available image for event
  getEventImage(event: Event): { url: string; alt: string; type: 'thumbnail' | 'cover' | 'placeholder' } {
    console.log('=== getEventImage START ===');
    console.log('Event title:', event.title);
    
    // Try different field combinations
    const imageFields = [
      { field: event.cover_image_url || event.cover_image, type: 'cover' as const },
      { field: event.thumbnail_url || event.thumbnail, type: 'thumbnail' as const }
    ];
    
    for (const img of imageFields) {
      console.log(`Checking ${img.type}:`, img.field);
      if (img.field) {
        const fixedUrl = this.fixImageUrl(img.field);
        
        // Check if it's a placeholder (for debugging)
        const isPlaceholder = fixedUrl.includes('placeholder.com');
        
        console.log(`Event ${event.title}: Found ${img.type} image:`, {
          original: img.field,
          fixed: fixedUrl,
          isPlaceholder
        });
        
        console.log('=== getEventImage END ===');
        return {
          url: fixedUrl,
          alt: `${event.title} - ${img.type}`,
          type: img.type
        };
      }
    }
    
    // Fallback to placeholder
    console.log(`Event ${event.title}: No image found, using placeholder`);
    console.log('=== getEventImage END ===');
    return {
      url: this.getPlaceholderImage(),
      alt: `${event.title} - Event Image`,
      type: 'placeholder'
    };
  }

  // Helper for placeholder images
  getPlaceholderImage(): string {
    const placeholderColors = [
      'FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7',
      'DDA0DD', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E9'
    ];
    const randomColor = placeholderColors[Math.floor(Math.random() * placeholderColors.length)];
    
    return `https://via.placeholder.com/800x450/${randomColor}/FFFFFF?text=Event+Image`;
  }

  // Get single event by slug
  async getEventBySlug(slug: string): Promise<Event | null> {
    try {
      const endpoint = `/api/events/events/${slug}/`;
      const event = await this.fetchApi<Event>(endpoint);
      
      // Process images for single event
      return this.processEventImages(event);
      
    } catch (error) {
      console.error(`Error fetching event ${slug}:`, error);
      return null;
    }
  }

  // Calendar Events with fallback
  async getCalendarEvents(fromDate?: string, toDate?: string): Promise<Record<string, any[]>> {
    try {
      // First try the calendar endpoint
      const queryParams = new URLSearchParams();
      if (fromDate) queryParams.append('from_date', fromDate);
      if (toDate) queryParams.append('to_date', toDate);
      
      const queryString = queryParams.toString();
      const endpoint = `/api/events/events/calendar/${queryString ? `?${queryString}` : ''}`;
      
      console.log('Trying calendar endpoint:', endpoint);
      
      try {
        const data = await this.fetchApi<Record<string, any[]>>(endpoint);
        
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          console.log('Calendar endpoint returned data for', Object.keys(data).length, 'dates');
          return data;
        }
      } catch (calendarError) {
        console.log('Calendar endpoint failed, will generate from events');
      }
      
      // If calendar endpoint fails, generate from events
      console.log('Generating calendar data from events...');
      const events = await this.getEvents({ status: 'upcoming', page_size: 100 });
      
      return this.generateCalendarFromEvents(events);
      
    } catch (error) {
      console.error('Error in getCalendarEvents:', error);
      return {};
    }
  }

  // Helper to generate calendar data from events
  private generateCalendarFromEvents(events: Event[]): Record<string, any[]> {
    const calendarData: Record<string, any[]> = {};
    
    events.forEach(event => {
      if (event.start_date) {
        try {
          const dateKey = event.start_date.split('T')[0];
          if (!calendarData[dateKey]) {
            calendarData[dateKey] = [];
          }
          
          calendarData[dateKey].push({
            id: event.id,
            title: event.title,
            color: event.event_type?.color || '#3b82f6',
            type: event.event_type?.name || 'Event',
            time: event.formatted_time,
            slug: event.slug
          });
        } catch (dateError) {
          console.error('Error processing event date:', event);
        }
      }
    });
    
    console.log('Generated calendar data for', Object.keys(calendarData).length, 'dates');
    return calendarData;
  }

  // Event Registration
  async registerForEvent(slug: string): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        return {
          success: false,
          message: 'Please login to register for events'
        };
      }

      const endpoint = `/api/events/events/${slug}/register/`;
      const response = await this.fetchApi<any>(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return {
        success: true,
        message: 'Successfully registered for the event!',
        data: response
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.message || 'Registration failed. Please try again.'
      };
    }
  }

  // NEW: Test if image is accessible
  async testImageUrl(url: string): Promise<{ accessible: boolean; status?: number }> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return {
        accessible: response.ok,
        status: response.status
      };
    } catch (error) {
      console.error('Error testing image URL:', error);
      return { accessible: false };
    }
  }
}

export const eventsApiService = new EventsApiService();
export default EventsApiService;