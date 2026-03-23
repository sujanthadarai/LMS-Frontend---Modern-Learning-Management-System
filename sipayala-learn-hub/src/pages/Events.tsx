// src/pages/Events.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  CalendarDays, MapPin, Users, Clock, Briefcase, GraduationCap,
  Mic, Video, ChevronLeft, ChevronRight, Search, X,
  Loader2, AlertCircle, Wifi, WifiOff, RefreshCw, Star,
  Bookmark, BookmarkPlus, Share2, Download, Bell, BellOff,
  Check, ShoppingBag, Ticket, CreditCard, FileText, Globe,
  Hash, Tag, BarChart3, Zap, Filter as FilterIcon, Grid3X3,
  List, SortAsc, SortDesc, ExternalLink, MoreHorizontal,
  Calendar as CalendarIcon, Eye, EyeOff, Maximize2,
  Minimize2, Layers, ChevronDown, ChevronUp, CalendarRange,
  Clock4, Sunrise, Sunset, Moon, Sun, ArrowRight, Pin,
  Mail, User, Phone, Building, MessageSquare, CheckCircle2,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { eventsApiService } from "@/services/eventsApi";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Custom Date Utilities
class DateUtils {
  static format(date: Date, formatStr: string): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const weekday = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    const pad = (num: number) => num.toString().padStart(2, '0');
    
    return formatStr
      .replace('EEEE', fullDays[weekday])
      .replace('EEE', days[weekday])
      .replace('MMMM', months[month])
      .replace('MMM', shortMonths[month])
      .replace('MM', pad(month + 1))
      .replace('M', String(month + 1))
      .replace('dd', pad(day))
      .replace('d', String(day))
      .replace('yyyy', String(year))
      .replace('yy', String(year).slice(-2))
      .replace('HH', pad(hours))
      .replace('H', String(hours))
      .replace('hh', pad(hours % 12 || 12))
      .replace('h', String(hours % 12 || 12))
      .replace('mm', pad(minutes))
      .replace('m', String(minutes))
      .replace('a', hours < 12 ? 'AM' : 'PM')
      .replace('A', hours < 12 ? 'AM' : 'PM');
  }

  static isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  static isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDay(date, today);
  }

  static isBefore(date: Date, dateToCompare: Date): boolean {
    return date.getTime() < dateToCompare.getTime();
  }

  static addMonths(date: Date, months: number): Date {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  }

  static subMonths(date: Date, months: number): Date {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - months);
    return newDate;
  }

  static startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  static endOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  static parseISO(dateString: string): Date {
    try {
      if (dateString.includes('T')) {
        return new Date(dateString);
      }
      
      const [year, month, day] = dateString.split('-').map(Number);
      if (year && month && day) {
        return new Date(year, month - 1, day);
      }
      
      return new Date(dateString);
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return new Date();
    }
  }

  static formatToISODate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  static getTimeOfDayIcon(time: string) {
    if (!time) return <Clock4 className="w-3 h-3" />;
    const hour = parseInt(time.split(':')[0]);
    if (isNaN(hour)) return <Clock4 className="w-3 h-3" />;
    if (hour < 6) return <Moon className="w-3 h-3" />;
    if (hour < 12) return <Sunrise className="w-3 h-3" />;
    if (hour < 18) return <Sun className="w-3 h-3" />;
    return <Sunset className="w-3 h-3" />;
  }
}

// Types
interface EventType {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
  event_count: number;
}

interface EventSpeaker {
  id: number;
  full_name: string;
  title: string;
  company?: string;
  avatar_url?: string;
}

interface Event {
  id: number;
  slug: string;
  title: string;
  description: string;
  short_description: string;
  event_type: EventType;
  speaker?: EventSpeaker;
  start_date: string;
  end_date: string;
  duration: string;
  formatted_time: string;
  location: string;
  venue?: string;
  is_online: boolean;
  total_seats: number;
  available_seats: number;
  registered_count: number;
  registration_percentage: number;
  price_type: 'free' | 'paid';
  current_price: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  is_featured: boolean;
  is_popular: boolean;
  thumbnail_url?: string;
  cover_image_url?: string;
  tags_list: string[];
  is_registered?: boolean;
}

// Helper function to get seat status
const getSeatStatus = (event: Event) => {
  const percentage = (event.registered_count / event.total_seats) * 100;
  
  if (percentage >= 100) {
    return { text: 'Full', color: 'text-red-500', bg: 'bg-red-500', variant: 'destructive' as const };
  }
  if (percentage >= 80) {
    return { text: 'Almost Full', color: 'text-orange-500', bg: 'bg-orange-500', variant: 'warning' as const };
  }
  if (percentage >= 50) {
    return { text: 'Limited', color: 'text-yellow-500', bg: 'bg-yellow-500', variant: 'outline' as const };
  }
  return { text: 'Available', color: 'text-green-500', bg: 'bg-green-500', variant: 'secondary' as const };
};

// Helper function for speaker avatar
const getSpeakerAvatarUrl = (speaker?: EventSpeaker) => {
  if (!speaker) return null;
  
  if (speaker.avatar_url) {
    if (speaker.avatar_url.startsWith('http')) {
      return speaker.avatar_url;
    } else {
      return `https://sipalaya-lms-professional-learning.onrender.com/${speaker.avatar_url}`;
    }
  }
  
  return null;
};

// Multi-Event Day Component
const MultiEventDayView = ({ 
  date, 
  events, 
  onEventSelect,
  onBookmark,
  bookmarkedEvents,
  maxVisible = 3
}: { 
  date: Date;
  events: Event[];
  onEventSelect: (event: Event) => void;
  onBookmark: (eventId: number) => void;
  bookmarkedEvents: Set<number>;
  maxVisible?: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const visibleEvents = expanded ? events : events.slice(0, maxVisible);
  const hasMore = events.length > maxVisible;

  const getEventTime = (event: Event) => {
    return event.formatted_time?.split(' - ')[0] || 'TBA';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold text-sm">
            {DateUtils.format(date, 'EEE, MMM d')}
          </span>
          <Badge variant="outline" className="text-xs">
            {events.length} event{events.length > 1 ? 's' : ''}
          </Badge>
        </div>
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-6 px-2 text-xs"
          >
            {expanded ? (
              <>
                <Minimize2 className="w-3 h-3 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <Maximize2 className="w-3 h-3 mr-1" />
                Show All
              </>
            )}
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {visibleEvents.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "group relative p-3 rounded-lg border cursor-pointer transition-all",
              "hover:shadow-md hover:border-primary/50 bg-card/50",
              "hover:bg-gradient-to-r hover:from-primary/5 hover:via-primary/2 hover:to-transparent"
            )}
            onClick={() => onEventSelect(event)}
          >
            {/* Event Type Color Bar */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
              style={{ backgroundColor: event.event_type?.color || '#3b82f6' }}
            />

            <div className="pl-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {DateUtils.getTimeOfDayIcon(getEventTime(event))}
                      <span>{getEventTime(event)}</span>
                    </div>
                    <Badge 
                      className="text-xs px-2 py-0.5"
                      variant="outline"
                      style={{ 
                        borderColor: `${event.event_type?.color || '#3b82f6'}40`,
                        color: event.event_type?.color || '#3b82f6'
                      }}
                    >
                      {event.event_type?.name}
                    </Badge>
                  </div>
                  
                  <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-primary">
                    {event.title}
                  </h4>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {event.duration}
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookmark(event.id);
                  }}
                >
                  {bookmarkedEvents.has(event.id) ? (
                    <Bookmark className="w-3 h-3 fill-primary text-primary" />
                  ) : (
                    <BookmarkPlus className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {!expanded && hasMore && (
        <div className="pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs h-7"
            onClick={() => setExpanded(true)}
          >
            <MoreHorizontal className="w-3 h-3 mr-1" />
            +{events.length - maxVisible} more events
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

// Event Timeline View for Same Day
const EventTimelineView = ({ events }: { events: Event[] }) => {
  const sortedEvents = [...events].sort((a, b) => {
    const timeA = a.formatted_time?.split(' - ')[0] || '';
    const timeB = b.formatted_time?.split(' - ')[0] || '';
    return timeA.localeCompare(timeB);
  });

  return (
    <div className="relative pl-6">
      {/* Timeline line */}
      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/30 to-primary/20" />
      
      {sortedEvents.map((event, index) => (
        <div key={event.id} className="relative mb-6 last:mb-0">
          {/* Timeline dot */}
          <div 
            className="absolute left-[-26px] top-2 w-4 h-4 rounded-full border-4 border-background z-10"
            style={{ backgroundColor: event.event_type?.color || '#3b82f6' }}
          />
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge 
                      className="px-3 py-1"
                      style={{ 
                        backgroundColor: `${event.event_type?.color || '#3b82f6'}20`,
                        color: event.event_type?.color || '#3b82f6'
                      }}
                    >
                      {event.event_type?.name}
                    </Badge>
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      {DateUtils.getTimeOfDayIcon(event.formatted_time)}
                      {event.formatted_time}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h4>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {event.short_description}
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{event.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{event.available_seats} seats</span>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4 flex flex-col items-end gap-2">
                  <Badge variant={event.price_type === 'free' ? 'secondary' : 'outline'}>
                    {event.price_type === 'free' ? 'FREE' : `$${event.current_price}`}
                  </Badge>
                  {event.is_featured && (
                    <Badge variant="default" className="bg-amber-500">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

// Registration Form Component - Fixed for your backend model
const RegistrationForm = ({ 
  event, 
  onRegister, 
  onClose 
}: { 
  event: Event; 
  onRegister: (data: any) => Promise<void>; 
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
    agree_to_terms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!formData.full_name.trim()) {
      setError('Please enter your full name');
      return;
    }
    
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address (e.g., name@example.com)');
      return;
    }
    
    if (!formData.agree_to_terms) {
      setError('You must agree to the terms and conditions to register');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send only the fields that exist in your backend model
      await onRegister({
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || '',
        company: formData.company.trim() || '',
        notes: formData.notes.trim() || ''
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (success) {
    return (
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">🎉 Registration Successful!</DialogTitle>
            <DialogDescription className="text-center">
              Thank you for registering for this event.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-2">You're all set!</h3>
              <p className="text-muted-foreground mb-4">
                A confirmation has been sent to <strong>{formData.email}</strong>
              </p>
              
              <div className="bg-primary/5 p-4 rounded-lg mb-4 text-left">
                <h4 className="font-medium mb-2">Event Details</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Event:</span> {event.title}</p>
                  <p><span className="font-medium">Date:</span> {DateUtils.format(DateUtils.parseISO(event.start_date), 'EEEE, MMMM d, yyyy')}</p>
                  <p><span className="font-medium">Time:</span> {event.formatted_time}</p>
                  <p><span className="font-medium">Location:</span> {event.location}</p>
                </div>
              </div>
              
              <Button onClick={onClose} className="px-8">
                Done
              </Button>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Register for Event</DialogTitle>
          <DialogDescription>
            Complete the form below to register for "{event.title}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Event Info Summary */}
          <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-4 rounded-lg border border-primary/10">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{event.title}</h4>
                <div className="text-sm text-muted-foreground space-y-1 mt-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {DateUtils.format(DateUtils.parseISO(event.start_date), 'MMM d, yyyy')} • {event.formatted_time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {event.location}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Badge variant="outline" className="shrink-0">
                  {event.available_seats} seats left
                </Badge>
                <Badge variant={event.price_type === 'free' ? 'secondary' : 'outline'}>
                  {event.price_type === 'free' ? 'FREE' : `$${event.current_price}`}
                </Badge>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/10 border border-destructive/20 rounded-lg p-3"
            >
              <p className="text-destructive text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            </motion.div>
          )}

          {/* Form Fields - Exactly matching your backend model */}
          <div className="space-y-4">
            {/* Required Fields */}
            <div className="space-y-2">
              <Label htmlFor="full_name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="John Doe"
                disabled={isSubmitting}
                className="border-2 focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                disabled={isSubmitting}
                className="border-2 focus:ring-2 focus:ring-primary/20"
                required
              />
              <p className="text-xs text-muted-foreground">
                We'll send your confirmation to this email
              </p>
            </div>

            {/* Optional Fields */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                disabled={isSubmitting}
                className="border-2 focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground">For urgent updates (optional)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Company / Organization
              </Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your company (optional)"
                disabled={isSubmitting}
                className="border-2 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Notes/Special Requirements */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Notes / Special Requirements
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Dietary requirements, accessibility needs, or any questions..."
                rows={3}
                disabled={isSubmitting}
                className="border-2 focus:ring-2 focus:ring-primary/20 resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Let us know if you have any special requirements (optional)
              </p>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <Checkbox 
                id="agree_to_terms" 
                name="agree_to_terms"
                checked={formData.agree_to_terms}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, agree_to_terms: checked as boolean }))
                }
                className="mt-1"
                required
              />
              <Label htmlFor="agree_to_terms" className="text-sm leading-tight">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline font-medium" target="_blank">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline font-medium" target="_blank">
                  Privacy Policy
                </Link>
                <span className="text-red-500 ml-1">*</span>
              </Label>
            </div>

            {/* Privacy Notice */}
            <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg flex items-start gap-2">
              <Shield className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
              <p>
                Your information will only be used for event registration and communication. 
                We respect your privacy and will never share your data with third parties.
              </p>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Ticket className="w-4 h-4 mr-2" />
                  Register Now
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Events = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'grid' | 'timeline'>('calendar');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'date' | 'time' | 'popularity' | 'price'>('date');
  
  const [events, setEvents] = useState<Event[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<Record<string, Event[]>>({});
  const [bookmarkedEvents, setBookmarkedEvents] = useState<Set<number>>(new Set());
  const [multiEventDays, setMultiEventDays] = useState<Date[]>([]);
  
  // Registration states
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [eventToRegister, setEventToRegister] = useState<Event | null>(null);
  
  const { toast } = useToast();
  
  // Helper function to get event image URL
  const getEventImageUrl = (event: Event) => {
    const imageInfo = eventsApiService.getEventImage(event);
    return imageInfo.url;
  };

  // Debug image loading
  const debugImageLoading = (event: Event) => {
    const imageInfo = eventsApiService.getEventImage(event);
    console.log(`=== Image Debug for "${event.title}" ===`);
    console.log('Image info:', imageInfo);
    console.log('Image type:', imageInfo.type);
    console.log('Image URL:', imageInfo.url);
    console.log('Is placeholder:', imageInfo.url.includes('placeholder.com'));
    console.log('=====================');
  };

  // Test API endpoints
  const testApiEndpoints = async () => {
    const endpoints = [
      { name: 'Events', url: 'https://sipalaya-lms-professional-learning.onrender.com//api/events/events/' },
      { name: 'Event Types', url: 'https://sipalaya-lms-professional-learning.onrender.com//api/events/event-types/' },
      { name: 'Registrations', url: 'https://sipalaya-lms-professional-learning.onrender.com//api/events/event-registrations/' },
    ];
    
    const results: Record<string, boolean> = {};
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url);
        results[endpoint.name] = response.ok;
        console.log(`${endpoint.name} endpoint:`, response.ok ? '✅ OK' : '❌ Failed');
      } catch (error) {
        results[endpoint.name] = false;
        console.log(`${endpoint.name} endpoint: ❌ Failed -`, error);
      }
    }
    
    return results;
  };

  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Starting data fetch...');
      const endpointStatus = await testApiEndpoints();
      
      if (!endpointStatus['Events'] && !endpointStatus['Event Types']) {
        throw new Error('API endpoints are not accessible. Make sure Django server is running.');
      }

      const [typesData, eventsData] = await Promise.allSettled([
        eventsApiService.getEventTypes(),
        eventsApiService.getEvents({
          status: 'upcoming',
          ordering: 'start_date',
          page_size: 100
        }),
      ]);

      if (typesData.status === 'fulfilled') {
        console.log('Event types loaded:', typesData.value.length);
        setEventTypes(typesData.value);
      }

      if (eventsData.status === 'fulfilled') {
        const allEvents = eventsData.value;
        console.log('Events loaded:', allEvents.length);
        setEvents(allEvents);
        
        // Debug first few events
        if (allEvents.length > 0) {
          console.log('=== Debug first 3 events ===');
          allEvents.slice(0, 3).forEach(event => {
            debugImageLoading(event);
          });
        }
        
        // Group events by date
        const calendarData: Record<string, Event[]> = {};
        allEvents.forEach(event => {
          if (event.start_date) {
            try {
              const dateKey = DateUtils.formatToISODate(DateUtils.parseISO(event.start_date));
              if (!calendarData[dateKey]) {
                calendarData[dateKey] = [];
              }
              calendarData[dateKey].push(event);
            } catch (dateError) {
              console.error('Error processing event date:', dateError);
            }
          }
        });
        console.log('Calendar data created for', Object.keys(calendarData).length, 'dates');
        setCalendarEvents(calendarData);
        
        // Find dates with multiple events
        const multiDays: Date[] = [];
        Object.entries(calendarData).forEach(([dateKey, dayEvents]) => {
          if (dayEvents.length > 1) {
            multiDays.push(DateUtils.parseISO(dateKey));
          }
        });
        setMultiEventDays(multiDays);
        console.log('Multi-event days:', multiDays.length);
      } else {
        console.error('Events promise rejected:', eventsData.reason);
        throw new Error('Failed to load events');
      }

    } catch (err: any) {
      console.error('Error in fetchData:', err);
      setError(err.message || 'Failed to load events data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Get event type icon
  const getEventTypeIcon = (typeName?: string) => {
    if (!typeName) return <CalendarDays className="w-4 h-4" />;
    
    const typeLower = typeName.toLowerCase();
    if (typeLower.includes('workshop')) return <GraduationCap className="w-4 h-4" />;
    if (typeLower.includes('interview')) return <Briefcase className="w-4 h-4" />;
    if (typeLower.includes('seminar')) return <Mic className="w-4 h-4" />;
    if (typeLower.includes('conference')) return <Video className="w-4 h-4" />;
    if (typeLower.includes('networking')) return <Users className="w-4 h-4" />;
    if (typeLower.includes('webinar')) return <Globe className="w-4 h-4" />;
    return <CalendarDays className="w-4 h-4" />;
  };

  // Filter events
  const filteredEvents = useMemo(() => {
    let filtered = events;
    
    if (activeFilter !== 'all') {
      filtered = filtered.filter(event => 
        event?.event_type?.slug === activeFilter
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.speaker?.full_name.toLowerCase().includes(query)
      );
    }
    
    filtered = [...filtered].sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'date':
          compareValue = DateUtils.parseISO(a.start_date).getTime() - DateUtils.parseISO(b.start_date).getTime();
          break;
        case 'time':
          const timeA = a.formatted_time?.split(' - ')[0] || '';
          const timeB = b.formatted_time?.split(' - ')[0] || '';
          compareValue = timeA.localeCompare(timeB);
          break;
        case 'popularity':
          compareValue = (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0) ||
                        b.registered_count - a.registered_count;
          break;
        case 'price':
          const priceA = a.price_type === 'free' ? 0 : parseFloat(a.current_price) || 0;
          const priceB = b.price_type === 'free' ? 0 : parseFloat(b.current_price) || 0;
          compareValue = priceA - priceB;
          break;
      }
      
      return compareValue;
    });
    
    return filtered;
  }, [events, activeFilter, searchQuery, sortBy]);

  // Get events for selected date
  const eventsForSelectedDate = useMemo(() => {
    const dateKey = DateUtils.formatToISODate(selectedDate);
    return calendarEvents[dateKey] || [];
  }, [selectedDate, calendarEvents]);

  // Get calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const start = DateUtils.startOfMonth(currentMonth);
    const end = DateUtils.endOfMonth(currentMonth);
    const daysInMonth = end.getDate();
    const startingDay = start.getDay();
    
    const days: any[] = [];
    const today = new Date();
    
    // Previous month days
    const prevMonth = DateUtils.subMonths(currentMonth, 1);
    const prevMonthEnd = DateUtils.endOfMonth(prevMonth).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthEnd - i);
      const dateKey = DateUtils.formatToISODate(date);
      const dayEvents = calendarEvents[dateKey] || [];
      
      days.push({
        date,
        isCurrentMonth: false,
        isToday: DateUtils.isToday(date),
        isSelected: DateUtils.isSameDay(date, selectedDate),
        isPast: DateUtils.isBefore(date, today),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        events: dayEvents,
        hasEvents: dayEvents.length > 0,
        eventCount: dayEvents.length,
        isMultiEvent: dayEvents.length > 1
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateKey = DateUtils.formatToISODate(date);
      const dayEvents = calendarEvents[dateKey] || [];
      
      days.push({
        date,
        isCurrentMonth: true,
        isToday: DateUtils.isToday(date),
        isSelected: DateUtils.isSameDay(date, selectedDate),
        isPast: DateUtils.isBefore(date, today),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        events: dayEvents,
        hasEvents: dayEvents.length > 0,
        eventCount: dayEvents.length,
        isMultiEvent: dayEvents.length > 1
      });
    }
    
    // Next month days
    const totalCells = 42;
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      const dateKey = DateUtils.formatToISODate(date);
      const dayEvents = calendarEvents[dateKey] || [];
      
      days.push({
        date,
        isCurrentMonth: false,
        isToday: DateUtils.isToday(date),
        isSelected: DateUtils.isSameDay(date, selectedDate),
        isPast: DateUtils.isBefore(date, today),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        events: dayEvents,
        hasEvents: dayEvents.length > 0,
        eventCount: dayEvents.length,
        isMultiEvent: dayEvents.length > 1
      });
    }
    
    return days;
  }, [currentMonth, selectedDate, calendarEvents]);

  // Handle day click
  const handleDayClick = (day: any) => {
    setSelectedDate(day.date);
    if (day.events.length > 0) {
      if (day.events.length === 1) {
        setSelectedEvent(day.events[0]);
      } else {
        // For multiple events, show the multi-event view
        setSelectedEvent(null);
      }
    }
  };

  // Handle event registration
  const handleRegister = async (event: Event) => {
    // Set the event to register and show the form
    setEventToRegister(event);
    setShowRegistrationForm(true);
  };

  // Handle form registration submission - Fixed version

// Replace the handleFormRegistration function with this improved version

// Replace the handleFormRegistration function with this version

const handleFormRegistration = async (formData: any) => {
  if (!eventToRegister) return;

  try {
    console.log('Sending registration data to backend:', formData);

    // Validate required fields
    if (!formData.full_name?.trim()) {
      throw new Error('Full name is required');
    }
    
    if (!formData.email?.trim()) {
      throw new Error('Email address is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      throw new Error('Please enter a valid email address');
    }

    const registrationData = {
      event: eventToRegister.id,
      full_name: formData.full_name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone?.trim() || '',
      company: formData.company?.trim() || '',
      notes: formData.notes?.trim() || ''
    };

    console.log('Sending:', registrationData);

    const response = await fetch('https://sipalaya-lms-professional-learning.onrender.com//api/events/event-registrations/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });

    const responseText = await response.text();
    console.log('Response:', responseText);

    if (!response.ok) {
      if (responseText.includes('no such column')) {
        throw new Error(
          'Database schema error: The registration table is missing required columns. ' +
          'Please run: python manage.py makemigrations && python manage.py migrate'
        );
      }
      
      // Try to parse as JSON
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.detail || errorData.error || 'Registration failed');
      } catch {
        throw new Error(`Server error: ${responseText.substring(0, 200)}`);
      }
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: 'Registration successful' };
    }

    toast({
      title: "Registration Successful! 🎉",
      description: "You have been registered for the event.",
      duration: 6000,
    });

    setShowRegistrationForm(false);
    setEventToRegister(null);
    
    setTimeout(() => fetchData(), 1000);

  } catch (err: any) {
    console.error('Registration error:', err);
    toast({
      title: "Registration Failed",
      description: err.message,
      variant: "destructive",
      duration: 5000,
    });
    throw err;
  }
};

  // Add this function to check if an email is already registered for an event
  const checkRegistrationStatus = async (eventId: number, email: string) => {
    try {
      const response = await fetch(
        `https://sipalaya-lms-professional-learning.onrender.com//api/events/event-registrations/check/?event=${eventId}&email=${encodeURIComponent(email)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error checking registration:', error);
      return null;
    }
  };

  // Toggle bookmark
  const toggleBookmark = (eventId: number) => {
    setBookmarkedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
    
    toast({
      title: bookmarkedEvents.has(eventId) ? "Removed from bookmarks" : "Added to bookmarks",
      description: "Event has been " + (bookmarkedEvents.has(eventId) ? "removed from" : "added to") + " your bookmarks.",
      duration: 2000,
    });
  };

  // Handle search
  const handleSearch = useCallback(async () => {
    try {
      setIsLoading(true);
      const searchResults = await eventsApiService.getEvents({
        search: searchQuery,
        ordering: 'start_date'
      });
      setEvents(searchResults);
    } catch (err: any) {
      console.error('Search error:', err);
      setError('Search failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  // Retry fetching data
  const retryFetchData = async () => {
    await fetchData();
  };

  // Get days with multiple events for current month
  const multiEventDaysThisMonth = useMemo(() => {
    return multiEventDays.filter(date => 
      date.getMonth() === currentMonth.getMonth() &&
      date.getFullYear() === currentMonth.getFullYear()
    );
  }, [multiEventDays, currentMonth]);

  // Debug all images when selected
  useEffect(() => {
    if (selectedEvent) {
      debugImageLoading(selectedEvent);
    }
  }, [selectedEvent]);

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <section className="pt-32 pb-16 min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container-custom text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Loader2 className="w-20 h-20 animate-spin mx-auto mb-6 text-primary" />
              <h2 className="text-3xl font-bold text-foreground mb-4">Loading Events</h2>
              <p className="text-muted-foreground mb-6">Fetching events and calendar data...</p>
              
              <div className="w-full max-w-md mx-auto bg-secondary/20 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <section className="pt-32 pb-16 min-h-screen bg-gradient-to-br from-destructive/5 via-background to-destructive/5">
          <div className="container-custom text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AlertCircle className="w-24 h-24 text-destructive/30 mx-auto mb-8" />
              <h1 className="text-4xl font-bold text-foreground mb-4">Connection Issue</h1>
              <p className="text-muted-foreground mb-8 text-lg">{error}</p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={retryFetchData} size="lg" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  size="lg"
                >
                  Refresh Page
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container-custom text-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {multiEventDays.length} Days with Multiple Events
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
              Events Calendar <span className="text-gradient">Manager</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Professional event management with multi-event date support, timeline views, and smart scheduling.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events by title, location, or speaker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-24"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                </Button>
                {searchQuery && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSearchQuery('');
                      retryFetchData();
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Filters & View Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setActiveFilter('all')}
                  className="rounded-full"
                >
                  All Events ({events.length})
                </Button>
                {eventTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={activeFilter === type.slug ? 'default' : 'outline'}
                    onClick={() => setActiveFilter(type.slug)}
                    className="rounded-full"
                    style={{
                      backgroundColor: activeFilter === type.slug ? type.color : undefined,
                      borderColor: activeFilter === type.slug ? type.color : undefined
                    }}
                  >
                    {getEventTypeIcon(type.name)}
                    <span className="ml-2">{type.name}</span>
                  </Button>
                ))}
                <Button
                  variant={activeFilter === 'multi' ? 'default' : 'outline'}
                  onClick={() => setActiveFilter('multi')}
                  className="rounded-full"
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Multi-Event Days ({multiEventDays.length})
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'outline'}
                  onClick={() => setViewMode('calendar')}
                  size="sm"
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Calendar
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => setViewMode('list')}
                  size="sm"
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  onClick={() => setViewMode('grid')}
                  size="sm"
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'timeline' ? 'default' : 'outline'}
                  onClick={() => setViewMode('timeline')}
                  size="sm"
                >
                  <CalendarRange className="w-4 h-4 mr-2" />
                  Timeline
                </Button>
              </div>
            </div>
            
            {/* Sort Options */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <div className="flex gap-2">
                {['date', 'time', 'popularity', 'price'].map((sortType) => (
                  <Button
                    key={sortType}
                    variant={sortBy === sortType ? 'default' : 'outline'}
                    onClick={() => setSortBy(sortType as any)}
                    size="sm"
                    className="capitalize"
                  >
                    {sortType === 'date' && <CalendarDays className="w-3 h-3 mr-1" />}
                    {sortType === 'time' && <Clock className="w-3 h-3 mr-1" />}
                    {sortType === 'popularity' && <Star className="w-3 h-3 mr-1" />}
                    {sortType === 'price' && <CreditCard className="w-3 h-3 mr-1" />}
                    {sortType}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {viewMode === 'calendar' ? (
                <div className="bg-card rounded-2xl border shadow-lg p-6">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        {DateUtils.format(currentMonth, 'MMMM yyyy')}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {multiEventDaysThisMonth.length} days with multiple events this month
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentMonth(DateUtils.subMonths(currentMonth, 1))}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setCurrentMonth(new Date());
                          setSelectedDate(new Date());
                        }}
                        className="text-sm"
                      >
                        Today
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentMonth(DateUtils.addMonths(currentMonth, 1))}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDayClick(day)}
                        className={cn(
                          "relative p-2 rounded-xl border transition-all duration-200 min-h-[90px]",
                          day.isCurrentMonth 
                            ? "bg-card border-border hover:border-primary/50" 
                            : "bg-muted/30 border-muted text-muted-foreground",
                          day.isToday && "border-primary bg-primary/5",
                          day.isSelected && "border-primary bg-primary/10",
                          day.isMultiEvent && "ring-2 ring-primary/20",
                          day.isWeekend && "bg-muted/5"
                        )}
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex justify-between items-start mb-1">
                            <span className={cn(
                              "text-lg font-semibold",
                              day.isToday && "text-primary",
                              day.isSelected && "text-primary",
                              !day.isCurrentMonth && "text-muted-foreground"
                            )}>
                              {day.date.getDate()}
                            </span>
                            
                            {day.isMultiEvent && (
                              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            )}
                          </div>
                          
                          {/* Event Indicators */}
                          <div className="flex-1 space-y-1 overflow-hidden">
                            {day.events.slice(0, 2).map((event: Event, idx: number) => (
                              <div
                                key={idx}
                                className="text-xs p-1 rounded truncate"
                                style={{
                                  backgroundColor: `${event.event_type?.color || '#3b82f6'}15`,
                                  borderLeft: `3px solid ${event.event_type?.color || '#3b82f6'}`
                                }}
                              >
                                <span className="truncate block">
                                  {event.title}
                                </span>
                              </div>
                            ))}
                            
                            {day.eventCount > 2 && (
                              <div className="text-xs text-center text-muted-foreground pt-1">
                                +{day.eventCount - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Event count badge */}
                        {day.eventCount > 0 && (
                          <div className={cn(
                            "absolute -top-1 -right-1 w-6 h-6 text-xs rounded-full flex items-center justify-center shadow-md",
                            day.isMultiEvent 
                              ? "bg-gradient-to-r from-primary to-primary/80 text-white" 
                              : "bg-primary/10 text-primary"
                          )}>
                            {day.eventCount}
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary/10 border-2 border-primary/30"></div>
                      <span>Single Event</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                      <span>Multiple Events</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span>Today</span>
                    </div>
                  </div>
                </div>
              ) : viewMode === 'timeline' && eventsForSelectedDate.length > 0 ? (
                // Timeline View for Selected Date
                <div className="bg-card rounded-2xl border shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        Timeline for {DateUtils.format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {eventsForSelectedDate.length} events scheduled
                      </p>
                    </div>
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      {eventsForSelectedDate.length} Events
                    </Badge>
                  </div>
                  
                  <EventTimelineView events={eventsForSelectedDate} />
                </div>
              ) : viewMode === 'list' ? (
                // List View
                <div className="space-y-6">
                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-2xl border border-border">
                      <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Events Found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery ? 'No events match your search.' : 'No events available.'}
                      </p>
                      <Button onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}>
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    filteredEvents.map((event) => (
                      <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/4">
                              <div className="relative h-48 md:h-full rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                                <img
                                  src={getEventImageUrl(event)}
                                  alt={eventsApiService.getEventImage(event).alt}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    e.currentTarget.src = eventsApiService.getPlaceholderImage();
                                    console.log('Image failed to load, using placeholder for:', event.title);
                                  }}
                                  onLoad={() => console.log('Image loaded successfully for:', event.title)}
                                />
                                {event.is_featured && (
                                  <div className="absolute top-3 left-3">
                                    <Badge className="bg-amber-500">
                                      <Star className="w-3 h-3 mr-1" />
                                      Featured
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge 
                                      style={{ 
                                        backgroundColor: `${event.event_type?.color || '#3b82f6'}20`,
                                        color: event.event_type?.color || '#3b82f6'
                                      }}
                                    >
                                      {event.event_type?.name}
                                    </Badge>
                                    <Badge variant={event.price_type === 'free' ? 'secondary' : 'outline'}>
                                      {event.price_type === 'free' ? 'FREE' : `$${event.current_price}`}
                                    </Badge>
                                  </div>
                                  <h3 className="text-xl font-bold text-foreground mb-2">{event.title}</h3>
                                  <p className="text-muted-foreground mb-4">{event.short_description}</p>
                                </div>
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleBookmark(event.id)}
                                >
                                  {bookmarkedEvents.has(event.id) ? (
                                    <Bookmark className="w-5 h-5 fill-primary text-primary" />
                                  ) : (
                                    <Bookmark className="w-5 h-5" />
                                  )}
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground">Date & Time</div>
                                  <div className="font-medium flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4" />
                                    {DateUtils.format(DateUtils.parseISO(event.start_date), 'MMM d, yyyy')}
                                  </div>
                                  <div className="text-sm flex items-center gap-1">
                                    {DateUtils.getTimeOfDayIcon(event.formatted_time)}
                                    {event.formatted_time}
                                  </div>
                                </div>
                                
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground">Location</div>
                                  <div className="font-medium flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {event.location}
                                  </div>
                                </div>
                                
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground">Duration</div>
                                  <div className="font-medium flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {event.duration}
                                  </div>
                                </div>
                                
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground">Availability</div>
                                  <div className="font-medium flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    {event.available_seats} / {event.total_seats}
                                  </div>
                                  <div className="w-full bg-secondary h-1 rounded-full overflow-hidden">
                                    <div 
                                      className="bg-primary h-full rounded-full"
                                      style={{ width: `${event.registration_percentage}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Button 
                                  onClick={() => setSelectedEvent(event)}
                                  variant="outline"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </Button>
                                
                                <Button 
                                  onClick={() => handleRegister(event)}
                                  disabled={event.is_registered}
                                  className={event.is_registered ? "bg-green-600 hover:bg-green-700" : ""}
                                >
                                  {event.is_registered ? (
                                    <>
                                      <Check className="w-4 h-4 mr-2" />
                                      Registered
                                    </>
                                  ) : (
                                    'Register Now'
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              ) : (
                // Grid View (default)
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredEvents.length === 0 ? (
                    <div className="col-span-2 text-center py-12 bg-card rounded-2xl border border-border">
                      <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Events Found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery ? 'No events match your search.' : 'No events available.'}
                      </p>
                      <Button onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}>
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    filteredEvents.map((event) => (
                      <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all group">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={getEventImageUrl(event)}
                            alt={eventsApiService.getEventImage(event).alt}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.src = eventsApiService.getPlaceholderImage();
                              console.log('Image failed to load, using placeholder for:', event.title);
                            }}
                            onLoad={() => console.log('Image loaded successfully for:', event.title)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          
                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                            <Badge 
                              className="backdrop-blur-sm bg-white/20 text-white border-0"
                              style={{ backgroundColor: event.event_type?.color || '#3b82f6' }}
                            >
                              {event.event_type?.name}
                            </Badge>
                            {event.is_featured && (
                              <Badge className="bg-amber-500 backdrop-blur-sm">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          
                          {/* Bottom Content */}
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-white font-bold text-lg line-clamp-2 mb-2">
                              {event.title}
                            </h3>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-white/80 text-sm">
                                <CalendarDays className="w-3 h-3" />
                                {DateUtils.format(DateUtils.parseISO(event.start_date), 'MMM d')}
                                <span className="mx-1">•</span>
                                {DateUtils.getTimeOfDayIcon(event.formatted_time)}
                                {event.formatted_time?.split(' - ')[0]}
                              </div>
                              <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm">
                                {event.price_type === 'free' ? 'FREE' : `$${event.current_price}`}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{event.location}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleBookmark(event.id)}
                              >
                                {bookmarkedEvents.has(event.id) ? (
                                  <Bookmark className="w-4 h-4 fill-primary text-primary" />
                                ) : (
                                  <Bookmark className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => setSelectedEvent(event)}
                              >
                                Details
                                <ArrowRight className="w-3 h-3 ml-2" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className={getSeatStatus(event).color}>
                                {event.available_seats} seats left
                              </span>
                            </div>
                            <Badge variant={getSeatStatus(event).variant}>
                              {getSeatStatus(event).text}
                            </Badge>
                          </div>
                          
                          <Button
                            size="sm"
                            variant={event.is_registered ? "secondary" : "default"}
                            onClick={() => handleRegister(event)}
                            disabled={event.is_registered}
                            className="w-full mt-3"
                          >
                            {event.is_registered ? (
                              <>
                                <Check className="w-3 h-3 mr-1" />
                                Registered
                              </>
                            ) : (
                              'Register Now'
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Selected Date Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5" />
                    {DateUtils.format(selectedDate, 'EEE, MMM d')}
                  </CardTitle>
                  <CardDescription>
                    {eventsForSelectedDate.length} event{eventsForSelectedDate.length !== 1 ? 's' : ''} scheduled
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {eventsForSelectedDate.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No events scheduled for this date</p>
                    </div>
                  ) : eventsForSelectedDate.length === 1 ? (
                    <div 
                      className="p-4 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => setSelectedEvent(eventsForSelectedDate[0])}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${eventsForSelectedDate[0].event_type?.color || '#3b82f6'}20` }}
                        >
                          <div style={{ color: eventsForSelectedDate[0].event_type?.color || '#3b82f6' }}>
                            {getEventTypeIcon(eventsForSelectedDate[0].event_type?.name)}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{eventsForSelectedDate[0].title}</h4>
                          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3" />
                            {eventsForSelectedDate[0].formatted_time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <MultiEventDayView
                      date={selectedDate}
                      events={eventsForSelectedDate}
                      onEventSelect={setSelectedEvent}
                      onBookmark={toggleBookmark}
                      bookmarkedEvents={bookmarkedEvents}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Multi-Event Days This Month */}
              {multiEventDaysThisMonth.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="w-5 h-5" />
                      Busy Days This Month
                    </CardTitle>
                    <CardDescription>
                      {multiEventDaysThisMonth.length} days with multiple events
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {multiEventDaysThisMonth.slice(0, 5).map((date) => {
                        const dateKey = DateUtils.formatToISODate(date);
                        const dayEvents = calendarEvents[dateKey] || [];
                        return (
                          <div
                            key={dateKey}
                            className="p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                            onClick={() => {
                              setSelectedDate(date);
                              setViewMode('timeline');
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">
                                  {DateUtils.format(date, 'EEE, MMM d')}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {dayEvents.length} events
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                        );
                      })}
                      
                      {multiEventDaysThisMonth.length > 5 && (
                        <Button variant="outline" size="sm" className="w-full">
                          View All {multiEventDaysThisMonth.length} Busy Days
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Event Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Event Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Events</span>
                      <span className="font-bold text-primary text-xl">{events.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Multi-Event Days</span>
                      <span className="font-bold text-purple-600">{multiEventDays.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Free Events</span>
                      <span className="font-bold text-green-600">
                        {events.filter(e => e.price_type === 'free').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Upcoming Events</span>
                      <span className="font-bold text-blue-600">
                        {events.filter(e => e.status === 'upcoming').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Registrations</span>
                      <span className="font-bold text-orange-600">
                        {events.reduce((acc, e) => acc + e.registered_count, 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start gap-3"
                      onClick={() => {
                        const today = new Date();
                        setSelectedDate(today);
                        const dateKey = DateUtils.formatToISODate(today);
                        if (calendarEvents[dateKey]?.length > 1) {
                          setViewMode('timeline');
                        }
                      }}
                    >
                      <CalendarDays className="w-4 h-4" />
                      View Today's Events
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-3">
                      <Download className="w-4 h-4" />
                      Export Schedule
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-3">
                      <Bell className="w-4 h-4" />
                      Set Reminders
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Bookmarked Events */}
              {bookmarkedEvents.size > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bookmark className="w-5 h-5 fill-primary text-primary" />
                      Bookmarked Events
                    </CardTitle>
                    <CardDescription>
                      {bookmarkedEvents.size} saved events
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {events
                        .filter(e => bookmarkedEvents.has(e.id))
                        .slice(0, 3)
                        .map(event => (
                          <div
                            key={event.id}
                            className="p-2 rounded-lg hover:bg-accent/50 cursor-pointer text-sm flex items-center justify-between"
                            onClick={() => setSelectedEvent(event)}
                          >
                            <span className="truncate">{event.title}</span>
                            <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                          </div>
                        ))}
                      {bookmarkedEvents.size > 3 && (
                        <Button variant="link" size="sm" className="w-full">
                          View all {bookmarkedEvents.size} bookmarks
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-3xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-card border flex items-center justify-center hover:bg-accent transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Event Image */}
              <div className="relative h-64 bg-gradient-to-br from-primary/10 to-secondary/10">
                <img
                  src={getEventImageUrl(selectedEvent)}
                  alt={eventsApiService.getEventImage(selectedEvent).alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = eventsApiService.getPlaceholderImage();
                    console.log('Modal image failed to load, using placeholder');
                  }}
                  onLoad={() => console.log('Modal image loaded successfully')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>

              {/* Event Content */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <Badge 
                      className="mb-3"
                      style={{ 
                        backgroundColor: `${selectedEvent.event_type?.color || '#3b82f6'}20`,
                        color: selectedEvent.event_type?.color || '#3b82f6'
                      }}
                    >
                      {selectedEvent.event_type?.name}
                    </Badge>
                    <h2 className="text-3xl font-bold text-foreground mb-2">{selectedEvent.title}</h2>
                    <p className="text-lg text-muted-foreground">{selectedEvent.short_description}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleBookmark(selectedEvent.id)}
                    >
                      {bookmarkedEvents.has(selectedEvent.id) ? (
                        <Bookmark className="w-5 h-5 fill-primary text-primary" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="space-y-2 p-4 rounded-xl bg-card border">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="w-5 h-5" />
                      <span className="font-medium">Date</span>
                    </div>
                    <div className="text-lg font-semibold">
                      {DateUtils.format(DateUtils.parseISO(selectedEvent.start_date), 'EEEE, MMMM d, yyyy')}
                    </div>
                  </div>
                  
                  <div className="space-y-2 p-4 rounded-xl bg-card border">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">Time</span>
                    </div>
                    <div className="text-lg font-semibold">{selectedEvent.formatted_time}</div>
                    <div className="text-sm text-muted-foreground">Duration: {selectedEvent.duration}</div>
                  </div>
                  
                  <div className="space-y-2 p-4 rounded-xl bg-card border">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-5 h-5" />
                      <span className="font-medium">Location</span>
                    </div>
                    <div className="text-lg font-semibold">{selectedEvent.location}</div>
                    {selectedEvent.venue && (
                      <div className="text-sm text-muted-foreground">{selectedEvent.venue}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2 p-4 rounded-xl bg-card border">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-5 h-5" />
                      <span className="font-medium">Seats</span>
                    </div>
                    <div className="text-lg font-semibold">
                      {selectedEvent.available_seats} of {selectedEvent.total_seats}
                    </div>
                    <div className="w-full bg-secondary h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${selectedEvent.registration_percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-3">About This Event</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{selectedEvent.description}</p>
                </div>

                {/* Speaker Info - Fixed with avatar */}
                {selectedEvent.speaker && (
                  <div className="mb-8 p-6 bg-card border rounded-xl">
                    <h3 className="text-xl font-semibold mb-4">Speaker</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                        {getSpeakerAvatarUrl(selectedEvent.speaker) ? (
                          <img
                            src={getSpeakerAvatarUrl(selectedEvent.speaker)!}
                            alt={selectedEvent.speaker.full_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to initials if image fails to load
                              const target = e.currentTarget;
                              const parent = target.parentElement;
                              if (parent) {
                                target.style.display = 'none';
                                const initials = selectedEvent.speaker!.full_name
                                  .split(' ')
                                  .map(n => n[0])
                                  .join('')
                                  .toUpperCase()
                                  .slice(0, 2);
                                parent.innerHTML = `
                                  <div class="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-semibold text-lg">
                                    ${initials}
                                  </div>
                                `;
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-semibold text-lg">
                            {selectedEvent.speaker.full_name
                              .split(' ')
                              .map(n => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{selectedEvent.speaker.full_name}</h4>
                        <p className="text-muted-foreground">{selectedEvent.speaker.title}</p>
                        {selectedEvent.speaker.company && (
                          <p className="text-sm text-muted-foreground">{selectedEvent.speaker.company}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedEvent.tags_list && selectedEvent.tags_list.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.tags_list.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          <Hash className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={() => handleRegister(selectedEvent)}
                    disabled={selectedEvent.is_registered}
                  >
                    {selectedEvent.is_registered ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Already Registered
                      </>
                    ) : (
                      <>
                        <Ticket className="w-5 h-5 mr-2" />
                        Register Now
                      </>
                    )}
                  </Button>
                  
                  <Button size="lg" variant="outline" className="flex-1">
                    <CalendarDays className="w-5 h-5 mr-2" />
                    Add to Calendar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Registration Form Modal */}
      <AnimatePresence>
        {showRegistrationForm && eventToRegister && (
          <RegistrationForm
            event={eventToRegister}
            onRegister={handleFormRegistration}
            onClose={() => {
              setShowRegistrationForm(false);
              setEventToRegister(null);
            }}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Events;