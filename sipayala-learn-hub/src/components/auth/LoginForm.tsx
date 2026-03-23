import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthForm } from '@/hooks/useAuthForm';
import { SocialLoginButtons } from './SocialLoginButtons';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const validationRules = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      custom: (value: string) => 
        !value.includes('@') ? 'Please enter a valid email address' : undefined,
    },
    password: {
      required: true,
      minLength: 6,
      custom: (value: string) => 
        value.length < 6 ? 'Password must be at least 6 characters' : undefined,
    },
  };

  const { values, errors, touched, handleChange, handleBlur, validateForm } =
    useAuthForm<LoginFormValues>(
      {
        email: '',
        password: '',
        rememberMe: false,
      },
      validationRules
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await login(values.email, values.password);
      onSuccess();
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error Alert */}
      <AnimatePresence>
        {loginError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{loginError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@example.com"
            className={`pl-10 h-11 ${
              touched.email && errors.email
                ? 'border-red-500 focus:ring-red-500'
                : ''
            }`}
            disabled={isLoading}
          />
        </div>
        {touched.email && errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {errors.email}
          </motion.p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <Link
            to="/forgot-password"
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="••••••••"
            className={`pl-10 pr-10 h-11 ${
              touched.password && errors.password
                ? 'border-red-500 focus:ring-red-500'
                : ''
            }`}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {touched.password && errors.password && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {errors.password}
          </motion.p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="rememberMe"
          name="rememberMe"
          checked={values.rememberMe}
          onCheckedChange={(checked) =>
            handleChange({
              target: { name: 'rememberMe', value: checked },
            } as any)
          }
        />
        <Label
          htmlFor="rememberMe"
          className="text-sm font-normal cursor-pointer"
        >
          Remember me for 30 days
        </Label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all duration-200 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Logging in...
          </>
        ) : (
          'Log in to your account'
        )}
      </Button>

      {/* Social Login */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      <SocialLoginButtons isLoading={isLoading} />

      {/* Sign Up Link */}
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium hover:underline transition-all"
        >
          Create free account
        </button>
      </p>
    </form>
  );
};