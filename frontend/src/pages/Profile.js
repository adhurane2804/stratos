import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../lib/api';
import { toast } from 'sonner';
import {
  ArrowLeft, Flame, Zap, Heart, Trophy, Target, Star,
  Award, Baby, Calendar, Crown, Globe, Sparkles, LogOut, Lock,
  Book, Library, Shield, Gem, Crosshair, MapPin, ChevronRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ACHIEVEMENT_ICONS = {
  'baby': Baby,
  'flame': Flame,
  'calendar': Calendar,
  'trophy': Trophy,
  'zap': Zap,
  'star': Star,
  'crown': Crown,
  'target': Target,
  'globe': Globe,
  'sparkles': Sparkles,
  'award': Award,
  'book': Book,
  'library': Library,
  'shield': Shield,
  'gem': Gem,
  'crosshair': Crosshair,
  'map_pin': MapPin,
};

const LANGUAGE_META = {
  es: { flag: '🇪🇸', name: 'Spanish' },
  fr: { flag: '🇫🇷', name: 'French' },
  de: { flag: '🇩🇪', name: 'German' },
  ja: { flag: '🇯🇵', name: 'Japanese' },
  zh: { flag: '🇨🇳', name: 'Chinese' },
  it: { flag: '🇮🇹', name: 'Italian' },
  pt: { flag: '🇧🇷', name: 'Portuguese' },
  ko: { flag: '🇰🇷', name: 'Korean' },
  ru: { flag: '🇷🇺', name: 'Russian' },
  ar: { flag: '🇸🇦', name: 'Arabic' },
};

const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredAchievement, setHoveredAchievement] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axios.get(`${API_URL}/achievements`);
        setAchievements(response.data);
      } catch (error) {
        console.error('Failed to fetch achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
    refreshUser();
  }, [refreshUser]);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const xpForCurrentLevel = ((user?.level || 1) - 1) * 100;
  const xpForNextLevel = (user?.level || 1) * 100;
  const levelProgress = Math.max(0, Math.min(100,
    ((user?.xp || 0) - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel) * 100
  ));

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header Area */}
      <div className="bg-gradient-to-r from-sky-500 to-indigo-600 pb-32">
        <div className="max-w-4xl mx-auto px-6 pt-8">
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/dashboard"
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-white font-bold transition-all flex items-center gap-2"
              data-testid="profile-logout-btn"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-28 h-28 bg-white rounded-3xl flex items-center justify-center text-sky-500 font-heading font-bold text-5xl shadow-2xl transition-transform group-hover:scale-105">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg border-2 border-white">
                <Star className="w-4 h-4 text-white fill-white" />
              </div>
            </div>

            <h1 className="font-heading font-extrabold text-3xl text-white mt-6 mb-1">
              {user?.name || 'Learner'}
            </h1>
            <p className="text-white/70 font-medium">Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'recently'}</p>
          </div>
        </div>
      </div>

      {/* Main Content (Stats Cards Overlap) */}
      <main className="max-w-4xl mx-auto px-6 -mt-16 pb-20">
        {/* Heatmap Section - Learning Habit */}
        <div className="stratos-card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-lg text-foreground">Learning Habit</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-3 h-3 rounded-sm ${i === 0 ? 'bg-muted' : i === 1 ? 'bg-sky-200' : i === 2 ? 'bg-sky-400' : i === 3 ? 'bg-sky-600' : 'bg-sky-800'}`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">More</span>
            </div>
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-1 min-w-max">
              {[...Array(52)].map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {[...Array(7)].map((_, dayIndex) => {
                    // Logic to simulate activity: 
                    // Let's make it look active around the current date and sparse elsewhere
                    const isToday = weekIndex === 51 && dayIndex === new Date().getDay();
                    const isActive = Math.random() > 0.7 || (weekIndex > 48 && Math.random() > 0.3);
                    const level = isActive ? Math.floor(Math.random() * 4) + 1 : 0;
                    
                    return (
                      <div
                        key={dayIndex}
                        className={`w-3 h-3 rounded-sm transition-all hover:scale-125 cursor-pointer ${
                          level === 0 ? 'bg-muted' : 
                          level === 1 ? 'bg-sky-200 dark:bg-sky-900/40' : 
                          level === 2 ? 'bg-sky-400 dark:bg-sky-700/60' : 
                          level === 3 ? 'bg-sky-600 dark:bg-sky-500' : 
                          'bg-sky-800 dark:bg-sky-400'
                        } ${isToday ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
                        title={`${level} interactions`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-3 text-[10px] text-muted-foreground font-bold uppercase tracking-widest px-1">
            <span>Last Year</span>
            <span>Today</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stratos-card flex items-center gap-4 group">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/40 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-2xl text-foreground leading-none">{user?.streak || 0}</div>
              <div className="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-wider">Streak</div>
            </div>
          </div>

          <div className="stratos-card flex items-center gap-4 group">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-950/40 rounded-2xl flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white transition-all">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-2xl text-foreground leading-none">{user?.xp || 0}</div>
              <div className="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-wider">Total XP</div>
            </div>
          </div>

          <div className="stratos-card flex items-center gap-4 group">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-2xl text-foreground leading-none">{user?.level || 1}</div>
              <div className="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-wider">Level</div>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="stratos-card mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-bold text-lg text-foreground">Level Progress</h3>
            <span className="text-sm font-bold text-sky-600 dark:text-sky-400">
              {user?.xp || 0} / {xpForNextLevel} XP
            </span>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-1000"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-3 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {Math.ceil(xpForNextLevel - (user?.xp || 0))} XP until Level {(user?.level || 1) + 1}
          </p>
        </div>

        {/* Languages Learning */}
        {user?.languages_learning?.length > 0 && (
          <div className="stratos-card mb-6">
            <h3 className="font-heading font-bold text-lg text-foreground mb-4">Languages</h3>
            <div className="flex flex-wrap gap-3">
              {user.languages_learning.map(code => {
                const meta = LANGUAGE_META[code] || { flag: '🌍', name: code };
                return (
                  <Link
                    key={code}
                    to={`/learn/${code}`}
                    className="flex items-center gap-3 bg-muted hover:bg-sky-100 dark:hover:bg-sky-900/30 px-4 py-2.5 rounded-2xl transition-all hover:scale-105 active:scale-95"
                  >
                    <span className="text-2xl">{meta.flag}</span>
                    <span className="font-bold text-foreground/80">{meta.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Achievements */}
        <div className="stratos-card mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-lg text-foreground">Achievements</h3>
            <div className="bg-muted px-3 py-1 rounded-lg text-xs font-bold text-muted-foreground uppercase tracking-tighter">
              {unlockedCount} / {achievements.length} Unlocked
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {achievements.map(achievement => {
                const IconComponent = ACHIEVEMENT_ICONS[achievement.icon] || Award;
                const isHovered = hoveredAchievement === achievement.id;

                return (
                  <div
                    key={achievement.id}
                    className="relative group/card"
                    onMouseEnter={() => setHoveredAchievement(achievement.id)}
                    onMouseLeave={() => setHoveredAchievement(null)}
                  >
                    <div
                      className={`text-center p-4 rounded-3xl border-2 transition-all h-full flex flex-col items-center justify-center ${achievement.unlocked
                        ? 'bg-card border-border shadow-sm hover:shadow-md'
                        : 'bg-muted/30 border-transparent opacity-60'
                        }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 ${isHovered ? 'scale-110' : ''} ${achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-100 dark:shadow-yellow-900/20'
                        : 'bg-muted'
                        }`}>
                        {achievement.unlocked ? (
                          <IconComponent className="w-7 h-7 text-white" />
                        ) : (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <h4 className={`font-bold text-sm leading-tight ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                        {achievement.name}
                      </h4>
                    </div>

                    {/* Achievement Hover Info Tooltip */}
                    {isHovered && (
                      <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-slate-800 text-white p-3 rounded-2xl shadow-xl pointer-events-none animate-in fade-in zoom-in duration-200">
                        <p className="font-bold text-xs text-yellow-400 mb-1 flex items-center gap-1">
                          {achievement.unlocked ? <Star className="w-3 h-3 fill-yellow-400" /> : <Lock className="w-3 h-3" />}
                          {achievement.unlocked ? 'Unlocked' : 'Locked'}
                        </p>
                        <p className="text-[11px] font-medium leading-relaxed opacity-90">
                          {achievement.description}
                        </p>
                        {/* Triangle arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 rotate-45 -translate-y-1.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Hearts Section */}
        <div className="stratos-card mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950/40 rounded-2xl flex items-center justify-center text-red-500">
                <Heart className="w-6 h-6 fill-red-500" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-foreground leading-none">Learning Health</h3>
                <p className="text-sm text-muted-foreground mt-1">Hearts protect you from mistakes</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-6 h-6 transition-all ${i < (user?.hearts || 0) ? 'text-red-500 fill-red-500 scale-110' : 'text-muted-foreground/30'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
