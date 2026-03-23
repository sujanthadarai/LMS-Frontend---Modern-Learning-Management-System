 import Layout from "@/components/layout/Layout";
 import SectionHeader from "@/components/common/SectionHeader";
 import CTASection from "@/components/common/CTASection";
 import { Button } from "@/components/ui/button";
 import { Link } from "react-router-dom";
 import { ArrowRight, Target, Eye, Heart, Users, Award, BookOpen, TrendingUp } from "lucide-react";
 import { motion } from "framer-motion";
 
 const stats = [
   { value: "10+", label: "Years Experience", icon: Award },
   { value: "5000+", label: "Students Trained", icon: Users },
   { value: "95%", label: "Placement Rate", icon: TrendingUp },
   { value: "20+", label: "Expert Trainers", icon: BookOpen },
 ];
 
 const values = [
   {
     icon: Target,
     title: "Our Mission",
     description: "To provide world-class IT education that bridges the gap between academic knowledge and industry requirements, empowering individuals to build successful tech careers.",
   },
   {
     icon: Eye,
     title: "Our Vision",
     description: "To become the leading IT training institute in Nepal, recognized for producing skilled professionals who drive innovation and digital transformation.",
   },
   {
     icon: Heart,
     title: "Our Values",
     description: "Excellence, integrity, innovation, and student success are at the core of everything we do. We believe in practical learning and continuous improvement.",
   },
 ];
 
 const About = () => {
   return (
     <Layout>
       {/* Hero Section */}
       <section className="pt-32 pb-16 hero-gradient relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
         <div className="container-custom relative z-10">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="text-center max-w-3xl mx-auto"
           >
             <span className="inline-block px-4 py-1.5 bg-card/10 backdrop-blur-sm text-card text-sm font-semibold rounded-full mb-4 border border-card/20">
               About Us
             </span>
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-card mb-6">
               Shaping the Future of IT Education
             </h1>
             <p className="text-lg text-card/80 leading-relaxed">
               Since 2014, Sipayala Info Tech has been at the forefront of IT training, 
               helping thousands of students transform their careers and achieve their dreams.
             </p>
           </motion.div>
         </div>
       </section>
 
       {/* Stats Section */}
       <section className="py-16 bg-card relative -mt-8 z-20">
         <div className="container-custom">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
             {stats.map((stat, index) => (
               <motion.div
                 key={stat.label}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: index * 0.1 }}
                 className="text-center p-6 rounded-2xl bg-muted/50 border border-border"
               >
                 <stat.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                 <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</p>
                 <p className="text-muted-foreground">{stat.label}</p>
               </motion.div>
             ))}
           </div>
         </div>
       </section>
 
       {/* Story Section */}
       <section className="section-padding bg-background">
         <div className="container-custom">
           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
             <motion.div
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
             >
               <SectionHeader
                 badge="Our Story"
                 title="From Humble Beginnings to Industry Leader"
                 align="left"
               />
               <div className="space-y-4 text-muted-foreground leading-relaxed">
                 <p>
                   Sipayala Info Tech was founded in 2014 with a simple yet ambitious goal: 
                   to provide quality IT education that truly prepares students for the industry.
                 </p>
                 <p>
                   What started as a small training center has grown into one of Nepal's most 
                   trusted IT institutes. Our success is measured not by our growth, but by 
                   the thousands of careers we've helped launch.
                 </p>
                 <p>
                   Today, we offer comprehensive training in programming, web development, 
                   data science, and more. Our alumni work at leading companies both in Nepal 
                   and internationally.
                 </p>
               </div>
               <Link to="/courses" className="inline-block mt-8">
                 <Button size="lg" className="font-semibold shadow-primary group">
                   Explore Our Courses
                   <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                 </Button>
               </Link>
             </motion.div>
 
             <motion.div
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className="relative"
             >
               <div className="aspect-square rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                 <div className="text-center text-card p-8">
                   <p className="text-6xl font-bold mb-2">2014</p>
                   <p className="text-xl">Established</p>
                 </div>
               </div>
             </motion.div>
           </div>
         </div>
       </section>
 
       {/* Mission, Vision, Values */}
       <section className="section-padding bg-muted/50">
         <div className="container-custom">
           <SectionHeader
             badge="Our Foundation"
             title="Mission, Vision & Values"
             subtitle="The principles that guide everything we do at Sipayala Info Tech."
           />
 
           <div className="grid md:grid-cols-3 gap-8">
             {values.map((item, index) => (
               <motion.div
                 key={item.title}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: index * 0.1 }}
                 className="bg-card rounded-2xl p-8 shadow-card border border-border text-center"
               >
                 <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                   <item.icon className="w-8 h-8 text-primary" />
                 </div>
                 <h3 className="text-xl font-display font-bold text-foreground mb-4">
                   {item.title}
                 </h3>
                 <p className="text-muted-foreground leading-relaxed">
                   {item.description}
                 </p>
               </motion.div>
             ))}
           </div>
         </div>
       </section>
 
       <CTASection />
     </Layout>
   );
 };
 
 export default About;