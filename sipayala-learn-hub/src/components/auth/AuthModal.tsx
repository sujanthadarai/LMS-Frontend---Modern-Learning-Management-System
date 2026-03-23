import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const { isAuthenticated } = useAuth();

  // Close modal when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative">
          {/* Decorative gradient background */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 opacity-90" />
          
          {/* Logo/Icon */}
          <div className="relative pt-8 pb-6 text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="inline-flex p-3 bg-white/20 backdrop-blur-xl rounded-2xl"
            >
              <img
                src="/images/logo.png"
                alt="Sipalaya"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>';
                }}
              />
            </motion.div>
            <DialogTitle className="text-2xl font-bold text-white mt-4">
              Welcome to Sipalaya
            </DialogTitle>
            <DialogDescription className="text-white/90">
              Unlock your potential with expert-led courses
            </DialogDescription>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'login' | 'register')}
            className="relative px-6 pb-6"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              <TabsTrigger
                value="login"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-lg transition-all"
              >
                Log In
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-lg transition-all"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="login" className="mt-0">
                  <LoginForm onSuccess={onClose} onSwitchToRegister={() => setActiveTab('register')} />
                </TabsContent>

                <TabsContent value="register" className="mt-0">
                  <RegisterForm onSuccess={onClose} onSwitchToLogin={() => setActiveTab('login')} />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};