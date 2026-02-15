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
import { SettingsPage } from '@/components/settings/SettingsPage';
import { Layout } from '@/components/layout/Layout';
import { PWAInstallBanner } from '@/components/pwa/PWAInstallBanner';
import { OnboardingWizard } from '@/components/onboarding';
import { useOnboardingStore } from '@/store';
import { useApplySettings } from '@/hooks/useSettings';
import { SecretPage } from '@/components/easter-eggs';

function AppContent() {
    // Apply settings globally
    useApplySettings();

    const { completed: onboardingCompleted } = useOnboardingStore();

    // Show onboarding if not completed
    if (!onboardingCompleted) {
        return <OnboardingWizard />;
    }

    return (
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
    );
}

function App() {
    return <AppContent />;
}

export default App;
