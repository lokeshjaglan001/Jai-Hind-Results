import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useState } from "react";

export const ThirdPartyScripts = () => {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith("/admin");
  
  // Staggered loading states
  const [loadAnalytics, setLoadAnalytics] = useState(false);
  const [loadAds, setLoadAds] = useState(false);

  useEffect(() => {
    // 1. Load Analytics after 4 seconds (lighter)
    const analyticsTimer = setTimeout(() => {
      setLoadAnalytics(true);
    }, 1000);

    // 2. Load Ads & Heavy Scripts after 7 seconds
    // This prevents the "freeze" that happens when everything loads at 3s
    const adsTimer = setTimeout(() => {
      setLoadAds(true);
    }, 1000);

    return () => {
      clearTimeout(analyticsTimer);
      clearTimeout(adsTimer);
    };
  }, []);

  if (isAdmin) {
    return null;
  }

  return (
    <>
      {loadAnalytics && (
        <>
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-Y96FVJBE7W"
            strategy="afterInteractive"
          ></Script>
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              gtag('config', 'G-Y96FVJBE7W');
              `}
          </Script>
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '2105995533470879');
                fbq('track', 'PageView');
              `}
          </Script>
        </>
      )}

      {loadAds && (
        <>
          <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload"></Script>
          <Script
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8101539968683225"
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        </>
      )}
    </>
  );
};
