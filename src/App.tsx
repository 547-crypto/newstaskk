import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Task, UserProfile } from './types';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PublicContent from './components/PublicContent';
import AboutPrivacy from './components/AboutPrivacy';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import TaskExecution from './components/TaskExecution';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentView, setCurrentView] = useState<'public' | 'auth' | 'dashboard' | 'admin' | 'task_execution'>('public');
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Auth & Profile Listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Real-time listener for the user's Firestore profile
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        const unsubscribeProfile = onSnapshot(userRef, async (userDoc) => {
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            const emailLower = data.email?.toLowerCase();
            const shouldBeAdmin = emailLower === 'aryankumarjha000@gmail.com' || emailLower === 'aryankumarjha0809@yahoo.com';
            if (shouldBeAdmin && data.role !== 'admin') {
              await setDoc(userRef, { ...data, role: 'admin' }, { merge: true });
              setCurrentUserProfile({ ...data, role: 'admin' });
            } else {
              setCurrentUserProfile(data);
            }
          } else {
            // Profile doesn't exist yet, wait or create it safely
            const emailLower = firebaseUser.email?.toLowerCase();
            const isAdmin = emailLower === 'aryankumarjha000@gmail.com' || emailLower === 'aryankumarjha0809@yahoo.com';
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              walletBalance: 0,
              totalEarned: 0,
              role: isAdmin ? 'admin' : 'user',
              createdAt: Date.now()
            };
            await setDoc(userRef, newProfile);
            setCurrentUserProfile(newProfile);
          }
          setAuthLoading(false);
        });

        return () => unsubscribeProfile();
      } else {
        setCurrentUserProfile(null);
        setAuthLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setCurrentView('public');
    setActiveTab('home');
  };

  const handleContinueFlow = () => {
    // If user is logged in, navigate to dashboard, otherwise open Auth flow
    if (currentUserProfile) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('auth');
    }
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setCurrentView('public');
  };

  const isPublicPageWithNavbar = () => {
    return currentView === 'public' || currentView === 'dashboard' || currentView === 'admin';
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black select-none">
      {/* Top Navbar */}
      {isPublicPageWithNavbar() && (
        <Navbar
          activeTab={activeTab}
          onNavigate={handleNavigate}
          currentUser={currentUserProfile}
          onLogout={handleLogout}
          onOpenDashboard={() => setCurrentView('dashboard')}
          onOpenAuth={() => setCurrentView('auth')}
        />
      )}

      {/* Main Container */}
      <main className="flex-grow">
        {authLoading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-pulse font-mono text-xs text-gray-400">Loading Network Session...</div>
          </div>
        ) : (
          <>
            {/* 1. Public Content View */}
            {currentView === 'public' && (
              <>
                {['about', 'privacy', 'terms', 'contact', 'disclaimer'].includes(activeTab) ? (
                  <AboutPrivacy
                    pageType={activeTab as any}
                    onContinue={handleContinueFlow}
                  />
                ) : (
                  <PublicContent
                    activeTab={activeTab}
                    onNavigate={handleNavigate}
                    onOpenDashboard={() => setCurrentView('dashboard')}
                    onOpenAuth={() => setCurrentView('auth')}
                    isLoggedIn={currentUserProfile !== null}
                  />
                )}
              </>
            )}

            {/* 2. Authentication View */}
            {currentView === 'auth' && (
              <AuthPage
                onSuccess={() => {
                  setCurrentView('dashboard');
                }}
                onBack={() => setCurrentView('public')}
              />
            )}

            {/* 3. User Dashboard View */}
            {currentView === 'dashboard' && currentUserProfile && (
              <Dashboard
                currentUser={currentUserProfile}
                onLogout={handleLogout}
                onStartTask={(task) => {
                  setActiveTask(task);
                  setCurrentView('task_execution');
                }}
                onOpenAdmin={() => setCurrentView('admin')}
              />
            )}

            {/* 4. Active Task execution View */}
            {currentView === 'task_execution' && activeTask && currentUserProfile && (
              <TaskExecution
                task={activeTask}
                currentUser={currentUserProfile}
                onComplete={() => {
                  setActiveTask(null);
                  setCurrentView('dashboard');
                }}
                onCancel={() => {
                  setActiveTask(null);
                  setCurrentView('dashboard');
                }}
              />
            )}

            {/* 5. Admin Backoffice View */}
            {currentView === 'admin' && currentUserProfile?.role === 'admin' && (
              <AdminPanel
                onBack={() => setCurrentView('dashboard')}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      {isPublicPageWithNavbar() && (
        <Footer onNavigate={handleNavigate} />
      )}
    </div>
  );
}
