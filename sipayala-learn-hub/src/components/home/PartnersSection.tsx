import { motion } from "framer-motion";
import { Building2, Globe, Target, Trophy, Zap, Star, Sparkles, TrendingUp, Award, Heart, Users, TargetIcon } from "lucide-react";

const partners = [
  { 
    name: "Google", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    industry: "Technology",
    years: "Since 2018",
    icon: <Building2 className="w-4 h-4" />,
    color: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-600"
  },
  { 
    name: "Tesla", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
    industry: "Automotive",
    years: "Since 2019",
    icon: <Zap className="w-4 h-4" />,
    color: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-600"
  },
  { 
    name: "Microsoft", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    industry: "Software",
    years: "Since 2017",
    icon: <Target className="w-4 h-4" />,
    color: "bg-indigo-50",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-600"
  },
  { 
    name: "Amazon", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    industry: "E-commerce",
    years: "Since 2020",
    icon: <Globe className="w-4 h-4" />,
    color: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-600"
  },
  { 
    name: "OpenAI", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
    industry: "AI Research",
    years: "Since 2021",
    icon: <Sparkles className="w-4 h-4" />,
    color: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-600"
  },
  { 
    name: "Meta", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    industry: "Social Media",
    years: "Since 2019",
    icon: <Users className="w-4 h-4" />,
    color: "bg-sky-50",
    borderColor: "border-sky-200",
    textColor: "text-sky-600"
  },
  { 
    name: "Netflix", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    industry: "Entertainment",
    years: "Since 2020",
    icon: <Star className="w-4 h-4" />,
    color: "bg-rose-50",
    borderColor: "border-rose-200",
    textColor: "text-rose-600"
  },
  { 
    name: "Spotify", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    industry: "Music Streaming",
    years: "Since 2019",
    icon: <Trophy className="w-4 h-4" />,
    color: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-600"
  },
];

const PartnersSection = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-gray-50/50">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="badge badge-primary mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            TRUSTED PARTNERSHIPS
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-display font-bold tracking-tight mb-4 text-gray-900"
          >
            Trusted by Global{" "}
            <span className="gradient-text-tech">
              Industry Leaders
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lead max-w-2xl mx-auto text-gray-600"
          >
            We partner with the world's most innovative companies to deliver exceptional talent solutions 
            and drive digital transformation across industries.
          </motion.p>
        </motion.div>

        {/* Smooth Infinite Marquee Section */}
        <div className="relative mb-12 overflow-hidden">
          {/* First Row - Smooth Left Scroll */}
          <div className="relative overflow-hidden py-4 mb-6">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none" />
            
            <motion.div
              className="flex"
              animate={{
                x: [0, -1120] // 8 cards * (140px width each)
              }}
              transition={{
                x: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
            >
              {/* First set of partners */}
              {[...partners, ...partners].map((partner, index) => (
                <motion.div
                  key={`first-${index}`}
                  className="flex-shrink-0 mx-2"
                  whileHover={{ 
                    y: -6,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className={`w-[140px] p-4 card card-hover ${partner.borderColor} transition-all duration-300 hover:border-steel-blue/50`}>
                    <div className="flex flex-col items-center">
                      <div className={`p-2 rounded-lg ${partner.color} ${partner.textColor} mb-3`}>
                        {partner.icon}
                      </div>
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="h-6 w-auto object-contain mb-2 opacity-80"
                        style={{ filter: 'brightness(0) saturate(100%)' }}
                      />
                      <h4 className={`font-semibold text-xs ${partner.textColor} text-center mb-1 truncate w-full`}>
                        {partner.name}
                      </h4>
                      <p className="text-[10px] text-gray-600 text-center truncate w-full">
                        {partner.industry}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Second Row - Smooth Right Scroll */}
          <div className="relative overflow-hidden py-4">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none" />
            
            <motion.div
              className="flex"
              animate={{
                x: [-1120, 0] // Reverse direction
              }}
              transition={{
                x: {
                  duration: 18,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
            >
              {/* Second set of partners (reversed) */}
              {[...partners.slice().reverse(), ...partners.slice().reverse()].map((partner, index) => (
                <motion.div
                  key={`second-${index}`}
                  className="flex-shrink-0 mx-2"
                  whileHover={{ 
                    y: -6,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className={`w-[140px] p-4 card card-hover ${partner.borderColor} transition-all duration-300 hover:border-indigo-purple/50`}>
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${partner.color} ${partner.textColor} flex-shrink-0`}>
                        {partner.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-xs ${partner.textColor} truncate`}>
                          {partner.name}
                        </h4>
                        <p className="text-[10px] text-gray-600 truncate">
                          {partner.industry}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

         
        </div>

        {/* Stats Section with Floating Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { value: "200+", label: "Global Partners", delay: 0.1 },
            { value: "95%", label: "Satisfaction Rate", delay: 0.2 },
            { value: "50+", label: "Industries Served", delay: 0.3 },
            { value: "5yrs+", label: "Avg. Partnership", delay: 0.4 },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: stat.delay }}
              whileHover={{ 
                y: -4,
                scale: 1.02,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              className="stat-card card-hover animate-float relative overflow-hidden group"
              style={{ animationDelay: `${index * 0.3}s`, animationDuration: '6s' }}
            >
              <motion.div 
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: stat.delay + 0.1 }}
                className="stat-number mb-1"
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-gray-600">{stat.label}</div>
              
              {/* Hover shine effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  initial={{ x: "-100%", opacity: 0 }}
                  whileHover={{ x: "100%", opacity: 0.2 }}
                  transition={{ duration: 0.6 }}
                  className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white to-transparent"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center p-8 rounded-2xl card-gradient border border-gray-200 relative overflow-hidden"
        >
          {/* Animated background elements */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-steel-blue/5 to-indigo-purple/5 blur-xl"
          />
          
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-xl md:text-2xl font-bold text-gray-900 mb-4 relative z-10"
          >
            Join Our Partner Network
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-gray-600 mb-6 max-w-xl mx-auto relative z-10"
          >
            Connect with industry leaders and grow your business with our partnership opportunities.
          </motion.p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={{ 
                scale: 1.05,
                y: -2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary px-6 py-3 font-medium shadow-md hover:shadow-lg transition-shadow"
            >
              Become a Partner
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ 
                scale: 1.05,
                y: -2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-outline px-6 py-3 font-medium hover:border-steel-blue hover:text-steel-blue transition-all"
            >
              View Case Studies
            </motion.button>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-6 pt-6 border-t border-gray-200 relative z-10"
          >
            <p className="text-sm text-gray-500">
              Connect with us on{" "}
              <a 
                href="https://www.linkedin.com/in/sajidfarid/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-steel-blue hover:text-indigo-purple transition-colors font-medium inline-flex items-center gap-1"
              >
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  LinkedIn
                </motion.span>
              </a>{" "}
              for partnership opportunities
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;