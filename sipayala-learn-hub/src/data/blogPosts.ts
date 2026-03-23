 export interface BlogPost {
   id: string;
   slug: string;
   title: string;
   excerpt: string;
   content: string;
   image: string;
   author: string;
   authorImage: string;
   date: string;
   category: string;
   readTime: string;
   tags: string[];
 }
 
 export const blogPosts: BlogPost[] = [
   {
     id: "1",
     slug: "why-learn-python-2024",
     title: "Why Python is Still the Best Language to Learn in 2024",
     excerpt: "Python continues to dominate as the most beginner-friendly and versatile programming language. Here's why you should learn it.",
     content: "Full article content here...",
     image: "/placeholder.svg",
     author: "Rajesh Sharma",
     authorImage: "/placeholder.svg",
     date: "2024-01-15",
     category: "Programming",
     readTime: "5 min read",
     tags: ["Python", "Programming", "Career"]
   },
   {
     id: "2",
     slug: "mern-vs-django",
     title: "MERN Stack vs Django: Which Should You Choose?",
     excerpt: "A comprehensive comparison of two popular web development stacks to help you make the right choice for your career.",
     content: "Full article content here...",
     image: "/placeholder.svg",
     author: "Bikash Thapa",
     authorImage: "/placeholder.svg",
     date: "2024-01-10",
     category: "Web Development",
     readTime: "8 min read",
     tags: ["MERN", "Django", "Web Development"]
   },
   {
     id: "3",
     slug: "getting-started-data-science",
     title: "Getting Started with Data Science: A Beginner's Roadmap",
     excerpt: "Step-by-step guide to starting your data science journey, from prerequisites to landing your first job.",
     content: "Full article content here...",
     image: "/placeholder.svg",
     author: "Dr. Suresh Karki",
     authorImage: "/placeholder.svg",
     date: "2024-01-05",
     category: "Data Science",
     readTime: "10 min read",
     tags: ["Data Science", "Machine Learning", "Career"]
   },
   {
     id: "4",
     slug: "react-hooks-guide",
     title: "Mastering React Hooks: Complete Guide for 2024",
     excerpt: "Everything you need to know about React Hooks, from useState to custom hooks, with practical examples.",
     content: "Full article content here...",
     image: "/placeholder.svg",
     author: "Suman Adhikari",
     authorImage: "/placeholder.svg",
     date: "2024-01-02",
     category: "Web Development",
     readTime: "12 min read",
     tags: ["React", "JavaScript", "Frontend"]
   },
   {
     id: "5",
     slug: "ui-design-trends-2024",
     title: "UI Design Trends to Watch in 2024",
     excerpt: "Explore the latest design trends that are shaping modern user interfaces and how to implement them.",
     content: "Full article content here...",
     image: "/placeholder.svg",
     author: "Priya Shrestha",
     authorImage: "/placeholder.svg",
     date: "2023-12-28",
     category: "Design",
     readTime: "6 min read",
     tags: ["UI Design", "Trends", "Figma"]
   },
   {
     id: "6",
     slug: "tech-jobs-nepal",
     title: "High-Demand Tech Jobs in Nepal 2024",
     excerpt: "Discover the most sought-after tech skills and roles in Nepal's growing IT industry.",
     content: "Full article content here...",
     image: "/placeholder.svg",
     author: "Anita Poudel",
     authorImage: "/placeholder.svg",
     date: "2023-12-20",
     category: "Career",
     readTime: "7 min read",
     tags: ["Career", "Jobs", "Nepal IT"]
   }
 ];
 
 export const blogCategories = [
   "All",
   "Programming",
   "Web Development",
   "Data Science",
   "Design",
   "Career"
 ];