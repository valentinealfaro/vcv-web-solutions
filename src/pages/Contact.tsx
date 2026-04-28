'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, Mail, Phone, Globe, ArrowRight, Loader2, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import Link from 'next/link';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'leads'), {
        ...data,
        createdAt: serverTimestamp(),
        status: 'new'
      });
      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error("Error submitting lead:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: <Mail className="w-6 h-6 text-blue-500" />, title: "Email Us", value: "info@vcvservices.com" },
    { icon: <Phone className="w-6 h-6 text-blue-500" />, title: "Call Us", value: <a href="tel:+15809191386" className="hover:text-blue-500 transition-colors">+1 (580) 919-1386</a> },
    { icon: <Globe className="w-6 h-6 text-blue-500" />, title: "Global Services", value: "Available Worldwide" },
    { icon: <MapPin className="w-6 h-6 text-blue-500" />, title: "Our Location", value: "Digital-First Agency" }
  ];

  return (
    <div className="bg-black pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
          >
            Get In <span className="text-blue-500">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Ready to scale your business? We're here to help you grow.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gray-950 border border-white/5 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>
              <div className="space-y-8">
                {contactInfo.map((info, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-600/10 rounded-xl">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">{info.title}</h4>
                      <p className="text-white font-medium">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-600 rounded-3xl p-8 text-center">
              <h4 className="text-white font-bold text-xl mb-4">Request Your Free Demo Website</h4>
              <p className="text-blue-100 text-sm mb-8">
                See exactly what we can build for your business before you commit.
              </p>
              <Link
                to="/free-demo"
                className="inline-block w-full bg-white text-blue-600 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-xl"
              >
                Request Free Demo
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl"
            >
              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="text-green-500 w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Message Sent!</h3>
                  <p className="text-gray-400 mb-8">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white mb-8">Send Us a Message</h3>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Full Name</label>
                        <input
                          {...register('name', { required: true })}
                          className={cn(
                            "w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all",
                            errors.name && "border-red-500"
                          )}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Email Address</label>
                        <input
                          {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                          className={cn(
                            "w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all",
                            errors.email && "border-red-500"
                          )}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">Business Name (Optional)</label>
                      <input
                        {...register('businessName')}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all"
                        placeholder="Acme Corp"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">Message</label>
                      <textarea
                        {...register('message', { required: true })}
                        rows={6}
                        className={cn(
                          "w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all resize-none",
                          errors.message && "border-red-500"
                        )}
                        placeholder="Tell us about your project and goals..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center space-x-3 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          <span>Send Message</span>
                          <ArrowRight className="w-6 h-6" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
