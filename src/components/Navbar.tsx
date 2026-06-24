import React, { useState } from 'react';
import { MoreVertical, Search, Wallet, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onOpenDashboard: () => void;
  onOpenAuth: () => void;
}

export default function Navbar({
  activeTab,
  onNavigate,
  currentUser,
  onLogout,
  onOpenDashboard,
  onOpenAuth
}: NavbarProps) {
  const [showThreeDot, setShowThreeDot] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { id: 'news', label: 'News' },
    { id: 'apps', label: 'Apps' },
    { id: 'websites', label: 'Websites' },
    { id: 'tech', label: 'Tech' },
    { id: 'gaming', label: 'Gaming' },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="flex justify-between items-center w-full px-4 md:px-10 max-w-[1120px] mx-auto h-16">
        {/* Brand Name */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => onNavigate('home')} 
            className="font-bold text-2xl text-black tracking-tight hover:opacity-80 transition-opacity cursor-pointer"
          >
            newstaskkk
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setShowMobileMenu(false);
                }}
                className={`font-medium text-sm transition-colors cursor-pointer pb-1 border-b ${
                  activeTab === item.id
                    ? 'text-black border-black'
                    : 'text-gray-500 border-transparent hover:text-black'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Action icons & User control */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-50 rounded-full transition-all text-gray-700">
            <Search size={20} />
          </button>

          {/* Wallet / Dashboard entry */}
          {currentUser && (
            <button
              onClick={onOpenDashboard}
              className="p-2 hover:bg-gray-50 rounded-full transition-all text-gray-700 relative group flex items-center gap-1 cursor-pointer"
              title="Dashboard"
            >
              <Wallet size={20} />
              <span className="hidden md:inline font-mono text-xs font-semibold">
                ₹{currentUser.walletBalance.toFixed(2)}
              </span>
            </button>
          )}

          {/* User Profile / Login */}
          {currentUser ? (
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenDashboard}
                className="p-2 hover:bg-gray-50 rounded-full transition-all text-gray-700 flex items-center gap-1 cursor-pointer"
                title="Contributor Dashboard"
              >
                <User size={20} />
                {currentUser.role === 'admin' && (
                  <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </button>
              <button
                onClick={onLogout}
                className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="p-2 hover:bg-gray-50 rounded-full transition-all text-gray-700 cursor-pointer"
              title="Sign In"
            >
              <User size={20} />
            </button>
          )}

          {/* Three-Dot Menu (More options) */}
          <div className="relative">
            <button
              onClick={() => setShowThreeDot(!showThreeDot)}
              className="p-2 hover:bg-gray-50 rounded-full transition-all text-gray-700 cursor-pointer"
            >
              <MoreVertical size={20} />
            </button>
            {showThreeDot && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-sm py-1 z-50 font-medium text-sm text-gray-700">
                <button
                  onClick={() => {
                    onNavigate('about');
                    setShowThreeDot(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  About Us
                </button>
                <button
                  onClick={() => {
                    onNavigate('privacy');
                    setShowThreeDot(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => {
                    onNavigate('terms');
                    setShowThreeDot(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => {
                    onNavigate('contact');
                    setShowThreeDot(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  Contact Us
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 hover:bg-gray-50 rounded-full text-gray-700 cursor-pointer"
          >
            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {showMobileMenu && (
        <div className="md:hidden w-full bg-white border-t border-gray-100 py-3 px-4 flex flex-col gap-3 font-semibold text-sm shadow-sm animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setShowMobileMenu(false);
              }}
              className={`w-full text-left py-2 px-3 rounded-md transition-colors ${
                activeTab === item.id
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
