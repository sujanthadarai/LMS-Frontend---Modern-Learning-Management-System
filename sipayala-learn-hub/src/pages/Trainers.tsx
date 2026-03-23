 import Layout from "@/components/layout/Layout";
 import SectionHeader from "@/components/common/SectionHeader";
 import TrainerCard from "@/components/common/TrainerCard";
 import CTASection from "@/components/common/CTASection";
 import { trainers } from "@/data/trainers";
 import { motion } from "framer-motion";
 
 const Trainers = () => {
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
               Our Team
             </span>
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-card mb-6">
               Meet Our Expert Trainers
             </h1>
             <p className="text-lg text-card/80 leading-relaxed">
               Learn from industry professionals with years of real-world experience 
               and a passion for teaching.
             </p>
           </motion.div>
         </div>
       </section>
 
       {/* Trainers Grid */}
       <section className="section-padding bg-background">
         <div className="container-custom">
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
             {trainers.map((trainer, index) => (
               <TrainerCard key={trainer.id} trainer={trainer} index={index} />
             ))}
           </div>
         </div>
       </section>
 
       {/* Why Our Trainers Section */}
       <section className="section-padding bg-muted/50">
         <div className="container-custom">
           <SectionHeader
             badge="Why Learn From Us"
             title="Industry Experts Who Care"
             subtitle="Our trainers bring a unique combination of industry experience and teaching expertise."
           />
 
           <div className="grid md:grid-cols-3 gap-8">
             {[
               {
                 title: "Real Industry Experience",
                 description: "All our trainers have worked at leading tech companies and bring real-world insights to the classroom.",
               },
               {
                 title: "Passionate Teachers",
                 description: "They don't just know the subject - they love teaching it and are dedicated to student success.",
               },
               {
                 title: "Always Available",
                 description: "Our trainers provide support beyond class hours, ensuring you never feel stuck on your learning journey.",
               },
             ].map((item, index) => (
               <motion.div
                 key={item.title}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: index * 0.1 }}
                 className="text-center p-8 bg-card rounded-2xl shadow-card border border-border"
               >
                 <h3 className="text-xl font-display font-bold text-foreground mb-3">
                   {item.title}
                 </h3>
                 <p className="text-muted-foreground">{item.description}</p>
               </motion.div>
             ))}
           </div>
         </div>
       </section>
 
       <CTASection
         title="Want to Learn From the Best?"
         subtitle="Enroll in our courses and get mentored by industry experts who are committed to your success."
       />
     </Layout>
   );
 };
 
 export default Trainers;