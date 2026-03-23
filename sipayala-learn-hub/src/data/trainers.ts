 export interface Trainer {
   id: string;
   name: string;
   role: string;
   bio: string;
   image: string;
   expertise: string[];
   experience: string;
   coursesCount: number;
   studentsCount: number;
   rating: number;
   social: {
     linkedin?: string;
     github?: string;
     twitter?: string;
   };
 }
 
 export const trainers: Trainer[] = [
   {
     id: "1",
     name: "Rajesh Sharma",
     role: "Senior Python Developer",
     bio: "10+ years of experience in Python development and training. Former software engineer at leading tech companies. Passionate about making programming accessible to everyone.",
     image: "/placeholder.svg",
     expertise: ["Python", "Django", "Machine Learning", "Data Analysis"],
     experience: "10+ Years",
     coursesCount: 5,
     studentsCount: 3500,
     rating: 4.9,
     social: {
       linkedin: "#",
       github: "#",
       twitter: "#"
     }
   },
   {
     id: "2",
     name: "Anita Poudel",
     role: "Full Stack Developer",
     bio: "Expert in Django and React development with 8 years of industry experience. Led development teams at multiple startups. Believes in project-based learning.",
     image: "/placeholder.svg",
     expertise: ["Django", "React", "PostgreSQL", "AWS"],
     experience: "8+ Years",
     coursesCount: 4,
     studentsCount: 2800,
     rating: 4.8,
     social: {
       linkedin: "#",
       github: "#"
     }
   },
   {
     id: "3",
     name: "Bikash Thapa",
     role: "MERN Stack Specialist",
     bio: "Full-stack JavaScript expert with experience building applications for Fortune 500 companies. Community leader and tech speaker.",
     image: "/placeholder.svg",
     expertise: ["React", "Node.js", "MongoDB", "TypeScript"],
     experience: "7+ Years",
     coursesCount: 6,
     studentsCount: 4200,
     rating: 4.9,
     social: {
       linkedin: "#",
       github: "#",
       twitter: "#"
     }
   },
   {
     id: "4",
     name: "Dr. Suresh Karki",
     role: "Data Science Lead",
     bio: "PhD in Computer Science with specialization in Machine Learning. Published researcher with experience at top research labs. Making AI accessible to all.",
     image: "/placeholder.svg",
     expertise: ["Machine Learning", "Deep Learning", "NLP", "Statistics"],
     experience: "12+ Years",
     coursesCount: 3,
     studentsCount: 1800,
     rating: 4.7,
     social: {
       linkedin: "#",
       twitter: "#"
     }
   },
   {
     id: "5",
     name: "Suman Adhikari",
     role: "Frontend Developer",
     bio: "Creative frontend developer passionate about building beautiful user interfaces. Regular contributor to open-source projects.",
     image: "/placeholder.svg",
     expertise: ["HTML/CSS", "JavaScript", "React", "Tailwind CSS"],
     experience: "6+ Years",
     coursesCount: 4,
     studentsCount: 3100,
     rating: 4.8,
     social: {
       linkedin: "#",
       github: "#"
     }
   },
   {
     id: "6",
     name: "Priya Shrestha",
     role: "UI/UX Design Lead",
     bio: "Award-winning designer with experience at top design agencies. Specializes in creating user-centered designs that drive business results.",
     image: "/placeholder.svg",
     expertise: ["Figma", "User Research", "Design Systems", "Prototyping"],
     experience: "8+ Years",
     coursesCount: 2,
     studentsCount: 1500,
     rating: 4.6,
     social: {
       linkedin: "#",
       twitter: "#"
     }
   }
 ];