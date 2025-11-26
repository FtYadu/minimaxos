'use client';

import { useAppStore } from '@/lib/store';
import {
    LayoutDashboard,
    Video,
    Image as ImageIcon,
    Music,
    MessageSquare,
    Code,
    CreditCard,
    TrendingUp,
    Activity,
    Calendar
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Edit2, RefreshCw, Loader2 } from 'lucide-react';

// Estimated costs (fictional/approximate for demonstration)
const COSTS = {
    video: 0.10, // $0.10 per video
    image: 0.02, // $0.02 per image
    music: 0.05, // $0.05 per track
    text: 0.001, // $0.001 per request
    code: 0.002, // $0.002 per request
};

export default function DashboardPanel() {
    const { generations, uploads, apiKey } = useAppStore();
    const [initialBalance, setInitialBalance] = useState(100.00);
    const [isEditingBalance, setIsEditingBalance] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const stats = useMemo(() => {
        const counts = {
            video: 0,
            image: 0,
            music: 0,
            text: 0,
            code: 0,
        };

        let totalCost = 0;

        generations.forEach(g => {
            if (g.status === 'completed') {
                if (g.type in counts) {
                    counts[g.type as keyof typeof counts]++;
                    totalCost += COSTS[g.type as keyof typeof COSTS] || 0;
                }
            }
        });

        return { counts, totalCost };
    }, [generations]);

    // Mock balance (In a real app, this would come from the API)
    const currentBalance = Math.max(0, initialBalance - stats.totalCost);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            // Reload generations from DB to ensure we have latest state
            await useAppStore.getState().loadGenerations();
            // Trigger queue processing in case anything is stuck
            await useAppStore.getState().processQueue();

            // Simulate API check delay for visual feedback
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Dashboard synced with local data. Note: MiniMax API does not provide a balance endpoint.');
        } catch (error) {
            console.error('Sync failed:', error);
            alert('Failed to sync dashboard');
        } finally {
            setIsSyncing(false);
        }
    };

    const recentActivity = [...generations]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5);

    const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                <Icon className="w-24 h-24" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${color} bg-opacity-20 text-white`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-medium text-muted-foreground">{title}</h3>
                </div>
                <div className="text-3xl font-bold mb-1">{value}</div>
                {subtext && <div className="text-xs text-muted-foreground">{subtext}</div>}
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold gradient-text mb-2">Dashboard</h2>
                <p className="text-muted-foreground">
                    Overview of your usage, assets, and account status
                </p>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-sm text-yellow-600 dark:text-yellow-400 flex items-start gap-3">
                <div className="mt-0.5">⚠️</div>
                <div>
                    <p className="font-medium">Note on Accuracy</p>
                    <p className="opacity-90">
                        The MiniMax API does not provide an endpoint to check account balance or usage history.
                        Values shown here are <strong>estimates</strong> based on your local activity history.
                        Please check the <a href="https://platform.minimax.io/user-center/billing/balance" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-500">MiniMax Console</a> for official billing details.
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm font-medium"
                >
                    {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Sync Status
                </button>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Spend"
                    value={`$${stats.totalCost.toFixed(2)}`}
                    icon={CreditCard}
                    color="bg-red-500"
                    subtext="Estimated based on usage"
                />
                <StatCard
                    title="Balance"
                    value={
                        isEditingBalance ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xl">$</span>
                                <input
                                    type="number"
                                    value={initialBalance}
                                    onChange={(e) => setInitialBalance(Number(e.target.value))}
                                    className="w-24 bg-background border border-border rounded px-2 py-1 text-lg"
                                    autoFocus
                                    onBlur={() => setIsEditingBalance(false)}
                                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingBalance(false)}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingBalance(true)}>
                                <span>${currentBalance.toFixed(2)}</span>
                                <Edit2 className="w-4 h-4 opacity-0 group-hover:opacity-50" />
                            </div>
                        )
                    }
                    icon={TrendingUp}
                    color="bg-green-500"
                    subtext={`~${Math.floor(currentBalance / COSTS.video)} videos remaining`}
                />
                <StatCard
                    title="Total Generations"
                    value={generations.length}
                    icon={Activity}
                    color="bg-blue-500"
                    subtext={`${generations.filter(g => g.status === 'completed').length} completed`}
                />
                <StatCard
                    title="Media Assets"
                    value={uploads.length}
                    icon={ImageIcon}
                    color="bg-purple-500"
                    subtext="Uploaded files"
                />
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Usage by Type */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5" />
                        Usage Breakdown
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-muted/50 rounded-xl flex items-center gap-4">
                            <div className="p-3 bg-purple-500/20 text-purple-500 rounded-lg">
                                <Video className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.counts.video}</div>
                                <div className="text-xs text-muted-foreground">Videos Generated</div>
                            </div>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-xl flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 text-blue-500 rounded-lg">
                                <ImageIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.counts.image}</div>
                                <div className="text-xs text-muted-foreground">Images Generated</div>
                            </div>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-xl flex items-center gap-4">
                            <div className="p-3 bg-orange-500/20 text-orange-500 rounded-lg">
                                <Music className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.counts.music}</div>
                                <div className="text-xs text-muted-foreground">Tracks Generated</div>
                            </div>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-xl flex items-center gap-4">
                            <div className="p-3 bg-green-500/20 text-green-500 rounded-lg">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.counts.text}</div>
                                <div className="text-xs text-muted-foreground">Text Chats</div>
                            </div>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-xl flex items-center gap-4">
                            <div className="p-3 bg-yellow-500/20 text-yellow-500 rounded-lg">
                                <Code className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.counts.code}</div>
                                <div className="text-xs text-muted-foreground">Code Snippets</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {recentActivity.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">
                                No activity yet
                            </div>
                        ) : (
                            recentActivity.map((gen) => (
                                <div key={gen.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <div className={`
                    w-2 h-2 rounded-full
                    ${gen.status === 'completed' ? 'bg-green-500' :
                                            gen.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'}
                  `} />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate">{gen.prompt}</div>
                                        <div className="text-xs text-muted-foreground capitalize">
                                            {gen.type} • {new Date(gen.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
