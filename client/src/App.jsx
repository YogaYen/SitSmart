import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import WizardPage from './pages/WizardPage';
import MicroBreakModal from './components/MicroBreakModal';
import DemoContactModal from './components/DemoContactModal';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';
import { getSavedUser, logoutUser, fetchCurrentUser } from './services/api';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [isMuted, setIsMuted] = useState(false);
  const [currentScore, setCurrentScore] = useState(95);
  const [isTracking, setIsTracking] = useState(false);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getSavedUser());

  // Verify and sync stored session with server on boot
  useEffect(() => {
    async function syncSession() {
      const user = await fetchCurrentUser();
      if (user) setCurrentUser(user);
    }
    syncSession();
  }, []);

  // Synchronize hash routing if user enters specific URL hash or clicks navigation tabs
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (
        hash === '#dashboard' ||
        hash === '#live-tracker' ||
        hash === '#interview-guide' ||
        hash === '#interview-prep' ||
        hash === '#improvement-tracker' ||
        hash === '#analytics-dashboard' ||
        hash === '#analytics' ||
        hash === '#improvement'
      ) {
        setActivePage('dashboard');
        // If targeting a specific section on dashboard, scroll to it smoothly
        if (hash !== '#dashboard') {
          setTimeout(() => {
            const targetId = hash.startsWith('#') ? hash.slice(1) : hash;
            const el = document.getElementById(targetId);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      } else if (hash === '#wizard' || hash === '#assessment-wizard') {
        setActivePage('wizard');
      } else if (hash === '#landing' || hash === '' || hash === '#home') {
        setActivePage('landing');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page, hash = '') => {
    setActivePage(page);
    if (hash) {
      window.location.hash = hash;
      setTimeout(() => {
        const targetId = hash.startsWith('#') ? hash.slice(1) : hash;
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.location.hash = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setIsProfileModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Top Fixed Navigation Header */}
      <Navbar
        activePage={activePage}
        setActivePage={(page) => handleNavigate(page)}
        onNavigate={handleNavigate}
        onOpenBreak={() => setIsBreakModalOpen(true)}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        currentScore={currentScore}
        isTracking={isTracking}
        onOpenDemo={() => setIsDemoModalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Multi-Page Body */}
      <main className="flex-1">
        {activePage === 'landing' && (
          <LandingPage
            onNavigateToDashboard={() => {
              setActivePage('dashboard');
              window.location.hash = 'dashboard';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToWizard={() => {
              setActivePage('wizard');
              window.location.hash = 'wizard';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenBreak={() => setIsBreakModalOpen(true)}
            onOpenDemo={() => setIsDemoModalOpen(true)}
          />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
            onOpenBreak={() => setIsBreakModalOpen(true)}
            onOpenDemo={() => setIsDemoModalOpen(true)}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onScoreChange={setCurrentScore}
            onTrackingChange={setIsTracking}
          />
        )}

        {activePage === 'wizard' && (
          <WizardPage
            currentUser={currentUser}
            onNavigateToDashboard={() => {
              setActivePage('dashboard');
              window.location.hash = 'dashboard';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Interactive Micro-Break / Stretch Player Modal */}
      <MicroBreakModal
        isOpen={isBreakModalOpen}
        onClose={() => setIsBreakModalOpen(false)}
      />

      {/* Corporate Demo Lead Capture Modal */}
      <DemoContactModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

      {/* Authentication Modal (Sign In / Register / 1-Click Demo) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />

      {/* User Profile & Posture History Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
        onLogout={handleLogout}
      />
    </div>
  );
}
