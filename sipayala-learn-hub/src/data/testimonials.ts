 export interface Testimonial {
   id: string;
   name: string;
   role: string;
   company: string;
   image: string;
   content: string;
   course: string;
   rating: number;
 }
 
 export const testimonials: Testimonial[] = [
   {
     id: "1",
     name: "Arun Maharjan",
     role: "Software Developer",
     company: "Tech Solutions Nepal",
     image: "/placeholder.svg",
     content: "The Python course at Sipayala Info Tech completely transformed my career. The hands-on projects and supportive instructors helped me land my dream job within 2 months of completing the course.",
     course: "Python Programming",
     rating: 5
   },
   {
     id: "2",
     name: "Sarita Tamang",
     role: "Full Stack Developer",
     company: "Digital Ventures",
     image: "/placeholder.svg",
     content: "I joined the MERN Stack course as a complete beginner. Today, I'm working as a full-stack developer. The curriculum is industry-relevant and the mentors are incredibly supportive.",
     course: "MERN Stack Development",
     rating: 5
   },
   {
     id: "3",
     name: "Ramesh Khadka",
     role: "Data Analyst",
     company: "Analytics Pro",
     image: "/placeholder.svg",
     content: "The Data Science course provided excellent practical knowledge. The real-world projects and Kaggle competitions prepared me well for my current role as a data analyst.",
     course: "Data Science & Analytics",
     rating: 5
   },
   {
     id: "4",
     name: "Nisha Gurung",
     role: "Django Developer",
     company: "WebCraft Nepal",
     image: "/placeholder.svg",
     content: "Excellent teaching methodology and real project experience. The Django course helped me understand backend development deeply. Highly recommend Sipayala Info Tech!",
     course: "Django Web Development",
     rating: 5
   },
   {
     id: "5",
     name: "Prakash Bhatta",
     role: "UI/UX Designer",
     company: "Design Studio KTM",
     image: "/placeholder.svg",
     content: "The UI/UX course was comprehensive and practical. I learned not just tools but also the thinking process behind great design. My portfolio improved dramatically.",
     course: "UI/UX Design Masterclass",
     rating: 4
   },
   {
     id: "6",
     name: "Deepa Rai",
     role: "Frontend Developer",
     company: "StartUp Hub",
     image: "/placeholder.svg",
     content: "Started with zero coding experience and now I'm building websites professionally. The web development fundamentals course gave me a strong foundation to grow.",
     course: "Web Development Fundamentals",
     rating: 5
   }
 ];