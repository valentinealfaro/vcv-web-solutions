'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { Shield, FileText, ChevronDown, ArrowRight, Mail, Phone } from 'lucide-react';
import { SectionOrbs, GridOverlay } from '@/components/PageEffects';

const EFFECTIVE_DATE = 'April 28, 2025';
const COMPANY        = 'VCV Web Solutions (a service of VCV Services)';
const EMAIL          = 'info@vcvservices.com';
const PHONE          = '(580) 919-1386';
const SITE           = 'www.vcvwebsolutions.com';

/* ── Collapsible section ── */
const Section = ({ title, children, accent = '#3b82f6' }: { title: string; children: React.ReactNode; accent?: string }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-6 rounded-2xl overflow-hidden"
      style={{ background:'rgba(255,255,255,0.025)', border:`1px solid ${accent}25` }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
        style={{ borderBottom: open ? `1px solid ${accent}20` : 'none' }}>
        <span className="font-bold text-white text-base">{title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration:.25 }}>
          <ChevronDown className="w-5 h-5" style={{ color: accent }} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }} transition={{ duration:.3, ease:'easeInOut' }}
            className="overflow-hidden">
            <div className="px-6 py-5 text-gray-400 text-sm leading-relaxed space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const P = ({ children }: { children: React.ReactNode }) => <p>{children}</p>;
const Li = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2"><span className="text-blue-400 mt-1 flex-shrink-0">•</span><span>{children}</span></li>
);
const Ul = ({ children }: { children: React.ReactNode }) => <ul className="space-y-1.5 ml-1">{children}</ul>;
const H = ({ children }: { children: React.ReactNode }) => <p className="font-semibold text-gray-200 mt-4 mb-1">{children}</p>;

export default function Terms() {
  const [tab, setTab] = useState<'terms' | 'privacy'>('terms');
  const topRef = useRef<HTMLDivElement>(null);

  const switchTab = (t: 'terms' | 'privacy') => {
    setTab(t);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#030712]">

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-14 overflow-hidden" ref={topRef}>
        <SectionOrbs variant="blue" />
        <GridOverlay gridOp={0.3} dotOp={0.12} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:.7 }}>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">Legal</p>
            <h1 className="font-display text-white tracking-tight leading-[1.02] mb-4"
              style={{ fontSize: 'clamp(2.75rem, 7.5vw, 5.5rem)' }}>
              Terms &amp; <span className="gradient-text">privacy.</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
              Effective {EFFECTIVE_DATE} &nbsp;·&nbsp; {COMPANY}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Tab switcher ── */}
      <div className="sticky top-[72px] z-40 bg-[#030712]/95 backdrop-blur-xl border-b border-white/[0.06] py-3">
        <div className="max-w-4xl mx-auto px-4 flex gap-3">
          <button onClick={() => switchTab('terms')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
              tab === 'terms'
                ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                : 'text-gray-400 hover:text-white glass-card'}`}>
            <FileText className="w-4 h-4"/> Terms of Service
          </button>
          <button onClick={() => switchTab('privacy')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
              tab === 'privacy'
                ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]'
                : 'text-gray-400 hover:text-white glass-card'}`}>
            <Shield className="w-4 h-4"/> Privacy Policy
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <section className="py-12 relative overflow-hidden bg-[#030712]">
        <SectionOrbs variant="mixed" />
        <GridOverlay gridOp={0.18} dotOp={0.08} />
        <div className="max-w-4xl mx-auto px-4 relative z-10">

          <AnimatePresence mode="wait">

            {/* ────────── TERMS OF SERVICE ────────── */}
            {tab === 'terms' && (
              <motion.div key="terms"
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
                transition={{ duration:.35 }}>

                <div className="glass-card p-5 mb-8 flex items-start gap-3"
                  style={{ borderColor:'rgba(59,130,246,0.25)', background:'rgba(59,130,246,0.06)' }}>
                  <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"/>
                  <p className="text-gray-300 text-sm">
                    These Terms of Service govern your use of VCV Web Solutions and the services we provide. By requesting a design preview or purchasing a plan you agree to these terms.
                  </p>
                </div>

                <Section title="1. About VCV Web Solutions" accent="#3b82f6">
                  <P>{COMPANY} provides professional website design, development, SEO setup, hosting, and related digital marketing services to local businesses. We operate at <span className="text-blue-400">{SITE}</span> and can be reached at <span className="text-blue-400">{EMAIL}</span> or <span className="text-blue-400">{PHONE}</span>.</P>
                </Section>

                <Section title="2. Services We Provide" accent="#8b5cf6">
                  <P>Our services include but are not limited to:</P>
                  <Ul>
                    <Li>Custom website design and development tailored to your business and local market</Li>
                    <Li>Design previews built prior to subscription commitment</Li>
                    <Li>Search engine optimization (SEO) setup and ongoing improvements</Li>
                    <Li>Website hosting, maintenance, and monthly content updates</Li>
                    <Li>Google Ads landing page setup and integration readiness</Li>
                    <Li>Google My Business profile optimization (Annual plan)</Li>
                    <Li>Analytics dashboard setup and reporting</Li>
                  </Ul>
                  <H>Design Preview</H>
                  <P>We offer a complimentary custom website preview before you commit to a subscription. This preview is a good-faith demonstration of our capabilities and design approach. We reserve the right to limit preview requests to protect against misuse.</P>
                  <H>Scope &amp; Complexity</H>
                  <P>Published prices apply to standard local business websites (up to 10 pages). Projects requiring e-commerce, booking systems, custom integrations, or advanced functionality may be quoted separately at $1,500 to $5,000+ depending on scope. We will always provide a written quote before beginning such work.</P>
                </Section>

                <Section title="3. Payment Terms" accent="#06b6d4">
                  <H>Subscription Plans</H>
                  <Ul>
                    <Li>Monthly Plan: $97/month + one-time $247 setup fee, no long-term commitment</Li>
                    <Li>Annual Plan: $997/year, billed annually, $247 setup fee waived</Li>
                    <Li>Lifetime Plan: $1,497 one-time, no recurring fees, includes hosting &amp; SSL</Li>
                    <Li>Regular (non-promotional) rates: $197/month or $1,970/year</Li>
                  </Ul>
                  <H>Billing</H>
                  <P>Payments are processed securely through Stripe. By purchasing a plan you authorize recurring charges at the agreed rate on your billing cycle date. All prices are in USD.</P>
                  <H>Refunds &amp; 30-Day Guarantee</H>
                  <P>We stand behind our work. If your website is not generating measurable leads within 30 days of going live, we will perform additional optimization work at no extra charge. Refund requests are evaluated on a case-by-case basis. Refunds are not provided for work already completed and delivered unless there is a material failure to deliver the agreed service.</P>
                  <H>Late Payments</H>
                  <P>Hosting and maintenance services may be suspended after 14 days of non-payment with notice. Services are restored promptly upon payment.</P>
                </Section>

                <Section title="4. Ownership &amp; Intellectual Property" accent="#22c55e">
                  <P>Upon full payment you own your website content, domain name, and all custom assets created specifically for your project. VCV Web Solutions retains no claim over your brand assets, copy, or custom graphics.</P>
                  <H>Platform Code</H>
                  <P>Generic frameworks, plugins, templates, and code libraries used in building your site remain the property of their respective creators under their respective licenses. We do not restrict your ability to migrate your site.</P>
                  <H>Portfolio Use</H>
                  <P>Unless you opt out in writing, we may display your completed website in our portfolio and use anonymized performance metrics in marketing materials.</P>
                </Section>

                <Section title="5. Client Responsibilities" accent="#ec4899">
                  <Ul>
                    <Li>Provide accurate business information, logos, photos, and any content required to build your site</Li>
                    <Li>Respond to preview and revision requests within 14 days to keep the project on schedule</Li>
                    <Li>Ensure you have the legal right to use any content, images, or trademarks you provide to us</Li>
                    <Li>Maintain your domain registration and any third-party accounts (Google, Facebook, etc.)</Li>
                  </Ul>
                </Section>

                <Section title="6. Acceptable Use" accent="#eab308">
                  <P>You agree not to use our services to:</P>
                  <Ul>
                    <Li>Promote illegal products, services, or activities</Li>
                    <Li>Distribute spam, malware, or deceptive content</Li>
                    <Li>Infringe on the intellectual property rights of others</Li>
                    <Li>Misrepresent your identity or business to us or to your website visitors</Li>
                  </Ul>
                  <P>We reserve the right to refuse or terminate service for violations of these terms without refund of fees paid for future periods.</P>
                </Section>

                <Section title="7. Cancellation &amp; Termination" accent="#f97316">
                  <H>You May Cancel Anytime</H>
                  <P>Monthly subscribers may cancel at any time. Your service remains active through the end of the current billing period. No partial-month refunds are provided.</P>
                  <H>Annual Plan Cancellation</H>
                  <P>Annual plans may be cancelled within 30 days of purchase for a prorated refund (minus work already delivered). After 30 days annual plans are non-refundable but remain active through the plan end date.</P>
                  <H>Termination by VCV Web Solutions</H>
                  <P>We may terminate service with 30 days written notice or immediately for violations of these terms, non-payment, or conduct harmful to our staff or other clients.</P>
                  <H>Data After Cancellation</H>
                  <P>Upon cancellation we will provide you with an export of your website files within 30 days upon request. After 60 days post-cancellation we may delete project files.</P>
                </Section>

                <Section title="8. Disclaimers &amp; Limitation of Liability" accent="#ef4444">
                  <P>Our services are provided on an &quot;as-is&quot; basis. While we strive for excellent results, we cannot guarantee specific rankings, lead volumes, or revenue outcomes as these depend on many factors outside our control including market conditions, competition, and your business operations.</P>
                  <P>To the maximum extent permitted by law, VCV Web Solutions shall not be liable for indirect, incidental, special, or consequential damages arising from use of our services. Our total liability for any claim shall not exceed the fees paid by you in the three months preceding the claim.</P>
                </Section>

                <Section title="9. Governing Law" accent="#3b82f6">
                  <P>These terms are governed by the laws of the State of Oklahoma, USA. Any disputes shall be resolved in the courts of Comanche County, Oklahoma, or through binding arbitration by mutual agreement.</P>
                </Section>

                <Section title="10. Changes to These Terms" accent="#8b5cf6">
                  <P>We may update these terms from time to time. We will notify active subscribers via email at least 14 days before material changes take effect. Continued use of our services after that date constitutes acceptance of the updated terms.</P>
                </Section>

              </motion.div>
            )}

            {/* ────────── PRIVACY POLICY ────────── */}
            {tab === 'privacy' && (
              <motion.div key="privacy"
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
                transition={{ duration:.35 }}>

                <div className="glass-card p-5 mb-8 flex items-start gap-3"
                  style={{ borderColor:'rgba(139,92,246,0.25)', background:'rgba(139,92,246,0.06)' }}>
                  <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5"/>
                  <p className="text-gray-300 text-sm">
                    This Privacy Policy explains how VCV Web Solutions collects, uses, and protects your personal information. We are committed to your privacy and will never sell your data.
                  </p>
                </div>

                <Section title="1. Information We Collect" accent="#8b5cf6">
                  <H>Information You Provide</H>
                  <Ul>
                    <Li>Contact details: name, email address, phone number, business name</Li>
                    <Li>Business information: business type, website URL, goals, and any details you share in forms</Li>
                    <Li>Payment information: processed directly by Stripe — we never see or store your full card number</Li>
                    <Li>Communications: emails, texts, and call records when you contact us</Li>
                  </Ul>
                  <H>Information Collected Automatically</H>
                  <Ul>
                    <Li>Usage data: pages visited, time spent, clicks, and navigation patterns via Google Analytics</Li>
                    <Li>Device information: browser type, operating system, screen size, and IP address</Li>
                    <Li>Cookies: session cookies for site functionality and analytics cookies (see Cookies section)</Li>
                  </Ul>
                </Section>

                <Section title="2. How We Use Your Information" accent="#06b6d4">
                  <P>We use your information to:</P>
                  <Ul>
                    <Li>Build and deliver your website design preview and completed website</Li>
                    <Li>Process payments and manage your subscription through Stripe</Li>
                    <Li>Communicate with you about your project status, updates, and support</Li>
                    <Li>Send service-related emails (invoices, project updates, renewal reminders)</Li>
                    <Li>Improve our services based on usage patterns and feedback</Li>
                    <Li>Comply with legal obligations</Li>
                  </Ul>
                  <H>Marketing Communications</H>
                  <P>With your consent we may send you occasional tips, case studies, or promotional offers. You can unsubscribe at any time via the link in any email or by emailing us at {EMAIL}.</P>
                </Section>

                <Section title="3. Data Storage &amp; Security" accent="#22c55e">
                  <H>Where We Store Data</H>
                  <P>Lead and contact form submissions are stored in Google Firebase (Firestore), a secure cloud database hosted on Google Cloud infrastructure with encryption at rest and in transit.</P>
                  <H>Payment Data</H>
                  <P>All payment processing is handled by Stripe, Inc. We store only a Stripe customer ID — no card numbers, CVVs, or bank details are stored on our systems. Stripe is PCI DSS Level 1 certified.</P>
                  <H>Security Measures</H>
                  <Ul>
                    <Li>All data transmitted over HTTPS/TLS encryption</Li>
                    <Li>Firebase security rules restrict data access to authorized personnel only</Li>
                    <Li>We do not retain payment card data</Li>
                    <Li>Access to client data is limited to VCV Web Solutions staff who need it to deliver your service</Li>
                  </Ul>
                  <H>Data Retention</H>
                  <P>We retain your project and account data for up to 3 years after your last interaction or cancellation for accounting and legal purposes. You may request deletion at any time (see Your Rights).</P>
                </Section>

                <Section title="4. Third-Party Services" accent="#ec4899">
                  <P>We use the following third-party services to operate our business:</P>
                  <Ul>
                    <Li><span className="text-gray-200 font-semibold">Google Firebase</span> — database and authentication (Google Privacy Policy applies)</Li>
                    <Li><span className="text-gray-200 font-semibold">Stripe</span> — payment processing (Stripe Privacy Policy applies)</Li>
                    <Li><span className="text-gray-200 font-semibold">Google Analytics</span> — website usage analytics (anonymized, IP anonymization enabled)</Li>
                    <Li><span className="text-gray-200 font-semibold">EmailJS</span> — contact form email delivery</Li>
                    <Li><span className="text-gray-200 font-semibold">Vercel</span> — website hosting and deployment</Li>
                    <Li><span className="text-gray-200 font-semibold">Google Fonts</span> — typography (font files loaded from Google servers)</Li>
                  </Ul>
                  <P>Each of these services has its own privacy policy. We encourage you to review them. We do not sell your data to any of these parties — they are tools we use to operate.</P>
                </Section>

                <Section title="5. Cookies" accent="#eab308">
                  <P>We use cookies to make our website work properly and to understand how visitors use it.</P>
                  <H>Essential Cookies</H>
                  <P>Required for the website to function. These cannot be disabled and do not collect personal data.</P>
                  <H>Analytics Cookies</H>
                  <P>Google Analytics cookies help us understand which pages are popular, how visitors navigate the site, and where we can improve. These use anonymized data and do not identify you personally.</P>
                  <H>Managing Cookies</H>
                  <P>You can disable non-essential cookies in your browser settings at any time. Note that disabling cookies may affect site functionality.</P>
                </Section>

                <Section title="6. Your Rights" accent="#3b82f6">
                  <P>Depending on your location you may have the following rights regarding your personal data:</P>
                  <Ul>
                    <Li><span className="text-gray-200 font-semibold">Access:</span> Request a copy of the personal data we hold about you</Li>
                    <Li><span className="text-gray-200 font-semibold">Correction:</span> Request that we correct inaccurate or incomplete data</Li>
                    <Li><span className="text-gray-200 font-semibold">Deletion:</span> Request that we delete your personal data (subject to legal retention requirements)</Li>
                    <Li><span className="text-gray-200 font-semibold">Opt-out:</span> Unsubscribe from marketing communications at any time</Li>
                    <Li><span className="text-gray-200 font-semibold">Portability:</span> Request your data in a machine-readable format</Li>
                  </Ul>
                  <P>To exercise any of these rights email us at <span className="text-blue-400">{EMAIL}</span> with the subject line &quot;Privacy Request&quot;. We will respond within 30 days.</P>
                </Section>

                <Section title="7. Children's Privacy" accent="#f97316">
                  <P>Our services are intended for business owners and are not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has submitted information to us please contact us immediately and we will delete it.</P>
                </Section>

                <Section title="8. Changes to This Policy" accent="#ef4444">
                  <P>We may update this Privacy Policy periodically. When we make material changes we will update the effective date at the top of this page and notify active subscribers via email. Your continued use of our services constitutes acceptance of the updated policy.</P>
                </Section>

              </motion.div>
            )}

          </AnimatePresence>

          {/* ── Contact block ── */}
          <motion.div
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="mt-10 neon-card p-8 text-center"
            style={{ borderColor:'rgba(37,99,235,0.3)', boxShadow:'0 0 40px rgba(37,99,235,0.08)' }}>
            <h3 className="font-display text-3xl text-white mb-2">QUESTIONS?</h3>
            <p className="text-gray-400 text-sm mb-6">If you have any questions about these terms or how we handle your data, reach out directly.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`mailto:${EMAIL}`}
                className="btn-neon btn-glow text-white px-8 py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 group">
                <Mail className="w-4 h-4"/> {EMAIL}
              </a>
              <a href="tel:+15809191386"
                className="glass-card text-white px-8 py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 hover:border-blue-500/40 transition-all">
                <Phone className="w-4 h-4 text-blue-400"/> {PHONE}
              </a>
            </div>
            <p className="text-gray-600 text-xs mt-5">
              Last updated: {EFFECTIVE_DATE} &nbsp;·&nbsp;
              <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">Back to Home</Link>
            </p>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
