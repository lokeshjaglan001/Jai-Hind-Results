import { Youtube, Instagram, Facebook, Linkedin, Dribbble } from 'lucide-react';
import Image from 'next/image';

// Link data based on the image
const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
];

const supportLinks = [
    { name: 'FAQ', href: '/faq' },
    { name: 'Support', href: '/contact' },
];

const legalLinks = [
    { name: 'Terms & Conditions', href: '/terms-and-conditions' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
];

// Social icons based on the image
const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/haryana_jobalertas/' },
    { name: 'Youtube', icon: Youtube, href: 'https://www.youtube.com/@AToZJob-y7r' },
];


export default function Footer() {
  return (
    // Kept your original white bg, rounding, and shadow
    <footer className="bg-[#1A1A1C] text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 shadow-md">
      <div className="max-w-6xl mx-auto">
        {/* New 4-column layout based on the image */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Column 1: Brand & Socials (Wider) */}
          <div className="md:col-span-5 lg:col-span-6">
            {/* Kept your brand logo and name */}
            <div className="flex items-center gap-3 mb-4">
                <img src="/logo.jpg" alt="Logo" height={40} width={40} className="w-10 h-10 rounded-full" />
                <h2 className="text-2xl font-bold text-white">Haryana Job Alert</h2>
            </div>
            {/* Added description from image */}
            <p className="text-gray-400 text-xs max-w-xs">
              Get in touch for daily news, current affairs, and for mock tests.
            </p>
            {/* Added social links from image */}
            <div className="flex items-center mt-6">
                {socialLinks.map((social) => (
                    <a 
                        key={social.name} 
                        href={social.href} 
                        className="text-white transition-colors border-r-1 px-4"
                        aria-label={social.name}
                    >
                        <social.icon className="w-3 h-3" />
                    </a>
                ))}
            </div>
          </div>

          {/* Column 2: Company Links */}
          <div className="md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((page) => (
                <li key={page.name}>
                  <a
                    href={page.href}
                    className="text-gray-300 text-xs hover:text-white transition-colors"
                  >
                    {page.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support Links */}
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              {supportLinks.map((page) => (
                <li key={page.name}>
                  <a
                    href={page.href}
                    className="text-gray-300 text-xs hover:text-white transition-colors"
                  >
                    {page.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal Links */}
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Legal Policies
            </h3>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((page) => (
                <li key={page.name}>
                  <a
                    href={page.href}
                    className="text-gray-300 text-xs hover:text-white transition-colors"
                  >
                    {page.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Layout from image, content from your original code */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright text styled like image, but using your brand */}
            <p className="text-xs text-white text-center sm:text-left">
              Copyright @Haryana Job Alert – All Rights Reserved © 2025
            </p>
            {/* Kept your developer credit on the right */}
            {/* <div className="flex-shrink-0">
                <a href="https://softricity.in" className="inline-flex items-center gap-2 text-sm font-bold text-white">
                   <Image src="/softrcity.png" alt="Softricity Logo" className="w-36 h-10 rounded object-cover" width={1920} height={1080} />
                </a>
            </div> */}
        </div>
      </div>
    </footer>
  );
}