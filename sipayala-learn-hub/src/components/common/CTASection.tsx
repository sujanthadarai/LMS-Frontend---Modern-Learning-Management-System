 import { Link } from "react-router-dom";
 import { Button } from "@/components/ui/button";
 import { ArrowRight, Phone } from "lucide-react";
 import { motion } from "framer-motion";
 
 interface CTASectionProps {
   title?: string;
   subtitle?: string;
   primaryText?: string;
   primaryLink?: string;
   secondaryText?: string;
   secondaryLink?: string;
 }
 
 const CTASection = ({
   title = "Ready to Start Your Tech Career?",
   subtitle = "Join thousands of students who have transformed their careers with our industry-focused training programs.",
   primaryText = "Enroll Now",
   primaryLink = "/courses",
   secondaryText = "Contact Us",
   secondaryLink = "/contact",
 }: CTASectionProps) => {
   return (
     <section className="relative py-20 md:py-28 overflow-hidden">
       {/* Background */}
       <div className="absolute inset-0 hero-gradient" />
       <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
       
       {/* Decorative Elements */}
       <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
       <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
 
       <div className="container-custom relative z-10">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="text-center max-w-3xl mx-auto"
         >
           <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-card mb-6">
             {title}
           </h2>
           <p className="text-lg text-card/80 mb-10">
             {subtitle}
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link to={primaryLink}>
               <Button size="lg" variant="secondary" className="w-full sm:w-auto font-semibold shadow-lg hover:shadow-xl group">
                 {primaryText}
                 <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
               </Button>
             </Link>
             <Link to={secondaryLink}>
               <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold border-card/30 text-card hover:bg-card/10">
                 <Phone className="w-5 h-5 mr-2" />
                 {secondaryText}
               </Button>
             </Link>
           </div>
         </motion.div>
       </div>
     </section>
   );
 };
 
 export default CTASection;