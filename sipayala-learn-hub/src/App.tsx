 import { Toaster } from "@/components/ui/toaster";
 import { Toaster as Sonner } from "@/components/ui/sonner";
 import { TooltipProvider } from "@/components/ui/tooltip";
 import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 import { BrowserRouter, Routes, Route } from "react-router-dom";
 import Index from "./pages/Index";
 import About from "./pages/About";
 import Courses from "./pages/Courses";
 import CourseDetail from "./pages/CourseDetail";
 import Trainers from "./pages/Trainers";
 import Testimonials from "./pages/Testimonials";
 import Blog from "./pages/Blog";
 import Contact from "./pages/Contact";
 import Login from "./pages/Login";
 import Register from "./pages/Register";
 import NotFound from "./pages/NotFound";
 import Events from "./pages/Events";
 import TeamPage from "./pages/Team";
 
 const queryClient = new QueryClient();
 
 const App = () => (
   <QueryClientProvider client={queryClient}>
     <TooltipProvider>
       <Toaster />
       <Sonner />
       <BrowserRouter>
         <Routes>
           <Route path="/" element={<Index />} />
           <Route path="/events" element={<Events />} />
           <Route path="/about" element={<About />} />
           <Route path="/courses" element={<Courses />} />
           <Route path="/courses/:slug" element={<CourseDetail />} />
           <Route path="/trainers" element={<Trainers />} />
           <Route path="/testimonials" element={<Testimonials />} />
           <Route path="/blog" element={<Blog />} />
           <Route path="/contact" element={<Contact />} />
           <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />
           <Route path="/team" element={<TeamPage />} />
           <Route path="*" element={<NotFound />} />
         </Routes>
       </BrowserRouter>
     </TooltipProvider>
   </QueryClientProvider>
 );
 
 export default App;
