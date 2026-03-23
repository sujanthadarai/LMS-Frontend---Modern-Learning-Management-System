import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CourseList } from '../api/courseApi';

interface CourseState {
  selectedCategory: string | null;
  selectedLevel: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: string;
  searchQuery: string;
  featuredCourses: CourseList[];
  popularCourses: CourseList[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  selectedCategory: null,
  selectedLevel: null,
  minPrice: null,
  maxPrice: null,
  sortBy: '-created_at',
  searchQuery: '',
  featuredCourses: [],
  popularCourses: [],
  isLoading: false,
  error: null,
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedLevel: (state, action: PayloadAction<string | null>) => {
      state.selectedLevel = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<{ min: number | null; max: number | null }>) => {
      state.minPrice = action.payload.min;
      state.maxPrice = action.payload.max;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFeaturedCourses: (state, action: PayloadAction<CourseList[]>) => {
      state.featuredCourses = action.payload;
    },
    setPopularCourses: (state, action: PayloadAction<CourseList[]>) => {
      state.popularCourses = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetFilters: (state) => {
      state.selectedCategory = null;
      state.selectedLevel = null;
      state.minPrice = null;
      state.maxPrice = null;
      state.sortBy = '-created_at';
      state.searchQuery = '';
    },
  },
});

export const {
  setSelectedCategory,
  setSelectedLevel,
  setPriceRange,
  setSortBy,
  setSearchQuery,
  setFeaturedCourses,
  setPopularCourses,
  setLoading,
  setError,
  resetFilters,
} = courseSlice.actions;

export default courseSlice.reducer;