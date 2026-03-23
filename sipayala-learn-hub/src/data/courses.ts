 export interface Course {
   id: string;
   slug: string;
   title: string;
   shortDescription: string;
   description: string;
   duration: string;
   level: "Beginner" | "Intermediate" | "Advanced";
   price: number;
   originalPrice?: number;
   image: string;
   category: string;
   rating: number;
   studentsCount: number;
   instructor: string;
   instructorImage: string;
   features: string[];
   syllabus: {
     title: string;
     topics: string[];
   }[];
   tools: string[];
   isFeatured?: boolean;
   isPopular?: boolean;
 }
 
 export const courses: Course[] = [
   {
     id: "1",
     slug: "python",
     title: "Python Programming",
     shortDescription: "Master Python from basics to advanced concepts with hands-on projects.",
     description: "Comprehensive Python course covering fundamentals to advanced programming concepts. Learn to build real-world applications, automate tasks, and prepare for data science or web development careers.",
     duration: "3 Months",
     level: "Beginner",
     price: 25000,
     originalPrice: 35000,
     image: "/placeholder.svg",
     category: "Programming",
     rating: 4.9,
     studentsCount: 1250,
     instructor: "Rajesh Sharma",
     instructorImage: "/placeholder.svg",
     features: [
       "Live interactive classes",
       "Real-world projects",
       "Industry-recognized certificate",
       "Job placement assistance",
       "Lifetime access to materials"
     ],
     syllabus: [
       {
         title: "Python Fundamentals",
         topics: ["Variables & Data Types", "Operators & Expressions", "Control Flow", "Functions & Modules"]
       },
       {
         title: "Object-Oriented Programming",
         topics: ["Classes & Objects", "Inheritance", "Polymorphism", "Encapsulation"]
       },
       {
         title: "Advanced Python",
         topics: ["Decorators", "Generators", "Context Managers", "Multithreading"]
       },
       {
         title: "Project Work",
         topics: ["Web Scraping Project", "Automation Scripts", "API Development", "Final Capstone Project"]
       }
     ],
     tools: ["Python 3.x", "VS Code", "Git", "PyCharm"],
     isFeatured: true,
     isPopular: true
   },
   {
     id: "2",
     slug: "django",
     title: "Django Web Development",
     shortDescription: "Build powerful web applications with Python's most popular framework.",
     description: "Learn to build scalable, secure web applications using Django. From MVT architecture to REST APIs, this course covers everything you need to become a professional Django developer.",
     duration: "4 Months",
     level: "Intermediate",
     price: 35000,
     originalPrice: 45000,
     image: "/placeholder.svg",
     category: "Web Development",
     rating: 4.8,
     studentsCount: 890,
     instructor: "Anita Poudel",
     instructorImage: "/placeholder.svg",
     features: [
       "Project-based learning",
       "REST API development",
       "Database management",
       "Deployment training",
       "Code review sessions"
     ],
     syllabus: [
       {
         title: "Django Basics",
         topics: ["MVT Architecture", "URL Routing", "Templates", "Static Files"]
       },
       {
         title: "Models & Database",
         topics: ["ORM Basics", "Migrations", "QuerySets", "Database Optimization"]
       },
       {
         title: "Django REST Framework",
         topics: ["Serializers", "ViewSets", "Authentication", "API Documentation"]
       },
       {
         title: "Deployment & Production",
         topics: ["Security Best Practices", "Docker", "AWS Deployment", "CI/CD Pipeline"]
       }
     ],
     tools: ["Django", "PostgreSQL", "Docker", "AWS", "Git"],
     isFeatured: true,
     isPopular: true
   },
   {
     id: "3",
     slug: "mern",
     title: "MERN Stack Development",
     shortDescription: "Become a full-stack developer with MongoDB, Express, React, and Node.js.",
     description: "Complete MERN stack bootcamp that transforms you into a full-stack JavaScript developer. Build modern web applications from frontend to backend with industry best practices.",
     duration: "5 Months",
     level: "Intermediate",
     price: 45000,
     originalPrice: 60000,
     image: "/placeholder.svg",
     category: "Full Stack",
     rating: 4.9,
     studentsCount: 1100,
     instructor: "Bikash Thapa",
     instructorImage: "/placeholder.svg",
     features: [
       "Full-stack project portfolio",
       "Industry mentorship",
       "Mock interviews",
       "GitHub profile building",
       "Startup ecosystem exposure"
     ],
     syllabus: [
       {
         title: "Frontend with React",
         topics: ["React Fundamentals", "Hooks & State Management", "React Router", "Redux Toolkit"]
       },
       {
         title: "Backend with Node.js",
         topics: ["Express.js", "RESTful APIs", "Middleware", "Error Handling"]
       },
       {
         title: "Database with MongoDB",
         topics: ["MongoDB Basics", "Mongoose ODM", "Aggregation", "Indexing"]
       },
       {
         title: "Full Stack Integration",
         topics: ["Authentication", "File Uploads", "Real-time Features", "Deployment"]
       }
     ],
     tools: ["React", "Node.js", "Express", "MongoDB", "Redux", "Git"],
     isFeatured: true,
     isPopular: true
   },
   {
     id: "4",
     slug: "data-science",
     title: "Data Science & Analytics",
     shortDescription: "Master data analysis, visualization, and machine learning fundamentals.",
     description: "Comprehensive data science program covering statistical analysis, data visualization, machine learning, and real-world applications. Perfect for aspiring data analysts and scientists.",
     duration: "6 Months",
     level: "Intermediate",
     price: 55000,
     originalPrice: 75000,
     image: "/placeholder.svg",
     category: "Data Science",
     rating: 4.7,
     studentsCount: 650,
     instructor: "Dr. Suresh Karki",
     instructorImage: "/placeholder.svg",
     features: [
       "Real datasets from industry",
       "Kaggle competitions",
       "Research paper discussions",
       "Industry guest lectures",
       "Portfolio projects"
     ],
     syllabus: [
       {
         title: "Python for Data Science",
         topics: ["NumPy", "Pandas", "Data Cleaning", "Exploratory Analysis"]
       },
       {
         title: "Data Visualization",
         topics: ["Matplotlib", "Seaborn", "Plotly", "Dashboard Creation"]
       },
       {
         title: "Machine Learning",
         topics: ["Supervised Learning", "Unsupervised Learning", "Model Evaluation", "Feature Engineering"]
       },
       {
         title: "Advanced Topics",
         topics: ["Deep Learning Basics", "NLP Introduction", "Time Series Analysis", "Capstone Project"]
       }
     ],
     tools: ["Python", "Jupyter", "Scikit-learn", "TensorFlow", "Tableau"],
     isFeatured: true
   },
   {
     id: "5",
     slug: "web-dev",
     title: "Web Development Fundamentals",
     shortDescription: "Start your web development journey with HTML, CSS, and JavaScript.",
     description: "Perfect starting point for beginners. Learn the core technologies of the web and build responsive, interactive websites from scratch.",
     duration: "2 Months",
     level: "Beginner",
     price: 15000,
     originalPrice: 20000,
     image: "/placeholder.svg",
     category: "Web Development",
     rating: 4.8,
     studentsCount: 2100,
     instructor: "Suman Adhikari",
     instructorImage: "/placeholder.svg",
     features: [
       "No prior experience needed",
       "Portfolio website project",
       "Responsive design focus",
       "Modern CSS techniques",
       "JavaScript interactivity"
     ],
     syllabus: [
       {
         title: "HTML Fundamentals",
         topics: ["HTML Structure", "Semantic Elements", "Forms", "Accessibility"]
       },
       {
         title: "CSS Styling",
         topics: ["Selectors & Properties", "Flexbox", "CSS Grid", "Animations"]
       },
       {
         title: "JavaScript Basics",
         topics: ["Variables & Functions", "DOM Manipulation", "Events", "Async JavaScript"]
       },
       {
         title: "Project Development",
         topics: ["Responsive Design", "Portfolio Website", "Landing Pages", "Code Optimization"]
       }
     ],
     tools: ["VS Code", "Chrome DevTools", "GitHub Pages", "Figma"],
     isPopular: true
   },
   {
     id: "6",
     slug: "ui-ux",
     title: "UI/UX Design Masterclass",
     shortDescription: "Create beautiful, user-centered designs using modern design tools.",
     description: "Learn the principles of user interface and user experience design. Master Figma, conduct user research, and create designs that users love.",
     duration: "3 Months",
     level: "Beginner",
     price: 30000,
     originalPrice: 40000,
     image: "/placeholder.svg",
     category: "Design",
     rating: 4.6,
     studentsCount: 480,
     instructor: "Priya Shrestha",
     instructorImage: "/placeholder.svg",
     features: [
       "Industry-standard tools",
       "UX research methods",
       "Design system creation",
       "Portfolio development",
       "Client project simulation"
     ],
     syllabus: [
       {
         title: "Design Fundamentals",
         topics: ["Design Principles", "Color Theory", "Typography", "Layout Design"]
       },
       {
         title: "UI Design with Figma",
         topics: ["Figma Basics", "Components", "Auto Layout", "Prototyping"]
       },
       {
         title: "UX Research",
         topics: ["User Interviews", "Personas", "User Journeys", "Usability Testing"]
       },
       {
         title: "Portfolio Project",
         topics: ["Case Study Writing", "Design Presentation", "Portfolio Website", "Interview Prep"]
       }
     ],
     tools: ["Figma", "Adobe XD", "Notion", "Miro"]
   }
 ];
 
 export const categories = [
   "All",
   "Programming",
   "Web Development",
   "Full Stack",
   "Data Science",
   "Design"
 ];