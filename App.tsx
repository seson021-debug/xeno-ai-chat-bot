import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import OnboardingModal from './components/OnboardingModal';
import LoadingSpinner from './components/LoadingSpinner';
import { AuthContext } from './contexts/AuthContext';
import { auth, getUserProfile, createUserProfile } from './services/firebaseService';
import type { UserProfile } from './types';

type AppState = 'loading' | 'loggedout' | 'onboarding' | 'loggedin';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(user);
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setUserProfile(profile);
          setAppState('loggedin');
        } else {
          setAppState('onboarding');
        }
      } else {
        setAuthUser(null);
        setUserProfile(null);
        setAppState('loggedout');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOnboardingComplete = useCallback(async (username: string) => {
    if (!authUser) return;
    try {
      const newProfile = await createUserProfile(authUser, username);
      setUserProfile(newProfile);
      setAppState('loggedin');
    } catch (error) {
      console.error("Failed to create user profile:", error);
      // Handle error, maybe show a message
    }
  }, [authUser]);

  const logout = useCallback(async () => {
    try {
      await auth.signOut();
      // The onAuthStateChanged listener will handle the state transition
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, []);

  const authContextValue = useMemo(() => ({
    user: userProfile,
    logout,
  }), [userProfile, logout]);

  const renderContent = () => {
    switch (appState) {
      case 'loggedin':
        return <HomeScreen />;
      case 'onboarding':
        return <OnboardingModal onComplete={handleOnboardingComplete} />;
      case 'loggedout':
        return <LoginScreen />;
      case 'loading':
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size="lg" />
          </div>
        );
    }
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="h-screen w-screen bg-white font-sans text-slate-800 antialiased">
        {renderContent()}
      </div>
    </AuthContext.Provider>
  );
};

export default App;
