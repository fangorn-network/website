'use client'

import React, { useState } from 'react';
import { Shield, Leaf, Lock, CheckCircle } from 'lucide-react';

export default function FangornLanding() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = () => {
    if (email && email.includes('@')) {
      // Here you would typically send to your backend
      console.log('Subscribed:', email);
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Logo/Icon */}
        <div className="mb-8 flex items-center gap-3">
          <div className="relative">
            <Leaf className="w-16 h-16 text-emerald-300" strokeWidth={1.5} />
            <Shield className="w-8 h-8 text-teal-200 absolute -bottom-1 -right-1" strokeWidth={2} />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            FANGORN
          </h1>
          
          <p className="text-2xl md:text-3xl text-emerald-100 mb-8 font-light">
            Coming Soon
          </p>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 mb-8 border border-white/20 shadow-2xl">
            <p className="text-lg md:text-xl text-white mb-6 leading-relaxed">
              We are building a <span className="font-semibold text-emerald-200">secure, decentralized network</span> that 
              grows naturally with your needs. Like the ancient forest it's named after, our network provides 
              <span className="font-semibold text-teal-200"> robust protection</span>, 
              <span className="font-semibold text-green-200"> organic scalability</span>, and 
              <span className="font-semibold text-emerald-200"> deep-rooted trust</span>.
            </p>

            {/* Feature highlights */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center text-center">
                <Lock className="w-10 h-10 text-emerald-300 mb-3" />
                <h3 className="text-white font-semibold mb-2">Secure</h3>
                <p className="text-emerald-100 text-sm">End-to-end encryption and privacy-first architecture</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Leaf className="w-10 h-10 text-green-300 mb-3" />
                <h3 className="text-white font-semibold mb-2">Natural</h3>
                <p className="text-emerald-100 text-sm">Organic growth and seamless integration</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="w-10 h-10 text-teal-300 mb-3" />
                <h3 className="text-white font-semibold mb-2">Trustworthy</h3>
                <p className="text-emerald-100 text-sm">Transparent operations and proven reliability</p>
              </div>
            </div>

            {/* Subscription form */}
            <div className="max-w-md mx-auto">
              <p className="text-white mb-4 font-medium">
                Be the first to know when we launch
              </p>
              
              {!subscribed ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-3 rounded-lg bg-white/90 backdrop-blur text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all"
                  />
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Subscribe
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-emerald-200 bg-emerald-900/30 py-3 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Thanks for subscribing!</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-emerald-200 text-sm">
            Growing strong roots for a connected future
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-emerald-300/60 text-sm">
          © 2024 Fangorn Network. All rights reserved.
        </p>
      </div>
    </div>
  );
}