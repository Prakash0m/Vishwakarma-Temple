import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { getImageUrl } from '../../utils/imageOptimizer';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  X,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  FileImage,
  Sliders,
  Check
} from 'lucide-react';

const CATEGORIES = [
  { key: 'Temple', ne: 'मन्दिर' },
  { key: 'Bhagwan', ne: 'भगवान' },
  { key: 'Pooja', ne: 'पूजा' },
  { key: 'Events', ne: 'कार्यक्रम' },
  { key: 'Bhajan', ne: 'भजन' },
  { key: 'Devotees', ne: 'भक्तजन' },
  { key: 'Donation', ne: 'दान तथा सेवा' },
  { key: 'Festival', ne: 'उत्सव' },
  { key: 'Other', ne: 'अन्य' }
];

const GalleryView = () => {
  const { language } = useLanguage();
  const { addToast } = useToast();

  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Selected File & Pre-upload Preview State
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileMetadata, setFileMetadata] = useState({ name: '', size: '', dimensions: '' });
  const [fileError, setFileError] = useState('');

  // Upload Progress State
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    titleEnglish: '',
    category: 'Temple',
    categoryNepali: 'मन्दिर',
    description: '',
    altText: '',
    isFeatured: false,
    imageUrl: '',
    blobPathname: ''
  });

  // Delete Confirmation Modal State
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Failed Images Track for Custom Devotional Fallback
  const [failedImages, setFailedImages] = useState({});

  // 1. Fetch Gallery Data from Centralized Database
  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await api.get('/gallery');
      if (res.data.success) {
        setGallery(res.data.data);
      }
    } catch (err) {
      console.error('Fetch gallery error:', err);
      addToast('ग्यालरी तस्वीरहरू लोड गर्न सकिएन।', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // 2. Open Add Photo Modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setSelectedFile(null);
    setFilePreview(null);
    setFileMetadata({ name: '', size: '', dimensions: '' });
    setFileError('');
    setUploadProgress(0);
    setFormData({
      title: '',
      titleEnglish: '',
      category: 'Temple',
      categoryNepali: 'मन्दिर',
      description: '',
      altText: '',
      isFeatured: false,
      imageUrl: '',
      blobPathname: ''
    });
    setIsModalOpen(true);
  };

  // 3. Open Edit Photo Modal
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setSelectedFile(null);
    setFilePreview(item.imageUrl);
    setFileMetadata({
      name: item.blobPathname || 'हालको तस्वीर (Current Image)',
      size: 'क्लाउड सुरक्षित',
      dimensions: 'मूल अनुपात'
    });
    setFileError('');
    setUploadProgress(0);
    setFormData({
      title: item.title,
      titleEnglish: item.titleEnglish || '',
      category: item.category,
      categoryNepali: item.categoryNepali || 'मन्दिर',
      description: item.description || '',
      altText: item.altText || item.title,
      isFeatured: item.isFeatured || false,
      imageUrl: item.imageUrl,
      blobPathname: item.blobPathname || ''
    });
    setIsModalOpen(true);
  };

  // 4. File Selection & Validation (JPG, PNG, WEBP, max 5MB)
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setFileError('');
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFileError('कृपया केवल JPG, JPEG, PNG वा WEBP तस्वीर छान्नुहोस्।');
      addToast('अमान्य फाइल ढाँचा। JPG, PNG वा WEBP मात्र मान्य छ।', 'error');
      return;
    }

    // Validate size (5MB max)
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setFileError('कृपया ५MB भन्दा सानो तस्वीर छान्नुहोस्।');
      addToast('तस्वीरको आकार ५MB भन्दा धेरै छ। कृपया सानो फाइल छान्नुहोस्।', 'error');
      return;
    }

    const sizeFormatted = file.size > 1024 * 1024
      ? (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      : (file.size / 1024).toFixed(0) + ' KB';

    setSelectedFile(file);

    // Read and create preview with dimensions
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target.result;
      setFilePreview(dataUrl);

      const img = new Image();
      img.onload = () => {
        setFileMetadata({
          name: file.name,
          size: sizeFormatted,
          dimensions: `${img.naturalWidth} × ${img.naturalHeight} px`
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // 5. Clear Selected File
  const handleClearSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(editingItem ? editingItem.imageUrl : null);
    setFileMetadata({ name: '', size: '', dimensions: '' });
    setFileError('');
  };

  // 6. Handle Category Change
  const handleCategoryChange = (e) => {
    const selectedKey = e.target.value;
    const catObj = CATEGORIES.find(c => c.key === selectedKey);
    setFormData(prev => ({
      ...prev,
      category: selectedKey,
      categoryNepali: catObj ? catObj.ne : 'मन्दिर'
    }));
  };

  // 7. Form Submission (Upload to Vercel Blob -> Save to MongoDB)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      addToast('कृपया तस्वीरको शीर्षक प्रविष्ट गर्नुहोस्।', 'error');
      return;
    }

    if (!selectedFile && !formData.imageUrl) {
      addToast('कृपया तस्वीर छान्नुहोस्।', 'error');
      return;
    }

    setUploading(true);
    setUploadProgress(15);

    try {
      let finalImageUrl = formData.imageUrl;
      let finalBlobPathname = formData.blobPathname;

      // If a new local file was selected, upload it via backend endpoint
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append('image', selectedFile);
        uploadData.append('category', formData.category);

        setUploadProgress(45);

        const uploadRes = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(Math.min(90, Math.max(45, percentCompleted)));
          }
        });

        if (!uploadRes.data.success || !uploadRes.data.url) {
          throw new Error(uploadRes.data.message || 'Upload failed');
        }

        finalImageUrl = uploadRes.data.url;
        finalBlobPathname = uploadRes.data.blobPathname || '';
        setUploadProgress(95);
      }

      const payload = {
        title: formData.title.trim(),
        titleEnglish: formData.titleEnglish.trim(),
        category: formData.category,
        categoryNepali: formData.categoryNepali,
        description: formData.description.trim(),
        altText: formData.altText.trim() || formData.title.trim(),
        isFeatured: Boolean(formData.isFeatured),
        imageUrl: finalImageUrl,
        blobPathname: finalBlobPathname
      };

      if (editingItem) {
        const updateRes = await api.put(`/gallery/${editingItem._id}`, payload);
        if (updateRes.data.success) {
          addToast('तस्वीर विवरण सफलतापूर्वक अद्यावधिक गरियो।', 'success');
          setIsModalOpen(false);
          await fetchGallery();
        }
      } else {
        const createRes = await api.post('/gallery', payload);
        if (createRes.data.success) {
          setUploadProgress(100);
          addToast('✓ तस्वीर सफलतापूर्वक अपलोड र ग्यालरीमा सुरक्षित भयो।', 'success');
          setIsModalOpen(false);
          await fetchGallery();
        }
      }
    } catch (err) {
      console.error('❌ Gallery Submit Error:', err);
      const serverMsg = err.response?.data?.message || err.message;
      addToast(`❌ तस्वीर अपलोड गर्न सकिएन: ${serverMsg}`, 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // 8. Confirm and Delete Item
  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/gallery/${deleteCandidate._id}`);
      if (res.data.success) {
        addToast('तस्वीर ग्यालरीबाट सफलतापूर्वक हटाइयो।', 'success');
        setGallery(prev => prev.filter(g => g._id !== deleteCandidate._id));
        setDeleteCandidate(null);
      }
    } catch (err) {
      console.error('Delete gallery error:', err);
      addToast('तस्वीर हटाउन सकिएन।', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // 9. Filtered Gallery List
  const filteredGallery = gallery.filter(item => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  // 10. Lightbox Navigation Helpers with Keyboard Support
  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevLightboxImage = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === 0 ? filteredGallery.length - 1 : prev - 1));
  }, [lightboxIndex, filteredGallery.length]);

  const nextLightboxImage = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === filteredGallery.length - 1 ? 0 : prev + 1));
  }, [lightboxIndex, filteredGallery.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevLightboxImage();
      if (e.key === 'ArrowRight') nextLightboxImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, prevLightboxImage, nextLightboxImage]);

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '2rem' }}>
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.75rem',
        padding: '1.25rem 1.5rem',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid var(--border-gold)',
        boxShadow: '0 4px 16px rgba(122, 16, 32, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)'
          }}>
            <ImageIcon size={26} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', color: 'var(--color-primary-dark)', margin: 0 }}>
              मन्दिर तस्वीर सङ्ग्रह व्यवस्थापन (Photo Gallery)
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '2px', margin: 0 }}>
              केन्द्रीकृत क्लाउड भण्डारण (Centralized Storage) • कुल {gallery.length} तस्वीरहरू सुरक्षित
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="btn btn-primary btn-shimmer"
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '700',
            boxShadow: '0 4px 14px rgba(122, 16, 32, 0.25)'
          }}
        >
          <Plus size={18} />
          <span>+ नयाँ तस्वीर थप्नुहोस् (Add Photo)</span>
        </button>
      </div>

      {/* Dynamic Category Filter Tabs (PART 12) */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        padding: '0.85rem 1.25rem',
        border: '1px solid var(--border-gold)',
        marginBottom: '1.75rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.6rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <button
          onClick={() => setSelectedCategory('All')}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '700',
            border: selectedCategory === 'All' ? '1.5px solid var(--color-primary)' : '1px solid #E5DFD5',
            backgroundColor: selectedCategory === 'All' ? 'var(--color-primary)' : '#FAF7F2',
            color: selectedCategory === 'All' ? '#FFFFFF' : 'var(--text-brown)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>सबै</span>
          <span style={{
            fontSize: '0.75rem',
            padding: '1px 6px',
            borderRadius: '10px',
            backgroundColor: selectedCategory === 'All' ? 'rgba(255,255,255,0.25)' : '#E0D8CE',
            color: selectedCategory === 'All' ? '#FFF' : '#555'
          }}>
            {gallery.length}
          </span>
        </button>

        {CATEGORIES.map((c) => {
          const count = gallery.filter(g => g.category === c.key).length;
          const isSelected = selectedCategory === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '700',
                border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid #E5DFD5',
                backgroundColor: isSelected ? 'var(--color-primary)' : '#FAF7F2',
                color: isSelected ? '#FFFFFF' : 'var(--text-brown)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{c.ne}</span>
              <span style={{
                fontSize: '0.75rem',
                padding: '1px 6px',
                borderRadius: '10px',
                backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : '#E0D8CE',
                color: isSelected ? '#FFF' : '#555'
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Gallery Cards Grid (PART 10) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 0.75rem auto', color: 'var(--color-primary)' }} />
            <p>तस्वीरहरू लोड हुँदैछन्...</p>
          </div>
        ) : filteredGallery.length > 0 ? (
          filteredGallery.map((item, index) => {
            const hasFailed = failedImages[item._id];

            return (
              <div
                key={item._id}
                className="temple-card card-interactive"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1.5px solid var(--border-gold)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                }}
              >
                {/* Image Container with Fixed Aspect Ratio (PART 10) */}
                <div
                  style={{
                    position: 'relative',
                    height: '210px',
                    overflow: 'hidden',
                    backgroundColor: '#FAF7F2',
                    cursor: 'pointer'
                  }}
                  onClick={() => openLightbox(index)}
                >
                  {!hasFailed ? (
                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.altText || item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center 25%',
                        display: 'block',
                        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      onError={(e) => {
                        console.warn(`[Gallery] Image load error for ID ${item._id}:`, item.imageUrl);
                        setFailedImages(prev => ({ ...prev, [item._id]: true }));
                      }}
                    />
                  ) : (
                    /* Professional Broken Image Fallback (PART 9) */
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#FDFBF7',
                      color: 'var(--text-muted)',
                      padding: '1rem',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🖼️</div>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-primary-dark)' }}>
                        तस्वीर उपलब्ध छैन
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFailedImages(prev => {
                            const updated = { ...prev };
                            delete updated[item._id];
                            return updated;
                          });
                        }}
                        style={{
                          marginTop: '8px',
                          fontSize: '0.75rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-gold)',
                          backgroundColor: '#FFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <RefreshCw size={11} />
                        <span>पुनः प्रयास गर्नुहोस्</span>
                      </button>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    display: 'flex',
                    gap: '6px',
                    zIndex: 2
                  }}>
                    {item.isFeatured && (
                      <span style={{
                        backgroundColor: '#C59B27',
                        color: '#FFFFFF',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <Sparkles size={11} />
                        <span>Featured</span>
                      </span>
                    )}
                    <span style={{
                      backgroundColor: 'rgba(250, 247, 242, 0.96)',
                      padding: '3px 9px',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: '700',
                      color: 'var(--color-primary-dark)',
                      border: '1px solid var(--border-gold)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}>
                      {item.categoryNepali || item.category}
                    </span>
                  </div>

                  {/* Zoom In Icon Hover Hint */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)'
                  }}>
                    <ZoomIn size={16} />
                  </div>
                </div>

                {/* Card Content & Actions */}
                <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.05rem',
                      color: 'var(--color-primary-dark)',
                      marginBottom: '4px',
                      lineHeight: 1.3
                    }}>
                      {item.title}
                    </h3>
                    {item.description ? (
                      <p style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-muted)',
                        margin: 0,
                        lineHeight: 1.45,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {item.description}
                      </p>
                    ) : (
                      <p style={{ fontSize: '0.78rem', color: '#AAA', fontStyle: 'italic', margin: 0 }}>
                        कुनै विवरण थपिएको छैन
                      </p>
                    )}
                  </div>

                  {/* Bottom Actions (Edit / Delete) */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '10px',
                    marginTop: '12px'
                  }}>
                    <span style={{ fontSize: '0.72rem', color: '#999' }}>
                      {new Date(item.createdAt).toLocaleDateString('ne-NP')}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="btn btn-sm btn-outline"
                        style={{ padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                        title="सम्पादन गर्नुहोस्"
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteCandidate(item)}
                        style={{
                          backgroundColor: '#FEE2E2',
                          color: '#991B1B',
                          border: '1px solid #F87171',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.8rem'
                        }}
                        title="हटाउनुहोस्"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px dashed var(--border-gold)',
            color: 'var(--text-muted)'
          }}>
            <FileImage size={40} style={{ margin: '0 auto 0.75rem auto', color: 'var(--color-primary-light)' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '4px' }}>
              यस वर्गमा कुनै तस्वीर फेला परेन।
            </h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              नयाँ तस्वीर थप्न माथिको बटन प्रयोग गर्नुहोस्।
            </p>
            <button onClick={handleOpenAddModal} className="btn btn-sm btn-primary">
              <Plus size={14} />
              <span>पहिलो तस्वीर थप्नुहोस्</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================
          ADD / EDIT PHOTO MODAL (PART 4, 5, 6)
         ======================================================== */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => !uploading && setIsModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '640px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <ImageIcon size={20} />
                <span>{editingItem ? 'तस्वीर विवरण सम्पादन (Edit Photo)' : 'नयाँ तस्वीर थप्नुहोस् (Add Photo)'}</span>
              </h3>
              <button
                disabled={uploading}
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                {/* 1. Image Selector & Pre-upload Preview Area (PART 5) */}
                <div style={{
                  backgroundColor: '#FAF7F2',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  border: fileError ? '1.5px dashed #DC2626' : '1.5px dashed var(--border-gold)',
                  marginBottom: '1.25rem',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}>
                  {filePreview ? (
                    <div>
                      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '10px' }}>
                        <img
                          src={getImageUrl(filePreview)}
                          alt="Selected Preview"
                          style={{
                            maxHeight: '190px',
                            maxWidth: '100%',
                            objectFit: 'contain',
                            borderRadius: '10px',
                            border: '1.5px solid var(--border-gold)',
                            boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/images/temple-structure.jpg';
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: '8px',
                          right: '8px',
                          backgroundColor: '#236B4A',
                          color: '#FFFFFF',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <CheckCircle2 size={12} />
                          <span>तस्वीर तयार छ</span>
                        </div>
                      </div>

                      {/* File Metadata */}
                      {fileMetadata.name && (
                        <div style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          marginBottom: '10px',
                          backgroundColor: '#FFFFFF',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          gap: '12px',
                          border: '1px solid #E8E2D9'
                        }}>
                          <span>📁 <strong>{fileMetadata.name}</strong></span>
                          <span>⚖️ <strong>{fileMetadata.size}</strong></span>
                          <span>📐 <strong>{fileMetadata.dimensions}</strong></span>
                        </div>
                      )}

                      {/* Action Buttons for Preview */}
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '6px' }}>
                        <label className="btn btn-sm btn-outline" style={{ cursor: 'pointer', backgroundColor: '#FFF' }}>
                          <Upload size={13} />
                          <span>तस्वीर परिवर्तन गर्नुहोस्</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/jpg"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                            disabled={uploading}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={handleClearSelectedFile}
                          className="btn btn-sm"
                          style={{ backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #F87171' }}
                          disabled={uploading}
                        >
                          <Trash2 size={13} />
                          <span>हटाउनुहोस्</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Initial File Picker State */
                    <div>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: '#FFF',
                        border: '1px solid var(--border-gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 10px auto',
                        color: 'var(--color-primary)'
                      }}>
                        <Upload size={24} />
                      </div>
                      <h4 style={{ fontSize: '0.98rem', color: 'var(--color-primary-dark)', marginBottom: '4px' }}>
                        कम्प्युटरबाट नयाँ तस्वीर छान्नुहोस्
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
                        JPG, JPEG, PNG, WEBP (अधिकतम ५MB सम्म)
                      </p>

                      <label className="btn btn-primary btn-shimmer" style={{ cursor: 'pointer', padding: '0.55rem 1.25rem' }}>
                        <Plus size={15} />
                        <span>[ + तस्वीर छान्नुहोस् ]</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/jpg"
                          onChange={handleFileSelect}
                          style={{ display: 'none' }}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  )}

                  {/* Validation Error Message in Nepali */}
                  {fileError && (
                    <div style={{
                      marginTop: '10px',
                      color: '#DC2626',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      fontWeight: '600'
                    }}>
                      <AlertCircle size={14} />
                      <span>{fileError}</span>
                    </div>
                  )}
                </div>

                {/* 2. Upload Progress Bar (PART 6) */}
                {uploading && (
                  <div style={{
                    marginBottom: '1.25rem',
                    backgroundColor: '#FAF7F2',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-gold)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary-dark)', marginBottom: '6px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>क्लाउडमा तस्वीर अपलोड हुँदैछ...</span>
                      </span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#E5DFD5', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${uploadProgress}%`,
                        height: '100%',
                        backgroundColor: 'var(--color-primary)',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                )}

                {/* 3. Form Fields */}
                <div className="form-group">
                  <label className="form-label">तस्वीरको शीर्षक (Nepali Title) *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-control"
                    placeholder="उदा. गर्भगृह दीप प्रज्वलन आरती"
                    disabled={uploading}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">श्रेणी (Category) *</label>
                    <select
                      value={formData.category}
                      onChange={handleCategoryChange}
                      className="form-control"
                      disabled={uploading}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.ne} ({c.key})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Alt Text (वैकल्पिक विवरण)</label>
                    <input
                      type="text"
                      value={formData.altText}
                      onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                      className="form-control"
                      placeholder="उदा. मन्दिर परिसरको दृश्य"
                      disabled={uploading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">विवरण (Description)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-control"
                    placeholder="तस्वीरको धार्मिक वा ऐतिहासिक सन्दर्भ..."
                    rows={2}
                    disabled={uploading}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      disabled={uploading}
                    />
                    <span style={{ fontWeight: '600', color: 'var(--color-primary-dark)' }}>
                      विशेष तस्वीर (होमपेज मुख्य स्लाईडरमा देखाउने)
                    </span>
                  </label>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer" style={{ margin: '1rem -1.5rem -1.5rem -1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-outline"
                    disabled={uploading}
                  >
                    रद्द गर्नुहोस्
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-shimmer"
                    disabled={uploading}
                    style={{ minWidth: '160px' }}
                  >
                    {uploading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>अपलोड हुँदैछ...</span>
                      </span>
                    ) : editingItem ? (
                      'परिवर्तन सुरक्षित गर्नुहोस्'
                    ) : (
                      'तस्वीर अपलोड गर्नुहोस्'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION MODAL (PART 13)
         ======================================================== */}
      {deleteCandidate && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteCandidate(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '440px', textAlign: 'center', padding: '1.75rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <Trash2 size={26} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#991B1B', fontSize: '1.25rem', marginBottom: '8px' }}>
              तस्वीर हटाउने पुष्टि
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-brown)', marginBottom: '1.5rem', lineHeight: 1.4 }}>
              के तपाईं <strong>"{deleteCandidate.title}"</strong> तस्वीर ग्यालरी तथा क्लाउड भण्डारणबाट सधैँका लागि हटाउन निश्चित हुनुहुन्छ?
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="btn btn-outline"
                disabled={deleting}
              >
                रद्द गर्नुहोस्
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="btn"
                style={{ backgroundColor: '#DC2626', color: '#FFF', fontWeight: '700' }}
                disabled={deleting}
              >
                {deleting ? 'हटाउँदैछ...' : 'हटाउनुहोस् (Delete)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          FULLSCREEN LIGHTBOX WITH KEYBOARD NAVIGATION (PART 11)
         ======================================================== */}
      {lightboxIndex !== null && filteredGallery[lightboxIndex] && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 6, 4, 0.95)',
            backdropFilter: 'blur(10px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fadeIn 0.25s ease-out'
          }}
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              zIndex: 2010,
              transition: 'background 0.2s ease'
            }}
            aria-label="Close Lightbox"
          >
            <X size={24} />
          </button>

          {/* Previous Button */}
          {filteredGallery.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevLightboxImage();
              }}
              style={{
                position: 'absolute',
                left: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer',
                zIndex: 2010
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Next Button */}
          {filteredGallery.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextLightboxImage();
              }}
              style={{
                position: 'absolute',
                right: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer',
                zIndex: 2010
              }}
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Image & Details Container */}
          <div
            style={{
              maxWidth: '90vw',
              maxHeight: '88vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageUrl(filteredGallery[lightboxIndex].imageUrl)}
              alt={filteredGallery[lightboxIndex].title}
              style={{
                maxWidth: '100%',
                maxHeight: '74vh',
                objectFit: 'contain',
                borderRadius: '14px',
                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.7)',
                border: '2px solid rgba(212, 167, 44, 0.4)',
                backgroundColor: '#160E08'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/images/temple-structure.jpg';
              }}
            />

            {/* Caption & Category */}
            <div style={{
              marginTop: '1rem',
              textAlign: 'center',
              color: '#FAF7F2',
              maxWidth: '680px'
            }}>
              <div style={{ display: 'inline-block', backgroundColor: 'rgba(212, 167, 44, 0.25)', border: '1px solid #D4A72C', color: '#FFD166', padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '6px' }}>
                {filteredGallery[lightboxIndex].categoryNepali || filteredGallery[lightboxIndex].category} ({lightboxIndex + 1} / {filteredGallery.length})
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                color: '#FFD166',
                margin: '0 0 4px 0'
              }}>
                {filteredGallery[lightboxIndex].title}
              </h3>
              {filteredGallery[lightboxIndex].description && (
                <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.85)', margin: 0, lineHeight: 1.4 }}>
                  {filteredGallery[lightboxIndex].description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryView;
