 import Layout from "@/components/layout/Layout";
 import HeroSection from "@/components/home/HeroSection";
 import AboutSection from "@/components/home/AboutSection";
 import PopularCourses from "@/components/home/PopularCourses";
 import WhyChooseUs from "@/components/home/WhyChooseUs";
 import TestimonialsSection from "@/components/home/TestimonialsSection";
 import PartnersSection from "@/components/home/PartnersSection";
 import CTASection from "@/components/common/CTASection";
 
 const Index = () => {
   return (
     <Layout>
       <HeroSection />
       <AboutSection />
       <PopularCourses />
       <WhyChooseUs />
       <TestimonialsSection />
       <PartnersSection />
       <CTASection />
     </Layout>
   );
 };
 
 export default Index;
