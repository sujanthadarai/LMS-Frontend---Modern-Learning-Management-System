import { useMemo } from 'react';
import { 
  useGetCoursesQuery, 
  useLazyGetCoursesQuery,
  useGetCourseBySlugQuery,
  useGetCategoriesQuery,
  type FilterParams,
  type CourseList,
  type Category 
} from '@/store/api/courseApi';

export const useCourses = (params: FilterParams = {}) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetCoursesQuery(params, {
    refetchOnMountOrArgChange: true,
  });

  const [fetchCourses] = useLazyGetCoursesQuery();

  const courses = useMemo(() => data?.results || [], [data?.results]);
  const totalCount = useMemo(() => data?.count || 0, [data?.count]);
  const totalPages = useMemo(() => {
    if (!data?.count || !params.page_size) return 0;
    return Math.ceil(data.count / (params.page_size || 12));
  }, [data?.count, params.page_size]);

  return {
    courses,
    totalCount,
    totalPages,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
    fetchCourses,
    pagination: {
      next: data?.next,
      previous: data?.previous,
      currentPage: params.page || 1,
    },
  };
};

export const useAllCategories = () => {
  const { data: categories = [], isLoading, error } = useGetCategoriesQuery();
  
  // Add "All" category at the beginning
  const allCategories = useMemo(() => {
    const allCategory: Category = {
      id: 0,
      name: 'All',
      slug: 'all',
      description: 'All courses',
      icon: '',
      course_count: 0
    };
    return [allCategory, ...categories];
  }, [categories]);

  return { 
    categories: allCategories, 
    isLoading, 
    error 
  };
};

export const useCourse = (slug: string) => {
  const { data: course, isLoading, isError, error, refetch } = useGetCourseBySlugQuery(slug);
  
  const isEnrolled = useMemo(() => course?.is_enrolled || false, [course?.is_enrolled]);
  const enrolledCount = useMemo(() => course?.enrolled_count || 0, [course?.enrolled_count]);
  
  return {
    course,
    isLoading,
    isError,
    error,
    refetch,
    isEnrolled,
    enrolledCount,
  };
};