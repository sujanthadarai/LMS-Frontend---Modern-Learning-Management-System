import React, { useRef, memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, Target, Award, Users, Clock, CheckCircle, 
  Sparkles, Zap, Globe, Shield, Briefcase, TrendingUp 
} from "lucide-react";
import { motion, useInView } from "framer-motion";

// Simplified animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const features = [
    {
      icon: Target,
      title: "Industry-Centric Curriculum",
      description: "Co-designed with 50+ industry partners including Google, Microsoft, and AWS.",
      stat: "50+ Partners",
      color: "blue"
    },
    {
      icon: Briefcase,
      title: "Real-World Project Experience",
      description: "Hands-on experience with enterprise-grade projects from actual industry scenarios.",
      stat: "100+ Projects",
      color: "purple"
    },
    {
      icon: TrendingUp,
      title: "Career Acceleration Program",
      description: "Comprehensive career support with 1:1 mentorship and interview prep.",
      stat: "95% Success",
      color: "green"
    },
    {
      icon: Globe,
      title: "Global Certification",
      description: "Recognized certifications from AWS, Google Cloud, Microsoft, and IBM.",
      stat: "Global Reach",
      color: "orange"
    }
  ];

  const stats = [
    { icon: Users, value: "5000+", label: "Alumni Network" },
    { icon: Award, value: "98%", label: "Satisfaction" },
    { icon: Clock, value: "10+", label: "Years Excellence" },
    { icon: CheckCircle, value: "1200+", label: "Placements" }
  ];

  // Responsive grid configurations
  const getStatsGrid = () => {
    if (windowWidth < 640) return "grid-cols-2"; // Mobile: 2x2
    if (windowWidth < 1024) return "grid-cols-4"; // Tablet: 4x1
    return "grid-cols-4"; // Desktop: 4x1
  };

  const getFeaturesGrid = () => {
    if (windowWidth < 768) return "grid-cols-1"; // Mobile: 1 column
    return "grid-cols-2"; // Tablet/Desktop: 2 columns
  };

  return (
    <section 
      ref={sectionRef}
      className="py-12 sm:py-16 lg:py-24 bg-white overflow-hidden"
    >
      {/* Prevent horizontal overflow */}
      <div className="w-full overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <motion.div 
              variants={fadeInUp} 
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 rounded-full mb-3 sm:mb-4"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
              <span className="text-[10px] sm:text-xs font-semibold text-blue-600 whitespace-nowrap">
                ABOUT SIPAYALA INFO TECH
              </span>
            </motion.div>

            <motion.h2 
              variants={fadeInUp} 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2"
            >
              Shaping the Future of{' '}
              <span className="text-blue-600 block sm:inline">Tech Education</span>
            </motion.h2>

            <motion.p 
              variants={fadeInUp} 
              className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4"
            >
              Pioneering IT education since 2014, we bridge the gap between academic theory 
              and industry practice through innovative, hands-on learning experiences.
            </motion.p>
          </motion.div>

          {/* Stats Grid - Responsive */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className={`grid ${getStatsGrid()} gap-3 sm:gap-4 mb-10 sm:mb-12`}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center border border-gray-100"
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-600 mx-auto mb-2 sm:mb-3" />
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm text-gray-600">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Features Grid - Responsive */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className={`grid ${getFeaturesGrid()} gap-4 sm:gap-5 lg:gap-6 mb-10 sm:mb-12`}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colors = {
                blue: "bg-blue-50 text-blue-600 border-blue-200",
                purple: "bg-purple-50 text-purple-600 border-purple-200",
                green: "bg-green-50 text-green-600 border-green-200",
                orange: "bg-orange-50 text-orange-600 border-orange-200"
              };
              const colorClass = colors[feature.color as keyof typeof colors];

              return (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <div className={`p-2 sm:p-2.5 lg:p-3 rounded-lg ${colorClass} flex-shrink-0`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5 sm:mb-2">
                        <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 pr-2">
                          {feature.title}
                        </h3>
                        <span className={`text-[9px] sm:text-[10px] lg:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full ${colorClass} whitespace-nowrap self-start sm:self-auto`}>
                          {feature.stat}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 px-2">
              Ready to Start Your Journey?
            </h3>
            <p className="text-sm sm:text-base text-white/90 mb-5 sm:mb-6 max-w-2xl mx-auto px-4">
              Join 5,000+ professionals who transformed their careers with our industry-recognized programs.
            </p>
            <Link to="/courses" className="inline-block w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base lg:text-lg font-semibold shadow-lg">
                Explore Programs
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Floating decorative elements - hidden on mobile to prevent overflow */}
      <div className="hidden lg:block">
        <div className="absolute left-0 top-1/3 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute right-0 bottom-1/3 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl -z-10"></div>
      </div>
    </section>
  );
};

export default memo(AboutSection);