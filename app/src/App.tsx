import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '@/pages/Dashboard';
import { Topics } from '@/pages/Topics';
import { Timer } from '@/pages/Timer';
import { History } from '@/pages/History';
import { Evolution } from '@/pages/Evolution';
import { Analytics } from '@/pages/Analytics';
import { Plan } from '@/pages/Plan';
import { SessionSummary } from '@/pages/SessionSummary';
import { Skills } from '@/pages/Skills';
import { Auth } from '@/pages/Auth';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { Layout } from '@/components/layout/Layout';
import { PWAInstallBanner } from '@/components/pwa/PWAInstallBanner';
import { OnboardingWizard } from '@/components/onboarding';
import { MigrationPrompt } from '@/components/MigrationPrompt';
import { useOnboardingStore } from '@/store';
import { useApplySettings } from '@/hooks/useSettings';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { SecretPage } from '@/components/easter-eggs';
import { AuthProvider, useAuth } from '@/hooks/useAuth';

function AppContent() {
    // Apply settings globally
    useApplySettings();

    const { completed: onboardingCompleted } = useOnboardingStore();
    const { user, loading: authLoading, refreshProfile } = useAuth();

    // Setup realtime sync for authenticated users
    useRealtimeSync({
        onProfileChange: (profile) => {
            console.log('Profile updated in realtime:', profile);
            // Refresh profile data when it changes
            refreshProfile();
        },
        onSessionChange: ({ event, data }) => {
            console.log('Session change:', event, data);
            // Sessions will be refreshed by the useStudySessions hook when needed
        },
        onAchievementChange: ({ event, data }) => {
            console.log('Achievement change:', event, data);
            // Achievements will be refreshed by the useAchievements hook when needed
        },
        onLeaderboardChange: ({ event, data }) => {
            console.log('Leaderboard change:', event, data);
            // Leaderboard will be refreshed by the useLeaderboard hook when needed
        }
    });

    // Show loading state while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
                <div className="text-white text-xl">Carregando...</div>
            </div>
        );
    }

    // Show auth page if not logged in
    if (!user) {
        return <Auth />;
    }

    // Show onboarding if not completed
    if (!onboardingCompleted) {
        return <OnboardingWizard />;
    }

    return (
        <>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/topics" element={<Topics />} />
                    <Route path="/timer" element={<Timer />} />
                    <Route path="/timer/:topicId" element={<Timer />} />
                    <Route path="/plan" element={<Plan />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/evolution" element={<Evolution />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/skills" element={<Skills />} />
                    <Route path="/session-summary" element={<SessionSummary />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    {/* Secret Easter Egg Route */}
                    <Route path="/easter-egg" element={<SecretPage />} />
                </Routes>
                <PWAInstallBanner />
            </Layout>
            <MigrationPrompt />
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
