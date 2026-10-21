import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import {
  Search,
  Filter,
  UserCheck,
  Trophy,
  ArrowRight,
  X,
  Calendar,
  Globe,
  Footprints,
  Shield,
  Loader2,
  Video,
  Play
} from 'lucide-react';
import { PlayerProfile } from '../types';

export function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  // Match standard, short, embed, shorts, and live URLs
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/i;
  const match = trimmed.match(regExp);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
  }
  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const v = parsed.searchParams.get('v');
    if (v && v.length === 11) {
      return `https://www.youtube.com/embed/${v}?rel=0&modestbranding=1`;
    }
  } catch {}
  return null;
}

export const PlayersPage: React.FC = () => {
  const { navigate, openConsultationModal } = useRouter();
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerProfile | null>(null);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        setLoading(true);
        const res = await fetch('/api/public/players');
        if (res.ok) {
          const data = await res.json();
          setPlayers(data);
        }
      } catch (err) {
        console.error('Failed to fetch published players:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlayers();
  }, []);

  const filteredPlayers = players.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.position.toLowerCase().includes(search.toLowerCase()) ||
      p.nationality.toLowerCase().includes(search.toLowerCase()) ||
      (p.currentClub && p.currentClub.toLowerCase().includes(search.toLowerCase()));

    const matchesLevel = levelFilter === 'all' || p.playingLevel === levelFilter;
    const matchesPosition = positionFilter === 'all' || p.position.toLowerCase().includes(positionFilter.toLowerCase());

    return matchesSearch && matchesLevel && matchesPosition;
  });

  const activeEmbedUrl = selectedPlayer ? getYouTubeEmbedUrl(selectedPlayer.videoUrl) : null;

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-slate-950 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 inline-block mb-3">
            Roster & Talent Directory
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight text-white">
            Our Represented Players
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            Verified footballers represented and managed by CHAMONVIN LIMITED across grassroots academies, semi-professional tiers, and professional leagues.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filters */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-xs mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by player name, position, nationality..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              <span>Filters:</span>
            </div>

            {/* Level Filter */}
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Playing Levels</option>
              <option value="Professional">Professional</option>
              <option value="Semi-Professional">Semi-Professional</option>
              <option value="Amateur">Amateur</option>
              <option value="Academy">Academy</option>
            </select>

            {/* Position Filter */}
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Positions</option>
              <option value="Goalkeeper">Goalkeeper</option>
              <option value="Defender">Defender / Center Back</option>
              <option value="Midfield">Midfielder</option>
              <option value="Winger">Winger</option>
              <option value="Striker">Striker / Forward</option>
            </select>
          </div>
        </div>

        {/* Players List or Empty State */}
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading verified player directory...</p>
          </div>
        ) : filteredPlayers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlayers.map((player) => (
              <div
                key={player.id}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-72 bg-slate-900 overflow-hidden">
                    <img
                      src={player.photoUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80'}
                      alt={player.fullName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-950/80 backdrop-blur-xs text-emerald-400 font-bold text-xs">
                      {player.playingLevel}
                    </div>
                    {player.videoUrl && (
                      <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1 shadow">
                        <Play className="w-3 h-3 fill-white" />
                        <span>Video Highlight</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                      <span>{player.position}</span>
                      <span>•</span>
                      <span>{player.nationality}</span>
                    </div>

                    <h3 className="text-xl font-heading font-bold text-slate-950 mb-2">
                      {player.fullName}
                    </h3>

                    <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                      {player.currentClub && (
                        <div>
                          <strong className="text-slate-800">Current Club:</strong> {player.currentClub}
                        </div>
                      )}
                      {player.preferredFoot && (
                        <div>
                          <strong className="text-slate-800">Preferred Foot:</strong> {player.preferredFoot}
                        </div>
                      )}
                      {player.age && (
                        <div>
                          <strong className="text-slate-800">Age:</strong> {player.age}
                        </div>
                      )}
                    </div>

                    <p className="text-slate-600 text-xs line-clamp-3 mb-4 leading-relaxed">
                      {player.shortBio}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedPlayer(player)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>View Profile & Highlights</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl p-10 sm:p-16 border border-dashed border-slate-300 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-slate-950 mb-2">
              Player Directory Under Administrative Verification
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              In accordance with international sports representation standards and privacy protections, Chamonvin Limited publishes player profiles only following verified contractual authorization and explicit publication consent.
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-8 text-left text-xs text-slate-600 space-y-1.5">
              <div className="font-semibold text-slate-900">Are you a player seeking management?</div>
              <div>• Submit your video highlights and playing record through our representation portal.</div>
              <div>• All scouting submissions are kept strictly confidential by our management team.</div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/player-representation')}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm transition-colors cursor-pointer"
              >
                Apply for Representation
              </button>
              <button
                onClick={() => openConsultationModal('sports')}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer"
              >
                Inquire With a Manager
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Player Profile Detail Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-950 text-white p-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider">
                  {selectedPlayer.playingLevel}
                </span>
                <h3 className="text-xl font-heading font-bold text-white">
                  {selectedPlayer.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPlayer(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-1/3 h-64 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={selectedPlayer.photoUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80'}
                    alt={selectedPlayer.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-500 block">Position</span>
                      <strong className="text-slate-900 font-semibold">{selectedPlayer.position}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Nationality</span>
                      <strong className="text-slate-900 font-semibold">{selectedPlayer.nationality}</strong>
                    </div>
                    {selectedPlayer.currentClub && (
                      <div>
                        <span className="text-slate-500 block">Current Club</span>
                        <strong className="text-slate-900 font-semibold">{selectedPlayer.currentClub}</strong>
                      </div>
                    )}
                    {selectedPlayer.preferredFoot && (
                      <div>
                        <span className="text-slate-500 block">Preferred Foot</span>
                        <strong className="text-slate-900 font-semibold">{selectedPlayer.preferredFoot}</strong>
                      </div>
                    )}
                    {selectedPlayer.age && (
                      <div>
                        <span className="text-slate-500 block">Age</span>
                        <strong className="text-slate-900 font-semibold">{selectedPlayer.age}</strong>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900 mb-1">
                      Player Biography
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {selectedPlayer.shortBio}
                    </p>
                  </div>
                </div>
              </div>

              {/* REQUIRED: PLAYER HIGHLIGHT VIDEO EMBED - DIRECT DISPLAY ON PAGE */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-heading font-extrabold text-lg text-slate-950 uppercase tracking-wide">
                        PLAYER HIGHLIGHT
                      </h4>
                      <p className="text-xs text-emerald-700 font-semibold">
                        Player Highlight Reel & Video Dossier
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                    Match Tape & Scouting Analysis
                  </span>
                </div>

                {/* Always display YouTube player directly on the page without having to click any link */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border-2 border-slate-900 bg-black">
                  <iframe
                    src={activeEmbedUrl || (selectedPlayer.videoUrl ? (getYouTubeEmbedUrl(selectedPlayer.videoUrl) || 'https://www.youtube.com/embed/1F3fC02E2wM?rel=0&modestbranding=1') : 'https://www.youtube.com/embed/1F3fC02E2wM?rel=0&modestbranding=1')}
                    title={`${selectedPlayer.fullName} - Player Highlight Reel & Video Dossier`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  Official player video dossier compiled and verified for domestic & international scouting evaluation.
                </p>
              </div>

              {selectedPlayer.careerAchievements && selectedPlayer.careerAchievements.length > 0 && (
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-emerald-600" />
                    <span>Verified Career Achievements</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                    {selectedPlayer.careerAchievements.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Representation managed by CHAMONVIN LIMITED.
                </span>
                <button
                  onClick={() => {
                    setSelectedPlayer(null);
                    openConsultationModal('sports');
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-md cursor-pointer"
                >
                  Inquire About This Player
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
