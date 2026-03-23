// components/common/TestimonialCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Linkedin, Github, Globe, Play, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  testimonial: {
    id: number;
    student_name: string;
    student_initial: string;
    student_avatar: string | null;
    student_role: string;
    student_company: string;
    student_location: string;
    rating: number;
    title: string;
    content: string;
    course_name: string;
    category_name: string;
    category_icon: string;
    before_outcome: string;
    after_outcome: string;
    salary_hike: string;
    linkedin_url: string;
    github_url: string;
    portfolio_url: string;
    video_url: string;
    video_thumbnail: string | null;
    is_featured: boolean;
    is_verified: boolean;
    completion_year: number;
  };
  index: number;
}

const TestimonialCard = ({ testimonial, index }: TestimonialCardProps) => {
  const {
    student_name,
    student_initial,
    student_avatar,
    student_role,
    student_company,
    student_location,
    rating,
    title,
    content,
    course_name,
    category_name,
    category_icon,
    before_outcome,
    after_outcome,
    salary_hike,
    linkedin_url,
    github_url,
    portfolio_url,
    video_url,
    video_thumbnail,
    is_featured,
    is_verified,
    completion_year,
  } = testimonial;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className={cn(
        "h-full relative overflow-hidden group transition-all duration-300",
        "hover:shadow-xl hover:border-primary/30",
        is_featured && "border-2 border-primary/20"
      )}>
        {/* Featured Badge */}
        {is_featured && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          </div>
        )}

        {/* Verified Badge */}
        {is_verified && (
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          </div>
        )}

        {/* Video Thumbnail Overlay */}
        {video_url && (
          <div className="relative h-48 overflow-hidden group/video">
            <img
              src={video_thumbnail || 'https://via.placeholder.com/400x200?text=Video+Testimonial'}
              alt={student_name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/video:scale-110"
            />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity">
              <Button 
                size="icon" 
                className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90"
                onClick={() => window.open(video_url, '_blank')}
              >
                <Play className="w-6 h-6 text-white ml-1" />
              </Button>
            </div>
          </div>
        )}

        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="w-14 h-14 border-2 border-primary/20">
              <AvatarImage src={student_avatar || ''} alt={student_name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {student_initial}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg leading-tight">
                {student_name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {student_role}
                {student_company && ` at ${student_company}`}
              </p>
              {student_location && (
                <p className="text-xs text-muted-foreground mt-1">
                  {student_location}
                </p>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-4 h-4",
                  star <= rating
                    ? "fill-amber-500 text-amber-500"
                    : "text-muted-foreground"
                )}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-2">
              {rating}.0
            </span>
          </div>

          {/* Title */}
          <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
            "{title}"
          </h4>

          {/* Content */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {content}
          </p>

          {/* Course Info */}
          <div className="mb-4">
            <Badge variant="secondary" className="mb-2">
              {category_name || 'Course'} • {completion_year || 'Recent'}
            </Badge>
            <p className="text-xs font-medium text-primary">
              {course_name}
            </p>
          </div>

          {/* Outcome Highlights */}
          {(before_outcome || after_outcome || salary_hike) && (
            <div className="bg-muted/50 rounded-lg p-3 mb-4 space-y-2">
              {before_outcome && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Before:</span>
                  <span className="text-foreground font-medium">{before_outcome}</span>
                </div>
              )}
              {after_outcome && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">After:</span>
                  <span className="text-foreground font-medium">{after_outcome}</span>
                </div>
              )}
              {salary_hike && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Growth:</span>
                  <span className="text-green-600 font-semibold">{salary_hike}</span>
                </div>
              )}
            </div>
          )}

          {/* Social Links */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            {linkedin_url && (
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-auto"
                onClick={() => window.open(linkedin_url, '_blank')}
              >
                <Linkedin className="w-4 h-4" />
              </Button>
            )}
            {github_url && (
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-auto"
                onClick={() => window.open(github_url, '_blank')}
              >
                <Github className="w-4 h-4" />
              </Button>
            )}
            {portfolio_url && (
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-auto"
                onClick={() => window.open(portfolio_url, '_blank')}
              >
                <Globe className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;