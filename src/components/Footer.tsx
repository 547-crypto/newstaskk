import React from 'react';
import { Share2, Rss } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="w-full border-t border-gray-100 bg-white py-6 md:py-8 mt-12">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 md:px-10 max-w-[1120px] mx-auto gap-4 text-[10px] text-gray-400 uppercase tracking-widest text-center md:text-left">
        <div>
          © {new Date().getFullYear()} newstaskk Media Group
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 font-semibold">
          <button onClick={() => onNavigate('about')} className="hover:text-black cursor-pointer transition-colors">About</button>
          <span className="text-gray-200 hidden md:inline">|</span>
          <button onClick={() => onNavigate('privacy')} className="hover:text-black cursor-pointer transition-colors">Privacy</button>
          <span className="text-gray-200 hidden md:inline">|</span>
          <button onClick={() => onNavigate('terms')} className="hover:text-black cursor-pointer transition-colors">Terms</button>
          <span className="text-gray-200 hidden md:inline">|</span>
          <button onClick={() => onNavigate('contact')} className="hover:text-black cursor-pointer transition-colors">Contact</button>
          <span className="text-gray-200 hidden md:inline">|</span>
          <button onClick={() => onNavigate('disclaimer')} className="hover:text-black cursor-pointer transition-colors">Disclaimer</button>
        </div>
        <div className="flex items-center gap-4">
          <span>Version 1.0.4</span>
          <span className="text-green-500 font-bold">● Live</span>
        </div>
      </div>
    </footer>
  );
}
