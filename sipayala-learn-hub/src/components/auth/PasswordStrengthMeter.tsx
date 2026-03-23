import React from 'react';
import { motion } from 'framer-motion';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const calculateStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: 'No password', color: 'bg-gray-200' };

    let score = 0;
    
    // Length check
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    
    // Character variety checks
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if /[0-9]/.test(pwd) score += 1;
    if /[^a-zA-Z0-9]/.test(pwd) score += 1;

    // Strength classification
    if (score <= 2) return { score: 20, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score: 40, label: 'Fair', color: 'bg-orange-500' };
    if (score <= 6) return { score: 60, label: 'Good', color: 'bg-yellow-500' };
    if (score <= 7) return { score: 80, label: 'Strong', color: 'bg-blue-500' };
    return { score: 100, label: 'Very Strong', color: 'bg-green-500' };
  };

  const strength = calculateStrength(password);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">Password strength:</span>
        <span className={`font-medium ${
          strength.label === 'Weak' ? 'text-red-500' :
          strength.label === 'Fair' ? 'text-orange-500' :
          strength.label === 'Good' ? 'text-yellow-500' :
          strength.label === 'Strong' ? 'text-blue-500' :
          'text-green-500'
        }`}>
          {strength.label}
        </span>
      </div>
      
      <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${strength.score}%` }}
          transition={{ duration: 0.3 }}
          className={`h-full ${strength.color}`}
        />
      </div>

      <ul className="grid grid-cols-2 gap-1 text-xs text-gray-500">
        <li className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
          Min 8 characters
        </li>
        <li className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
          Lowercase letter
        </li>
        <li className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
          Uppercase letter
        </li>
        <li className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
          Number
        </li>
        <li className="flex items-center gap-1 col-span-2">
          <span className={`w-1.5 h-1.5 rounded-full ${/[^a-zA-Z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
          Special character (@$!%*?&)
        </li>
      </ul>
    </div>
  );
};