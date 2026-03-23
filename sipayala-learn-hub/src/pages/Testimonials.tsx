// pages/testimonials.tsx
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import SectionHeader from "@/components/common/SectionHeader";
import TestimonialCard from "@/components/common/TestimonialCard";
import CTASection from "@/components/common/CTASection";
import { motion } from "framer-motion";
import { Users, Briefcase, TrendingUp, Star, Loader2, Filter } from "lucide-react";
import { apiService, Testimonial, TestimonialStats } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<TestimonialStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<Array<{ slug: string; name: string }>>([]);

  useEffect(() => {
    fetchTestimonials();
    fetchStats();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [selectedCategory]);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }
      const response = await apiService.getTestimonials(params);
      setTestimonials(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Failed to load testimonials');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiService.getTestimonialStats();
      setStats(response);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiService.getCategories();
      setCategories(response);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const filteredTestimonials = selectedRating
    ? testimonials.filter(t => t.rating === selectedRating)
    : testimonials;

  const displayStats = [
    { 
      icon: Users, 
      value: stats?.total_testimonials?.toLocaleString() || "5000+", 
      label: "Happy Students" 
    },
    { 
      icon: Briefcase, 
      value: "95%", 
      label: "Placement Rate" 
    },
    { 
      icon: TrendingUp, 
      value: stats?.average_rating?.toFixed(1) || "4.8", 
      label: "Average Rating" 
    },
  ];

  if (isLoading && testimonials.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading success stories...</p>
          </div>
        </div>
      </Layout>
    );
  }

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
              Success Stories
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-card mb-6">
              What Our Students Say
            </h1>
            <p className="text-lg text-card/80 leading-relaxed">
              Don't just take our word for it. Hear from our graduates who have 
              successfully launched and advanced their tech careers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card relative -mt-8 z-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-muted/50 border border-border hover:shadow-lg transition-all"
              >
                <stat.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      {stats && (
        <section className="pt-12 pb-6 bg-background">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="text-sm font-medium text-muted-foreground mr-2 flex items-center gap-1">
                  <Filter className="w-4 h-4" />
                  Filter by rating:
                </span>
                <Button
                  variant={selectedRating === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRating(null)}
                  className="rounded-full"
                >
                  All
                </Button>
                {[5, 4, 3, 2, 1].map(rating => (
                  <Button
                    key={rating}
                    variant={selectedRating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRating(rating)}
                    className="rounded-full gap-1"
                  >
                    {rating} <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs ml-1">
                      ({stats.rating_distribution?.[rating] || 0})
                    </span>
                  </Button>
                ))}
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.slug} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader
            badge="Testimonials"
            title="Real Stories, Real Success"
            subtitle="Read how our training has transformed careers and opened new opportunities for our students."
          />

          {error ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Error loading testimonials
              </h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchTestimonials}>Try Again</Button>
            </div>
          ) : filteredTestimonials.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredTestimonials.map((testimonial, index) => (
                  <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                    index={index}
                  />
                ))}
              </div>
              
              {isLoading && (
                <div className="flex justify-center mt-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No testimonials found
              </h3>
              <p className="text-muted-foreground">
                No testimonials match your current filters.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSelectedRating(null);
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <CTASection
        title="Ready to Write Your Success Story?"
        subtitle="Join our community of successful graduates and start your journey to a rewarding tech career."
        primaryText="Enroll Now"
        primaryLink="/courses"
        secondaryText="Share Your Story"
        secondaryLink="/testimonials/submit"
      />
    </Layout>
  );
};

export default Testimonials;