import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from './features/auth/store';
import { useFamilyStore } from './features/family/store';

import Login from './features/auth/pages/Login';
import Signup from './features/auth/pages/Signup';
import CreateFamily from './features/family/pages/CreateFamily';
import AddMembers from './features/family/pages/AddMembers';
import MemberProfile from './features/family/pages/MemberProfile';
import MembersPage from './features/family/pages/MembersPage';
import FamilyAnalyticsDashboard from './features/analytics/pages/FamilyAnalyticsDashboard';
import Dashboard from './features/dashboard/pages/Dashboard';
import DashboardLayout from './layouts/DashboardLayout';

import FinancePage from './features/finance/pages/FinancePage';
import FinanceAnalyticsDashboard from './features/analytics/pages/FinanceAnalyticsDashboard';
import HealthPage from './features/health/pages/HealthPage';
import HealthAnalyticsDashboard from './features/analytics/pages/HealthAnalyticsDashboard';
import MemberHealthDetail from './features/health/pages/MemberHealthDetail';
import EmergencyModePage from './features/health/pages/EmergencyModePage';
import EducationPage from './features/education/pages/EducationPage';
import EducationAnalyticsDashboard from './features/analytics/pages/EducationAnalyticsDashboard';
import MemberEducationDetail from './features/education/pages/MemberEducationDetail';
import PlacesPage from './features/places/pages/PlacesPage';
import PlacesAnalyticsDashboard from './features/analytics/pages/PlacesAnalyticsDashboard';
import DocumentsPage from './features/documents/pages/DocumentsPage';
import DocumentsAnalyticsDashboard from './features/analytics/pages/DocumentsAnalyticsDashboard';
import AlertsPage from './features/alerts/pages/AlertsPage';
import AiPage from './features/ai/pages/AiPage';
import PermissionsPage from './features/permissions/pages/PermissionsPage';
import PermissionsAnalyticsDashboard from './features/analytics/pages/PermissionsAnalyticsDashboard';
import SettingsPage from './features/settings/pages/SettingsPage';

function AuthGate() {
  const [authView, setAuthView] = useState('login');
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  return authView === 'login' ? (
    <Login onSwitchToSignup={() => setAuthView('signup')} onLoginSuccess={handleSuccess} />
  ) : (
    <Signup onSwitchToLogin={() => setAuthView('login')} onSignupSuccess={handleSuccess} />
  );
}

function OnboardingGate() {
  const [step, setStep] = useState('createFamily');
  const navigate = useNavigate();

  if (step === 'createFamily') {
    return <CreateFamily onFamilyCreated={() => navigate('/dashboard')} />;
  }
  return <AddMembers onDone={() => navigate('/dashboard')} />;
}

function DashboardRoute() {
  const navigate = useNavigate();
  return <Dashboard onSelectMember={(id) => navigate('/member/' + id)} />;
}

function MemberProfileRoute() {
  const navigate = useNavigate();
  const memberId = window.location.pathname.split('/member/')[1];
  return <MemberProfile memberId={memberId} onBack={() => navigate('/dashboard')} />;
}

function Protected({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const family = useFamilyStore((s) => s.family);

  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (!family) return <Navigate to="/onboarding" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthGate />} />
        <Route path="/onboarding" element={<OnboardingGate />} />

        <Route
          path="/dashboard"
          element={
            <Protected>
              <DashboardLayout>
                <DashboardRoute />
              </DashboardLayout>
            </Protected>
          }
        />
        <Route
          path="/members"
          element={
            <Protected>
              <DashboardLayout>
                <MembersPage />
              </DashboardLayout>
            </Protected>
          }
        />
        <Route path="/analytics/family" element={<Protected><FamilyAnalyticsDashboard /></Protected>} />
        <Route
          path="/member/:id"
          element={
            <Protected>
              <DashboardLayout>
                <MemberProfileRoute />
              </DashboardLayout>
            </Protected>
          }
        />

        <Route path="/finance" element={<Protected><DashboardLayout><FinancePage /></DashboardLayout></Protected>} />
        <Route path="/analytics/finance" element={<Protected><FinanceAnalyticsDashboard /></Protected>} />

        <Route path="/health" element={<Protected><DashboardLayout><HealthPage /></DashboardLayout></Protected>} />
        <Route path="/analytics/health" element={<Protected><HealthAnalyticsDashboard /></Protected>} />
        <Route path="/health/:id" element={<Protected><DashboardLayout><MemberHealthDetail /></DashboardLayout></Protected>} />
        <Route path="/emergency" element={<Protected><EmergencyModePage /></Protected>} />

        <Route path="/education" element={<Protected><DashboardLayout><EducationPage /></DashboardLayout></Protected>} />
        <Route path="/analytics/education" element={<Protected><EducationAnalyticsDashboard /></Protected>} />
        <Route path="/education/:id" element={<Protected><DashboardLayout><MemberEducationDetail /></DashboardLayout></Protected>} />

        <Route path="/places" element={<Protected><DashboardLayout><PlacesPage /></DashboardLayout></Protected>} />
        <Route path="/analytics/places" element={<Protected><PlacesAnalyticsDashboard /></Protected>} />
        <Route path="/documents" element={<Protected><DashboardLayout><DocumentsPage /></DashboardLayout></Protected>} />
        <Route path="/analytics/documents" element={<Protected><DocumentsAnalyticsDashboard /></Protected>} />
        <Route path="/alerts" element={<Protected><DashboardLayout><AlertsPage /></DashboardLayout></Protected>} />
        <Route path="/ai" element={<Protected><DashboardLayout><AiPage /></DashboardLayout></Protected>} />
        <Route path="/permissions" element={<Protected><DashboardLayout><PermissionsPage /></DashboardLayout></Protected>} />
        <Route path="/analytics/permissions" element={<Protected><PermissionsAnalyticsDashboard /></Protected>} />
        <Route path="/settings" element={<Protected><DashboardLayout><SettingsPage /></DashboardLayout></Protected>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
