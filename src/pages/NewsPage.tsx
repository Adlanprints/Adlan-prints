import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import {
  FileText,
  Calendar,
  User,
  ArrowRight,
  X,
  Search,
  Filter,
  Loader2,
  Tag
} from 'lucide-react';
import { NewsArticle } from '../types';

export const NewsPage: React.FC = () => {
  const { openConsultationModal } = useRouter();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const res = await fetch('/api/public/news');
        if (res.ok) {
          const data = await res.json();
          setNews(data);
        }
      } catch (err) {
        console.error('Failed to load news:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const categories = [
    'All',
    'Sports Management',
    'Player Updates',
    'Travel & Tours',
    'Visa & Immigration',
    'Company News'
  ];

  const filtered = news.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-slate-950 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 inline-block mb-3">
            Press & Career Bulletins
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight text-white">
            News & Updates
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            Latest company announcements, sports management insights, player career pathways, and global travel advisories from CHAMONVIN LIMITED.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-xs mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search news & announcements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading articles...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-52 bg-slate-900 overflow-hidden relative">
                    <img
                      src={article.coverImageUrl || 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80'}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-slate-950/80 backdrop-blur-xs text-emerald-400 font-bold text-xs">
                      {article.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <User className="w-3.5 h-3.5" />
                      <span>{article.author}</span>
                    </div>

                    <h3 className="font-heading font-bold text-xl text-slate-950 mb-2 line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="w-full py-2.5 bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-800 text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center max-w-xl mx-auto shadow-xs">
            <FileText className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-2xl font-heading font-bold text-slate-950 mb-2">
              Official Press Announcements In Preparation
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
              Verified news releases, player signings, and international travel updates will appear here once officially cleared by Chamonvin Limited's communications desk.
            </p>
            <button
              onClick={() => openConsultationModal()}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-md cursor-pointer"
            >
              Contact Press & Media Desk
            </button>
          </div>
        )}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-950 text-white p-6 flex items-center justify-between border-b border-slate-800">
              <span className="px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-6">
              {selectedArticle.coverImageUrl && (
                <div className="h-64 sm:h-80 w-full rounded-xl overflow-hidden bg-slate-900">
                  <img
                    src={selectedArticle.coverImageUrl}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 text-xs text-slate-500 border-b border-slate-100 pb-3">
                <span className="font-semibold text-slate-700">{selectedArticle.author}</span>
                <span>•</span>
                <span>{new Date(selectedArticle.publishedAt || selectedArticle.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-950">
                {selectedArticle.title}
              </h2>

              <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed space-y-4 whitespace-pre-line">
                {selectedArticle.content}
              </div>

              <div className="pt-6 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-slate-800 cursor-pointer"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
