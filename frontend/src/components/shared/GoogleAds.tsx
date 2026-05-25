import { useEffect } from "react";

interface GoogleAdProps {
  slot: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const GoogleAd: React.FC<GoogleAdProps> = ({ slot, className }) => {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      }
    } catch (err) {
      console.error("AdSense error", err);
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className ?? ""}`}
      style={{ display: "block" }}
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default GoogleAd;
