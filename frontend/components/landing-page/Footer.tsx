'use client';

import React from 'react';
import footerData from '@/public/data/footerdata.json';

import { CiLinkedin } from "react-icons/ci";
import { CiGlobe } from "react-icons/ci";

const socialIcons: Record<string, React.ReactNode> = {
  instagram: (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  linkedin: (
    <CiLinkedin size={25} />
  ),
  website: (
    <CiGlobe size={25} />
  ),
  twitter: (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
};

export default function Footer() {
  return (
    <footer className="w-full px-4 sm:px-6 lg:px-8 pb-12" data-purpose="main-footer">
      <div className="max-w-7xl mx-auto bg-[#0D0E12] text-white rounded-[2rem] px-8 py-12 md:px-16 md:py-16 lg:px-20 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative background gradient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 relative z-10">
          {/* Brand/Description Column */}
          <div className="md:col-span-6 flex flex-col space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center">
                {footerData.brand.name}<span className="text-xs font-normal align-super ml-0.5">™</span>
              </h2>
            </div>

            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              {footerData.brand.description}
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              {footerData.socials.map((social) => {
                const icon = socialIcons[social.platform];
                if (!icon) return null;
                return (
                  <a
                    target='_blank'
                    key={social.platform}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-white hover:bg-neutral-200 text-black flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-md"
                    aria-label={social.label}
                  >
                    {icon}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Column */}
          <div className="md:col-span-3 flex flex-col space-y-4">
            <h3 className="text-white font-medium text-base">{footerData.extraLinksTitle}</h3>
            <ul className="flex flex-col space-y-3">
              {footerData.extraLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-neutral-400 hover:text-white text-sm transition-colors duration-200 block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3 flex flex-col space-y-4">
            <h3 className="text-white font-medium text-base">{footerData.contactTitle}</h3>
            <div className="flex flex-col space-y-3 text-neutral-400 text-sm leading-relaxed">
              <div>
                {footerData.contact.address.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
              <div>
                <a
                  href={`mailto:${footerData.contact.email}`}
                  target="_blank"
                  className="hover:text-white transition-colors duration-200"
                >
                  {footerData.contact.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

