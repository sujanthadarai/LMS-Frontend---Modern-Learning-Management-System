// Mock data for when backend is not available
export const mockPopularCourses = [
  {
    id: 1,
    slug: "react-masterclass",
    title: "React & Next.js Masterclass",
    short_description: "Become a React expert with modern Next.js framework",
    category: { 
      id: 1,
      name: "Web Development",
      slug: "web-dev",
      description: "Web development courses",
      icon: "code",
      course_count: 10
    },
    instructor: {
      id: 1,
      user: { 
        id: 1,
        first_name: "John", 
        last_name: "Doe",
        email: "john@example.com"
      },
      bio: "Senior instructor with 10+ years experience",
      title: "Senior Instructor",
      experience_years: 10,
      profile_image: "/instructor-1.jpg",
      linkedin_url: "",
      github_url: "",
      is_featured: true,
      course_count: 5,
      avg_rating: 4.9
    },
    level: "Intermediate",
    level_display: "Intermediate",
    price: "15000",
    original_price: "20000",
    is_discounted: true,
    discount_percentage: 25,
    duration: "8 weeks",
    thumbnail: "/course-thumbnail.jpg",
    video_preview_url: "https://example.com/video.mp4",
    students_count: 250,
    rating: "4.9",
    review_count: 45,
    is_popular: true,
    is_featured: true,
    is_active: true,
    batch_start_date: "2024-03-01",
    certificate_included: true,
    lifetime_access: true,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  },
  // Add more mock courses as needed
];