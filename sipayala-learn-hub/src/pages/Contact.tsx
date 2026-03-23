 import { useState } from "react";
 import Layout from "@/components/layout/Layout";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Textarea } from "@/components/ui/textarea";
 import { MapPin, Phone, Mail, Clock } from "lucide-react";
 import { motion } from "framer-motion";
 import { useToast } from "@/hooks/use-toast";
 
 const Contact = () => {
   const { toast } = useToast();
   const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     toast({ title: "Message Sent!", description: "We'll get back to you soon." });
     setFormData({ name: "", email: "", phone: "", message: "" });
   };
 
   return (
     <Layout>
       <section className="pt-32 pb-16 hero-gradient">
         <div className="container-custom text-center max-w-3xl mx-auto">
           <h1 className="text-4xl md:text-5xl font-display font-bold text-card mb-4">Contact Us</h1>
           <p className="text-lg text-card/80">Have questions? We'd love to hear from you.</p>
         </div>
       </section>
 
       <section className="section-padding bg-background">
         <div className="container-custom">
           <div className="grid lg:grid-cols-2 gap-12">
             <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
               <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
               <form onSubmit={handleSubmit} className="space-y-4">
                 <Input placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                 <Input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                 <Input placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                 <Textarea placeholder="Your Message" rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
                 <Button type="submit" size="lg" className="w-full shadow-primary">Send Message</Button>
               </form>
             </motion.div>
 
             <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
               <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
               {[
                 { icon: MapPin, title: "Address", text: "New Baneshwor, Kathmandu, Nepal" },
                 { icon: Phone, title: "Phone", text: "+977 1-4567890" },
                 { icon: Mail, title: "Email", text: "info@sipayalainfotech.com" },
                 { icon: Clock, title: "Hours", text: "Sun-Fri: 7AM - 6PM" },
               ].map((item) => (
                 <div key={item.title} className="flex gap-4 p-4 bg-muted/50 rounded-xl">
                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><item.icon className="w-6 h-6 text-primary" /></div>
                   <div><p className="font-semibold">{item.title}</p><p className="text-muted-foreground">{item.text}</p></div>
                 </div>
               ))}
               <div className="aspect-video rounded-xl bg-muted overflow-hidden mt-6">
                 <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.5!2d85.34!3d27.69!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQxJzI0LjAiTiA4NcKwMjAnMjQuMCJF!5e0!3m2!1sen!2snp!4v1234567890" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
               </div>
             </motion.div>
           </div>
         </div>
       </section>
     </Layout>
   );
 };
 
 export default Contact;