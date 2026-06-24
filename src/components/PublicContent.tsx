import React, { useState } from 'react';
import { ArrowRight, Download, ExternalLink, Mail, Clock, Layers, Globe, Terminal, Palette, ChevronLeft } from 'lucide-react';
import { ARTICLES, TRENDING_ARTICLES, RECOMMENDATIONS } from '../data';
import { Article, AppRecommendation } from '../types';

interface PublicContentProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenDashboard: () => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
}

export default function PublicContent({
  activeTab,
  onNavigate,
  onOpenDashboard,
  onOpenAuth,
  isLoggedIn
}: PublicContentProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Filter articles based on active tab
  const getFilteredArticles = () => {
    if (activeTab === 'home') return ARTICLES;
    if (activeTab === 'news') return ARTICLES;
    if (activeTab === 'tech') return ARTICLES.filter(a => a.category.toLowerCase().includes('tech') || a.category.toLowerCase().includes('technology'));
    if (activeTab === 'gaming') return ARTICLES.filter(a => a.category.toLowerCase().includes('gaming'));
    return ARTICLES;
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Layers': return <Layers className="text-black" size={24} />;
      case 'Globe': return <Globe className="text-black" size={24} />;
      case 'Terminal': return <Terminal className="text-black" size={24} />;
      case 'Palette': return <Palette className="text-black" size={24} />;
      default: return <Layers className="text-black" size={24} />;
    }
  };

  // If viewing a specific article
  if (selectedArticle) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-8 animate-fade-in">
        <button
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-1 text-gray-400 hover:text-black font-semibold text-sm mb-6 transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} /> Back to stories
        </button>

        <article className="article-detail">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm">
              {selectedArticle.category}
            </span>
            <span className="text-gray-300 text-xs">•</span>
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{selectedArticle.readTime}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight leading-tight mb-6">
            {selectedArticle.title}
          </h1>

          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <img
              src={selectedArticle.authorImage}
              alt={selectedArticle.author}
              className="w-12 h-12 rounded-full object-cover filter grayscale"
            />
            <div>
              <p className="font-bold text-black text-sm">{selectedArticle.author}</p>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">{selectedArticle.publishedTime} • Written for newstaskk</p>
            </div>
          </div>

          <div className="aspect-[16/9] w-full overflow-hidden rounded-lg border border-gray-100 bg-gray-50 mb-8">
            <img
              src={selectedArticle.imageUrl}
              alt={selectedArticle.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap font-sans space-y-6">
            {selectedArticle.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>

        {/* Editorial Promotion Card */}
        <div className="mt-12 p-6 bg-gray-50/50 rounded-lg border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h4 className="font-bold text-black text-lg">Love this content? Join our Contributor team!</h4>
            <p className="text-gray-500 text-sm mt-1">Verify news and technology claims to earn editorial reward payouts.</p>
          </div>
          <button
            onClick={isLoggedIn ? onOpenDashboard : onOpenAuth}
            className="bg-black text-white px-5 py-2.5 rounded-md text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
          >
            Become a Contributor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1120px] mx-auto px-4 md:px-10 py-6">
      {/* Category Tabs for Mobile/Submenu */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 pb-1">
        {['home', 'news', 'apps', 'websites', 'tech', 'gaming'].map((tab) => (
          <button
            key={tab}
            onClick={() => onNavigate(tab)}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 border ${
              activeTab === tab
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-500 border-gray-100 hover:text-black hover:bg-gray-50'
            }`}
          >
            {tab === 'home' ? 'All Stories' : tab}
          </button>
        ))}
      </div>

      {/* Conditionally render Tab Layouts */}
      {activeTab === 'apps' || activeTab === 'websites' ? (
        <section className="mb-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black tracking-tight uppercase">
              Best {activeTab === 'apps' ? 'Apps' : 'Websites'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">Curated productivity tools and digital experiences from around the web.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RECOMMENDATIONS.filter(item => item.type.toLowerCase() === (activeTab === 'apps' ? 'app' : 'website')).map((item) => (
              <div key={item.id} className="border border-gray-100 p-6 rounded-lg flex flex-col hover:border-gray-200 transition-all bg-white">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center mb-4">
                  {getIconComponent(item.icon)}
                </div>
                <h4 className="font-bold text-black text-base mb-1">{item.name}</h4>
                <p className="text-gray-500 text-xs leading-relaxed mb-6 flex-grow">{item.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="bg-gray-50 border border-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{item.type}</span>
                  <a href={item.url} className="text-gray-400 hover:text-black transition-colors">
                    {item.type === 'App' ? <Download size={18} /> : <ExternalLink size={18} />}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* Standard News Feed layout (Bento / Grid) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Feed Column */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Bento Box: Featured Article */}
            {getFilteredArticles().length > 0 && (
              <div 
                onClick={() => setSelectedArticle(getFilteredArticles()[0])}
                className="group cursor-pointer flex flex-col border-b border-gray-100 pb-8"
              >
                <div className="relative overflow-hidden rounded-lg aspect-[16/9] mb-4 bg-gray-50 border border-gray-100">
                  <img
                    src={getFilteredArticles()[0].imageUrl}
                    alt={getFilteredArticles()[0].title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm">
                      {getFilteredArticles()[0].category}
                    </span>
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight mb-2 group-hover:underline leading-tight">
                  {getFilteredArticles()[0].title}
                </h1>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 line-clamp-3">
                  {getFilteredArticles()[0].excerpt}
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={getFilteredArticles()[0].authorImage}
                    alt={getFilteredArticles()[0].author}
                    className="w-8 h-8 rounded-full object-cover filter grayscale"
                  />
                  <div>
                    <p className="text-xs font-bold text-black">{getFilteredArticles()[0].author}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{getFilteredArticles()[0].publishedTime} • {getFilteredArticles()[0].readTime}</p>
                  </div>
                </div>
              </div>
            )}

            {/* List of remaining articles */}
            <div className="flex flex-col gap-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">Latest Stories</h3>
              {getFilteredArticles().slice(1).map((article) => (
                <article
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-gray-100 group cursor-pointer"
                >
                  <div className="sm:w-1/3 aspect-[4/3] overflow-hidden rounded-lg bg-gray-50 border border-gray-100 shrink-0">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">{article.category}</span>
                    <h3 className="text-lg font-bold text-black group-hover:text-gray-700 leading-snug mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm line-clamp-2 leading-relaxed mb-3">
                      {article.excerpt}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">By {article.author} • {article.publishedTime}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right Sidebar (Trending, Sponsored, Newsletter, Wallet card) */}
          <aside className="lg:col-span-4 flex flex-col gap-8">
            {/* Trending Articles Widget */}
            <div className="bg-white p-6 rounded-lg border border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">Trending</h3>
              <div className="space-y-6">
                {TRENDING_ARTICLES.map((article) => (
                  <div key={article.id} className="flex gap-4 group cursor-pointer">
                    <span className="text-2xl font-bold text-gray-200 group-hover:text-black transition-colors">{article.rank}</span>
                    <div>
                      <h4 className="text-xs font-bold text-black group-hover:underline leading-snug">
                        {article.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase">{article.readTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wallet Dashboard Promo Card */}
            <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-lg flex flex-col justify-between min-h-[200px] relative overflow-hidden">
              <div className="relative z-10">
                <span className="bg-white border border-gray-100 text-gray-500 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest mb-3 inline-block">
                  Contributor Rewards
                </span>
                <h4 className="text-xl font-bold leading-tight mt-1">Editorial Network Rewards</h4>
                <p className="text-xs text-gray-500 leading-normal mt-1">Earn rewards for fact-checking and proofreading premium content.</p>
              </div>
              <button
                onClick={isLoggedIn ? onOpenDashboard : onOpenAuth}
                className="w-full py-2 px-4 border border-gray-200 rounded text-xs font-medium text-gray-600 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 group transition-colors mt-6 cursor-pointer"
              >
                <span>{isLoggedIn ? 'Go to Dashboard' : 'Continue to Rewards'}</span>
                <svg className="w-3 h-3 text-gray-300 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>

            {/* Sponsored Ad Unit */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Sponsored Ad</p>
              <div className="aspect-square bg-white border border-dashed border-gray-200 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=300&h=300"
                  alt="Sponsor product"
                  className="w-full h-full object-cover filter grayscale"
                />
              </div>
              <h4 className="font-bold text-black text-sm mb-1">Precision Redefined</h4>
              <p className="text-gray-500 text-xs mb-4">Discover the new Chronos Series. Engineering meets luxury art.</p>
              <button className="bg-black text-white w-full py-2 rounded text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer">
                Learn More
              </button>
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-white p-6 rounded-lg border border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">Newsletter</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">Get the day's most important tech news delivered straight to your inbox every morning.</p>
              {newsletterSubscribed ? (
                <div className="bg-green-50 text-green-700 p-3 rounded text-xs font-semibold text-center border border-green-100">
                  ✓ Successfully Subscribed!
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <div className="flex items-center border border-gray-100 rounded-md px-2.5 py-1.5 bg-gray-50/30 focus-within:border-black transition-colors">
                    <Mail size={16} className="text-gray-400 mr-2 shrink-0" />
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full text-xs text-black focus:outline-none bg-transparent"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

          </aside>
        </div>
      )}
    </div>
  );
}
