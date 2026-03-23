 import Layout from "@/components/layout/Layout";
 import BlogCard from "@/components/common/BlogCard";
 import { blogPosts } from "@/data/blogPosts";
 import { motion } from "framer-motion";
 
 const Blog = () => {
   return (
     <Layout>
       <section className="pt-32 pb-16 hero-gradient">
         <div className="container-custom text-center max-w-3xl mx-auto">
           <h1 className="text-4xl md:text-5xl font-display font-bold text-card mb-4">Blog & Resources</h1>
           <p className="text-lg text-card/80">Tips, tutorials, and insights to help you grow your tech skills.</p>
         </div>
       </section>
       <section className="section-padding bg-background">
         <div className="container-custom">
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {blogPosts.map((post, index) => <BlogCard key={post.id} post={post} index={index} />)}
           </div>
         </div>
       </section>
     </Layout>
   );
 };
 
 export default Blog;