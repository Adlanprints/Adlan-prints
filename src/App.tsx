import React, { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ConsultationModal } from './components/ConsultationModal';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { SportsManagementPage } from './pages/SportsManagementPage';
import { PlayersPage } from './pages/PlayersPage';
import { PlayerRepresentationPage } from './pages/PlayerRepresentationPage';
import { TravelToursPage } from './pages/TravelToursPage';
import { VisaConsultationPage } from './pages/VisaConsultationPage';
import { FlightServicesPage } from './pages/FlightServicesPage';
import { NewsPage } from './pages/NewsPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminInquiries } from './pages/admin/AdminInquiries';
import { AdminPlayers } from './pages/admin/AdminPlayers';
import { AdminAppearance } from './pages/admin/AdminAppearance';
import { AdminTravel } from './pages/admin/AdminTravel';
import { AdminNews } from './pages/admin/AdminNews';
import { AdminSettings } from './pages/admin/AdminSettings';

const AppContent: React.FC = () => {
  const { currentPath } = useRouter();

  // Scroll to top and set document titles dynamically
  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'CHAMONVIN LIMITED | International Sports Management & Travel Consulting',
      '/about': 'About Us | CHAMONVIN LIMITED',
      '/sports-management': 'Sports Management & Football Representation | CHAMONVIN LIMITED',
      '/players': 'Represented Players Directory | CHAMONVIN LIMITED',
      '/player-representation': 'Apply for Player Representation | CHAMONVIN LIMITED',
      '/travel-tours': 'Travel & Tour Packages | CHAMONVIN LIMITED',
      '/visa-consultation': 'Visa Consultation & Immigration Advisory | CHAMONVIN LIMITED',
      '/flight-services': 'Flight Services & Ticketing | CHAMONVIN LIMITED',
      '/news': 'News & Press Updates | CHAMONVIN LIMITED',
      '/contact': 'Contact Us & Head Office | CHAMONVIN LIMITED',
      '/privacy-policy': 'Privacy Policy | CHAMONVIN LIMITED',
      '/terms': 'Terms & Conditions | CHAMONVIN LIMITED',
      '/admin/login': 'Admin Portal Sign In | CHAMONVIN LIMITED',
      '/admin/dashboard': 'Admin Command Center | CHAMONVIN LIMITED',
      '/admin/inquiries': 'Inquiries & Leads Hub | CHAMONVIN LIMITED',
      '/admin/players': 'Player Roster Management | CHAMONVIN LIMITED',
      '/admin/appearance': 'Logo & Hero Appearance | CHAMONVIN LIMITED',
      '/admin/travel': 'Travel Packages Management | CHAMONVIN LIMITED',
      '/admin/news': 'News Management | CHAMONVIN LIMITED',
      '/admin/settings': 'System Settings & Audit Logs | CHAMONVIN LIMITED'
    };

    const cleanPath = currentPath.split('?')[0].split('#')[0];
    document.title = titles[cleanPath] || 'CHAMONVIN LIMITED';
  }, [currentPath]);

  // Route matching
  const cleanPath = currentPath.split('?')[0].split('#')[0];

  // Admin Routes
  if (cleanPath === '/admin/login') {
    return <AdminLoginPage />;
  }
  if (cleanPath === '/admin' || cleanPath === '/admin/dashboard') {
    return <AdminDashboard />;
  }
  if (cleanPath === '/admin/inquiries') {
    return <AdminInquiries />;
  }
  if (cleanPath === '/admin/players') {
    return <AdminPlayers />;
  }
  if (cleanPath === '/admin/appearance') {
    return <AdminAppearance />;
  }
  if (cleanPath === '/admin/travel') {
    return <AdminTravel />;
  }
  if (cleanPath === '/admin/news') {
    return <AdminNews />;
  }
  if (cleanPath === '/admin/settings') {
    return <AdminSettings />;
  }

  // Public Routes Render with Header and Footer
  const renderPublicPage = () => {
    switch (cleanPath) {
      case '/':
        return <HomePage />;
      case '/about':
        return <AboutPage />;
      case '/sports-management':
        return <SportsManagementPage />;
      case '/players':
        return <PlayersPage />;
      case '/player-representation':
        return <PlayerRepresentationPage />;
      case '/travel-tours':
        return <TravelToursPage />;
      case '/visa-consultation':
        return <VisaConsultationPage />;
      case '/flight-services':
        return <FlightServicesPage />;
      case '/news':
        return <NewsPage />;
      case '/contact':
        return <ContactPage />;
      case '/privacy-policy':
        return <PrivacyPage />;
      case '/terms':
        return <TermsPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 selection:bg-emerald-500 selection:text-white">
      <Header />
      <main className="flex-1">{renderPublicPage()}</main>
      <Footer />
      <ConsultationModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </ConfigProvider>
    </AuthProvider>
  );
}
