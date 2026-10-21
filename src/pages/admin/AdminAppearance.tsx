import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import {
  Image,
  Upload,
  Link as LinkIcon,
  Save,
  Loader2,
  CheckCircle,
  Eye,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Trophy,
  Plane,
  RotateCcw
} from 'lucide-react';
import { WebsiteSettings, SlideItem } from '../../types';

export const AdminAppearance: React.FC = () => {
  const { authFetch } = useAuth();
  const { refreshConfig } = useConfig();
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingSlide, setUploadingSlide] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const res = await authFetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error('Failed to load appearance settings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadingLogo(true);
    try {
      const res = await authFetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setSettings({
          ...settings,
          logoUrl: data.url,
          logoType: 'upload'
        });
        showToast('success', 'Logo uploaded successfully.');
      } else {
        showToast('error', data.error || 'Failed to upload logo');
      }
    } catch (err) {
      showToast('error', 'Upload error');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSlideUpload = async (slideIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadingSlide(slideIndex);
    try {
      const res = await authFetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        const updatedSlides = [...settings.heroSlider.slides];
        updatedSlides[slideIndex].image = data.url;
        setSettings({
          ...settings,
          heroSlider: {
            ...settings.heroSlider,
            slides: updatedSlides
          }
        });
        showToast('success', `Slide ${slideIndex + 1} image updated.`);
      } else {
        showToast('error', data.error || 'Failed to upload slide image');
      }
    } catch (err) {
      showToast('error', 'Slide image upload error');
    } finally {
      setUploadingSlide(null);
    }
  };

  const moveSlide = (fromIndex: number, toIndex: number) => {
    if (!settings) return;
    const slides = [...settings.heroSlider.slides];
    if (toIndex < 0 || toIndex >= slides.length) return;
    const item = slides.splice(fromIndex, 1)[0];
    slides.splice(toIndex, 0, item);
    setSettings({
      ...settings,
      heroSlider: {
        ...settings.heroSlider,
        slides
      }
    });
  };

  const updateSlideField = (index: number, field: keyof SlideItem, value: string) => {
    if (!settings) return;
    const slides = [...settings.heroSlider.slides];
    slides[index] = { ...slides[index], [field]: value };
    setSettings({
      ...settings,
      heroSlider: {
        ...settings.heroSlider,
        slides
      }
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await authFetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSaveSuccess(true);
        showToast('success', 'Website appearance and slider saved successfully!');
        await refreshConfig();
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        showToast('error', 'Failed to update website appearance');
      }
    } catch (err) {
      showToast('error', 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <AdminLayout activeTab="appearance">
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
          <span className="text-xs text-slate-500">Loading appearance settings...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="appearance">
      <form onSubmit={handleSave} className="space-y-8">
        {/* Toast Notifications */}
        {toastMessage && (
          <div
            className={`p-4 rounded-xl flex items-center justify-between text-xs font-semibold shadow-md transition-all ${
              toastMessage.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{toastMessage.text}</span>
            </div>
            <button type="button" onClick={() => setToastMessage(null)} className="p-1 hover:opacity-75">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Branding & Hero Presentation
            </span>
            <h1 className="text-2xl font-heading font-extrabold text-slate-950 mt-1">
              Website Appearance & Slider
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Upload company logo, replace the 3 football hero images, edit the scrolling tagline, and adjust CTAs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>Changes Published!</span>
              </span>
            )}
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save & Publish Changes</span>
            </button>
          </div>
        </div>

        {/* SECTION 1: LOGO MANAGEMENT */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-heading font-bold text-slate-950">
                Company Logo Configuration
              </h2>
              <p className="text-xs text-slate-500">
                Support for local file upload or direct external image URL with live preview.
              </p>
            </div>
            {settings.logoUrl && (
              <button
                type="button"
                onClick={() => setSettings({ ...settings, logoUrl: '', logoType: 'text' })}
                className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset to Text Logo</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Live Logo Preview Box */}
            <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center space-y-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Current Active Logo Preview
              </span>
              <div className="h-20 flex items-center justify-center p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                {settings.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt="Logo Preview"
                    className="max-h-full max-w-[240px] object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex items-center gap-2 font-heading font-extrabold text-2xl text-slate-950">
                    <span>CHAMONVIN</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold">
                      LTD
                    </span>
                  </div>
                )}
              </div>
              <span className="text-[11px] text-slate-400 block">
                {settings.logoUrl ? 'Using custom image logo' : 'Using default CHAMONVIN LIMITED text branding'}
              </span>
            </div>

            {/* Logo Upload & URL Options */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Option 1: Upload Logo File (PNG, JPG, SVG, WebP)
                </label>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded cursor-pointer transition-colors">
                  {uploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{uploadingLogo ? 'Uploading Logo...' : 'Choose File from Computer'}</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Option 2: External Image URL for Logo
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={settings.logoUrl || ''}
                    onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value, logoType: 'url' })}
                    placeholder="https://example.com/logo.png"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: HERO SLIDER MANAGEMENT (EXACTLY 3 FOOTBALL PITCH IMAGES) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Hero Section Images (Exactly 3 Slides)
            </span>
            <h2 className="text-lg font-heading font-bold text-slate-950 mt-0.5">
              Football Pitch & Stadium Slides
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Replace background images, edit captions, and reorder the 3 football images. Slides cycle automatically every 15 seconds.
            </p>
          </div>

          <div className="space-y-6">
            {settings.heroSlider.slides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-6 items-start"
              >
                {/* Image Preview & Upload */}
                <div className="w-full md:w-56 shrink-0 space-y-2">
                  <div className="h-36 rounded-lg overflow-hidden bg-slate-900 border border-slate-300 relative shadow-2xs">
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-emerald-400 font-bold text-[10px]">
                      Slide {idx + 1} of 3
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex-1 text-center py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-bold rounded cursor-pointer transition-colors flex items-center justify-center gap-1">
                      {uploadingSlide === idx ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Upload className="w-3 h-3" />
                      )}
                      <span>Replace Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSlideUpload(idx, e)}
                        className="hidden"
                      />
                    </label>

                    {/* Reorder Buttons */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveSlide(idx, idx - 1)}
                      className="p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === settings.heroSlider.slides.length - 1}
                      onClick={() => moveSlide(idx, idx + 1)}
                      className="p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content Inputs */}
                <div className="flex-1 w-full space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Slide Image URL (High-Resolution Football Pitch / Stadium)
                    </label>
                    <input
                      type="url"
                      value={slide.image}
                      onChange={(e) => updateSlideField(idx, 'image', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 font-mono text-[11px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Slide Heading Title</label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => updateSlideField(idx, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Image Alt Description</label>
                      <input
                        type="text"
                        value={slide.alt}
                        onChange={(e) => updateSlideField(idx, 'alt', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Slide Subtitle / Description</label>
                    <textarea
                      rows={2}
                      value={slide.subtitle}
                      onChange={(e) => updateSlideField(idx, 'subtitle', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <strong className="text-slate-900 block">Automatic Slider Interval:</strong>
              <span>Changes automatically every 15 seconds as specified. Pauses on user touch/hover.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-emerald-700">15 Seconds</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: SCROLLING TAGLINE */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-heading font-bold text-slate-950">
              Hero Scrolling Tagline
            </h2>
            <p className="text-xs text-slate-500">
              Moves continuously from left to right across the hero section.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 text-xs mb-1">
              Exact Tagline Text
            </label>
            <input
              type="text"
              required
              value={settings.heroTagline}
              onChange={(e) => setSettings({ ...settings, heroTagline: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-heading font-bold text-slate-950 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Preview: <strong>“{settings.heroTagline}”</strong> (Animated smoothly from left to right with reduced-motion support).
            </span>
          </div>
        </div>

        {/* SECTION 4: HERO CALL-TO-ACTION BUTTONS */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-heading font-bold text-slate-950">
              Hero Call-to-Action Buttons
            </h2>
            <p className="text-xs text-slate-500">
              Configure labels and destinations for the four primary hero buttons.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {settings.heroButtons.map((btn, index) => (
              <div key={index} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-emerald-700 uppercase tracking-wide block">
                  Button #{index + 1}
                </span>
                <div>
                  <label className="block text-slate-600 mb-0.5">Label</label>
                  <input
                    type="text"
                    value={btn.label}
                    onChange={(e) => {
                      const updated = [...settings.heroButtons];
                      updated[index].label = e.target.value;
                      setSettings({ ...settings, heroButtons: updated });
                    }}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5">Destination Link</label>
                  <input
                    type="text"
                    value={btn.path}
                    onChange={(e) => {
                      const updated = [...settings.heroButtons];
                      updated[index].path = e.target.value;
                      setSettings({ ...settings, heroButtons: updated });
                    }}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-mono text-[11px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Save Action Bar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save & Publish All Appearance Changes</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};
