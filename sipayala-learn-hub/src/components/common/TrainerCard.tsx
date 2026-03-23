 import { Linkedin, Github, Twitter, Users, BookOpen, Star } from "lucide-react";
 import { Trainer } from "@/data/trainers";
 import { Badge } from "@/components/ui/badge";
 import { motion } from "framer-motion";
 
 interface TrainerCardProps {
   trainer: Trainer;
   index?: number;
 }
 
 const TrainerCard = ({ trainer, index = 0 }: TrainerCardProps) => {
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       whileInView={{ opacity: 1, y: 0 }}
       viewport={{ once: true }}
       transition={{ duration: 0.5, delay: index * 0.1 }}
       className="group bg-card rounded-2xl overflow-hidden shadow-card border border-border hover:shadow-xl transition-all duration-300"
     >
       {/* Image */}
       <div className="relative aspect-square overflow-hidden bg-muted">
         <img
           src={trainer.image}
           alt={trainer.name}
           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
         
         {/* Social Links */}
         <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
           {trainer.social.linkedin && (
             <a
               href={trainer.social.linkedin}
               className="w-10 h-10 rounded-full bg-card/90 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
             >
               <Linkedin className="w-5 h-5" />
             </a>
           )}
           {trainer.social.github && (
             <a
               href={trainer.social.github}
               className="w-10 h-10 rounded-full bg-card/90 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
             >
               <Github className="w-5 h-5" />
             </a>
           )}
           {trainer.social.twitter && (
             <a
               href={trainer.social.twitter}
               className="w-10 h-10 rounded-full bg-card/90 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
             >
               <Twitter className="w-5 h-5" />
             </a>
           )}
         </div>
       </div>
 
       {/* Content */}
       <div className="p-6">
         <h3 className="font-display font-bold text-lg text-foreground mb-1">
           {trainer.name}
         </h3>
         <p className="text-primary font-medium text-sm mb-3">{trainer.role}</p>
         <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
           {trainer.bio}
         </p>
 
         {/* Expertise */}
         <div className="flex flex-wrap gap-2 mb-4">
           {trainer.expertise.slice(0, 3).map((skill) => (
             <Badge key={skill} variant="secondary" className="text-xs">
               {skill}
             </Badge>
           ))}
         </div>
 
         {/* Stats */}
         <div className="flex items-center justify-between pt-4 border-t border-border text-sm text-muted-foreground">
           <div className="flex items-center gap-1">
             <BookOpen className="w-4 h-4" />
             <span>{trainer.coursesCount} Courses</span>
           </div>
           <div className="flex items-center gap-1">
             <Users className="w-4 h-4" />
             <span>{trainer.studentsCount.toLocaleString()}</span>
           </div>
           <div className="flex items-center gap-1 text-warning">
             <Star className="w-4 h-4 fill-current" />
             <span className="font-medium">{trainer.rating}</span>
           </div>
         </div>
       </div>
     </motion.div>
   );
 };
 
 export default TrainerCard;