'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, CheckCircle2, Upload, Globe, Phone, Mail, Building2, Target, Palette, FileText, Link as LinkIcon, Star, Zap, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useRouter } from 'next/navigation';
import { GoogleGenAI } from "@google/genai";

// Lazy init so missing key never crashes on module load
const getAI = () => {
  try { return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" }); }
  catch { return null; }
};

const steps = [
  { id: 'contact', title: 'Contact Info', icon: <Phone className="w-5 h-5" /> },
  { id: 'business', title: 'Business Details', icon: <Building2 className="w-5 h-5" /> },
  { id: 'goals', title: 'Website Goals', icon: <Target className="w-5 h-5" /> },
  { id: 'services', title: 'Services', icon: <Zap className="w-5 h-5" /> },
  { id: 'branding', title: 'Branding', icon: <Palette className="w-5 h-5" /> },
  { id: 'media', title: 'Photos / Media', icon: <Upload className="w-5 h-5" /> },
  { id: 'domain', title: 'Domain + Access', icon: <Globe className="w-5 h-5" /> },
  { id: 'final', title: 'Final Notes', icon: <FileText className="w-5 h-5" /> },
];

export default function WebsiteOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      console.log("Submitting form data:", formData);
      // Here you would typically send data to Firebase
      alert("Onboarding submitted successfully!");
      router.push('/');
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleFileChange = (e: any) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, uploadedFiles: [...(formData.uploadedFiles || []), ...files] });
  };

  const generateDescription = async () => {
    if (!formData.businessDescription) return;
    setIsGenerating(true);
    try {
      const ai = getAI();
      if (!ai) throw new Error("AI not configured");
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `Write a professional business description for: ${formData.businessDescription}`,
      });
      setFormData({ ...formData, businessDescription: response.text });
    } catch (error) {
      console.error("Error generating description:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Contact Info
        return (
          <div className="space-y-4">
            <input name="fullName" placeholder="Full Name" onChange={handleInputChange} className="w-full p-3 bg-gray-800 rounded-xl border border-white/10" />
            <input name="businessName" placeholder="Business Name" onChange={handleInputChange} className="w-full p-3 bg-gray-800 rounded-xl border border-white/10" />
            <input name="email" type="email" placeholder="Email Address" onChange={handleInputChange} className="w-full p-3 bg-gray-800 rounded-xl border border-white/10" />
            <input name="phone" placeholder="Phone Number" onChange={handleInputChange} className="w-full p-3 bg-gray-800 rounded-xl border border-white/10" />
          </div>
        );
      case 1: // Business Details
        return (
          <div className="space-y-4">
            <textarea name="businessDescription" value={formData.businessDescription || ''} placeholder="What does your business do?" onChange={handleInputChange} className="w-full p-3 bg-gray-800 rounded-xl border border-white/10 h-32" />
            <button 
              onClick={generateDescription}
              disabled={isGenerating}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold flex items-center gap-2 text-sm"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'Generating...' : 'Generate with AI'}
            </button>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">When did your business start?</label>
              <input name="businessStartDate" type="date" onChange={handleInputChange} className="w-full p-3 bg-gray-800 rounded-xl border border-white/10" />
            </div>
            <input name="primaryServiceArea" placeholder="Primary Service Area" onChange={handleInputChange} className="w-full p-3 bg-gray-800 rounded-xl border border-white/10" />
            <input name="otherServiceAreas" placeholder="Other Service Areas (comma separated)" onChange={handleInputChange} className="w-full p-3 bg-gray-800 rounded-xl border border-white/10" />
          </div>
        );
      case 2: // Website Goals
        return (
          <div className="space-y-4">
            <select name="mainGoal" onChange={handleInputChange} className="w-full p-3 bg-gray-800 rounded-xl border border-white/10">
              <option value="">Main goal of your website?</option>
              <option value="leads">Get more form leads</option>
              <option value="calls">Get more calls</option>
              <option value="sales">Sell products online</option>
            </select>
          </div>
        );
      case 3: // Services
        return (
          <div className="space-y-4">
            <textarea name="servicesOffered" placeholder="List all services offered" onChange={handleInputChange} className="w-full p-3 bg-gray-800 rounded-xl border border-white/10 h-32" />
          </div>
        );
      case 4: // Branding
        return (
          <div className="space-y-4">
            <input name="brandColors" placeholder="Brand colors" onChange={handleInputChange} className="w-full p-3 bg-gray-800 rounded-xl border border-white/10" />
            <textarea name="lookAndFeel" placeholder="Describe the look you want" onChange={handleInputChange} className="w-full p-3 bg-gray-800 rounded-xl border border-white/10 h-32" />
          </div>
        );
      case 5: // Photos / Media
        return (
          <div className="space-y-4">
            <label className="block p-8 border-2 border-dashed border-gray-700 rounded-xl text-center cursor-pointer hover:border-blue-500 transition-colors">
              <Upload className="w-10 h-10 mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">Click to upload project photos, logo, etc.</p>
              <input type="file" multiple className="hidden" onChange={handleFileChange} />
              {formData.uploadedFiles && (
                <div className="mt-4 text-left text-sm text-blue-400">
                  <p className="font-semibold mb-1">Selected files:</p>
                  <ul className="list-disc list-inside">
                    {formData.uploadedFiles.map((file: File, index: number) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </label>
          </div>
        );
      case 6: // Domain + Social Media
        return (
          <div className="space-y-4">
            <input name="domainName" placeholder="Domain name (if owned)" onChange={handleInputChange} className="w-full p-3 bg-gray-800 rounded-xl border border-white/10" />
            <input name="facebookUrl" placeholder="Facebook URL" onChange={handleInputChange} className="w-full p-3 bg-gray-800 rounded-xl border border-white/10" />
            <input name="instagramUrl" placeholder="Instagram URL" onChange={handleInputChange} className="w-full p-3 bg-gray-800 rounded-xl border border-white/10" />
            <input name="googleBusinessUrl" placeholder="Google Business Profile URL" onChange={handleInputChange} className="w-full p-3 bg-gray-800 rounded-xl border border-white/10" />
            <input name="tiktokUrl" placeholder="TikTok URL" onChange={handleInputChange} className="w-full p-3 bg-gray-800 rounded-xl border border-white/10" />
            <input name="youtubeUrl" placeholder="YouTube URL" onChange={handleInputChange} className="w-full p-3 bg-gray-800 rounded-xl border border-white/10" />
          </div>
        );
      case 7: // Final Notes
        return (
          <div className="space-y-4">
            <textarea name="finalNotes" placeholder="Anything else we should know?" onChange={handleInputChange} className="w-full p-3 bg-gray-800 rounded-xl border border-white/10 h-32" />
          </div>
        );
      default:
        return <p>Step {currentStep + 1} content</p>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome — Let’s Build Your Website</h1>
          <p className="text-gray-400">We’ve received your payment. Complete the form below so we can start building your site as fast as possible.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-600"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Steps */}
        <div className="bg-gray-900 border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              {steps[currentStep].icon}
              {steps[currentStep].title}
            </h2>
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-white/10">
            <button 
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-6 py-2 rounded-xl font-semibold text-gray-400 hover:text-white disabled:opacity-50"
            >
              Back
            </button>
            <button 
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
