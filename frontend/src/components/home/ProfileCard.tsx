import { ArrowRight, Instagram, Star } from 'lucide-react';
import Image from 'next/image';
import FancyContainer from '../about/FancyContainer';

// --- TYPE DEFINITION ---
interface ProfileCardProps {
  name: string;
  title: string;
  description: string;
  profileImageUrl: string;
  logoUrl: string;
  instagramUrl: string;
  bgColor: string;
  nameColor: string;
}

// --- MOCK DATA ---
const foundersData: ProfileCardProps[] = [
  {
    name: 'Mr. Aditya Jaglan',
    title: 'Founder of Haryana Job Alert',
    description: "I started this platform because at my time, I didn't have the right knowledge and guideance about jobs and career. Now, You can use this platform to get your Dream JOB",
    profileImageUrl: '/aj.png',
    logoUrl: '/logo.jpg',
    instagramUrl: '#',
    bgColor: 'bg-gradient-to-br from-emerald-500 to-green-700',
    nameColor: 'text-yellow-300',
  },
  {
    name: 'Mr. Jaihind Sir',
    title: 'Founder of Value Plus Campus, Jind Haryana',
    description: "India's Premier Online Government Job Coaching Platform! We've been helping Students prepare for Government Jobs for 12 years. We offer both Online and Offline coaching.",
    profileImageUrl: '/js.png',
    logoUrl: '/logo.jpg',
    instagramUrl: '#',
    bgColor: 'bg-gradient-to-br from-red-500 to-rose-700',
    nameColor: 'text-white',
  },
];

// --- REUSABLE PROFILE CARD COMPONENT ---
const ProfileCard = ({ name, title, description, profileImageUrl, logoUrl, instagramUrl, bgColor, nameColor }: ProfileCardProps) => {
  return (
    <div className={`relative ${bgColor} rounded-3xl w-full max-w-5xl mx-auto text-white`}>
      <div className="flex flex-col md:flex-row">
        {/* --- Text & Actions Content --- */}
        <div className="p-8 md:p-12 md:w-2/3">
          <a href={instagramUrl} className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-20">
              <Instagram size={20} />
          </a>
          <div className="max-w-md">
              <h2 className={`text-3xl md:text-4xl font-extrabold ${nameColor}`}>{name}</h2>
              <p className="font-semibold mt-1 mb-4">{title}</p>
              <p className="text-lg font-medium leading-relaxed">{description}</p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#" className="w-12 h-12 flex-shrink-0 rounded-full bg-white shadow-md flex items-center justify-center">
                  <Image src={logoUrl} alt="Logo" width={40} height={40} className="rounded-full" unoptimized />
              </a>
              <a href="#" className="w-12 h-12 flex-shrink-0 rounded-full bg-gray-900 shadow-md flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <ArrowRight size={24} />
              </a>
              <a href="#" className="px-5 py-3 rounded-full bg-white text-gray-800 font-semibold inline-flex items-center gap-2 shadow-md hover:bg-gray-200 transition-colors">
                  <span>Get in touch</span>
                  <ArrowRight size={16} />
              </a>
              <div className="flex items-center ">
                  <div className="flex -space-x-3">
                      <Image src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1064&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="User 1" width={32} height={32} className="rounded-full border-2 border-white/50 object-cover" />
                      <Image src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1064&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="User 2" width={32} height={32} className="rounded-full border-2 border-white/50 object-cover" />
                      <Image src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1064&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="User 3" width={32} height={32} className="rounded-full border-2 border-white/50 object-cover" />
                      <Image src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1064&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="User 4" width={32} height={32} className="rounded-full border-2 border-white/50 object-cover" />
                  </div>
                  <div className="ml-4 text-center">
                      <div className="flex text-yellow-300">
                          <Star size={16} fill="currentColor" />
                          <Star size={16} fill="currentColor" />
                          <Star size={16} fill="currentColor" />
                          <Star size={16} fill="currentColor" />
                          <Star size={16} fill="currentColor" />
                      </div>
                      <p className="text-xs font-medium">Join our community</p>
                  </div>
              </div>
          </div>
        </div>

        {/* --- Image Container --- */}
        <div className="relative md:w-1/3 flex items-end justify-center">
            <div className="md:absolute md:bottom-0 md:right-0 md:w-[320px] w-56">
                <Image 
                    src={profileImageUrl} 
                    alt={name} 
                    width={320}
                    height={480}
                    className="w-full h-auto"
                    priority
                />
            </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN EXPORTED SECTION ---
export default function FoundersSection() {
  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-12">
        {foundersData.map((founder) => (
          <ProfileCard key={founder.name} {...founder} />
        ))}
      </div>
    </section>
  );
}

