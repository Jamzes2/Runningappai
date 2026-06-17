"use client";

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (pass: string) => {
    return pass.length >= 8;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 1000);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An unexpected error occurred during login. Please check your connection and configuration.');
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setSuccessMessage('Sign up successful! Check your email for the confirmation link.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setIsSignUp(false), 2000);
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'An unexpected error occurred during sign up. Please check your connection and configuration.');
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setSuccessMessage(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen w-full bg-brandBg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/8 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-[500px] z-10">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Logo width={220} height={50} color="var(--accent)" />
        </div>

        {/* Main Card */}
        <div className="glass-panel p-8 md:p-12 shadow-2xl">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {isSignUp ? 'JOIN RUNSYNERGY' : 'ATHLETE LOGIN'}
            </h1>
            <p className="text-textSecondary text-sm md:text-base mt-2">
              {isSignUp 
                ? 'Create your elite athlete account to unlock premium insights.'
                : 'Enter your credentials to access your performance dashboard.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="flex flex-col gap-6">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[0.7rem] font-black text-accent tracking-widest uppercase">EMAIL ADDRESS</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-accent transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  placeholder="athlete@elite.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-textMuted focus:outline-none focus:border-accent focus:bg-white/10 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[0.7rem] font-black text-accent tracking-widest uppercase">PASSWORD</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-accent transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-textMuted focus:outline-none focus:border-accent focus:bg-white/10 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted hover:text-accent transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password && !validatePassword(password) && (
                <p className="text-xs text-textSecondary">Minimum 8 characters required</p>
              )}
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {isSignUp && (
              <div className="flex flex-col gap-2">
                <label className="text-[0.7rem] font-black text-accent tracking-widest uppercase">CONFIRM PASSWORD</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-accent transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-14 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-textMuted focus:outline-none focus:border-accent focus:bg-white/10 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted hover:text-accent transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password && confirmPassword && password === confirmPassword && (
                  <div className="flex items-center gap-2 text-xs text-accent">
                    <Check size={14} />
                    <span>Passwords match</span>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-red-500"></div>
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg flex items-center gap-3">
                <Check size={18} className="text-accent" />
                <p className="text-accent text-sm font-medium">{successMessage}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full px-6 py-4 bg-accent text-brandBg font-black uppercase tracking-wider rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm md:text-base"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-brandBg border-t-transparent rounded-full animate-spin"></div>
                    {isSignUp ? 'CREATING ACCOUNT...' : 'AUTHENTICATING...'}
                  </>
                ) : (
                  <>
                    <span>{isSignUp ? 'CREATE ACCOUNT' : 'LOGIN'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

            {/* Toggle Mode */}
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-textSecondary text-sm">
                {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}
                <button 
                  type="button"
                  onClick={toggleMode}
                  className="ml-2 text-accent font-black hover:underline transition-all"
                >
                  {isSignUp ? 'LOGIN' : 'SIGN UP'}
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-textMuted text-xs">
          <p>Powered by RunSynergy AI • Premium Elite Athlete Analytics</p>
        </div>
      </div>
    </div>
  );
}
