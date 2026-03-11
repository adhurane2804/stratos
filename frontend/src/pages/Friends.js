import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../lib/api';
import { toast } from 'sonner';
import {
    Users, UserPlus, Check, X, Search,
    ArrowLeft, Flame, Zap, Shield, UserMinus, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Friends = () => {
    const { user, refreshUser } = useAuth();
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);

    const fetchFriendsData = useCallback(async () => {
        setLoading(true);
        try {
            const [friendsRes, requestsRes] = await Promise.all([
                axios.get(`${API_URL}/friends`),
                axios.get(`${API_URL}/friends/requests`)
            ]);
            setFriends(friendsRes.data);
            setRequests(requestsRes.data);
        } catch (error) {
            console.error('Failed to fetch friends data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFriendsData();
    }, [fetchFriendsData]);

    const handleSearch = async (e) => {
        const q = e.target.value;
        setSearchQuery(q);
        if (q.length < 2) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        try {
            const res = await axios.get(`${API_URL}/users/search?q=${q}`);
            setSearchResults(res.data);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setSearching(false);
        }
    };

    const sendRequest = async (targetId) => {
        try {
            await axios.post(`${API_URL}/friends/request/${targetId}`);
            toast.success('Friend request sent!');
            setSearchResults(prev => prev.filter(u => u.user_id !== targetId));
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to send request');
        }
    };

    const acceptRequest = async (sourceId) => {
        try {
            await axios.post(`${API_URL}/friends/accept/${sourceId}`);
            toast.success('Friend request accepted!');
            fetchFriendsData();
            refreshUser();
        } catch (error) {
            toast.error('Failed to accept request');
        }
    };

    return (
        <div className="min-h-screen bg-background transition-colors duration-300">
            {/* Header */}
            <div className="bg-card border-b border-border sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="p-2 hover:bg-muted rounded-xl transition-colors">
                            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                        </Link>
                        <h1 className="font-heading font-bold text-xl text-foreground">Friends</h1>
                    </div>
                    <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                {i === 2 ? '+' : 'U'}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: Search & Requests */}
                    <div className="md:col-span-1 space-y-8">
                        {/* Search */}
                        <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
                            <h2 className="font-heading font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                                <Search className="w-5 h-5 text-indigo-500" />
                                Find Friends
                            </h2>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all pr-10"
                                />
                                {searching && (
                                    <div className="absolute right-3 top-3.5">
                                        <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>

                            {searchResults.length > 0 && (
                                <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                                    {searchResults.map(result => (
                                        <div key={result.user_id} className="flex items-center justify-between p-3 bg-muted/50 rounded-2xl border border-border">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                                                    {result.name[0]}
                                                </div>
                                                <span className="text-sm font-bold text-foreground truncate max-w-[80px]">{result.name}</span>
                                            </div>
                                            <button
                                                onClick={() => sendRequest(result.user_id)}
                                                disabled={user?.friends?.includes(result.user_id)}
                                                className="p-2 bg-card hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl border border-border transition-all active:scale-95"
                                            >
                                                <UserPlus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Requests */}
                        {requests.length > 0 && (
                            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border animate-pulse-subtle">
                                <h2 className="font-heading font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-orange-500" />
                                    Requests
                                </h2>
                                <div className="space-y-4">
                                    {requests.map(req => (
                                        <div key={req.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950/40 rounded-xl flex items-center justify-center text-orange-600 font-bold">
                                                    {req.name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-foreground">{req.name}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Level {req.level}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => acceptRequest(req.id)}
                                                    className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition-all active:scale-90"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Friends List */}
                    <div className="md:col-span-2">
                        <div className="bg-card rounded-3xl p-8 shadow-sm border border-border min-h-[400px]">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="font-heading font-bold text-2xl text-foreground flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    My Friends
                                </h2>
                                <span className="bg-muted px-4 py-1.5 rounded-full text-xs font-bold text-muted-foreground">
                                    {friends.length} Friends
                                </span>
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-50">
                                    <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
                                    <p className="text-sm font-medium text-muted-foreground">Loading your squad...</p>
                                </div>
                            ) : friends.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 border-4 border-dashed border-border">
                                        <Users className="w-10 h-10 text-muted-foreground/30" />
                                    </div>
                                    <h3 className="font-heading font-bold text-xl text-foreground mb-2">Build your squad!</h3>
                                    <p className="text-muted-foreground text-sm max-w-xs">
                                        Language learning is more fun with friends. Search for users on the left to start!
                                    </p>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {friends.map((friend) => (
                                        <div key={friend.user_id} className="group p-5 bg-card border-2 border-border hover:border-indigo-100 dark:hover:border-indigo-800 rounded-3xl transition-all hover:shadow-md">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-heading font-bold text-xl shadow-lg ring-4 ring-white dark:ring-slate-800">
                                                    {friend.name[0]}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-heading font-bold text-foreground truncate leading-tight italic">{friend.name}</h4>
                                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded leading-none">{friend.league} League</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
                                                <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                                                    <Zap className="w-4 h-4 fill-indigo-600 dark:fill-indigo-400" />
                                                    <span className="font-heading font-extrabold text-sm">{friend.xp}</span>
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase">XP</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-orange-500">
                                                    <Flame className="w-4 h-4 fill-orange-500" />
                                                    <span className="font-heading font-extrabold text-sm">{friend.streak}</span>
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Day</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Friends;
