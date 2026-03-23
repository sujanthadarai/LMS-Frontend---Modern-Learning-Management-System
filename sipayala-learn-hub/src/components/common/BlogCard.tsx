 import { Link } from "react-router-dom";
 import { Clock, ArrowRight, User } from "lucide-react";
 import { BlogPost } from "@/data/blogPosts";
 import { Badge } from "@/components/ui/badge";
 import { motion } from "framer-motion";
 
 interface BlogCardProps {
   post: BlogPost;
   index?: number;
 }
 
 const BlogCard = ({ post, index = 0 }: BlogCardProps) => {
   const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
     year: "numeric",
     month: "long",
     day: "numeric",
   });
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       whileInView={{ opacity: 1, y: 0 }}
       viewport={{ once: true }}
       transition={{ duration: 0.5, delay: index * 0.1 }}
     >
       <Link
         to={`/blog/${post.slug}`}
         className="group block bg-card rounded-2xl overflow-hidden shadow-card border border-border hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
       >
         {/* Image */}
         <div className="relative aspect-video overflow-hidden bg-muted">
           <img
             src={post.image}
             alt={post.title}
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
           />
           <Badge className="absolute top-3 left-3 bg-primary">
             {post.category}
           </Badge>
         </div>
 
         {/* Content */}
         <div className="p-6">
           {/* Meta */}
           <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
             <span>{formattedDate}</span>
             <div className="flex items-center gap-1">
               <Clock className="w-4 h-4" />
               <span>{post.readTime}</span>
             </div>
           </div>
 
           {/* Title */}
           <h3 className="font-display font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
             {post.title}
           </h3>
 
           {/* Excerpt */}
           <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
             {post.excerpt}
           </p>
 
           {/* Author & Read More */}
           <div className="flex items-center justify-between pt-4 border-t border-border">
             <div className="flex items-center gap-2">
               <img
                 src={post.authorImage}
                 alt={post.author}
                 className="w-8 h-8 rounded-full object-cover"
               />
               <span className="text-sm font-medium text-foreground">
                 {post.author}
               </span>
             </div>
             <span className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
               Read More
               <ArrowRight className="w-4 h-4" />
             </span>
           </div>
         </div>
       </Link>
     </motion.div>
   );
 };
 
 export default BlogCard;