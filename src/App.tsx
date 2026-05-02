import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Catalog from './pages/Catalog';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Reviews from './pages/Reviews';
import Contacts from './pages/Contacts';
import BsMarket from './pages/BsMarket';
import BsAccount from './pages/BsAccount';
import BsSell from './pages/BsSell';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ChatWidget from './components/ChatWidget';

const queryClient = new QueryClient();

function AppContent() {
  const [authOpen, setAuthOpen] = useState(false);

  const handleAuthSuccess = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onAuthClick={() => setAuthOpen(true)} />
      <main className="flex-1 pt-16">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/catalog" element={<Catalog onAuthRequired={() => setAuthOpen(true)} />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/bs-market" element={<BsMarket />} />
          <Route path="/bs-account/:id" element={<BsAccount onAuthRequired={() => setAuthOpen(true)} />} />
          <Route path="/bs-sell" element={<BsSell onAuthRequired={() => setAuthOpen(true)} />} />
          <Route path="/dashboard" element={<Dashboard onAuthRequired={() => setAuthOpen(true)} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;