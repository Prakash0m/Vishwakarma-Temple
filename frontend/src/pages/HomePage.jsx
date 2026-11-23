import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/common/Navbar';
import HeroSection from '../components/home/HeroSection';
import QuickInfoStrip from '../components/home/QuickInfoStrip';
import AboutSection from '../components/home/AboutSection';
import LeadershipSection from '../components/home/LeadershipSection';
import PoojaServicesSection from '../components/home/PoojaServicesSection';
import LiveDarshanMeetingSection from '../components/home/LiveDarshanMeetingSection';
import EventsSection from '../components/home/EventsSection';
import GallerySection from '../components/home/GallerySection';
import DonationSection from '../components/home/DonationSection';
import TransparencySection from '../components/home/TransparencySection';
import LocationMapSection from '../components/home/LocationMapSection';
import ContactSection from '../components/home/ContactSection';
import Footer from '../components/common/Footer';

// Lazy-loaded modals so canvas-confetti and modal forms are not in initial page load
const PoojaBookingModal = React.lazy(() => import('../components/modals/PoojaBookingModal'));
const DonationModal = React.lazy(() => import('../components/modals/DonationModal'));
const ToleFundModal = React.lazy(() => import('../components/modals/ToleFundModal'));

const CACHE_KEY = 'temple_homepage_swr_cache_v2';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache validity

const loadCachedData = () => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && (Date.now() - parsed.timestamp) < CACHE_TTL_MS) {
      return parsed.payload;
    }
  } catch (err) {
    // Ignore cache parse errors
  }
  return null;
};

const HomePage = () => {
  const cached = loadCachedData();

  const [settings, setSettings] = useState(cached?.settings || null);
  const [summary, setSummary] = useState(cached?.summary || null);
  const [poojas, setPoojas] = useState(cached?.poojas || []);
  const [events, setEvents] = useState(cached?.events || []);
  const [gallery, setGallery] = useState(cached?.gallery || []);
  const [meetingData, setMeetingData] = useState(cached?.meetingData || null);
  const [supporters, setSupporters] = useState(cached?.supporters || []);
  const [budgets, setBudgets] = useState(cached?.budgets || []);

  // Modals state
  const [isPoojaModalOpen, setIsPoojaModalOpen] = useState(false);
  const [selectedPooja, setSelectedPooja] = useState(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isToleFundModalOpen, setIsToleFundModalOpen] = useState(false);

  const fetchAllData = async () => {
    try {
      // 1. Fast path: 1 single network roundtrip to unified cached feed
      try {
        const feedRes = await api.get('/homepage-feed');
        if (feedRes.data && feedRes.data.success && feedRes.data.data) {
          const feed = feedRes.data.data;
          if (feed.settings) setSettings(feed.settings);
          if (feed.poojas?.length) setPoojas(feed.poojas);
          if (feed.events?.length) setEvents(feed.events);
          if (feed.gallery?.length) setGallery(feed.gallery);
          if (feed.meetingData) setMeetingData(feed.meetingData);
          if (feed.supporters?.length) setSupporters(feed.supporters);
          if (feed.budgets?.length) setBudgets(feed.budgets);
          if (feed.summary) setSummary(feed.summary);

          // Persist in SWR cache for instant load next time
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({
              timestamp: Date.now(),
              payload: {
                settings: feed.settings || settings,
                summary: feed.summary,
                poojas: feed.poojas,
                events: feed.events,
                gallery: feed.gallery,
                meetingData: feed.meetingData,
                supporters: feed.supporters,
                budgets: feed.budgets
              }
            }));
          } catch (e) {
            // Ignore session storage quota errors
          }
          return; // Fast path successful
        }
      } catch (feedErr) {
        console.warn('Unified feed failed, falling back to separate endpoints:', feedErr.message);
      }

      // 2. Fallback path: Individual endpoints
      const [
        settingsRes,
        poojasRes,
        eventsRes,
        galleryRes,
        meetingsRes,
        supportersRes,
        budgetsRes
      ] = await Promise.allSettled([
        api.get('/settings'),
        api.get('/poojas'),
        api.get('/events'),
        api.get('/gallery'),
        api.get('/meetings'),
        api.get('/donations/public-supporters'),
        api.get('/budgets')
      ]);

      const freshSettings = settingsRes.status === 'fulfilled' && settingsRes.value.data.success ? settingsRes.value.data.data : null;
      const freshPoojas = poojasRes.status === 'fulfilled' && poojasRes.value.data.success ? poojasRes.value.data.data : [];
      const freshEvents = eventsRes.status === 'fulfilled' && eventsRes.value.data.success ? eventsRes.value.data.data : [];
      const freshGallery = galleryRes.status === 'fulfilled' && galleryRes.value.data.success ? galleryRes.value.data.data : [];
      const freshMeetings = meetingsRes.status === 'fulfilled' && meetingsRes.value.data.success ? meetingsRes.value.data.data : null;
      const freshSupporters = supportersRes.status === 'fulfilled' && supportersRes.value.data.success ? supportersRes.value.data.data : [];
      const freshBudgets = budgetsRes.status === 'fulfilled' && budgetsRes.value.data.success ? budgetsRes.value.data.data : [];

      if (freshSettings) setSettings(freshSettings);
      if (freshPoojas.length) setPoojas(freshPoojas);
      if (freshEvents.length) setEvents(freshEvents);
      if (freshGallery.length) setGallery(freshGallery);
      if (freshMeetings) setMeetingData(freshMeetings);
      if (freshSupporters.length) setSupporters(freshSupporters);
      if (freshBudgets.length) setBudgets(freshBudgets);

      let freshSummary = summary;
      try {
        const [donRes, expRes, memRes] = await Promise.allSettled([
          api.get('/donations?limit=1'),
          api.get('/expenses?limit=1'),
          api.get('/members?limit=1')
        ]);

        freshSummary = {
          totalDonation: donRes.status === 'fulfilled' ? donRes.value.data?.filteredTotalAmount || 0 : 0,
          totalExpense: expRes.status === 'fulfilled' ? expRes.value.data?.filteredTotalAmount || 0 : 0,
          totalMembers: memRes.status === 'fulfilled' ? memRes.value.data?.total || 0 : 0,
          totalDonors: freshSupporters.length || 0,
          totalBudget: budgetsRes.status === 'fulfilled' ? budgetsRes.value.data?.summary?.totalAllocated || 0 : 0
        };
        setSummary(freshSummary);
      } catch (err) {
        // Fallback gracefully
      }

      // Persist in SWR cache for instant load next time
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          payload: {
            settings: freshSettings || settings,
            summary: freshSummary,
            poojas: freshPoojas,
            events: freshEvents,
            gallery: freshGallery,
            meetingData: freshMeetings,
            supporters: freshSupporters,
            budgets: freshBudgets
          }
        }));
      } catch (e) {
        // Ignore session storage quota errors
      }
    } catch (error) {
      console.error('Error fetching homepage data:', error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleOpenPoojaBooking = (pooja) => {
    setSelectedPooja(pooja);
    setIsPoojaModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 1. Header Navigation */}
      <Navbar
        settings={settings}
        meetingData={meetingData}
        onOpenDonationModal={() => setIsDonationModalOpen(true)}
        onOpenToleFundModal={() => setIsToleFundModalOpen(true)}
      />

      {/* Main Landmark for SEO and Screen Readers */}
      <main id="main-content" role="main">
        {/* 2. Hero Section with Dynamic Gallery Slider */}
        <HeroSection
          settings={settings}
          gallery={gallery}
          meetingData={meetingData}
          onOpenDonationModal={() => setIsDonationModalOpen(true)}
          onOpenToleFundModal={() => setIsToleFundModalOpen(true)}
        />

        {/* 3. Quick Info Strip */}
        <QuickInfoStrip settings={settings} />

        {/* 4. About Temple */}
        <AboutSection settings={settings} />

        {/* 5. Tole Leadership & 5 Candidates Presentation */}
        <LeadershipSection />

        {/* 6. Pooja & Services */}
        {(settings?.showPooja !== false) && (
          <PoojaServicesSection
            poojas={poojas}
            onSelectPooja={handleOpenPoojaBooking}
          />
        )}

        {/* 7. Upcoming Events */}
        {(settings?.showEvents !== false) && (
          <EventsSection events={events} />
        )}

        {/* 8. Live Darshan & Virtual Meeting */}
        {((settings?.showLiveDarshan !== false) || (settings?.showMeeting !== false)) && (
          <LiveDarshanMeetingSection meetingData={meetingData} />
        )}

        {/* 9. Photo Gallery */}
        {(settings?.showGallery !== false) && (
          <GallerySection gallery={gallery} />
        )}

        {/* 10. Donation & Chanda with Supporters Ticker */}
        {(settings?.showDonationSection !== false) && (
          <DonationSection
            summary={summary}
            settings={settings}
            supporters={supporters}
            onOpenDonationModal={() => setIsDonationModalOpen(true)}
          />
        )}

        {/* 11. Financial Transparency */}
        {(settings?.showTransparency !== false) && (
          <TransparencySection
            summary={summary}
            budgets={budgets}
            settings={settings}
          />
        )}

        {/* 12. Location & Google Map */}
        <LocationMapSection settings={settings} />

        {/* 13. Contact Us */}
        <ContactSection settings={settings} />
      </main>

      {/* 14. Footer */}
      <Footer
        settings={settings}
        onOpenDonationModal={() => setIsDonationModalOpen(true)}
        onOpenToleFundModal={() => setIsToleFundModalOpen(true)}
      />

      {/* On-demand Lazy-loaded Modals */}
      {isPoojaModalOpen && (
        <React.Suspense fallback={null}>
          <PoojaBookingModal
            isOpen={isPoojaModalOpen}
            onClose={() => setIsPoojaModalOpen(false)}
            selectedPooja={selectedPooja}
            poojas={poojas}
          />
        </React.Suspense>
      )}

      {isDonationModalOpen && (
        <React.Suspense fallback={null}>
          <DonationModal
            isOpen={isDonationModalOpen}
            onClose={() => setIsDonationModalOpen(false)}
            onDonationSuccess={fetchAllData}
          />
        </React.Suspense>
      )}

      {isToleFundModalOpen && (
        <React.Suspense fallback={null}>
          <ToleFundModal
            isOpen={isToleFundModalOpen}
            onClose={() => setIsToleFundModalOpen(false)}
          />
        </React.Suspense>
      )}
    </div>
  );
};

export default HomePage;
