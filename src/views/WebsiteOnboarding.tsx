'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, ArrowLeft, CheckCircle2, Upload, Globe, Phone, Mail,
  Building2, Target, Palette, FileText, Zap, Sparkles, Loader2,
  MapPin, Clock, Users, DollarSign, Search, Star, Instagram,
  Youtube, Facebook, MessageSquare, Layout, Image,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useRouter } from 'next/navigation';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ParticleCanvas, SectionOrbs, GridOverlay } from '@/components/PageEffects';

/* ── Styling helpers ── */
const inputCls = 'w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all font-medium';
const labelCls = 'block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5';
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><label className={labelCls}>{label}</label>{children}</div>
);

/* ── Steps config ── */
const STEPS = [
  { id:'contact',      title:'Contact & Plan',       icon:<Phone className="w-4 h-4"/>,      color:'#3b82f6' },
  { id:'business',     title:'Business Info',         icon:<Building2 className="w-4 h-4"/>,  color:'#8b5cf6' },
  { id:'goals',        title:'Goals & Audience',      icon:<Target className="w-4 h-4"/>,     color:'#06b6d4' },
  { id:'services',     title:'Services & Pricing',    icon:<DollarSign className="w-4 h-4"/>, color:'#22c55e' },
  { id:'branding',     title:'Branding & Style',      icon:<Palette className="w-4 h-4"/>,    color:'#ec4899' },
  { id:'pages',        title:'Pages & Features',      icon:<Layout className="w-4 h-4"/>,     color:'#eab308' },
  { id:'domain',       title:'Domain & Social',       icon:<Globe className="w-4 h-4"/>,      color:'#f97316' },
  { id:'media',        title:'Photos & Media',        icon:<Image className="w-4 h-4"/>,      color:'#06b6d4' },
  { id:'seo',          title:'SEO & Google',          icon:<Search className="w-4 h-4"/>,     color:'#8b5cf6' },
  { id:'testimonials', title:'Trust & Reviews',       icon:<Star className="w-4 h-4"/>,       color:'#22c55e' },
  { id:'final',        title:'Final Notes',           icon:<FileText className="w-4 h-4"/>,   color:'#3b82f6' },
];

const PAGE_OPTIONS = [
  'Home','About Us','Services','Individual Service Pages','Gallery / Portfolio',
  'Contact','FAQ','Testimonials','Blog','Booking / Scheduling',
  'Pricing Page','Service Area Pages','Team / Staff Page','Before & After',
];

const STYLE_OPTIONS = ['Clean & Modern','Bold & Dramatic','Warm & Friendly','Luxury / Premium','Techy / Futuristic','Classic & Professional'];
const FONT_OPTIONS  = ['Bold Display (Impact)','Clean Sans-Serif','Classic Serif','Friendly Rounded'];
const GOAL_OPTIONS  = ['Get more phone calls','Generate form leads','Book appointments online','Sell products','Rank #1 on Google','Beat local competitors','Launch a new business','Replace old website'];

export default function WebsiteOnboarding() {
  const [step,     setStep]     = useState(0);
  const [data,     setData]     = useState<Record<string, any>>({});
  const [saving,   setSaving]   = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [aiLoading,setAiLoading]= useState(false);
  const [files,    setFiles]    = useState<File[]>([]);
  const router = useRouter();

  const set = (k: string, v: any) => setData(p => ({ ...p, [k]: v }));
  const inp = (k: string) => ({
    name: k, value: data[k] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(k, e.target.value),
    className: inputCls,
  });

  const toggleArr = (k: string, v: string) => {
    const arr: string[] = data[k] || [];
    set(k, arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
  };

  const CheckPill = ({ label, field }: { label: string; field: string }) => {
    const active = (data[field] || []).includes(label);
    return (
      <button type="button" onClick={() => toggleArr(field, label)}
        className={cn('px-3 py-2 rounded-xl text-xs font-semibold border transition-all',
          active ? 'text-white border-blue-500/60 bg-blue-600/20' : 'text-gray-400 border-white/10 hover:border-white/25 hover:text-white')}>
        {active && <CheckCircle2 className="w-3 h-3 inline mr-1 text-blue-400"/>}{label}
      </button>
    );
  };

  const generateDesc = async () => {
    if (!data.businessDescription) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/generate-description', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ prompt: data.businessDescription }),
      });
      const d = await res.json();
      if (d.text) set('businessDescription', d.text);
    } catch { /* silent */ } finally { setAiLoading(false); }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      /* ── 1. Save to Firestore ── */
      await addDoc(collection(db, 'onboarding'), {
        ...data,
        fileNames: files.map(f => f.name),
        submittedAt: serverTimestamp(),
        status: 'new',
      });

      /* ── 2. Email notification via EmailJS ── */
      const summary = Object.entries(data)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
        .join('\n');

      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          service_id:'service_ryxz9tk', template_id:'template_m1kkbm5', user_id:'QhgVuWgPA8Rj-BGpQ',
          template_params:{
            from_name: data.fullName || 'New Client',
            reply_to:  data.email   || 'no-reply@vcvservices.com',
            phone:     data.phone   || 'N/A',
            business:  data.businessName || 'N/A',
            message:   `NEW ONBOARDING SUBMISSION\n\n${summary}\n\nFiles to request: ${files.map(f=>f.name).join(', ') || 'none'}`,
          },
        }),
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Something went wrong saving your info. Please email info@vcvservices.com directly.');
    } finally { setSaving(false); }
  };

  const pct = Math.round(((step + 1) / STEPS.length) * 100);
  const color = STEPS[step].color;

  /* ── Step content ── */
  const renderStep = () => {
    switch (step) {

      /* ── 0: Contact ── */
      case 0: return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name *"><input {...inp('fullName')} placeholder="John Smith" /></Field>
            <Field label="Business Name *"><input {...inp('businessName')} placeholder="Smith Roofing LLC" /></Field>
            <Field label="Email Address *"><input {...inp('email')} type="email" placeholder="john@example.com" /></Field>
            <Field label="Best Phone *"><input {...inp('phone')} placeholder="(555) 000-0000" /></Field>
            <Field label="Best Time to Contact">
              <select {...inp('bestContactTime')} className={inputCls}>
                <option value="">Select...</option>
                {['Morning (8am-12pm)','Afternoon (12pm-5pm)','Evening (5pm-8pm)','Anytime'].map(o=><option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Plan Purchased">
              <select {...inp('planPurchased')} className={inputCls}>
                <option value="">Select...</option>
                <option>Monthly — $97/mo</option>
                <option>Annual — $997/yr</option>
                <option>Custom Quote</option>
              </select>
            </Field>
          </div>
          <Field label="Preferred Communication">
            <div className="flex flex-wrap gap-2 mt-1">
              {['Email','Phone Call','Text Message','WhatsApp'].map(o=><CheckPill key={o} label={o} field="preferredComm"/>)}
            </div>
          </Field>
        </div>
      );

      /* ── 1: Business ── */
      case 1: return (
        <div className="space-y-4">
          <Field label="Tell us what your business does *">
            <textarea {...inp('businessDescription')} rows={4} placeholder="We are a licensed roofing contractor in Lawton, OK specializing in..." className={cn(inputCls,'resize-none')}/>
            <button type="button" onClick={generateDesc} disabled={aiLoading}
              className="mt-2 flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-500/40 text-purple-300 text-xs font-bold rounded-xl hover:bg-purple-600/30 transition-all disabled:opacity-50">
              <Sparkles className="w-3.5 h-3.5"/>
              {aiLoading ? 'Generating...' : 'Polish with AI'}
            </button>
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Year Founded"><input {...inp('yearFounded')} placeholder="2018" /></Field>
            <Field label="Number of Employees">
              <select {...inp('employees')} className={inputCls}>
                <option value="">Select...</option>
                {['Just me (1)','2-5','6-15','16-50','50+'].map(o=><option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Primary City / State *"><input {...inp('primaryCity')} placeholder="Lawton, OK" /></Field>
            <Field label="Other Service Areas"><input {...inp('otherAreas')} placeholder="Comanche County, Duncan, Wichita Falls..." /></Field>
          </div>
          <Field label="Business Hours">
            <input {...inp('businessHours')} placeholder="Mon-Fri 7am-6pm, Sat 8am-2pm, Emergency 24/7" />
          </Field>
          <Field label="Physical Address (if applicable)">
            <input {...inp('address')} placeholder="123 Main St, Lawton, OK 73501 (or leave blank if remote)" />
          </Field>
          <Field label="Business License / Certifications (for SEO trust)">
            <input {...inp('licenseNumber')} placeholder="License #: 12345 — Certified by..." />
          </Field>
        </div>
      );

      /* ── 2: Goals ── */
      case 2: return (
        <div className="space-y-5">
          <Field label="Primary goals for this website (select all that apply)">
            <div className="flex flex-wrap gap-2 mt-1">
              {GOAL_OPTIONS.map(o=><CheckPill key={o} label={o} field="goals"/>)}
            </div>
          </Field>
          <Field label="Who is your ideal customer? *">
            <textarea {...inp('targetCustomer')} rows={3} placeholder="Homeowners in Lawton OK aged 35-65, own their home, need roof repair after storm season..." className={cn(inputCls,'resize-none')}/>
          </Field>
          <Field label="What makes you different from competitors? *">
            <textarea {...inp('differentiator')} rows={3} placeholder="Licensed & insured, 15 years experience, lifetime warranty on labor, same-day estimates..." className={cn(inputCls,'resize-none')}/>
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Top Competitor #1 (name or website)"><input {...inp('competitor1')} placeholder="Smith Roofing or smithroofing.com" /></Field>
            <Field label="Top Competitor #2"><input {...inp('competitor2')} placeholder="Jones Contractors" /></Field>
            <Field label="Top Competitor #3"><input {...inp('competitor3')} placeholder="ABC Home Services" /></Field>
            <Field label="Desired Launch Date"><input {...inp('launchDate')} type="date" /></Field>
          </div>
        </div>
      );

      /* ── 3: Services ── */
      case 3: return (
        <div className="space-y-4">
          <Field label="List ALL services you offer (one per line) *">
            <textarea {...inp('servicesList')} rows={6} placeholder={`Roof Replacement\nRoof Repair\nGutter Installation\nStorm Damage Inspection\nEmergency Tarping`} className={cn(inputCls,'resize-none')}/>
          </Field>
          <Field label="Your #1 Featured / Most Profitable Service *">
            <input {...inp('featuredService')} placeholder="Roof Replacement" />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Starting Price / Price Range">
              <input {...inp('priceRange')} placeholder="From $500 / $5,000-$15,000 for full replacement" />
            </Field>
            <Field label="Do you offer free estimates?">
              <select {...inp('freeEstimates')} className={inputCls}>
                <option value="">Select...</option>
                <option>Yes — free estimates</option>
                <option>Yes — free in-person estimate</option>
                <option>No — paid consultations</option>
              </select>
            </Field>
          </div>
          <Field label="Do you want a quote / estimate request form on the site?">
            <select {...inp('wantQuoteForm')} className={inputCls}>
              <option value="">Select...</option>
              <option>Yes — simple contact form</option>
              <option>Yes — detailed estimate calculator</option>
              <option>Just a call button is fine</option>
            </select>
          </Field>
          <Field label="Financing / Payment options (mention on site?)">
            <input {...inp('financing')} placeholder="We accept all major cards, financing through GreenSky..." />
          </Field>
        </div>
      );

      /* ── 4: Branding ── */
      case 4: return (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Primary Brand Color">
              <div className="flex gap-2 items-center">
                <input {...inp('primaryColor')} type="color" className="w-12 h-11 rounded-xl border border-white/10 bg-transparent cursor-pointer p-1"/>
                <input {...inp('primaryColorHex')} placeholder="#1e40af" className={cn(inputCls,'flex-1')}/>
              </div>
            </Field>
            <Field label="Secondary Brand Color">
              <div className="flex gap-2 items-center">
                <input {...inp('secondaryColor')} type="color" className="w-12 h-11 rounded-xl border border-white/10 bg-transparent cursor-pointer p-1"/>
                <input {...inp('secondaryColorHex')} placeholder="#ffffff" className={cn(inputCls,'flex-1')}/>
              </div>
            </Field>
          </div>
          <Field label="Overall visual style (select one or two)">
            <div className="flex flex-wrap gap-2 mt-1">
              {STYLE_OPTIONS.map(o=><CheckPill key={o} label={o} field="visualStyle"/>)}
            </div>
          </Field>
          <Field label="Font preference">
            <div className="flex flex-wrap gap-2 mt-1">
              {FONT_OPTIONS.map(o=><CheckPill key={o} label={o} field="fontPref"/>)}
            </div>
          </Field>
          <Field label="3 websites you LIKE the look of (paste URLs)">
            <textarea {...inp('sitesLike')} rows={3} placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com" className={cn(inputCls,'resize-none')}/>
          </Field>
          <Field label="Anything you definitely DON'T want on your site?">
            <input {...inp('sitesDislike')} placeholder="No carousels, no dark background, no Comic Sans..." />
          </Field>
          <Field label="Do you have a logo?">
            <select {...inp('hasLogo')} className={inputCls}>
              <option value="">Select...</option>
              <option>Yes — I will email it to info@vcvservices.com</option>
              <option>Yes — I will upload it in the Photos step</option>
              <option>No — please design one for me</option>
              <option>No — use text-only for now</option>
            </select>
          </Field>
        </div>
      );

      /* ── 5: Pages ── */
      case 5: return (
        <div className="space-y-5">
          <Field label="Which pages do you need on your site? (select all that apply)">
            <div className="flex flex-wrap gap-2 mt-1">
              {PAGE_OPTIONS.map(o=><CheckPill key={o} label={o} field="pagesNeeded"/>)}
            </div>
          </Field>
          <Field label="Special features you want">
            <div className="flex flex-wrap gap-2 mt-1">
              {[
                'Online booking / scheduling','Click-to-call buttons','Live chat widget',
                'Google Maps embed','Photo gallery / slider','Before & after slider',
                'Customer reviews feed','Video background','FAQ accordion',
                'Newsletter signup','Social media feed','Financing calculator',
              ].map(o=><CheckPill key={o} label={o} field="features"/>)}
            </div>
          </Field>
          <Field label="How many service pages do you need? (e.g. one per service)">
            <select {...inp('servicePageCount')} className={inputCls}>
              <option value="">Select...</option>
              {['1 combined services page','2-3 service pages','4-6 service pages','7-10 service pages','10+ (I will provide the list)'].map(o=><option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Do you need service-area landing pages? (e.g. Plumber in [City])">
            <select {...inp('areaPages')} className={inputCls}>
              <option value="">Select...</option>
              <option>Yes — list the cities in the notes</option>
              <option>No — just one primary location</option>
            </select>
          </Field>
        </div>
      );

      /* ── 6: Domain & Social ── */
      case 6: return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Domain Name (if you own one)"><input {...inp('domainName')} placeholder="smithroofing.com" /></Field>
            <Field label="Domain Registrar">
              <select {...inp('registrar')} className={inputCls}>
                <option value="">Select...</option>
                {['GoDaddy','Namecheap','Google Domains','Bluehost','Cloudflare','I need one — please help','Not sure'].map(o=><option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Current Website (if any)"><input {...inp('currentSite')} placeholder="https://oldsite.com or none" /></Field>
            <Field label="Google Business Profile URL"><input {...inp('googleBiz')} placeholder="https://g.page/yourbusiness" /></Field>
            <Field label="Facebook Page URL"><input {...inp('facebook')} placeholder="https://facebook.com/yourpage" /></Field>
            <Field label="Instagram URL"><input {...inp('instagram')} placeholder="https://instagram.com/yourhandle" /></Field>
            <Field label="TikTok URL"><input {...inp('tiktok')} placeholder="https://tiktok.com/@yourhandle" /></Field>
            <Field label="YouTube Channel"><input {...inp('youtube')} placeholder="https://youtube.com/c/yourchannel" /></Field>
            <Field label="Yelp / Angi / HomeAdvisor"><input {...inp('reviewSite')} placeholder="https://yelp.com/biz/..." /></Field>
            <Field label="NextDoor Profile"><input {...inp('nextdoor')} placeholder="https://nextdoor.com/..." /></Field>
          </div>
        </div>
      );

      /* ── 7: Media ── */
      case 7: return (
        <div className="space-y-5">
          <Field label="Do you have professional photos of your work?">
            <select {...inp('hasPhotos')} className={inputCls}>
              <option value="">Select...</option>
              <option>Yes — I will email them to info@vcvservices.com</option>
              <option>Yes — uploading below</option>
              <option>I have some but not many</option>
              <option>No — please use stock photos</option>
              <option>I will get photos to you within a week</option>
            </select>
          </Field>

          {/* File picker */}
          <Field label="Upload Files (logo, photos, brand assets)">
            <label className={cn('block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all',
              files.length ? 'border-blue-500/50 bg-blue-600/5' : 'border-white/10 hover:border-blue-500/30')}>
              <Upload className="w-8 h-8 mx-auto text-gray-500 mb-3" />
              <p className="text-gray-400 text-sm">Click to select files</p>
              <p className="text-gray-600 text-xs mt-1">Logo, photos, PDFs, brand guidelines</p>
              <input type="file" multiple className="hidden"
                onChange={e => { if (e.target.files) setFiles(f => [...f, ...Array.from(e.target.files!)]); }} />
              {files.length > 0 && (
                <div className="mt-4 text-left space-y-1">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-blue-400">
                      <CheckCircle2 className="w-3 h-3"/> {f.name}
                    </div>
                  ))}
                </div>
              )}
            </label>
            <p className="text-gray-600 text-xs mt-2">You can also email large files to info@vcvservices.com — subject: &quot;[Your Business] Site Files&quot;</p>
          </Field>

          <Field label="Photo / video notes">
            <textarea {...inp('mediaNotes')} rows={3} placeholder="I have 20 before/after photos, our team photo, and our logo in PNG. Will email them separately..." className={cn(inputCls,'resize-none')}/>
          </Field>
          <Field label="Do you want a video background or embedded video on your homepage?">
            <select {...inp('wantsVideo')} className={inputCls}>
              <option value="">Select...</option>
              <option>Yes — I have a video to provide</option>
              <option>Yes — please use a stock video</option>
              <option>No video needed</option>
            </select>
          </Field>
        </div>
      );

      /* ── 8: SEO ── */
      case 8: return (
        <div className="space-y-4">
          <Field label="Top keywords you want to rank for on Google">
            <textarea {...inp('targetKeywords')} rows={3} placeholder="roofing contractor Lawton OK, roof repair near me, emergency roofer Comanche County..." className={cn(inputCls,'resize-none')}/>
          </Field>
          <Field label="Is your Google Business Profile verified?">
            <select {...inp('gbpStatus')} className={inputCls}>
              <option value="">Select...</option>
              <option>Yes — verified and active</option>
              <option>Yes but not fully optimized</option>
              <option>No — I need help setting it up</option>
              <option>Not sure</option>
            </select>
          </Field>
          <Field label="Do you have Google Analytics / Search Console?">
            <select {...inp('analytics')} className={inputCls}>
              <option value="">Select...</option>
              <option>Yes — I have both</option>
              <option>Yes — Analytics only</option>
              <option>No — please set them up</option>
              <option>Not sure</option>
            </select>
          </Field>
          <Field label="Are you interested in Google Ads?">
            <select {...inp('wantsAds')} className={inputCls}>
              <option value="">Select...</option>
              <option>Yes — interested in future</option>
              <option>Yes — want to start ASAP</option>
              <option>No — just organic SEO for now</option>
            </select>
          </Field>
          <Field label="Monthly ad budget (if running ads)">
            <select {...inp('adBudget')} className={inputCls}>
              <option value="">N/A</option>
              {['Under $500','$500-$1,000','$1,000-$2,500','$2,500-$5,000','$5,000+'].map(o=><option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Any local directories you are already listed on?">
            <input {...inp('directories')} placeholder="Yelp, Angi, HomeAdvisor, BBB, Nextdoor, Houzz..." />
          </Field>
        </div>
      );

      /* ── 9: Testimonials ── */
      case 9: return (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">Customer reviews on your site build trust and improve SEO. Provide up to 5 real testimonials below.</p>
          {[1,2,3,4,5].map(n => (
            <div key={n} className="glass-card p-4 space-y-2">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Testimonial {n}</p>
              <input {...inp(`t${n}Name`)} placeholder="Customer Name (e.g. Mike Johnson)" />
              <textarea {...inp(`t${n}Review`)} rows={2} placeholder="What they said about your work..." className={cn(inputCls,'resize-none mt-2')}/>
            </div>
          ))}
          <Field label="Awards, certifications, or associations to display">
            <textarea {...inp('certifications')} rows={2} placeholder="Licensed & Insured, GAF Certified, BBB A+, 15 Years in Business..." className={cn(inputCls,'resize-none')}/>
          </Field>
          <Field label="Guarantee or warranty you offer">
            <input {...inp('warranty')} placeholder="5-year labor warranty, 25-year manufacturer warranty..." />
          </Field>
        </div>
      );

      /* ── 10: Final ── */
      case 10: return (
        <div className="space-y-4">
          <Field label="Anything else we should know or include?">
            <textarea {...inp('additionalNotes')} rows={5} placeholder="We have a mascot, please use blue and gold only, include our slogan 'Quality You Can Trust'..." className={cn(inputCls,'resize-none')}/>
          </Field>
          <Field label="How did you hear about VCV Web Solutions?">
            <select {...inp('howHeard')} className={inputCls}>
              <option value="">Select...</option>
              {['Google Search','Facebook','Instagram','TikTok','Friend / Referral','Cold call / text','Other'].map(o=><option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Any hard deadlines we should know about?">
            <input {...inp('deadline')} placeholder="Need live before March 1st for spring season..." />
          </Field>

          {/* Summary */}
          <div className="neon-card p-5 mt-4" style={{ borderColor:'rgba(34,197,94,0.3)', background:'rgba(34,197,94,0.05)' }}>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-400"/>
              <p className="text-white font-bold text-sm">You are almost done!</p>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Once you submit, all your answers are saved to our project management system and we will receive an email notification immediately.
              We will reach out within 24 hours to confirm next steps and request any files you mentioned.
            </p>
          </div>
        </div>
      );

      default: return null;
    }
  };

  if (success) return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4 relative overflow-hidden">
      <ParticleCanvas />
      <SectionOrbs variant="green" />
      <GridOverlay gridOp={0.2} dotOp={0.1} />
      <motion.div initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }}
        className="relative z-10 text-center max-w-lg">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ background:'rgba(34,197,94,0.15)', border:'2px solid rgba(34,197,94,0.4)', boxShadow:'0 0 60px rgba(34,197,94,0.3)' }}>
          <CheckCircle2 className="w-12 h-12 text-green-400"/>
        </div>
        <h2 className="font-display text-6xl text-white mb-4">SUBMITTED!</h2>
        <p className="text-gray-300 text-lg mb-3">Your onboarding is complete, {data.fullName?.split(' ')[0] || 'there'}!</p>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          We received all your details and will be in touch within 24 hours to confirm next steps.
          Please email any files (logo, photos) to{' '}
          <a href="mailto:info@vcvservices.com" className="text-blue-400 font-semibold">info@vcvservices.com</a>{' '}
          with subject: &quot;{data.businessName || 'My Business'} — Site Files&quot;
        </p>
        <div className="space-y-2 text-sm">
          <a href="tel:+15809191386" className="glass-card block px-6 py-3 text-white font-semibold hover:border-blue-500/40 transition-all">
            <Phone className="w-4 h-4 inline mr-2 text-blue-400"/>Call us: (580) 919-1386
          </a>
          <a href="mailto:info@vcvservices.com" className="glass-card block px-6 py-3 text-white font-semibold hover:border-blue-500/40 transition-all">
            <Mail className="w-4 h-4 inline mr-2 text-purple-400"/>Email: info@vcvservices.com
          </a>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden">
      <SectionOrbs variant="mixed" />
      <GridOverlay gridOp={0.2} dotOp={0.08} />

      <div className="max-w-3xl mx-auto px-4 py-28 relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="text-center mb-10">
          <p className="text-green-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">Welcome, new client</p>
          <h1 className="font-display text-white tracking-tight leading-[1.02] mb-3"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            Let&apos;s build<br/>
            <span className="gradient-text">your site.</span>
          </h1>
          <p className="text-gray-300 text-base max-w-xl mx-auto leading-relaxed">
            Complete all steps below so we can start building immediately. The more detail you provide, the faster and better we build.
          </p>
        </motion.div>

        {/* Step pills */}
        <div className="flex flex-wrap gap-1.5 justify-center mb-6">
          {STEPS.map((s, i) => (
            <button key={i} onClick={() => i <= step && setStep(i)}
              className={cn('flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all',
                i === step ? 'text-white' : i < step ? 'text-gray-300 bg-white/[0.06]' : 'text-gray-600 bg-white/[0.02] cursor-default')}
              style={ i === step ? { background:`${s.color}25`, border:`1px solid ${s.color}60`, color:s.color } : { border:'1px solid rgba(255,255,255,0.06)' }}>
              {i < step ? <CheckCircle2 className="w-3 h-3 text-green-400"/> : s.icon}
              <span className="hidden sm:inline">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-8">
          <motion.div className="h-full rounded-full" animate={{ width:`${pct}%` }} transition={{ duration:.4 }}
            style={{ background:`linear-gradient(90deg,#3b82f6,${color})` }}/>
        </div>

        {/* Card */}
        <div className="neon-card p-8 md:p-10" style={{ borderColor:`${color}30`, boxShadow:`0 0 60px ${color}10` }}>
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/[0.06]">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background:`${color}20`, border:`1px solid ${color}40`, color }}>
              {STEPS[step].icon}
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Step {step + 1} of {STEPS.length}</p>
              <h2 className="text-white font-bold text-xl">{STEPS[step].title}</h2>
            </div>
            <span className="ml-auto text-gray-500 text-sm font-mono">{pct}%</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step}
              initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
              transition={{ duration:.25 }}>
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/[0.06]">
            <button onClick={() => setStep(s => Math.max(s-1,0))} disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white disabled:opacity-30 hover:bg-white/[0.04] transition-all border border-transparent hover:border-white/[0.06]">
              <ArrowLeft className="w-4 h-4"/> Back
            </button>

            {step < STEPS.length - 1 ? (
              <motion.button onClick={() => setStep(s => s + 1)}
                whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}
                className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-white text-sm"
                style={{ background:`linear-gradient(135deg,${color},${STEPS[Math.min(step+1,STEPS.length-1)].color})`, boxShadow:`0 0 20px ${color}40` }}>
                Next Step <ArrowRight className="w-4 h-4"/>
              </motion.button>
            ) : (
              <motion.button onClick={handleSubmit} disabled={saving}
                whileHover={{ scale: saving ? 1 : 1.03 }} whileTap={{ scale:.97 }}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background:'linear-gradient(135deg,#22c55e,#06b6d4)', boxShadow:'0 0 24px rgba(34,197,94,0.4)' }}>
                {saving ? <><Loader2 className="w-4 h-4 animate-spin"/> Saving...</> : <><CheckCircle2 className="w-4 h-4"/> Submit Onboarding</>}
              </motion.button>
            )}
          </div>
        </div>

        {/* Step counter */}
        <p className="text-center text-gray-600 text-xs mt-5">
          Step {step + 1} of {STEPS.length} &nbsp;·&nbsp; Your progress is saved as you go &nbsp;·&nbsp;
          Questions? <a href="tel:+15809191386" className="text-blue-400 hover:text-blue-300">(580) 919-1386</a>
        </p>
      </div>
    </div>
  );
}
