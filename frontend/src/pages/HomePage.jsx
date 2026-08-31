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
import PoojaBookingModal from '../components/modals/PoojaBookingModal';
import DonationModal from '../components/modals/DonationModal';
import ToleFundModal from '../components/modals/ToleFundModal';

const HomePage = () => {
  const [settings, setSettings] = useState(null);
  const [summary, setSummary] = useState(null);
  const [poojas, setPoojas] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [meetingData, setMeetingData] = useState(null);
  const [supporters, setSupporters] = useState([]);
  const [budgets, setBudgets] = useState([]);

  // Modals state
  const [isPoojaModalOpen, setIsPoojaModalOpen] = useState(false);
  const [selectedPooja, setSelectedPooja] = useState(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isToleFundModalOpen, setIsToleFundModalOpen] = useState(false);

  const fetchAllData = async () => {
    try {
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

      if (settingsRes.status === 'fulfilled' && settingsRes.value.data.success) {
        setSettings(settingsRes.value.data.data);
      }
      if (poojasRes.status === 'fulfilled' && poojasRes.value.data.success) {
        setPoojas(poojasRes.value.data.data);
      }
      if (eventsRes.status === 'fulfilled' && eventsRes.value.data.success) {
        setEvents(eventsRes.value.data.data);
      }
      if (galleryRes.status === 'fulfilled' && galleryRes.value.data.success) {
        setGallery(galleryRes.value.data.data);
      }
      if (meetingsRes.status === 'fulfilled' && meetingsRes.value.data.success) {
        setMeetingData(meetingsRes.value.data.data);
      }
      if (supportersRes.status === 'fulfilled' && supportersRes.value.data.success) {
        setSupporters(supportersRes.value.data.data);
      }
      if (budgetsRes.status === 'fulfilled' && budgetsRes.value.data.success) {
        setBudgets(budgetsRes.value.data.data);
        setSummary(prev => ({ ...prev, totalBudget: budgetsRes.value.data.summary?.totalAllocated || 0 }));
      }

      // Also fetch public summary for financial KPI calculation
      try {
        const donRes = await api.get('/donations?limit=1');
        const expRes = await api.get('/expenses?limit=1');
        const memRes = await api.get('/members?limit=1');

        setSummary({
          totalDonation: donRes.data?.filteredTotalAmount || 0,
          totalExpense: expRes.data?.filteredTotalAmount || 0,
          totalMembers: memRes.data?.total || 0,
          totalDonors: supportersRes.status === 'fulfilled' ? supportersRes.value.data?.data?.length || 0 : 0
        });
      } catch (err) {
        // Fallback gracefully
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

      {/* 2. Hero Section */}
      <HeroSection
        settings={settings}
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

      {/* 14. Footer */}
      <Footer
        settings={settings}
        onOpenDonationModal={() => setIsDonationModalOpen(true)}
        onOpenToleFundModal={() => setIsToleFundModalOpen(true)}
      />

      {/* Modals */}
      <PoojaBookingModal
        isOpen={isPoojaModalOpen}
        onClose={() => setIsPoojaModalOpen(false)}
        selectedPooja={selectedPooja}
        poojas={poojas}
      />

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        onDonationSuccess={fetchAllData}
      />

      <ToleFundModal
        isOpen={isToleFundModalOpen}
        onClose={() => setIsToleFundModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;
