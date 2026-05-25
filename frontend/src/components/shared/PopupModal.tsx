import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { X } from 'lucide-react';

interface PopupModalProps {
  // Image source for the popup
  imageSrc?: string;
  // Alt text for the image
  imageAlt?: string;
  // Delay in milliseconds before showing the popup (default: 5000ms = 5 seconds)
  delay?: number;
  // Optional link to navigate when clicking the image
  linkUrl?: string;
}

const PopupModal = ({
  imageSrc, // Default image path - replace with your actual image
  imageAlt = 'Promotional Banner',
  delay = 5000,
  linkUrl,
}: PopupModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Don't show popup on admin pages
    if (router.pathname.startsWith('/admin') || router.pathname.startsWith('/dashboard') || router.pathname.startsWith('/mock-tests')) {
      setIsOpen(false);
      return;
    }

    // Reset and show popup after delay on every route change
    setIsOpen(false);
    
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [router.asPath, router.pathname, delay]); // Re-run when route changes

  const handleImageClick = () => {
    if (linkUrl) {
      window.open(linkUrl, '_blank');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="sm:max-w-md md:max-w-lg p-0 overflow-hidden bg-transparent border-none"
      >
        <DialogTrigger className='flex justify-end border-0 outline-none'>
          <X className='w-5 h-5 text-black bg-white rounded-lg' />
        </DialogTrigger>
        <div 
          className={`relative w-full ${linkUrl ? 'cursor-pointer' : ''}`}
          onClick={linkUrl ? handleImageClick : undefined}
        >
          <img
            src={imageSrc ?? "/popup.png"}
            alt={imageAlt}
            width={600}
            height={400}
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PopupModal;
