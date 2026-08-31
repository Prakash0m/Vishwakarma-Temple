import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    templeNameNepali: {
      type: String,
      default: 'विश्वकर्मा मन्दिर'
    },
    templeNameEnglish: {
      type: String,
      default: 'Vishwakarma Temple'
    },
    templeLocationNepali: {
      type: String,
      default: 'छापकी (वडा नं. ५), सप्तरी, नेपाल'
    },
    templeLocationEnglish: {
      type: String,
      default: 'Chhapki (Ward No. 5), Saptari, Nepal'
    },
    heroEyebrowNepali: {
      type: String,
      default: 'ॐ श्री विश्वकर्मणे नमः'
    },
    heroEyebrowEnglish: {
      type: String,
      default: 'Om Shri Vishwakarmane Namah'
    },
    heroTitleNepali: {
      type: String,
      default: 'विश्वकर्मा भगवानको शरणमा स्वागत छ'
    },
    heroTitleEnglish: {
      type: String,
      default: 'Welcome to the Divine Presence of Lord Vishwakarma'
    },
    heroSubtitleNepali: {
      type: String,
      default: 'सृष्टि, वास्तुकला र शिल्पकलाका अधिष्ठाता भगवान विश्वकर्माको पवित्र प्राङ्गण छापकी, सप्तरी (मधेश प्रदेश) मा हार्दिक नमन गर्दछौं।'
    },
    heroSubtitleEnglish: {
      type: String,
      default: 'Devoted to the divine supreme architect, engineer, and creator in the sacred settlement of Chhapki, Saptari, Madhesh Province, Nepal.'
    },
    heroImage: {
      type: String,
      default: '/assets/images/deity-portrait.jpg'
    },
    aboutTitleNepali: {
      type: String,
      default: 'हाम्रो मन्दिरको बारेमा'
    },
    aboutTitleEnglish: {
      type: String,
      default: 'About Vishwakarma Temple'
    },
    aboutDescriptionNepali: {
      type: String,
      default: 'सप्तरी जिल्लाको अग्निसाइर कृष्णासवरण गाउँपालिका वडा नं. ५, छापकीको पवित्र भूमिमा अवस्थित श्री विश्वकर्मा मन्दिर शिल्पकार, श्रमिक, प्राविधिक तथा सम्पूर्ण श्रद्धालु भक्तजनहरूको आस्थाको धरोहर हो। मन्दिरले सनातन धर्म, संस्कृति संरक्षण, दैनिक पूजा-आराधना र सामाजिक सेवाका विभिन्न कार्यहरू निरन्तर सञ्चालन गर्दै आएको छ।'
    },
    aboutDescriptionEnglish: {
      type: String,
      default: 'Located in the sacred settlement of Chhapki (Ward No. 5), Agnisair Krishnasavaran Rural Municipality, Saptari District (Madhesh Province, Nepal), the Vishwakarma Temple serves as a sanctum of spiritual devotion, cultural heritage, and community empowerment.'
    },
    aboutImage: {
      type: String,
      default: '/assets/images/temple-structure.jpg'
    },
    establishedYear: {
      type: String,
      default: '२०५५ (1998 AD)'
    },
    devoteesCount: {
      type: String,
      default: '१०,०००+'
    },
    annualEventsCount: {
      type: String,
      default: '२४+'
    },
    communityProjectsCount: {
      type: String,
      default: '१००% पारदर्शी'
    },
    dailyPoojaTimeNepali: {
      type: String,
      default: 'बिहान ६:०० देखि साँझ ७:०० सम्म'
    },
    dailyPoojaTimeEnglish: {
      type: String,
      default: '6:00 AM to 7:00 PM Daily'
    },
    specialPoojaTimeNepali: {
      type: String,
      default: 'प्रत्येक शनिबार तथा संक्रान्ति'
    },
    specialPoojaTimeEnglish: {
      type: String,
      default: 'Every Saturday & Sankranti'
    },
    phone: {
      type: String,
      default: '+९७७-३१-५२०१२३'
    },
    secondaryPhone: {
      type: String,
      default: '+९७७ ९८५२८९९९९९'
    },
    email: {
      type: String,
      default: 'info@vishwakarmatemple.org.np'
    },
    addressNepali: {
      type: String,
      default: 'छापकी (वडा नं. ५), अग्निसाइर कृष्णासवरण गाउँपालिका, सप्तरी जिल्ला, मधेश प्रदेश, नेपाल'
    },
    addressEnglish: {
      type: String,
      default: 'Chhapki (Ward No. 5), Agnisair Krishnasavaran Rural Municipality, Saptari District, Madhesh Province, Nepal'
    },
    googleMapsUrl: {
      type: String,
      default: 'https://www.google.com/maps/place/Vishwakarma+Temple/@26.6052464,86.8144002,974m/'
    },
    googleMapsEmbedUrl: {
      type: String,
      default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.298285514603!2d86.8144002!3d26.6052464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef0585fca58f8b%3A0xb3558fe3fa34b5c7!2sVishwakarma%20Temple!5e0!3m2!1sen!2snp!4v1709210000000!5m2!1sen!2snp'
    },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com/vishwakarmatemple.chhapki' },
      youtube: { type: String, default: 'https://youtube.com/@vishwakarmatemple' },
      instagram: { type: String, default: 'https://instagram.com/vishwakarmatemple' },
      tiktok: { type: String, default: 'https://tiktok.com/@vishwakarmatemple' }
    },
    bankDetails: {
      bankName: { type: String, default: 'Nepal Bank Limited, Saptari' },
      accountName: { type: String, default: 'Shri Vishwakarma Mandir Samiti, Chhapki' },
      accountNumber: { type: String, default: '01200100234567000001' },
      branch: { type: String, default: 'Kanchanpur / Rupani Branch, Saptari' },
      fonepayNumber: { type: String, default: '9852899999' },
      esewaId: { type: String, default: '9852899999' },
      khaltiId: { type: String, default: '9852899999' }
    },
    donorPrivacyDisplay: {
      type: String,
      enum: ['public', 'initials', 'anonymous', 'disabled'],
      default: 'public'
    },
    showDonationSection: {
      type: Boolean,
      default: true
    },
    showDonorList: {
      type: Boolean,
      default: true
    },
    showLiveDarshan: {
      type: Boolean,
      default: true
    },
    showMeeting: {
      type: Boolean,
      default: true
    },
    showEvents: {
      type: Boolean,
      default: true
    },
    showGallery: {
      type: Boolean,
      default: true
    },
    showTransparency: {
      type: Boolean,
      default: true
    },
    showPooja: {
      type: Boolean,
      default: true
    },
    transparencyNoticeNepali: {
      type: String,
      default: 'मन्दिरका आर्थिक गतिविधिहरू पारदर्शी र व्यवस्थित रूपमा व्यवस्थापन गरिन्छ।'
    },
    transparencyNoticeEnglish: {
      type: String,
      default: 'All financial offerings, donations, and expenditures are recorded transparently with full accountability.'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Setting', settingSchema);
