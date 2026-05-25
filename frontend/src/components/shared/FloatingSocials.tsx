import { Youtube, Instagram, Phone } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function FloatingSocials() {
  const router = useRouter();
  
  // Hide on specific pages
  const shouldHide = 
    router.pathname.startsWith('/dashboard') || 
    router.pathname.startsWith('/learn/courses') ||
    router.pathname.startsWith('/offline-forms/');
  
  if (shouldHide) {
    return null;
  }

  return (
    <div className="fixed bottom-0 sm:top-[45%] left-1/2 -translate-x-1/2 sm:right-0 z-100">
      <div className="bg-gradient-to-r sm:bg-gradient-to-b from-pink-600 to-violet-500 p-2 rounded-t-2xl sm:rounded-l-2xl shadow-lg ">
        <div className="flex flex-row sm:flex-col items-center gap-4 text-white px-3 sm:py-3">
          <a
            href="#"
            aria-label="YouTube"
            className='hover:scale-105'
          >
            <Youtube size={25} />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className='hover:scale-105'
          >
            <Instagram size={21} />
          </a>
          <a
            href="#"
            aria-label="Contact"
            className='hover:scale-105'
          >
            <Image src='/wp-icon.png' width={23} height={24} alt='wp' />
          </a>
        </div>
      </div>
    </div>
  );
}
