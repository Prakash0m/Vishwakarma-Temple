import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Member from '../models/Member.js';
import Donation from '../models/Donation.js';
import Expense from '../models/Expense.js';
import Budget from '../models/Budget.js';
import Pooja from '../models/Pooja.js';
import PoojaBooking from '../models/PoojaBooking.js';
import Event from '../models/Event.js';
import Gallery from '../models/Gallery.js';
import Meeting from '../models/Meeting.js';
import Setting from '../models/Setting.js';
import ContactMessage from '../models/ContactMessage.js';
import House from '../models/House.js';
import ToleMeeting from '../models/ToleMeeting.js';
import MeetingAttendance from '../models/MeetingAttendance.js';
import Fine from '../models/Fine.js';
import Wedding from '../models/Wedding.js';
import ToleCandidate from '../models/ToleCandidate.js';
import IncomeSource from '../models/IncomeSource.js';
import TempleIncome from '../models/TempleIncome.js';
import FundCampaign from '../models/FundCampaign.js';
import FundPayment from '../models/FundPayment.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('🌱 Checking / Seeding Vishwakarma Temple Database...');

    // 1. Admin User
    const existingAdmin = await User.findOne({ email: 'admin@vishwakarmatemple.org' });
    let adminUser;
    if (!existingAdmin) {
      adminUser = await User.create({
        name: 'पण्डित रमेश आचार्य (Head Priest & Admin)',
        email: 'admin@vishwakarmatemple.org',
        password: 'TempleAdmin@2027',
        role: 'superadmin',
        phone: '+977 9852012345'
      });
      console.log('✅ Admin User Created: admin@vishwakarmatemple.org / TempleAdmin@2027');
    } else {
      adminUser = existingAdmin;
    }

    // 2. Settings
    const existingSettings = await Setting.findOne();
    if (!existingSettings) {
      await Setting.create({
        templeNameNepali: 'विश्वकर्मा मन्दिर',
        templeNameEnglish: 'Vishwakarma Temple',
        templeLocationNepali: 'छापकी (वडा नं. ५), सप्तरी, नेपाल',
        templeLocationEnglish: 'Chhapki (Ward No. 5), Saptari, Nepal',
        heroEyebrowNepali: 'ॐ श्री विश्वकर्मणे नमः',
        heroEyebrowEnglish: 'Om Shri Vishwakarmane Namah',
        heroTitleNepali: 'विश्वकर्मा भगवानको शरणमा स्वागत छ',
        heroTitleEnglish: 'Welcome to the Divine Presence of Lord Vishwakarma',
        heroSubtitleNepali: 'सृष्टि, वास्तुकला, विज्ञान र शिल्पकलाका अधिष्ठाता भगवान विश्वकर्माको पवित्र भूमि छापकी, सप्तरी (मधेश प्रदेश) मा हार्दिक स्वागत गर्दछौं।',
        heroSubtitleEnglish: 'Devoted to the supreme divine architect, engineer, and cosmic creator. Experience spirituality, peace, Vedic pujas, and community seva in Chhapki, Saptari.',
        heroImage: '/assets/images/deity-portrait.jpg',
        aboutTitleNepali: 'हाम्रो मन्दिरको बारेमा',
        aboutTitleEnglish: 'About Vishwakarma Temple',
        aboutDescriptionNepali: 'सप्तरी जिल्लाको अग्निसाइर कृष्णासवरण गाउँपालिका वडा नं. ५, छापकीको पवित्र भूमिमा अवस्थित श्री विश्वकर्मा मन्दिर शिल्पकार, प्राविधिक, श्रमिक तथा सम्पूर्ण श्रद्धालु भक्तजनहरूको आस्था र भक्तिको केन्द्र हो। मन्दिरले दैनिक पूजा, विशेष अनुष्ठान, सांस्कृतिक संरक्षण र सामाजिक सेवाका कार्यहरू निरन्तर सञ्चालन गर्दै आएको छ।',
        aboutDescriptionEnglish: 'Situated in the sacred settlement of Chhapki (Ward No. 5), Agnisair Krishnasavaran Rural Municipality, Saptari District (Madhesh Province, Nepal), the Vishwakarma Temple stands as a sanctum of spiritual devotion, artisanal heritage, and community empowerment.',
        aboutImage: '/assets/images/temple-structure.jpg',
        establishedYear: '२०५५ (1998 AD)',
        devoteesCount: '१०,०००+',
        annualEventsCount: '२४+',
        communityProjectsCount: '१००% पारदर्शी',
        dailyPoojaTimeNepali: 'बिहान ६:०० देखि साँझ ७:०० सम्म',
        dailyPoojaTimeEnglish: '6:00 AM to 7:00 PM Daily',
        specialPoojaTimeNepali: 'प्रत्येक शनिबार तथा संक्रान्ति',
        specialPoojaTimeEnglish: 'Every Saturday & Sankranti',
        phone: '+९७७-३१-५२०१२३',
        secondaryPhone: '+९७७ ९८५२८९९९९९',
        email: 'info@vishwakarmatemple.org.np',
        addressNepali: 'छापकी (वडा नं. ५), अग्निसाइर कृष्णासवरण गाउँपालिका, सप्तरी जिल्ला, मधेश प्रदेश, नेपाल',
        addressEnglish: 'Chhapki (Ward No. 5), Agnisair Krishnasavaran Rural Municipality, Saptari District, Madhesh Province, Nepal',
        googleMapsUrl: 'https://www.google.com/maps/place/Vishwakarma+Temple/@26.6052464,86.8144002,974m/',
        googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.298285514603!2d86.8144002!3d26.6052464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef0585fca58f8b%3A0xb3558fe3fa34b5c7!2sVishwakarma%20Temple!5e0!3m2!1sen!2snp!4v1709210000000!5m2!1sen!2snp',
        socialLinks: {
          facebook: 'https://facebook.com/vishwakarmatemple.chhapki',
          youtube: 'https://youtube.com/@vishwakarmatemple',
          instagram: 'https://instagram.com/vishwakarmatemple',
          tiktok: 'https://tiktok.com/@vishwakarmatemple'
        },
        bankDetails: {
          bankName: 'Nepal Bank Limited, Saptari',
          accountName: 'Shri Vishwakarma Mandir Samiti, Chhapki',
          accountNumber: '01200100234567000001',
          branch: 'Kanchanpur / Rupani Branch, Saptari',
          fonepayNumber: '9852899999',
          esewaId: '9852899999',
          khaltiId: '9852899999'
        },
        donorPrivacyDisplay: 'public',
        showDonationSection: true,
        showDonorList: true,
        showLiveDarshan: true,
        showMeeting: true,
        showEvents: true,
        showGallery: true,
        showTransparency: true,
        showPooja: true
      });
      console.log('✅ Settings initialized');
    }

    // 3. Members
    const memberCount = await Member.countDocuments();
    let members = [];
    if (memberCount === 0) {
      members = await Member.create([
        {
          memberId: 'VKT-2026-001',
          name: 'राम प्रसाद शर्मा',
          nameDevanagari: 'राम प्रसाद शर्मा',
          phone: '9852011111',
          email: 'ram.sharma@example.com',
          address: 'छापकी-५, सप्तरी',
          membershipType: 'Life Member',
          membershipTypeDevanagari: 'आजीवन सदस्य',
          status: 'Active',
          occupation: 'इन्जिनियर (Engineer)',
          notes: 'मन्दिर निर्माण समिति वरिष्ठ सदस्य'
        },
        {
          memberId: 'VKT-2026-002',
          name: 'सीता देवी श्रेष्ठ',
          nameDevanagari: 'सीता देवी श्रेष्ठ',
          phone: '9852022222',
          email: 'sita.shrestha@example.com',
          address: 'अग्निसाइर कृष्णासवरण, सप्तरी',
          membershipType: 'Executive Member',
          membershipTypeDevanagari: 'कार्यसमिति सदस्य',
          status: 'Active',
          occupation: 'शिक्षिका (Educator)',
          notes: 'महिला भजन समूह संयोजक'
        },
        {
          memberId: 'VKT-2026-003',
          name: 'श्याम कुमार विश्वकर्मा',
          nameDevanagari: 'श्याम कुमार विश्वकर्मा',
          phone: '9852033333',
          email: 'shyam.v@example.com',
          address: 'छापकी, सप्तरी',
          membershipType: 'Patron',
          membershipTypeDevanagari: 'संरक्षक',
          status: 'Active',
          occupation: 'व्यवसायी (Entrepreneur)',
          notes: 'मुख्य दाता तथा संरक्षक'
        },
        {
          memberId: 'VKT-2026-004',
          name: 'गोपाल कृष्ण अधिकारी',
          nameDevanagari: 'गोपाल कृष्ण अधिकारी',
          phone: '9852044444',
          email: 'gopal.a@example.com',
          address: 'रुपाणी-३, सप्तरी',
          membershipType: 'Life Member',
          membershipTypeDevanagari: 'आजीवन सदस्य',
          status: 'Active',
          occupation: 'समाजसेवी (Social Worker)',
          notes: 'पूजा व्यवस्थापन संयोजक'
        },
        {
          memberId: 'VKT-2026-005',
          name: 'मन्दिरा पौडेल',
          nameDevanagari: 'मन्दिरा पौडेल',
          phone: '9852055555',
          email: 'mandira.p@example.com',
          address: 'कञ्चनरुप, सप्तरी',
          membershipType: 'General Member',
          membershipTypeDevanagari: 'साधारण सदस्य',
          status: 'Active',
          occupation: 'गृहणी'
        },
        {
          memberId: 'VKT-2026-006',
          name: 'दिपक प्रसाद साह',
          nameDevanagari: 'दिपक प्रसाद साह',
          phone: '9852066666',
          email: 'deepak.sah@example.com',
          address: 'राजविराज, सप्तरी',
          membershipType: 'Life Member',
          membershipTypeDevanagari: 'आजीवन सदस्य',
          status: 'Active',
          occupation: 'उद्योगी'
        }
      ]);
      console.log(`✅ ${members.length} Members created`);
    } else {
      members = await Member.find();
    }

    // 4. Donations (Chanda Collection)
    const donationCount = await Donation.countDocuments();
    if (donationCount === 0 && members.length > 0) {
      await Donation.create([
        {
          receiptNumber: 'RCP-2026-0001',
          donorName: 'राम प्रसाद शर्मा',
          donorNameDevanagari: 'राम प्रसाद शर्मा',
          donorPhone: '9852011111',
          donorAddress: 'छापकी-५, सप्तरी',
          member: members[0]._id,
          amount: 25000,
          purpose: 'मन्दिर मर्मत तथा रंगरोगन',
          purposeDevanagari: 'मन्दिर मर्मत तथा रंगरोगन',
          paymentMethod: 'Bank Transfer',
          transactionId: 'NBL-TRX-88991',
          date: new Date('2026-08-10'),
          privacy: 'public',
          isVerified: true
        },
        {
          receiptNumber: 'RCP-2026-0002',
          donorName: 'सीता देवी श्रेष्ठ',
          donorNameDevanagari: 'सीता देवी श्रेष्ठ',
          donorPhone: '9852022222',
          donorAddress: 'अग्निसाइर कृष्णासवरण, सप्तरी',
          member: members[1]._id,
          amount: 15000,
          purpose: 'अन्नपूर्णा महाप्रसाद कोष',
          purposeDevanagari: 'अन्नपूर्णा महाप्रसाद कोष',
          paymentMethod: 'eSewa',
          transactionId: 'ESW-9923841',
          date: new Date('2026-08-15'),
          privacy: 'public',
          isVerified: true
        },
        {
          receiptNumber: 'RCP-2026-0003',
          donorName: 'श्याम कुमार विश्वकर्मा',
          donorNameDevanagari: 'श्याम कुमार विश्वकर्मा',
          donorPhone: '9852033333',
          donorAddress: 'छापकी, सप्तरी',
          member: members[2]._id,
          amount: 50000,
          purpose: 'विश्वकर्मा जयन्ती महामहोत्सव',
          purposeDevanagari: 'विश्वकर्मा जयन्ती महामहोत्सव',
          paymentMethod: 'Bank Transfer',
          transactionId: 'NBL-TRX-99012',
          date: new Date('2026-08-18'),
          privacy: 'public',
          isVerified: true
        },
        {
          receiptNumber: 'RCP-2026-0004',
          donorName: 'गोपाल कृष्ण अधिकारी',
          donorNameDevanagari: 'गोपाल कृष्ण अधिकारी',
          donorPhone: '9852044444',
          donorAddress: 'रुपाणी-३, सप्तरी',
          member: members[3]._id,
          amount: 10000,
          purpose: 'दैनिक पूजा तथा दीप प्रज्वलन',
          purposeDevanagari: 'दैनिक पूजा तथा दीप प्रज्वलन',
          paymentMethod: 'Fonepay',
          transactionId: 'FP-8871625',
          date: new Date('2026-08-20'),
          privacy: 'public',
          isVerified: true
        },
        {
          receiptNumber: 'RCP-2026-0005',
          donorName: 'हरि भक्त दाहाल',
          donorNameDevanagari: 'हरि भक्त दाहाल',
          donorPhone: '9842011223',
          donorAddress: 'कञ्चनरुप, सप्तरी',
          amount: 11000,
          purpose: 'सामान्य मन्दिर कोष',
          purposeDevanagari: 'सामान्य मन्दिर कोष',
          paymentMethod: 'Khalti',
          transactionId: 'KHL-773412',
          date: new Date('2026-08-24'),
          privacy: 'public',
          isVerified: true
        },
        {
          receiptNumber: 'RCP-2026-0006',
          donorName: 'दिपक प्रसाद साह',
          donorNameDevanagari: 'दिपक प्रसाद साह',
          donorPhone: '9852066666',
          donorAddress: 'राजविराज, सप्तरी',
          member: members[5]._id,
          amount: 21000,
          purpose: 'मन्दिर सौन्दर्यीकरण',
          purposeDevanagari: 'मन्दिर सौन्दर्यीकरण',
          paymentMethod: 'Cash',
          date: new Date('2026-08-26'),
          privacy: 'public',
          isVerified: true
        },
        {
          receiptNumber: 'RCP-2026-0007',
          donorName: 'एक श्रद्धालु भक्तजन',
          donorNameDevanagari: 'एक श्रद्धालु भक्तजन',
          amount: 5100,
          purpose: 'गुप्त दान (Anonymous Offering)',
          purposeDevanagari: 'सामान्य मन्दिर कोष',
          paymentMethod: 'Cash',
          date: new Date('2026-08-28'),
          privacy: 'anonymous',
          isVerified: true
        }
      ]);
      console.log('✅ Initial Donations seeded');
    }

    // 5. Budgets
    const budgetCount = await Budget.countDocuments();
    if (budgetCount === 0) {
      await Budget.create([
        {
          category: 'मन्दिर मर्मत',
          categoryEnglish: 'Temple Renovation & Maintenance',
          allocatedAmount: 200000,
          fiscalYear: '2081/82 (2026)',
          notes: 'शिखर रङ्गरोगन र भुईं मार्बल संरक्षण'
        },
        {
          category: 'पूजा सामग्री',
          categoryEnglish: 'Pooja Materials & Daily Offerings',
          allocatedAmount: 100000,
          fiscalYear: '2081/82 (2026)',
          notes: 'तेल, बत्ती, धुप, नैवेद्य, चन्दन'
        },
        {
          category: 'कार्यक्रम',
          categoryEnglish: 'Festivals & Annual Events',
          allocatedAmount: 150000,
          fiscalYear: '2081/82 (2026)',
          notes: 'विश्वकर्मा जयन्ती तथा संक्रान्ति उत्सव'
        },
        {
          category: 'तलब',
          categoryEnglish: 'Staff & Priest Honorarium',
          allocatedAmount: 120000,
          fiscalYear: '2081/82 (2026)',
          notes: 'पुजारी तथा सरसफाइ पारिश्रमिक'
        },
        {
          category: 'सामाजिक सेवा',
          categoryEnglish: 'Community & Social Welfare',
          allocatedAmount: 50000,
          fiscalYear: '2081/82 (2026)',
          notes: 'स्वास्थ्य शिविर तथा निःशुल्क अन्नदान'
        },
        {
          category: 'बिजुली',
          categoryEnglish: 'Electricity & Sound',
          allocatedAmount: 30000,
          fiscalYear: '2081/82 (2026)',
          notes: 'विद्युत महसुल तथा प्रकाश व्यवस्था'
        },
        {
          category: 'पानी',
          categoryEnglish: 'Water & Sanitation',
          allocatedAmount: 15000,
          fiscalYear: '2081/82 (2026)',
          notes: 'खानेपानी तथा सरसफाइ'
        },
        {
          category: 'अन्य',
          categoryEnglish: 'Miscellaneous',
          allocatedAmount: 25000,
          fiscalYear: '2081/82 (2026)',
          notes: 'आकस्मिक तथा विविध खर्च'
        }
      ]);
      console.log('✅ Budgets seeded');
    }

    // 6. Expenses
    const expenseCount = await Expense.countDocuments();
    if (expenseCount === 0) {
      await Expense.create([
        {
          voucherNumber: 'EXP-2026-0001',
          title: 'दैनिक पूजा सामग्री खरिद (तेल, धुप, अगरबत्ती, नैवेद्य)',
          category: 'पूजा सामग्री',
          categoryEnglish: 'Pooja Materials',
          amount: 8500,
          date: new Date('2026-08-05'),
          paymentMethod: 'Cash',
          description: 'साउन/भाद्र महिनाको लागि आवश्यक पूजा सामग्री'
        },
        {
          voucherNumber: 'EXP-2026-0002',
          title: 'मन्दिर प्राङ्गण सरसफाइ तथा बगैंचा मर्मत',
          category: 'मन्दिर मर्मत',
          categoryEnglish: 'Temple Renovation',
          amount: 12000,
          date: new Date('2026-08-12'),
          paymentMethod: 'Cash',
          description: 'तुलसी मठ र बाहिरी परिसर सरसफाइ'
        },
        {
          voucherNumber: 'EXP-2026-0003',
          title: 'विद्युत महसुल भुक्तानी (नेपाल विद्युत प्राधिकरण)',
          category: 'बिजुली',
          categoryEnglish: 'Electricity',
          amount: 4200,
          date: new Date('2026-08-16'),
          paymentMethod: 'eSewa',
          description: 'मन्दिर तथा लाउडस्पिकर विद्युत महसुल'
        },
        {
          voucherNumber: 'EXP-2026-0004',
          title: 'पुजारी मासिक दक्षिणा / मानदेय',
          category: 'तलब',
          categoryEnglish: 'Priest Salary',
          amount: 15000,
          date: new Date('2026-08-25'),
          paymentMethod: 'Bank Transfer',
          description: 'साउन महिनाको मानदेय भुक्तानी'
        },
        {
          voucherNumber: 'EXP-2026-0005',
          title: 'विश्वकर्मा जयन्ती ब्यानर तथा साउण्ड सिस्टम पेश्की',
          category: 'कार्यक्रम',
          categoryEnglish: 'Events',
          amount: 18000,
          date: new Date('2026-08-27'),
          paymentMethod: 'Cash',
          description: 'आगामी जयन्ती महोत्सवको प्रचारप्रसार'
        }
      ]);
      console.log('✅ Expenses seeded');
    }

    // 7. Pooja Services (Using real photos)
    const poojaCount = await Pooja.countDocuments();
    if (poojaCount === 0) {
      await Pooja.create([
        {
          title: 'सामान्य दैनिक पूजा तथा अर्चना',
          titleEnglish: 'General Daily Pooja & Archana',
          description: 'भगवान विश्वकर्माको दैनिक प्रातः तथा सन्ध्या समयमा सम्पन्न गरिने विशेष पञ्चोपचार पूजा, फलफूल तथा नैवेद्य अर्पण।',
          descriptionEnglish: 'Daily traditional morning & evening Panchopachara pooja, flower garlands, lamp lighting, and prasad offering.',
          price: 500,
          duration: '३० मिनेट',
          durationEnglish: '30 Minutes',
          image: '/assets/images/deity-altar-lamps.jpg',
          isActive: true,
          featured: true,
          order: 1
        },
        {
          title: 'विशेष विश्वकर्मा पूजा तथा दीप प्रज्वलन',
          titleEnglish: 'Special Vishwakarma Pooja & Deep Prajwalan',
          description: 'शिल्पकार, इन्जिनियर, उद्योगी तथा व्यापारी वर्गका लागि व्यापार वृद्धि, औजार तथा यन्त्रको सुरक्षा र समृद्धिको विशेष षोडशोपचार पूजा।',
          descriptionEnglish: 'Detailed Shodashopachara pooja with auspicious oil lamps for engineers, architects, technicians, and business prosperity.',
          price: 1100,
          duration: '४५ मिनेट',
          durationEnglish: '45 Minutes',
          image: '/assets/images/deity-sanctum.jpg',
          isActive: true,
          featured: true,
          order: 2
        },
        {
          title: 'हवन तथा शान्ति यज्ञ अनुष्ठान',
          titleEnglish: 'Vedic Havan & Shanti Yagya',
          description: 'ग्रह शान्ति, वास्तु दोष निवारण र पारिवारिक सुख-शान्तिका लागि मन्दिर प्राङ्गणमा पण्डितद्वारा सम्पन्न गरिने पूर्ण वैदिक हवन।',
          descriptionEnglish: 'Comprehensive Vedic Fire Ritual (Havan) performed by qualified temple priests for Graha Shanti and Vastu harmony.',
          price: 2500,
          duration: '१.५ घण्टा',
          durationEnglish: '1.5 Hours',
          image: '/assets/images/deity-altar-lamps.jpg',
          isActive: true,
          featured: true,
          order: 3
        },
        {
          title: 'अन्नपूर्णा महाप्रसाद सेवा',
          titleEnglish: 'Annapurna Mahaprasad Seva',
          description: 'शनिबार तथा विशेष उत्सवहरूमा १००+ श्रद्धालु भक्तजनहरूलाई निःशुल्क सात्विक महाप्रसाद वितरण गर्ने पुण्य सेवा।',
          descriptionEnglish: 'Sponsor free sacred satvik meals (prasad) distributed to 100+ devotees and pilgrims visiting the temple.',
          price: 5100,
          duration: 'दिनभर',
          durationEnglish: 'Full Day Seva',
          image: '/assets/images/temple-structure.jpg',
          isActive: true,
          featured: true,
          order: 4
        },
        {
          title: 'वाहन तथा यन्त्र पूजा (Vehicle & Tool Blessing)',
          titleEnglish: 'Vehicle & Machine Blessing Pooja',
          description: 'नयाँ तथा पुराना सवारी साधन (गाडी, मोटरसाइकल), यन्त्र तथा औद्योगिक मेसिनरीको रक्षा र शुभ यात्राको विशेष पूजा।',
          descriptionEnglish: 'Spiritual blessing for new and existing automobiles, industrial machinery, and tools ensuring safety and efficiency.',
          price: 1000,
          duration: '३० मिनेट',
          durationEnglish: '30 Minutes',
          image: '/assets/images/deity-portrait.jpg',
          isActive: true,
          featured: false,
          order: 5
        },
        {
          title: 'विश्वकर्मा जयन्ती विशेष महासंकल्प पूजा',
          titleEnglish: 'Vishwakarma Jayanti Grand Mahasankalpa',
          description: 'वार्षिक विश्वकर्मा जयन्तीको महान् अवसरमा तपाईंको नाम र गोत्रमा विशेष कलश स्थापना, अभिषेक र महाआरती।',
          descriptionEnglish: 'Exclusive Mahasankalpa ritual on the auspicious annual Vishwakarma Jayanti with sacred kalash and Abhishek.',
          price: 3100,
          duration: '२ घण्टा',
          durationEnglish: '2 Hours',
          image: '/assets/images/deity-portrait.jpg',
          isActive: true,
          featured: true,
          order: 6
        }
      ]);
      console.log('✅ Pooja services seeded');
    }

    // 8. Events
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      await Event.create([
        {
          title: 'श्री विश्वकर्मा जयन्ती महामहोत्सव २०८३',
          titleEnglish: 'Shri Vishwakarma Jayanti Grand Mahotsav 2026',
          description: 'सृष्टिकर्ता भगवान विश्वकर्माको जन्मोत्सवको पावन अवसरमा भव्य शोभायात्रा, अखण्ड दीप प्रज्वलन, विशेष महायज्ञ, रथयात्रा तथा सामूहिक महाप्रसाद वितरण कार्यक्रम। सम्पूर्ण श्रद्धालुहरूलाई सपरिवार आमन्त्रण गर्दछौं।',
          descriptionEnglish: 'Grand annual festival honoring Lord Vishwakarma with spiritual chariot procession, continuous Vedic havan, tools blessing, and grand community Mahaprasad.',
          date: new Date('2026-09-17'),
          time: 'बिहान ५:०० देखि राती ९:०० बजे सम्म',
          timeEnglish: '5:00 AM to 9:00 PM',
          location: 'विश्वकर्मा मन्दिर परिसर तथा छापकी नगर परिक्रमा',
          locationEnglish: 'Temple Premises & Chhapki Procession',
          bannerImage: '/assets/images/temple-structure.jpg',
          meetingUrl: 'https://meet.google.com/new',
          category: 'उत्सव',
          categoryEnglish: 'Festival',
          isFeatured: true,
          isPublished: true
        },
        {
          title: 'मासिक संक्रान्ति विशेष हवन तथा महाआरती',
          titleEnglish: 'Monthly Sankranti Special Havan & Maha Aarti',
          description: 'प्रत्येक महिनाको १ गते बिहान ८ बजे विश्व शान्ति र भक्तजनहरूको आरोग्यका लागि वैदिक मन्त्रोच्चारण सहित सामूहिक हवन तथा साँझ दीप आरती।',
          descriptionEnglish: 'Vedic community havan on every Sankranti morning followed by sunset 108-diya grand musical aarti.',
          date: new Date('2026-09-01'),
          time: 'बिहान ८:०० बजे र साँझ ६:३० बजे',
          timeEnglish: '8:00 AM & 6:30 PM',
          location: 'विश्वकर्मा मन्दिर मुख्य यज्ञशाला, छापकी',
          locationEnglish: 'Main Yagya Shala, Chhapki Temple',
          bannerImage: '/assets/images/deity-altar-lamps.jpg',
          category: 'विशेष पूजा',
          categoryEnglish: 'Special Pooja',
          isFeatured: false,
          isPublished: true
        },
        {
          title: 'शनिबारीय सामूहिक भजन कीर्तन तथा सत्संग',
          titleEnglish: 'Weekly Saturday Devotional Bhajan & Satsang',
          description: 'प्रत्येक शनिबार साँझ महिला भजन मण्डली तथा स्थानीय कलाकारहरूद्वारा प्रस्तुत गरिने सुमधुर भक्ति संगीत तथा प्रवचन।',
          descriptionEnglish: 'Every Saturday evening devotional musical bhajans, spiritual discourses, and evening prasad.',
          date: new Date('2026-09-05'),
          time: 'साँझ ५:३० देखि ७:३० सम्म',
          timeEnglish: '5:30 PM to 7:30 PM',
          location: 'मन्दिर सत्संग भवन, छापकी, सप्तरी',
          locationEnglish: 'Satsang Hall, Chhapki Temple',
          bannerImage: '/assets/images/deity-sanctum.jpg',
          category: 'सामूहिक भजन',
          categoryEnglish: 'Bhajan',
          isFeatured: false,
          isPublished: true
        },
        {
          title: 'निःशुल्क स्वास्थ्य परीक्षण तथा रक्तदान शिविर',
          titleEnglish: 'Free Health Screening & Blood Donation Camp',
          description: 'मन्दिर समितिको सामाजिक सेवा कार्यक्रम अन्तर्गत स्थानीय स्वास्थ्य चौकीको प्राविधिक सहयोगमा निःशुल्क स्वास्थ्य जाँच तथा औषधि वितरण।',
          descriptionEnglish: 'Community health outreach organized by Temple Seva Samiti offering free medical checkups and blood donation.',
          date: new Date('2026-09-12'),
          time: 'बिहान ९:०० देखि दिउँसो २:०० सम्म',
          timeEnglish: '9:00 AM to 2:00 PM',
          location: 'मन्दिर परिसर, छापकी-५, सप्तरी',
          locationEnglish: 'Temple Premises, Chhapki-5, Saptari',
          bannerImage: '/assets/images/temple-structure.jpg',
          category: 'समुदाय कार्यक्रम',
          categoryEnglish: 'Community Program',
          isFeatured: true,
          isPublished: true
        }
      ]);
      console.log('✅ Events seeded');
    }

    // 9. Gallery Items (All 4 Real Photos)
    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      await Gallery.create([
        {
          title: 'भगवान श्री विश्वकर्माको मुख्य दिव्य विग्रह',
          titleEnglish: 'Divine Idol of Lord Vishwakarma in Sanctum',
          imageUrl: '/assets/images/deity-portrait.jpg',
          category: 'Bhagwan',
          categoryNepali: 'भगवान',
          isFeatured: true,
          description: 'छापकी मन्दिरको गर्भगृहमा सुशोभित भगवान विश्वकर्माको मुकुटधारी अभयमुद्रा स्वरूप।',
          order: 1
        },
        {
          title: 'गर्भगृह पञ्चदीप प्रज्वलन तथा पूजा आराधना',
          titleEnglish: 'Panchadeep Altar & Sacred Offerings',
          imageUrl: '/assets/images/deity-altar-lamps.jpg',
          category: 'Pooja',
          categoryNepali: 'पूजा',
          isFeatured: true,
          description: 'पाँच दियोहरूको पवित्र ज्योति, नैवेद्य, फलफूल तथा कलश सहितको आरती स्वरूप।',
          order: 2
        },
        {
          title: 'पवित्र मण्डप तथा पुष्प सज्जा दर्शन',
          titleEnglish: 'Sanctum Floral Garland & Sacred Shodashopachara',
          imageUrl: '/assets/images/deity-sanctum.jpg',
          category: 'Pooja',
          categoryNepali: 'पूजा',
          isFeatured: true,
          description: 'कमल, सयपत्री र गुलाफका मालाले सजिएको गर्भगृहको शान्त वातावरण।',
          order: 3
        },
        {
          title: 'श्री विश्वकर्मा मन्दिर भवन तथा तुलसी मठ',
          titleEnglish: 'Temple Shikhara Architecture & Holy Tulsi Math',
          imageUrl: '/assets/images/temple-structure.jpg',
          category: 'Temple',
          categoryNepali: 'मन्दिर',
          isFeatured: true,
          description: 'छापकी, सप्तरीको प्राकृतिक हरियाली बीच अवस्थित शिखर शैलीको मन्दिर भवन र खुला प्राङ्गण।',
          order: 4
        }
      ]);
      console.log('✅ Real Photo Gallery items seeded');
    }

    // 10. Virtual Meeting & Live Darshan
    const meetingCount = await Meeting.countDocuments();
    if (meetingCount === 0) {
      await Meeting.create([
        {
          type: 'VirtualMeeting',
          title: 'विश्वकर्मा मन्दिर साप्ताहिक भर्चुअल सत्संग तथा समीक्षा बैठक',
          titleEnglish: 'Vishwakarma Temple Weekly Virtual Satsang & Review',
          platform: 'Google Meet',
          meetingUrl: 'https://meet.google.com/new',
          date: 'प्रत्येक शनिबार (Every Saturday)',
          time: 'साँझ ६:०० देखि ७:०० बजे सम्म',
          timeEnglish: '6:00 PM to 7:00 PM',
          description: 'विश्वकर्मा मन्दिर छापकी, सप्तरीको नियमित साप्ताहिक समीक्षा तथा आध्यात्मिक सत्संग। देश विदेशका सम्पूर्ण भक्तजनहरू आमन्त्रित हुनुहुन्छ।',
          descriptionEnglish: 'Weekly spiritual review and temple development updates. Devotees worldwide can connect seamlessly.',
          isActive: true
        },
        {
          type: 'LiveDarshan',
          title: 'प्रत्यक्ष मन्दिर दर्शन तथा आरती (Live Darshan)',
          titleEnglish: 'Live Temple Darshan & Mangal Aarti',
          platform: 'YouTube Live',
          streamUrl: 'https://www.youtube.com',
          time: 'बिहान ७:०० र साँझ ६:३० आरती',
          timeEnglish: '7:00 AM & 6:30 PM Daily Aarti',
          description: 'भगवान विश्वकर्माको गर्भगृहबाट दैनिक प्रातः र सन्ध्या महाआरतीको प्रत्यक्ष प्रसारण।',
          descriptionEnglish: 'Live stream of daily Morning and Evening Aarti directly from Chhapki sanctum.',
          isActive: true,
          isLiveNow: false
        }
      ]);
      console.log('✅ Virtual Meeting & Live Darshan configs initialized');
    }

    // 11. Tole Houses (Single and Joint Families)
    const houseCount = await House.countDocuments();
    let seededHouses = [];
    if (houseCount === 0) {
      seededHouses = await House.create([
        {
          houseId: 'HOUSE-0001',
          houseNumber: '१०१',
          tole: 'छापकी (Chhapki)',
          ward: '५',
          address: 'छापकी-५, मन्दिर मार्ग, सप्तरी',
          familyType: 'Joint Family',
          representativeName: 'राम प्रसाद शर्मा',
          representativePhone: '9852011111',
          alternatePhone: '9804011111',
          email: 'ram.sharma@gmail.com',
          status: 'Active',
          notes: 'मन्दिर तथा टोल विकास समितिका सक्रिय सल्लाहकार',
          familyMembers: [
            { memberId: 'MEM-0001', fullName: 'हरिनारायण शर्मा', gender: 'Male', relationship: 'हजुरबुबा (Grandfather)', age: 78, occupation: 'निवृत्त शिक्षक', isRepresentative: false, status: 'Active' },
            { memberId: 'MEM-0002', fullName: 'कौशल्या देवी शर्मा', gender: 'Female', relationship: 'हजुरआमा (Grandmother)', age: 74, occupation: 'गृहिणी', isRepresentative: false, status: 'Active' },
            { memberId: 'MEM-0003', fullName: 'राम प्रसाद शर्मा', gender: 'Male', relationship: 'घरमुली (Head)', phone: '9852011111', age: 52, occupation: 'इन्जिनियर तथा व्यवसाय', isRepresentative: true, status: 'Active' },
            { memberId: 'MEM-0004', fullName: 'सीता शर्मा', gender: 'Female', relationship: 'श्रीमती (Wife)', age: 48, occupation: 'शिक्षिका', isRepresentative: false, status: 'Active' },
            { memberId: 'MEM-0005', fullName: 'अमित शर्मा', gender: 'Male', relationship: 'छोरा (Son)', age: 26, occupation: 'सफ्टवेयर इन्जिनियर', isRepresentative: false, status: 'Active' },
            { memberId: 'MEM-0006', fullName: 'पुजा शर्मा', gender: 'Female', relationship: 'बुहारी (Daughter-in-law)', age: 24, occupation: 'अध्ययनरत', isRepresentative: false, status: 'Active' }
          ]
        },
        {
          houseId: 'HOUSE-0002',
          houseNumber: '१०२',
          tole: 'छापकी (Chhapki)',
          ward: '५',
          address: 'छापकी-५, पूर्व टोल, सप्तरी',
          familyType: 'Single Family',
          representativeName: 'श्याम सुन्दर यादव',
          representativePhone: '9852022222',
          alternatePhone: '9804022222',
          email: 'shyam.yadav@gmail.com',
          status: 'Active',
          notes: 'कृषि तथा दुग्ध व्यवसाय',
          familyMembers: [
            { memberId: 'MEM-0007', fullName: 'श्याम सुन्दर यादव', gender: 'Male', relationship: 'घरमुली (Head)', phone: '9852022222', age: 45, occupation: 'कृषि उद्यमी', isRepresentative: true, status: 'Active' },
            { memberId: 'MEM-0008', fullName: 'राधा देवी यादव', gender: 'Female', relationship: 'श्रीमती (Wife)', age: 42, occupation: 'गृहिणी', isRepresentative: false, status: 'Active' },
            { memberId: 'MEM-0009', fullName: 'रोशन यादव', gender: 'Male', relationship: 'छोरा (Son)', age: 19, occupation: 'विद्यार्थी', isRepresentative: false, status: 'Active' },
            { memberId: 'MEM-0010', fullName: 'अञ्जली यादव', gender: 'Female', relationship: 'छोरी (Daughter)', age: 16, occupation: 'विद्यार्थी', isRepresentative: false, status: 'Active' }
          ]
        },
        {
          houseId: 'HOUSE-0003',
          houseNumber: '१०३',
          tole: 'छापकी (Chhapki)',
          ward: '५',
          address: 'छापकी-५, विद्यालय मार्ग, सप्तरी',
          familyType: 'Joint Family',
          representativeName: 'नारायण दास ठाकुर',
          representativePhone: '9852033333',
          alternatePhone: '9804033333',
          email: 'narayan.thakur@gmail.com',
          status: 'Active',
          notes: 'काष्ठकला तथा निर्माण व्यवसायी',
          familyMembers: [
            { memberId: 'MEM-0011', fullName: 'विश्वम्भर ठाकुर', gender: 'Male', relationship: 'बुबा (Father)', age: 72, occupation: 'शिल्पकार', isRepresentative: false, status: 'Active' },
            { memberId: 'MEM-0012', fullName: 'पार्वती देवी', gender: 'Female', relationship: 'आमा (Mother)', age: 68, occupation: 'गृहिणी', isRepresentative: false, status: 'Active' },
            { memberId: 'MEM-0013', fullName: 'नारायण दास ठाकुर', gender: 'Male', relationship: 'घरमुली (Head)', phone: '9852033333', age: 46, occupation: 'काष्ठशिल्प उद्यमी', isRepresentative: true, status: 'Active' },
            { memberId: 'MEM-0014', fullName: 'लक्ष्मी ठाकुर', gender: 'Female', relationship: 'श्रीमती (Wife)', age: 41, occupation: 'गृहिणी', isRepresentative: false, status: 'Active' },
            { memberId: 'MEM-0015', fullName: 'दिनेश ठाकुर', gender: 'Male', relationship: 'भाइ (Brother)', age: 38, occupation: 'प्राविधिक', isRepresentative: false, status: 'Active' }
          ]
        },
        {
          houseId: 'HOUSE-0004',
          houseNumber: '१०४',
          tole: 'छापकी (Chhapki)',
          ward: '५',
          address: 'छापकी-५, दक्षिण टोल, सप्तरी',
          familyType: 'Single Family',
          representativeName: 'गोविन्द प्रसाद साह',
          representativePhone: '9852044444',
          status: 'Active',
          familyMembers: [
            { memberId: 'MEM-0016', fullName: 'गोविन्द प्रसाद साह', gender: 'Male', relationship: 'घरमुली (Head)', phone: '9852044444', age: 40, occupation: 'व्यापार', isRepresentative: true, status: 'Active' },
            { memberId: 'MEM-0017', fullName: 'सरस्वती साह', gender: 'Female', relationship: 'श्रीमती (Wife)', age: 36, occupation: 'व्यापार सहयोगी', isRepresentative: false, status: 'Active' },
            { memberId: 'MEM-0018', fullName: 'प्रमोद साह', gender: 'Male', relationship: 'छोरा (Son)', age: 14, occupation: 'विद्यार्थी', isRepresentative: false, status: 'Active' }
          ]
        },
        {
          houseId: 'HOUSE-0005',
          houseNumber: '१०५',
          tole: 'छापकी (Chhapki)',
          ward: '५',
          address: 'छापकी-५, पोखरी टोल, सप्तरी',
          familyType: 'Joint Family',
          representativeName: 'सुरेश कुमार मण्डल',
          representativePhone: '9852055555',
          status: 'Active',
          familyMembers: [
            { memberId: 'MEM-0019', fullName: 'सुरेश कुमार मण्डल', gender: 'Male', relationship: 'घरमुली (Head)', phone: '9852055555', age: 50, occupation: 'सामाजिक कार्यकर्ता', isRepresentative: true, status: 'Active' },
            { memberId: 'MEM-0020', fullName: 'सुमित्रा देवी', gender: 'Female', relationship: 'श्रीमती (Wife)', age: 46, occupation: 'गृहिणी', isRepresentative: false, status: 'Active' },
            { memberId: 'MEM-0021', fullName: 'सुनील मण्डल', gender: 'Male', relationship: 'छोरा (Son)', age: 24, occupation: 'वैदेशिक रोजगार', isRepresentative: false, status: 'Abroad' }
          ]
        }
      ]);
      console.log('✅ 5 Tole Houses & Families seeded');
    } else {
      seededHouses = await House.find();
    }

    // 12. Tole Meetings & Batch Attendance
    const toleMeetingCount = await ToleMeeting.countDocuments();
    if (toleMeetingCount === 0 && seededHouses.length > 0) {
      const m1 = await ToleMeeting.create({
        meetingId: 'MTG-2026-0001',
        title: 'मासिक टोल सरसफाइ तथा विश्वकर्मा पूजा तयारी बैठक',
        titleEnglish: 'Monthly Tole Sanitation & Vishwakarma Pooja Planning',
        date: new Date('2026-08-01T08:00:00Z'),
        time: 'बिहान ८:०० बजे',
        location: 'श्री विश्वकर्मा मन्दिर सामुदायिक भवन, छापकी',
        meetingType: 'Regular Meeting',
        agenda: 'टोलको बाटो मर्मत, पोखरी संरक्षण, मन्दिरको रंगरोगन र भदौ १ को वार्षिक पूजाको कार्यतालिका।',
        description: 'टोलका सम्पूर्ण घरधुरीको उपस्थितिमा उत्साहजनक छलफल र निर्णयहरू पारित गरियो।',
        status: 'Completed',
        totalHouses: seededHouses.length,
        presentCount: 4,
        absentCount: 1,
        excusedCount: 0,
        attendancePercentage: 80,
        images: ['/assets/images/temple-structure.jpg', '/assets/images/deity-altar-lamps.jpg']
      });

      const m2 = await ToleMeeting.create({
        meetingId: 'MTG-2026-0002',
        title: 'वार्षिक आय-व्यय समीक्षा तथा जलाशय संरक्षण विशेष बैठक',
        titleEnglish: 'Annual Financial Review & Pokhari Conservation Meeting',
        date: new Date('2026-08-20T08:00:00Z'),
        time: 'बिहान ८:३० बजे',
        location: 'श्री विश्वकर्मा मन्दिर परिसर, छापकी',
        meetingType: 'General Meeting',
        agenda: 'जलाहवा र गोसाइँ पोखरीको ठेक्का आम्दानी, मासिक कोषको स्थिति तथा आगामी बजेट।',
        status: 'Completed',
        totalHouses: seededHouses.length,
        presentCount: 5,
        absentCount: 0,
        excusedCount: 0,
        attendancePercentage: 100
      });

      const m3 = await ToleMeeting.create({
        meetingId: 'MTG-2026-0003',
        title: 'असोज महिनाको नियमित टोल विकास तथा सुरक्षा समन्वय बैठक',
        titleEnglish: 'September Monthly Tole Development & Security Meeting',
        date: new Date('2026-09-10T08:00:00Z'),
        time: 'बिहान ८:०० बजे',
        location: 'मन्दिर सभाहल, छापकी-५, सप्तरी',
        meetingType: 'Regular Meeting',
        agenda: 'दसैं-तिहार पर्व सुरक्षा, सौर्य बत्ती व्यवस्थापन र टोल कोष संकलन।',
        status: 'Scheduled',
        totalHouses: seededHouses.length
      });

      // Seed attendance records for m1
      await MeetingAttendance.create([
        { meeting: m1._id, house: seededHouses[0]._id, houseId: seededHouses[0].houseId, houseNumber: seededHouses[0].houseNumber, representativeName: seededHouses[0].representativeName, status: 'Present', date: m1.date },
        { meeting: m1._id, house: seededHouses[1]._id, houseId: seededHouses[1].houseId, houseNumber: seededHouses[1].houseNumber, representativeName: seededHouses[1].representativeName, status: 'Present', date: m1.date },
        { meeting: m1._id, house: seededHouses[2]._id, houseId: seededHouses[2].houseId, houseNumber: seededHouses[2].houseNumber, representativeName: seededHouses[2].representativeName, status: 'Present', date: m1.date },
        { meeting: m1._id, house: seededHouses[3]._id, houseId: seededHouses[3].houseId, houseNumber: seededHouses[3].houseNumber, representativeName: seededHouses[3].representativeName, status: 'Absent', date: m1.date, fineImposed: true, fineAmount: 100, remarks: 'बिना जानकारी अनुपस्थित' },
        { meeting: m1._id, house: seededHouses[4]._id, houseId: seededHouses[4].houseId, houseNumber: seededHouses[4].houseNumber, representativeName: seededHouses[4].representativeName, status: 'Present', date: m1.date }
      ]);
      console.log('✅ Tole Meetings & Attendance seeded');
    }

    // 13. Fines
    const fineCount = await Fine.countDocuments();
    if (fineCount === 0 && seededHouses.length > 3) {
      await Fine.create([
        {
          fineId: 'FINE-2026-0001',
          house: seededHouses[3]._id,
          houseId: seededHouses[3].houseId,
          personName: seededHouses[3].representativeName,
          fineType: 'Meeting Absence',
          amount: 100,
          paidAmount: 0,
          reason: 'श्रावण १ गतेको नियमित बैठकमा बिना जानकारी अनुपस्थित',
          date: new Date('2026-08-01'),
          status: 'Pending'
        },
        {
          fineId: 'FINE-2026-0002',
          house: seededHouses[1]._id,
          houseId: seededHouses[1].houseId,
          personName: seededHouses[1].representativeName,
          fineType: 'Late Attendance',
          amount: 50,
          paidAmount: 50,
          reason: 'बैठकमा १ घण्टा ढिलो उपस्थिति',
          date: new Date('2026-07-15'),
          status: 'Paid',
          paymentDate: new Date('2026-07-15'),
          paymentMethod: 'Cash',
          receiptNumber: 'FRCP-0001'
        }
      ]);
      console.log('✅ Tole Fines seeded');
    }

    // 14. Weddings
    const weddingCount = await Wedding.countDocuments();
    if (weddingCount === 0) {
      await Wedding.create([
        {
          weddingId: 'WED-2026-0001',
          brideName: 'पुजा शर्मा',
          groomName: 'अमित शर्मा (घर नं. १०१)',
          brideHouse: 'राजविराज-३, सप्तरी',
          groomHouse: 'छापकी-५, घर नं. १०१',
          weddingDate: new Date('2026-09-18T10:00:00Z'),
          weddingDateNepali: '२०८३ असोज २ गते (शुक्रबार)',
          weddingType: 'Traditional Hindu',
          contactPerson: 'राम प्रसाद शर्मा',
          contactPhone: '9852011111',
          location: 'श्री विश्वकर्मा मन्दिर विवाह मण्डप, छापकी',
          status: 'Upcoming',
          notes: 'वैदिक सनातन परम्परा अनुसार मन्दिर प्राङ्गणमा विवाह अनुष्ठान'
        },
        {
          weddingId: 'WED-2026-0002',
          brideName: 'अञ्जली यादव (घर नं. १०२)',
          groomName: 'विजय यादव',
          brideHouse: 'छापकी-५, घर नं. १०२',
          groomHouse: 'कञ्चनरूप-४, सप्तरी',
          weddingDate: new Date('2026-11-25T10:00:00Z'),
          weddingDateNepali: '२०८३ मंसिर ९ गते',
          weddingType: 'Traditional Hindu',
          contactPerson: 'श्याम सुन्दर यादव',
          contactPhone: '9852022222',
          status: 'Upcoming'
        }
      ]);
      console.log('✅ Tole Weddings seeded');
    }

    // 15. Tole Leadership (5 Candidates / Committee Members)
    const candidateCount = await ToleCandidate.countDocuments();
    if (candidateCount === 0) {
      await ToleCandidate.create([
        {
          candidateId: 'CAN-001',
          fullName: 'पण्डित रमेश आचार्य',
          fullNameDevanagari: 'पण्डित रमेश आचार्य',
          houseNumber: '१०१',
          position: 'Tole President',
          positionDevanagari: 'टोल अध्यक्ष',
          profileImage: '/assets/images/deity-portrait.jpg',
          bio: 'समाजसेवी तथा धार्मिक व्यक्तित्व। विगत १५ वर्षदेखि छापकी टोलको सामाजिक विकास, मन्दिर संरक्षण र शिक्षा अभियानमा निरन्तर क्रियाशील।',
          phone: '9852012345',
          status: 'Active',
          displayOrder: 1
        },
        {
          candidateId: 'CAN-002',
          fullName: 'श्री नारायण दास ठाकुर',
          fullNameDevanagari: 'श्री नारायण दास ठाकुर',
          houseNumber: '१०३',
          position: 'Vice President',
          positionDevanagari: 'उपाध्यक्ष',
          profileImage: '/assets/images/temple-structure.jpg',
          bio: 'काष्ठशिल्प उद्यमी तथा युवा संयोजक। टोलका पूर्वाधार निर्माण र युवा परिचालनमा अग्रणी भूमिका।',
          phone: '9852033333',
          status: 'Active',
          displayOrder: 2
        },
        {
          candidateId: 'CAN-003',
          fullName: 'ई. राम प्रसाद शर्मा',
          fullNameDevanagari: 'ई. राम प्रसाद शर्मा',
          houseNumber: '१०१',
          position: 'Secretary',
          positionDevanagari: 'सचिव',
          profileImage: '/assets/images/deity-altar-lamps.jpg',
          bio: 'इन्जिनियर तथा टोल योजनाकार। पारदर्शी अभिलेखीकरण, डिजिटल व्यवस्थापन र बैठक सञ्चालनको जिम्मेवारी।',
          phone: '9852011111',
          status: 'Active',
          displayOrder: 3
        },
        {
          candidateId: 'CAN-004',
          fullName: 'श्रीमती सीता शर्मा',
          fullNameDevanagari: 'श्रीमती सीता शर्मा',
          houseNumber: '१०१',
          position: 'Treasurer',
          positionDevanagari: 'कोषाध्यक्ष',
          profileImage: '/assets/images/deity-sanctum.jpg',
          bio: 'शिक्षिका तथा महिला सशक्तिकरण अभियान्ता। मासिक कोष संकलन, आर्थिक पारदर्शिता र लेखा व्यवस्थापनको नेतृत्व।',
          phone: '9804011111',
          status: 'Active',
          displayOrder: 4
        },
        {
          candidateId: 'CAN-005',
          fullName: 'श्री श्याम सुन्दर यादव',
          fullNameDevanagari: 'श्री श्याम सुन्दर यादव',
          houseNumber: '१०२',
          position: 'Executive Member',
          positionDevanagari: 'कार्यसमिति सदस्य',
          profileImage: '/assets/images/temple-logo.svg',
          bio: 'कृषि व्यवसायी तथा वातावरण संरक्षण अभियान्ता। जलाहवा तथा गोसाइँ पोखरी संरक्षण तथा वृक्षारोपण संयोजक।',
          phone: '9852022222',
          status: 'Active',
          displayOrder: 5
        }
      ]);
      console.log('✅ 5 Tole Leadership Candidates seeded');
    }

    // 16. Temple Income (Pokhari 1 - Jalahawa, Pokhari 2 - Gosai, Rentals)
    const incomeCount = await TempleIncome.countDocuments();
    if (incomeCount === 0) {
      await TempleIncome.create([
        {
          incomeId: 'INC-2026-0001',
          sourceName: 'जलाहवा पोखरी (Jalahawa Pokhari)',
          sourceCategory: 'Pokhari',
          amount: 125000,
          date: new Date('2026-07-01'),
          description: 'जलाहवा पोखरी मत्स्यपालन ठेक्का वार्षिक प्रथम किस्ता आम्दानी',
          receivedBy: 'सीता शर्मा (कोषाध्यक्ष)',
          payerName: 'मत्स्य व्यवसायी समूह, सप्तरी',
          payerPhone: '9842811223',
          paymentMethod: 'Bank Transfer',
          transactionId: 'NBL-TXN-882193'
        },
        {
          incomeId: 'INC-2026-0002',
          sourceName: 'गोसाइँ पोखरी (Gosai Pokhari)',
          sourceCategory: 'Pokhari',
          amount: 95000,
          date: new Date('2026-07-15'),
          description: 'गोसाइँ पोखरी कमल तथा सिंघाडा खेती ठेक्का आम्दानी',
          receivedBy: 'सीता शर्मा (कोषाध्यक्ष)',
          payerName: 'गोसाइँ कृषि फार्म, छापकी',
          payerPhone: '9842899887',
          paymentMethod: 'Bank Transfer',
          transactionId: 'NBL-TXN-883401'
        },
        {
          incomeId: 'INC-2026-0003',
          sourceName: 'घर/सटर भाडा',
          sourceCategory: 'Rental',
          amount: 15000,
          date: new Date('2026-08-01'),
          description: 'मन्दिर अगाडिको सटर मासिक भाडा (साउन महिना)',
          receivedBy: 'रमेश आचार्य (अध्यक्ष)',
          payerName: 'पूजा सामग्री पसल',
          paymentMethod: 'Cash'
        }
      ]);
      console.log('✅ Temple Income (Jalahawa & Gosai Pokhari) seeded');
    }

    // 17. Monthly Fund Campaigns & Payments
    const campaignCount = await FundCampaign.countDocuments();
    if (campaignCount === 0 && seededHouses.length > 0) {
      const campAug = await FundCampaign.create({
        campaignId: 'CAMP-2026-08',
        title: 'साउन २०८३ टोल मासिक कोष संकलन',
        titleEnglish: 'August 2026 Tole Monthly Fund Collection',
        month: 'August',
        year: 2026,
        amountPerHouse: 1000,
        startDate: new Date('2026-08-01'),
        endDate: new Date('2026-08-31'),
        status: 'Closed',
        targetHouses: seededHouses.length,
        totalExpectedAmount: seededHouses.length * 1000,
        totalCollectedAmount: 4000
      });

      const campSep = await FundCampaign.create({
        campaignId: 'CAMP-2026-09',
        title: 'भदौ २०८३ टोल मासिक कोष संकलन अभियान',
        titleEnglish: 'September 2026 Tole Monthly Fund Collection Campaign',
        month: 'September',
        year: 2026,
        amountPerHouse: 1000,
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-09-30'),
        status: 'Active',
        targetHouses: seededHouses.length,
        totalExpectedAmount: seededHouses.length * 1000,
        totalCollectedAmount: 2000
      });

      // Seed payments for September
      await FundPayment.create([
        {
          paymentId: 'TFC-2026-0001',
          receiptNumber: 'REC-2026-0001',
          campaign: campSep._id,
          campaignMonth: 'September',
          campaignYear: 2026,
          house: seededHouses[0]._id,
          houseId: seededHouses[0].houseId,
          houseNumber: seededHouses[0].houseNumber,
          memberName: seededHouses[0].representativeName,
          phone: seededHouses[0].representativePhone,
          amount: 1000,
          paymentMethod: 'eSewa',
          transactionId: 'ESEWA-9928172',
          status: 'Approved',
          submittedDate: new Date('2026-09-02'),
          approvedDate: new Date('2026-09-02'),
          approvedBy: 'सीता शर्मा (कोषाध्यक्ष)'
        },
        {
          paymentId: 'TFC-2026-0002',
          receiptNumber: 'REC-2026-0002',
          campaign: campSep._id,
          campaignMonth: 'September',
          campaignYear: 2026,
          house: seededHouses[1]._id,
          houseId: seededHouses[1].houseId,
          houseNumber: seededHouses[1].houseNumber,
          memberName: seededHouses[1].representativeName,
          phone: seededHouses[1].representativePhone,
          amount: 1000,
          paymentMethod: 'Khalti',
          transactionId: 'KHALTI-182763',
          status: 'Approved',
          submittedDate: new Date('2026-09-03'),
          approvedDate: new Date('2026-09-03'),
          approvedBy: 'सीता शर्मा (कोषाध्यक्ष)'
        },
        {
          paymentId: 'TFC-2026-0003',
          receiptNumber: 'REC-2026-0003',
          campaign: campSep._id,
          campaignMonth: 'September',
          campaignYear: 2026,
          house: seededHouses[2]._id,
          houseId: seededHouses[2].houseId,
          houseNumber: seededHouses[2].houseNumber,
          memberName: seededHouses[2].representativeName,
          phone: seededHouses[2].representativePhone,
          amount: 1000,
          paymentMethod: 'Fonepay',
          transactionId: 'FONEPAY-773821',
          status: 'Pending',
          submittedDate: new Date('2026-09-05')
        }
      ]);
      console.log('✅ Monthly Fund Campaigns & Payments seeded');
    }

    console.log('✨ Database seeding complete successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// If run directly via node
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  (async () => {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  })();
}
