// src/hooks/useHeroData.ts
import { useState, useEffect, useCallback } from 'react';
import { courseService, type Course } from '../services/courseService';

export interface HeroStats {
  total_students: number;
  total_courses: number;
  placement_rate: string;
  salary_hike: string;
}

export const useHeroCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await courseService.getHeroCourses(4);
        setCourses(data);
        setError(null);
      } catch (err) {
        setError('Failed to load courses');
        console.error('Hero courses error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading, error };
};

export const useHeroStats = () => {
  const [stats, setStats] = useState<HeroStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await courseService.getHeroStats();
        if (data) {
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
};

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitBooking = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await courseService.submitConsultation(data);
      setSuccess(true);
      return { success: true };
    } catch (err: any) {
      const message = err.message || 'Failed to submit booking';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const submitCounselorContact = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await courseService.submitCounselorContact(data);
      setSuccess(true);
      return { success: true };
    } catch (err: any) {
      const message = err.message || 'Failed to submit contact';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    loading,
    error,
    success,
    submitBooking,
    submitCounselorContact,
    reset
  };
};