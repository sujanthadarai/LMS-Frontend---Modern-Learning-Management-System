import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthForm } from '@/hooks/useAuthForm';
import { SocialLoginButtons } from './SocialLoginButtons';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

interface RegisterFormValues {
  email: string;
  full_name: string;
  password: string;
  confirmPassword: string;
  phone_number: string;
  gender: string;
  acceptTerms: boolean;
  receiveUpdates: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const { register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registrationStep, setRegistrationStep] = useState(1);

  const validationRules = {
    full_name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s]*$/,
      custom: (value: string) =>
        value.trim().split(' ').length < 2 ? 'Please enter your full name' : undefined,
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      custom: (value: string) =>
        !value.includes('@') ? 'Please enter a valid email address' : undefined,
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      custom: (value: string) => {
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])/.test(value))
          return 'Password must contain at least one lowercase letter';
        if (!/(?=.*[A-Z])/.test(value))
          return 'Password must contain at least one uppercase letter';
        if (!/(?=.*\d)/.test(value))
          return 'Password must contain at least one number';
        if (!/(?=.*[@$!%*?&])/.test(value))
          return 'Password must contain at least one special character';
        return undefined;
      },
    },
    confirmPassword: {
      required: true,
      custom: (value: string) => {
        const password = (document.getElementById('password') as HTMLInputElement)?.value;
        return value !== password ? 'Passwords do not match' : undefined;
      },
    },
    phone_number: {
      pattern: /^[0-9+\-\s()]*$/,
      custom: (value: string) =>
        value && value.replace(/\D/g, '').length < 10
          ? 'Please enter a valid phone number'
          : undefined,
    },
    acceptTerms: {
      required: true,
      custom: (value: boolean) => (!value ? 'You must accept the terms' : undefined),
    },
  };

  const { values, errors, touched, handleChange, handleBlur, validateForm, setValues } =
    useAuthForm<RegisterFormValues>(
      {
        email: '',
        full_name: '',
        password: '',
        confirmPassword: '',
        phone_number: '',
        gender: '',
        acceptTerms: false,
        receiveUpdates: false,
      },
      validationRules
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    if (!validateForm()) {
      setRegistrationStep(1);
      return;
    }

    try {
      await register({
        email: values.email,
        full_name: values.full_name,
        password: values.password,
        phone_number: values.phone_number || undefined,
        gender: values.gender || undefined,
      });
      onSuccess();
    } catch (error) {
      setRegisterError(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  const nextStep = () => {
    if (registrationStep === 1) {
      const step1Valid =
        !errors.full_name &&
        !errors.email &&
        values.full_name &&
        values.email;
      
      if (step1Valid) {
        setRegistrationStep(2);
      } else {
        // Touch all fields to show errors
        handleBlur({ target: { name: 'full_name' } } as any);
        handleBlur({ target: { name: 'email' } } as any);
      }
    }
  };

  const prevStep = () => {
    setRegistrationStep(1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                registrationStep >= step
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}
            >
              {registrationStep > step ? <CheckCircle className="w-4 h-4" /> : step}
            </div>
            {step === 1 && (
              <div
                className={`flex-1 h-1 mx-2 rounded ${
                  registrationStep > 1
                    ? 'bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {registerError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{registerError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 1: Basic Information */}
      {registrationStep === 1 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="space-y-4"
        >
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-sm font-medium">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="full_name"
                name="full_name"
                value={values.full_name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="John Doe"
                className={`pl-10 h-11 ${
                  touched.full_name && errors.full_name
                    ? 'border-red-500 focus:ring-red-500'
                    : ''
                }`}
                disabled={isLoading}
              />
            </div>
            {touched.full_name && errors.full_name && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" />
                {errors.full_name}
              </motion.p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address <span className="text-red-500">*</span>
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

          <Button
            type="button"
            onClick={nextStep}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg"
          >
            Continue
          </Button>
        </motion.div>
      )}

      {/* Step 2: Security & Additional Info */}
      {registrationStep === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Create a strong password"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <PasswordStrengthMeter password={values.password} />
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Confirm your password"
                className={`pl-10 pr-10 h-11 ${
                  touched.confirmPassword && errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-500'
                    : ''
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" />
                {errors.confirmPassword}
              </motion.p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone_number" className="text-sm font-medium">
              Phone Number (Optional)
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="phone_number"
                name="phone_number"
                value={values.phone_number}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="+1 234 567 8900"
                className={`pl-10 h-11 ${
                  touched.phone_number && errors.phone_number
                    ? 'border-red-500 focus:ring-red-500'
                    : ''
                }`}
                disabled={isLoading}
              />
            </div>
            {touched.phone_number && errors.phone_number && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" />
                {errors.phone_number}
              </motion.p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-medium">
              Gender (Optional)
            </Label>
            <Select
              value={values.gender}
              onValueChange={(value) =>
                setValues({ ...values, gender: value })
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="acceptTerms"
                name="acceptTerms"
                checked={values.acceptTerms}
                onCheckedChange={(checked) =>
                  setValues({ ...values, acceptTerms: checked as boolean })
                }
              />
              <Label
                htmlFor="acceptTerms"
                className="text-sm font-normal leading-tight cursor-pointer"
              >
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="receiveUpdates"
                name="receiveUpdates"
                checked={values.receiveUpdates}
                onCheckedChange={(checked) =>
                  setValues({ ...values, receiveUpdates: checked as boolean })
                }
              />
              <Label
                htmlFor="receiveUpdates"
                className="text-sm font-normal leading-tight cursor-pointer"
              >
                Send me updates about new courses, features, and special offers
              </Label>
            </div>
          </div>

          {touched.acceptTerms && errors.acceptTerms && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" />
              {errors.acceptTerms}
            </motion.p>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="flex-1 h-11"
              disabled={isLoading}
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !values.acceptTerms}
              className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Social Registration */}
      {registrationStep === 1 && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                Or sign up with
              </span>
            </div>
          </div>

          <SocialLoginButtons isLoading={isLoading} />
        </>
      )}

      {/* Login Link */}
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium hover:underline transition-all"
        >
          Log in
        </button>
      </p>
    </form>
  );
};