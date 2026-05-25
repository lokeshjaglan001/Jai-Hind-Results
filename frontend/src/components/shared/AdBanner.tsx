interface AdBannerProps {
  text: string;
  className?: string;
}

export default function AdBanner({ text, className = 'h-24' }: AdBannerProps) {
  return (
    <div className={`flex items-center justify-center bg-gray-200 text-gray-500 rounded-md ${className}`}>
      {text}
    </div>
  );
}
