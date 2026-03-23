 import { motion } from "framer-motion";
 
 interface SectionHeaderProps {
   badge?: string;
   title: string;
   subtitle?: string;
   align?: "left" | "center";
 }
 
 const SectionHeader = ({
   badge,
   title,
   subtitle,
   align = "center",
 }: SectionHeaderProps) => {
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       whileInView={{ opacity: 1, y: 0 }}
       viewport={{ once: true }}
       transition={{ duration: 0.5 }}
       className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : "text-left"}`}
     >
       {badge && (
         <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
           {badge}
         </span>
       )}
       <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
         {title}
       </h2>
       {subtitle && (
         <p
           className={`text-lg text-muted-foreground max-w-2xl ${
             align === "center" ? "mx-auto" : ""
           }`}
         >
           {subtitle}
         </p>
       )}
     </motion.div>
   );
 };
 
 export default SectionHeader;