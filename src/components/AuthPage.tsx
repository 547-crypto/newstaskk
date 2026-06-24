import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { auth, db } from '../firebase';

interface AuthPageProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function AuthPage({ onSuccess, onBack }: AuthPageProps) {
  const [formType, setFormType] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (formType === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess('Logged in successfully!');
        setTimeout(() => onSuccess(), 1000);
      } else if (formType === 'signup') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if user should be admin based on email
        const emailLower = email.toLowerCase();
        const isAdmin = emailLower === 'aryankumarjha000@gmail.com' || emailLower === 'aryankumarjha0809@yahoo.com';

        // Write profile to users collection
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email || email,
          walletBalance: 0,
          totalEarned: 0,
          role: isAdmin ? 'admin' : 'user',
          createdAt: Date.now()
        });

        setSuccess('Account created successfully!');
        setTimeout(() => onSuccess(), 1000);
      } else if (formType === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setSuccess('Password reset link sent to your email.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-8 animate-fade-in font-sans">
      <div className="w-full max-w-[440px]">
        
        {/* Brand identity */}
        <div className="text-center mb-8">
          <button 
            onClick={onBack}
            className="font-bold text-3xl text-black tracking-tight mb-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            newstaskk<span className="text-black">.</span>
          </button>
          <p className="text-gray-400 text-sm font-semibold tracking-wide uppercase">
            {formType === 'login' && 'Editorial Reward Portal Login'}
            {formType === 'signup' && 'Create Contributor Account'}
            {formType === 'forgot' && 'Reset Contributor Password'}
          </p>
        </div>

        {/* Form container card */}
        <div className="bg-white border border-gray-100 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-black text-center mb-6">
            {formType === 'login' && 'Welcome Back'}
            {formType === 'signup' && 'Register'}
            {formType === 'forgot' && 'Forgot Password'}
          </h2>

          {error && (
            <div className="mb-4 bg-red-50 text-red-700 text-xs p-3 rounded font-medium border border-red-100 text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 text-green-700 text-xs p-3 rounded font-medium border border-green-200 text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contributor@newstaskk.com"
                className="w-full h-11 px-4 bg-gray-50/50 border border-gray-100 rounded-md text-sm text-black focus:outline-none focus:border-black transition-colors"
                required
              />
            </div>

            {/* Password Fields */}
            {formType !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Password</label>
                  {formType === 'login' && (
                    <button
                      type="button"
                      onClick={() => setFormType('forgot')}
                      className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-4 pr-10 bg-gray-50/50 border border-gray-100 rounded-md text-sm text-black focus:outline-none focus:border-black transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {formType === 'signup' && (
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 bg-gray-50/50 border border-gray-100 rounded-md text-sm text-black focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-black text-white rounded font-bold text-sm hover:bg-gray-800 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>
                {loading ? 'Processing...' : (
                  formType === 'login' ? 'Sign In' : (formType === 'signup' ? 'Create Account' : 'Reset Password')
                )}
              </span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Switch flow link */}
          <div className="mt-6 text-center border-t border-gray-100 pt-4">
            {formType === 'login' ? (
              <p className="text-xs text-gray-500">
                New to the editorial team?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setFormType('signup');
                    setError('');
                  }}
                  className="font-bold text-black hover:underline cursor-pointer"
                >
                  Join as Contributor
                </button>
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setFormType('login');
                    setError('');
                  }}
                  className="font-bold text-black hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Helper Footer links */}
        <div className="mt-8 flex justify-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <button onClick={() => onBack()} className="hover:text-black">Home</button>
          <span>•</span>
          <button onClick={() => onSuccess()} className="hover:text-black">Guidelines</button>
          <span>•</span>
          <button className="hover:text-black">Support Desk</button>
        </div>
      </div>
    </div>
  );
}
